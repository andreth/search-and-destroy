




const MainRoutes = [
    {
        path: '/',
        component: () => import('../layouts/full/FullLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('../views/Home.vue'),
            },
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/dashboards/Modern.vue'),
            },
            {
                path: '/player',
                name: 'PlayerHome',
                component: () => import('../views/player/PlayerHome.vue'),
            },
            {
                path: '/profile',
                name: 'Profile',
                component: () => import('../views/player/PlayerProfile.vue'),
            },

            {
                name: 'Notes',
                path: '/apps/notes',
                component: () => import('../views/apps/notes/Notes.vue')
            },
            {
                name: 'Tickets',
                path: '/apps/tickets',
                component: () => import('../views/apps/tickets/Tickets.vue')
            },
            {
                name: 'Blog Posts',
                path: '/apps/blog/post',
                component: () => import('../views/apps/blog/Posts.vue')
            },
            {
                name: 'Blog Details',
                path: '/apps/blog/:slug',
                component: () => import('../views/apps/blog/[id].vue')
            },
            {
                name: 'Icon',
                path: '/icons/solar',
                component: () => import('../views/icons/Solar.vue')
            },
            {
                name: 'Shadcn Table',
                path: '/shadcn-table/basic',
                component: () => import('../views/shadcn-tables/BasicTable.vue')
            },
            {
                name: 'Shadcn Hover Table',
                path: '/shadcn-table/hover',
                component: () => import('../views/shadcn-tables/HoverTable.vue')
            },
            {
                name: 'Form',
                path: '/utilities/form',
                component: () => import('../views/utilities/Form.vue')
            },
            {
                name: 'User Profile',
                path: '/user-profile',
                component: () => import('../views/utilities/UserProfile.vue')
            },
            {
                name: 'Admin Utilisateurs',
                path: '/admin/users',
                component: () => import('../views/admin/Users.vue'),
                meta: { requiresAdmin: true },
            },
            {
                name: 'Admin Profil utilisateur',
                path: '/admin/users/:id',
                component: () => import('../views/admin/UserProfile.vue'),
                meta: { requiresAdmin: true },
            },
            {
                name: 'Admin Niveaux',
                path: '/admin/levels',
                component: () => import('../views/admin/Levels.vue'),
                meta: { requiresAdmin: true },
            },
            {
                name: 'Admin Tanks',
                path: '/admin/tanks',
                component: () => import('../views/admin/Tanks.vue'),
                meta: { requiresAdmin: true },
            },
            {
                name: 'Admin Planes',
                path: '/admin/planes',
                component: () => import('../views/admin/Planes.vue'),
                meta: { requiresAdmin: true },
            },
            {
                name: 'Admin Resources',
                path: '/admin/resources',
                component: () => import('../views/admin/Resources.vue'),
                meta: { requiresAdmin: true },
            },
        ],
    },
];



export default MainRoutes;
