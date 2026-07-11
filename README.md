# Timepieces

Timepieces is a personal watch collection manager built with React, TypeScript, and Tailwind CSS. Manage, analyze, and showcase your timepiece collection with a simple, elegant UI and persisted storage.

## Features

### Core Features
- **Dashboard** - Collection overview with key statistics and animated charts
- **Gallery** - Browse your watches with advanced search, filtering, and sorting
- **Add/Edit Watches** - Comprehensive form for adding watches with image uploads
- **Watch Details** - Full-screen luxury experience with image gallery and specifications
- **Analytics** - Advanced charts showing collection value, appreciation, brand distribution, and more
- **Settings** - Import/export collection, manage preferences, and view collection stats

### Advanced Features
- **Search & Filter** - Find watches by brand, model, or reference number
- **Sorting Options** - Sort by newest, oldest, highest value, lowest value, or alphabetically
- **Image Management** - Upload hero images, brand logos, and gallery photos
- **Collection Analytics** - Track appreciation, movement types, acquisition trends
- **Data Export** - Export your entire collection as JSON for backup
- **Data Import** - Restore your collection from exported files
- **Server Persistence (SQLite)** - Data is persisted to a lightweight SQLite database via a small Node/Express backend. The app uses the backend API for storing watches and settings.
- **PWA Support** - Install as a standalone app with offline access
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## Design Philosophy

The application follows a **Cinematic Drama** design approach:
- Deep black backgrounds (#0a0a0a) with warm gold accents (#d4af37)
- Playfair Display for elegant headlines paired with Inter for clarity
- Asymmetric layouts with full-bleed sections
- Glassmorphism panels and cinematic image reveals
- Sophisticated animations and transitions
- Premium brand voice and messaging

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Routing**: Wouter
- **State Management**: React Context + LocalStorage
- **Notifications**: Sonner

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development

The application uses a fully static frontend with no backend requirements. All data is stored locally in your browser using LocalStorage.

**Key directories:**
- `client/src/pages/` - Page components
- `client/src/components/` - Reusable UI components
- `client/src/contexts/` - React contexts for state management
- `client/src/lib/` - Utility functions and helpers
- `client/src/types/` - TypeScript type definitions

### Adding a Watch

1. Navigate to the "Add Watch" page
2. Fill in basic information (name, brand, model, etc.)
3. Add pricing and specifications
4. Upload images (hero image, brand logo, gallery photos)
5. Add optional notes
6. Click "Add Watch" to save

### Managing Your Collection

**Gallery**
- Search for watches by brand, model, or reference number
- Filter by brand using the filters panel
- Sort by different criteria
- Click on any watch to view full details

**Analytics**
- View collection value by brand
- Track appreciation/depreciation
- See movement type distribution
- Analyze acquisition trends
- View top 5 most valuable watches

**Settings**
- Export your collection as JSON
- Import previously exported collections
- View collection statistics
- Clear all watches (with confirmation)

## Data Storage

All data is stored locally in your browser using the LocalStorage API. This means:
- Your collection is completely private
- No data is sent to external servers
- Data persists between browser sessions
- You have full control over your data

### Backup & Restore

To backup your collection:
1. Go to Settings
2. Click "Export Collection"
3. Save the JSON file to your computer

To restore from a backup:
1. Go to Settings
2. Click "Import Collection"
3. Select the previously exported JSON file

## Browser Support

The application works best on modern browsers:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires:
- LocalStorage support
- ES6+ JavaScript support
- Modern CSS Grid/Flexbox support

## PWA Installation

The application is a Progressive Web App and can be installed as a standalone app:

**Desktop (Chrome/Edge):**
1. Click the install icon in the address bar
2. Select "Install app"

**Mobile (iOS/Android):**
1. Open in your mobile browser
2. Tap Share → Add to Home Screen

Once installed, the app works offline and can be launched like a native application.

## File Structure

```
client/
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service worker
│   └── favicon.ico        # Favicon
├── src/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Gallery.tsx
│   │   ├── AddWatch.tsx
│   │   ├── WatchDetail.tsx
│   │   ├── Analytics.tsx
│   │   └── Settings.tsx
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── WatchCard.tsx
│   │   ├── WatchForm.tsx
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/
│   │   ├── CollectionContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/
│   │   ├── storage.ts     # LocalStorage utilities
│   │   ├── analytics.ts   # Analytics calculations
│   │   └── utils.ts       # Helper functions
│   ├── types/
│   │   └── index.ts       # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
└── index.html
```

## Performance Optimizations

- Lazy loading of images
- Optimized animations with GPU acceleration
- Efficient state management with React Context
- LocalStorage caching for instant data access
- Service worker for offline support
- Responsive images and lazy loading

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels and roles
- High contrast text
- Focus indicators
- Mobile-friendly touch targets

## Future Enhancements

Potential features for future versions:
- Watch timeline/history view
- Collection slideshow
- Wishlist functionality
- Comparison tools
- Print collection report
- Cloud sync (optional)
- Mobile app (React Native)
- Dark/light theme toggle
- Custom categories/tags
- Watch valuation trends

## License

This project is provided as-is for personal use.

## Support

For issues or questions, please check the application's Settings page for troubleshooting information.

---

**Version**: 1.0.0  
**Last Updated**: June 2026

Crafted with attention to detail for the discerning horologist.
