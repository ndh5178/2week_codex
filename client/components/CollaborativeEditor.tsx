import Editor from '@monaco-editor/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createSharedDocumentAdapter,
  type SharedDocumentAdapter,
} from '../../lib/collab/shared-doc';

interface CollaborativeEditorProps {
  roomId: string;
  documentId: string;
}

export function CollaborativeEditor({ roomId, documentId }: CollaborativeEditorProps) {
  const adapterRef = useRef<SharedDocumentAdapter | null>(null);
  const suppressRemoteSyncRef = useRef(false);
  const [value, setValue] = useState('');
  const [revision, setRevision] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const editorPath = useMemo(() => `${roomId}/${documentId}`, [documentId, roomId]);

  useEffect(() => {
    const adapter = createSharedDocumentAdapter(roomId, documentId, {
      userId: 'member3-sync',
    });

    adapterRef.current = adapter;
    const unsubscribe = adapter.subscribe((document) => {
      suppressRemoteSyncRef.current = true;
      setValue(document.content);
      setRevision(document.revision);
    });

    adapter.connect();
    setValue(adapter.getText());
    setRevision(adapter.getRevision());
    setIsReady(true);

    return () => {
      unsubscribe();
      adapter.disconnect();
      adapterRef.current = null;
      setIsReady(false);
    };
  }, [roomId, documentId]);

  useEffect(() => {
    if (suppressRemoteSyncRef.current) {
      suppressRemoteSyncRef.current = false;
    }
  }, [value]);

  const handleChange = (nextValue: string | undefined) => {
    const resolvedValue = nextValue ?? '';
    setValue(resolvedValue);

    if (suppressRemoteSyncRef.current) {
      return;
    }

    adapterRef.current?.applyLocalChange(resolvedValue);
  };

  return (
    <section>
      <h2>Collaborative Editor</h2>
      <p>Monaco editor with shared sync. Revision: {revision}</p>
      <div style={{ border: '1px solid #d0d7de', borderRadius: 8, overflow: 'hidden' }}>
        <Editor
          height="480px"
          defaultLanguage="typescript"
          path={editorPath}
          value={value}
          loading="Loading editor..."
          options={{
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            tabSize: 2,
          }}
          onChange={handleChange}
        />
      </div>
      {!isReady ? <p>Connecting to shared document...</p> : null}
    </section>
  );
}
