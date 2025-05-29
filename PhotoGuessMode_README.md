# Loc8abite Game Modes Development Plan

## Phase 1: Core Game Modes (High Priority)

### Modes & Descriptions
| Mode                | Priority | Description & Notes                                                                                 |
|---------------------|----------|----------------------------------------------------------------------------------------------------|
| Street View Mode    | High     | Street View-style navigation to guess the food location. Google Maps JS API + Street View, scoring logic with distance calculation. |
| Photo Guess Mode    | High     | One image shown, user guesses location. Static image viewer + Google Maps location picker.          |
| Menu Guess Mode     | High     | Image/text of menu, guess from clues. OCR (optional), image/text rendering, Google Maps integration.| 
| Review Guess Mode   | High     | Partial user review shown, guess location. NLP + text censoring (spaCy or custom), map-based input. |
| 3-Minute Mode       | High     | Classic mode with timer. Countdown timer, result logic.                                             |
| Chill Mode          | High     | No time limit. Basic adaptation of core modes without timer.                                        |
| Custom Rules Mode   | High     | Player chooses time, difficulty. Dynamic parameters passed to game logic.                           |
| Random Location     | High     | Removes city selection; game picks random food places globally. Backend endpoint with random seed & filters. |

### Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **APIs:** Google Maps JavaScript API, Google Street View API, (optional: OCR API, NLP library)
- **Libraries:** Bootstrap, jQuery, FontAwesome
- **Storage:** LocalStorage (for scores, settings)
- **Backend (for random location):** Node.js + Express (optional, for global food place selection)

### Steps & Tasks for Each Sub Goal

#### 1. Street View Mode
- [ ] Integrate Google Maps + Street View
- [ ] Implement navigation and guess marker
- [ ] Calculate score based on distance
- [ ] Show feedback and results

#### 2. Photo Guess Mode
- [ ] Display static food/location image
- [ ] Allow user to pick location on map
- [ ] Score based on guess accuracy

#### 3. Menu Guess Mode
- [ ] Show menu image/text
- [ ] (Optional) Integrate OCR for text extraction
- [ ] User guesses location from clues
- [ ] Score and feedback

#### 4. Review Guess Mode
- [ ] Show partial/censored user review
- [ ] (Optional) Use NLP/text censoring
- [ ] User guesses location
- [ ] Score and feedback

#### 5. 3-Minute Mode
- [ ] Add countdown timer to core modes
- [ ] End round when timer expires
- [ ] Show time-based bonus/penalty

#### 6. Chill Mode
- [ ] Adapt core modes to run without timer
- [ ] UI to indicate no time pressure

#### 7. Custom Rules Mode
- [ ] UI for player to select time/difficulty
- [ ] Pass parameters to game logic
- [ ] Adjust scoring and rules accordingly

#### 8. Random Location Logic
- [ ] Remove city selection step
- [ ] (Optional) Backend endpoint to fetch random food places globally
- [ ] Integrate random location into game start

---

## Phase 5: Backend & Analytics

### Modes & Descriptions
| Feature/Mode           | Priority | Description / Tech Notes                                                                 |
|------------------------|----------|----------------------------------------------------------------------------------------|
| Match History          | Medium   | Show last games, performance. MongoDB or SQL + frontend table.                         |
| Stats Personalizzati   | High     | Accuracy, time averages, most guessed cities. Aggregate by user ID.                    |
| Map & Journey Analytics| Medium   | Views, success rates, etc. Per-map analytics dashboard.                                |
| Basic Anti-Cheat       | Medium   | Prevent abuse (e.g., API flooding, click bots). Timer limits, input rate caps.         |
| Cloud Save             | High     | Saves ongoing games, user settings. Firebase or custom backend session system.          |

### Tech Stack (in addition to Phase 1)
- **Backend:** Node.js + Express
- **Database:** MongoDB or SQL (for match history, stats, analytics)
- **Cloud Storage:** Firebase (for cloud save, user settings)
- **Analytics:** Custom dashboard, aggregation logic
- **Security:** Input validation, rate limiting, anti-cheat logic

### Steps & Tasks for Each Sub Goal

#### 1. Match History
- [ ] Design database schema for match history (user ID, game data, timestamp)
- [ ] Implement backend API to fetch/store match history
- [ ] Create frontend table to display recent games

#### 2. Stats Personalizzati
- [ ] Aggregate stats by user (accuracy, time, most guessed cities)
- [ ] Backend endpoints for stats retrieval
- [ ] Frontend UI for stats visualization

#### 3. Map & Journey Analytics
- [ ] Track map views, success rates, journey data
- [ ] Build analytics dashboard (admin or user-facing)
- [ ] Visualize per-map and per-journey analytics

#### 4. Basic Anti-Cheat
- [ ] Implement timer limits and input rate caps in backend
- [ ] Add abuse detection (e.g., API flooding, click bots)
- [ ] Log suspicious activity for review

#### 5. Cloud Save
- [ ] Integrate Firebase or custom backend for session/game state
- [ ] Save ongoing games and user settings to cloud
- [ ] Restore games/settings on login or reload

---

**Note:** This plan is a living document and should be updated as features are added or requirements change.
