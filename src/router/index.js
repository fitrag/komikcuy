import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailView from '../views/DetailView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/manga/:slug',
            name: 'detail',
            component: DetailView
        },
        {
            path: '/chapter/:slug',
            name: 'chapter',
            component: () => import('../views/ChapterView.vue')
        },
        {
            path: '/comics',
            name: 'all-comics',
            component: () => import('../views/AllComicsView.vue')
        },
        {
            path: '/search',
            name: 'search',
            component: () => import('../views/SearchView.vue')
        },
        {
            path: '/favorites',
            name: 'favorites',
            component: () => import('../views/FavoritesView.vue')
        },
        {
            path: '/history',
            name: 'history',
            component: () => import('../views/HistoryView.vue')
        }
    ]
})

export default router
