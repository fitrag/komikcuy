import { ref, onMounted, onUnmounted } from 'vue'

// PWA Install prompt composable
export function usePWA() {
    const deferredPrompt = ref(null)
    const canInstall = ref(false)
    const isInstalled = ref(false)
    const isOffline = ref(!navigator.onLine)

    // Check if app is already installed
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
                return true
            }
        }

        return false
    }

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
        e.preventDefault()
        deferredPrompt.value = e
        canInstall.value = !checkInstalled()
    }

    // Handle app installed event
    const handleAppInstalled = () => {
        isInstalled.value = true
        canInstall.value = false
        deferredPrompt.value = null
    }

    // Network status handlers
    const handleOnline = () => {
        isOffline.value = false
    }

    const handleOffline = () => {
        isOffline.value = true
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

    onMounted(() => {
        // Check initial state
        checkInstalled()

        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleAppInstalled)

        // Listen for network changes
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
    })

    onUnmounted(() => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.removeEventListener('appinstalled', handleAppInstalled)
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
    })

    return {
        canInstall,
        isInstalled,
        isOffline,
        install,
        dismissInstall
    }
}
