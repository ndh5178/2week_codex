import type {
  DocumentChangePayload,
  DocumentId,
  PresenceState,
  RoomId,
  SharedDocumentState,
} from '../types/collab';

export interface RoomState {
  roomId: RoomId;
  members: Map<string, PresenceState>;
  socketToUser: Map<string, string>;
  documents: Map<DocumentId, SharedDocumentState>;
  appliedChangeIds: Set<string>;
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
      members: new Map(),
      socketToUser: new Map(),
      documents: new Map([[DEFAULT_DOCUMENT_ID, createDocument(DEFAULT_DOCUMENT_ID)]]),
      appliedChangeIds: new Set(),
    };

    this.rooms.set(roomId, created);
    return created;
  }

  upsertMember(roomId: RoomId, socketId: string, presence: PresenceState) {
    const room = this.getOrCreate(roomId);
    room.members.set(presence.userId, presence);
    room.socketToUser.set(socketId, presence.userId);
  }

  listMembers(roomId: RoomId): PresenceState[] {
    return Array.from(this.getOrCreate(roomId).members.values());
  }

  getDocument(roomId: RoomId, documentId: DocumentId): SharedDocumentState {
    const room = this.getOrCreate(roomId);
    const existing = room.documents.get(documentId);
    if (existing) {
      return existing;
    }

    const created = createDocument(documentId);
    room.documents.set(documentId, created);
    return created;
  }

  applyDocumentChange(payload: DocumentChangePayload): SharedDocumentState {
    const room = this.getOrCreate(payload.roomId);
    const existing = this.getDocument(payload.roomId, payload.documentId);

    if (room.appliedChangeIds.has(payload.changeId)) {
      return existing;
    }

    const nextDocument: SharedDocumentState = {
      documentId: payload.documentId,
      content: payload.content,
      revision: existing.revision + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: payload.userId,
    };

    room.documents.set(payload.documentId, nextDocument);
    room.appliedChangeIds.add(payload.changeId);
    trimAppliedChangeIds(room.appliedChangeIds);
    return nextDocument;
  }

  removeMember(roomId: RoomId, userId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return undefined;
    }

    room.members.delete(userId);
    for (const [socketId, mappedUserId] of room.socketToUser.entries()) {
      if (mappedUserId === userId) {
        room.socketToUser.delete(socketId);
      }
    }

    if (room.members.size === 0) {
      this.rooms.delete(roomId);
      return undefined;
    }

    return room;
  }

  removeMemberBySocketId(socketId: string): RoomId[] {
    const updatedRooms: RoomId[] = [];

    for (const [roomId, room] of this.rooms.entries()) {
      const userId = room.socketToUser.get(socketId);
      if (!userId) {
        continue;
      }

      room.socketToUser.delete(socketId);
      room.members.delete(userId);
      updatedRooms.push(roomId);

      if (room.members.size === 0) {
        this.rooms.delete(roomId);
      }
    }

    return updatedRooms;
  }
}

const DEFAULT_DOCUMENT_ID = 'main.ts';
const MAX_TRACKED_CHANGE_IDS = 100;

function createDocument(documentId: DocumentId): SharedDocumentState {
  return {
    documentId,
    content: '',
    revision: 0,
    updatedAt: new Date().toISOString(),
  };
}

function trimAppliedChangeIds(appliedChangeIds: Set<string>) {
  while (appliedChangeIds.size > MAX_TRACKED_CHANGE_IDS) {
    const oldest = appliedChangeIds.values().next().value;
    if (!oldest) {
      return;
    }

    appliedChangeIds.delete(oldest);
  }
}
