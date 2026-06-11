const STORAGE_KEY = "wc_draft_collection";

// In-memory cache — avoids re-parsing JSON on every check
let _cache = null;

function loadCollection() {
  if (_cache) return _cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    _cache = raw ? JSON.parse(raw) : { playerIds: [], runs: 0, wins: 0 };
  } catch {
    _cache = { playerIds: [], runs: 0, wins: 0 };
  }
  return _cache;
}

function saveCollection(collection) {
  _cache = collection;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
}

export function getCollection() {
  return loadCollection();
}

export function addRunToCollection(squad, won) {
  const collection = loadCollection();
  const existing = new Set(collection.playerIds);
  const newPlayers = [];
  for (const player of squad) {
    if (!existing.has(player.id)) newPlayers.push(player.id);
    existing.add(player.id);
  }
  collection.playerIds = [...existing];
  collection.runs += 1;
  if (won) collection.wins += 1;
  saveCollection(collection);
  return { ...collection, newPlayers };
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
  return new Set(collection.playerIds).has(playerId);
}

export function resetCollection() {
  _cache = null;
  localStorage.removeItem(STORAGE_KEY);
}
