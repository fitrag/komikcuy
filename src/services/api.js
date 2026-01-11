import { MANGA_ENDPOINTS, SEARCH_ENDPOINTS } from '../config.js'
import { getToken } from '../services/auth.js'

/**
 * Fetches the latest manga updates.
 * @returns {Promise<Array>} List of manga updates.
 */
export async function fetchUpdates() {
    try {
        const response = await fetch(MANGA_ENDPOINTS.updates);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // The API returns { anime_list: [...] }
        return data.anime_list || [];
    } catch (error) {
        console.error('Failed to fetch manga updates:', error);
        return [];
    }
}

/**
 * Fetches comic details by slug.
 * @param {string} slug 
 * @returns {Promise<Object>} Comic details.
 */
export async function fetchDetail(slug) {
    try {
        const response = await fetch(MANGA_ENDPOINTS.detail(slug));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch manga detail:', error);
        return null;
    }
}

/**
 * Fetches chapter images by slug.
 * @param {string} slug 
 * @returns {Promise<Object>} Chapter details.
 */
export async function fetchChapter(slug) {
    try {
        const response = await fetch(MANGA_ENDPOINTS.chapter(slug));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch chapter:', error);
        return null;
    }
}

/**
 * Fetches the project comics (curated list).
 * @returns {Promise<Array>} List of project comics.
 */
export async function fetchProjects() {
    try {
        const response = await fetch(MANGA_ENDPOINTS.projects);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.anime_list || [];
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return [];
    }
}

/**
 * Fetches comics from a specific page.
 * @param {number} page 
 * @returns {Promise<Array>} List of comics.
 */
export async function fetchComicsPage(page = 1) {
    try {
        const response = await fetch(MANGA_ENDPOINTS.page(page));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.anime_list || [];
    } catch (error) {
        console.error(`Failed to fetch comics page ${page}:`, error);
        return [];
    }
}

/**
 * Searches comics by keyword.
 * @param {string} keyword 
 * @param {number} page 
 * @returns {Promise<Array>} List of comics.
 */
export async function searchComics(keyword, page = 1) {
    try {
        const response = await fetch(MANGA_ENDPOINTS.search(page, keyword));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.anime_list || [];
    } catch (error) {
        console.error(`Failed to search comics for "${keyword}" page ${page}:`, error);
        return [];
    }
}

/**
 * Saves search keyword to the backend.
 * This runs silently without blocking search results.
 * @param {string} keyword The search keyword to save
 */
export async function saveSearchKeyword(keyword) {
    if (!keyword || typeof keyword !== 'string' || keyword.trim() === '') {
        return
    }

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        // Add auth token if user is logged in
        const token = getToken()
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        await fetch(SEARCH_ENDPOINTS.saveKeyword, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                keyword: keyword.trim()
            })
        })
        // Silently succeed or fail - don't block search results
    } catch (error) {
        // Silently fail - saving keyword shouldn't affect search UX
        console.debug('Failed to save search keyword:', error)
    }
}
