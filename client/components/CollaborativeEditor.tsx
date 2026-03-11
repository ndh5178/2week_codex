import { useEffect, useRef, useState } from 'react';
import {
  createSharedDocumentAdapter,
  type SharedDocumentAdapter,
} from '../../lib/collab/shared-doc';

interface CollaborativeEditorProps {
  roomId: string;
  documentId: string;
}

export function CollaborativeEditor({ roomId, documentId }: CollaborativeEditorProps) {
  const [value, setValue] = useState('');
  const [revision, setRevision] = useState(0);
  const adapterRef = useRef<SharedDocumentAdapter | null>(null);

  useEffect(() => {
    const adapter = createSharedDocumentAdapter(roomId, documentId, {
      userId: 'member3-sync',
    });

    adapterRef.current = adapter;
    const unsubscribe = adapter.subscribe((document) => {
      setValue(document.content);
      setRevision(document.revision);
    });

    adapter.connect();
    setValue(adapter.getText());
    setRevision(adapter.getRevision());

    return () => {
      unsubscribe();
      adapter.disconnect();
      if (adapterRef.current === adapter) {
        adapterRef.current = null;
      }
    };
  }, [roomId, documentId]);

  return (
    <section>
      <h2>Collaborative Editor</h2>
      <p>Shared document revision: {revision}</p>
      <textarea
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value;
          setValue(nextValue);
          adapterRef.current?.applyLocalChange(nextValue);
        }}
        placeholder="Shared code goes here"
        rows={18}
        style={{ width: '100%' }}
      />
    </section>
  );
}
