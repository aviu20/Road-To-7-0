import { useState, useCallback } from "react";
import { formations } from "./data/legends";
import {
  PHASES,
  createInitialState,
  buildSlots,
  generateDraftChoices,
  simulateTournament,
} from "./engine/gameEngine";
import SetupPhase from "./components/SetupPhase";
import DraftPhase from "./components/DraftPhase";
import TournamentPhase from "./components/TournamentPhase";
import GameOverPhase from "./components/GameOverPhase";

export default function App() {
  const [state, setState] = useState(createInitialState);

  const handleSelectFormation = useCallback((formationKey) => {
    const config = formations[formationKey];
    const slots = buildSlots(config);
    const choices = generateDraftChoices(slots[0].position, []);
    setState((s) => ({
      ...s,
      phase: PHASES.DRAFT,
      formation: formationKey,
      slots,
      currentSlot: 0,
      draftChoices: choices,
    }));
  }, []);

  const handlePick = useCallback((player) => {
    setState((s) => {
      const newSlots = [...s.slots];
      newSlots[s.currentSlot] = { ...newSlots[s.currentSlot], filled: true, player };
      const newSquad = [...s.squad, player];
      const nextSlot = s.currentSlot + 1;

      if (nextSlot >= newSlots.length) {
        const tournament = simulateTournament(newSquad);
        return {
          ...s,
          slots: newSlots,
          squad: newSquad,
          phase: PHASES.TOURNAMENT,
          tournamentResults: tournament.results,
          groupTable: tournament.groupTable,
          eliminated: tournament.eliminated,
          finalRound: tournament.finalRound,
        };
      }

      const choices = generateDraftChoices(newSlots[nextSlot].position, newSquad);
      return {
        ...s,
        slots: newSlots,
        squad: newSquad,
        currentSlot: nextSlot,
        draftChoices: choices,
      };
    });
  }, []);

  const handleRespin = useCallback(() => {
    setState((s) => {
      if (s.respinsLeft <= 0) return s;
      const choices = generateDraftChoices(s.slots[s.currentSlot].position, s.squad);
      return { ...s, respinsLeft: s.respinsLeft - 1, draftChoices: choices };
    });
  }, []);

  const handleTournamentComplete = useCallback(() => {
    setState((s) => ({ ...s, phase: PHASES.GAME_OVER }));
  }, []);

  const handleRestart = useCallback(() => {
    setState(createInitialState());
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {state.phase === PHASES.SETUP && (
        <SetupPhase onSelectFormation={handleSelectFormation} />
      )}
      {state.phase === PHASES.DRAFT && (
        <DraftPhase
          formationKey={state.formation}
          slots={state.slots}
          currentSlot={state.currentSlot}
          choices={state.draftChoices}
          respinsLeft={state.respinsLeft}
          onPick={handlePick}
          onRespin={handleRespin}
        />
      )}
      {state.phase === PHASES.TOURNAMENT && (
        <TournamentPhase
          results={state.tournamentResults}
          groupTable={state.groupTable}
          onComplete={handleTournamentComplete}
        />
      )}
      {state.phase === PHASES.GAME_OVER && (
        <GameOverPhase
          squad={state.squad}
          results={state.tournamentResults}
          eliminated={state.eliminated}
          finalRound={state.finalRound}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
