# Personal Notes Organizer

A modern, responsive web-based application for creating, editing, and organizing personal notes. Built with Nuxt 3, Vue 3, and styled with the Ocean Professional theme.

## 🌟 Features

- **📝 Note Management**: Create, edit, delete, and organize notes
- **🔍 Search & Filter**: Search notes by title/content and filter by tags
- **🏷️ Tag System**: Organize notes with custom tags
- **💾 Auto-save**: Automatic saving with debouncing + manual save (Ctrl/Cmd+S)
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **💨 Local Persistence**: All data stored in browser localStorage
- **🎨 Ocean Professional Theme**: Modern blue & amber styling with gradients
- **⌨️ Keyboard Shortcuts**: Quick actions for power users
- **🖊️ Markdown Preview**: Basic markdown rendering support

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun run dev
```

The application will be available at `http://localhost:3000` (or the next available port).

### Production

Build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun run build
```

Preview the production build:

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
# or
bun run preview
```

## 🎮 Usage

### Creating Notes
- Click the "New Note" button in the sidebar
- Use keyboard shortcut `Ctrl/Cmd + N`

### Editing Notes
- Click on any note in the sidebar to open it in the editor
- Edit title, content, and tags directly
- Changes are auto-saved after 1 second of inactivity
- Use `Ctrl/Cmd + S` for manual save

### Organizing with Tags
- Add tags in the note editor by typing and pressing Enter or comma
- Click on tags in the sidebar to filter notes
- Remove tags by clicking the X next to them

### Searching Notes
- Use the search box in the sidebar
- Searches through both note titles and content
- Combine with tag filters for precise results

### Markdown Support
- Toggle between Edit and Preview modes
- Basic markdown support includes:
  - Headers (# ## ###)
  - Bold (**text**)
  - Italic (*text*)
  - Inline code (`code`)
  - Links ([text](url))
  - Lists (- item)

### Keyboard Shortcuts
- `Ctrl/Cmd + N`: Create new note
- `Ctrl/Cmd + S`: Save current note
- `Escape`: Close mobile sidebar (mobile only)

## 🏗️ Architecture

### Technology Stack
- **Framework**: Nuxt 3
- **Frontend**: Vue 3 with Composition API
- **State Management**: Pinia
- **Styling**: Custom CSS with Ocean Professional theme
- **Icons**: Heroicons Vue
- **Storage**: Browser localStorage
- **Build Tool**: Vite

### Project Structure
```
frontend/
├── assets/css/           # Stylesheets
│   ├── main.css         # Main styles with Ocean theme
│   └── responsive.css   # Responsive design utilities
├── components/          # Vue components
│   ├── AppLayout.vue    # Responsive layout wrapper
│   ├── Icon.vue         # Icon component wrapper
│   ├── NoteEditor.vue   # Note editing interface
│   └── SidebarNoteList.vue # Notes list and search
├── plugins/             # Nuxt plugins
│   └── pinia.client.ts  # Pinia store initialization
├── stores/              # Pinia stores
│   └── notes.ts         # Notes state management
├── types/               # TypeScript definitions
│   └── note.ts          # Note-related types
├── app.vue              # Main app component
└── nuxt.config.ts       # Nuxt configuration
```

### Key Components

#### NotesStore (Pinia)
- Manages all note operations (CRUD)
- Handles search/filter logic
- Provides auto-save functionality
- Manages localStorage persistence

#### SidebarNoteList
- Displays filterable list of notes
- Search functionality
- Tag filtering system
- Sort options (date, title)
- Responsive mobile sidebar

#### NoteEditor
- Rich text editing interface
- Auto-save with debouncing
- Tag management
- Markdown preview toggle
- Word/character count

#### AppLayout
- Responsive layout container
- Mobile/desktop layout switching
- Sidebar toggle for mobile

## 🎨 Ocean Professional Theme

The application uses a carefully crafted color scheme:

- **Primary**: #2563EB (Blue)
- **Secondary**: #F59E0B (Amber)
- **Background**: #f9fafb (Light gray)
- **Surface**: #ffffff (White)
- **Text**: #111827 (Dark gray)

Design features:
- Subtle gradients and shadows
- Rounded corners throughout
- Smooth transitions and animations
- Modern, clean aesthetic
- High contrast for accessibility

## 📱 Responsive Design

The application adapts seamlessly across device sizes:

### Desktop (768px+)
- Two-pane layout with persistent sidebar
- Full feature visibility
- Keyboard navigation support

### Mobile (<768px)
- Single-pane layout with collapsible sidebar
- Touch-optimized interactions
- Slide-in animations
- Overlay navigation

## 💾 Data Persistence

### Local Storage
- All notes are stored in browser localStorage
- Automatic serialization/deserialization
- Survives browser restarts
- No backend required

### Sample Data
- First-time users see helpful sample notes
- Demonstrates features and markdown support
- Can be edited or deleted like any other note

### Future Backend Support
The store architecture is designed to easily integrate with a backend API:
- Abstract persistence layer
- Environment variable support for API endpoints
- Ready for future database integration

## 🔧 Configuration

### Environment Variables
The following environment variables are supported (optional):

```bash
NUXT_PUBLIC_API_BASE=          # Future backend API base URL
NUXT_PUBLIC_BACKEND_URL=       # Future backend service URL
NUXT_PUBLIC_FRONTEND_URL=      # Frontend application URL
NUXT_PUBLIC_WS_URL=           # Future WebSocket URL
# ... additional environment variables
```

When these are empty, the app defaults to localStorage persistence.

## 🚀 Deployment

### Static Site Generation
```bash
npm run generate
```

### Server-Side Rendering
```bash
npm run build
npm run preview
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Known Issues

- Large notes (>1MB) may cause localStorage quota issues
- Markdown preview is basic (no advanced features like tables)
- No export functionality yet (planned for future release)

## 🔮 Future Enhancements

- [ ] Export notes (PDF, Markdown, JSON)
- [ ] Import from other note apps
- [ ] Advanced markdown support
- [ ] Note templates
- [ ] Collaborative editing
- [ ] Cloud sync
- [ ] Themes customization
- [ ] Full-text search with indexing
- [ ] Note linking and backreferences

## 📞 Support

For questions, issues, or feature requests, please create an issue in the project repository.

---

**Built with ❤️ using Nuxt 3 and the Ocean Professional design theme**
