import { defineStore } from 'pinia'
import type { Note, NoteFilter, NoteSortOption } from '~/types/note'

export const useNotesStore = defineStore('notes', () => {
  // State
  const notes = ref<Note[]>([])
  const currentNote = ref<Note | null>(null)
  const filter = ref<NoteFilter>({
    searchQuery: '',
    selectedTags: []
  })
  const sortOption = ref<NoteSortOption>({
    field: 'updatedAt',
    direction: 'desc'
  })
  const isLoading = ref(false)

  // Computed
  const allTags = computed(() => {
    const tagSet = new Set<string>()
    notes.value.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  const filteredNotes = computed(() => {
    let filtered = notes.value

    // Filter by search query
    if (filter.value.searchQuery) {
      const query = filter.value.searchQuery.toLowerCase()
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      )
    }

    // Filter by tags
    if (filter.value.selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        filter.value.selectedTags.some(tag => note.tags.includes(tag))
      )
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      const field = sortOption.value.field
      const direction = sortOption.value.direction
      
      let aVal = a[field]
      let bVal = b[field]
      
      if (field === 'updatedAt' || field === 'createdAt') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }
      
      const result = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      return direction === 'asc' ? result : -result
    })

    return filtered
  })

  // Actions
  const loadNotes = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('personal-notes')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          notes.value = parsed.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt)
          }))
        } catch (error) {
          console.error('Failed to load notes from localStorage:', error)
          initializeSampleData()
        }
      } else {
        initializeSampleData()
      }
    }
  }

  const saveNotes = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem('personal-notes', JSON.stringify(notes.value))
      } catch (error) {
        console.error('Failed to save notes to localStorage:', error)
      }
    }
  }

  const initializeSampleData = () => {
    const sampleNotes: Note[] = [
      {
        id: 'sample-1',
        title: 'Welcome to Personal Notes',
        content: `# Welcome to Personal Notes Organizer!

This is your personal space for organizing thoughts, ideas, and important information.

## Features:
- Create and edit notes with Markdown support
- Search through your notes
- Organize with tags
- Auto-save functionality
- Responsive design

Feel free to edit or delete this note and start creating your own!`,
        tags: ['welcome', 'guide'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sample-2',
        title: 'Getting Started',
        content: `## Quick Tips:

1. **Create a Note**: Click the "New Note" button in the sidebar
2. **Edit**: Click on any note in the list to start editing
3. **Search**: Use the search box to find notes quickly
4. **Tags**: Add tags to organize your notes better
5. **Auto-save**: Your changes are automatically saved

**Keyboard Shortcuts:**
- Ctrl/Cmd + S: Manual save
- Ctrl/Cmd + N: New note`,
        tags: ['tips', 'shortcuts'],
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000)
      }
    ]
    
    notes.value = sampleNotes
    saveNotes()
  }

  const createNote = (): Note => {
    const newNote: Note = {
      id: generateId(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    notes.value.unshift(newNote)
    currentNote.value = newNote
    saveNotes()
    return newNote
  }

  const updateNote = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    const noteIndex = notes.value.findIndex(note => note.id === id)
    if (noteIndex !== -1) {
      notes.value[noteIndex] = {
        ...notes.value[noteIndex],
        ...updates,
        updatedAt: new Date()
      }
      
      if (currentNote.value?.id === id) {
        currentNote.value = notes.value[noteIndex]
      }
      
      saveNotes()
    }
  }

  const deleteNote = (id: string) => {
    notes.value = notes.value.filter(note => note.id !== id)
    
    if (currentNote.value?.id === id) {
      currentNote.value = notes.value.length > 0 ? notes.value[0] : null
    }
    
    saveNotes()
  }

  const selectNote = (note: Note) => {
    currentNote.value = note
  }

  const setFilter = (newFilter: Partial<NoteFilter>) => {
    filter.value = { ...filter.value, ...newFilter }
  }

  const setSortOption = (newSort: NoteSortOption) => {
    sortOption.value = newSort
  }

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Auto-save functionality with debouncing
  let saveTimeout: NodeJS.Timeout | null = null
  
  const autoSave = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    
    saveTimeout = setTimeout(() => {
      updateNote(id, updates)
    }, 1000) // Save after 1 second of inactivity
  }

  return {
    // State
    notes: readonly(notes),
    currentNote: readonly(currentNote),
    filter: readonly(filter),
    sortOption: readonly(sortOption),
    isLoading: readonly(isLoading),
    
    // Computed
    allTags,
    filteredNotes,
    
    // Actions
    loadNotes,
    saveNotes,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    setFilter,
    setSortOption,
    autoSave
  }
})
