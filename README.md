# Road to 7-0 — World Cup Ultimate XI Draft Game

A frontend-only React web app where you draft legendary footballers from across World Cup history, assemble your Ultimate XI, and battle through a simulated knockout tournament. Built to teach new soccer fans about the greatest players, matches, and moments in World Cup history.

## How It Works

The game follows a 4-phase loop:

### 1. Formation Setup
Pick your tactical formation — **4-3-3** (attacking), **4-4-2** (balanced), or **3-5-2** (midfield control). Your choice determines how many Forwards, Midfielders, Defenders, and Goalkeepers you'll draft, and how your team's ratings are weighted.

### 2. The Draft (11 Rounds)
Each round, a slot-machine spinner cycles through flags and years from World Cup history, then presents **3 player cards** from the matching position pool. Every card includes:
- **Overall rating** (85–99)
- **Positional stats** — Attack, Midfield, Defense bars
- **Historical trivia** — a one-sentence fact about why this player is a legend
- **Superpower** (marquee legends only) — a named ability that boosts your squad's stats

A **live pitch diagram** fills in as you draft, showing your formation taking shape. You get **3 re-spins** per game if you don't like your options.

**Marquee Legends** (gold-bordered cards with a star badge) are the top 2–3 icons from each historic squad — players like Pelé, Maradona, Zidane, and Messi. Their superpowers provide tangible stat bonuses to your whole team.

### 3. Tournament Simulation
Your Ultimate XI faces a **7-match knockout bracket**: 3 Group Stage matches (rendered as a live group table with points and goal difference), then Round of 16 → Quarter-Final → Semi-Final → Final.

Match outcomes are calculated using **position-weighted ratings** — your Forwards drive your Attack score, Midfielders drive Midfield, and Defenders + GK drive Defense. The simulation uses cubic power amplification so a stacked squad dominates weaker opponents as you'd expect, while underdogs can still pull off upsets.

Each match generates a **live event ticker** showing goals with the names of your drafted players.

### 4. Game Over & Beginner Insights
After elimination (or lifting the trophy), you see:
- **Match stats** — wins, goals scored, clean sheets
- **Team ratings** — your squad's weighted Attack / Midfield / Defense
- **Record Breaker Cards** — premium golden cards awarded when your simulated performance matches or exceeds the real historical achievements embedded in your drafted players (e.g., "Score 8+ goals" unlocks Ronaldo's *O Fenômeno* record card)
- **Full squad roster** with position badges and ratings

Hit **Draft Again** to try a different formation, different legends, different era.

## The Database

**176 players** across **16 iconic World Cup squads**:

| Year | Nation | Highlight |
|------|--------|-----------|
| 1966 | England | Bobby Moore, Banks, Hurst's hat-trick Final |
| 1970 | Brazil | Pelé, Jairzinho, Carlos Alberto — the greatest team ever |
| 1974 | West Germany | Beckenbauer's Kaiser era |
| 1974 | Netherlands | Cruyff and Total Football |
| 1986 | Argentina | Maradona's Hand of God and Goal of the Century |
| 1990 | West Germany | Matthäus, Klinsmann, Brehme's penalty |
| 1994 | Brazil | Romário and Bebeto's baby celebration |
| 1998 | France | Zidane's two headers in the Final |
| 2002 | Brazil | Ronaldo's 8-goal redemption arc |
| 2006 | Italy | Buffon, Cannavaro, Pirlo — 453 minutes of near-perfection |
| 2010 | Spain | Xavi, Iniesta, tiki-taka |
| 2014 | Germany | Neuer, Kroos, the 7-1 |
| 2018 | France | Teenage Mbappé, Kanté everywhere |
| 2018 | Croatia | Modrić's Golden Ball, smallest nation in a Final |
| 2022 | Argentina | Messi completes football |
| 2022 | Morocco | First African semifinalist |

Every player has hand-written trivia explaining their historical significance, making the draft itself an educational experience.

## Tech Stack

- **React 19** + **Vite 8** — fast dev server, instant HMR
- **Tailwind CSS v4** — utility-first styling with custom dark theme tokens
- **Lucide React** — clean SVG icons
- **Zero backend** — all game logic runs client-side in the browser

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Production build
npm run build
```

The dev server runs at `http://localhost:5173`.

## Project Structure

```
src/
├── data/
│   └── legends.js            # 176 players, formations, pitch coordinates, historic opponents
├── engine/
│   └── gameEngine.js         # State machine, draft logic, weighted sim, record checker
├── components/
│   ├── SetupPhase.jsx        # Formation selection
│   ├── DraftPhase.jsx        # 11-round draft with spin animation + pitch view
│   ├── PitchView.jsx         # Interactive formation diagram
│   ├── PlayerCard.jsx        # Player cards with legend highlights + superpowers
│   ├── TournamentPhase.jsx   # Match sim with group table + knockout bracket
│   └── GameOverPhase.jsx     # Summary, record breaker cards, squad review
├── App.jsx                   # Main state machine
├── main.jsx                  # Entry point
└── index.css                 # Tailwind v4 config + dark theme
```

## License

MIT
