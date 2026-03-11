import type { PresenceState, RoomId } from '../types/collab';

export interface RoomState {
  roomId: RoomId;
  documentId: string;
  members: Map<string, PresenceState>;
}

export class RoomStore {
  private rooms = new Map<RoomId, RoomState>();
  private socketToMember = new Map<string, { roomId: RoomId; userId: string }>();

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

  upsertMember(roomId: RoomId, socketId: string, presence: PresenceState): RoomState {
    const room = this.getOrCreate(roomId);
    room.members.set(presence.userId, presence);
    this.socketToMember.set(socketId, { roomId, userId: presence.userId });
    return room;
  }

  removeMember(roomId: RoomId, userId: string): RoomState | undefined {
    const room = this.rooms.get(roomId);
    if (!room) {
      return undefined;
    }

    room.members.delete(userId);

    if (room.members.size === 0) {
      this.rooms.delete(roomId);
      return undefined;
    }

    return room;
  }

  removeSocket(socketId: string): { roomId: RoomId; snapshot: PresenceState[] } | undefined {
    const member = this.socketToMember.get(socketId);
    if (!member) {
      return undefined;
    }

    this.socketToMember.delete(socketId);
    this.removeMember(member.roomId, member.userId);

    return {
      roomId: member.roomId,
      snapshot: this.getPresenceSnapshot(member.roomId),
    };
  }

  getPresenceSnapshot(roomId: RoomId): PresenceState[] {
    const room = this.rooms.get(roomId);
    if (!room) {
      return [];
    }

    return Array.from(room.members.values());
  }
}
