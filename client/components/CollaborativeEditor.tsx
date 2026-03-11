import { useEffect, useState } from 'react';
import { createSharedDocumentAdapter } from '../../lib/collab/shared-doc';

interface CollaborativeEditorProps {
  roomId: string;
  documentId: string;
}

export function CollaborativeEditor({ roomId, documentId }: CollaborativeEditorProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const adapter = createSharedDocumentAdapter(roomId, documentId);
    adapter.connect();
    setValue(adapter.getText());

    return () => {
      adapter.disconnect();
    };
  }, [roomId, documentId]);

  return (
    <section>
      <h2>Collaborative Editor</h2>
      <p>Bind this component to Monaco or another code editor.</p>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Shared code goes here"
        rows={18}
        style={{ width: '100%' }}
      />
    </section>
  );
}
