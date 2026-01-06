<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchChapter } from '../services/api'
import { addToHistory, cacheChapter, getCachedChapter } from '../services/storage'
import LazyImage from '../components/LazyImage.vue'

const route = useRoute()
const router = useRouter()
const chapterData = ref(null)
const loading = ref(true)
const isOffline = ref(!navigator.onLine)
const isFromCache = ref(false)

// Listen for online/offline changes
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => { isOffline.value = false })
    window.addEventListener('offline', () => { isOffline.value = true })
}

const loadChapter = async () => {
    loading.value = true
    chapterData.value = null
    isFromCache.value = false
    
    const slug = route.params.slug
    if (!slug) {
        loading.value = false
        return
    }
    
    try {
        // Try to fetch from network first
        if (navigator.onLine) {
            const data = await fetchChapter(slug)
            if (data) {
                chapterData.value = data
                
                // Cache the chapter for offline reading
                cacheChapter(slug, data)
                
                // Add to history
                addToHistory({
                    link: slug.split('-chapter-')[0],
                    judul: route.query.title || data.judul || 'Unknown Comic',
                    img: route.query.img || '',
                }, {
                    judul: data.judul,
                    link: slug
                })
            }
        } else {
            // Offline - try to load from cache
            const cachedData = getCachedChapter(slug)
            if (cachedData) {
                chapterData.value = cachedData
                isFromCache.value = true
            }
        }
    } catch (error) {
        console.error('Error loading chapter:', error)
        // If network fails, try cache as fallback
        const cachedData = getCachedChapter(slug)
        if (cachedData) {
            chapterData.value = cachedData
            isFromCache.value = true
        }
    } finally {
        loading.value = false
        window.scrollTo(0, 0)
    }
}

onMounted(loadChapter)
watch(() => route.params.slug, loadChapter)

const navigateChapter = (slug) => {
    if (slug) {
        // Pass along comic info for history
        router.push({
            path: '/chapter/' + slug,
            query: {
                img: route.query.img,
                title: route.query.title
            }
        })
    }
}
</script>

<template>
    <div v-if="loading" class="animate-pulse space-y-4">
         <div class="h-10 w-1/2 mx-auto bg-slate-800/50 rounded-lg"></div>
         <div class="h-[80vh] w-full bg-slate-800/50 rounded-2xl"></div>
    </div>
    
    <!-- No content available (offline and not cached) -->
    <div v-else-if="!chapterData" class="text-center py-16">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
        </div>
        <h2 class="text-xl font-bold text-white mb-2">Chapter Not Available</h2>
        <p class="text-slate-400 mb-4">This chapter is not cached for offline reading.</p>
        <router-link to="/history" class="inline-block px-6 py-2.5 bg-amber-500 text-black font-bold rounded-xl">
            View Cached Chapters
        </router-link>
    </div>

    <div v-else-if="chapterData" class="max-w-4xl mx-auto -mx-4 md:mx-auto">
        <!-- Offline/Cached Badge -->
        <div v-if="isFromCache" class="mb-4 mx-4 md:mx-0">
            <div class="flex items-center gap-2 p-3 bg-amber-500/10 rounded-xl ring-1 ring-amber-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span class="text-sm text-amber-400">Reading from cached version (offline)</span>
            </div>
        </div>
        
        <!-- Desktop Navigation Header -->
        <div class="hidden md:flex mb-6 items-center justify-between gap-4 sticky top-0 bg-slate-950/90 backdrop-blur-md z-20 p-4 rounded-2xl ring-1 ring-white/10">
             <h1 class="text-base font-semibold text-white/90 line-clamp-1 flex-1 text-left">
                {{ chapterData.judul }}
             </h1>
             <div class="flex items-center gap-3">
                <button 
                    :disabled="!chapterData.prevlink" 
                    @click="navigateChapter(chapterData.prevlink)"
                    class="rounded-xl bg-slate-800/80 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-500 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 ring-1 ring-white/10 hover:ring-amber-500/30"
                >
                    ← Previous
                </button>
                 <button 
                    :disabled="!chapterData.nextlink" 
                    @click="navigateChapter(chapterData.nextlink)"
                    class="rounded-xl bg-slate-800/80 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-500 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 ring-1 ring-white/10 hover:ring-amber-500/30"
                >
                    Next →
                </button>
             </div>
        </div>
        
        <!-- Mobile Chapter Title -->
        <div class="md:hidden text-center py-3 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-800/50">
            <h1 class="text-sm font-medium text-white/80 line-clamp-1 px-4">
                {{ chapterData.judul }}
            </h1>
        </div>

        <!-- Images - Full width on mobile -->
        <div class="flex flex-col items-center bg-black md:bg-slate-900/30 md:backdrop-blur-sm md:rounded-2xl md:p-3 min-h-screen md:ring-1 md:ring-white/5">
            <LazyImage 
                v-for="(image, index) in chapterData.chapter" 
                :key="index"
                :src="image.chapter_image"
                :alt="'Page ' + (index + 1)"
                class="w-full max-w-3xl md:shadow-xl bg-slate-900 md:rounded-lg overflow-hidden"
                imgClass="w-full h-auto"
            />
        </div>

        <!-- Desktop Navigation Footer -->
        <div class="hidden md:flex mt-10 justify-center gap-4 pb-8">
            <button 
                :disabled="!chapterData.prevlink" 
                @click="navigateChapter(chapterData.prevlink)"
                class="group relative rounded-xl bg-slate-800/80 px-8 py-4 font-bold text-white hover:bg-amber-500 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ring-1 ring-white/10 hover:ring-amber-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20"
            >
                ← Previous Chapter
            </button>
             <button 
                :disabled="!chapterData.nextlink" 
                @click="navigateChapter(chapterData.nextlink)"
                class="group relative rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-bold text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5"
            >
                Next Chapter →
            </button>
        </div>
        
        <!-- Mobile Floating Navigation -->
        <div class="md:hidden fixed bottom-20 left-4 right-4 z-30 flex items-center justify-between gap-3 p-3 bg-slate-900/95 backdrop-blur-xl rounded-2xl ring-1 ring-white/10 shadow-2xl safe-area-inset">
            <button 
                :disabled="!chapterData.prevlink" 
                @click="navigateChapter(chapterData.prevlink)"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800/80 px-4 py-3.5 text-sm font-bold text-white active:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Prev
            </button>
            <button 
                :disabled="!chapterData.nextlink" 
                @click="navigateChapter(chapterData.nextlink)"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3.5 text-sm font-bold text-black active:from-amber-600 active:to-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped>
.safe-area-inset {
    margin-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
