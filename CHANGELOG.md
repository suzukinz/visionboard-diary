# Changelog

All notable changes to VisionBoard Diary will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- 🖼️ Image upload support for sticky notes
- 📤 Export to PDF/PNG
- 🔍 Journal search functionality
- 🏷️ Tag system for sticky notes
- 📊 Statistics dashboard
- ☁️ Cloud synchronization
- 🌐 Internationalization (i18n)
- 🎨 Custom theme builder
- 🔔 Daily reminder notifications

## [0.1.0] - 2025-10-15

### Added
- ✨ **Data Persistence**: Automatic save/load using Tauri Store plugin
  - Vision board items saved to `visionboard.json`
  - Journal entries saved to `journal.json`
  - Theme preferences persisted across sessions
- 🎨 **Vision Board**: Drag & drop sticky notes with 8 colors and 3 variants
- 📔 **Journal**: Date-based journaling with rich text editor
- 🎭 **Three Themes**: Classic, Pop, and Dark mode
- 📅 **Calendar Navigation**: Monthly calendar view for journal entries
- 📏 **Ruled Paper**: Theme-specific lined paper design for journal
- ⚡ **Performance**: Optimized rendering with React hooks

### Fixed
- 🐛 TypeScript compilation errors for production build
- 🐛 Unused parameter warnings in Journal component
- 🐛 Type safety for sticky items array

### Technical Details
- **Frontend**: React 19.2.0, TypeScript, Vite 5.4.20, Tailwind CSS
- **Backend**: Tauri 2.8.5, Rust
- **Storage**: tauri-plugin-store 2.4.0
- **Platform**: Windows (MSI & NSIS installers)

### Known Issues
- Git Bash compatibility: Must use PowerShell or CMD

---

## Version History Summary

- **v0.1.0** (2025-10-15): Initial release with core features and data persistence

---

## Migration Guide

### Upgrading to v0.1.0

No migration needed for fresh installations.

If upgrading from a pre-release version without data persistence:
1. Your existing data will not be automatically migrated
2. Data will be saved starting from this version
3. Previous session data will be lost

---

## Contributors

- [@suzukinz](https://github.com/suzukinz) - Creator and maintainer
- [Claude Code](https://claude.com/claude-code) - AI development assistant

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
