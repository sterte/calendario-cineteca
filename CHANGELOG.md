# Changelog

## [2.0.1] - 2026-03-19
### Fixed
- HTML entity encoding (`&#39;`, `&amp;`, etc.) in Popup Cinema movie titles and metadata

## [2.0.0] - 2026-03-19
### Added
- VO (versione originale) toggle filter in the calendar view
- Letterboxd integration: average rating and watchlist badge on film pages
- User preferences page ("Area Personale"): enable/disable IMDb and Letterboxd, set Letterboxd username
- Cache statistics persisted to MongoDB (DailyStat model) with daily granularity and 30-day history
- Version number displayed in footer (sourced from package.json)
- Popup Cinema screenings support (popupcinema.18tickets.it)

### Changed
- "Area Personale" renamed to "Diario" (`/diary`); new "Area Personale" (`/personalarea`) is now settings
- Login and registration errors show descriptive Italian messages instead of raw HTTP status codes
- Modernised all major dependencies: React 18, Redux Toolkit, Express 4.21, Mongoose 8, Helmet 8, Passport 0.7
- Firebase Functions upgraded to 2nd Gen (Node 22)
- Bootstrap 4 → Bootstrap 5 / reactstrap 8 → 9

### Fixed
- Hover and focus stuck states on mobile (navigation buttons, VO toggle, film list rows)
- Missing "repeat-info" extras (episode numbers, event notes) on film detail pages
- Font Awesome icons updated to `@fortawesome/fontawesome-free` 6
