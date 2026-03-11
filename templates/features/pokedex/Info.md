# Pokedex Feature Info

## Overview

This document summarizes the current `features/pokedex` implementation.

Scope:

- Google OAuth2 login flow
- Team Builder recommendation flow
- MongoDB save logic
- Saved team load / restore / delete flow
- Related UI behavior
- Related routes and files

---

## 1. Google OAuth2 Login

### Purpose

Allow users to sign in with Google and use authenticated features such as saving, listing, and deleting recommended teams.

### Current Behavior

- `GET /login`
  Redirects to Google OAuth immediately if OAuth is configured.
- `GET /login/setup`
  Shows the setup / error-check page when configuration is missing or when the user needs to inspect settings.
- `GET /auth/google/login`
  Starts the OAuth flow.
- `GET /auth/google/callback`
  Receives the OAuth callback and stores the user in session.
- `POST /auth/logout`
  Removes the Google user session.

### Session Data

The current Google user is stored in `session['google_user']`.

Fields:

- `id`
- `name`
- `email`
- `picture`

### Environment Variables

```env
SECRET_KEY=change-this-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://127.0.0.1:5000/auth/google/callback
```

### Related Files

- `features/pokedex/backend.py`
- `templates/auth/login.html`
- `templates/features/pokedex/template_fragment.html`
- `templates/features/pokedex/team_builder.html`

---

## 2. Team Builder

### Purpose

Build a Pokemon team automatically based on a selected style.

### Available Styles

- Offense Team
- Cute Team
- Water Core Team
- No Legend Team
- Beginner Team

### Data Source

The frontend loads PokeAPI CSV data directly.

Used CSV files:

- `pokemon.csv`
- `pokemon_species.csv`
- `pokemon_species_names.csv`
- `pokemon_stats.csv`
- `pokemon_types.csv`

### Data Used

- Korean species names
- Types
- Base stats
- Artwork image URLs
- Legendary / mythical flags
- Weakness / resistance information

### Recommendation Logic

The builder combines:

- Style-based filters
- Style-based scoring
- Bonus for adding missing team types
- Penalty for overlapping types
- Weakness coverage scoring
- Speed / bulk / offense weighting
- Random selection inside a top-ranked candidate group

### Current UX

- Clicking a style card regenerates a team immediately.
- Clicking `Recommend Team` also regenerates a team.
- Results are not fixed; the same style can produce different teams.
- Login is not required for recommendation itself.

### Result Area

The result panel shows:

- Result title
- Summary badges
- 6 recommended Pokemon cards
- Team synergy explanation
- Role text for each member
- Key stat bars

### Related Files

- `templates/features/pokedex/team_builder.html`
- `static/features/pokedex/team_builder.js`
- `static/features/pokedex/team_builder.css`

---

## 3. MongoDB Save Logic

### Purpose

Allow a logged-in user to save the currently recommended team into MongoDB.

### Save Conditions

All conditions must be satisfied:

- The user must be logged in.
- MongoDB configuration must exist.
- The current recommended team must contain exactly 6 Pokemon.

### Environment Variables

```env
MONGO_URI=your-mongodb-connection-string
```

or

```env
MONGODB_URI=your-mongodb-connection-string
```

Optional:

```env
MONGO_DB_NAME=codex2weeks
```

Default database name: `codex2weeks`

### Collection Name

- `team_builder_saves`

### Saved Document Contents

- User info
- Selected style info
- Team summary info
- 6 team members
- Member type / image / rationale / partial stats
- Save timestamp

### Save API

- `POST /api/pokedex/team-builder/save`

### Current Save UX

- User generates a team.
- User clicks `Save Current Team`.
- Frontend calls the save API.
- On success, the saved team list updates immediately.

### Related Files

- `features/pokedex/backend.py`
- `static/features/pokedex/team_builder.js`

---

## 4. Saved Team List

### Purpose

Show recently saved recommended teams for the current logged-in user.

### Current Behavior

- On the Team Builder page, if the user is logged in and MongoDB is available,
  the frontend loads the recent saved teams.
- Up to 8 saved teams are shown.

### Displayed Data

- Team title
- Saved timestamp
- Style label
- Team member names

### Load API

- `GET /api/pokedex/team-builder/saved`

### Related Files

- `features/pokedex/backend.py`
- `static/features/pokedex/team_builder.js`
- `templates/features/pokedex/team_builder.html`

---

## 5. Restore Saved Team

### Purpose

Allow the user to re-open a previously saved recommended team inside the current result area.

### Current Behavior

When the user clicks `View This Team Again`:

- Saved summary is restored.
- Saved 6-member team is restored.
- The result area is rendered again.
- The page scrolls to the result section.
- Save status text is updated.

### Related Files

- `static/features/pokedex/team_builder.js`
- `templates/features/pokedex/team_builder.html`

---

## 6. Delete Saved Team

### Purpose

Allow the user to remove an unnecessary saved recommendation from MongoDB.

### Current Behavior

When the user clicks `Delete` on a saved team card:

1. A confirmation modal opens.
2. The modal asks whether the user wants to delete the selected saved team.
3. If the user confirms, the frontend calls the delete API.
4. On success, the item disappears from the saved list immediately.

### Delete Policy

- Login required
- Only the current user's own saved team can be deleted
- Invalid or missing IDs are rejected

### Delete API

- `DELETE /api/pokedex/team-builder/<item_id>`

### Modal UX

The delete confirmation modal follows the same modal style used for the login/error notice modal.

Ways to close it:

- `Cancel`
- Clicking the backdrop
- `Esc`
- `Confirm` after successful delete flow

### Related Files

- `features/pokedex/backend.py`
- `static/features/pokedex/team_builder.js`
- `templates/features/pokedex/team_builder.html`
- `static/features/pokedex/team_builder.css`

---

## 7. Main Page Integration

The main page header links are integrated with the current auth state.

Current topbar behavior:

- `Open Team Builder`
- Logged out: `Google Login`
- Logged in: `Logout`
- `Open Pokedex`

Related files:

- `templates/features/pokedex/template_fragment.html`
- `static/features/pokedex/frontend.css`

---

## 8. Team Builder Page UI Structure

### Header Area

- Back to main page link
- Login-dependent profile / login state
- Save availability state

### Recommendation Area

- Style cards
- `Recommend Team` button
- `Save Current Team` button

### Result Area

- Result title
- Badges
- Team synergy explanation
- 6 Pokemon cards

### Saved Area

- Recent saved teams
- Restore button
- Delete button

---

## 9. Background Music

A global background music widget is available across the site.

### Current Behavior

- The widget is loaded on the main page, Team Builder page, login setup page, and game page.
- User can start playback manually.
- Playback state is stored in `localStorage`.
- The compact player stays visible while music is playing.

### Related Files

- `static/js/global_bgm.js`
- `static/css/global_bgm.css`
- `templates/index.html`
- `templates/game.html`
- `templates/auth/login.html`
- `templates/features/pokedex/team_builder.html`

---

## 10. Route Summary

### Page Routes

- `GET /`
- `GET /team-builder`
- `GET /pokedex/team-builder`
- `GET /login`
- `GET /login/setup`
- `GET /auth/google/login`
- `GET /auth/google/callback`
- `POST /auth/logout`

### API Routes

- `GET /api/pokedex/health`
- `GET /api/pokedex/team-builder/saved`
- `POST /api/pokedex/team-builder/save`
- `DELETE /api/pokedex/team-builder/<item_id>`

---

## 11. Main Related Files

### Backend

- `features/pokedex/backend.py`

### Main Pokedex Fragment

- `templates/features/pokedex/template_fragment.html`

### Team Builder Page

- `templates/features/pokedex/team_builder.html`

### Login Setup Page

- `templates/auth/login.html`

### Team Builder Logic

- `static/features/pokedex/team_builder.js`

### Team Builder Styles

- `static/features/pokedex/team_builder.css`

### Global BGM

- `static/js/global_bgm.js`
- `static/css/global_bgm.css`

---

## 12. End-to-End Flow Summary

Current implemented flow:

1. User enters from the main page.
2. User logs in with Google OAuth2.
3. User selects a team style.
4. Frontend generates a random 6-member recommended team.
5. Team synergy explanation is shown.
6. User saves the current team.
7. MongoDB stores the saved team.
8. Saved team list is loaded on the Team Builder page.
9. User can restore a saved team.
10. User can delete a saved team with confirmation.
11. Global background music is available across major pages.

---

## 13. Notes

This file reflects the current implementation state.
If routes, UI behavior, or database logic change later, this document should be updated together.
