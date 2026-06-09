/**
 * Generate World Cup 2026 player data from the Guardian's player guide.
 * Uses EA FC 26 base card ratings for known players, estimates for others.
 *
 * Run: node scripts/generate_wc2026.js > src/data/wc2026_players.js
 */

import { readFileSync } from "fs";

// Load Guardian data
const raw = readFileSync("guardian_players_full.json", "utf8");
const data = JSON.parse(JSON.parse(raw));

// ─── EA FC 26 Ratings & Roles ────────────────────────────────
// Key players get exact EA FC 26 base card ratings and specific roles.
// Lesser-known players get estimated ratings based on their team strength
// and typical squad hierarchy.

const knownPlayers = {
  // ── ARGENTINA ──
  "Lionel Messi": { rating: 88, role: "RW", atk: 90, mid: 85, def: 25 },
  "Julián Álvarez": { rating: 88, role: "ST", atk: 90, mid: 68, def: 35 },
  "Lautaro Martínez": { rating: 87, role: "ST", atk: 89, mid: 55, def: 32 },
  "Emiliano Martínez": { rating: 88, role: "GK", atk: 8, mid: 15, def: 90 },
  "Enzo Fernández": { rating: 86, role: "CM", atk: 65, mid: 88, def: 70 },
  "Alexis Mac Allister": { rating: 85, role: "CM", atk: 70, mid: 87, def: 65 },
  "Rodrigo De Paul": { rating: 84, role: "CM", atk: 68, mid: 85, def: 62 },
  "Cristian Romero": { rating: 86, role: "CB", atk: 25, mid: 52, def: 90 },
  "Lisandro Martínez": { rating: 85, role: "CB", atk: 28, mid: 55, def: 88 },
  "Nahuel Molina": { rating: 82, role: "RB", atk: 50, mid: 65, def: 80 },
  "Nicolás Tagliafico": { rating: 80, role: "LB", atk: 42, mid: 58, def: 80 },
  "Nicolás Otamendi": { rating: 81, role: "CB", atk: 22, mid: 45, def: 83 },
  "Giovani Lo Celso": { rating: 82, role: "CAM", atk: 70, mid: 84, def: 45 },
  "Leandro Paredes": { rating: 81, role: "CDM", atk: 48, mid: 83, def: 65 },
  "Thiago Almada": { rating: 82, role: "CAM", atk: 75, mid: 84, def: 35 },
  "Nico Paz": { rating: 80, role: "CAM", atk: 72, mid: 82, def: 30 },
  "Exequiel Palacios": { rating: 82, role: "CM", atk: 55, mid: 84, def: 62 },
  "Nicolás González": { rating: 80, role: "LW", atk: 80, mid: 62, def: 35 },
  "Valentín Barco": { rating: 76, role: "LB", atk: 45, mid: 60, def: 75 },
  "Leonardo Balerdi": { rating: 79, role: "CB", atk: 22, mid: 45, def: 80 },
  "Gonzalo Montiel": { rating: 80, role: "RB", atk: 40, mid: 60, def: 80 },
  "Giuliano Simeone": { rating: 77, role: "RW", atk: 78, mid: 58, def: 30 },
  "José López": { rating: 76, role: "ST", atk: 78, mid: 42, def: 22 },
  "Facundo Medina": { rating: 78, role: "CB", atk: 22, mid: 45, def: 79 },
  "Juan Musso": { rating: 81, role: "GK", atk: 8, mid: 15, def: 83 },
  "Gerónimo Rulli": { rating: 81, role: "GK", atk: 8, mid: 15, def: 82 },

  // ── FRANCE ──
  "Kylian Mbappé": { rating: 91, role: "LW", atk: 95, mid: 62, def: 22 },
  "Ousmane Dembélé": { rating: 86, role: "RW", atk: 88, mid: 62, def: 30 },
  "Marcus Thuram": { rating: 85, role: "ST", atk: 87, mid: 55, def: 35 },
  "William Saliba": { rating: 87, role: "CB", atk: 22, mid: 50, def: 90 },
  "Jules Koundé": { rating: 85, role: "RB", atk: 40, mid: 62, def: 87 },
  "Aurélien Tchouaméni": { rating: 86, role: "CDM", atk: 48, mid: 86, def: 82 },
  "N'Golo Kanté": { rating: 82, role: "CDM", atk: 38, mid: 85, def: 82 },
  "Mike Maignan": { rating: 86, role: "GK", atk: 8, mid: 18, def: 88 },
  "Dayot Upamecano": { rating: 83, role: "CB", atk: 22, mid: 48, def: 85 },
  "Théo Hernández": { rating: 84, role: "LB", atk: 55, mid: 62, def: 82 },
  "Lucas Hernández": { rating: 83, role: "CB", atk: 22, mid: 48, def: 85 },
  "Ibrahima Konaté": { rating: 84, role: "CB", atk: 22, mid: 48, def: 86 },
  "Adrien Rabiot": { rating: 82, role: "CM", atk: 60, mid: 83, def: 65 },
  "Michael Olise": { rating: 84, role: "RW", atk: 85, mid: 72, def: 28 },
  "Bradley Barcola": { rating: 82, role: "LW", atk: 83, mid: 58, def: 25 },
  "Warren Zaïre-Emery": { rating: 80, role: "CM", atk: 55, mid: 80, def: 60 },
  "Manu Koné": { rating: 80, role: "CM", atk: 52, mid: 80, def: 65 },
  "Malo Gusto": { rating: 80, role: "RB", atk: 42, mid: 58, def: 80 },
  "Lucas Digne": { rating: 80, role: "LB", atk: 48, mid: 60, def: 80 },
  "Brice Samba": { rating: 81, role: "GK", atk: 8, mid: 15, def: 83 },
  "Jean-Philippe Mateta": { rating: 80, role: "ST", atk: 82, mid: 40, def: 22 },
  "Rayan Cherki": { rating: 79, role: "CAM", atk: 78, mid: 78, def: 28 },
  "Désiré Doué": { rating: 79, role: "LW", atk: 80, mid: 65, def: 25 },
  "Maghnes Akliouche": { rating: 78, role: "RW", atk: 78, mid: 65, def: 25 },
  "Robin Risser": { rating: 72, role: "GK", atk: 8, mid: 15, def: 72 },
  "Maxence Lacroix": { rating: 78, role: "CB", atk: 22, mid: 45, def: 80 },

  // ── ENGLAND ──
  "Jude Bellingham": { rating: 90, role: "CAM", atk: 85, mid: 92, def: 52 },
  "Bukayo Saka": { rating: 88, role: "RW", atk: 90, mid: 72, def: 35 },
  "Phil Foden": { rating: 88, role: "LW", atk: 88, mid: 85, def: 32 },
  "Harry Kane": { rating: 88, role: "ST", atk: 94, mid: 60, def: 25 },
  "Declan Rice": { rating: 87, role: "CDM", atk: 42, mid: 88, def: 82 },
  "Cole Palmer": { rating: 86, role: "CAM", atk: 85, mid: 82, def: 28 },
  "Jordan Pickford": { rating: 83, role: "GK", atk: 10, mid: 18, def: 85 },
  "John Stones": { rating: 84, role: "CB", atk: 25, mid: 58, def: 86 },
  "Marc Guéhi": { rating: 82, role: "CB", atk: 22, mid: 48, def: 84 },
  "Kobbie Mainoo": { rating: 80, role: "CM", atk: 58, mid: 80, def: 62 },
  "Tino Livramento": { rating: 79, role: "RB", atk: 48, mid: 60, def: 78 },
  "Reece James": { rating: 82, role: "RB", atk: 55, mid: 65, def: 82 },
  "Ezri Konsa": { rating: 80, role: "CB", atk: 22, mid: 48, def: 82 },
  "Eberechi Eze": { rating: 82, role: "CAM", atk: 80, mid: 82, def: 28 },
  "Morgan Rogers": { rating: 79, role: "CAM", atk: 78, mid: 78, def: 30 },
  "Anthony Gordon": { rating: 81, role: "LW", atk: 82, mid: 58, def: 28 },
  "Noni Madueke": { rating: 80, role: "RW", atk: 82, mid: 55, def: 25 },
  "Ollie Watkins": { rating: 83, role: "ST", atk: 85, mid: 52, def: 30 },
  "Ivan Toney": { rating: 81, role: "ST", atk: 83, mid: 48, def: 25 },
  "Marcus Rashford": { rating: 81, role: "LW", atk: 83, mid: 55, def: 25 },
  "Dan Burn": { rating: 78, role: "CB", atk: 20, mid: 42, def: 80 },
  "Elliot Anderson": { rating: 77, role: "CM", atk: 55, mid: 76, def: 55 },
  "Jordan Henderson": { rating: 78, role: "CM", atk: 45, mid: 78, def: 68 },
  "Dean Henderson": { rating: 78, role: "GK", atk: 8, mid: 15, def: 80 },
  "James Trafford": { rating: 74, role: "GK", atk: 8, mid: 15, def: 74 },
  "Djed Spence": { rating: 75, role: "RB", atk: 48, mid: 55, def: 74 },
  "Jarell Quansah": { rating: 76, role: "CB", atk: 22, mid: 42, def: 76 },
  "Nico O'Reilly": { rating: 72, role: "LB", atk: 38, mid: 52, def: 72 },

  // ── BRAZIL ──
  "Vinícius Júnior": { rating: 92, role: "LW", atk: 95, mid: 62, def: 22 },
  "Rodrygo": { rating: 85, role: "RW", atk: 86, mid: 65, def: 28 },
  "Endrick": { rating: 82, role: "ST", atk: 85, mid: 45, def: 22 },
  "Neymar": { rating: 85, role: "LW", atk: 88, mid: 78, def: 22 },
  "Raphinha": { rating: 85, role: "RW", atk: 86, mid: 62, def: 32 },
  "Alisson": { rating: 89, role: "GK", atk: 10, mid: 18, def: 91 },
  "Ederson": { rating: 87, role: "GK", atk: 12, mid: 25, def: 88 },
  "Marquinhos": { rating: 86, role: "CB", atk: 25, mid: 52, def: 90 },
  "Gabriel Magalhães": { rating: 85, role: "CB", atk: 28, mid: 48, def: 88 },
  "Bruno Guimarães": { rating: 86, role: "CDM", atk: 55, mid: 88, def: 72 },
  "Lucas Paquetá": { rating: 84, role: "CAM", atk: 75, mid: 85, def: 38 },
  "Casemiro": { rating: 82, role: "CDM", atk: 42, mid: 80, def: 82 },
  "Matheus Cunha": { rating: 83, role: "ST", atk: 84, mid: 62, def: 28 },
  "Gabriel Martinelli": { rating: 82, role: "LW", atk: 83, mid: 55, def: 28 },
  "Bremer": { rating: 83, role: "CB", atk: 22, mid: 45, def: 86 },
  "Danilo": { rating: 79, role: "RB", atk: 42, mid: 58, def: 80 },
  "Alex Sandro": { rating: 78, role: "LB", atk: 42, mid: 55, def: 78 },
  "Fabinho": { rating: 80, role: "CDM", atk: 35, mid: 78, def: 80 },
  "Éderson": { rating: 80, role: "CM", atk: 55, mid: 80, def: 58 },
  "Weverton": { rating: 80, role: "GK", atk: 8, mid: 15, def: 82 },
  "Léo Pereira": { rating: 79, role: "CB", atk: 22, mid: 42, def: 80 },
  "Douglas Santos": { rating: 77, role: "LB", atk: 42, mid: 55, def: 76 },
  "Roger Ibañez": { rating: 79, role: "CB", atk: 22, mid: 45, def: 80 },
  "Danilo Santos": { rating: 76, role: "CM", atk: 45, mid: 76, def: 55 },
  "Luiz Henrique": { rating: 80, role: "RW", atk: 82, mid: 55, def: 25 },
  "Igor Thiago": { rating: 76, role: "ST", atk: 78, mid: 40, def: 20 },
  "Rayan": { rating: 74, role: "LW", atk: 76, mid: 50, def: 22 },

  // ── GERMANY ──
  "Jamal Musiala": { rating: 88, role: "CAM", atk: 85, mid: 88, def: 35 },
  "Florian Wirtz": { rating: 87, role: "CAM", atk: 85, mid: 88, def: 32 },
  "Kai Havertz": { rating: 83, role: "ST", atk: 84, mid: 72, def: 35 },
  "Leroy Sané": { rating: 82, role: "LW", atk: 84, mid: 62, def: 25 },
  "Joshua Kimmich": { rating: 87, role: "RB", atk: 55, mid: 88, def: 82 },
  "Antonio Rüdiger": { rating: 85, role: "CB", atk: 25, mid: 52, def: 88 },
  "Manuel Neuer": { rating: 84, role: "GK", atk: 10, mid: 22, def: 86 },
  "Jonathan Tah": { rating: 83, role: "CB", atk: 22, mid: 48, def: 85 },
  "Aleksandar Pavlovic": { rating: 80, role: "CDM", atk: 42, mid: 80, def: 68 },
  "Leon Goretzka": { rating: 82, role: "CM", atk: 68, mid: 83, def: 65 },
  "Nico Schlotterbeck": { rating: 82, role: "CB", atk: 25, mid: 52, def: 84 },
  "David Raum": { rating: 79, role: "LB", atk: 52, mid: 62, def: 78 },
  "Pascal Gross": { rating: 80, role: "CM", atk: 58, mid: 82, def: 58 },
  "Angelo Stiller": { rating: 79, role: "CDM", atk: 42, mid: 80, def: 65 },
  "Jamie Leweling": { rating: 78, role: "RW", atk: 80, mid: 58, def: 28 },
  "Nick Woltemade": { rating: 75, role: "ST", atk: 77, mid: 45, def: 22 },
  "Maximilian Beier": { rating: 77, role: "ST", atk: 79, mid: 48, def: 22 },
  "Deniz Undav": { rating: 79, role: "ST", atk: 81, mid: 52, def: 25 },
  "Felix Nmecha": { rating: 77, role: "CM", atk: 55, mid: 76, def: 55 },
  "Waldemar Anton": { rating: 80, role: "CB", atk: 22, mid: 45, def: 82 },
  "Nathaniel Brown": { rating: 74, role: "LB", atk: 45, mid: 55, def: 74 },
  "Malick Thiaw": { rating: 78, role: "CB", atk: 22, mid: 42, def: 80 },
  "Oliver Baumann": { rating: 80, role: "GK", atk: 8, mid: 15, def: 82 },
  "Alexander Nübel": { rating: 78, role: "GK", atk: 8, mid: 15, def: 80 },
  "Nadiem Amiri": { rating: 77, role: "CAM", atk: 72, mid: 78, def: 35 },
  "Assan Ouédraogo": { rating: 74, role: "CM", atk: 55, mid: 74, def: 45 },

  // ── SPAIN ──
  "Rodri": { rating: 91, role: "CDM", atk: 58, mid: 92, def: 85 },
  "Lamine Yamal": { rating: 86, role: "RW", atk: 88, mid: 72, def: 22 },
  "Pedri": { rating: 86, role: "CM", atk: 65, mid: 90, def: 55 },
  "Nico Williams": { rating: 84, role: "LW", atk: 86, mid: 58, def: 25 },
  "Dani Olmo": { rating: 85, role: "CAM", atk: 82, mid: 86, def: 38 },
  "Gavi": { rating: 83, role: "CM", atk: 62, mid: 85, def: 60 },
  "David Raya": { rating: 85, role: "GK", atk: 8, mid: 18, def: 88 },
  "Pau Cubarsí": { rating: 81, role: "CB", atk: 22, mid: 50, def: 83 },
  "Marc Cucurella": { rating: 81, role: "LB", atk: 45, mid: 62, def: 82 },
  "Fabián Ruiz": { rating: 83, role: "CM", atk: 62, mid: 85, def: 58 },
  "Pedro Porro": { rating: 82, role: "RB", atk: 55, mid: 62, def: 80 },
  "Aymeric Laporte": { rating: 83, role: "CB", atk: 25, mid: 55, def: 86 },
  "Mikel Merino": { rating: 82, role: "CM", atk: 58, mid: 84, def: 65 },
  "Martín Zubimendi": { rating: 83, role: "CDM", atk: 45, mid: 85, def: 72 },
  "Álex Baena": { rating: 80, role: "CAM", atk: 72, mid: 82, def: 38 },
  "Unai Simón": { rating: 82, role: "GK", atk: 8, mid: 15, def: 84 },
  "Eric García": { rating: 79, role: "CB", atk: 25, mid: 55, def: 80 },
  "Álex Grimaldo": { rating: 82, role: "LB", atk: 58, mid: 68, def: 78 },
  "Marcos Llorente": { rating: 82, role: "RB", atk: 62, mid: 78, def: 78 },
  "Ferran Torres": { rating: 80, role: "LW", atk: 82, mid: 55, def: 22 },
  "Yéremy Pino": { rating: 80, role: "RW", atk: 82, mid: 58, def: 25 },
  "Mikel Oyarzabal": { rating: 80, role: "LW", atk: 80, mid: 62, def: 28 },
  "Marc Pubill": { rating: 76, role: "RB", atk: 45, mid: 55, def: 76 },
  "Joan García": { rating: 74, role: "GK", atk: 8, mid: 15, def: 75 },
  "Víctor Muñoz": { rating: 74, role: "ST", atk: 76, mid: 42, def: 20 },
  "Borja Iglesias": { rating: 78, role: "ST", atk: 80, mid: 42, def: 20 },

  // ── PORTUGAL ──
  "Cristiano Ronaldo": { rating: 84, role: "ST", atk: 88, mid: 52, def: 22 },
  "Bruno Fernandes": { rating: 86, role: "CAM", atk: 82, mid: 88, def: 42 },
  "Rafael Leão": { rating: 86, role: "LW", atk: 88, mid: 58, def: 22 },
  "Bernardo Silva": { rating: 87, role: "RW", atk: 80, mid: 90, def: 45 },
  "Rúben Dias": { rating: 86, role: "CB", atk: 22, mid: 48, def: 90 },
  "Diogo Jota": { rating: 84, role: "ST", atk: 86, mid: 62, def: 28 },
  "Vitinha": { rating: 84, role: "CM", atk: 62, mid: 86, def: 55 },
  "João Palhinha": { rating: 84, role: "CDM", atk: 38, mid: 82, def: 85 },
  "Nuno Mendes": { rating: 83, role: "LB", atk: 52, mid: 62, def: 82 },
  "Diogo Costa": { rating: 83, role: "GK", atk: 8, mid: 18, def: 85 },
  "João Cancelo": { rating: 83, role: "RB", atk: 58, mid: 72, def: 78 },
  "Pedro Neto": { rating: 82, role: "RW", atk: 84, mid: 55, def: 25 },
  "Gonçalo Inácio": { rating: 82, role: "CB", atk: 22, mid: 50, def: 84 },
  "Francisco Conceição": { rating: 81, role: "RW", atk: 82, mid: 58, def: 25 },
  "António Silva": { rating: 80, role: "CB", atk: 22, mid: 48, def: 82 },
  "Pepe": { rating: 78, role: "CB", atk: 22, mid: 42, def: 82 },
  "Rui Patrício": { rating: 78, role: "GK", atk: 8, mid: 15, def: 80 },
  "José Sá": { rating: 79, role: "GK", atk: 8, mid: 15, def: 80 },
  "Renato Sanches": { rating: 78, role: "CM", atk: 55, mid: 78, def: 55 },
  "Nélson Semedo": { rating: 79, role: "RB", atk: 48, mid: 58, def: 78 },
  "João Mário": { rating: 78, role: "CM", atk: 52, mid: 78, def: 55 },
  "Trincão": { rating: 79, role: "RW", atk: 80, mid: 55, def: 22 },
  "Geovany Quenda": { rating: 76, role: "RW", atk: 78, mid: 52, def: 25 },
  "Tiago Santos": { rating: 76, role: "RB", atk: 42, mid: 55, def: 76 },
  "Tomás Araújo": { rating: 75, role: "CB", atk: 22, mid: 42, def: 76 },
  "Fábio Silva": { rating: 76, role: "ST", atk: 78, mid: 42, def: 20 },

  // ── NETHERLANDS ──
  "Virgil van Dijk": { rating: 87, role: "CB", atk: 30, mid: 52, def: 92 },
  "Cody Gakpo": { rating: 84, role: "LW", atk: 85, mid: 65, def: 28 },
  "Xavi Simons": { rating: 84, role: "CAM", atk: 82, mid: 84, def: 32 },
  "Frenkie de Jong": { rating: 85, role: "CM", atk: 55, mid: 88, def: 62 },
  "Memphis Depay": { rating: 80, role: "ST", atk: 83, mid: 65, def: 22 },
  "Nathan Aké": { rating: 82, role: "CB", atk: 25, mid: 55, def: 84 },
  "Denzel Dumfries": { rating: 82, role: "RB", atk: 55, mid: 62, def: 80 },
  "Ryan Gravenberch": { rating: 82, role: "CM", atk: 60, mid: 82, def: 62 },
  "Jeremie Frimpong": { rating: 82, role: "RB", atk: 62, mid: 65, def: 78 },
  "Jurriën Timber": { rating: 82, role: "CB", atk: 28, mid: 58, def: 84 },
  "Bart Verbruggen": { rating: 80, role: "GK", atk: 8, mid: 15, def: 82 },
  "Matthijs de Ligt": { rating: 82, role: "CB", atk: 25, mid: 48, def: 84 },
  "Teun Koopmeiners": { rating: 83, role: "CM", atk: 65, mid: 84, def: 62 },
  "Donyell Malen": { rating: 81, role: "RW", atk: 83, mid: 52, def: 25 },
  "Micky van de Ven": { rating: 81, role: "CB", atk: 22, mid: 48, def: 83 },
  "Tijjani Reijnders": { rating: 82, role: "CM", atk: 62, mid: 83, def: 58 },
  "Justin Bijlow": { rating: 78, role: "GK", atk: 8, mid: 15, def: 80 },
  "Ian Maatsen": { rating: 79, role: "LB", atk: 48, mid: 58, def: 78 },
  "Brian Brobbey": { rating: 79, role: "ST", atk: 81, mid: 42, def: 22 },
  "Joshua Zirkzee": { rating: 79, role: "ST", atk: 80, mid: 55, def: 25 },
  "Wout Weghorst": { rating: 78, role: "ST", atk: 80, mid: 40, def: 25 },
  "Quilindschy Hartman": { rating: 76, role: "LB", atk: 42, mid: 55, def: 76 },
  "Jorrel Hato": { rating: 77, role: "LB", atk: 45, mid: 55, def: 76 },
  "Mark Flekken": { rating: 78, role: "GK", atk: 8, mid: 15, def: 80 },
  "Lutsharel Geertruida": { rating: 78, role: "RB", atk: 40, mid: 55, def: 78 },
  "Noa Lang": { rating: 78, role: "LW", atk: 80, mid: 55, def: 22 },

  // ── BELGIUM ──
  "Kevin De Bruyne": { rating: 88, role: "CAM", atk: 82, mid: 92, def: 48 },
  "Jérémy Doku": { rating: 82, role: "LW", atk: 84, mid: 58, def: 22 },
  "Romelu Lukaku": { rating: 83, role: "ST", atk: 86, mid: 48, def: 22 },
  "Thibaut Courtois": { rating: 87, role: "GK", atk: 8, mid: 15, def: 90 },
  "Amadou Onana": { rating: 82, role: "CDM", atk: 45, mid: 80, def: 78 },
  "Youri Tielemans": { rating: 81, role: "CM", atk: 62, mid: 82, def: 58 },
  "Leandro Trossard": { rating: 81, role: "LW", atk: 82, mid: 62, def: 30 },
  "Timothy Castagne": { rating: 79, role: "RB", atk: 42, mid: 58, def: 80 },
  "Arthur Theate": { rating: 79, role: "CB", atk: 22, mid: 48, def: 80 },
  "Wout Faes": { rating: 79, role: "CB", atk: 22, mid: 42, def: 80 },
  "Koen Casteels": { rating: 80, role: "GK", atk: 8, mid: 15, def: 82 },
  "Loïs Openda": { rating: 83, role: "ST", atk: 85, mid: 48, def: 22 },
  "Charles De Ketelaere": { rating: 80, role: "CAM", atk: 78, mid: 80, def: 28 },
  "Orel Mangala": { rating: 77, role: "CM", atk: 48, mid: 76, def: 60 },
  "Arne Engels": { rating: 77, role: "CM", atk: 55, mid: 76, def: 55 },
  "Zeno Debast": { rating: 77, role: "CB", atk: 22, mid: 48, def: 78 },
  "Thomas Meunier": { rating: 77, role: "RB", atk: 48, mid: 55, def: 78 },
  "Jan Vertonghen": { rating: 76, role: "CB", atk: 22, mid: 45, def: 78 },
  "Matz Sels": { rating: 78, role: "GK", atk: 8, mid: 15, def: 80 },
  "Dodi Lukebakio": { rating: 78, role: "RW", atk: 80, mid: 52, def: 22 },
  "Johan Bakayoko": { rating: 79, role: "RW", atk: 80, mid: 55, def: 22 },
  "Aster Vranckx": { rating: 76, role: "CDM", atk: 42, mid: 76, def: 62 },
  "Hugo Siquet": { rating: 74, role: "RB", atk: 40, mid: 52, def: 74 },
  "Mandela Keita": { rating: 74, role: "CDM", atk: 38, mid: 74, def: 62 },
  "Malick Fofana": { rating: 76, role: "LW", atk: 78, mid: 50, def: 22 },
  "Julien Duranville": { rating: 75, role: "RW", atk: 78, mid: 48, def: 20 },

  // ── CROATIA ──
  "Luka Modrić": { rating: 85, role: "CM", atk: 62, mid: 90, def: 55 },
  "Mateo Kovačić": { rating: 84, role: "CM", atk: 58, mid: 86, def: 62 },
  "Joško Gvardiol": { rating: 85, role: "CB", atk: 28, mid: 55, def: 88 },
  "Dominik Livaković": { rating: 82, role: "GK", atk: 8, mid: 15, def: 84 },
  "Marcelo Brozović": { rating: 82, role: "CDM", atk: 48, mid: 84, def: 68 },
  "Mario Pašalić": { rating: 80, role: "CAM", atk: 72, mid: 80, def: 42 },
  "Andrej Kramarić": { rating: 80, role: "ST", atk: 82, mid: 60, def: 22 },
  "Ivan Perišić": { rating: 79, role: "LW", atk: 78, mid: 65, def: 35 },
  "Borna Sosa": { rating: 79, role: "LB", atk: 52, mid: 62, def: 76 },
  "Josip Stanišić": { rating: 79, role: "RB", atk: 42, mid: 55, def: 80 },
  "Duje Ćaleta-Car": { rating: 78, role: "CB", atk: 22, mid: 42, def: 80 },
  "Igor Matanović": { rating: 76, role: "ST", atk: 78, mid: 45, def: 20 },
  "Lovro Majer": { rating: 80, role: "CAM", atk: 72, mid: 82, def: 32 },
  "Martin Erlić": { rating: 77, role: "CB", atk: 22, mid: 42, def: 78 },
  "Josip Juranović": { rating: 78, role: "RB", atk: 45, mid: 55, def: 78 },
  "Ante Budimir": { rating: 78, role: "ST", atk: 80, mid: 42, def: 20 },
  "Marin Pongračić": { rating: 77, role: "CB", atk: 22, mid: 42, def: 78 },
  "Ivica Ivušić": { rating: 76, role: "GK", atk: 8, mid: 15, def: 78 },
  "Nediljko Labrović": { rating: 75, role: "GK", atk: 8, mid: 15, def: 76 },
  "Luka Sučić": { rating: 79, role: "CM", atk: 62, mid: 80, def: 48 },
  "Borna Barisic": { rating: 76, role: "LB", atk: 48, mid: 55, def: 76 },
  "Petar Sucic": { rating: 76, role: "CM", atk: 55, mid: 76, def: 50 },
  "Marco Pasalic": { rating: 75, role: "CM", atk: 52, mid: 75, def: 48 },
  "Sandro Kulenović": { rating: 74, role: "ST", atk: 76, mid: 40, def: 18 },
  "Marko Pjaca": { rating: 75, role: "LW", atk: 76, mid: 55, def: 22 },
  "Fran Tudor": { rating: 74, role: "CM", atk: 55, mid: 74, def: 45 },

  // ── USA ──
  "Christian Pulisic": { rating: 84, role: "LW", atk: 85, mid: 72, def: 30 },
  "Weston McKennie": { rating: 80, role: "CM", atk: 60, mid: 80, def: 62 },
  "Tyler Adams": { rating: 79, role: "CDM", atk: 35, mid: 78, def: 72 },
  "Gio Reyna": { rating: 80, role: "CAM", atk: 78, mid: 80, def: 30 },
  "Sergiño Dest": { rating: 78, role: "RB", atk: 48, mid: 58, def: 76 },
  "Matt Turner": { rating: 78, role: "GK", atk: 8, mid: 15, def: 80 },
  "Tim Weah": { rating: 79, role: "RW", atk: 80, mid: 55, def: 28 },
  "Folarin Balogun": { rating: 79, role: "ST", atk: 81, mid: 45, def: 22 },
  "Chris Richards": { rating: 77, role: "CB", atk: 22, mid: 48, def: 78 },
  "Miles Robinson": { rating: 76, role: "CB", atk: 20, mid: 42, def: 78 },
  "Antonee Robinson": { rating: 79, role: "LB", atk: 42, mid: 58, def: 78 },
  "Ricardo Pepi": { rating: 77, role: "ST", atk: 79, mid: 42, def: 20 },
  "Brenden Aaronson": { rating: 77, role: "CAM", atk: 72, mid: 78, def: 38 },
  "Malik Tillman": { rating: 77, role: "CAM", atk: 72, mid: 76, def: 32 },
  "Haji Wright": { rating: 75, role: "ST", atk: 77, mid: 38, def: 20 },
  "Tim Ream": { rating: 75, role: "CB", atk: 18, mid: 42, def: 76 },
  "Joe Scally": { rating: 76, role: "RB", atk: 42, mid: 55, def: 76 },
  "Cristian Roldan": { rating: 74, role: "CM", atk: 48, mid: 74, def: 55 },
  "Sebastian Berhalter": { rating: 72, role: "CM", atk: 42, mid: 72, def: 52 },
  "Matt Freese": { rating: 72, role: "GK", atk: 8, mid: 15, def: 72 },
  "Chris Brady": { rating: 68, role: "GK", atk: 8, mid: 15, def: 68 },
  "Auston Trusty": { rating: 74, role: "CB", atk: 20, mid: 40, def: 75 },
  "Mark McKenzie": { rating: 73, role: "CB", atk: 20, mid: 40, def: 74 },
  "Alex Freeman": { rating: 70, role: "LB", atk: 38, mid: 48, def: 70 },
  "Max Arfsten": { rating: 68, role: "LB", atk: 35, mid: 45, def: 68 },
  "Alejandro Zendejas": { rating: 74, role: "RW", atk: 76, mid: 48, def: 22 },

  // ── JAPAN ──
  "Takefusa Kubo": { rating: 82, role: "RW", atk: 83, mid: 72, def: 28 },
  "Kaoru Mitoma": { rating: 82, role: "LW", atk: 83, mid: 62, def: 25 },
  "Wataru Endo": { rating: 81, role: "CDM", atk: 38, mid: 80, def: 78 },
  "Ritsu Doan": { rating: 79, role: "RW", atk: 80, mid: 62, def: 28 },
  "Daichi Kamada": { rating: 80, role: "CAM", atk: 72, mid: 80, def: 42 },
  "Ko Itakura": { rating: 79, role: "CB", atk: 22, mid: 48, def: 80 },
  "Shuichi Gonda": { rating: 78, role: "GK", atk: 8, mid: 15, def: 80 },
  "Takehiro Tomiyasu": { rating: 80, role: "RB", atk: 35, mid: 55, def: 82 },
  "Junya Ito": { rating: 79, role: "RW", atk: 80, mid: 55, def: 25 },
  "Hidemasa Morita": { rating: 78, role: "CM", atk: 48, mid: 78, def: 62 },
  "Ayase Ueda": { rating: 78, role: "ST", atk: 80, mid: 42, def: 20 },
  "Yuta Nakayama": { rating: 76, role: "LB", atk: 38, mid: 52, def: 78 },
  "Maya Yoshida": { rating: 76, role: "CB", atk: 22, mid: 40, def: 78 },

  // ── MEXICO ──
  "Edson Álvarez": { rating: 82, role: "CDM", atk: 42, mid: 80, def: 82 },
  "Santiago Gimenez": { rating: 81, role: "ST", atk: 83, mid: 48, def: 22 },
  "Raúl Jiménez": { rating: 79, role: "ST", atk: 81, mid: 55, def: 22 },
  "Guillermo Ochoa": { rating: 78, role: "GK", atk: 8, mid: 15, def: 80 },
  "César Montes": { rating: 78, role: "CB", atk: 22, mid: 42, def: 80 },
  "Johan Vásquez": { rating: 78, role: "CB", atk: 22, mid: 45, def: 79 },
  "Luis Chávez": { rating: 77, role: "CM", atk: 55, mid: 78, def: 58 },
  "Orbelín Pineda": { rating: 77, role: "CAM", atk: 72, mid: 78, def: 30 },
  "Alexis Vega": { rating: 78, role: "LW", atk: 80, mid: 58, def: 22 },
  "Álvaro Fidalgo": { rating: 78, role: "CM", atk: 58, mid: 78, def: 48 },
  "Jorge Sánchez": { rating: 76, role: "RB", atk: 40, mid: 52, def: 76 },
  "Jesús Gallardo": { rating: 76, role: "LB", atk: 42, mid: 55, def: 76 },
  "Roberto Alvarado": { rating: 77, role: "RW", atk: 78, mid: 58, def: 25 },
  "Julián Quiñones": { rating: 77, role: "LW", atk: 79, mid: 52, def: 22 },

  // ── URUGUAY ──
  "Federico Valverde": { rating: 87, role: "CM", atk: 75, mid: 88, def: 72 },
  "Darwin Núñez": { rating: 84, role: "ST", atk: 87, mid: 48, def: 22 },
  "Ronald Araújo": { rating: 85, role: "CB", atk: 22, mid: 48, def: 90 },
  "Nicolás de la Cruz": { rating: 81, role: "CM", atk: 62, mid: 82, def: 52 },
  "José María Giménez": { rating: 82, role: "CB", atk: 22, mid: 42, def: 85 },
  "Mathías Olivera": { rating: 80, role: "LB", atk: 42, mid: 55, def: 80 },
  "Nahitan Nández": { rating: 78, role: "RB", atk: 42, mid: 62, def: 78 },
  "Sergio Rochet": { rating: 79, role: "GK", atk: 8, mid: 15, def: 80 },
  "Facundo Pellistri": { rating: 79, role: "RW", atk: 80, mid: 55, def: 25 },
  "Maxi Araújo": { rating: 78, role: "LW", atk: 78, mid: 58, def: 28 },
  "Manuel Ugarte": { rating: 82, role: "CDM", atk: 38, mid: 80, def: 82 },

  // ── COLOMBIA ──
  "Luis Díaz": { rating: 85, role: "LW", atk: 87, mid: 62, def: 25 },
  "Jhon Arias": { rating: 80, role: "RW", atk: 82, mid: 58, def: 25 },
  "Jefferson Lerma": { rating: 79, role: "CDM", atk: 38, mid: 78, def: 78 },
  "Davinson Sánchez": { rating: 79, role: "CB", atk: 22, mid: 42, def: 80 },
  "James Rodríguez": { rating: 79, role: "CAM", atk: 72, mid: 82, def: 28 },
  "Richard Ríos": { rating: 79, role: "CM", atk: 55, mid: 80, def: 55 },
  "Jhon Córdoba": { rating: 78, role: "ST", atk: 80, mid: 42, def: 22 },
  "Rafael Santos Borré": { rating: 78, role: "ST", atk: 80, mid: 48, def: 22 },
  "Camilo Vargas": { rating: 79, role: "GK", atk: 8, mid: 15, def: 80 },
  "Yerry Mina": { rating: 79, role: "CB", atk: 25, mid: 42, def: 80 },
  "Daniel Muñoz": { rating: 79, role: "RB", atk: 48, mid: 58, def: 78 },
  "Johan Mojica": { rating: 77, role: "LB", atk: 42, mid: 52, def: 76 },

  // ── SWITZERLAND ──
  "Granit Xhaka": { rating: 84, role: "CM", atk: 55, mid: 86, def: 72 },
  "Manuel Akanji": { rating: 84, role: "CB", atk: 25, mid: 55, def: 86 },
  "Yann Sommer": { rating: 83, role: "GK", atk: 8, mid: 15, def: 85 },
  "Dan Ndoye": { rating: 79, role: "RW", atk: 80, mid: 55, def: 28 },
  "Breel Embolo": { rating: 78, role: "ST", atk: 80, mid: 48, def: 22 },
  "Xherdan Shaqiri": { rating: 77, role: "CAM", atk: 78, mid: 76, def: 25 },
  "Ricardo Rodríguez": { rating: 77, role: "LB", atk: 42, mid: 55, def: 78 },
  "Nico Elvedi": { rating: 80, role: "CB", atk: 22, mid: 48, def: 82 },
  "Remo Freuler": { rating: 79, role: "CM", atk: 48, mid: 78, def: 62 },
  "Denis Zakaria": { rating: 79, role: "CDM", atk: 42, mid: 78, def: 72 },
  "Fabian Rieder": { rating: 77, role: "CM", atk: 62, mid: 76, def: 42 },
  "Silvan Widmer": { rating: 77, role: "RB", atk: 42, mid: 55, def: 78 },

  // ── MOROCCO ──
  "Achraf Hakimi": { rating: 85, role: "RB", atk: 62, mid: 72, def: 82 },
  "Hakim Ziyech": { rating: 82, role: "RW", atk: 85, mid: 78, def: 28 },
  "Sofyan Amrabat": { rating: 80, role: "CDM", atk: 38, mid: 78, def: 82 },
  "Yassine Bounou": { rating: 82, role: "GK", atk: 8, mid: 15, def: 84 },
  "Nayef Aguerd": { rating: 80, role: "CB", atk: 22, mid: 48, def: 82 },
  "Azzedine Ounahi": { rating: 79, role: "CM", atk: 60, mid: 80, def: 48 },
  "Noussair Mazraoui": { rating: 81, role: "LB", atk: 48, mid: 62, def: 80 },
  "Ibrahim Díaz": { rating: 80, role: "LW", atk: 82, mid: 62, def: 22 },
  "Youssef En-Nesyri": { rating: 79, role: "ST", atk: 81, mid: 42, def: 22 },

  // ── SOUTH KOREA ──
  "Son Heung-min": { rating: 86, role: "LW", atk: 88, mid: 65, def: 22 },
  "Kim Min-jae": { rating: 85, role: "CB", atk: 22, mid: 48, def: 88 },
  "Lee Kang-in": { rating: 82, role: "CAM", atk: 78, mid: 82, def: 28 },
  "Hwang Hee-chan": { rating: 79, role: "ST", atk: 80, mid: 52, def: 22 },

  // ── TURKEY ──
  "Hakan Çalhanoğlu": { rating: 85, role: "CM", atk: 68, mid: 88, def: 68 },
  "Arda Güler": { rating: 82, role: "CAM", atk: 80, mid: 82, def: 25 },
  "Kenan Yıldız": { rating: 80, role: "LW", atk: 80, mid: 68, def: 22 },
  "Ferdi Kadıoğlu": { rating: 81, role: "LB", atk: 48, mid: 65, def: 80 },

  // ── AUSTRALIA ──
  "Mathew Ryan": { rating: 78, role: "GK", atk: 8, mid: 15, def: 80 },

  // ── ECUADOR ──
  "Moisés Caicedo": { rating: 84, role: "CDM", atk: 45, mid: 82, def: 82 },
  "Piero Hincapié": { rating: 80, role: "CB", atk: 22, mid: 50, def: 82 },

  // ── SENEGAL ──
  "Édouard Mendy": { rating: 80, role: "GK", atk: 8, mid: 15, def: 82 },
  "Kalidou Koulibaly": { rating: 80, role: "CB", atk: 22, mid: 42, def: 84 },
  "Ismaïla Sarr": { rating: 79, role: "RW", atk: 80, mid: 52, def: 22 },
  "Idrissa Gueye": { rating: 78, role: "CDM", atk: 35, mid: 78, def: 78 },

  // ── NORWAY ──
  "Erling Haaland": { rating: 91, role: "ST", atk: 96, mid: 42, def: 18 },
  "Martin Ødegaard": { rating: 89, role: "CAM", atk: 78, mid: 92, def: 42 },
  "Alexander Sørloth": { rating: 80, role: "ST", atk: 82, mid: 42, def: 20 },

  // ── ALGERIA ──
  "Riyad Mahrez": { rating: 80, role: "RW", atk: 82, mid: 72, def: 22 },

  // ── EGYPT ──
  "Mohamed Salah": { rating: 89, role: "RW", atk: 92, mid: 65, def: 28 },
  "Omar Marmoush": { rating: 83, role: "ST", atk: 85, mid: 62, def: 25 },

  // ── IRAN ──
  "Mehdi Taremi": { rating: 82, role: "ST", atk: 84, mid: 55, def: 28 },

  // ── SWEDEN ──
  "Alexander Isak": { rating: 85, role: "ST", atk: 88, mid: 55, def: 22 },
  "Viktor Gyökeres": { rating: 85, role: "ST", atk: 88, mid: 52, def: 28 },
  "Dejan Kulusevski": { rating: 82, role: "RW", atk: 82, mid: 72, def: 35 },

  // ── CANADA ──
  "Alphonso Davies": { rating: 84, role: "LB", atk: 55, mid: 62, def: 82 },
  "Jonathan David": { rating: 83, role: "ST", atk: 85, mid: 52, def: 22 },

  // ── TUNISIA ──
  "Aïssa Laïdouni": { rating: 77, role: "CM", atk: 48, mid: 78, def: 62 },

  // ── SCOTLAND ──
  "Andy Robertson": { rating: 82, role: "LB", atk: 52, mid: 62, def: 82 },
  "John McGinn": { rating: 80, role: "CM", atk: 65, mid: 80, def: 55 },
  "Scott McTominay": { rating: 80, role: "CM", atk: 65, mid: 78, def: 65 },

  // ── QATAR ──
  "Akram Afif": { rating: 80, role: "LW", atk: 82, mid: 60, def: 22 },

  // ── IRAQ ──
  "Mohanad Ali": { rating: 72, role: "ST", atk: 74, mid: 38, def: 18 },

  // ── AUSTRIA ──
  "David Alaba": { rating: 82, role: "CB", atk: 35, mid: 62, def: 85 },
  "Konrad Laimer": { rating: 80, role: "CDM", atk: 48, mid: 78, def: 78 },
  "Marcel Sabitzer": { rating: 81, role: "CM", atk: 65, mid: 82, def: 58 },
  "Christoph Baumgartner": { rating: 79, role: "CAM", atk: 78, mid: 78, def: 35 },
  "Michael Gregoritsch": { rating: 78, role: "ST", atk: 80, mid: 48, def: 22 },
  "Patrick Pentz": { rating: 77, role: "GK", atk: 8, mid: 15, def: 78 },

  // ── CÔTE D'IVOIRE ──
  "Sébastien Haller": { rating: 78, role: "ST", atk: 80, mid: 42, def: 22 },
  "Franck Kessié": { rating: 79, role: "CM", atk: 55, mid: 78, def: 68 },
  "Nicolas Pépé": { rating: 77, role: "RW", atk: 80, mid: 52, def: 22 },
  "Simon Adingra": { rating: 79, role: "RW", atk: 80, mid: 55, def: 22 },

  // ── GHANA ──
  "Mohammed Kudus": { rating: 82, role: "CAM", atk: 82, mid: 78, def: 35 },
  "Thomas Partey": { rating: 81, role: "CDM", atk: 42, mid: 80, def: 78 },
  "Iñaki Williams": { rating: 79, role: "ST", atk: 82, mid: 48, def: 22 },

  // ── PANAMA ──
  "José Fajardo": { rating: 72, role: "ST", atk: 74, mid: 38, def: 18 },

  // ── DR CONGO ──
  "Chancel Mbemba": { rating: 78, role: "CB", atk: 22, mid: 42, def: 80 },
  "Arthur Masuaku": { rating: 74, role: "LB", atk: 42, mid: 48, def: 74 },

  // ── JORDAN ──

  // ── NEW ZEALAND ──
  "Chris Wood": { rating: 79, role: "ST", atk: 81, mid: 42, def: 22 },

  // ── CAPE VERDE ──

  // ── SAUDI ARABIA ──
  "Salem Al-Dawsari": { rating: 78, role: "LW", atk: 80, mid: 62, def: 22 },

  // ── HAITI ──

  // ── CURAÇAO ──

  // ── BOSNIA AND HERZEGOVINA ──
  "Edin Džeko": { rating: 79, role: "ST", atk: 82, mid: 52, def: 22 },

  // ── PARAGUAY ──
  "Miguel Almirón": { rating: 79, role: "RW", atk: 80, mid: 62, def: 25 },

  // ── UZBEKISTAN ──
};

// ─── Country code mapping for flags ──────────────────────────
const countryToCode = {
  "Czechia": "cz", "Mexico": "mx", "South Africa": "za", "South Korea": "kr",
  "Bosnia and Herzegovina": "ba", "Canada": "ca", "Qatar": "qa", "Switzerland": "ch",
  "Brazil": "br", "Haiti": "ht", "Morocco": "ma", "Scotland": "gb-sct",
  "Australia": "au", "Paraguay": "py", "Turkey": "tr", "USA": "us",
  "Curaçao": "cw", "Ecuador": "ec", "Germany": "de", "Côte d'Ivoire": "ci",
  "Japan": "jp", "Netherlands": "nl", "Sweden": "se", "Tunisia": "tn",
  "Belgium": "be", "Egypt": "eg", "Iran": "ir", "New Zealand": "nz",
  "Cape Verde": "cv", "Saudi Arabia": "sa", "Spain": "es", "Uruguay": "uy",
  "France": "fr", "Iraq": "iq", "Norway": "no", "Senegal": "sn",
  "Algeria": "dz", "Argentina": "ar", "Austria": "at", "Jordan": "jo",
  "Colombia": "co", "DR Congo": "cd", "Portugal": "pt", "Uzbekistan": "uz",
  "Croatia": "hr", "England": "gb-eng", "Ghana": "gh", "Panama": "pa",
  "Italy": "it", "West Germany": "de",
};

// ─── Team strength tiers (affects estimated ratings for unknown players) ──
const teamTier = {
  "Argentina": 1, "France": 1, "England": 1, "Brazil": 1, "Germany": 1, "Spain": 1, "Portugal": 1,
  "Netherlands": 2, "Belgium": 2, "Croatia": 2, "Uruguay": 2, "Colombia": 2, "USA": 2, "Japan": 2,
  "Morocco": 2, "Switzerland": 2, "South Korea": 2, "Mexico": 2, "Turkey": 2, "Norway": 2,
  "Sweden": 2, "Senegal": 2, "Ecuador": 2, "Austria": 2, "Egypt": 2, "Scotland": 2,
  "Canada": 3, "Iran": 3, "Algeria": 3, "Ghana": 3, "Côte d'Ivoire": 3, "Tunisia": 3,
  "Australia": 3, "Paraguay": 3, "Qatar": 3, "Iraq": 3, "Saudi Arabia": 3,
  "Bosnia and Herzegovina": 3, "Panama": 3, "DR Congo": 3, "Uzbekistan": 3, "Czechia": 3,
  "South Africa": 4, "New Zealand": 4, "Haiti": 4, "Curaçao": 4, "Cape Verde": 4, "Jordan": 4,
};

// Rating ranges by tier and squad role
const ratingRanges = {
  1: { star: [82, 86], regular: [76, 81], backup: [72, 77] },
  2: { star: [78, 82], regular: [73, 78], backup: [68, 74] },
  3: { star: [74, 78], regular: [68, 74], backup: [64, 70] },
  4: { star: [70, 75], regular: [65, 70], backup: [60, 66] },
};

// Position-specific stat templates (relative to rating)
const statTemplates = {
  GK:  { atk: [6, 12], mid: [12, 20], def: [0.90, 1.02] },
  CB:  { atk: [18, 28], mid: [38, 55], def: [0.92, 1.05] },
  LB:  { atk: [35, 52], mid: [48, 62], def: [0.88, 1.00] },
  RB:  { atk: [35, 52], mid: [48, 62], def: [0.88, 1.00] },
  CDM: { atk: [32, 48], mid: [0.88, 1.02], def: [0.82, 0.95] },
  CM:  { atk: [42, 65], mid: [0.90, 1.05], def: [48, 65] },
  CAM: { atk: [0.82, 0.98], mid: [0.88, 1.05], def: [25, 40] },
  LW:  { atk: [0.90, 1.05], mid: [48, 65], def: [18, 30] },
  RW:  { atk: [0.90, 1.05], mid: [48, 65], def: [18, 30] },
  ST:  { atk: [0.90, 1.08], mid: [35, 55], def: [15, 25] },
};

function genStat(range, rating) {
  const [lo, hi] = range;
  if (lo >= 1 && hi <= 100 && lo > 12) {
    // Absolute range
    return Math.round(lo + Math.random() * (hi - lo));
  }
  if (lo < 1) {
    // Multiplier of rating
    return Math.round(rating * (lo + Math.random() * (hi - lo)));
  }
  // Small absolute (GK atk/mid)
  return Math.round(lo + Math.random() * (hi - lo));
}

function estimateRole(guardianPos) {
  const posMap = {
    Goalkeepers: ["GK"],
    Defenders: ["CB", "CB", "CB", "LB", "RB", "CB", "RB", "LB"],
    Midfielders: ["CM", "CM", "CDM", "CAM", "CM", "CM", "CDM"],
    Forwards: ["ST", "RW", "LW", "ST", "RW", "ST", "LW"],
  };
  const options = posMap[guardianPos] || ["CM"];
  return options[Math.floor(Math.random() * options.length)];
}

function estimateRating(tier, squadIndex, totalInPos) {
  const ranges = ratingRanges[tier] || ratingRanges[4];
  const fraction = squadIndex / totalInPos;
  let range;
  if (fraction < 0.33) range = ranges.star;
  else if (fraction < 0.67) range = ranges.regular;
  else range = ranges.backup;

  return Math.round(range[0] + Math.random() * (range[1] - range[0]));
}

// ─── Trivia templates ────────────────────────────────────────
const triviaTemplates = {
  GK: [
    "A reliable shot-stopper who brings stability and confidence to the backline.",
    "Commands the penalty area with authority and has developed strong distribution skills.",
    "A safe pair of hands who has earned the trust of coaches at both club and international level.",
  ],
  CB: [
    "A physically imposing defender whose aerial presence and tactical discipline anchor the backline.",
    "A composed ball-playing center-back who reads the game exceptionally well.",
    "A tough-tackling defender who rarely gives attackers space to breathe.",
  ],
  LB: [
    "An athletic left-back who offers both defensive solidity and overlapping runs on the flank.",
    "A modern fullback whose pace and crossing ability provide width in attack.",
    "Tireless up and down the left flank, combining defensive work rate with attacking output.",
  ],
  RB: [
    "A dependable right-back who balances defensive duties with surging forward runs.",
    "An energetic fullback whose pace and work rate make the right flank a dangerous outlet.",
    "A versatile defender who can cover multiple positions across the backline.",
  ],
  CDM: [
    "A midfield destroyer whose tackling and positional awareness protect the back four.",
    "The midfield anchor who breaks up play and keeps things ticking over with simple passes.",
    "A disciplined holding midfielder who allows more creative teammates to flourish ahead.",
  ],
  CM: [
    "A box-to-box engine who covers every blade of grass and contributes at both ends.",
    "A technically gifted midfielder who controls tempo and circulates the ball with precision.",
    "A hard-working central midfielder who brings energy and drive to the engine room.",
  ],
  CAM: [
    "A creative playmaker whose vision and passing range unlock defenses from the number 10 role.",
    "A silky technician who thrives between the lines and creates chances with imaginative passing.",
    "An attacking midfielder whose dribbling and final ball make him a constant threat.",
  ],
  LW: [
    "A direct winger whose pace and trickery on the left flank terrorize fullbacks.",
    "An exciting attacker who loves cutting inside from the left to create and score goals.",
    "A skillful wide player whose ability to beat defenders one-on-one makes him a game-changer.",
  ],
  RW: [
    "A pacy right winger who stretches defenses with direct running and quality delivery.",
    "A tricky wide player whose flair and end product from the right make him a key attacking outlet.",
    "An electric winger whose speed and skill on the ball can unlock any defense.",
  ],
  ST: [
    "A clinical striker whose movement and finishing make him a constant goal threat.",
    "A powerful center-forward who holds the ball up well and brings teammates into play.",
    "A natural goalscorer whose instincts in the box and composure in front of goal are his greatest assets.",
  ],
};

function getTrivia(name, country, role) {
  const templates = triviaTemplates[role] || triviaTemplates.CM;
  return templates[Math.floor(Math.random() * templates.length)];
}

// ─── Generate all players ────────────────────────────────────
const allPlayers = [];
const positionCounts = {};

for (const player of data.results) {
  const { team, position: guardianPos, name, number } = player;
  if (!name) continue;

  const tier = teamTier[team] || 4;

  // Check if we have known data
  const known = knownPlayers[name];

  let role, rating, atk, mid, def;

  if (known) {
    role = known.role;
    rating = known.rating;
    atk = known.atk;
    mid = known.mid;
    def = known.def;
  } else {
    role = estimateRole(guardianPos);

    // Track position counts per team for squad hierarchy
    const key = `${team}_${guardianPos}`;
    positionCounts[key] = (positionCounts[key] || 0);
    const posIdx = positionCounts[key]++;
    const totalEstimate = guardianPos === "Goalkeepers" ? 3 : guardianPos === "Defenders" ? 8 : guardianPos === "Midfielders" ? 7 : 8;

    rating = estimateRating(tier, posIdx, totalEstimate);

    // Generate stats from templates
    const template = statTemplates[role];
    atk = genStat(template.atk, rating);
    mid = genStat(template.mid, rating);
    def = genStat(template.def, rating);
  }

  const id = name.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "") + "_2026wc";

  const trivia = getTrivia(name, team, role);

  allPlayers.push({
    id, name, country: team, role, rating, atk, mid, def, trivia, number
  });
}

// ─── Output as JS code ──────────────────────────────────────
console.log("// Auto-generated World Cup 2026 players from Guardian data + EA FC 26 ratings");
console.log("// Generated on " + new Date().toISOString());
console.log(`// Total: ${allPlayers.length} players from ${[...new Set(allPlayers.map(p => p.country))].length} nations\n`);

// Group by country
const byCountry = {};
for (const p of allPlayers) {
  if (!byCountry[p.country]) byCountry[p.country] = [];
  byCountry[p.country].push(p);
}

// Output country flag codes
console.log("// Country flag codes for all 48 nations");
console.log("export const wc2026CountryFlags = " + JSON.stringify(countryToCode, null, 2) + ";\n");

// Output as array of p() calls grouped by country
for (const [country, players] of Object.entries(byCountry)) {
  const varName = country.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_") + "_wc";

  console.log(`// ── ${country.toUpperCase()} ──`);
  console.log(`const ${varName} = [`);
  for (const p of players) {
    console.log(`  p("${p.id}", "${p.name}", "${p.country}", 2026, "${p.role}", ${p.rating}, ${p.atk}, ${p.mid}, ${p.def},`);
    console.log(`    "${p.trivia.replace(/"/g, '\\"')}"),`);
  }
  console.log(`];\n`);
}

// Output combined array name
console.log("export const wc2026Players = [");
for (const country of Object.keys(byCountry)) {
  const varName = country.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_") + "_wc";
  console.log(`  ...${varName},`);
}
console.log("];");

// Stats summary
console.error(`\n✅ Generated ${allPlayers.length} players across ${Object.keys(byCountry).length} nations`);
console.error(`   Known players with EA FC ratings: ${allPlayers.filter(p => knownPlayers[p.name]).length}`);
console.error(`   Estimated players: ${allPlayers.filter(p => !knownPlayers[p.name]).length}`);
