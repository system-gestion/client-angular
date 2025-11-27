export type PathNode = {
  _path: string;
  [key: string]: any;
};

export function buildPath(node: PathNode): string {
  const findFullPath = (obj: any, target: PathNode, path: string[] = []): string[] | null => {
    if (!obj || typeof obj !== 'object') return null;

    if (obj === target) {
      return path;
    }

    for (const key in obj) {
      if (key === '_path') continue;

      const value = obj[key];
      const nextPath =
        '_path' in obj && typeof obj._path === 'string' ? [...path, obj._path] : path;

      const result = findFullPath(value, target, nextPath);
      if (result) return result;
    }

    return null;
  };

  const fullPath = findFullPath(PATH, node);

  if (!fullPath) {
    return node._path ?? '';
  }

  return [...fullPath, node._path].filter(Boolean).join('/');
}

export function getPath(node: PathNode): string {
  return node._path;
}

export const PATH = {
  auth: {
    _path: 'auth',
    signIn: { _path: 'sign-in' },
    signUp: { _path: 'sign-up' },
  },
  admin: {
    _path: 'admin',
    profile: {
      _path: 'profile',
      data: { _path: 'data' },
      update: { _path: 'update' },
      commissions: { _path: 'commissions' },
    },

    myorders: {
      _path: 'myorders',
      pending: { _path: 'pending' },
      byDate: { _path: 'by-date' },
      byNumber: { _path: 'by-number' },
      completed: { _path: 'completed' },
      cancelled: { _path: 'cancelled' },
    },

    orders: {
      _path: 'orders',
      new: { _path: 'new' },
      search: { _path: 'search' },
      pending: { _path: 'pending' },
      byDate: { _path: 'by-date' },
      byNumber: { _path: 'by-number' },
      completed: { _path: 'completed' },
      cancelled: { _path: 'cancelled' },
      cancel: { _path: 'cancel' },
    },

    // Users (Supervisor)
    users: {
      _path: 'users',
      new: { _path: 'new' },
      search: { _path: 'search' },
      online: { _path: 'online' },
      profile: { _path: 'profile' },
      update: { _path: 'update' },
      deactivate: { _path: 'deactivate' },
    },

    clients: {
      _path: 'clients',
      new: { _path: 'new' },
      search: { _path: 'search' },
      update: { _path: 'update' },
    },

    audit: {
      _path: 'audit',
      sessions: { _path: 'sessions' },
      rollback: { _path: 'rollback' },
    },

    offers: {
      _path: 'offers',
      new: { _path: 'new' },
      remove: { _path: 'remove' },
      active: { _path: 'active' },
    },
  },
} as const;

export const ROUTE_CONFIG = {
  // Rutas por defecto según el nivel
  defaultRoutes: {
    1: buildPath(PATH.admin.audit.sessions), // Supervisor -> Auditoría
    2: buildPath(PATH.admin.orders.search), // Vendedor -> Pedidos
    3: buildPath(PATH.admin.myorders.pending), // Cliente -> Mis Pedidos
  },

  // Control de acceso a rutas
  routeAccess: {
    // Profile - Todos pueden acceder
    [buildPath(PATH.admin.profile)]: [1, 2, 3],
    [buildPath(PATH.admin.profile.data)]: [1, 2, 3],
    [buildPath(PATH.admin.profile.update)]: [1, 2, 3],
    [buildPath(PATH.admin.profile.commissions)]: [2], // Solo vendedores

    // MyOrders - Solo clientes
    [buildPath(PATH.admin.myorders)]: [3],
    [buildPath(PATH.admin.myorders.pending)]: [3],
    [buildPath(PATH.admin.myorders.byDate)]: [3],
    [buildPath(PATH.admin.myorders.byNumber)]: [3],
    [buildPath(PATH.admin.myorders.completed)]: [3],
    [buildPath(PATH.admin.myorders.cancelled)]: [3],

    // Orders - Solo vendedores
    [buildPath(PATH.admin.orders)]: [2],
    [buildPath(PATH.admin.orders.new)]: [2],
    [buildPath(PATH.admin.orders.search)]: [2],
    [buildPath(PATH.admin.orders.pending)]: [2],
    [buildPath(PATH.admin.orders.byDate)]: [2],
    [buildPath(PATH.admin.orders.byNumber)]: [2],
    [buildPath(PATH.admin.orders.completed)]: [2],
    [buildPath(PATH.admin.orders.cancelled)]: [2],
    [buildPath(PATH.admin.orders.cancel)]: [2],

    // Users - Solo supervisores
    [buildPath(PATH.admin.users)]: [1],
    [buildPath(PATH.admin.users.new)]: [1],
    [buildPath(PATH.admin.users.search)]: [1],
    [buildPath(PATH.admin.users.online)]: [1],
    [buildPath(PATH.admin.users.profile)]: [1],
    [buildPath(PATH.admin.users.update)]: [1],
    [buildPath(PATH.admin.users.deactivate)]: [1],

    // Clients - Solo vendedores
    [buildPath(PATH.admin.clients)]: [2],
    [buildPath(PATH.admin.clients.new)]: [2],
    [buildPath(PATH.admin.clients.search)]: [2],
    [buildPath(PATH.admin.clients.update)]: [2],

    // Audit - Solo supervisores
    [buildPath(PATH.admin.audit)]: [1],
    [buildPath(PATH.admin.audit.sessions)]: [1],
    [buildPath(PATH.admin.audit.rollback)]: [1],

    // Offers - Vendedores y clientes
    [buildPath(PATH.admin.offers)]: [2, 3],
    [buildPath(PATH.admin.offers.new)]: [2],
    [buildPath(PATH.admin.offers.remove)]: [2],
    [buildPath(PATH.admin.offers.active)]: [2, 3],
  } as Record<string, number[]>,
};

export function canAccessRoute(route: string, nivel: number): boolean {
  const allowedLevels = ROUTE_CONFIG.routeAccess[route];
  return allowedLevels ? allowedLevels.includes(nivel) : false;
}

export function getDefaultRoute(nivel: number): string {
  return ROUTE_CONFIG.defaultRoutes[nivel as keyof typeof ROUTE_CONFIG.defaultRoutes];
}
