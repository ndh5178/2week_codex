import type { PresenceState, RoomId } from '../types/collab';

export interface RoomState {
  roomId: RoomId;
  documentId: string;
  members: Map<string, PresenceState>;
}

export class RoomStore {
  private rooms = new Map<RoomId, RoomState>();

  getOrCreate(roomId: RoomId): RoomState {
    const existing = this.rooms.get(roomId);
    if (existing) {
      return existing;
    }

    const created: RoomState = {
      roomId,
      documentId: 'main.ts',
      members: new Map(),
    };

    this.rooms.set(roomId, created);
    return created;
  }

  removeMember(roomId: RoomId, userId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }

    room.members.delete(userId);

    if (room.members.size === 0) {
      this.rooms.delete(roomId);
    }
  }
}
