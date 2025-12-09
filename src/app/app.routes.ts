import { Routes } from '@angular/router';
import { authGuard } from '@guard/auth.guard';
import { PATH, getPath } from '@route/path.route';

export const routes: Routes = [
  {
    path: getPath(PATH.admin), loadComponent: () => import('@module/admin/admin').then(m => m.Admin), canActivate: [authGuard],
    children: [

      // Profile routes
      { path: getPath(PATH.admin.profile), loadComponent: () => import('@module/admin/content/profile/profile').then(m => m.Profile),
        children: [
          { path: getPath(PATH.admin.profile.data), loadComponent: () => import('@module/admin/content/profile/content/profile-data/profile-data').then(m => m.ProfileData) },
          { path: getPath(PATH.admin.profile.update), loadComponent: () => import('@module/admin/content/profile/content/profile-update/profile-update').then(m => m.ProfileUpdate) },
          { path: getPath(PATH.admin.profile.commissions), loadComponent: () => import('@module/admin/content/profile/content/profile-commissions/profile-commissions').then(m => m.ProfileCommissions) },
          { path: '**', redirectTo: getPath(PATH.admin.profile.data), pathMatch: 'full'}
        ]
      },

      // MyOrders routes
      { path: getPath(PATH.admin.myorders), loadComponent: () => import('@module/admin/content/myorders/myorders').then(m => m.Myorders),
        children: [
          { path: getPath(PATH.admin.myorders.pending), loadComponent: () => import('@module/admin/content/myorders/content/myorders-pending/myorders-pending').then(m => m.MyordersPending) },
          { path: getPath(PATH.admin.myorders.byDate), loadComponent: () => import('@module/admin/content/myorders/content/myorders-bydate/myorders-bydate').then(m => m.MyordersBydate) },
          { path: getPath(PATH.admin.myorders.byNumber), loadComponent: () => import('@module/admin/content/myorders/content/myorders-bynumber/myorders-bynumber').then(m => m.MyordersBynumber) },
          { path: getPath(PATH.admin.myorders.completed), loadComponent: () => import('@module/admin/content/myorders/content/myorders-completed/myorders-completed').then(m => m.MyordersCompleted) },
          { path: getPath(PATH.admin.myorders.cancelled), loadComponent: () => import('@module/admin/content/myorders/content/myorders-cancelled/myorders-cancelled').then(m => m.MyordersCancelled) },
          { path: '**', redirectTo: getPath(PATH.admin.myorders.pending), pathMatch: 'full'}
        ]
      },

      // Orders routes
      { path: getPath(PATH.admin.orders), loadComponent: () => import('@module/admin/content/orders/orders').then(m => m.Orders),
        children: [
          { path: getPath(PATH.admin.orders.new), loadComponent: () => import('@module/admin/content/orders/content/orders-new/orders-new').then(m => m.OrdersNew) },
          { path: getPath(PATH.admin.orders.search), loadComponent: () => import('@module/admin/content/orders/content/orders-search/orders-search').then(m => m.OrdersSearch) },
          { path: getPath(PATH.admin.orders.pending), loadComponent: () => import('@module/admin/content/orders/content/orders-pending/orders-pending').then(m => m.OrdersPending) },
          { path: getPath(PATH.admin.orders.byDate), loadComponent: () => import('@module/admin/content/orders/content/orders-bydate/orders-bydate').then(m => m.OrdersBydate) },
          { path: getPath(PATH.admin.orders.byNumber), loadComponent: () => import('@module/admin/content/orders/content/orders-bynumber/orders-bynumber').then(m => m.OrdersBynumber) },
          { path: getPath(PATH.admin.orders.completed), loadComponent: () => import('@module/admin/content/orders/content/orders-completed/orders-completed').then(m => m.OrdersCompleted) },
          { path: getPath(PATH.admin.orders.cancelled), loadComponent: () => import('@module/admin/content/orders/content/orders-cancelled/orders-cancelled').then(m => m.OrdersCancelled) },
          { path: getPath(PATH.admin.orders.cancel), loadComponent: () => import('@module/admin/content/orders/content/orders-cancel/orders-cancel').then(m => m.OrdersCancel) },
          { path: '**', redirectTo: getPath(PATH.admin.orders.new), pathMatch: 'full'}
        ]
      },

      // Users routes
      { path: getPath(PATH.admin.users), loadComponent: () => import('@module/admin/content/users/users').then(m => m.Users),
        children: [
          { path: getPath(PATH.admin.users.new), loadComponent: () => import('@module/admin/content/users/content/users-new/users-new').then(m => m.UsersNew) },
          { path: getPath(PATH.admin.users.search), loadComponent: () => import('@module/admin/content/users/content/users-search/users-search').then(m => m.UsersSearch) },
          { path: getPath(PATH.admin.users.online), loadComponent: () => import('@module/admin/content/users/content/users-online/users-online').then(m => m.UsersOnline) },
          { path: getPath(PATH.admin.users.profile), loadComponent: () => import('@module/admin/content/users/content/users-profile/users-profile').then(m => m.UsersProfile) },
          { path: getPath(PATH.admin.users.update), loadComponent: () => import('@module/admin/content/users/content/users-update/users-update').then(m => m.UsersUpdate) },
          { path: getPath(PATH.admin.users.deactivate), loadComponent: () => import('@module/admin/content/users/content/users-deactivate/users-deactivate').then(m => m.UsersDeactivate) },
          { path: '**', redirectTo: getPath(PATH.admin.users.new), pathMatch: 'full'}
        ]
      },

      // Clients routes
      { path: getPath(PATH.admin.clients), loadComponent: () => import('@module/admin/content/clients/clients').then(m => m.Clients),
        children: [
          { path: getPath(PATH.admin.clients.new), loadComponent: () => import('@module/admin/content/clients/content/clients-new/clients-new').then(m => m.ClientsNew) },
          { path: getPath(PATH.admin.clients.search), loadComponent: () => import('@module/admin/content/clients/content/clients-search/clients-search').then(m => m.ClientsSearch) },
          { path: getPath(PATH.admin.clients.update), loadComponent: () => import('@module/admin/content/clients/content/clients-update/clients-update').then(m => m.ClientsUpdate) },
          { path: '**', redirectTo: getPath(PATH.admin.clients.new), pathMatch: 'full'}
        ]
      },

      // Audit routes
      { path: getPath(PATH.admin.audit), loadComponent: () => import('@module/admin/content/audit/audit').then(m => m.Audit),
        children: [
          { path: getPath(PATH.admin.audit.sessions), loadComponent: () => import('@module/admin/content/audit/content/audit-sessions/audit-sessions').then(m => m.AuditSessions) },
          { path: getPath(PATH.admin.audit.rollback), loadComponent: () => import('@module/admin/content/audit/content/audit-rollback/audit-rollback').then(m => m.AuditRollback) },
          { path: '**', redirectTo: getPath(PATH.admin.audit.sessions), pathMatch: 'full'}
        ]
      },

      // Offers routes
      { path: getPath(PATH.admin.offers), loadComponent: () => import('@module/admin/content/offers/offers').then(m => m.Offers),
        children: [
          { path: getPath(PATH.admin.offers.active), loadComponent: () => import('@module/admin/content/offers/content/offers-active/offers-active').then(m => m.OffersActive) },
          { path: getPath(PATH.admin.offers.new), loadComponent: () => import('@module/admin/content/offers/content/offers-new/offers-new').then(m => m.OffersNew) },
          { path: getPath(PATH.admin.offers.remove), loadComponent: () => import('@module/admin/content/offers/content/offers-remove/offers-remove').then(m => m.OffersRemove) },
          { path: '**', redirectTo: getPath(PATH.admin.offers.active), pathMatch: 'full'}
        ],
      },

      // Catalog routes
      { path: getPath(PATH.admin.catalog), loadComponent: () => import('@module/admin/content/catalog/catalog').then(m => m.Catalog) },

      { path: '**', redirectTo: getPath(PATH.admin.profile), pathMatch: 'full' },
    ]
  },
  { path: getPath(PATH.auth),
    children: [
      { path: getPath(PATH.auth.signIn), loadComponent: () => import('@module/auth/sing-in/sing-in').then(m => m.SingIn) },
      { path: getPath(PATH.auth.signUp), loadComponent: () => import('@module/auth/sing-up/sing-up').then(m => m.SingUp) },
      { path: getPath(PATH.auth.verifyEmail), loadComponent: () => import('@module/auth/verify-email/verify-email').then(m => m.VerifyEmail) },
      { path: '**', redirectTo: getPath(PATH.auth.signIn), pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: getPath(PATH.admin), pathMatch: 'full' },
];
