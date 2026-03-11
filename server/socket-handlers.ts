import type { Server, Socket } from 'socket.io';
import {
  SOCKET_EVENTS,
  type DocumentChangePayload,
  type DocumentSnapshotPayload,
  type JoinRoomPayload,
  type LeaveRoomPayload,
  type PresenceSnapshotPayload,
  type PresenceUpdatePayload,
} from '../types/collab';
import { RoomStore } from './room-store';

const rooms = new RoomStore();

export function registerCollaborationHandlers(io: Server, socket: Socket) {
  socket.on(SOCKET_EVENTS.JOIN_ROOM, (payload: JoinRoomPayload) => {
    socket.join(payload.roomId);
    rooms.upsertMember(payload.roomId, socket.id, payload.user);
    broadcastPresenceSnapshot(io, payload.roomId);

    const documentSnapshot: DocumentSnapshotPayload = {
      roomId: payload.roomId,
      document: rooms.getDocument(payload.roomId, payload.user.activeDocumentId),
    };

    socket.emit(SOCKET_EVENTS.DOCUMENT_SNAPSHOT, documentSnapshot);
  });

  socket.on(SOCKET_EVENTS.PRESENCE_UPDATED, (payload: PresenceUpdatePayload) => {
    rooms.upsertMember(payload.roomId, socket.id, payload.presence);
    socket.to(payload.roomId).emit(SOCKET_EVENTS.PRESENCE_UPDATED, payload.presence);
  });

  socket.on(SOCKET_EVENTS.DOCUMENT_CHANGED, (payload: DocumentChangePayload) => {
    const document = rooms.applyDocumentChange(payload);
    const snapshot: DocumentSnapshotPayload = {
      roomId: payload.roomId,
      document,
      acceptedChangeId: payload.changeId,
    };

    io.to(payload.roomId).emit(SOCKET_EVENTS.DOCUMENT_SNAPSHOT, snapshot);
  });

  socket.on(SOCKET_EVENTS.LEAVE_ROOM, (payload: LeaveRoomPayload) => {
    socket.leave(payload.roomId);
    rooms.removeMember(payload.roomId, payload.userId);
    broadcastPresenceSnapshot(io, payload.roomId);
  });

  socket.on('disconnecting', () => {
    const changedRooms = rooms.removeMemberBySocketId(socket.id);
    for (const roomId of changedRooms) {
      broadcastPresenceSnapshot(io, roomId);
    }
  });
}

function broadcastPresenceSnapshot(io: Server, roomId: string) {
  const snapshot: PresenceSnapshotPayload = {
    roomId,
    members: rooms.listMembers(roomId),
  };

  io.to(roomId).emit(SOCKET_EVENTS.PRESENCE_SNAPSHOT, snapshot);
}
