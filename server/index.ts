import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { registerCollaborationHandlers } from './socket-handlers';

const port = Number(process.env.PORT ?? 3001);
const origin = process.env.CLIENT_ORIGIN ?? '*';

const httpServer = createServer((_, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(
    JSON.stringify({
      ok: true,
      service: 'realtime-collaboration-server',
    }),
  );
});

const io = new Server(httpServer, {
  cors: {
    origin,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  registerCollaborationHandlers(io, socket);
});

httpServer.listen(port, () => {
  console.log(`Realtime server listening on http://localhost:${port}`);
});
