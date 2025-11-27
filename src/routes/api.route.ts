const BASE_URL_LOCAL = 'http://localhost:8000';
const BASE_URL_GLOBAL = 'https://your-production-url.com';

const BASE_URL = BASE_URL_LOCAL;

export const API_URL = {
  // Root
  root: `${BASE_URL}/`,
  health: `${BASE_URL}/health`,

  // Autenticación
  auth: {
    login: `${BASE_URL}/auth/login`,
    logout: (num_sesion: number) => `${BASE_URL}/auth/logout?num_sesion=${num_sesion}`,
    me: (cod_usuario: number) => `${BASE_URL}/auth/me?cod_usuario=${cod_usuario}`,
  },

  // Usuarios
  usuarios: {
    list: (params?: { skip?: number; limit?: number; estado?: number; nivel?: number }) => {
      const query = new URLSearchParams();
      if (params?.skip !== undefined) query.append('skip', params.skip.toString());
      if (params?.limit !== undefined) query.append('limit', params.limit.toString());
      if (params?.estado !== undefined) query.append('estado', params.estado.toString());
      if (params?.nivel !== undefined) query.append('nivel', params.nivel.toString());
      return `${BASE_URL}/usuarios/?${query.toString()}`;
    },
    create: `${BASE_URL}/usuarios/`,
    online: `${BASE_URL}/usuarios/online`,
    search: (q: string) => `${BASE_URL}/usuarios/search?q=${encodeURIComponent(q)}`,
    get: (cod_usuario: number) => `${BASE_URL}/usuarios/${cod_usuario}`,
    update: (cod_usuario: number) => `${BASE_URL}/usuarios/${cod_usuario}`,
    delete: (cod_usuario: number) => `${BASE_URL}/usuarios/${cod_usuario}`,
    deactivate: (cod_usuario: number) => `${BASE_URL}/usuarios/${cod_usuario}/deactivate`,
    activate: (cod_usuario: number) => `${BASE_URL}/usuarios/${cod_usuario}/activate`,
  },

  // Clientes
  clientes: {
    list: (params?: { skip?: number; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.skip !== undefined) query.append('skip', params.skip.toString());
      if (params?.limit !== undefined) query.append('limit', params.limit.toString());
      return `${BASE_URL}/clientes/?${query.toString()}`;
    },
    create: `${BASE_URL}/clientes/`,
    search: (q: string) => `${BASE_URL}/clientes/search?q=${encodeURIComponent(q)}`,
    get: (cod_cliente: string) => `${BASE_URL}/clientes/${cod_cliente}`,
    update: (cod_cliente: string) => `${BASE_URL}/clientes/${cod_cliente}`,
    delete: (cod_cliente: string) => `${BASE_URL}/clientes/${cod_cliente}`,
  },

  // Pedidos
  pedidos: {
    list: (params?: { skip?: number; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.skip !== undefined) query.append('skip', params.skip.toString());
      if (params?.limit !== undefined) query.append('limit', params.limit.toString());
      return `${BASE_URL}/pedidos/?${query.toString()}`;
    },
    create: `${BASE_URL}/pedidos/`,
    search: (params?: {
      cod_cliente?: string;
      fecha_inicio?: string;
      fecha_fin?: string;
      importe_min?: number;
      importe_max?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.cod_cliente) query.append('cod_cliente', params.cod_cliente);
      if (params?.fecha_inicio) query.append('fecha_inicio', params.fecha_inicio);
      if (params?.fecha_fin) query.append('fecha_fin', params.fecha_fin);
      if (params?.importe_min !== undefined)
        query.append('importe_min', params.importe_min.toString());
      if (params?.importe_max !== undefined)
        query.append('importe_max', params.importe_max.toString());
      return `${BASE_URL}/pedidos/search?${query.toString()}`;
    },
    byDate: (fecha: string) => `${BASE_URL}/pedidos/by-date?fecha=${fecha}`,
    byNumber: (num_pedido: number) => `${BASE_URL}/pedidos/by-number/${num_pedido}`,
    pending: `${BASE_URL}/pedidos/pending`,
    completed: `${BASE_URL}/pedidos/completed`,
    cancelled: `${BASE_URL}/pedidos/cancelled`,
    byCliente: (cod_cliente: string) => `${BASE_URL}/pedidos/cliente/${cod_cliente}`,
    estadisticas: (params?: { fecha_inicio?: string; fecha_fin?: string }) => {
      const query = new URLSearchParams();
      if (params?.fecha_inicio) query.append('fecha_inicio', params.fecha_inicio);
      if (params?.fecha_fin) query.append('fecha_fin', params.fecha_fin);
      return `${BASE_URL}/pedidos/estadisticas?${query.toString()}`;
    },
    update: (num_pedido: number) => `${BASE_URL}/pedidos/${num_pedido}`,
    delete: (num_pedido: number) => `${BASE_URL}/pedidos/${num_pedido}`,
    cancel: (num_pedido: number) => `${BASE_URL}/pedidos/${num_pedido}/cancel`,
  },

  // Artículos y Ofertas
  articulos: {
    list: (params?: { skip?: number; limit?: number; stock_min?: number }) => {
      const query = new URLSearchParams();
      if (params?.skip !== undefined) query.append('skip', params.skip.toString());
      if (params?.limit !== undefined) query.append('limit', params.limit.toString());
      if (params?.stock_min !== undefined) query.append('stock_min', params.stock_min.toString());
      return `${BASE_URL}/articulos/?${query.toString()}`;
    },
    create: `${BASE_URL}/articulos/`,
    search: (q: string) => `${BASE_URL}/articulos/search?q=${encodeURIComponent(q)}`,
    get: (cod_articulo: number) => `${BASE_URL}/articulos/${cod_articulo}`,
    update: (cod_articulo: number) => `${BASE_URL}/articulos/${cod_articulo}`,
    delete: (cod_articulo: number) => `${BASE_URL}/articulos/${cod_articulo}`,
    updateStock: (cod_articulo: number, cantidad: number) =>
      `${BASE_URL}/articulos/${cod_articulo}/stock?cantidad=${cantidad}`,
  },

  // Ofertas
  ofertas: {
    list: `${BASE_URL}/ofertas/`,
    create: `${BASE_URL}/ofertas/`,
    update: (cod_articulo: number) => `${BASE_URL}/ofertas/${cod_articulo}`,
    delete: (cod_articulo: number) => `${BASE_URL}/ofertas/${cod_articulo}`,
  },

  // Auditoría
  auditoria: {
    sesiones: (params?: {
      fecha_inicio?: string;
      fecha_fin?: string;
      estado?: number;
      skip?: number;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.fecha_inicio) query.append('fecha_inicio', params.fecha_inicio);
      if (params?.fecha_fin) query.append('fecha_fin', params.fecha_fin);
      if (params?.estado !== undefined) query.append('estado', params.estado.toString());
      if (params?.skip !== undefined) query.append('skip', params.skip.toString());
      if (params?.limit !== undefined) query.append('limit', params.limit.toString());
      return `${BASE_URL}/auditoria/sesiones?${query.toString()}`;
    },
    sesion: (num_sesion: number) => `${BASE_URL}/auditoria/sesiones/${num_sesion}`,
    acciones: (params?: {
      cod_usuario?: number;
      tabla?: string;
      accion?: number;
      skip?: number;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.cod_usuario !== undefined)
        query.append('cod_usuario', params.cod_usuario.toString());
      if (params?.tabla) query.append('tabla', params.tabla);
      if (params?.accion !== undefined) query.append('accion', params.accion.toString());
      if (params?.skip !== undefined) query.append('skip', params.skip.toString());
      if (params?.limit !== undefined) query.append('limit', params.limit.toString());
      return `${BASE_URL}/auditoria/acciones?${query.toString()}`;
    },
    actividadUsuario: (cod_usuario: number) =>
      `${BASE_URL}/auditoria/usuarios/${cod_usuario}/actividad`,
    resumen: `${BASE_URL}/auditoria/resumen`,
  },

  // Comisiones
  comisiones: {
    vendedor: (
      cod_usuario: number,
      params?: { fecha_inicio?: string; fecha_fin?: string; porcentaje?: number }
    ) => {
      const query = new URLSearchParams();
      if (params?.fecha_inicio) query.append('fecha_inicio', params.fecha_inicio);
      if (params?.fecha_fin) query.append('fecha_fin', params.fecha_fin);
      if (params?.porcentaje !== undefined)
        query.append('porcentaje', params.porcentaje.toString());
      return `${BASE_URL}/comisiones/vendedor/${cod_usuario}?${query.toString()}`;
    },
    detallesVendedor: (
      cod_usuario: number,
      params?: { fecha_inicio?: string; fecha_fin?: string; porcentaje?: number }
    ) => {
      const query = new URLSearchParams();
      if (params?.fecha_inicio) query.append('fecha_inicio', params.fecha_inicio);
      if (params?.fecha_fin) query.append('fecha_fin', params.fecha_fin);
      if (params?.porcentaje !== undefined)
        query.append('porcentaje', params.porcentaje.toString());
      return `${BASE_URL}/comisiones/vendedor/${cod_usuario}/detalles?${query.toString()}`;
    },
    resumen: (params?: { fecha_inicio?: string; fecha_fin?: string; porcentaje?: number }) => {
      const query = new URLSearchParams();
      if (params?.fecha_inicio) query.append('fecha_inicio', params.fecha_inicio);
      if (params?.fecha_fin) query.append('fecha_fin', params.fecha_fin);
      if (params?.porcentaje !== undefined)
        query.append('porcentaje', params.porcentaje.toString());
      return `${BASE_URL}/comisiones/resumen?${query.toString()}`;
    },
  },

  // Storage
  storage: {
    upload: `${BASE_URL}/storage/upload`,
  },
};
