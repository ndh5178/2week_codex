export type UserId = string;
export type RoomId = string;
export type DocumentId = string;

export interface PresenceState {
  userId: UserId;
  name: string;
  color: string;
  activeDocumentId: DocumentId;
  cursor?: {
    lineNumber: number;
    column: number;
  };
  selection?: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  };
}

export interface JoinRoomPayload {
  roomId: RoomId;
  user: Omit<PresenceState, 'cursor' | 'selection'>;
}

export interface PresenceUpdatePayload {
  roomId: RoomId;
  presence: PresenceState;
}

export interface DocumentChangePayload {
  roomId: RoomId;
  documentId: DocumentId;
  content: string;
}

export const SOCKET_EVENTS = {
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  PRESENCE_UPDATED: 'presence-updated',
  PRESENCE_SNAPSHOT: 'presence-snapshot',
  DOCUMENT_CHANGED: 'document-changed',
  DOCUMENT_SNAPSHOT: 'document-snapshot',
} as const;
