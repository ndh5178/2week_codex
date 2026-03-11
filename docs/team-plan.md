# Team Plan

## Shared MVP Scope

- One room
- One shared document
- Participant presence list
- Active file label
- Basic shared editing with CRDT

## Ownership

- Member 1: `server/socket-handlers.ts`, `server/room-store.ts`
- Member 2: `client/components/CollaborativeEditor.tsx`
- Member 3: `lib/collab/shared-doc.ts`, `types/collab.ts`
- Member 4: `client/components/PresencePanel.tsx`, integration pass

## Merge Rules

- Update `types/collab.ts` first when changing payload shapes.
- Keep room state authoritative on the server.
- Keep editor rendering concerns out of `lib/collab/`.
