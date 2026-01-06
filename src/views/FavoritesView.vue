<script setup>
import { ref, onMounted } from 'vue'
import { getFavorites } from '../services/storage'
import ComicCard from '../components/ComicCard.vue'

const favorites = ref([])

onMounted(() => {
    favorites.value = getFavorites()
})
</script>

<template>
    <div class="space-y-10">
        <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
            <h1 class="text-2xl font-bold text-white">My Favorites</h1>
            <span v-if="favorites.length > 0" class="ml-auto text-xs text-slate-500 font-medium bg-slate-800/50 px-3 py-1 rounded-full">{{ favorites.length }} saved</span>
        </div>

        <div v-if="favorites.length === 0" class="text-center py-16 bg-slate-900/50 backdrop-blur-sm rounded-2xl ring-1 ring-white/10">
            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </div>
            <p class="text-slate-400 text-lg">No favorites yet</p>
            <router-link to="/" class="inline-block mt-4 text-amber-500 hover:text-amber-400 font-medium">← Browse Comics</router-link>
        </div>

        <div class="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            <router-link 
                v-for="comic in favorites" 
                :key="comic.link" 
                :to="'/manga/' + comic.link"
                class="block"
            >
                <ComicCard 
                    :title="comic.judul"
                    :image="comic.img"
                    :chapter="comic.type"
                    :time="'Saved'" 
                    :link="comic.link"
                />
            </router-link>
        </div>
    </div>
</template>
