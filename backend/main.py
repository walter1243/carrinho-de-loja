import os
from datetime import datetime, timezone
from typing import Optional
from urllib.parse import urlencode

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, Field

load_dotenv()

MP_ACCESS_TOKEN = os.getenv("MP_ACCESS_TOKEN")
MP_PUBLIC_KEY = os.getenv("MP_PUBLIC_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://127.0.0.1:5500/cliente.html")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://127.0.0.1:8000/api/auth/google/callback")

AUTH_ALLOW_QUICK_FALLBACK = os.getenv("AUTH_ALLOW_QUICK_FALLBACK", "true").lower() == "true"

app = FastAPI(title="Loja Minimal Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class CardTokenRequest(BaseModel):
    card_number: str
    cardholder_name: str
    expiration: str = Field(..., description="MM/YY")
    security_code: str


class PixPaymentRequest(BaseModel):
    amount: float
    email: str
    name: str
    doc: str


class CardPaymentRequest(BaseModel):
    token: str
    amount: float
    email: str
    name: str
    doc: str
    payment_method_id: Optional[str] = "visa"


class SocialAuthRequest(BaseModel):
    source: Optional[str] = "profile_modal"
    access_token: Optional[str] = None
    id_token: Optional[str] = None
    code: Optional[str] = None


class LogoutRequest(BaseModel):
    customerId: Optional[str] = None


def _quick_social_user(provider: str):
    stamp = int(datetime.now(timezone.utc).timestamp())
    return {
        "id": f"{provider}_{stamp}",
        "name": f"Cliente {provider.capitalize()}",
        "email": f"{provider}_{stamp}@social.local",
        "picture": None,
        "provider": provider,
    }


def _build_frontend_redirect(frontend_redirect: Optional[str], params: dict):
    redirect_base = frontend_redirect or FRONTEND_URL
    query = urlencode(params)
    separator = "&" if "?" in redirect_base else "?"
    return f"{redirect_base}{separator}{query}"


def _oauth_provider_config(provider: str):
    if provider == "google":
        return bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET), [
            key for key, value in {
                "GOOGLE_CLIENT_ID": GOOGLE_CLIENT_ID,
                "GOOGLE_CLIENT_SECRET": GOOGLE_CLIENT_SECRET,
            }.items() if not value
        ]
    return False, ["provider_desconhecido"]


def _ensure_provider_ready_or_fallback(provider: str):
    configured, missing = _oauth_provider_config(provider)
    if configured:
        return "oauth"
    if AUTH_ALLOW_QUICK_FALLBACK:
        return "quick"
    raise HTTPException(
        status_code=503,
        detail={
            "message": f"OAuth {provider} não configurado.",
            "missing_env": missing,
        },
    )


def _redirect_success(provider: str, user: dict, frontend_redirect: Optional[str], auth_mode: str):
    return RedirectResponse(
        _build_frontend_redirect(
            frontend_redirect,
            {
                "social_login": "success",
                "provider": provider,
                "external_id": user.get("id") or "",
                "name": user.get("name") or "",
                "email": user.get("email") or "",
                "picture": user.get("picture") or "",
                "auth_mode": auth_mode,
            },
        )
    )


def _redirect_error(provider: str, frontend_redirect: Optional[str], message: str):
    return RedirectResponse(
        _build_frontend_redirect(
            frontend_redirect,
            {
                "social_login": "error",
                "provider": provider,
                "social_error": message,
            },
        )
    )


def _google_user_from_token(payload: SocialAuthRequest):
    token = payload.id_token or payload.access_token
    if not token:
        return None

    response = requests.get(
        "https://oauth2.googleapis.com/tokeninfo",
        params={"id_token": token} if payload.id_token else {"access_token": token},
        timeout=20,
    )
    if response.status_code >= 400:
        raise HTTPException(status_code=400, detail="Token Google inválido.")

    data = response.json()
    return {
        "id": data.get("sub") or data.get("user_id"),
        "name": data.get("name") or "Cliente Google",
        "email": data.get("email"),
        "picture": data.get("picture"),
        "provider": "google",
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/auth/providers/status")
def auth_providers_status():
    google_ok, google_missing = _oauth_provider_config("google")

    providers = {
        "google": {
            "oauth_configured": google_ok,
            "missing_env": google_missing,
            "mode": "oauth" if google_ok else ("quick" if AUTH_ALLOW_QUICK_FALLBACK else "disabled"),
        },
    }

    oauth_ready = google_ok
    return {
        "ok": True,
        "oauth_ready": oauth_ready,
        "quick_fallback_enabled": AUTH_ALLOW_QUICK_FALLBACK,
        "providers": providers,
        "recommendation": "Configurar credenciais Google e definir AUTH_ALLOW_QUICK_FALLBACK=false para produção"
        if not oauth_ready or AUTH_ALLOW_QUICK_FALLBACK
        else "Configuração pronta para produção",
    }


@app.post("/api/card_token")
def create_card_token(payload: CardTokenRequest):
    if not MP_PUBLIC_KEY:
        raise HTTPException(status_code=500, detail="MP_PUBLIC_KEY nao configurada.")

    try:
        exp_month, exp_year = payload.expiration.split("/")
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Formato de validade invalido. Use MM/YY.") from exc

    body = {
        "card_number": payload.card_number,
        "expiration_month": int(exp_month),
        "expiration_year": int(f"20{exp_year}"),
        "security_code": payload.security_code,
        "cardholder": {"name": payload.cardholder_name},
    }

    response = requests.post(
        f"https://api.mercadopago.com/v1/card_tokens?public_key={MP_PUBLIC_KEY}",
        json=body,
        timeout=30,
    )

    if response.status_code >= 400:
        raise HTTPException(status_code=400, detail=response.json())

    return response.json()


@app.post("/api/payments/pix")
def create_pix_payment(payload: PixPaymentRequest):
    if not MP_ACCESS_TOKEN:
        raise HTTPException(status_code=500, detail="MP_ACCESS_TOKEN nao configurada.")

    body = {
        "transaction_amount": payload.amount,
        "payment_method_id": "pix",
        "payer": {
            "email": payload.email,
            "first_name": payload.name,
            "identification": {
                "type": "CPF",
                "number": payload.doc,
            },
        },
    }

    response = requests.post(
        "https://api.mercadopago.com/v1/payments",
        json=body,
        headers={"Authorization": f"Bearer {MP_ACCESS_TOKEN}"},
        timeout=30,
    )

    if response.status_code >= 400:
        raise HTTPException(status_code=400, detail=response.json())

    data = response.json()
    qr_code = data.get("point_of_interaction", {}).get("transaction_data", {}).get("qr_code")
    qr_code_base64 = data.get("point_of_interaction", {}).get("transaction_data", {}).get("qr_code_base64")

    return {
        "id": data.get("id"),
        "status": data.get("status"),
        "qr_code": qr_code,
        "qr_code_base64": qr_code_base64,
    }


@app.post("/api/payments/card")
def create_card_payment(payload: CardPaymentRequest):
    if not MP_ACCESS_TOKEN:
        raise HTTPException(status_code=500, detail="MP_ACCESS_TOKEN nao configurada.")

    body = {
        "transaction_amount": payload.amount,
        "token": payload.token,
        "description": "Compra Loja Minimal",
        "installments": 1,
        "payment_method_id": payload.payment_method_id,
        "payer": {
            "email": payload.email,
            "first_name": payload.name,
            "identification": {
                "type": "CPF",
                "number": payload.doc,
            },
        },
    }

    response = requests.post(
        "https://api.mercadopago.com/v1/payments",
        json=body,
        headers={"Authorization": f"Bearer {MP_ACCESS_TOKEN}"},
        timeout=30,
    )

    if response.status_code >= 400:
        raise HTTPException(status_code=400, detail=response.json())

    data = response.json()
    return {
        "id": data.get("id"),
        "status": data.get("status"),
    }


@app.post("/api/auth/google")
def auth_google(payload: SocialAuthRequest):
    mode = _ensure_provider_ready_or_fallback("google")
    user = _google_user_from_token(payload)
    if not user:
        if mode == "quick":
            user = _quick_social_user("google")
        else:
            raise HTTPException(status_code=400, detail="Token Google obrigatório para OAuth.")

    return {
        "ok": True,
        "provider": "google",
        "source": payload.source,
        "user": user,
    }


@app.get("/api/auth/google/start")
def auth_google_start(frontend_redirect: Optional[str] = None):
    mode = _ensure_provider_ready_or_fallback("google")
    if mode == "quick":
        user = _quick_social_user("google")
        return _redirect_success("google", user, frontend_redirect, "quick")

    auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
    query = urlencode(
        {
            "client_id": GOOGLE_CLIENT_ID,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "consent",
            "state": frontend_redirect or FRONTEND_URL,
        }
    )
    return RedirectResponse(f"{auth_url}?{query}")


@app.get("/api/auth/google/callback")
def auth_google_callback(code: Optional[str] = None, state: Optional[str] = None, error: Optional[str] = None):
    frontend_redirect = state or FRONTEND_URL

    if error:
        return _redirect_error("google", frontend_redirect, error)
    if not code:
        return _redirect_error("google", frontend_redirect, "Código não recebido")

    try:
        token_response = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
            timeout=20,
        )
        if token_response.status_code >= 400:
            return _redirect_error("google", frontend_redirect, "Falha ao trocar token")

        access_token = token_response.json().get("access_token")
        user_response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=20,
        )
        if user_response.status_code >= 400:
            return _redirect_error("google", frontend_redirect, "Falha ao obter perfil")

        data = user_response.json()
        user = {
            "id": data.get("sub"),
            "name": data.get("name") or "Cliente Google",
            "email": data.get("email"),
            "picture": data.get("picture"),
        }
        return _redirect_success("google", user, frontend_redirect, "oauth")
    except Exception:
        return _redirect_error("google", frontend_redirect, "Erro interno no OAuth Google")


@app.post("/api/auth/logout")
def auth_logout(payload: LogoutRequest):
    return {
        "ok": True,
        "message": "Logout registrado.",
        "customerId": payload.customerId,
        "at": datetime.now(timezone.utc).isoformat(),
    }
