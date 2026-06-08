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

  // Fallback: pull from other outfield positions, but NEVER offer GK for non-GK slots
  // and NEVER offer outfield players for GK slots
  const fallbackPool = legends.filter((l) => {
    if (draftedIds.has(l.id)) return false;
    if (l.position === position) return true;
    if (position === "GK") return false;
    if (l.position === "GK") return false;
    return true;
  });

  return shuffleArray(fallbackPool).slice(0, 3);
}

export function simulateTournament(squad) {
  const teamStats = calculateTeamStats(squad);
  const boostedStats = applySuperPowers(squad, teamStats);
  const opponents = shuffleArray([...historicOpponents]).slice(0, 7);
  const rounds = ["Group A", "Group B", "Group C", "Round of 16", "Quarter-Final", "Semi-Final", "Final"];
  const results = [];
  let eliminated = false;

  for (let i = 0; i < 7; i++) {
    if (eliminated) break;
    const opponent = opponents[i];
    const match = simulateMatch(boostedStats, opponent, rounds[i]);
    results.push(match);

    if (i < 3) {
      const groupResults = results.slice(0, i + 1);
      const points = groupResults.reduce((sum, r) => {
        if (r.result === "W") return sum + 3;
        if (r.result === "D") return sum + 1;
        return sum;
      }, 0);
      if (i === 2 && points < 4) {
        eliminated = true;
      }
    } else {
      if (match.result === "L") {
        eliminated = true;
      }
    }
  }

  return { results, eliminated, finalRound: results[results.length - 1].round };
}

function simulateMatch(team, opponent, round) {
  const teamPower = team.attack * 0.4 + team.midfield * 0.35 + team.defense * 0.25;
  const oppPower = opponent.attack * 0.4 + opponent.midfield * 0.35 + opponent.defense * 0.25;

  // Amplify the gap: raise ratio to a power so big differences dominate
  const rawRatio = teamPower / oppPower;
  const amplified = Math.pow(rawRatio, 3);
  const teamChance = amplified / (amplified + 1);

  // Higher-rated teams score more, lower-rated teams score less
  const teamAttackFactor = team.attack / 85;
  const oppAttackFactor = opponent.attack / 85;

  const roll = Math.random();
  let teamGoals, oppGoals;

  if (roll < teamChance * 0.75) {
    // Team wins
    teamGoals = Math.floor(Math.random() * 3 * teamAttackFactor) + 1;
    oppGoals = Math.max(0, Math.floor(Math.random() * Math.max(1, teamGoals) * (1 / rawRatio)));
    if (oppGoals >= teamGoals) oppGoals = teamGoals - 1;
  } else if (roll < teamChance * 0.75 + 0.12) {
    // Draw
    const avgGoals = Math.floor(Math.random() * 2 * ((teamAttackFactor + oppAttackFactor) / 2)) + 1;
    teamGoals = avgGoals;
    oppGoals = avgGoals;
  } else {
    // Opponent wins
    oppGoals = Math.floor(Math.random() * 3 * oppAttackFactor) + 1;
    teamGoals = Math.max(0, Math.floor(Math.random() * Math.max(1, oppGoals) * rawRatio * 0.5));
    if (teamGoals >= oppGoals) teamGoals = oppGoals - 1;
  }

  teamGoals = Math.max(0, teamGoals);
  oppGoals = Math.max(0, oppGoals);

  let result;
  if (teamGoals > oppGoals) result = "W";
  else if (teamGoals === oppGoals) result = "D";
  else result = "L";

  // Knockout rounds: no draws — go to "extra time / penalties"
  const isKnockout = !round.startsWith("Group");
  if (isKnockout && result === "D") {
    if (Math.random() < teamChance) {
      result = "W";
      teamGoals += 1;
    } else {
      result = "L";
      oppGoals += 1;
    }
  }

  const events = generateMatchEvents(teamGoals, oppGoals);

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

function generateMatchEvents(teamGoals, oppGoals) {
  const events = [];
  const totalGoals = teamGoals + oppGoals;
  if (totalGoals === 0) {
    events.push({ minute: 45, type: "info", team: "neutral", text: "45' A tense, goalless first half." });
    events.push({ minute: 90, type: "info", team: "neutral", text: "90' Full time — a hard-fought 0-0 draw." });
    return events;
  }

  const minutes = [];
  for (let i = 0; i < totalGoals; i++) {
    minutes.push(Math.floor(Math.random() * 88) + 2);
  }
  minutes.sort((a, b) => a - b);

  let tg = 0, og = 0;
  for (let i = 0; i < minutes.length; i++) {
    if (tg < teamGoals && (og >= oppGoals || Math.random() < teamGoals / totalGoals)) {
      tg++;
      events.push({ minute: minutes[i], type: "goal", team: "player", text: `${minutes[i]}' ⚽ GOAL! Your team scores!` });
    } else {
      og++;
      events.push({ minute: minutes[i], type: "goal", team: "opponent", text: `${minutes[i]}' ⚽ Opponent scores...` });
    }
  }

  return events;
}

export function calculateTeamStats(squad) {
  if (squad.length === 0) return { attack: 0, midfield: 0, defense: 0 };

  const totals = squad.reduce(
    (acc, p) => ({
      attack: acc.attack + p.stats.attack,
      midfield: acc.midfield + p.stats.midfield,
      defense: acc.defense + p.stats.defense,
    }),
    { attack: 0, midfield: 0, defense: 0 }
  );

  return {
    attack: Math.round(totals.attack / squad.length),
    midfield: Math.round(totals.midfield / squad.length),
    defense: Math.round(totals.defense / squad.length),
  };
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

    if (achieved) {
      records.push({ player, headline });
    }
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
