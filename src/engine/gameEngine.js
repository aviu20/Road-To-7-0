import { legends, formations, roleToPosition, roleCompatibility, historicOpponents } from "../data/legends";

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

export function buildSlots(formationKey) {
  const formation = formations[formationKey];
  return formation.slots.map((role) => ({
    role,
    position: roleToPosition[role],
    filled: false,
    player: null,
  }));
}

export function generateDraftChoices(role, alreadyDrafted) {
  const draftedIds = new Set(alreadyDrafted.map((p) => p.id));

  // 1. Exact role match
  const exactMatch = legends.filter(
    (l) => l.role === role && !draftedIds.has(l.id)
  );
  if (exactMatch.length >= 3) return buildDraftPack(exactMatch, alreadyDrafted.length);

  // 2. Compatible roles
  const compatible = roleCompatibility[role] || [];
  const expandedPool = legends.filter(
    (l) => (l.role === role || compatible.includes(l.role)) && !draftedIds.has(l.id)
  );
  if (expandedPool.length >= 3) return buildDraftPack(expandedPool, alreadyDrafted.length);

  // 3. Same general position
  const genPos = roleToPosition[role];
  const posPool = legends.filter(
    (l) => l.position === genPos && !draftedIds.has(l.id)
  );
  return buildDraftPack(posPool, alreadyDrafted.length);
}

function buildDraftPack(pool, roundIndex) {
  const legendFeatureRounds = new Set([3, 7, 10]);
  const shouldFeatureLegend =
    legendFeatureRounds.has(roundIndex) || Math.random() < 0.12;

  if (shouldFeatureLegend) {
    const legendsInPool = pool.filter((p) => p.isMarqueeLegend);
    if (legendsInPool.length > 0) {
      const legend = shuffleArray(legendsInPool)[0];
      const regulars = shuffleArray(pool.filter((p) => p.id !== legend.id));
      return shuffleArray([legend, ...regulars.slice(0, 2)]).slice(0, 3);
    }
  }

  return shuffleArray(pool).slice(0, 3);
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

const goalTemplates = {
  FW: [
    (name, min) => `${min}' ⚽ GOAL! ${name} finishes clinically from inside the box!`,
    (name, min) => `${min}' ⚽ GOAL! ${name} volleys it into the bottom corner!`,
    (name, min) => `${min}' ⚽ GOAL! ${name} cuts inside and curls one past the keeper!`,
    (name, min) => `${min}' ⚽ GOAL! ${name} gets on the end of a through ball and slots home!`,
    (name, min) => `${min}' ⚽ GOAL! ${name} beats the offside trap and chips the keeper!`,
    (name, min) => `${min}' ⚽ GOAL! A moment of brilliance — ${name} dribbles past two and fires home!`,
  ],
  MID: [
    (name, min) => `${min}' ⚽ GOAL! ${name} unleashes a thunderbolt from 25 yards!`,
    (name, min) => `${min}' ⚽ GOAL! ${name} arrives late in the box and smashes it in!`,
    (name, min) => `${min}' ⚽ GOAL! ${name} picks up a loose ball and drives it low into the corner!`,
    (name, min) => `${min}' ⚽ GOAL! A surging run from ${name} ends with a powerful strike!`,
    (name, min) => `${min}' ⚽ GOAL! ${name} threads a one-two and finishes with composure!`,
  ],
  DEF: [
    (name, min) => `${min}' ⚽ GOAL! ${name} rises highest and heads home from a corner!`,
    (name, min) => `${min}' ⚽ GOAL! ${name} bombs forward and lashes it into the net!`,
    (name, min) => `${min}' ⚽ GOAL! ${name} scores with a towering header from a free kick!`,
    (name, min) => `${min}' ⚽ GOAL! An overlapping run from ${name} — and a clinical finish!`,
  ],
  GK: [
    (name, min) => `${min}' ⚽ GOAL! Unbelievable — ${name} scores from a goal kick caught in the wind!`,
    (name, min) => `${min}' ⚽ GOAL! ${name} charges up for the corner and heads it in!`,
  ],
};

const oppGoalTemplates = [
  (min) => `${min}' ⚽ Opponent scores from a quick counterattack...`,
  (min) => `${min}' ⚽ A defensive lapse — opponent capitalizes and scores...`,
  (min) => `${min}' ⚽ Opponent finds space on the edge of the box and finishes...`,
  (min) => `${min}' ⚽ A scrappy goal from a set piece — opponent heads it in...`,
  (min) => `${min}' ⚽ Opponent threads a pass through the defense and converts...`,
  (min) => `${min}' ⚽ A deflection falls kindly for the opponent — they make no mistake...`,
];

const drawColorTemplates = [
  (min) => `${min}' A crunching tackle in midfield sets the tone.`,
  (min) => `${min}' The woodwork rattles — so close!`,
  (min) => `${min}' A brilliant save denies what looked like a certain goal.`,
  (min) => `${min}' Tempers flare after a late challenge — the ref reaches for yellow.`,
  (min) => `${min}' A sweeping move down the wing comes to nothing.`,
];

function generateMatchEvents(teamGoals, oppGoals, squad) {
  const events = [];
  const totalGoals = teamGoals + oppGoals;

  if (totalGoals === 0) {
    const color1 = drawColorTemplates[Math.floor(Math.random() * drawColorTemplates.length)];
    const color2 = drawColorTemplates[Math.floor(Math.random() * drawColorTemplates.length)];
    events.push({ minute: 34, type: "info", team: "neutral", text: color1(34) });
    events.push({ minute: 67, type: "info", team: "neutral", text: color2(67) });
    events.push({ minute: 90, type: "info", team: "neutral", text: "90' Full time — a hard-fought 0-0 draw." });
    return events;
  }

  const scorerPool = squad
    ? [...squad].sort((a, b) => {
        const posWeight = { FW: 4, MID: 2, DEF: 1, GK: 0 };
        return (posWeight[b.position] || 0) + b.stats.attack - (posWeight[a.position] || 0) - a.stats.attack;
      })
    : [];

  const minutes = [];
  for (let i = 0; i < totalGoals; i++) {
    minutes.push(Math.floor(Math.random() * 88) + 2);
  }
  minutes.sort((a, b) => a - b);

  let tg = 0, og = 0;
  let scorerIndex = 0;
  const usedTemplates = new Set();

  for (let i = 0; i < minutes.length; i++) {
    if (tg < teamGoals && (og >= oppGoals || Math.random() < teamGoals / totalGoals)) {
      tg++;
      const scorer = scorerPool.length > 0
        ? scorerPool[scorerIndex % scorerPool.length]
        : null;
      scorerIndex++;

      let text;
      if (scorer) {
        const templates = goalTemplates[scorer.position] || goalTemplates.MID;
        let idx;
        do { idx = Math.floor(Math.random() * templates.length); }
        while (usedTemplates.has(`${scorer.position}-${idx}`) && usedTemplates.size < templates.length * 4);
        usedTemplates.add(`${scorer.position}-${idx}`);
        text = templates[idx](scorer.name, minutes[i]);
      } else {
        text = `${minutes[i]}' ⚽ GOAL! Your team scores!`;
      }
      events.push({ minute: minutes[i], type: "goal", team: "player", text });
    } else {
      og++;
      const template = oppGoalTemplates[Math.floor(Math.random() * oppGoalTemplates.length)];
      events.push({ minute: minutes[i], type: "goal", team: "opponent", text: template(minutes[i]) });
    }
  }

  return events;
}

function applySuperPowers(squad, baseStats) {
  let bonusAtk = 0, bonusMid = 0, bonusDef = 0;

  for (const player of squad) {
    const boosts = player.superpower?.boosts;
    if (!boosts) continue;
    bonusAtk += boosts.attack || 0;
    bonusMid += boosts.midfield || 0;
    bonusDef += boosts.defense || 0;
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
