/**
 * Application Configuration
 * Centralized config for API endpoints and app settings
 */

// API Base URLs from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'
export const MANGA_API_URL = import.meta.env.VITE_MANGA_API_URL || 'https://apimangav2-ecru.vercel.app/manga/v2'

// Auth endpoints
export const AUTH_ENDPOINTS = {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
}

// Manga API endpoints
export const MANGA_ENDPOINTS = {
    updates: `${MANGA_API_URL}/manga-update`,
    projects: `${MANGA_API_URL}/manga-project`,
    detail: (slug) => `${MANGA_API_URL}/detail/${slug}`,
    chapter: (slug) => `${MANGA_API_URL}/chapter/${slug}`,
    page: (page) => `${MANGA_API_URL}/page/${page}`,
    search: (page, keyword) => `${MANGA_API_URL}/page/${page}/${keyword}`,
}

// Search endpoints
export const SEARCH_ENDPOINTS = {
    saveKeyword: `${API_BASE_URL}/search`,
}

export default {
    API_BASE_URL,
    MANGA_API_URL,
    AUTH_ENDPOINTS,
    MANGA_ENDPOINTS,
    SEARCH_ENDPOINTS,
}
