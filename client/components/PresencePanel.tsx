import type { PresenceState } from '../../types/collab';

interface PresencePanelProps {
  users: PresenceState[];
  currentUserId: string;
  activeDocumentId: string;
  totalDocuments: number;
}

export function PresencePanel({
  users,
  currentUserId,
  activeDocumentId,
  totalDocuments,
}: PresencePanelProps) {
  const activeUsers = users.filter((user) => user.activeDocumentId === activeDocumentId);

  return (
    <aside className="presence-panel">
      <div className="panel-header">
        <div>
          <p className="panel-eyebrow">Presence</p>
          <h2>Participants</h2>
        </div>
        <div className="presence-count">{users.length}</div>
      </div>

      <div className="presence-highlight">
        <strong>{activeDocumentId}</strong>
        <p>
          {activeUsers.length}명이 현재 이 문서를 보고 있고, 전체 공유 문서는 {totalDocuments}개입니다.
        </p>
      </div>

      <ul className="presence-list">
        {users.map((user) => (
          <li key={user.userId} className="presence-item">
            <span className="presence-dot" style={{ backgroundColor: user.color }} aria-hidden="true" />
            <div className="presence-copy">
              <div className="presence-row">
                <strong>
                  {user.name}
                  {user.userId === currentUserId ? ' (You)' : ''}
                </strong>
                <span className={user.activeDocumentId === activeDocumentId ? 'presence-pill active' : 'presence-pill'}>
                  viewing {user.activeDocumentId}
                </span>
              </div>
              <p>{user.activeDocumentId === activeDocumentId ? '같은 문서를 보는 중' : '다른 문서를 확인하는 중'}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}