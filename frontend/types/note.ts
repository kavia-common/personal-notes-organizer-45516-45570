export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteFilter {
  searchQuery: string;
  selectedTags: string[];
}

export interface NoteSortOption {
  field: 'title' | 'updatedAt' | 'createdAt';
  direction: 'asc' | 'desc';
}
