export interface SharedDocumentAdapter {
  connect: () => void;
  disconnect: () => void;
  getText: () => string;
  applyLocalChange: (nextValue: string) => void;
  subscribe: (listener: (nextValue: string) => void) => () => void;
}

export function createSharedDocumentAdapter(roomId: string, documentId: string): SharedDocumentAdapter {
  let value = '';
  const listeners = new Set<(nextValue: string) => void>();

  const notifyListeners = () => {
    listeners.forEach((listener) => listener(value));
  };

  return {
    connect() {
      console.log('connect shared document', { roomId, documentId });
    },
    disconnect() {
      console.log('disconnect shared document', { roomId, documentId });
    },
    getText() {
      return value;
    },
    applyLocalChange(nextValue: string) {
      value = nextValue;
      notifyListeners();
    },
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
