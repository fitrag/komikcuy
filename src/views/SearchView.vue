<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { searchComics, saveSearchKeyword } from '../services/api'
import ComicCard from '../components/ComicCard.vue'

const route = useRoute()
const comics = ref([])
const page = ref(1)
const loading = ref(false)
const hasMore = ref(true)
const observerTarget = ref(null)
let observer = null

const performSearch = async (isNewSearch = false) => {
    const keyword = route.query.q
    if (!keyword || loading.value || (!hasMore.value && !isNewSearch)) return
    
    loading.value = true
    if (isNewSearch) {
        comics.value = []
        page.value = 1
        hasMore.value = true
        
        // Save search keyword to backend (runs silently)
        saveSearchKeyword(keyword)
    }

    try {
        const newComics = await searchComics(keyword, page.value)
        if (newComics.length === 0) {
            hasMore.value = false
        } else {
             // Check for duplicates
            const existingLinks = new Set(comics.value.map(c => c.link))
            const uniqueNewComics = newComics.filter(c => !existingLinks.has(c.link))
            
            comics.value.push(...uniqueNewComics)
            page.value++
        }
    } catch (error) {
        console.error('Error searching comics:', error)
    } finally {
        loading.value = false
    }
}

watch(() => route.query.q, () => {
    performSearch(true)
})

onMounted(async () => {
    await performSearch(true)

    // Setup Observer
    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            performSearch()
        }
    }, {
        rootMargin: '200px',
    })

    if (observerTarget.value) {
        observer.observe(observerTarget.value)
    }
})

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
})
</script>

<template>
    <div class="space-y-10">
        <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
            <h1 class="text-2xl font-bold text-white">
                Search: <span class="text-amber-400">{{ route.query.q }}</span>
            </h1>
        </div>

        <div v-if="comics.length === 0 && !loading" class="text-center py-16">
            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <p class="text-slate-400 text-lg">No results found for "{{ route.query.q }}"</p>
            <router-link to="/" class="inline-block mt-4 text-amber-500 hover:text-amber-400 font-medium">← Back to Home</router-link>
        </div>

        <div class="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            <router-link 
                v-for="comic in comics" 
                :key="comic.link" 
                :to="'/manga/' + comic.link"
                class="block"
            >
                <ComicCard 
                    :title="comic.judul"
                    :image="comic.img"
                    :chapter="comic.chapter"
                    :time="comic.type"
                    :link="comic.link"
                />
            </router-link>
        </div>

        <!-- Loading State & Observer Target -->
        <div ref="observerTarget" class="py-10 flex justify-center w-full">
            <div v-if="loading" class="flex gap-2">
                <div class="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce"></div>
                <div class="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div class="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
            <p v-else-if="!hasMore && comics.length > 0" class="text-slate-500 text-sm">
                — End of results —
            </p>
        </div>
    </div>
</template>
