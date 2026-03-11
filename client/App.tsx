import { useEffect, useState } from 'react';
import { CollaborativeEditor } from './components/CollaborativeEditor';
import { PresencePanel } from './components/PresencePanel';
import type { DocumentId, PresenceState } from '../types/collab';

const ROOM_ID = 'team-alpha';
const CURRENT_USER_ID = 'u1';

const documents = [
  {
    id: 'main.ts',
    title: 'Main entry',
    description: '발표 시작 지점과 기본 협업 흐름을 보여주는 문서',
  },
  {
    id: 'auth.ts',
    title: 'Auth flow',
    description: '다른 팀원이 보고 있는 분기 화면을 함께 시연하기 좋은 문서',
  },
  {
    id: 'presence.ts',
    title: 'Presence sync',
    description: '접속자 정보와 현재 보고 있는 문서 동기화 예시',
  },
] satisfies Array<{ id: DocumentId; title: string; description: string }>;

const baseUsers: PresenceState[] = [
  {
    userId: CURRENT_USER_ID,
    name: 'Nina',
    color: '#ff7a59',
    activeDocumentId: 'main.ts',
  },
  {
    userId: 'u2',
    name: 'Joon',
    color: '#2f80ed',
    activeDocumentId: 'main.ts',
  },
  {
    userId: 'u3',
    name: 'Mina',
    color: '#27ae60',
    activeDocumentId: 'auth.ts',
  },
  {
    userId: 'u4',
    name: 'Alex',
    color: '#8b5cf6',
    activeDocumentId: 'presence.ts',
  },
];

export function App() {
  const [activeDocumentId, setActiveDocumentId] = useState<DocumentId>('main.ts');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const syncFullscreenState = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', syncFullscreenState);

    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState);
    };
  }, []);

  const activeDocument = documents.find((documentItem) => documentItem.id === activeDocumentId) ?? documents[0];
  const users = baseUsers.map((user) =>
    user.userId === CURRENT_USER_ID
      ? {
          ...user,
          activeDocumentId,
        }
      : user,
  );
  const activeViewers = users.filter((user) => user.activeDocumentId === activeDocumentId).length;

  const handleFullscreenToggle = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await document.documentElement.requestFullscreen();
  };

  return (
    <main className="app-shell">
      <section className="app-header">
        <div>
          <p className="eyebrow">Realtime Collaboration MVP</p>
          <h1>Shared Editor Demo</h1>
          <p className="subtle">
            접속자 현황, 현재 보고 있는 문서, 전체 화면 발표 흐름까지 한 화면에서 자연스럽게 이어지는 통합 데모입니다.
          </p>
        </div>
        <div className="header-actions">
          <div className="status-chip">room: {ROOM_ID}</div>
          <button className="fullscreen-button" type="button" onClick={() => void handleFullscreenToggle()}>
            {isFullscreen ? 'Exit full screen' : 'Full screen demo'}
          </button>
        </div>
      </section>

      <section className="overview-grid">
        <article className="summary-card">
          <span className="summary-label">Now viewing</span>
          <strong>{activeDocument.id}</strong>
          <p>{activeDocument.description}</p>
        </article>
        <article className="summary-card">
          <span className="summary-label">Live participants</span>
          <strong>{users.length} people</strong>
          <p>{activeViewers}명이 현재 같은 문서를 보고 있어요.</p>
        </article>
        <article className="summary-card">
          <span className="summary-label">Demo flow</span>
          <strong>Intro to edit to presence</strong>
          <p>문서 전환과 참여자 변화를 동시에 보여주면 발표 흐름이 매끄럽습니다.</p>
        </article>
      </section>

      <section className="workspace-grid">
        <div className="editor-card">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Workspace</p>
              <h2>Document switcher</h2>
            </div>
            <div className="active-document-badge">{activeDocument.title}</div>
          </div>

          <div className="document-tabs" aria-label="Document tabs">
            {documents.map((documentItem) => {
              const isActive = documentItem.id === activeDocumentId;
              const viewerCount = users.filter((user) => user.activeDocumentId === documentItem.id).length;

              return (
                <button
                  key={documentItem.id}
                  type="button"
                  className={isActive ? 'document-tab active' : 'document-tab'}
                  onClick={() => setActiveDocumentId(documentItem.id)}
                >
                  <span>{documentItem.id}</span>
                  <small>{viewerCount} viewers</small>
                </button>
              );
            })}
          </div>

          <CollaborativeEditor roomId={ROOM_ID} documentId={activeDocumentId} />
        </div>

        <div className="sidebar-column">
          <div className="sidebar-card">
            <PresencePanel
              users={users}
              currentUserId={CURRENT_USER_ID}
              activeDocumentId={activeDocumentId}
              totalDocuments={documents.length}
            />
          </div>

          <div className="sidebar-card checklist-card">
            <div className="panel-header">
              <div>
                <p className="panel-eyebrow">Presenter notes</p>
                <h2>발표용 정리</h2>
              </div>
            </div>
            <ul className="checklist">
              <li>입장 직후 접속자 수와 현재 문서를 먼저 보여주기</li>
              <li>문서를 바꾸면서 우측 패널의 viewing 상태가 함께 변하는지 설명하기</li>
              <li>마지막에 전체 화면으로 전환해 데모 마무리하기</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}