# PROMPT FIGMA - MÓDULO DE TRANSACCIONES

## Vista: Lista de Transacciones

### HEADER DE PÁGINA
- Título: "Transacciones" (Poppins Bold 28px)
- Botón principal derecha: "+ Nueva Transacción" (azul, 44px height)

---

### FILTROS (Card blanca superior)

**Layout horizontal:**
```
[Buscar] [Tipo ▼] [Categoría ▼] [Fecha Inicio] [Fecha Fin] [Estado ▼] [Limpiar] [Exportar ▼]
```

**Campo de búsqueda:**
- Width: 280px
- Placeholder: "Buscar por descripción..."
- Icono lupa izquierda
- Height: 40px

**Selects (dropdowns):**
- Width: 160px
- Height: 40px
- Border: 1px solid #e2e8f0
- Border radius: 8px
- Chevron down derecha

**Opciones:**
- Tipo: Todos | Ingresos | Egresos
- Categoría: Todas | (lista de categorías)
- Estado: Todos | Pendiente | Aprobado | Rechazado

**Botón Limpiar:**
- Outline, color gris
- Icono X

**Botón Exportar:**
- Outline, color azul
- Dropdown: Excel | CSV
- Icono download

---

### TABLA DE TRANSACCIONES

**Estructura de tabla:**
- Background: Blanco
- Border radius: 12px
- Box shadow suave

**Columnas:**
1. ☐ Checkbox (select all)
2. Fecha (100px)
3. Tipo (80px - badge)
4. Categoría (140px)
5. Descripción (flex 1)
6. Responsable (140px)
7. Monto (120px - alineado derecha)
8. Estado (100px - badge)
9. Acciones (80px - iconos)

**Header de tabla:**
- Background: #f8fafc
- Height: 48px
- Texto: 12px uppercase semibold #64748b
- Sort icons en columnas ordenables

**Fila de datos:**
- Height: 64px
- Hover: Background #f8fafc
- Padding: 16px
- Border bottom: 1px solid #e2e8f0

**Badge de Tipo:**
- Ingreso: Verde claro con texto verde oscuro, icono ↓
- Egreso: Rojo claro con texto rojo oscuro, icono ↑
- Border radius: 6px
- Padding: 4px 12px

**Badge de Estado:**
- Pendiente: Amarillo/Naranja
- Aprobado: Verde
- Rechazado: Rojo
- Formato igual que badge tipo

**Monto:**
- Ingresos: Color verde bold
- Egresos: Color rojo bold
- Prefijo + o -
- Tamaño: 16px

**Acciones (iconos):**
- Ver (ojo)
- Editar (lápiz)
- Eliminar (papelera)
- Hover: Background color suave
- Size: 20px cada uno
- Gap: 8px

---

### PAGINACIÓN (Footer de tabla)

```
Mostrando 1-20 de 156 registros    [◀ Anterior] [1] [2] [3] ... [8] [Siguiente ▶]
```

- Alineado: Info izquierda, controles derecha
- Números de página: 32px x 32px
- Activo: Background azul, texto blanco
- Hover: Background gris suave

---

## Modal: Nueva/Editar Transacción

### ESTRUCTURA:
- Width: 600px
- Background: Blanco
- Border radius: 16px
- Padding: 32px
- Overlay: rgba(0,0,0,0.5)

### HEADER MODAL:
- Título: "Nueva Transacción" o "Editar Transacción"
- Botón X cerrar (top right)

### FORMULARIO (2 columnas donde aplique):

**Tipo (Radio buttons grandes):**
```
┌─────────────┐  ┌─────────────┐
│  💰 Ingreso │  │  💸 Egreso  │
│  ○          │  │  ●          │
└─────────────┘  └─────────────┘
```
- Height: 80px
- Border: 2px cuando seleccionado
- Icon grande arriba
- Radio button abajo

**Campo Monto:**
- Label: "Monto *"
- Prefix: "$"
- Input: Número con decimales
- Placeholder: "0.00"
- Full width

**Campo Categoría:**
- Select dropdown
- Iconos de colores según categoría
- Full width

**Campo Descripción:**
- Textarea
- Height: 80px
- Placeholder: "Describe el movimiento..."

**Campo Fecha:**
- Date picker
- Icono calendario
- Formato: DD/MM/YYYY

**Campo Método de Pago:**
- Select: Efectivo | Transferencia | Tarjeta | Otro
- Width: 50%

**Campo Responsable:**
- Select de usuarios
- Avatar + nombre
- Width: 50%

**Upload Comprobante:**
```
┌─────────────────────────────────┐
│  📎 Arrastra archivo aquí       │
│     o haz click para subir      │
│                                 │
│  JPG, PNG o PDF (máx 5MB)      │
└─────────────────────────────────┘
```
- Border: Dashed 2px #cbd5e1
- Background: #f8fafc
- Height: 120px
- Drag & drop activo

**Preview de archivo:**
- Thumbnail pequeño
- Nombre archivo
- Tamaño
- Botón X para quitar

**Notas Adicionales:**
- Textarea opcional
- Height: 60px
- Placeholder: "Notas adicionales (opcional)"

---

### FOOTER MODAL:
```
[Cancelar (gris outline)]  [Guardar (azul sólido)]
```
- Spacing: 12px entre botones
- Alineados a la derecha

### VALIDACIONES:
- Campos requeridos con asterisco rojo
- Error state: Border rojo + mensaje abajo
- Success state: Border verde + checkmark

---

## Modal: Aprobar Transacción

### Para egresos > $1,000

**Contenido:**
```
⚠️ Aprobación Requerida

Esta transacción requiere aprobación por monto superior a $1,000.

Monto: $1,500
Descripción: Compra de equipo audiovisual
Solicitado por: Juan Pérez
Fecha: 15/01/2026

¿Deseas aprobar esta transacción?

[Rechazar (rojo outline)]  [Aprobar (verde sólido)]
```

---

## Vista: Detalle de Transacción

### Layout (Modal o página):
- 2 columnas

**Columna Izquierda - Información:**
- Badge grande de tipo
- Monto destacado
- Descripción
- Categoría con color
- Fecha
- Método de pago
- Responsable (avatar + nombre)
- Creado por
- Fecha creación

**Columna Derecha - Acciones y Archivos:**
- Estado actual (badge grande)
- Comprobante (imagen/PDF preview)
- Botones de acción:
  - Editar
  - Eliminar
  - Aprobar (si pendiente)
  - Descargar comprobante

---

## ESTADO VACÍO

```
        📊
   No hay transacciones

Comienza registrando tu primera
    transacción financiera

  [+ Nueva Transacción]
```

---

## ESPECIFICACIONES

**Colores de Categorías:**
- Ingresos (verde): #22c55e
- Egresos (rojo): #ef4444
- Pendiente (amarillo): #f59e0b
- Aprobado (verde): #10b981
- Rechazado (rojo): #dc2626

**Interacciones:**
- Hover en filas: Background #f8fafc
- Click fila: Abrir detalle
- Checkbox: Acciones en lote (eliminar múltiples)
- Drag & drop: Cambiar orden (opcional)

**Responsive Mobile:**
- Tabla convertida a cards
- Filtros: Accordion colapsable
- 1 card por transacción
- Swipe para acciones