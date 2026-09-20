export const PERMISSIONS = {
  DASHBOARD: {
    VIEW: "dashboard.ver",
  },

  USERS: {
    VIEW: "usuarios.ver",
    CREATE: "usuarios.crear",
    EDIT: "usuarios.editar",
    CHANGE_STATUS: "usuarios.cambiar_estado",
    ASSIGN_ROLES: "usuarios.asignar_roles",
  },

  ROLES: {
    VIEW: "roles.ver",
    CREATE: "roles.crear",
    EDIT: "roles.editar",
    DELETE: "roles.eliminar",
    ASSIGN_PERMISSIONS: "roles.asignar_permisos",
  },

  CLIENTS: {
    VIEW: "clientes.ver",
    CREATE: "clientes.crear",
    EDIT: "clientes.editar",
    CHANGE_STATUS: "clientes.cambiar_estado",
  },

  CATALOG: {
    VIEW: "catalogo.ver",
    CREATE: "catalogo.crear",
    EDIT: "catalogo.editar",
    CHANGE_STATUS: "catalogo.cambiar_estado",
  },

  PRICING: {
    VIEW: "precios.ver",
    EDIT: "precios.editar",
  },

  PAYMENT_METHODS: {
    VIEW: "medios_pago.ver",
    CREATE: "medios_pago.crear",
    EDIT: "medios_pago.editar",
    CHANGE_STATUS: "medios_pago.cambiar_estado",
  },

  QUOTATIONS: {
    VIEW: "cotizaciones.ver",
    CREATE: "cotizaciones.crear",
    EDIT: "cotizaciones.editar",
    CANCEL: "cotizaciones.anular",

    SUBMIT_REVIEW: "cotizaciones.enviar_revision",

    GENERATE_PDF: "cotizaciones.generar_pdf",
  },

  APPROVALS: {
    VIEW: "aprobaciones.ver",
    APPROVE: "aprobaciones.aprobar",
    OBSERVE: "aprobaciones.observar",
  },

  DOCUMENTS: {
    VIEW: "documentos.ver",
    DOWNLOAD: "documentos.descargar",
  },

  TRACKING: {
    VIEW: "seguimiento.ver",
    CREATE: "seguimiento.crear",
    EDIT: "seguimiento.editar",
  },

  REPORTS: {
    VIEW: "reportes.ver",
    EXPORT: "reportes.exportar",
  },

  SETTINGS: {
    VIEW: "configuracion.ver",
    EDIT: "configuracion.editar",
  },

  AUDIT: {
    VIEW: "auditoria.ver",
  },
} as const;
