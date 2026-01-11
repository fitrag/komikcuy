import { ref, computed } from 'vue'
import * as authService from '../services/auth.js'

// Global reactive state
const user = ref(null)
const token = ref(null)
const loading = ref(false)
const error = ref(null)

// Initialize from localStorage
function initAuth() {
    token.value = authService.getToken()
    user.value = authService.getUser()
}

// Initialize on module load
initAuth()

export function useAuth() {
    const isLoggedIn = computed(() => !!token.value)
    const currentUser = computed(() => user.value)

    /**
     * Register a new user
     */
    async function register(name, email, password, password_confirmation) {
        loading.value = true
        error.value = null

        try {
            const result = await authService.register(name, email, password, password_confirmation)
            return { success: true, data: result }
        } catch (err) {
            error.value = err.message || 'Registration failed'
            return { success: false, error: err }
        } finally {
            loading.value = false
        }
    }

    /**
     * Login user
     */
    async function login(email, password) {
        loading.value = true
        error.value = null

        try {
            const result = await authService.login(email, password)
            
            // Update reactive state
            token.value = authService.getToken()
            user.value = authService.getUser()
            
            return { success: true, data: result }
        } catch (err) {
            error.value = err.message || 'Login failed'
            return { success: false, error: err }
        } finally {
            loading.value = false
        }
    }

    /**
     * Logout user
     */
    async function logout() {
        try {
            await authService.logout()
        } catch (e) {
            console.error('Logout error caught in composable:', e)
        } finally {
            // Always clear reactive state
            token.value = null
            user.value = null
            error.value = null
            loading.value = false
        }
    }

    /**
     * Clear any auth errors
     */
    function clearError() {
        error.value = null
    }

    return {
        // State
        user: currentUser,
        isLoggedIn,
        loading,
        error,
        
        // Methods
        register,
        login,
        logout,
        clearError,
        initAuth
    }
}
