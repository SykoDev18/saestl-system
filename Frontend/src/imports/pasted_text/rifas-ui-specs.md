# PROMPT FIGMA - MÓDULO DE RIFAS

## Vista: Lista de Rifas

### CARDS DE RIFA (Grid 3 columnas en desktop)

**Card de Rifa:**
```
┌─────────────────────────────────────────┐
│  🎫 iPhone 15 Pro          [Activa 🟢] │
│                                         │
│  245 / 300 boletos vendidos (81.7%)    │
│  ████████████████░░░                   │
│                                         │
│  💰 Precio: $50 por boleto              │
│  📅 Sorteo: 30 Enero 2026               │
│                                         │
│  [Ver Detalle]  [Vender Boletos]       │
└─────────────────────────────────────────┘
```

**Especificaciones del Card:**
- Width: flex (33% en desktop)
- Border radius: 16px
- Padding: 24px
- Box shadow: 0 4px 12px rgba(0,0,0,0.08)
- Hover: Sombra más pronunciada, scale 1.02

**Header del Card:**
- Icono boleto (morado)
- Nombre rifa (18px bold)
- Badge estado derecha:
  - Activa: Verde #22c55e
  - Cerrada: Gris #64748b
  - Sorteada: Morado #a855f7

**Progress Bar:**
- Background: #e2e8f0
- Fill: Gradiente morado (#a855f7 a #c084fc)
- Height: 8px
- Border radius: 4px
- Animación de llenado
- Texto arriba: "245 / 300 boletos vendidos (81.7%)"

**Información:**
- Icono + texto en filas
- Color: #64748b
- Tamaño: 14px

**Botones:**
- Primario: "Ver Detalle" (outline morado)
- Secundario: "Vender Boletos" (sólido morado)
- Width: 100% cada uno
- Spacing: 8px

**Badge de Estado:**
- Padding: 4px 12px
- Border radius: 12px
- Font: 12px semibold
- Con punto de color •

---

## Vista: Detalle de Rifa

### LAYOUT (Página completa)

**Header:**
```
← Volver a Rifas        Rifa: iPhone 15 Pro Max        [Editar] [Cerrar Rifa]
```

---

### SECCIÓN 1: INFORMACIÓN PRINCIPAL

**Card grande con 3 columnas:**

**Columna 1 - Info Básica:**
- 🎫 Nombre: iPhone 15 Pro Max
- 📝 Descripción: Smartphone Apple último modelo...
- 💰 Precio por boleto: $50.00
- 🎁 Premio: iPhone 15 Pro Max 256GB

**Columna 2 - Fechas:**
- 📅 Inicio: 15 Enero 2026
- 📅 Fin: 30 Enero 2026
- 🎲 Sorteo: 30 Enero 2026 12:00 PM
- ⏰ Días restantes: 15 días

**Columna 3 - Estado:**
- Badge grande: ACTIVA
- Creado por: Juan Pérez
- Fecha creación: 10/01/2026

---

### SECCIÓN 2: ESTADÍSTICAS (Grid 4 cards)

**Card 1: Boletos Vendidos**
- 245 (grande)
- "de 300 totales"
- Icono boleto morado

**Card 2: Boletos Disponibles**
- 55
- "81.7% vendido"
- Icono disponible verde

**Card 3: Ingresos Actuales**
- $12,250
- "de $15,000 proyectado"
- Icono dinero

**Card 4: Utilidad Estimada**
- +$7,250
- "Ingreso - Premio"
- Icono gráfica

---

### SECCIÓN 3: BARRA DE PROGRESO GRANDE

```
┌──────────────────────────────────────────────────────────┐
│  Progreso de Venta                                       │
│                                                          │
│  █████████████████████████░░░░░░                        │
│  245 / 300 boletos (81.7%)                              │
│                                                          │
│  Solo quedan 55 boletos disponibles                      │
└──────────────────────────────────────────────────────────┘
```
- Height: 24px
- Gradiente morado animado
- Texto grande abajo

---

### SECCIÓN 4: ACCIONES PRINCIPALES

**Grid de botones grandes:**

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  🎫 Vender   │  │  🎲 Sortear  │  │  📊 Ver      │
│  Boletos     │  │  Rifa        │  │  Compradores │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  📥 Exportar │  │  📝 Editar   │  │  🔒 Cerrar   │
│  Excel       │  │  Rifa        │  │  Rifa        │
└──────────────┘  └──────────────┘  └──────────────┘
```

- Background: Gradiente según acción
- Height: 100px
- Border radius: 12px
- Icono grande arriba
- Texto abajo
- Hover: Sombra y lift

**Botón Sortear:**
- Solo visible si: status="active" && ticketsSold > 0
- Gradiente dorado cuando activo
- Deshabilitado: Gris con tooltip

---

### SECCIÓN 5: BOLETOS VENDIDOS (Tabla)

**Tabla con columnas:**
1. # Boleto
2. Comprador
3. Teléfono
4. Email
5. Vendido por
6. Fecha de venta
7. Estado pago

**Features:**
- Búsqueda por nombre/boleto
- Ordenar por columna
- Paginación
- Filtro por estado de pago

**Highlight:**
- Boleto ganador (si ya hay sorteo): Background dorado
- Boletos pendientes de pago: Background amarillo suave

---

## Modal: Vender Boletos

### TABS:
```
[Venta Individual] ○  [Venta en Lote] ●
```

### TAB 1: Venta Individual

**Selector de Boleto Visual:**
```
┌──────────────────────────────────────────┐
│  Selecciona un boleto disponible:       │
│                                          │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐         │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ ...     │
│  └───┘ └───┘ └───┘ └───┘ └───┘         │
│                                          │
│  🔴 = Vendido    ⚪ = Disponible         │
└──────────────────────────────────────────┘
```

- Grid de números
- Vendidos: Gris oscuro, cursor not-allowed
- Disponibles: Verde claro, cursor pointer
- Seleccionado: Morado, borde grueso
- Hover disponible: Morado suave

**Formulario Comprador:**
- Nombre completo *
- Teléfono *
- Email (opcional)
- Estado de pago: [Pagado ●] [Pendiente ○]

**Precio:**
```
┌──────────────────────┐
│  Total a pagar:      │
│  $50.00              │
└──────────────────────┘
```

---

### TAB 2: Venta en Lote

**Selector de Rango:**
```
Boleto inicial:  [___]   →   Boleto final: [___]

Boletos seleccionados: 10
Total: $500.00
```

- Inputs numéricos
- Validación de rango
- Preview de cantidad y total

**Mismo formulario comprador**

**Lista de Boletos:**
```
Se venderán los boletos: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
```

---

## Modal: Realizar Sorteo

### ANIMACIÓN DE SORTEO:

**Antes del sorteo:**
```
┌────────────────────────────────────────┐
│         🎲 Realizar Sorteo             │
│                                        │
│  Boletos participantes: 245            │
│                                        │
│  ¿Estás seguro de realizar el sorteo? │
│  Esta acción no se puede deshacer.    │
│                                        │
│  [Cancelar]  [Sortear Ahora 🎲]       │
└────────────────────────────────────────┘
```

**Durante sorteo (animación):**
```
┌────────────────────────────────────────┐
│         🎲 Sorteando...                │
│                                        │
│         ┌────────┐                     │
│         │  ###   │ (números random)    │
│         │  ###   │ (animación rápida)  │
│         └────────┘                     │
│                                        │
│         Seleccionando ganador...       │
└────────────────────────────────────────┘
```

**Resultado:**
```
┌────────────────────────────────────────┐
│         🎉 ¡Tenemos Ganador! 🎉       │
│                                        │
│         Boleto Ganador: #42            │
│                                        │
│         👤 Juan Pérez García          │
│         📱 777-123-4567                │
│                                        │
│  [Copiar Datos]  [Cerrar]             │
└────────────────────────────────────────┘
```

**Confetti animation al mostrar ganador**

---

## Modal: Crear/Editar Rifa

### FORMULARIO WIZARD (3 pasos)

**Indicador de pasos:**
```
● Información    ○ Configuración    ○ Confirmación
────────────────  - - - - - - - -  - - - - - - - -
```

### PASO 1: Información Básica
- Nombre de la rifa *
- Descripción
- Descripción del premio *
- Foto del premio (upload)

### PASO 2: Configuración
- Precio por boleto *
- Total de boletos *
- Fecha de inicio *
- Fecha de fin *
- Fecha del sorteo *

**Preview calculado:**
```
┌──────────────────────────┐
│  Ingresos proyectados:   │
│  $15,000                 │
└──────────────────────────┘
```

### PASO 3: Confirmación
- Resumen de todo
- Checkbox: "He verificado que la información es correcta"
- [Volver] [Crear Rifa]

---

## Vista: Ganadores Históricos

**Lista de rifas sorteadas:**

**Card de ganador:**
```
┌─────────────────────────────────────────────┐
│  🏆 iPhone 15 Pro Max                       │
│                                             │
│  Ganador: Juan Pérez García                │
│  Boleto: #42 de 300                        │
│  Fecha sorteo: 30/01/2026                  │
│                                             │
│  Ingresos: $12,250                         │
│  Premio: $25,000                           │
│  Utilidad: -$12,750                        │
└─────────────────────────────────────────────┘
```

---

## ESPECIFICACIONES

**Colores Rifas:**
- Primario: #a855f7 (morado)
- Secundario: #c084fc (morado claro)
- Ganador: #f59e0b (dorado)
- Vendido: #64748b (gris)
- Disponible: #22c55e (verde)

**Animaciones:**
- Sorteo: 3 segundos de números random
- Confetti: 2 segundos al mostrar ganador
- Progress bar: Fill animado 1s

**Responsive:**
- Desktop: 3 columnas de cards
- Tablet: 2 columnas
- Mobile: 1 columna, cards más compactos