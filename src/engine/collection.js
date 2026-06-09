const STORAGE_KEY = "wc_draft_collection";

function loadCollection() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { playerIds: [], runs: 0, wins: 0 };
  } catch {
    return { playerIds: [], runs: 0, wins: 0 };
  }
}

function saveCollection(collection) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
}

export function getCollection() {
  return loadCollection();
}

export function addRunToCollection(squad, won) {
  const collection = loadCollection();
  const existing = new Set(collection.playerIds);
  for (const player of squad) {
    existing.add(player.id);
  }
  collection.playerIds = [...existing];
  collection.runs += 1;
  if (won) collection.wins += 1;
  saveCollection(collection);
  return collection;
}

export function getCollectionStats(totalPlayers) {
  const collection = loadCollection();
  return {
    collected: collection.playerIds.length,
    total: totalPlayers,
    runs: collection.runs,
    wins: collection.wins,
    percentage: totalPlayers > 0
      ? Math.round((collection.playerIds.length / totalPlayers) * 100)
      : 0,
  };
}

export function isCollected(playerId) {
  const collection = loadCollection();
  return collection.playerIds.includes(playerId);
}

export function resetCollection() {
  localStorage.removeItem(STORAGE_KEY);
}
