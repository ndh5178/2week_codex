export interface SharedDocumentAdapter {
  connect: () => void;
  disconnect: () => void;
  getText: () => string;
  applyLocalChange: (nextValue: string) => void;
}

export function createSharedDocumentAdapter(roomId: string, documentId: string): SharedDocumentAdapter {
  let value = '';

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
    },
  };
}
