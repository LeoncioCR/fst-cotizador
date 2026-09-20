INSERT INTO public.permissions (
    name,
    module,
    display_name,
    description,
    is_system
)
VALUES

-- DASHBOARD

(
    'dashboard.ver',
    'dashboard',
    'Ver dashboard',
    'Permite acceder al dashboard principal.',
    TRUE
),

-- USUARIOS

(
    'usuarios.ver',
    'usuarios',
    'Ver usuarios',
    'Permite consultar usuarios.',
    TRUE
),

(
    'usuarios.crear',
    'usuarios',
    'Crear usuarios',
    'Permite crear e invitar usuarios.',
    TRUE
),

(
    'usuarios.editar',
    'usuarios',
    'Editar usuarios',
    'Permite modificar información de usuarios.',
    TRUE
),

(
    'usuarios.cambiar_estado',
    'usuarios',
    'Activar o desactivar usuarios',
    'Permite cambiar el estado de acceso de los usuarios.',
    TRUE
),

(
    'usuarios.asignar_roles',
    'usuarios',
    'Asignar roles',
    'Permite modificar los roles asignados a un usuario.',
    TRUE
),

-- ROLES

(
    'roles.ver',
    'roles',
    'Ver roles',
    'Permite consultar roles.',
    TRUE
),

(
    'roles.crear',
    'roles',
    'Crear roles',
    'Permite crear roles.',
    TRUE
),

(
    'roles.editar',
    'roles',
    'Editar roles',
    'Permite modificar roles.',
    TRUE
),

(
    'roles.eliminar',
    'roles',
    'Eliminar roles',
    'Permite eliminar roles que no estén protegidos ni asignados.',
    TRUE
),

(
    'roles.asignar_permisos',
    'roles',
    'Asignar permisos',
    'Permite configurar los permisos pertenecientes a un rol.',
    TRUE
),

-- CLIENTES

(
    'clientes.ver',
    'clientes',
    'Ver clientes',
    'Permite consultar clientes.',
    TRUE
),

(
    'clientes.crear',
    'clientes',
    'Crear clientes',
    'Permite registrar clientes.',
    TRUE
),

(
    'clientes.editar',
    'clientes',
    'Editar clientes',
    'Permite modificar clientes.',
    TRUE
),

(
    'clientes.cambiar_estado',
    'clientes',
    'Cambiar estado de clientes',
    'Permite activar o desactivar clientes.',
    TRUE
),

-- CATÁLOGO

(
    'catalogo.ver',
    'catalogo',
    'Ver catálogo',
    'Permite consultar el catálogo del cotizador.',
    TRUE
),

(
    'catalogo.crear',
    'catalogo',
    'Crear registros del catálogo',
    'Permite registrar servicios, concursos, subsidios o bonos.',
    TRUE
),

(
    'catalogo.editar',
    'catalogo',
    'Editar catálogo',
    'Permite modificar información del catálogo.',
    TRUE
),

(
    'catalogo.cambiar_estado',
    'catalogo',
    'Cambiar estado del catálogo',
    'Permite activar, cerrar o desactivar registros.',
    TRUE
),

-- PRECIOS

(
    'precios.ver',
    'precios',
    'Ver precios',
    'Permite consultar precios y condiciones comerciales.',
    TRUE
),

(
    'precios.editar',
    'precios',
    'Editar precios',
    'Permite modificar precios, descuentos y condiciones comerciales.',
    TRUE
),

-- MEDIOS DE PAGO

(
    'medios_pago.ver',
    'medios_pago',
    'Ver medios de pago',
    'Permite consultar cuentas y medios de pago.',
    TRUE
),

(
    'medios_pago.crear',
    'medios_pago',
    'Crear medios de pago',
    'Permite registrar cuentas bancarias y otros medios.',
    TRUE
),

(
    'medios_pago.editar',
    'medios_pago',
    'Editar medios de pago',
    'Permite modificar medios de pago.',
    TRUE
),

(
    'medios_pago.cambiar_estado',
    'medios_pago',
    'Cambiar estado de medios de pago',
    'Permite activar o desactivar medios de pago.',
    TRUE
),

-- COTIZACIONES

(
    'cotizaciones.ver',
    'cotizaciones',
    'Ver cotizaciones',
    'Permite consultar cotizaciones.',
    TRUE
),

(
    'cotizaciones.crear',
    'cotizaciones',
    'Crear cotizaciones',
    'Permite crear nuevas cotizaciones.',
    TRUE
),

(
    'cotizaciones.editar',
    'cotizaciones',
    'Editar cotizaciones',
    'Permite modificar cotizaciones editables.',
    TRUE
),

(
    'cotizaciones.anular',
    'cotizaciones',
    'Anular cotizaciones',
    'Permite anular una cotización sin eliminarla.',
    TRUE
),

(
    'cotizaciones.enviar_revision',
    'cotizaciones',
    'Enviar a revisión',
    'Permite enviar cotizaciones a revisión.',
    TRUE
),

(
    'cotizaciones.generar_pdf',
    'cotizaciones',
    'Generar PDF',
    'Permite generar el documento PDF de una cotización.',
    TRUE
),

-- APROBACIONES

(
    'aprobaciones.ver',
    'aprobaciones',
    'Ver aprobaciones',
    'Permite consultar cotizaciones pendientes de aprobación.',
    TRUE
),

(
    'aprobaciones.aprobar',
    'aprobaciones',
    'Aprobar cotizaciones',
    'Permite aprobar cotizaciones.',
    TRUE
),

(
    'aprobaciones.observar',
    'aprobaciones',
    'Observar cotizaciones',
    'Permite observar una cotización y registrar comentarios.',
    TRUE
),

-- DOCUMENTOS

(
    'documentos.ver',
    'documentos',
    'Ver documentos',
    'Permite consultar documentos relacionados con cotizaciones.',
    TRUE
),

(
    'documentos.descargar',
    'documentos',
    'Descargar documentos',
    'Permite descargar documentos.',
    TRUE
),

-- SEGUIMIENTO

(
    'seguimiento.ver',
    'seguimiento',
    'Ver seguimiento',
    'Permite consultar el seguimiento comercial.',
    TRUE
),

(
    'seguimiento.crear',
    'seguimiento',
    'Crear seguimiento',
    'Permite registrar actividades comerciales.',
    TRUE
),

(
    'seguimiento.editar',
    'seguimiento',
    'Editar seguimiento',
    'Permite modificar actividades comerciales.',
    TRUE
),

-- REPORTES

(
    'reportes.ver',
    'reportes',
    'Ver reportes',
    'Permite consultar reportes.',
    TRUE
),

(
    'reportes.exportar',
    'reportes',
    'Exportar reportes',
    'Permite exportar información.',
    TRUE
),

-- CONFIGURACIÓN

(
    'configuracion.ver',
    'configuracion',
    'Ver configuración',
    'Permite consultar la configuración empresarial.',
    TRUE
),

(
    'configuracion.editar',
    'configuracion',
    'Editar configuración',
    'Permite modificar configuración empresarial.',
    TRUE
),

-- AUDITORÍA

(
    'auditoria.ver',
    'auditoria',
    'Ver auditoría',
    'Permite consultar el registro de auditoría.',
    TRUE
)

ON CONFLICT (name)
DO NOTHING;

INSERT INTO public.role_permissions (
    role_id,
    permission_id
)

SELECT
    r.id,
    p.id

FROM public.roles r

CROSS JOIN public.permissions p

WHERE r.name = 'administrador'

ON CONFLICT (
    role_id,
    permission_id
)
DO NOTHING;