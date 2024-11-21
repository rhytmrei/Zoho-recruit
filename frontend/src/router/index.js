import { createRouter, createWebHistory } from 'vue-router';
import AuthView from '../views/AuthView.vue';
import IndexView from "../views/home/IndexView.vue";
import ApplicationView from "../views/home/ApplicationView.vue";
import NewForm from "../components/home/NewForm.vue";
import Layout from "../views/home/Layout.vue";

const isAuthenticated = () => {
    return !!localStorage.getItem('jwt_token');
}

const routes = [
    {
        path: '/auth',
        name: 'Auth',
        component: AuthView,
        meta: { guestOnly: true },
    },
    {
        path: '/',
        component: Layout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                component: IndexView,
            },
            {
                path: '/new',
                component: NewForm,
            },
            {
                path: '/view/:id',
                component: ApplicationView,
                props: true,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta.requiresAuth;
    const guestOnly = to.meta.guestOnly;
    const isLoggedIn = isAuthenticated();

    if (requiresAuth && !isLoggedIn) {
        return next('/auth');
    }

    if (guestOnly && isLoggedIn) {
        return next('/');
    }

    next();
});

export default router;
