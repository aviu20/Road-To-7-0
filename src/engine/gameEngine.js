import { legends, historicOpponents } from "../data/legends";

export const PHASES = {
  SETUP: "SETUP",
  DRAFT: "DRAFT",
  TOURNAMENT: "TOURNAMENT",
  GAME_OVER: "GAME_OVER",
};

export function createInitialState() {
  return {
    phase: PHASES.SETUP,
    formation: null,
    slots: [],
    squad: [],
    currentSlot: 0,
    respinsLeft: 3,
    draftChoices: [],
    tournamentResults: [],
    groupTable: null,
    currentMatch: 0,
    matchLog: [],
    eliminated: false,
  };
}

export function buildSlots(formation) {
  const slots = [];
  const config = formation;
  slots.push({ position: "GK", filled: false, player: null });
  for (let i = 0; i < config.DEF; i++) slots.push({ position: "DEF", filled: false, player: null });
  for (let i = 0; i < config.MID; i++) slots.push({ position: "MID", filled: false, player: null });
  for (let i = 0; i < config.FW; i++) slots.push({ position: "FW", filled: false, player: null });
  return slots;
}

export function generateDraftChoices(position, alreadyDrafted) {
  const draftedIds = new Set(alreadyDrafted.map((p) => p.id));

  const exactMatch = legends.filter(
    (l) => l.position === position && !draftedIds.has(l.id)
  );

  if (exactMatch.length >= 3) {
    return shuffleArray(exactMatch).slice(0, 3);
  }

  const fallbackPool = legends.filter((l) => {
    if (draftedIds.has(l.id)) return false;
    if (l.position === position) return true;
    if (position === "GK") return false;
    if (l.position === "GK") return false;
    return true;
  });

  return shuffleArray(fallbackPool).slice(0, 3);
}

// ─── Position-weighted stat calculation ───────────────────────
// Forwards drive Attack, Midfielders drive Midfield, Defenders+GK drive Defense.
// This prevents GK's 8 ATK from dragging down a team full of 95+ legends.
export function calculateTeamStats(squad) {
  if (squad.length === 0) return { attack: 0, midfield: 0, defense: 0 };

  const byPos = { FW: [], MID: [], DEF: [], GK: [] };
  for (const p of squad) {
    byPos[p.position]?.push(p) ?? byPos.MID.push(p);
  }

  const avg = (players, stat) => {
    if (players.length === 0) return 0;
    return players.reduce((s, p) => s + p.stats[stat], 0) / players.length;
  };

  const attack = Math.round(
    avg(byPos.FW, "attack") * 0.55 +
    avg(byPos.MID, "attack") * 0.30 +
    avg(byPos.DEF, "attack") * 0.10 +
    avg(byPos.GK, "attack") * 0.05
  );

  const midfield = Math.round(
    avg(byPos.MID, "midfield") * 0.55 +
    avg(byPos.FW, "midfield") * 0.15 +
    avg(byPos.DEF, "midfield") * 0.20 +
    avg(byPos.GK, "midfield") * 0.10
  );

  const defense = Math.round(
    avg(byPos.DEF, "defense") * 0.50 +
    avg(byPos.GK, "defense") * 0.30 +
    avg(byPos.MID, "defense") * 0.15 +
    avg(byPos.FW, "defense") * 0.05
  );

  return { attack, midfield, defense };
}

// ─── Simulation helpers ──────────────────────────────────────
// Opponent stats are flat team composites (88/86/78) while user stats
// are position-weighted (FW drives ATK, GK dilutes it). Scale opponents
// down to put both on the same scale.
const OPPONENT_SCALE = 0.90;

function normalizeOpponent(opp) {
  return {
    ...opp,
    attack: Math.round(opp.attack * OPPONENT_SCALE),
    midfield: Math.round(opp.midfield * OPPONENT_SCALE),
    defense: Math.round(opp.defense * OPPONENT_SCALE),
  };
}

function calculatePower(stats) {
  return stats.attack * 0.4 + stats.midfield * 0.35 + stats.defense * 0.25;
}

// ─── Tournament simulation ────────────────────────────────────
export function simulateTournament(squad) {
  const teamStats = calculateTeamStats(squad);
  const boostedStats = applySuperPowers(squad, teamStats);

  const allOpponents = shuffleArray([...historicOpponents]).map(normalizeOpponent);

  // Group stage: pick 3 opponents for user + 3 for the rest of the group
  const groupOpponents = allOpponents.slice(0, 3);
  const knockoutOpponents = allOpponents.slice(3, 7);

  // Simulate the full group (user + 3 AI teams play each other)
  const groupTable = simulateGroupStage(boostedStats, groupOpponents, squad);

  const results = [...groupTable.userMatches];
  let eliminated = !groupTable.qualified;

  // Knockout rounds
  const knockoutRounds = ["Round of 16", "Quarter-Final", "Semi-Final", "Final"];
  for (let i = 0; i < 4; i++) {
    if (eliminated) break;
    const opponent = knockoutOpponents[i] || allOpponents[i % allOpponents.length];
    const match = simulateMatch(boostedStats, opponent, knockoutRounds[i], squad);
    results.push(match);
    if (match.result === "L") eliminated = true;
  }

  return {
    results,
    eliminated,
    finalRound: results[results.length - 1].round,
    groupTable: groupTable.standings,
  };
}

function simulateGroupStage(teamStats, groupOpponents, squad) {
  const teams = [
    { name: "Your XI", stats: teamStats, isUser: true },
    ...groupOpponents.map((o) => ({ name: o.name, stats: o, isUser: false })),
  ];

  const standings = teams.map((t) => ({
    name: t.name,
    isUser: t.isUser,
    played: 0, wins: 0, draws: 0, losses: 0,
    goalsFor: 0, goalsAgainst: 0, points: 0,
  }));

  const userMatches = [];

  // Round-robin: each team plays the other 3 once
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const home = teams[i];
      const away = teams[j];
      const isUserMatch = home.isUser || away.isUser;

      const matchResult = simulateGroupMatch(home.stats, away.stats);

      const si = standings[i];
      const sj = standings[j];

      si.played++;
      sj.played++;
      si.goalsFor += matchResult.homeGoals;
      si.goalsAgainst += matchResult.awayGoals;
      sj.goalsFor += matchResult.awayGoals;
      sj.goalsAgainst += matchResult.homeGoals;

      if (matchResult.homeGoals > matchResult.awayGoals) {
        si.wins++; si.points += 3;
        sj.losses++;
      } else if (matchResult.homeGoals < matchResult.awayGoals) {
        sj.wins++; sj.points += 3;
        si.losses++;
      } else {
        si.draws++; si.points += 1;
        sj.draws++; sj.points += 1;
      }

      if (isUserMatch) {
        const userIsHome = home.isUser;
        const tg = userIsHome ? matchResult.homeGoals : matchResult.awayGoals;
        const og = userIsHome ? matchResult.awayGoals : matchResult.homeGoals;
        const oppName = userIsHome ? away.name : home.name;

        let result;
        if (tg > og) result = "W";
        else if (tg < og) result = "L";
        else result = "D";

        const roundLabel = `Group — Match ${userMatches.length + 1}`;
        const events = generateMatchEvents(tg, og, squad);

        userMatches.push({
          round: roundLabel,
          opponent: oppName,
          teamGoals: tg,
          oppGoals: og,
          result,
          events,
          cleanSheet: og === 0,
        });
      }
    }
  }

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;
    return b.goalsFor - a.goalsFor;
  });

  const userRank = standings.findIndex((s) => s.isUser);
  const qualified = userRank < 2;

  return { standings, userMatches, qualified };
}

function simulateGroupMatch(homeStats, awayStats) {
  const homePower = calculatePower(homeStats);
  const awayPower = calculatePower(awayStats);

  const diff = homePower - awayPower;
  const winBase = 1 / (1 + Math.exp(-diff * 0.30));

  const dominance = Math.abs(2 * winBase - 1);
  const drawProb = 0.22 * (1 - Math.pow(dominance, 1.5));
  const homeWinProb = winBase * (1 - drawProb);

  const roll = Math.random();
  let homeGoals, awayGoals;

  if (roll < homeWinProb) {
    homeGoals = 1 + Math.floor(Math.random() * 3);
    awayGoals = Math.floor(Math.random() * homeGoals);
  } else if (roll < homeWinProb + drawProb) {
    homeGoals = Math.floor(Math.random() * 3);
    awayGoals = homeGoals;
  } else {
    awayGoals = 1 + Math.floor(Math.random() * 3);
    homeGoals = Math.floor(Math.random() * awayGoals);
  }

  return { homeGoals, awayGoals };
}

function simulateMatch(team, opponent, round, squad) {
  const teamPower = calculatePower(team);
  const oppPower = calculatePower(opponent);

  const diff = teamPower - oppPower;
  const winBase = 1 / (1 + Math.exp(-diff * 0.30));

  const dominance = Math.abs(2 * winBase - 1);
  const drawProb = 0.18 * (1 - Math.pow(dominance, 1.5));
  const teamWinProb = winBase * (1 - drawProb);

  const teamAttackFactor = team.attack / 80;
  const oppAttackFactor = opponent.attack / 80;

  const roll = Math.random();
  let teamGoals, oppGoals;

  if (roll < teamWinProb) {
    teamGoals = 1 + Math.floor(Math.random() * Math.ceil(2.5 * teamAttackFactor));
    oppGoals = Math.floor(Math.random() * Math.max(1, teamGoals));
    if (oppGoals >= teamGoals) oppGoals = teamGoals - 1;
  } else if (roll < teamWinProb + drawProb) {
    const avgFactor = (teamAttackFactor + oppAttackFactor) / 2;
    teamGoals = Math.floor(Math.random() * Math.ceil(2 * avgFactor));
    oppGoals = teamGoals;
  } else {
    oppGoals = 1 + Math.floor(Math.random() * Math.ceil(2.5 * oppAttackFactor));
    teamGoals = Math.floor(Math.random() * Math.max(1, oppGoals));
    if (teamGoals >= oppGoals) teamGoals = oppGoals - 1;
  }

  teamGoals = Math.max(0, teamGoals);
  oppGoals = Math.max(0, oppGoals);

  let result;
  if (teamGoals > oppGoals) result = "W";
  else if (teamGoals === oppGoals) result = "D";
  else result = "L";

  const isKnockout = !round.startsWith("Group");
  if (isKnockout && result === "D") {
    if (Math.random() < winBase) {
      result = "W";
      teamGoals += 1;
    } else {
      result = "L";
      oppGoals += 1;
    }
  }

  const events = generateMatchEvents(teamGoals, oppGoals, squad);

  return {
    round,
    opponent: opponent.name,
    teamGoals,
    oppGoals,
    result,
    events,
    cleanSheet: oppGoals === 0,
  };
}

function generateMatchEvents(teamGoals, oppGoals, squad) {
  const events = [];
  const totalGoals = teamGoals + oppGoals;

  if (totalGoals === 0) {
    events.push({ minute: 45, type: "info", team: "neutral", text: "45' A tense, goalless first half." });
    events.push({ minute: 90, type: "info", team: "neutral", text: "90' Full time — a hard-fought 0-0 draw." });
    return events;
  }

  // Pick scorers from the user's squad, weighted by position
  const scorerPool = squad ? [...squad].sort((a, b) => b.stats.attack - a.stats.attack) : [];

  const minutes = [];
  for (let i = 0; i < totalGoals; i++) {
    minutes.push(Math.floor(Math.random() * 88) + 2);
  }
  minutes.sort((a, b) => a - b);

  let tg = 0, og = 0;
  let scorerIndex = 0;
  for (let i = 0; i < minutes.length; i++) {
    if (tg < teamGoals && (og >= oppGoals || Math.random() < teamGoals / totalGoals)) {
      tg++;
      const scorer = scorerPool.length > 0
        ? scorerPool[scorerIndex % scorerPool.length]
        : null;
      scorerIndex++;
      const name = scorer ? scorer.name : "Your team";
      events.push({ minute: minutes[i], type: "goal", team: "player", text: `${minutes[i]}' ⚽ GOAL! ${name} scores!` });
    } else {
      og++;
      events.push({ minute: minutes[i], type: "goal", team: "opponent", text: `${minutes[i]}' ⚽ Opponent scores...` });
    }
  }

  return events;
}

function applySuperPowers(squad, baseStats) {
  let bonusAtk = 0, bonusMid = 0, bonusDef = 0;

  for (const player of squad) {
    if (!player.superpower) continue;
    const desc = player.superpower.description.toLowerCase();

    const allStatsMatch = desc.match(/\+(\d+) to all squad stats/);
    if (allStatsMatch) {
      const v = parseInt(allStatsMatch[1]);
      bonusAtk += v; bonusMid += v; bonusDef += v;
      continue;
    }

    const boosts = desc.matchAll(/\+(\d+)\s+(atk|mid|def|attack|midfield|defense)/gi);
    for (const m of boosts) {
      const v = parseInt(m[1]);
      const stat = m[2].toLowerCase();
      if (stat === "atk" || stat === "attack") bonusAtk += v;
      if (stat === "mid" || stat === "midfield") bonusMid += v;
      if (stat === "def" || stat === "defense") bonusDef += v;
    }
  }

  return {
    attack: Math.min(99, baseStats.attack + bonusAtk),
    midfield: Math.min(99, baseStats.midfield + bonusMid),
    defense: Math.min(99, baseStats.defense + bonusDef),
  };
}

export function checkRecordBreakers(squad, results) {
  const totalGoals = results.reduce((sum, r) => sum + r.teamGoals, 0);
  const cleanSheets = results.filter((r) => r.cleanSheet).length;

  const records = [];
  for (const player of squad) {
    const { metric, value, headline } = player.recordThreshold;
    let achieved = false;
    if (metric === "goals" && totalGoals >= value) achieved = true;
    if (metric === "clean_sheets" && cleanSheets >= value) achieved = true;
    if (achieved) records.push({ player, headline });
  }

  return records;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
