const KEYS = {
    FAVORITES: 'komikcuy_favorites',
    HISTORY: 'komikcuy_history',
    CHAPTERS_CACHE: 'komikcuy_chapters_cache'
}

// Max cached chapters (to save storage space)
const MAX_CACHED_CHAPTERS = 20

// Helpers
const getStorage = (key) => {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : []
    } catch (e) {
        console.error('Error reading from storage', e)
        return []
    }
}

const setStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.error('Error writing to storage', e)
    }
}

const getStorageObject = (key) => {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : {}
    } catch (e) {
        console.error('Error reading from storage', e)
        return {}
    }
}

// Favorites
export const getFavorites = () => getStorage(KEYS.FAVORITES)

export const isFavorite = (slug) => {
    const favorites = getFavorites()
    return favorites.some(c => c.link === slug)
}

export const toggleFavorite = (comic) => {
    const favorites = getFavorites()
    const index = favorites.findIndex(c => c.link === comic.link)

    if (index === -1) {
        favorites.push({
            link: comic.link,
            judul: comic.judul,
            img: comic.img,
            type: comic.type, // optional
            addedAt: Date.now()
        })
    } else {
        favorites.splice(index, 1)
    }

    setStorage(KEYS.FAVORITES, favorites)
    return index === -1 // returns true if added, false if removed
}

// History
export const getHistory = () => getStorage(KEYS.HISTORY)

export const addToHistory = (comic, chapter) => {
    let history = getHistory()
    // Remove existing entry for this comic if exists to push to top
    history = history.filter(h => h.link !== comic.link)

    history.unshift({
        link: comic.link,
        judul: comic.judul,
        img: comic.img,
        lastChapter: {
            title: chapter.judul,
            link: chapter.link // usually the slug for chapter
        },
        readAt: Date.now()
    })

    // Limit history size (e.g. 50 items)
    if (history.length > 50) {
        history.length = 50
    }

    setStorage(KEYS.HISTORY, history)
}

export const getContinueReading = () => {
    const history = getHistory()
    return history.slice(0, 6) // Return top 6 recent
}

// Chapter Cache for Offline Reading
export const cacheChapter = (slug, chapterData) => {
    try {
        const cache = getStorageObject(KEYS.CHAPTERS_CACHE)

        // Add or update chapter
        cache[slug] = {
            data: chapterData,
            cachedAt: Date.now()
        }

        // Clean up old entries if too many
        const slugs = Object.keys(cache)
        if (slugs.length > MAX_CACHED_CHAPTERS) {
            // Sort by cachedAt and remove oldest
            const sorted = slugs.sort((a, b) => cache[b].cachedAt - cache[a].cachedAt)
            const toRemove = sorted.slice(MAX_CACHED_CHAPTERS)
            toRemove.forEach(s => delete cache[s])
        }

        setStorage(KEYS.CHAPTERS_CACHE, cache)
        return true
    } catch (e) {
        console.error('Error caching chapter', e)
        return false
    }
}

export const getCachedChapter = (slug) => {
    try {
        const cache = getStorageObject(KEYS.CHAPTERS_CACHE)
        const entry = cache[slug]
        return entry ? entry.data : null
    } catch (e) {
        console.error('Error reading cached chapter', e)
        return null
    }
}

export const isChapterCached = (slug) => {
    const cache = getStorageObject(KEYS.CHAPTERS_CACHE)
    return !!cache[slug]
}

export const getCachedChaptersList = () => {
    const cache = getStorageObject(KEYS.CHAPTERS_CACHE)
    return Object.keys(cache)
}

