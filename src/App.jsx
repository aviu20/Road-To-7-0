import { useState, useCallback } from "react";
import { playingStyles, legends } from "./data/legends";
import {
  PHASES,
  createInitialState,
  buildSlots,
  generateDraftChoices,
  simulateTournament,
} from "./engine/gameEngine";
import { addRunToCollection, getCollectionStats } from "./engine/collection";
import SetupPhase from "./components/SetupPhase";
import DraftPhase from "./components/DraftPhase";
import TournamentPhase from "./components/TournamentPhase";
import GameOverPhase from "./components/GameOverPhase";

export default function App() {
  const [state, setState] = useState(createInitialState);
  const [collectionStats, setCollectionStats] = useState(() => getCollectionStats(legends.length));

  const refreshCollection = useCallback(() => {
    setCollectionStats(getCollectionStats(legends.length));
  }, []);

  const handleSelectStyle = useCallback((styleId) => {
    const style = playingStyles.find((s) => s.id === styleId);
    const formationKey = style.formation;
    const slots = buildSlots(formationKey);
    const choices = generateDraftChoices(slots[0].role, []);
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
          groupAIMatches: tournament.groupAIMatches,
          eliminated: tournament.eliminated,
          finalRound: tournament.finalRound,
          bracket: tournament.bracket,
        };
      }

      const choices = generateDraftChoices(newSlots[nextSlot].role, newSquad);
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
      const choices = generateDraftChoices(s.slots[s.currentSlot].role, s.squad);
      return { ...s, respinsLeft: s.respinsLeft - 1, draftChoices: choices };
    });
  }, []);

  const handleTournamentComplete = useCallback(() => {
    setState((s) => {
      const won = !s.eliminated && s.tournamentResults.length === 7;
      const collectionResult = addRunToCollection(s.squad, won);
      return { ...s, phase: PHASES.GAME_OVER, newPlayers: collectionResult.newPlayers };
    });
    refreshCollection();
  }, [refreshCollection]);

  const handleRestart = useCallback(() => {
    setState(createInitialState());
  }, []);

  return (
    <div className="min-h-screen bg-[#060a13]">
      {state.phase === PHASES.SETUP && (
        <SetupPhase onSelectStyle={handleSelectStyle} collectionStats={collectionStats} />
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
          groupAIMatches={state.groupAIMatches}
          bracket={state.bracket}
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
          collectionStats={collectionStats}
          newPlayers={state.newPlayers || []}
        />
      )}
    </div>
  );
}
