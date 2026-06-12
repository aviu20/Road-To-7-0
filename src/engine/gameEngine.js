import { legends, formations, roleToPosition, roleCompatibility } from "../data/legends";

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

// ─── Compute 2026 WC team stats from player database ──────────
function computeWCTeams() {
  const byCountry = {};
  for (const p of legends) {
    if (p.year !== 2026) continue;
    if (!byCountry[p.country]) byCountry[p.country] = [];
    byCountry[p.country].push(p);
  }
  return Object.entries(byCountry).map(([country, players]) => {
    const stats = calculateTeamStats(players);
    return { name: country, ...stats };
  });
}

const wcTeams = computeWCTeams();

// ─── Simulation helpers ──────────────────────────────────────
function calculatePower(stats) {
  return stats.attack * 0.4 + stats.midfield * 0.35 + stats.defense * 0.25;
}

// ─── Tournament simulation ────────────────────────────────────
export function simulateTournament(squad) {
  const teamStats = calculateTeamStats(squad);
  const boostedStats = applySuperPowers(squad, teamStats);

  const allOpponents = shuffleArray([...wcTeams]);

  // Group stage: pick 3 opponents
  const groupOpponents = allOpponents.slice(0, 3);
  const knockoutOpponents = allOpponents.slice(3, 7);

  const groupStage = simulateGroupStage(boostedStats, groupOpponents, squad);

  const results = [...groupStage.userMatches];
  let eliminated = !groupStage.qualified;

  // Knockout rounds
  const knockoutRounds = ["Round of 16", "Quarter-Final", "Semi-Final", "Final"];
  for (let i = 0; i < 4; i++) {
    if (eliminated) break;
    const opponent = knockoutOpponents[i] || allOpponents[i % allOpponents.length];
    const match = simulateMatch(boostedStats, opponent, knockoutRounds[i], squad);
    results.push(match);
    if (match.result === "L") eliminated = true;
  }

  // Build full 16-team bracket for display
  const bracketFillers = [
    ...groupOpponents.map((o) => o.name),
    ...allOpponents.slice(7).map((o) => o.name),
  ];
  const bracket = buildBracketData(
    knockoutOpponents.map((o) => o.name),
    bracketFillers
  );

  return {
    results,
    eliminated,
    finalRound: results[results.length - 1].round,
    groupTable: groupStage.standings,
    groupAIMatches: groupStage.aiMatches,
    bracket,
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
  const aiMatches = [];

  // Matchday schedule: each day has 1 user match + 1 AI-AI match
  const schedule = [
    [[0, 1], [2, 3]],
    [[0, 2], [1, 3]],
    [[0, 3], [1, 2]],
  ];

  for (let md = 0; md < 3; md++) {
    for (const [hi, ai] of schedule[md]) {
      const home = teams[hi];
      const away = teams[ai];
      const isUserMatch = home.isUser || away.isUser;

      const matchResult = simulateGroupMatch(home.stats, away.stats);

      const si = standings[hi];
      const sj = standings[ai];

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
      } else {
        aiMatches.push({
          home: home.name,
          away: away.name,
          homeGoals: matchResult.homeGoals,
          awayGoals: matchResult.awayGoals,
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

  return { standings, userMatches, aiMatches, qualified };
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

// ─── Match event templates ──────────────────────────────────
const goalTemplates = {
  FW: [
    (s, a, m) => `${m}' ⚽ GOAL! ${s} finishes clinically from inside the box!${a}`,
    (s, a, m) => `${m}' ⚽ GOAL! ${s} volleys it into the bottom corner!${a}`,
    (s, a, m) => `${m}' ⚽ GOAL! ${s} cuts inside and curls one past the keeper!${a}`,
    (s, a, m) => `${m}' ⚽ GOAL! ${s} gets on the end of a through ball and slots home!${a}`,
    (s, a, m) => `${m}' ⚽ GOAL! ${s} beats the offside trap and chips the keeper!${a}`,
    (s, a, m) => `${m}' ⚽ GOAL! A moment of brilliance — ${s} dribbles past two and fires home!${a}`,
  ],
  MID: [
    (s, a, m) => `${m}' ⚽ GOAL! ${s} unleashes a thunderbolt from 25 yards!${a}`,
    (s, a, m) => `${m}' ⚽ GOAL! ${s} arrives late in the box and smashes it in!${a}`,
    (s, a, m) => `${m}' ⚽ GOAL! ${s} picks up a loose ball and drives it low into the corner!${a}`,
    (s, a, m) => `${m}' ⚽ GOAL! A surging run from ${s} ends with a powerful strike!${a}`,
    (s, a, m) => `${m}' ⚽ GOAL! ${s} threads a one-two and finishes with composure!${a}`,
  ],
  DEF: [
    (s, a, m) => `${m}' ⚽ GOAL! ${s} rises highest and heads home from a corner!${a}`,
    (s, a, m) => `${m}' ⚽ GOAL! ${s} bombs forward and lashes it into the net!${a}`,
    (s, a, m) => `${m}' ⚽ GOAL! ${s} scores with a towering header from a free kick!${a}`,
    (s, a, m) => `${m}' ⚽ GOAL! An overlapping run from ${s} — and a clinical finish!${a}`,
  ],
  GK: [
    (s, a, m) => `${m}' ⚽ GOAL! Unbelievable — ${s} scores from a goal kick caught in the wind!`,
    (s, a, m) => `${m}' ⚽ GOAL! ${s} charges up for the corner and heads it in!`,
  ],
};

const freekickGoalTemplates = [
  (s, m) => `${m}' ⚽ GOAL! ${s} curls a free kick into the top corner — unstoppable!`,
  (s, m) => `${m}' ⚽ GOAL! ${s} whips the free kick over the wall and in!`,
  (s, m) => `${m}' ⚽ GOAL! ${s} bends a beautiful free kick past the keeper!`,
];

const penaltyTemplates = [
  (s, m) => `${m}' ⚽ GOAL! ${s} sends the keeper the wrong way from the penalty spot!`,
  (s, m) => `${m}' ⚽ GOAL! ${s} steps up and hammers the penalty into the roof of the net!`,
  (s, m) => `${m}' ⚽ GOAL! Cool as you like — ${s} rolls the penalty into the corner!`,
];

const oppGoalTemplates = [
  (m) => `${m}' ⚽ Opponent scores from a quick counterattack...`,
  (m) => `${m}' ⚽ A defensive lapse — opponent capitalizes and scores...`,
  (m) => `${m}' ⚽ Opponent finds space on the edge of the box and finishes...`,
  (m) => `${m}' ⚽ A scrappy goal from a set piece — opponent heads it in...`,
  (m) => `${m}' ⚽ Opponent threads a pass through the defense and converts...`,
  (m) => `${m}' ⚽ A deflection falls kindly for the opponent — they make no mistake...`,
];

const saveTemplates = [
  (gk, m) => `${m}' 🧤 Great save! ${gk} dives full stretch to tip it around the post!`,
  (gk, m) => `${m}' 🧤 ${gk} comes up big — a reflex stop denies a certain goal!`,
  (gk, m) => `${m}' 🧤 Incredible save by ${gk}! Fingertips push the shot onto the bar!`,
  (gk, m) => `${m}' 🧤 ${gk} reads it perfectly and smothers the shot at the near post!`,
];

const yellowCardTemplates = [
  (p, m) => `${m}' 🟨 ${p} goes into the book for a rash challenge.`,
  (p, m) => `${m}' 🟨 Yellow card — ${p} clips the attacker's heels.`,
  (p, m) => `${m}' 🟨 ${p} is cautioned for a cynical foul to stop the counter.`,
  (p, m) => `${m}' 🟨 The ref shows yellow to ${p} for persistent fouling.`,
];

const oppYellowTemplates = [
  (m) => `${m}' 🟨 Opponent player picks up a yellow for a late tackle.`,
  (m) => `${m}' 🟨 Booking for the opposition — a frustrated challenge.`,
];

const redCardTemplates = [
  (p, m) => `${m}' 🟥 RED CARD! ${p} is sent off for a dangerous tackle! Down to 10 men!`,
  (p, m) => `${m}' 🟥 ${p} sees red after a second yellow — you'll have to dig deep!`,
];

const oppRedTemplates = [
  (m) => `${m}' 🟥 RED CARD! Opponent reduced to 10 men after a reckless challenge!`,
];

const colorTemplates = [
  (m) => `${m}' A crunching tackle in midfield sets the tone.`,
  (m) => `${m}' The woodwork rattles — so close!`,
  (m) => `${m}' A sweeping move down the wing comes to nothing.`,
  (m) => `${m}' A long-range effort sails just over the bar.`,
  (m) => `${m}' The keeper punches clear from a dangerous corner.`,
  (m) => `${m}' A promising attack breaks down in the final third.`,
  (m) => `${m}' VAR check... no penalty. Play continues.`,
  (m) => `${m}' The crowd roars as a shot flies just wide of the post.`,
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMatchEvents(teamGoals, oppGoals, squad) {
  const events = [];
  const totalGoals = teamGoals + oppGoals;
  const gk = squad?.find((p) => p.position === "GK");

  // ── Build scorer pool weighted by position ──
  const scorerPool = squad
    ? [...squad].filter((p) => p.position !== "GK").sort((a, b) => {
        const w = { FW: 4, MID: 2, DEF: 1 };
        return (w[b.position] || 0) + b.stats.attack - (w[a.position] || 0) - a.stats.attack;
      })
    : [];

  // ── Build assist pool (midfielders and creative players first) ──
  const assistPool = squad
    ? [...squad].filter((p) => p.position !== "GK").sort((a, b) => {
        const w = { MID: 4, FW: 2, DEF: 1 };
        return (w[b.position] || 0) + b.stats.midfield - (w[a.position] || 0) - a.stats.midfield;
      })
    : [];

  // ── Card candidates (defenders and midfielders more likely) ──
  const cardPool = squad
    ? [...squad].filter((p) => p.position !== "GK").sort((a, b) => {
        const w = { DEF: 4, MID: 3, FW: 1 };
        return (w[b.position] || 0) - (w[a.position] || 0);
      })
    : [];

  // ── Generate goal minutes ──
  const goalMinutes = [];
  for (let i = 0; i < totalGoals; i++) {
    goalMinutes.push(Math.floor(Math.random() * 88) + 2);
  }
  goalMinutes.sort((a, b) => a - b);

  // ── Decide special goal types ──
  // ~15% chance each team goal is a free kick, ~10% penalty
  const specialTypes = goalMinutes.map(() => {
    const r = Math.random();
    if (r < 0.12) return "freekick";
    if (r < 0.20) return "penalty";
    return "normal";
  });

  // ── Generate non-goal events ──
  // Yellow cards: 1-3 per match total
  const numYellows = 1 + Math.floor(Math.random() * 3);
  // Red card: ~6% chance per match
  const hasRedCard = Math.random() < 0.06;
  const hasOppRedCard = Math.random() < 0.08;
  // GK saves: 1-3 per match (more if opponent scores more)
  const numSaves = gk ? Math.max(1, Math.floor(Math.random() * 3) + (oppGoals > 0 ? 1 : 0)) : 0;
  // Color events: 2-4 per match
  const numColor = 2 + Math.floor(Math.random() * 3);

  // ── Place all events on a timeline ──
  const timeline = [];

  // Goals
  let tg = 0, og = 0;
  let scorerIdx = 0;
  const usedScorers = new Set();

  for (let i = 0; i < goalMinutes.length; i++) {
    const min = goalMinutes[i];
    if (tg < teamGoals && (og >= oppGoals || Math.random() < teamGoals / totalGoals)) {
      tg++;
      const scorer = scorerPool.length > 0
        ? scorerPool[scorerIdx % scorerPool.length]
        : null;
      scorerIdx++;

      // Pick an assister (different from scorer)
      let assister = null;
      if (scorer && assistPool.length > 1 && specialTypes[i] === "normal") {
        const candidates = assistPool.filter((p) => p.id !== scorer.id);
        assister = candidates.length > 0 ? pickRandom(candidates) : null;
      }
      const assistText = assister ? ` (assist: ${assister.name})` : "";

      let text;
      if (specialTypes[i] === "freekick" && scorer) {
        text = pickRandom(freekickGoalTemplates)(scorer.name, min);
      } else if (specialTypes[i] === "penalty" && scorer) {
        text = pickRandom(penaltyTemplates)(scorer.name, min);
      } else if (scorer) {
        const templates = goalTemplates[scorer.position] || goalTemplates.MID;
        text = pickRandom(templates)(scorer.name, assistText, min);
      } else {
        text = `${min}' ⚽ GOAL! Your team scores!`;
      }

      timeline.push({
        minute: min, type: specialTypes[i] === "penalty" ? "penalty" : specialTypes[i] === "freekick" ? "freekick" : "goal",
        team: "player", text,
        scorer: scorer ? { name: scorer.name, id: scorer.id } : null,
        assist: assister ? { name: assister.name, id: assister.id } : null,
      });
      if (scorer) usedScorers.add(scorer.id);
    } else {
      og++;
      timeline.push({
        minute: min, type: "goal", team: "opponent",
        text: pickRandom(oppGoalTemplates)(min),
      });
    }
  }

  // Saves
  for (let i = 0; i < numSaves; i++) {
    const min = Math.floor(Math.random() * 88) + 2;
    timeline.push({
      minute: min, type: "save", team: "player",
      text: pickRandom(saveTemplates)(gk.name, min),
      player: { name: gk.name, id: gk.id },
    });
  }

  // Yellow cards — split between teams
  const usedCardPlayers = new Set();
  for (let i = 0; i < numYellows; i++) {
    const min = Math.floor(Math.random() * 85) + 5;
    if (Math.random() < 0.5 && cardPool.length > 0) {
      // Our player gets a yellow
      const candidates = cardPool.filter((p) => !usedCardPlayers.has(p.id));
      const player = candidates.length > 0 ? pickRandom(candidates) : pickRandom(cardPool);
      usedCardPlayers.add(player.id);
      timeline.push({
        minute: min, type: "yellow", team: "player",
        text: pickRandom(yellowCardTemplates)(player.name, min),
        player: { name: player.name, id: player.id },
      });
    } else {
      timeline.push({
        minute: min, type: "yellow", team: "opponent",
        text: pickRandom(oppYellowTemplates)(min),
      });
    }
  }

  // Red cards (rare)
  if (hasRedCard && cardPool.length > 0) {
    const min = 30 + Math.floor(Math.random() * 55);
    const player = pickRandom(cardPool.filter((p) => !usedScorers.has(p.id)) || cardPool);
    timeline.push({
      minute: min, type: "red", team: "player",
      text: pickRandom(redCardTemplates)(player.name, min),
      player: { name: player.name, id: player.id },
    });
  }
  if (hasOppRedCard) {
    const min = 25 + Math.floor(Math.random() * 60);
    timeline.push({
      minute: min, type: "red", team: "opponent",
      text: pickRandom(oppRedTemplates)(min),
    });
  }

  // Color / atmosphere events
  const usedColorIdx = new Set();
  for (let i = 0; i < numColor; i++) {
    const min = Math.floor(Math.random() * 88) + 2;
    let idx;
    do { idx = Math.floor(Math.random() * colorTemplates.length); }
    while (usedColorIdx.has(idx) && usedColorIdx.size < colorTemplates.length);
    usedColorIdx.add(idx);
    timeline.push({
      minute: min, type: "info", team: "neutral",
      text: colorTemplates[idx](min),
    });
  }

  // Half-time
  const htScore = { team: 0, opp: 0 };
  for (const e of timeline) {
    if (e.minute <= 45 && (e.type === "goal" || e.type === "freekick" || e.type === "penalty")) {
      if (e.team === "player") htScore.team++;
      else if (e.team === "opponent") htScore.opp++;
    }
  }
  timeline.push({
    minute: 45, type: "halftime", team: "neutral",
    text: `45' ── HT: Your XI ${htScore.team} - ${htScore.opp} ──`,
  });

  // Full time
  const ftText = totalGoals === 0
    ? "90' Full time — a hard-fought 0-0 draw."
    : teamGoals > oppGoals
      ? `90' Full time! A commanding ${teamGoals}-${oppGoals} victory.`
      : teamGoals === oppGoals
        ? `90' Full time — honors even at ${teamGoals}-${oppGoals}.`
        : `90' Full time. A tough ${teamGoals}-${oppGoals} defeat.`;
  timeline.push({ minute: 91, type: "fulltime", team: "neutral", text: ftText });

  // Sort by minute, with halftime/fulltime as boundaries
  timeline.sort((a, b) => {
    if (a.minute !== b.minute) return a.minute - b.minute;
    const priority = { halftime: 10, fulltime: 10, goal: 5, freekick: 5, penalty: 5 };
    return (priority[b.type] || 0) - (priority[a.type] || 0);
  });

  return timeline;
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

/**
 * Compute per-player tournament stats from match events.
 * Returns { scorers: [...], assisters: [...], cards: [...], saves: [...] }
 * Each entry: { id, name, count }
 */
export function computeTournamentStats(results) {
  const goals = {};
  const assists = {};
  const yellows = {};
  const reds = {};
  const saves = {};

  for (const match of results) {
    if (!match.events) continue;
    for (const ev of match.events) {
      if (ev.team !== "player") continue;

      if ((ev.type === "goal" || ev.type === "freekick" || ev.type === "penalty") && ev.scorer) {
        const k = ev.scorer.id;
        if (!goals[k]) goals[k] = { ...ev.scorer, count: 0 };
        goals[k].count++;
      }
      if (ev.assist) {
        const k = ev.assist.id;
        if (!assists[k]) assists[k] = { ...ev.assist, count: 0 };
        assists[k].count++;
      }
      if (ev.type === "yellow" && ev.player) {
        const k = ev.player.id;
        if (!yellows[k]) yellows[k] = { ...ev.player, count: 0 };
        yellows[k].count++;
      }
      if (ev.type === "red" && ev.player) {
        const k = ev.player.id;
        if (!reds[k]) reds[k] = { ...ev.player, count: 0 };
        reds[k].count++;
      }
      if (ev.type === "save" && ev.player) {
        const k = ev.player.id;
        if (!saves[k]) saves[k] = { ...ev.player, count: 0 };
        saves[k].count++;
      }
    }
  }

  const sortDesc = (obj) => Object.values(obj).sort((a, b) => b.count - a.count);

  return {
    scorers: sortDesc(goals),
    assisters: sortDesc(assists),
    yellowCards: sortDesc(yellows),
    redCards: sortDesc(reds),
    saves: sortDesc(saves),
  };
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildBracketData(koNames, fillers) {
  const f = [...fillers];

  const r16 = [
    { team1: "Your XI", team2: koNames[0], userPath: true },
    { team1: koNames[1], team2: f[0], winner: koNames[1] },
    { team1: koNames[2], team2: f[1], winner: koNames[2] },
    { team1: f[2], team2: f[3], winner: f[2] },
    { team1: koNames[3], team2: f[4], winner: koNames[3] },
    { team1: f[5], team2: f[6], winner: f[5] },
    { team1: f[7], team2: f[8], winner: f[7] },
    { team1: f[9], team2: f[10], winner: f[9] },
  ];

  const qf = [
    { team1: "Your XI", team2: koNames[1], userPath: true },
    { team1: koNames[2], team2: f[2], winner: koNames[2] },
    { team1: koNames[3], team2: f[5], winner: koNames[3] },
    { team1: f[7], team2: f[9], winner: f[7] },
  ];

  const sf = [
    { team1: "Your XI", team2: koNames[2], userPath: true },
    { team1: koNames[3], team2: f[7], winner: koNames[3] },
  ];

  const final_ = [
    { team1: "Your XI", team2: koNames[3], userPath: true },
  ];

  return {
    rounds: [r16, qf, sf, final_],
    roundNames: ["Round of 16", "Quarters", "Semis", "Final"],
  };
}
