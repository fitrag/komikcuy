import { ref, onMounted, onUnmounted } from 'vue'

// Global state
const deferredPrompt = ref(null)
const canInstall = ref(false)
const isInstalled = ref(false)
const isOffline = ref(typeof navigator !== 'undefined' ? !navigator.onLine : false)

// Helper: Check if app is installed
const checkInstalled = () => {
    // Check if running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
        isInstalled.value = true
        return true
    }

    // Check iOS standalone
    if (window.navigator.standalone === true) {
        isInstalled.value = true
        return true
    }

    // Check localStorage for dismissed install
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
        const dismissedDate = new Date(dismissed)
        const now = new Date()
        // Show again after 7 days
        if ((now - dismissedDate) / (1000 * 60 * 60 * 24) < 7) {
            return true // It counts as "installed/dismissed" so don't show prompt
        }
    }

    return false
}

// Event Handlers
const handleBeforeInstallPrompt = (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    canInstall.value = !checkInstalled()
}

const handleAppInstalled = () => {
    isInstalled.value = true
    canInstall.value = false
    deferredPrompt.value = null
}

const handleOnline = () => {
    isOffline.value = false
}

const handleOffline = () => {
    isOffline.value = true
}

// Logic to initialize listeners once
let initialized = false

export function usePWA() {
    // Initialize listeners only once
    if (!initialized && typeof window !== 'undefined') {
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleAppInstalled)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        
        // Initial check
        checkInstalled()
        
        initialized = true
    }

    // Trigger install prompt
    const install = async () => {
        if (!deferredPrompt.value) return false

        try {
            deferredPrompt.value.prompt()
            const { outcome } = await deferredPrompt.value.userChoice

            if (outcome === 'accepted') {
                isInstalled.value = true
                canInstall.value = false
            }

            deferredPrompt.value = null
            return outcome === 'accepted'
        } catch (error) {
            console.error('Install error:', error)
            return false
        }
    }

    // Dismiss install prompt
    const dismissInstall = () => {
        canInstall.value = false
        localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
    }

    return {
        canInstall,
        isInstalled,
        isOffline,
        install,
        dismissInstall
    }
}
