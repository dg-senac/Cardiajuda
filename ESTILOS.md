# Estilos Aplicados - CardiAjuda

## Paleta de Cores

### Cores Principais
- **cor-primaria**: `#8B008B` - Roxo/Magenta escuro (botões, cards, títulos, ícones)
- **cor-primaria-hover**: `#6E006E` - Hover dos botões
- **cor-primaria-escura**: `#4B0049` - Bordas fortes, sombras

### Cores de Fundo
- **cor-fundo**: `#FFFFFF` - Fundo geral das telas
- **cor-fundo-rosa**: `#FFE4F3` - Fundo de inputs, cards claros
- **cor-fundo-rosa-2**: `#F8D0EA` - Fundo da barra de navegação e header

### Cores de Texto
- **cor-texto**: `#1A1A1A` - Texto principal
- **cor-texto-claro**: `#FFFFFF` - Texto sobre fundo roxo
- **cor-placeholder**: `#9A7A95` - Placeholder dos inputs
- **cor-link**: `#8B008B` - Links (sublinhados)

### Cores de Status
- **status-normal**: `#2E9E4F` - Verde (✓ normal, triagem verde, "Em dia")
- **status-atencao**: `#F2A900` - Amarelo/Laranja (⚠ atenção, triagem amarela, "Pendências")
- **status-alerta**: `#D62839` - Vermelho (! alerta, X de excluir, triagem vermelha, "Alertas")

## Configuração Tailwind

```javascript
// tailwind.config.js
colors: {
  'cor-primaria': '#8B008B',
  'cor-primaria-hover': '#6E006E',
  'cor-primaria-escura': '#4B0049',
  'cor-fundo-rosa': '#FFE4F3',
  'cor-fundo-rosa-2': '#F8D0EA',
  'cor-fundo': '#FFFFFF',
  'cor-borda-input': '#8B008B',
  'cor-texto': '#1A1A1A',
  'cor-texto-claro': '#FFFFFF',
  'cor-placeholder': '#9A7A95',
  'cor-link': '#8B008B',
  'status-normal': '#2E9E4F',
  'status-atencao': '#F2A900',
  'status-alerta': '#D62839',
}
```

## CSS Customizado (index.css)

### Variáveis CSS
Todas as cores definidas como variáveis CSS em `:root` para uso consistente.

### Scrollbar Personalizada
- Scrollbar roxa com hover
- Track rosa claro
- Borda arredondada

### Animações
- **fadeIn**: Animação de entrada suave (0.3s)
- Aplicada com classe `.fade-in` nas telas principais

### Efeitos de Hover
- Transições suaves em todos os botões (0.2s)
- Efeito de scale no click (0.98)
- Sombras aumentadas no hover

### Sombras
- **shadow-card**: `0 4px 12px rgba(139, 0, 139, 0.15)`
- **shadow-card-hover**: `0 6px 20px rgba(139, 0, 139, 0.25)` + translateY(-2px)

### Inputs
- Foco com anel roxo (`0 0 0 3px rgba(139, 0, 139, 0.2)`)
- Sombra suave no hover
- Transição suave

### Toasts
- **toast-success**: Fundo verde, texto branco
- **toast-error**: Fundo vermelho, texto branco
- **toast-warning**: Fundo amarelo, texto branco

## Componentes Estilizados

### Button
- Variants: primary, secondary
- Primary: fundo roxo, texto branco, sombra, hover com sombra maior
- Secondary: fundo branco, borda roxa, hover com fundo rosa
- Cantos totalmente arredondados (rounded-full)
- Altura 44px (h-11)
- Transições suaves

### Input
- Fundo rosa claro
- Borda roxa (2px)
- Cantos arredondados (rounded-xl)
- Placeholder cinza
- Foco com anel roxo
- Sombra suave no hover

### Card
- Variants: primary, light
- Primary: fundo roxo, texto branco, sombra
- Light: fundo rosa, borda roxa, sombra
- Cantos bem arredondados (rounded-2xl)
- Prop `hover` para efeito de elevação

### Header
- Fundo rosa claro (#F8D0EA)
- Sombra
- Avatar com borda roxa
- Botão voltar com hover

### BottomNav
- Fundo rosa claro
- Borda superior roxa (2px)
- Sombra
- Ícone ativo: roxo, scale 105%
- Ícone inativo: roxo 50% opacidade, hover 75%

### StatusIcon
- Círculo colorido com ícone (✓, ⚠, !)
- Cores baseadas no status

## Telas com Gradientes

### Telas de Autenticação
- Login, CadastroPaciente, CadastroMedico
- Gradiente: `bg-gradient-to-br from-cor-fundo to-cor-fundo-rosa`
- Animação fadeIn

### Telas Internas
- Todas as telas de paciente e médico
- Gradiente: `bg-gradient-to-b from-cor-fundo to-cor-fundo-rosa/30`
- Animação fadeIn no conteúdo

## Efeitos Especiais

### Botões de Ação
- Sombra no estado normal
- Sombra maior no hover
- Transform translateY(-1px) no hover
- Scale(0.98) no click

### Cards Interativos
- Sombra card no estado normal
- Sombra card-hover no hover
- Transform translateY(-2px) no hover

### Transições
- Todas as transições com `duration-200` ou `duration-300`
- Curva `ease-in-out` ou `ease`

## Tipografia

- Fonte: Open Sans (Google Fonts)
- Títulos: font-bold (700)
- Corpo: font-normal (400) ou font-semibold (600)
- Antialiasing ativado para renderização suave

## Responsividade

- Layout mobile-first
- Largura máxima ~420px centralizada
- Bottom navigation fixa em telas internas
- Header sticky no topo

## Acessibilidade

- Contraste mínimo 4.5:1 (WCAG AA)
- Texto branco só sobre fundo roxo ou status
- Estados de hover e focus visíveis
- Labels em todos os inputs
