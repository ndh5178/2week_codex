import Editor from '@monaco-editor/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createSharedDocumentAdapter } from '../../lib/collab/shared-doc';

interface CollaborativeEditorProps {
  roomId: string;
  documentId: string;
}

export function CollaborativeEditor({ roomId, documentId }: CollaborativeEditorProps) {
  const adapterRef = useRef<ReturnType<typeof createSharedDocumentAdapter> | null>(null);
  const suppressRemoteSyncRef = useRef(false);
  const [value, setValue] = useState('');
  const [isReady, setIsReady] = useState(false);

  const editorPath = useMemo(() => `${roomId}/${documentId}`, [documentId, roomId]);

  useEffect(() => {
    const adapter = createSharedDocumentAdapter(roomId, documentId);
    adapterRef.current = adapter;
    adapter.connect();
    setValue(adapter.getText());
    setIsReady(true);

    const unsubscribe = adapter.subscribe((nextValue) => {
      suppressRemoteSyncRef.current = true;
      setValue(nextValue);
    });

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
      <p>Monaco editor is ready for local typing and shared-document sync.</p>
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
