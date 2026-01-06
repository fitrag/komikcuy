<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { fetchComicsPage } from '../services/api'
import ComicCard from '../components/ComicCard.vue'

const comics = ref([])
const page = ref(1)
const loading = ref(false)
const hasMore = ref(true)
const observerTarget = ref(null)
let observer = null

const loadMore = async () => {
    if (loading.value || !hasMore.value) return
    
    loading.value = true
    try {
        const newComics = await fetchComicsPage(page.value)
        if (newComics.length === 0) {
            hasMore.value = false
        } else {
            // Check for duplicates before adding
            const existingLinks = new Set(comics.value.map(c => c.link))
            const uniqueNewComics = newComics.filter(c => !existingLinks.has(c.link))
            
            if (uniqueNewComics.length === 0 && newComics.length > 0) {
                 // If we got data but they are all duplicates, it might mean we're fetching same page or end of unique content
                 // For now, let's just increment page and try next
            }
            
            comics.value.push(...uniqueNewComics)
            page.value++
        }
    } catch (error) {
        console.error('Error loading more comics:', error)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    // Initial load
    await loadMore()

    // Setup Intersection Observer
    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadMore()
        }
    }, {
        rootMargin: '200px', // Load before reaching bottom
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
            <h1 class="text-2xl font-bold text-white">All Comics</h1>
            <span v-if="comics.length > 0" class="ml-auto text-xs text-slate-500 font-medium bg-slate-800/50 px-3 py-1 rounded-full">{{ comics.length }}+ comics</span>
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
                — You've reached the end —
            </p>
        </div>
    </div>
</template>
