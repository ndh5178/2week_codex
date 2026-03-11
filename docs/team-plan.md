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

## Team Coordination

- Start by pulling the latest `main`.
- If event names or payloads change, align `types/collab.ts` first.
- Work mainly inside your owned files to reduce conflicts.
- Share status once before opening a PR or merging.

## Share Message

- "메인에 기본 구조 올려뒀어요.
  1번 서버: server/socket-handlers.ts, server/room-store.ts
  2번 에디터: client/components/CollaborativeEditor.tsx
  3번 동기화: lib/collab/shared-doc.ts, types/collab.ts
  4번 UI/통합: client/components/PresencePanel.tsx, docs/team-plan.md
  payload 바꾸면 types/collab.ts 먼저 맞춰주세요."