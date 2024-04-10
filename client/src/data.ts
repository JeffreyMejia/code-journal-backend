export type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

export const tokenKey = 'um.token';

export function saveToken(token: string | undefined): void {
  if (token) {
    sessionStorage.setItem(tokenKey, token);
  } else {
    sessionStorage.removeItem(tokenKey);
  }
}

export function readToken(): string {
  const token = sessionStorage.getItem(tokenKey);
  if (!token) throw new Error('No token found');
  return token;
}

export async function readEntry(entryId: number): Promise<Entry | undefined> {
  const read = readToken();
  const req = {
    headers: {
      Authorization: `Bearer ${read}`,
    },
  };
  const response = await fetch(`/api/entries/${entryId}`, req);
  const result = await response.json();
  return result;
}

export async function addEntry(entry: Entry): Promise<Entry> {
  const read = readToken();
  const response = await fetch('/api/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${read}`,
    },
    body: JSON.stringify(entry),
  });
  if (!response.ok) throw new Error(`fetch Error ${response.status}`);
  const result = await response.json();
  return result;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  const read = readToken();
  const response = await fetch(`/api/entries/${entry.entryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${read}`,
    },
    body: JSON.stringify(entry),
  });
  if (!response.ok) throw new Error(`fetch Error ${response.status}`);
  const result = await response.json();
  return result;
}

export async function removeEntry(entryId: number): Promise<void> {
  const read = readToken();
  const response = await fetch(`/api/entries/${entryId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${read}`,
    },
  });
  if (!response.ok) throw new Error(`fetch Error ${response.status}`);
  const result = await response.json();
  return result;
}
