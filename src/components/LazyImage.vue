<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  aspectRatio: {
    type: String,
    default: '' // e.g. 'aspect-[3/4]'
  },
  imgClass: {
    type: String,
    default: ''
  }
})

const isLoaded = ref(false)
const imgRef = ref(null)

const onImageLoad = () => {
  isLoaded.value = true
}

</script>

<template>
  <div class="relative overflow-hidden bg-slate-800" :class="[aspectRatio, { 'rounded-xl': !aspectRatio.includes('rounded') }]">
    <!-- Skeleton / Placeholder -->
    <div 
        v-if="!isLoaded"
        class="absolute inset-0 animate-pulse bg-slate-800"
    ></div>

    <!-- Image -->
    <img 
      ref="imgRef"
      :src="src" 
      :alt="alt"
      loading="lazy"
      @load="onImageLoad"
      class="transition-opacity duration-700 ease-in-out"
      :class="[
        isLoaded ? 'opacity-100' : 'opacity-0',
        imgClass || 'h-full w-full object-cover'
      ]"
    />
    
    <!-- Slot for overlay content (like in ComicCard) -->
    <slot></slot>
  </div>
</template>
