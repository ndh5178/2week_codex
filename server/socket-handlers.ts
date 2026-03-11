import type { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS, type JoinRoomPayload, type PresenceUpdatePayload } from '../types/collab';
import { RoomStore } from './room-store';

const rooms = new RoomStore();

export function registerCollaborationHandlers(io: Server, socket: Socket) {
  socket.on(SOCKET_EVENTS.JOIN_ROOM, (payload: JoinRoomPayload) => {
    socket.join(payload.roomId);

    const room = rooms.getOrCreate(payload.roomId);
    room.members.set(payload.user.userId, payload.user);

    io.to(payload.roomId).emit(
      SOCKET_EVENTS.PRESENCE_SNAPSHOT,
      Array.from(room.members.values()),
    );
  });

  socket.on(SOCKET_EVENTS.PRESENCE_UPDATED, (payload: PresenceUpdatePayload) => {
    const room = rooms.getOrCreate(payload.roomId);
    room.members.set(payload.presence.userId, payload.presence);

    socket.to(payload.roomId).emit(SOCKET_EVENTS.PRESENCE_UPDATED, payload.presence);
  });

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomId === socket.id) {
        continue;
      }

      rooms.removeMember(roomId, socket.id);
    }
  });
}
