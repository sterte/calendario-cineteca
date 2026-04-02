# Changelog

## [UNDEFINED] - TBD
### Added
- User preference: auto-switch to film tab on open (default: enabled); when disabled, tab opens in background and user stays in Calendar
- User preference: preferred calendar — if set, "Aggiungi al calendario" adds the event directly without showing the menu
### Fixed
- Letterboxd data now cached per repeatId (filmCache), fixing data bleed across multiple open tabs
### Changed
- "Add to calendar" replaced with custom datebook-based component, removing third-party disclaimer
- API: rate limiting (300 req / 15 min per IP) and CORS restricted to whitelist origins
- Help texts updated for tab/swipe navigation, calendar preference, and autoSwitchTab

## [2.2.2] - 2026-03-28
### Fixed
- Android deep link: cold-start navigation now lands on the correct movie page (previously landed on CircuitSelect)
- Deep link now creates the movie tab and sets it as active, so the TabBar reflects the opened film

## [2.2.1] - 2026-03-27
### Fixed
- Direct movie URL (e.g. from a saved calendar event) now shows the film instead of the Calendar tab
- StarRatings crash when IMDb rating is null/undefined (film found on IMDb but no rating data)
- StarRatings crash guard applied to Letterboxd rating as well

## [2.2.0] - 2026-03-27
### Added
- In-app tab bar for navigating between Calendar and Film pages without full reloads (keep-alive)
- Swipe left/right gesture to switch between tabs
- Rassegne (track listings) integrated into Tab0 alongside the Calendar — no separate tab opened
- Overlay panel (higher z-index) for Diary and Settings pages; tab bar hidden on those pages
- Click on the central date display in the Calendar to jump back to today
- Android app: splash screen and icons with Cineteca logo, safe-area padding for navigation bar, sticky navbar

### Changed
- Sticky header refactored: single wrapper div sticks to top, eliminating hardcoded `top: 65px` offset
- `index.html` served with `Cache-Control: no-cache` so WebView always loads the latest deploy

### Fixed
- `closeTab` now correctly shifts `selectedTabIndex` when closing a tab before the active one
- `clearTabs` resets `selectedTabIndex` to 0 (previously left stale index on circuit change)
- `openTab` brings an already-open tab to front instead of silently ignoring the click
- Swipe gesture now syncs the URL via `history.push` (previously only updated Redux state)
- Past/started film titles now correctly shown in grey when using button-based navigation
- Navigating to Calendar or Rassegne via navbar always selects Tab0
- Non-tab routes (Diary, Settings, Reset Password) no longer trigger spurious redirect to `/`

## [2.1.0] - 2026-03-22
### Added
- Cinema Teatro Galliera as a new circuit: calendar, film detail page, bordeaux theme
- IMDb/Letterboxd error icon (red X + faded logo) when fetch fails on film detail page

### Added (cont.)
- Screenings started 30+ minutes ago are collapsed into an accordion on the current day's calendar

### Changed
- `decodeEntities` consolidated into shared `parseUtils.js` (was duplicated in ccb, popup, galliera routers)
- "Aggiungi al calendario" button uses circuit-specific color for Galliera (bordeaux)
- Circuit selector logo filter moved to per-circuit config (Galliera logo shown without invert filter)

### Fixed
- Galliera calendar: leading punctuation (`–`, `|`, `.`, `*`) stripped from screening notes
- Galliera calendar: HTML entities in movie titles decoded correctly (e.g. `&#8211;` → `–`)
- Galliera calendar: `V.O.S.*` regex now captures trailing dot and asterisk correctly

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
