import { CollaborativeEditor } from './components/CollaborativeEditor';
import { PresencePanel } from './components/PresencePanel';
import type { PresenceState } from '../types/collab';

const demoUsers: PresenceState[] = [
  {
    userId: 'u1',
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
];

export function App() {
  return (
    <main className="app-shell">
      <section className="app-header">
        <div>
          <p className="eyebrow">Realtime Collaboration MVP</p>
          <h1>Shared Editor Demo</h1>
          <p className="subtle">Editor 담당용 데모 화면입니다. Monaco 기반 편집기와 참가자 패널을 함께 확인할 수 있어요.</p>
        </div>
        <div className="status-chip">room: team-alpha</div>
      </section>
      <section className="workspace-grid">
        <div className="editor-card">
          <CollaborativeEditor roomId="team-alpha" documentId="main.ts" />
        </div>
        <div className="sidebar-card">
          <PresencePanel users={demoUsers} />
        </div>
      </section>
    </main>
  );
}

