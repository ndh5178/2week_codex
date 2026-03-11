import type {
  DocumentChangePayload,
  DocumentId,
  DocumentSnapshotPayload,
  RoomId,
  SharedDocumentState,
  UserId,
} from '../../types/collab';

export interface SharedDocumentAdapter {
  connect: () => void;
  disconnect: () => void;
  getText: () => string;
  getRevision: () => number;
  subscribe: (listener: SharedDocumentListener) => () => void;
  applyLocalChange: (nextValue: string) => void;
}

export interface SharedDocumentTransport {
  connect: () => void;
  disconnect: () => void;
  subscribe: (listener: (payload: DocumentSnapshotPayload) => void) => () => void;
  sendDocumentChange: (payload: DocumentChangePayload) => void;
}

export interface SharedDocumentOptions {
  userId?: UserId;
  transport?: SharedDocumentTransport;
}

export type SharedDocumentListener = (document: SharedDocumentState) => void;

export function createSharedDocumentAdapter(
  roomId: RoomId,
  documentId: DocumentId,
  options: SharedDocumentOptions = {},
): SharedDocumentAdapter {
  const userId = options.userId ?? 'local-user';
  const transport = options.transport ?? createLocalDocumentTransport(roomId, documentId);
  const listeners = new Set<SharedDocumentListener>();
  let documentState = createDocumentState(documentId, '', 0);
  let unsubscribeTransport = () => undefined;
  let connected = false;
  let localChangeCounter = 0;

  const notify = () => {
    for (const listener of listeners) {
      listener(documentState);
    }
  };

  return {
    connect() {
      if (connected) {
        return;
      }

      unsubscribeTransport = transport.subscribe((payload) => {
        documentState = payload.document;
        notify();
      });

      transport.connect();
      connected = true;
    },
    disconnect() {
      if (!connected) {
        return;
      }

      unsubscribeTransport();
      transport.disconnect();
      unsubscribeTransport = () => undefined;
      connected = false;
    },
    getText() {
      return documentState.content;
    },
    getRevision() {
      return documentState.revision;
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(documentState);

      return () => {
        listeners.delete(listener);
      };
    },
    applyLocalChange(nextValue: string) {
      if (nextValue === documentState.content) {
        return;
      }

      transport.sendDocumentChange({
        roomId,
        documentId,
        content: nextValue,
        clientRevision: documentState.revision,
        changeId: `${userId}-${localChangeCounter++}`,
        userId,
      });
    },
  };
}

function createLocalDocumentTransport(
  roomId: RoomId,
  documentId: DocumentId,
): SharedDocumentTransport {
  const key = getChannelKey(roomId, documentId);

  return {
    connect() {
      getOrCreateLocalDocument(key, documentId);
    },
    disconnect() {
      return;
    },
    subscribe(listener) {
      const channel = getOrCreateChannel(key);
      channel.add(listener);
      listener({
        roomId,
        document: getOrCreateLocalDocument(key, documentId),
      });

      return () => {
        channel.delete(listener);
      };
    },
    sendDocumentChange(payload) {
      const current = getOrCreateLocalDocument(key, documentId);
      const nextDocument: SharedDocumentState = {
        documentId,
        content: payload.content,
        revision: current.revision + 1,
        updatedAt: new Date().toISOString(),
        updatedBy: payload.userId,
      };

      localDocuments.set(key, nextDocument);
      broadcastToChannel(key, {
        roomId,
        document: nextDocument,
        acceptedChangeId: payload.changeId,
      });
    },
  };
}

const localDocuments = new Map<string, SharedDocumentState>();
const localChannels = new Map<string, Set<(payload: DocumentSnapshotPayload) => void>>();

function getChannelKey(roomId: RoomId, documentId: DocumentId) {
  return `${roomId}::${documentId}`;
}

function getOrCreateLocalDocument(key: string, documentId: DocumentId): SharedDocumentState {
  const existing = localDocuments.get(key);
  if (existing) {
    return existing;
  }

  const created = createDocumentState(documentId, '', 0);
  localDocuments.set(key, created);
  return created;
}

function getOrCreateChannel(key: string) {
  const existing = localChannels.get(key);
  if (existing) {
    return existing;
  }

  const created = new Set<(payload: DocumentSnapshotPayload) => void>();
  localChannels.set(key, created);
  return created;
}

function broadcastToChannel(key: string, payload: DocumentSnapshotPayload) {
  const channel = getOrCreateChannel(key);
  for (const listener of channel) {
    listener(payload);
  }
}

function createDocumentState(
  documentId: DocumentId,
  content: string,
  revision: number,
  updatedBy?: UserId,
): SharedDocumentState {
  return {
    documentId,
    content,
    revision,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
}
