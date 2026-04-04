# PROMPT FIGMA - DASHBOARD SAESTL

## Descripción General
Dashboard financiero moderno con sidebar, header y área principal con métricas y gráficas.

## Layout Principal (1440px desktop)

### ESTRUCTURA:
```
┌─────────────────────────────────────────────────┐
│  HEADER (altura: 72px)                          │
├────────┬────────────────────────────────────────┤
│        │                                         │
│ SIDE   │  MAIN CONTENT                          │
│ BAR    │  (scroll vertical)                     │
│ 260px  │                                         │
│        │                                         │
└────────┴────────────────────────────────────────┘
```

---

## HEADER (Fixed Top)

### Layout:
- Background: Blanco #ffffff
- Height: 72px
- Box shadow: 0 2px 8px rgba(0,0,0,0.08)
- Padding: 0 32px
- Display: flex, justify-between

### Lado Izquierdo:
- Logo circular (40px) con gradiente azul
- Texto "SAESTL" (Poppins Bold 20px)
- Subtítulo "Sistema de Gestión" (Poppins Regular 12px, color #64748b)

### Lado Derecho:
**Elementos horizontales:**
1. Icono de campana (notificaciones)
   - Badge rojo con número "3"
   - Hover: background gris suave

2. Dropdown Usuario:
   - Avatar circular 40px (iniciales o foto)
   - Nombre: "Juan Pérez" (14px)
   - Rol: "Tesorero" (12px, #64748b)
   - Icono chevron-down
   - Al hacer click: Menu desplegable
     - Mi Perfil
     - Configuración
     - ─────────
     - Cerrar Sesión (texto rojo)

---

## SIDEBAR (Fixed Left)

### Layout:
- Width: 260px
- Background: Linear gradient (#1e293b a #334155)
- Color texto: Blanco/Gris claro
- Padding: 24px 16px

### Navegación (Items verticales):

**Item de menú (estructura repetida):**
- Height: 44px
- Padding: 12px 16px
- Border radius: 8px
- Display: flex, gap 12px
- Hover: Background rgba(255,255,255,0.1)
- Active: Background rgba(255,255,255,0.15), font semibold

**Items del menú:**
1. 📊 Dashboard (activo)
2. 💰 Transacciones
3. 🎫 Rifas
4. 📅 Eventos
5. 💵 Presupuestos
6. 📄 Cuentas por Pagar
7. 📊 Reportes
8. ⚙️ Configuración

**Espaciado:** 8px entre items

---

## MAIN CONTENT AREA

### Breadcrumb:
- "Dashboard" en gris, tamaño 14px
- Margin bottom: 24px

### Sección 1: STATS CARDS (Grid 4 columnas)

**Card de Métrica (estructura repetida):**
- Background: Blanco
- Border radius: 12px
- Padding: 24px
- Box shadow: 0 2px 10px rgba(0,0,0,0.06)
- Border left: 4px sólido (color según tipo)
- Hover: Sombra más pronunciada, transform scale(1.02)

**Card 1: Balance Actual (verde)**
- Border color: #22c55e
- Icono: Billetera (32px, fondo verde suave)
- Label: "Balance Actual" (14px gris)
- Valor: "$15,450" (32px bold negro)
- Trend: "+12% vs mes anterior" (12px verde con flecha arriba)

**Card 2: Ingresos del Mes (azul)**
- Border color: #2563eb
- Icono: Flecha abajo (ingresos)
- Label: "Ingresos del Mes"
- Valor: "$8,750"
- Info: "23 transacciones" (12px gris)

**Card 3: Egresos del Mes (rojo)**
- Border color: #ef4444
- Icono: Flecha arriba (egresos)
- Label: "Egresos del Mes"
- Valor: "$3,200"
- Info: "15 transacciones"

**Card 4: Rifas Activas (morado)**
- Border color: #a855f7
- Icono: Boleto
- Label: "Rifas Activas"
- Valor: "3"
- Info: "245 boletos vendidos"

**Grid spacing:** Gap 24px

---

### Sección 2: GRÁFICAS (Grid 2 columnas)

**Card Gráfica Izquierda:**
- Título: "Ingresos vs Egresos"
- Dropdown: "Últimos 6 meses"
- Gráfica de líneas:
  - Línea verde: Ingresos
  - Línea roja: Egresos
  - Eje X: Ene, Feb, Mar, Abr, May, Jun
  - Eje Y: Valores en pesos
  - Grid lines suaves
  - Área bajo líneas con gradiente suave
- Leyenda abajo

**Card Gráfica Derecha:**
- Título: "Transacciones Recientes"
- Lista de transacciones (5 items):

**Item de transacción:**
```
┌──────────────────────────────────────────┐
│ [Icono] Cuotas de Alumnos    +$2,500    │
│         15 Ene 2026                      │
└──────────────────────────────────────────┘
```
- Icono: círculo con flecha (verde=ingreso, rojo=egreso)
- Nombre: 14px semibold
- Fecha: 12px gris
- Monto: 16px bold, color según tipo
- Hover: Background gris muy suave

---

### Sección 3: ACCIONES RÁPIDAS + EVENTOS

**Grid 2 columnas:**

**Columna Izquierda - Acciones Rápidas:**
- Título: "Acciones Rápidas"
- Grid 2x2 de botones:

**Botón de acción (estructura):**
- Background: Gradiente (distinto por acción)
- Border radius: 12px
- Padding: 24px
- Altura: 120px
- Icono grande (32px) arriba
- Texto abajo (14px semibold)
- Hover: Sombra y ligero lift

**Botones:**
1. "Nueva Transacción" (gradiente azul)
2. "Nueva Rifa" (gradiente morado)
3. "Nuevo Evento" (gradiente verde)
4. "Exportar Reporte" (gradiente naranja)

**Columna Derecha - Próximos Eventos:**
- Título: "Próximos Eventos"
- Lista de 3 eventos:

**Card de evento:**
- Background: Color suave según tipo
- Border left: 4px color sólido
- Padding: 16px
- Fecha: Cuadro grande a la izquierda (día y mes)
- Info: Nombre evento, ubicación, hora
- Badge: Número de registrados

---

### Sección 4: PRESUPUESTOS

**Card ancho completo:**
- Título: "Estado de Presupuestos"
- 3 barras de progreso:

**Barra de progreso:**
- Label: "Eventos" | "$ 4,200 / $ 5,000"
- Barra: 
  - Background gris claro
  - Fill: Color según % (verde<70%, amarillo 70-90%, rojo >90%)
  - Height: 12px
  - Border radius: 6px
  - Animación de llenado
- Spacing: 16px entre barras

---

## ESTADOS Y VARIANTES

### Estado Cargando:
- Skeleton loaders en lugar de datos
- Animación de shimmer

### Estado Vacío:
- Ilustración SVG centrada
- Texto: "No hay datos para mostrar"
- Botón de acción

### Responsive Tablet (768px):
- Sidebar colapsable (solo iconos, 72px)
- Stats cards: Grid 2x2
- Gráficas: Stack vertical

### Responsive Mobile (375px):
- Bottom navigation (4 items principales)
- Stats cards: 1 columna, scroll horizontal
- Gráficas: 1 columna
- Header simplificado

---

## ESPECIFICACIONES TÉCNICAS

**Colores:**
- Primario: #2563eb
- Secundario: #64748b
- Éxito: #22c55e
- Error: #ef4444
- Advertencia: #f59e0b
- Info: #3b82f6
- Morado: #a855f7

**Tipografía:**
- Familia: Poppins
- Títulos: 20-24px Bold
- Subtítulos: 16-18px Semibold
- Cuerpo: 14px Regular
- Pequeño: 12px Regular

**Espaciado:**
- Secciones: 32px
- Cards: 24px gap
- Elementos internos: 16px
- Items de lista: 12px

**Sombras:**
- Card: 0 2px 10px rgba(0,0,0,0.06)
- Hover: 0 4px 20px rgba(0,0,0,0.12)
- Modal: 0 10px 40px rgba(0,0,0,0.2)

**Animaciones:**
- Transición: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Hover scale: 1.02
- Hover lift: translateY(-2px)