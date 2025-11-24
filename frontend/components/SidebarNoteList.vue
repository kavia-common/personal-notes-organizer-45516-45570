<template>
  <div class="sidebar flex flex-col h-full">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-gray-800">Notes</h1>
        <button
          @click="createNewNote"
          class="btn btn-primary text-sm"
          title="Create new note (Ctrl/Cmd + N)"
        >
          <Icon name="heroicons:plus" class="w-4 h-4 mr-1" />
          New
        </button>
      </div>
      
      <!-- Search -->
      <div class="relative mb-3">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search notes..."
          class="input pl-10 text-sm"
        />
      </div>
      
      <!-- Sort Options -->
      <div class="flex items-center space-x-2 mb-3">
        <select
          v-model="currentSortField"
          @change="updateSort"
          class="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
        >
          <option value="updatedAt">Last Modified</option>
          <option value="createdAt">Created Date</option>
          <option value="title">Title</option>
        </select>
        <button
          @click="toggleSortDirection"
          class="p-1 hover:bg-gray-100 rounded"
          :title="sortDirection === 'desc' ? 'Sort Ascending' : 'Sort Descending'"
        >
          <Icon 
            :name="sortDirection === 'desc' ? 'heroicons:chevron-down' : 'heroicons:chevron-up'" 
            class="w-4 h-4 text-gray-500"
          />
        </button>
      </div>
      
      <!-- Tags Filter -->
      <div v-if="allTags.length > 0" class="mb-2">
        <div class="text-xs text-gray-600 mb-1">Filter by tags:</div>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="tag in allTags.slice(0, showAllTags ? allTags.length : 6)"
            :key="tag"
            @click="toggleTagFilter(tag)"
            :class="[
              'text-xs px-2 py-1 rounded-full transition-colors',
              selectedTags.includes(tag)
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ tag }}
          </button>
          <button
            v-if="allTags.length > 6"
            @click="showAllTags = !showAllTags"
            class="text-xs text-primary hover:underline"
          >
            {{ showAllTags ? 'Less' : `+${allTags.length - 6} more` }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Notes List -->
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <div v-if="filteredNotes.length === 0" class="p-4 text-center text-gray-500">
        <Icon name="heroicons:document-text" class="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p class="text-sm">
          {{ searchQuery || selectedTags.length > 0 ? 'No notes found' : 'No notes yet' }}
        </p>
        <p v-if="searchQuery || selectedTags.length > 0" class="text-xs mt-1">
          Try adjusting your search or filters
        </p>
      </div>
      
      <div v-else class="space-y-1 p-2">
        <div
          v-for="note in filteredNotes"
          :key="note.id"
          @click="selectNote(note)"
          :class="[
            'p-3 rounded-lg cursor-pointer transition-all duration-200 animate-fade-in',
            currentNote?.id === note.id
              ? 'bg-primary bg-opacity-10 border border-primary border-opacity-30'
              : 'hover:bg-gray-50 border border-transparent'
          ]"
        >
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-medium text-sm text-gray-800 truncate flex-1 mr-2">
              {{ note.title || 'Untitled' }}
            </h3>
            <button
              @click.stop="deleteNote(note.id)"
              class="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500 transition-all"
              title="Delete note"
            >
              <Icon name="heroicons:trash" class="w-3 h-3" />
            </button>
          </div>
          
          <p class="text-xs text-gray-500 mb-2 line-clamp-2">
            {{ getPreview(note.content) }}
          </p>
          
          <div class="flex items-center justify-between">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tag in note.tags.slice(0, 3)"
                :key="tag"
                class="text-xs px-2 py-0.5 bg-secondary bg-opacity-20 text-secondary rounded-full"
              >
                {{ tag }}
              </span>
              <span
                v-if="note.tags.length > 3"
                class="text-xs text-gray-400"
              >
                +{{ note.tags.length - 3 }}
              </span>
            </div>
            
            <time class="text-xs text-gray-400">
              {{ formatDate(note.updatedAt) }}
            </time>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="p-3 border-t border-gray-200 bg-gray-50">
      <div class="text-xs text-gray-500 text-center">
        {{ filteredNotes.length }} of {{ notes.length }} notes
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from '~/stores/notes'
import type { Note } from '~/types/note'

const emit = defineEmits<{
  'note-selected': [note: Note]
}>()

const notesStore = useNotesStore()

// Reactive references
const searchQuery = ref('')
const currentSortField = ref('updatedAt')
const sortDirection = ref('desc')
const selectedTags = ref<string[]>([])
const showAllTags = ref(false)

// Computed properties
const { notes, currentNote, filteredNotes, allTags } = storeToRefs(notesStore)

// Watch for search changes
watch(searchQuery, (newQuery) => {
  notesStore.setFilter({ searchQuery: newQuery })
})

watch(selectedTags, (newTags) => {
  notesStore.setFilter({ selectedTags: newTags })
}, { deep: true })

// Methods
const createNewNote = () => {
  notesStore.createNote()
}

const selectNote = (note: Note) => {
  notesStore.selectNote(note)
  emit('note-selected', note)
}

const deleteNote = (id: string) => {
  if (confirm('Are you sure you want to delete this note?')) {
    notesStore.deleteNote(id)
  }
}

const updateSort = () => {
  notesStore.setSortOption({
    field: currentSortField.value as any,
    direction: sortDirection.value as any
  })
}

const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc'
  updateSort()
}

const toggleTagFilter = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const getPreview = (content: string): string => {
  // Remove markdown formatting for preview
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim()
  
  return plainText || 'No content'
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return new Date(date).toLocaleDateString()
  }
}

// Keyboard shortcuts
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault()
      createNewNote()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
