# Arquitectura — FST Cotizador

FST Cotizador utiliza una arquitectura de Monolito Modular
sobre Next.js.

## Capas

### Domain

Contiene las reglas y conceptos del negocio.

No depende de:

- Next.js
- React
- Supabase
- Google Drive
- infraestructura externa

### Application

Contiene:

- Casos de uso
- DTOs
- Puertos
- Servicios de aplicación

Orquesta el dominio.

### Infrastructure

Implementa acceso a:

- PostgreSQL / Supabase
- Google Drive
- almacenamiento
- servicios externos

### Presentation

Contiene:

- Componentes
- Formularios
- Server Actions
- Schemas de entrada
- ViewModels

## Dirección de dependencias

Presentation
↓
Application
↓
Domain

Infrastructure implementa puertos definidos por
Application o Domain.

## Reglas

1. Domain no depende de frameworks.
2. No colocar reglas de negocio en componentes React.
3. No colocar reglas de negocio en Route Handlers.
4. Los módulos no acceden directamente a tablas de otros módulos.
5. La comunicación entre módulos debe realizarse mediante APIs públicas.
6. Cada módulo expone su API mediante index.ts.
7. Supabase es una implementación de infraestructura.
8. Google Drive es una implementación de infraestructura.
9. PDF es una implementación de infraestructura.
10. Las cotizaciones emitidas deberán conservar snapshots históricos.

## Módulos

- Auth
- Identity
- Clients
- Catalog
- Pricing
- Payments
- Quotations
- Approvals
- Documents
- Tracking
- Notifications
- Dashboard
- Reports
- Settings
- Audit
