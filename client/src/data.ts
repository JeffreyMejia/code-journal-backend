export type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

export async function readEntry(entryId: number): Promise<Entry | undefined> {
  const response = await fetch(`/api/entries/${entryId}`);
  const result = await response.json();
  return result;
}

export async function addEntry(entry: Entry): Promise<Entry> {
  const response = await fetch('/api/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  const result = await response.json();
  return result;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  const response = await fetch(`/api/entries/${entry.entryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  const result = await response.json();
  return result;
}

export async function removeEntry(entryId: number): Promise<void> {
  const response = await fetch(`/api/entries/${entryId}`, {
    method: 'DELETE',
  });
  const result = await response.json();
  return result;
}
