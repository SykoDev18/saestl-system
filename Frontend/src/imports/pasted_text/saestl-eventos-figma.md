# PROMPT FIGMA - MÓDULO DE EVENTOS SAESTL COMPLETO

---

## VISTA 1: CALENDARIO DE EVENTOS

### Layout Principal

**Header de Página:**

```
┌─────────────────────────────────────────────────────────┐
│  📅 Eventos                        [Crear Evento +]     │
└─────────────────────────────────────────────────────────┘
```

- Título: Poppins Bold 28px, color #2c3e50
- Botón: Gradiente verde UAEH, 48px height

---

### FILTROS Y VISTA (Tabs superiores)

```
[Vista Calendario] ● | [Vista Lista] ○ | [Próximos] ○
```

**Selector de Mes:**

```
[◀ Anterior]    Enero 2026    [Siguiente ▶]
```

- Botones: 40px height, border verde
- Mes: Poppins Semibold 20px

---

### CALENDARIO MENSUAL (Grid 7x6)

**Header Días de la Semana:**

```
┌────┬────┬────┬────┬────┬────┬────┐
│ Dom│ Lun│ Mar│ Mié│ Jue│ Vie│ Sáb│
└────┴────┴────┴────┴────┴────┴────┘
```

- Background: #e8f0ec (verde muy claro)
- Texto: 12px uppercase semibold #4a5a52
- Height: 40px

**Celda de Día:**

```
┌──────────────────┐
│  15              │ ← Número del día (top-right)
│                  │
│  🏀 Torneo       │ ← Evento 1 (badge)
│  10:00 AM        │
│                  │
│  🎤 Conferencia  │ ← Evento 2
│  3:00 PM         │
│                  │
│  +2 más...       │ ← Indicador si hay más
└──────────────────┘
```

**Especificaciones de Celda:**

- Min height: 120px
- Padding: 8px
- Border: 1px solid #d1e0d8
- Hover: Background #f8faf9, sombra suave

**Día Actual:**

- Border: 2px solid #2d5f3f
- Background: #e8f0ec

**Día con Eventos:**

- Número en bold
- Background muy suave del color del evento

**Badge de Evento en Calendario:**

```
┌─────────────────────────┐
│ 🏀 Torneo Fútbol       │
│ 10:00 AM               │
└─────────────────────────┘
```

- Height: 36px
- Padding: 6px 8px
- Border-left: 4px solid (color según tipo)
- Background: Color suave según tipo
- Border-radius: 4px
- Font: 11px
- Truncate texto largo con "..."
- Cursor pointer

**Tipos de Evento (colores):**

- Deportivo: #e87722 (naranja)
- Académico: #1e4d8b (azul)
- Cultural: #c1272d (rojo)
- Social: #2d5f3f (verde)
- Rifa: #f6c344 (amarillo)

---

## VISTA 2: LISTA DE EVENTOS

### FILTROS AVANZADOS

```
┌─────────────────────────────────────────────────────────┐
│ [Buscar...] [Tipo ▼] [Estado ▼] [Fecha ▼] [Limpiar]    │
└─────────────────────────────────────────────────────────┘
```

**Campo Búsqueda:**

- Width: 300px
- Placeholder: "Buscar por nombre o ubicación..."
- Icono lupa

**Filtros:**

- Tipo: Todos | Deportivo | Académico | Cultural | Social
- Estado: Todos | Próximos | En curso | Completados | Cancelados
- Fecha: Hoy | Esta semana | Este mes | Personalizado

---

### CARDS DE EVENTO (Lista Vertical)

**Card Grande de Evento:**

```
┌─────────────────────────────────────────────────────────┐
│ ┌────┐                                       [Próximo]  │
│ │ 25 │  🏀 Torneo de Fútbol 5vs5                       │
│ │ENE │  ━━━━━━━━━━━━━━━━━━━━━━━━                      │
│ └────┘                                                  │
│        📍 Campo deportivo ESTL                          │
│        🕐 25 Enero 2026 - 10:00 AM                     │
│        👥 45 registrados / 60 cupos                     │
│        💰 Entrada: $50 por equipo                      │
│                                                         │
│        [Ver Detalle] [Registrar Equipo] [Exportar]     │
└─────────────────────────────────────────────────────────┘
```

**Estructura del Card:**

- Width: 100%
- Padding: 24px
- Border-radius: 12px
- Border-left: 6px solid (color tipo evento)
- Background: blanco
- Box-shadow: 0 2px 8px rgba(45,95,63,0.08)
- Hover: sombra más pronunciada, scale 1.01

**Calendario Mini (izquierda):**

- Width: 60px
- Height: 60px
- Background: Gradiente según tipo evento
- Color texto: Blanco
- Border-radius: 8px
- Día: 24px bold
- Mes: 12px uppercase

**Badge de Estado (top-right):**

- Próximo: Verde #48a868
- En curso: Azul #1e4d8b
- Completado: Gris #6b7f75
- Cancelado: Rojo #c1272d
- Padding: 4px 12px
- Border-radius: 12px
- Font: 12px semibold

**Información:**

- Icono + texto
- Color: #4a5a52
- Font: 14px
- Line-height: 24px
- Spacing: 8px entre líneas

**Barra de Progreso Cupos:**

```
45 / 60 registrados (75%)
████████████████░░░░  
```

- Height: 6px
- Background: #d1e0d8
- Fill: Gradiente verde (#2d5f3f a #48a868)
- Border-radius: 3px

**Botones:**

- Outline verde: "Ver Detalle"
- Sólido verde: "Registrar Equipo"
- Outline gris: "Exportar"
- Height: 36px
- Gap: 8px

---

## MODAL: CREAR/EDITAR EVENTO

### WIZARD DE 4 PASOS

**Indicador de Progreso:**

```
● Información Básica → ● Detalles → ○ Registro → ○ Confirmación
═══════════════════   ══════════   ─────────   ─────────────
```

- Completado: Verde oscuro #2d5f3f
- Actual: Verde claro #48a868
- Pendiente: Gris #d1e0d8

---

### PASO 1: INFORMACIÓN BÁSICA

**Layout Modal:**

- Width: 700px
- Max-height: 90vh
- Padding: 32px
- Border-radius: 16px
- Overflow: Auto scroll

**Formulario (2 columnas responsive):**

```
┌─────────────────────────────────────────────────┐
│  Nombre del Evento *                            │
│  [___________________________________________]   │
│                                                 │
│  Tipo de Evento *        Categoría             │
│  [Deportivo    ▼]        [Torneo       ▼]      │
│                                                 │
│  Descripción                                    │
│  [_________________________________________]    │
│  [_________________________________________]    │
│  [_________________________________________]    │
│                                                 │
│  📸 Imagen del Evento (Opcional)               │
│  ┌─────────────────────────────────────┐       │
│  │  📷 Arrastra imagen aquí            │       │
│  │     o haz click para subir          │       │
│  │  JPG o PNG (máx 5MB)                │       │
│  └─────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
```

**Validaciones en Tiempo Real:**

- Campo vacío: Border rojo + mensaje abajo
- Campo válido: Border verde + checkmark
- Caracteres restantes en textarea: "250/500"

---

### PASO 2: DETALLES DEL EVENTO

```
┌─────────────────────────────────────────────────┐
│  📅 Fecha y Hora                                │
│                                                 │
│  Fecha del Evento *      Hora de Inicio *      │
│  [25/01/2026]            [10:00 AM]            │
│                                                 │
│  Hora de Fin             Duración Estimada     │
│  [14:00 PM]              [4 horas]             │
│                                                 │
│  📍 Ubicación                                   │
│                                                 │
│  Lugar *                                        │
│  [Campo deportivo ESTL_________________]        │
│                                                 │
│  Dirección Completa                            │
│  [Av. Universidad s/n, Tlahuelilpan___]        │
│                                                 │
│  Link de Google Maps (Opcional)                │
│  [https://maps.google.com/___________]         │
│                                                 │
│  📋 Información Adicional                      │
│                                                 │
│  Requisitos o Materiales                       │
│  [Traer tenis deportivos y agua____]           │
│                                                 │
│  Notas Importantes                             │
│  [No se permiten bebidas alcohólicas]          │
└─────────────────────────────────────────────────┘
```

**Date Picker:**

- Calendario dropdown
- Formato: DD/MM/YYYY
- Deshabilitar fechas pasadas
- Resaltar hoy

**Time Picker:**

- Dropdown con intervalos de 30 min
- Formato: 12 horas (AM/PM)
- Validar hora fin > hora inicio

---

### PASO 3: CONFIGURACIÓN DE REGISTRO

```
┌─────────────────────────────────────────────────┐
│  🎫 Control de Asistencia                       │
│                                                 │
│  ¿Requiere registro previo?                    │
│  ○ Sí, con formulario   ● No, entrada libre    │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Cupo Máximo                              │  │
│  │  [60] participantes                       │  │
│  │                                            │  │
│  │  Fecha Límite de Registro                 │  │
│  │  [24/01/2026]                             │  │
│  │                                            │  │
│  │  💰 Costo de Entrada                      │  │
│  │  ○ Gratuito                               │  │
│  │  ● Tiene costo: $[50] pesos              │  │
│  │                                            │  │
│  │  Por: ○ Persona  ● Equipo                │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  📝 Formulario de Registro                     │
│                                                 │
│  Campos a solicitar:                           │
│  ☑ Nombre completo                             │
│  ☑ Teléfono                                    │
│  ☑ Email                                       │
│  ☐ Matrícula                                   │
│  ☐ Semestre                                    │
│  ☑ Nombre del equipo (para deportes)          │
│  ☐ Alergias o condiciones médicas             │
│                                                 │
│  + Agregar campo personalizado                 │
└─────────────────────────────────────────────────┘
```

**Constructor de Formulario:**

- Drag & drop de campos
- Preview en tiempo real
- Validaciones configurables
- Campos condicionales

---

### PASO 4: CONFIRMACIÓN Y PUBLICACIÓN

```
┌─────────────────────────────────────────────────┐
│  ✅ Resumen del Evento                          │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  🏀 Torneo de Fútbol 5vs5               │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━              │   │
│  │  Tipo: Deportivo - Torneo               │   │
│  │  📅 25 Enero 2026, 10:00 AM - 2:00 PM  │   │
│  │  📍 Campo deportivo ESTL                │   │
│  │  👥 Cupo: 60 participantes              │   │
│  │  💰 $50 por equipo                      │   │
│  │  📋 Registro requerido hasta 24/01      │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ☐ Enviar notificación a usuarios              │
│  ☐ Publicar en redes sociales                  │
│  ☐ Crear evento en Google Calendar             │
│                                                 │
│  [← Volver]  [Guardar Borrador]  [Publicar]   │
└─────────────────────────────────────────────────┘
```

**Botón Publicar:**

- Background
- Height: 48px
- Width: 140px
- Icon: ✓
- Hover: Sombra, ligero lift

---

## FORMULARIO PÚBLICO DE REGISTRO

### PÁGINA STANDALONE (Acceso sin login)

**Header Público:**

```
┌─────────────────────────────────────────────────┐
│  [Logo UAEH]  SAESTL - Registro de Eventos     │
└─────────────────────────────────────────────────┘
```

- Background:  UAEH
- Color texto: Blanco
- Height: 64px

---

### CARD DE INFORMACIÓN DEL EVENTO

```
┌──────────────────────────────────────────────────┐
│  🏀 Torneo de Fútbol 5vs5                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━        │
│                                                  │
│  📅 25 Enero 2026, 10:00 AM                     │
│  📍 Campo deportivo ESTL                        │
│  💰 $50 por equipo                              │
│                                                  │
│  Cupos disponibles: 15 / 60                     │
│  ████████████████████░░░░                       │
│                                                  │
│  📝 Descripción:                                │
│  Gran torneo interfacultades. Forma tu equipo   │
│  de 5 jugadores y participa...                  │
└──────────────────────────────────────────────────┘
```

---

### FORMULARIO DE REGISTRO

```
┌──────────────────────────────────────────────────┐
│  📝 Formulario de Registro                       │
│                                                  │
│  Datos del Participante                         │
│                                                  │
│  Nombre Completo *                              │
│  [_________________________________________]     │
│                                                  │
│  Teléfono *                                     │
│  [__________]  📱 10 dígitos                    │
│                                                  │
│  Correo Electrónico *                           │
│  [_________________________]@_____.___          │
│                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│                                                  │
│  Datos del Equipo                               │
│                                                  │
│  Nombre del Equipo *                            │
│  [_________________________________________]     │
│                                                  │
│  Integrantes (5 jugadores + 2 suplentes)       │
│                                                  │
│  Jugador 1: [_______________]  [Email____]      │
│  Jugador 2: [_______________]  [Email____]      │
│  Jugador 3: [_______________]  [Email____]      │
│  ...                                            │
│                                                  │
│  [+ Agregar Integrante]                         │
│                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│                                                  │
│  💳 Pago de Inscripción                         │
│                                                  │
│  Total a pagar: $50.00                          │
│                                                  │
│  Método de pago:                                │
│  ● Pago en efectivo (en el evento)             │
│  ○ Transferencia bancaria                      │
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │  Si pagas por transferencia:           │    │
│  │  CLABE: 1234567890123456              │    │
│  │  Banco: BBVA Bancomer                  │    │
│  │  Beneficiario: SAESTL UAEH             │    │
│  │                                        │    │
│  │  Sube tu comprobante:                  │    │
│  │  [📎 Seleccionar archivo]              │    │
│  └────────────────────────────────────────┘    │
│                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│                                                  │
│  ☑ Acepto términos y condiciones               │
│  ☐ Acepto el reglamento del torneo             │
│                                                  │
│  [Cancelar]  [Completar Registro ✓]            │
└──────────────────────────────────────────────────┘
```

**Validaciones Dinámicas:**

- Email: Validar formato en tiempo real
- Teléfono: Solo números, 10 dígitos
- Campos obligatorios: No permitir submit sin llenar
- Duplicados: Alertar si email ya registrado

**Estados del Botón Submit:**

- Normal:  UAEH sólido
- Hover: Verde más oscuro, sombra
- Cargando: Spinner blanco, deshabilitado
- Success: Checkmark verde, "¡Registrado!"

---

## CONFIRMACIÓN DE REGISTRO

### PANTALLA DE ÉXITO

```
┌──────────────────────────────────────────────────┐
│              ✅ ¡Registro Exitoso!               │
│                                                  │
│         Gracias por registrarte al evento       │
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │  🏀 Torneo de Fútbol 5vs5             │    │
│  │                                        │    │
│  │  Número de Registro: #TF-2026-042     │    │
│  │  Equipo: Los Tigres                   │    │
│  │  Fecha: 25 Enero 2026, 10:00 AM      │    │
│  │  Lugar: Campo deportivo ESTL          │    │
│  └────────────────────────────────────────┘    │
│                                                  │
│  📧 Hemos enviado los detalles a tu correo     │
│  📱 Te enviaremos recordatorios por WhatsApp   │
│                                                  │
│  [Descargar Boleto PDF]  [Agregar a Calendar]  │
│  [Ver Detalles del Evento]  [Cerrar]           │
└──────────────────────────────────────────────────┘
```

**Confetti Animation** al cargar página

---

## VISTA: DETALLE DEL EVENTO

### LAYOUT (Página Completa)

**Hero Section:**

```
┌──────────────────────────────────────────────────────┐
│  [Imagen del evento - height 300px]                 │
│  Overlay oscuro en bottom                           │
│                                                      │
│  🏀 Torneo de Fútbol 5vs5                           │
│  📅 25 Enero 2026, 10:00 AM                         │
│  [Registrarme] [Compartir]                          │
└──────────────────────────────────────────────────────┘
```

- Background: Imagen subida o gradiente
- Overlay gradient: transparent to rgba(45,95,63,0.8)
- Texto: Blanco, bottom left
- Botones: Blanco outline

---

### TABS DE INFORMACIÓN

```
[Información] ● | [Participantes] ○ | [Estadísticas] ○
```

---

### TAB 1: INFORMACIÓN

**Grid 2 Columnas:**

**Columna Izquierda (70%):**

```
┌─────────────────────────────────────────┐
│  📝 Descripción                          │
│                                         │
│  Gran torneo interfacultades donde...  │
│  [texto completo]                       │
│                                         │
│  📋 Requisitos                          │
│  • Equipo de 5 jugadores + 2 suplentes │
│  • Identificación oficial               │
│  • Traer tenis deportivos y agua       │
│                                         │
│  📜 Reglamento                          │
│  1. Duración: 2 tiempos de 20 minutos  │
│  2. No se permiten tacones altos       │
│  3. Juego limpio obligatorio           │
│  ...                                    │
│                                         │
│  🏆 Premios                             │
│  1er Lugar: Trofeo + $2,000            │
│  2do Lugar: Medallas + $1,000          │
│  3er Lugar: Medallas                   │
└─────────────────────────────────────────┘
```

**Columna Derecha (30%):**

**Card de Detalles:**

```
┌─────────────────────────────┐
│  ℹ️ Detalles                │
│                             │
│  📅 Fecha                   │
│  25 Enero 2026              │
│                             │
│  🕐 Hora                    │
│  10:00 AM - 2:00 PM        │
│                             │
│  📍 Ubicación               │
│  Campo deportivo ESTL       │
│  [Ver en mapa 🗺️]          │
│                             │
│  👥 Capacidad               │
│  45 / 60 registrados        │
│  ████████████████░░░        │
│                             │
│  💰 Costo                   │
│  $50 por equipo             │
│                             │
│  📆 Registro hasta          │
│  24 Enero 2026              │
│                             │
│  👤 Organizador             │
│  Juan Pérez                 │
│  Comité Deportivo           │
└─────────────────────────────┘
```

**Card de Acciones:**

```
┌─────────────────────────────┐
│  [Registrarme Ahora]        │
│  (Botón verde grande)       │
│                             │
│  [Compartir Evento]         │
│  📱 WhatsApp                │
│  📘 Facebook                │
│  📧 Email                   │
│  🔗 Copiar enlace           │
│                             │
│  [Descargar Poster PDF]     │
│  [Agregar a Calendar]       │
└─────────────────────────────┘
```

---

### TAB 2: PARTICIPANTES

**Header:**

```
Total de Registros: 45        [Buscar...] [Exportar Excel]
```

**Tabla de Participantes:**

```
┌──────────────────────────────────────────────────────────┐
│ #  │ Equipo        │ Capitán         │ Tel         │ ✓ │
├────┼───────────────┼─────────────────┼─────────────┼───┤
│ 1  │ Los Tigres    │ Juan Pérez      │ 777-123... │ ✓ │
│ 2  │ Las Águilas   │ María García    │ 777-456... │ ✓ │
│ 3  │ Los Lobos     │ Carlos López    │ 777-789... │ ⏳│
├────┴───────────────┴─────────────────┴─────────────┴───┤
│           [Cargar más...] (si hay más de 20)            │
└──────────────────────────────────────────────────────────┘
```

**Estados de Pago:**

- ✓ Verde: Pagado
- ⏳ Amarillo: Pendiente
- ✗ Rojo: Vencido

**Acciones por Fila:**

- Ver detalles completos del equipo
- Marcar como pagado
- Enviar recordatorio
- Eliminar registro (con confirmación)

---

### TAB 3: ESTADÍSTICAS

**Grid de Stats:**

```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ Registros      │  │ Ingresos       │  │ Asistencia     │
│ Totales        │  │ Generados      │  │ Confirmada     │
│                │  │                │  │                │
│     45         │  │   $2,250       │  │     42         │
│ de 60 cupos    │  │ de $3,000      │  │ (93%)          │
└────────────────┘  └────────────────┘  └────────────────┘
```

**Gráfica de Registros:**

```
Registros por Día
┌─────────────────────────────────────────┐
│                                    •••  │
│                               •••••     │
│                          •••••          │
│                     •••••               │
│                ••••                     │
│           •••••                         │
│      ••••                               │
│ •••••                                   │
└─────────────────────────────────────────┘
 10  11  12  13  14  15  16  17  18  19
 Ene Ene Ene Ene Ene Ene Ene Ene Ene Ene
```

**Métodos de Pago (Pie Chart):**

```
     Efectivo  Transferencia
        60%         40%
```

---

## PÁGINA DE ADMINISTRACIÓN DEL EVENTO

### PARA ORGANIZADORES (Acceso restringido)

**Dashboard del Evento:**

```
┌──────────────────────────────────────────────────────────┐
│  🏀 Torneo de Fútbol 5vs5                    [Editar]    │
│  Estado: En curso                                        │
├──────────────────────────────────────────────────────────┤
│  Quick Actions:                                          │
│  [✓ Marcar Asistencia] [💰 Registrar Pago]              │
│  [📧 Enviar Email Masivo] [📱 Enviar WhatsApp]           │
├──────────────────────────────────────────────────────────┤
│  Lista de Equipos Registrados                            │
│  [Tabla con acciones inline]                             │
│                                                          │
│  Por cada equipo:                                        │
│  - Ver integrantes                                       │
│  - Marcar asistencia                                     │
│  - Actualizar estado de pago                             │
│  - Enviar mensaje                                        │
│  - Descargar datos                                       │
└──────────────────────────────────────────────────────────┘
```

**Modal: Marcar Asistencia Rápida**

```
┌─────────────────────────────────────┐
│  Check-in Rápido                    │
│                                     │
│  Buscar por nombre o # registro:   │
│  [___________________________] 🔍   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ #TF-042 - Los Tigres          │ │
│  │ Capitán: Juan Pérez           │ │
│  │ 5 integrantes                 │ │
│  │                               │ │
│  │ [Marcar Presente ✓]           │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## NOTIFICACIONES Y RECORDATORIOS

### Email de Confirmación (Preview en Modal)

```
┌─────────────────────────────────────────────┐
│  Asunto: Confirmación de Registro - Torneo │
│                                             │
│  Para: juan.perez@example.com              │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  [Header con logo UAEH verde]      │   │
│  │                                     │   │
│  │  ¡Hola Juan!                       │   │
│  │                                     │   │
│  │  Tu equipo "Los Tigres" ha sido    │   │
│  │  registrado exitosamente.          │   │
│  │                                     │   │
│  │  📋 Detalles del Registro:         │   │
│  │  • Evento: Torneo de Fútbol 5vs5  │   │
│  │  • Fecha: 25 Ene 2026, 10:00 AM   │   │
│  │  • Número: #TF-2026-042           │   │
│  │                                     │   │
│  │  [Ver Detalles Completos]          │   │
│  │                                     │   │
│  │  ¿Necesitas ayuda?                 │   │
│  │  Contacta: saestl@uaeh.edu.mx     │   │
│  │                                     │   │
│  │  [Footer UAEH]                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Vista Previa] [Enviar Ahora] [Programar] │
└─────────────────────────────────────────────┘
```

---

## RESPONSIVE MOBILE (375px)

### Lista de Eventos Mobile:

**Card Compacto:**

```
┌──────────────────────────┐
│ 25  🏀 Torneo Fútbol    │
│ ENE                      │
│ ──────────────────────   │
│ 📍 Campo ESTL           │
│ 🕐 10:00 AM             │
│ 👥 45/60  ████░░        │
│ [Ver] [Registrar]       │
└──────────────────────────┘
```

### Formulario Mobile:

- 1 columna
- Inputs: 48px height (mejor para touch)
- Labels arriba de inputs
- Botones: Full width
- Floating action button para submit
- Progress bar sticky en top

---

## ESPECIFICACIONES TÉCNICAS

**tipografía:**

```css
font-family: 'Poppins', sans-serif;

/* Headings */
h1: 28px Bold
h2: 24px Semibold
h3: 20px Semibold
h4: 18px Medium

/* Body */
body: 14px Regular
small: 12px Regular

/* Buttons */
button: 14px Semibold
```

**Espaciados:**

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
```

**Sombras:**

```css
--shadow-sm: 0 2px 4px rgba(45,95,63,0.06);
--shadow-md: 0 4px 12px rgba(45,95,63,0.08);
--shadow-lg: 0 8px 24px rgba(45,95,63,0.12);
--shadow-xl: 0 12px 40px rgba(45,95,63,0.16);
```

**Border Radius:**

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

---

## ANIMACIONES Y TRANSICIONES

**Hover States:**

```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transform: scale(1.02);
box-shadow: var(--shadow-lg);
```

**Loading States:**

- Skeleton con shimmer verde
- Spinner: Border verde rotando
- Progress bar: Animación de llenado

**Success States:**

- Checkmark animado (draw SVG)
- Confetti con colores UAEH
- Fade in suave

---

## ACCESIBILIDAD

- Contraste mínimo: WCAG AA (4.5:1)
- Focus visible: Outline verde 2px
- Labels en todos los inputs
- Alt text en imágenes
- ARIA labels en iconos
- Keyboard navigation completa
- Screen reader friendly

---

## ESTADOS ESPECIALES

**Estado Vacío:**

```
        📅
   No hay eventos próximos

 Sé el primero en crear un evento
     para la comunidad ESTL

    [Crear Evento +]
```

**Estado de Error:**

```
        ⚠️
   No se pudo cargar el evento

   Por favor intenta de nuevo

    [Reintentar]  [Ir al inicio]
```

**Evento Lleno:**

```
        🔒
     Cupo Lleno

Este evento ha alcanzado su
   capacidad máxima

[Ver Otros Eventos] [Lista de Espera]
```

**Evento Cancelado:**

```
        ❌
   Evento Cancelado

 Este evento ha sido cancelado
    por el organizador

Motivo: Cond
```