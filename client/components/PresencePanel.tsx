import type { PresenceState } from '../../types/collab';

interface PresencePanelProps {
  users: PresenceState[];
}

export function PresencePanel({ users }: PresencePanelProps) {
  return (
    <aside>
      <h2>Participants</h2>
      <ul>
        {users.map((user) => (
          <li key={user.userId}>
            <strong>{user.name}</strong> - viewing {user.activeDocumentId}
          </li>
        ))}
      </ul>
    </aside>
  );
}

