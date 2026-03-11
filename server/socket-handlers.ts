import type { Namespace, Server, Socket } from 'socket.io';
import {
  SOCKET_EVENTS,
  type JoinRoomPayload,
  type PresenceUpdatePayload,
  type RoomId,
} from '../types/collab';
import { RoomStore } from './room-store';

const rooms = new RoomStore();

type PresenceBroadcaster = Pick<Server, 'to'> | Pick<Namespace, 'to'>;

function broadcastPresenceSnapshot(target: PresenceBroadcaster, roomId: RoomId) {
  target.to(roomId).emit(SOCKET_EVENTS.PRESENCE_SNAPSHOT, rooms.getPresenceSnapshot(roomId));
}

function leaveTrackedRooms(socket: Socket, options?: { leaveSocketRoom?: boolean }) {
  const removed = rooms.removeSocket(socket.id);
  if (!removed) {
    return;
  }

  if (options?.leaveSocketRoom) {
    socket.leave(removed.roomId);
  }

  broadcastPresenceSnapshot(socket.nsp, removed.roomId);
}

export function registerCollaborationHandlers(io: Server, socket: Socket) {
  socket.on(SOCKET_EVENTS.JOIN_ROOM, (payload: JoinRoomPayload) => {
    leaveTrackedRooms(socket, { leaveSocketRoom: true });
    socket.join(payload.roomId);

    const room = rooms.upsertMember(payload.roomId, socket.id, payload.user);

    broadcastPresenceSnapshot(io, payload.roomId);
    socket.emit(SOCKET_EVENTS.DOCUMENT_SNAPSHOT, {
      roomId: payload.roomId,
      documentId: room.documentId,
      content: '',
    });
  });

  socket.on(SOCKET_EVENTS.PRESENCE_UPDATED, (payload: PresenceUpdatePayload) => {
    rooms.upsertMember(payload.roomId, socket.id, payload.presence);

    socket.to(payload.roomId).emit(SOCKET_EVENTS.PRESENCE_UPDATED, payload.presence);
  });

  socket.on(SOCKET_EVENTS.LEAVE_ROOM, () => {
    leaveTrackedRooms(socket, { leaveSocketRoom: true });
  });

  socket.on('disconnect', () => {
    leaveTrackedRooms(socket);
  });
}
