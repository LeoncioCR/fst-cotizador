INSERT INTO public.roles (
    name,
    display_name,
    description,
    is_system
)
VALUES

(
    'administrador',
    'Administrador',
    'Administración general del sistema.',
    TRUE
),

(
    'gerente',
    'Gerente',
    'Supervisión general y gestión empresarial.',
    FALSE
),

(
    'coordinador',
    'Coordinador',
    'Coordinación y supervisión operativa.',
    FALSE
),

(
    'gestor_comercial',
    'Gestor comercial',
    'Gestión de clientes y cotizaciones.',
    FALSE
),

(
    'finanzas',
    'Finanzas',
    'Gestión de información económica y financiera.',
    FALSE
),

(
    'auditor',
    'Auditor',
    'Acceso de consulta y auditoría.',
    FALSE
)

ON CONFLICT (name)
DO NOTHING;