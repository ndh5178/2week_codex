# 2week_codex

Realtime collaboration MVP scaffold for a 4-person team.

## Goal

Build a lightweight collaborative coding MVP with:
- multi-user presence
- current document visibility
- live cursor or selection state
- simple shared editing
- CRDT-based merge behavior

## Team Split

- Realtime: `server/`
- Editor: `client/components/CollaborativeEditor.tsx`
- Sync/CRDT: `lib/collab/`, `types/collab.ts`
- UI/Integration: `client/components/PresencePanel.tsx`, `docs/team-plan.md`

## Suggested Flow

1. Finalize event names in `types/collab.ts`.
2. Implement socket room flow in `server/`.
3. Bind editor state to CRDT in `lib/collab/`.
4. Connect presence UI in `client/components/`.

## Realtime Server Run

1. Install dependencies with `npm install`.
2. Start the frontend with `npm run dev`.
3. Start the server with `npm run dev:server`.
4. Default server port is `3001`.
5. Optional env vars:
   - `PORT`
   - `CLIENT_ORIGIN`