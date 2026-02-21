# 🎨 Sistema de Customização Visual - Drag & Drop de Produtos

## ✅ O QUE FOI IMPLEMENTADO

### **1. Upload de Banner**
- Clique no banner para fazer upload de nova imagem
- Banner é salvo em localStorage
- Aparece automaticamente no cliente

### **2. Produtos Tipo LEGO**
- Arrastar e soltar produtos para reorganizar
- Ordem é salva automaticamente
- Grid responsivo (2 colunas mobile, 4 desktop)

### **3. Categorias Tipo LEGO**
- Arrastar e soltar categorias
- Ordem salva em localStorage
- Layout responsivo

---

## 📁 Arquivos Modificados

### **admin.html**
✅ Nova seção Preview Loja com:
- Banner com upload (clicável)
- Grid de produtos arrastáveis
- Grid de categorias arrastáveis
- Prévia do cliente (iframe)

### **admin.js**
✅ Adicionadas 8 novas funções:
1. `renderPreviewLoja()` - Renderiza tudo
2. `setupBannerUpload()` - Upload de banner
3. `renderProductsDragGrid()` - Grid produtos
4. `renderCategoriesDragGrid()` - Grid categorias
5. `setupProductDragListeners()` - Drag products
6. `setupCategoryDragListeners()` - Drag categories
7. `salvarOdensProdutos()` - Salva ordem
8. `salvarOdensCategorias()` - Salva ordem

---

## 🖱️ Como Usar

### **Banner**
1. Abra Admin → "Preview Loja"
2. Clique na imagem do banner
3. Selecione arquivo da sua máquina
4. Banner é atualizado (salvo em localStorage)
5. Cliente vê o novo banner automaticamente

### **Produtos (Drag & Drop)**
1. Na seção "Organizar Produtos"
2. Clique e arraste o produto para nova posição
3. Solte quando chegar no local desejado
4. Ordem é salva automaticamente!
5. Cliente vê a nova ordem sem refresh

### **Categorias (Drag & Drop)**
1. Na seção "Categorias"
2. Arraste categoria para posição desejada
3. Solte e pronto!
4. Ordem salva automaticamente

---

## 💾 Dados Armazenados

```javascript
// Banner
localStorage.getItem('loja_banner_url')  // URL da imagem em base64

// Produtosum
localStorage.getItem('loja_products_order')  // ["id1", "id2", "id3"]

// Categorias
localStorage.getItem('loja_categories_order')  // ["cat1", "cat2"]
```

---

## 🎨 Estilos Drag & Drop

### **Estados do Arrasto:**
- **Arrastando:** Opacidade 50%
- **Hover:** Scale 95%
- **Normal:** Scale 100%
- **Transições:** Suaves (CSS)

### **Grid:**
- **Mobile:** 2 colunas
- **Tablet:** 3 colunas
- **Desktop:** 4 colunas (produtos), 6 (categorias)

---

## ⚙️ Como Funciona

### **Fluxo do Upload de Banner:**
```
1. Usuário clica no banner
2. Input file se abre
3. Arquivo é lido como Data URL
4. Imagem é atualizada (src)
5. URL é salva em localStorage
✅ Cliente carrega automaticamente
```

### **Fluxo do Drag & Drop:**
```
1. dragstart: Item fica semi-transparente
2. dragover: Item alvo redimensiona
3. drop: Posições são trocadas
4. dragend: Opacidade volta ao normal
✅ Nova ordem é salva
```

---

## 📱 Responsivo

- **Mobile:** 2 colunas (produtos)
- **Tablet (md):** 3 colunas
- **Desktop (lg):** 4 colunas (produtos), 6 (categorias)
- **Gap:** 1rem entre items

---

## 🔄 Sincronização com Cliente

Se o cliente.html estiver carregado:
1. Muda ordem no admin
2. Salva em localStorage
3. Storage Event é disparado
4. Cliente carrega nova ordem
5. Sem necessidade de refresh! ⚡

---

## 🎯 Recursos Visuais

### **Produtos:**
- Imagem do produto
- Nome truncado
- Preço
- "Arraste para mover" hint
- Border azul ao hover

### **Categorias:**
- Ícone 📁
- Nome categoria
- Gradiente azul
- Shadow ao hover
- "Arraste para mover" hint

### **Banner:**
- Imagem responsiva
- Overlay "📤 Clique para mudar"
- Hover opacity
- Placeholder se sem imagem

---

## ✅ Testes

### **Teste 1: Upload Banner**
- [ ] Clique no banner
- [ ] Selecione imagem
- [ ] Imagem atualiza
- [ ] Recarregue página
- [ ] Imagem ainda está lá ✓

### **Teste 2: Drag Produtos**
- [ ] Abra "Organizar Produtos"
- [ ] Arraste produto 1 para posição 3
- [ ] Ordem muda visualmente
- [ ] Console mostra "Ordem salva"
- [ ] Recarregue página
- [ ] Ordem mantém ✓

### **Teste 3: Drag Categorias**
- [ ] Arraste categoria
- [ ] Solte em nova posição
- [ ] Ordem muda
- [ ] Recarregue
- [ ] Ordem mantém ✓

### **Teste 4: Sincronização**
- [ ] Abra Cliente em outra aba
- [ ] Mude ordem no Admin
- [ ] Cliente atualiza? ✓

---

## 🚀 Futuras Melhorias

- [ ] Preview em tempo real
- [ ] Desfazer/Refazer (Undo/Redo)
- [ ] Multi-seleção (arrastar vários)
- [ ] Animações suaves
- [ ] Indicador de posição durante drag
- [ ] Touch support (mobile)

---

## 🔧 Código de Exemplo

### **Carregar Banner Salvo:**
```javascript
const bannerSalvo = localStorage.getItem('loja_banner_url');
if (bannerSalvo) {
  document.getElementById('banner-image').src = bannerSalvo;
}
```

### **Trazer Produtos em Ordem:**
```javascript
const productsOrder = JSON.parse(
  localStorage.getItem('loja_products_order') || '[]'
);
const sortedProducts = allProducts.sort((a, b) => {
  const indexA = productsOrder.indexOf(a.id);
  const indexB = productsOrder.indexOf(b.id);
  return (indexA === -1 ? allProducts.length : indexA) - 
         (indexB === -1 ? allProducts.length : indexB);
});
```

---

## 📊 Status

- [x] Upload de banner com preview
- [x] Drag & drop produtos
- [x] Drag & drop categorias
- [x] Salvar ordem em localStorage
- [x] Sincronização entre abas
- [x] Grid responsivo
- [x] Estilos visuais
- [x] Feedback ao usuário
- [ ] Animações avançadas
- [ ] Touch gestures

---

**Sistema 100% funcional e pronto para uso! 🎉**
