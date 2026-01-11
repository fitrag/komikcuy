import { AUTH_ENDPOINTS } from '../config.js'

const STORAGE_KEYS = {
    TOKEN: 'komikcuy_auth_token',
    USER: 'komikcuy_user'
}

/**
 * Register a new user
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @param {string} password_confirmation 
 * @returns {Promise<Object>} Response data
 */
export async function register(name, email, password, password_confirmation) {
    try {
        const response = await fetch(AUTH_ENDPOINTS.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation
            })
        })

        const data = await response.json()

        if (!response.ok) {
            throw {
                status: response.status,
                message: data.message || 'Registration failed',
                errors: data.errors || {}
            }
        }

        return data
    } catch (error) {
        if (error.status) {
            throw error
        }
        console.error('Registration error:', error)
        throw {
            status: 500,
            message: 'Network error. Please check your connection.',
            errors: {}
        }
    }
}

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Response data with token and user
 */
export async function login(email, password) {
    try {
        const response = await fetch(AUTH_ENDPOINTS.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        const data = await response.json()

        if (!response.ok) {
            throw {
                status: response.status,
                message: data.message || 'Login failed',
                errors: data.errors || {}
            }
        }

        // Store token and user data
        if (data.token) {
            setToken(data.token)
        }
        if (data.user) {
            setUser(data.user)
        }

        return data
    } catch (error) {
        if (error.status) {
            throw error
        }
        console.error('Login error:', error)
        throw {
            status: 500,
            message: 'Network error. Please check your connection.',
            errors: {}
        }
    }
}

// Logout user - call backend API and clear stored credentials
export async function logout() {
    try {
        const token = getToken()
        
        // Call backend logout endpoint if token exists
        if (token) {
            const response = await fetch(AUTH_ENDPOINTS.logout, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                console.warn('Logout API call failed:', response.status, await response.text())
            }
        }
    } catch (e) {
        // Silently fail API call - still proceed with local logout
        console.warn('Backend logout failed or network error:', e)
    } finally {
        // CRITICAL: Always clear local storage regardless of API call result
        try {
            localStorage.removeItem(STORAGE_KEYS.TOKEN)
            localStorage.removeItem(STORAGE_KEYS.USER)
            console.debug('Local auth storage cleared')
        } catch (e) {
            console.error('Error clearing local storage:', e)
        }
    }
}

/**
 * Get stored auth token
 * @returns {string|null}
 */
export function getToken() {
    try {
        return localStorage.getItem(STORAGE_KEYS.TOKEN)
    } catch (e) {
        return null
    }
}

/**
 * Set auth token
 * @param {string} token 
 */
export function setToken(token) {
    try {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    } catch (e) {
        console.error('Error storing token:', e)
    }
}

/**
 * Get stored user data
 * @returns {Object|null}
 */
export function getUser() {
    try {
        const user = localStorage.getItem(STORAGE_KEYS.USER)
        return user ? JSON.parse(user) : null
    } catch (e) {
        return null
    }
}

/**
 * Set user data
 * @param {Object} user 
 */
export function setUser(user) {
    try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    } catch (e) {
        console.error('Error storing user:', e)
    }
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
    return !!getToken()
}

export default {
    register,
    login,
    logout,
    getToken,
    setToken,
    getUser,
    setUser,
    isAuthenticated
}
