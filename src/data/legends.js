const roleToPosition = {
  ST: "FW", LW: "FW", RW: "FW",
  CAM: "MID", CM: "MID", CDM: "MID",
  LB: "DEF", CB: "DEF", RB: "DEF",
  GK: "GK",
};

const defaultRole = { FW: "ST", MID: "CM", DEF: "CB", GK: "GK" };

const playerRoles = {
  // Brazil 1970
  "jairzinho_1970": "RW", "carlos_alberto_1970": "RB", "rivelino_1970": "LW",
  "clodoaldo_1970": "CDM", "everaldo_1970": "LB",
  // West Germany 1974
  "berti_vogts_1974": "RB", "paul_breitner_1974": "LB", "hoeness_1974": "CAM",
  "grabowski_1974": "RW", "holzenbein_1974": "LW",
  // Netherlands 1974
  "rensenbrink_1974": "LW", "rep_1974": "RW", "krol_1974": "LB",
  "jansen_1974": "CDM", "suurbier_1974": "RB",
  // Argentina 1986
  "maradona_1986": "CAM", "cuciuffo_1986": "RB", "olarticoechea_1986": "LB",
  "batista_1986": "CDM",
  // West Germany 1990
  "brehme_1990": "LB", "berthold_1990": "RB", "buchwald_1990": "CDM",
  "hassler_1990": "CAM", "littbarski_1990": "RW",
  // Brazil 1994
  "jorginho_1994": "RB", "branco_1994": "LB", "dunga_1994": "CDM",
  "mauro_silva_1994": "CDM", "zinho_1994": "CAM",
  // France 1998
  "thuram_1998": "RB", "lizarazu_1998": "LB", "deschamps_1998": "CDM",
  "zidane_1998": "CAM",
  // Brazil 2002
  "roberto_carlos_2002": "LB", "cafu_2002": "RB", "ronaldinho_2002": "CAM",
  "rivaldo_2002": "LW", "edmilson_2002": "CDM", "gilberto_silva_2002": "CDM",
  // Italy 2006
  "pirlo_2006": "CDM", "zambrotta_2006": "RB", "grosso_2006": "LB",
  "gattuso_2006": "CDM", "camoranesi_2006": "RW", "totti_2006": "CAM", "del_piero_2006": "LW",
  // Spain 2010
  "busquets_2010": "CDM", "xabi_alonso_2010": "CDM", "capdevila_2010": "LB", "pedro_2010": "RW",
  // Germany 2014
  "lahm_2014": "RB", "howedes_2014": "LB", "khedira_2014": "CDM",
  "ozil_2014": "CAM", "thomas_muller_2014": "RW",
  // France 2018
  "mbappe_2018": "LW", "griezmann_2018": "CAM", "kante_2018": "CDM",
  "pavard_2018": "RB", "hernandez_2018": "LB",
  // Croatia 2018
  "vrsaljko_2018": "RB", "strinic_2018": "LB", "brozovic_2018": "CDM",
  "rebic_2018": "RW", "perisic_2018": "LW",
  // Argentina 2022
  "messi_2022": "RW", "di_maria_2022": "LW", "molina_2022": "RB", "tagliafico_2022": "LB",
  // Morocco 2022
  "hakimi_2022": "RB", "amrabat_2022": "CDM", "mazraoui_2022": "LB",
  "ziyech_2022": "RW", "boufal_2022": "LW",
  // England 1966
  "george_cohen_1966": "RB", "ray_wilson_1966": "LB", "nobby_stiles_1966": "CDM",
  "martin_peters_1966": "CAM",
};

function p(id, name, country, year, pos, rating, atk, mid, def, trivia, opts = {}) {
  // Derive position from role if pos is a specific role (ST, LW, etc.)
  const position = roleToPosition[pos] || pos;
  // Assign role: if pos was already a specific role use it, otherwise check lookup, otherwise use default
  const role = roleToPosition[pos] ? pos : (playerRoles[id] || defaultRole[pos] || pos);

  const defaultRecords = {
    FW: { metric: "goals", value: 4, headline: `${name} would be proud — your attack was clinical!` },
    MID: { metric: "goals", value: 3, headline: `${name}'s spirit lived on in your midfield!` },
    DEF: { metric: "clean_sheets", value: 2, headline: `${name} kept it tight at the back!` },
    GK: { metric: "clean_sheets", value: 3, headline: `${name} was a wall between the posts!` },
  };
  return {
    id, name, country, year, position, role, rating,
    stats: { attack: atk, midfield: mid, defense: def },
    trivia,
    isMarqueeLegend: opts.legend || false,
    superpower: opts.superpower || null,
    recordThreshold: opts.record || defaultRecords[position],
  };
}

// ============================================================
// 1. BRAZIL 1970 — The Greatest Team Ever Assembled
// ============================================================
const brazil1970 = [
  p("pele_1970", "Pelé", "Brazil", 1970, "FW", 99, 97, 75, 30,
    "Scored in every round of the 1970 World Cup as Brazil became the first nation to win three titles, cementing his status as the King of Football.",
    { legend: true, superpower: { name: "The King's Touch", description: "+3 ATK to all Forwards in your squad" },
      record: { metric: "goals", value: 6, headline: "The King's Blessing — Your forwards matched Pelé's mythical tournament output!" } }),
  p("jairzinho_1970", "Jairzinho", "Brazil", 1970, "FW", 93, 94, 62, 25,
    "The only player to score in every match of a World Cup tournament (1970) — six games, six goals, pure devastation on the right wing.",
    { legend: true, superpower: { name: "Every Game a Goal", description: "+2 ATK rating" },
      record: { metric: "goals", value: 7, headline: "Jairzinho's Legacy — A goal in every round, just like the Furacão!" } }),
  p("carlos_alberto_1970", "Carlos Alberto", "Brazil", 1970, "DEF", 94, 65, 68, 91,
    "Scored the greatest team goal in World Cup history — the final goal of the 1970 Final — a sweeping move involving nine of Brazil's ten outfield players.",
    { legend: true, superpower: { name: "The Captain's Goal", description: "+2 ATK for all Defenders" } }),
  p("tostao_1970", "Tostão", "Brazil", 1970, "FW", 91, 90, 72, 22,
    "Nearly missed the 1970 World Cup after a detached retina but recovered to form a deadly partnership with Pelé in Mexico."),
  p("gerson_1970", "Gérson", "Brazil", 1970, "MID", 91, 70, 93, 40,
    "The midfield general of Brazil 1970 whose left foot was considered the most accurate in the world — scored a thunderbolt in the Final."),
  p("rivelino_1970", "Rivelino", "Brazil", 1970, "MID", 92, 82, 90, 35,
    "Known for his devastating left foot and the 'Elástico' dribble, Rivelino was the creative heartbeat of the greatest team ever assembled."),
  p("clodoaldo_1970", "Clodoaldo", "Brazil", 1970, "MID", 88, 45, 88, 65,
    "The youngest member of Brazil's 1970 squad, Clodoaldo's audacious dribble past four Italian defenders started the move for the famous fourth goal in the Final."),
  p("piazza_1970", "Wilson Piazza", "Brazil", 1970, "DEF", 87, 30, 62, 88,
    "A composed center-back who anchored Brazil's defense, allowing the flair players ahead of him the freedom to express themselves."),
  p("brito_1970", "Brito", "Brazil", 1970, "DEF", 86, 25, 55, 87,
    "A tough-tackling defender who provided the steel behind Brazil's beautiful 1970 attack, winning all six matches on the way to the title."),
  p("everaldo_1970", "Everaldo", "Brazil", 1970, "DEF", 85, 35, 55, 86,
    "The left-back of the greatest team ever, Everaldo provided defensive solidity and allowed Rivelino freedom to attack."),
  p("felix_1970", "Félix", "Brazil", 1970, "GK", 85, 8, 15, 85,
    "Often considered the weak link of the 1970 squad, Félix nonetheless won every game — proof that even an 'average' keeper on a legendary team is a World Cup winner."),
];

// ============================================================
// 2. WEST GERMANY 1974 — Beckenbauer's Home Triumph
// ============================================================
const westGermany1974 = [
  p("beckenbauer_1974", "Franz Beckenbauer", "West Germany", 1974, "DEF", 97, 55, 78, 97,
    "Invented the modern 'libero' sweeper role and captained West Germany to the 1974 World Cup on home soil, later winning it as manager in 1990.",
    { legend: true, superpower: { name: "Der Kaiser", description: "+3 DEF to all Defenders in your squad" },
      record: { metric: "clean_sheets", value: 4, headline: "Der Kaiser's Wall — Your defense was as impenetrable as Beckenbauer's!" } }),
  p("gerd_muller_1974", "Gerd Müller", "West Germany", 1974, "FW", 96, 98, 45, 20,
    "Scored 14 World Cup goals in just 13 matches, including the winning goal in the 1974 Final — a record-per-game ratio that may never be beaten.",
    { legend: true, superpower: { name: "Der Bomber", description: "+4 ATK rating" },
      record: { metric: "goals", value: 8, headline: "Der Bomber Reborn — Your striker was as clinical as Gerd Müller!" } }),
  p("sepp_maier_1974", "Sepp Maier", "West Germany", 1974, "GK", 92, 8, 18, 94,
    "Known as 'Die Katze von Anzing' (The Cat from Anzing) for his incredible reflexes, Maier was Germany's No. 1 for over a decade."),
  p("berti_vogts_1974", "Berti Vogts", "West Germany", 1974, "DEF", 89, 30, 60, 90,
    "Man-marked Johan Cruyff out of the 1974 Final — one of the great individual defensive performances in World Cup history."),
  p("paul_breitner_1974", "Paul Breitner", "West Germany", 1974, "DEF", 91, 62, 70, 88,
    "Scored a penalty in the 1974 Final and another goal in the 1982 Final — one of only four players to score in two different World Cup Finals."),
  p("schwarzenbeck_1974", "Hans-Georg Schwarzenbeck", "West Germany", 1974, "DEF", 86, 20, 50, 89,
    "The no-nonsense stopper who partnered Beckenbauer, doing the dirty work so the Kaiser could create."),
  p("bonhof_1974", "Rainer Bonhof", "West Germany", 1974, "MID", 88, 60, 88, 55,
    "A dynamic box-to-box midfielder whose powerful right foot and tireless running drove West Germany's engine room in 1974."),
  p("overath_1974", "Wolfgang Overath", "West Germany", 1974, "MID", 90, 68, 91, 48,
    "Played in three consecutive World Cup Finals (1966, 1970, 1974), winning the last one — a remarkable feat of longevity at the highest level."),
  p("hoeness_1974", "Uli Hoeneß", "West Germany", 1974, "MID", 87, 72, 85, 40,
    "A gifted attacker who later became the most powerful executive in German football as Bayern Munich president for decades."),
  p("grabowski_1974", "Jürgen Grabowski", "West Germany", 1974, "FW", 87, 85, 68, 28,
    "A tricky right winger whose pace and crossing ability terrorized defenses throughout the 1974 tournament."),
  p("holzenbein_1974", "Bernd Hölzenbein", "West Germany", 1974, "FW", 86, 83, 60, 25,
    "Won the controversial penalty that led to Breitner's equalizer in the 1974 Final — a pivotal moment in World Cup history."),
];

// ============================================================
// 3. NETHERLANDS 1974 — Total Football Revolution
// ============================================================
const netherlands1974 = [
  p("cruyff_1974", "Johan Cruyff", "Netherlands", 1974, "FW", 97, 95, 90, 32,
    "Pioneered 'Total Football' at the 1974 World Cup where every player could play every position — the Dutch didn't win, but changed football forever.",
    { legend: true, superpower: { name: "Total Football", description: "+2 to all squad stats" },
      record: { metric: "goals", value: 5, headline: "Total Football Reborn — Your team played with Cruyff's revolutionary vision!" } }),
  p("neeskens_1974", "Johan Neeskens", "Netherlands", 1974, "MID", 93, 78, 94, 55,
    "Scored a penalty in the first minute of the 1974 Final before West Germany had even touched the ball — the most audacious start to a World Cup Final ever.",
    { legend: true, superpower: { name: "First-Minute Strike", description: "+10% win chance in knockout rounds" } }),
  p("rep_1974", "Johnny Rep", "Netherlands", 1974, "FW", 88, 87, 58, 22,
    "A lightning-fast winger who scored crucial goals throughout the 1974 tournament and was part of Cruyff's devastating Dutch attack."),
  p("rensenbrink_1974", "Rob Rensenbrink", "Netherlands", 1974, "FW", 90, 89, 65, 20,
    "Hit the post in the last minute of the 1978 Final — inches away from making the Netherlands world champions. Scored 5 goals across two World Cups."),
  p("krol_1974", "Ruud Krol", "Netherlands", 1974, "DEF", 90, 48, 72, 91,
    "The embodiment of Total Football from the back — a center-back who could play anywhere, Krol appeared in two World Cup Finals."),
  p("haan_1974", "Arie Haan", "Netherlands", 1974, "MID", 87, 72, 86, 60,
    "Famous for his long-range thunderbolts, Haan scored one of the greatest World Cup goals ever — a 40-yard screamer against Italy in 1978."),
  p("jansen_1974", "Wim Jansen", "Netherlands", 1974, "MID", 86, 50, 85, 65,
    "A tireless midfielder who provided the defensive balance that allowed Cruyff and Neeskens to express themselves freely."),
  p("van_hanegem_1974", "Wim van Hanegem", "Netherlands", 1974, "MID", 89, 65, 90, 50,
    "Known as 'De Kromme' (The Crooked One), van Hanegem was an elegant playmaker with a devastating left foot."),
  p("suurbier_1974", "Wim Suurbier", "Netherlands", 1974, "DEF", 86, 45, 62, 86,
    "An attacking right-back perfectly suited to Total Football, Suurbier constantly overlapped to create numerical advantages."),
  p("rijsbergen_1974", "Wim Rijsbergen", "Netherlands", 1974, "DEF", 85, 22, 50, 86,
    "A solid center-back who provided the defensive foundation for the most revolutionary team in football history."),
  p("jongbloed_1974", "Jan Jongbloed", "Netherlands", 1974, "GK", 86, 10, 22, 87,
    "An unconventional sweeper-keeper decades before the term existed — Jongbloed played high up the pitch to suit Cruyff's Total Football."),
];

// ============================================================
// 4. ARGENTINA 1986 — Maradona's Masterpiece
// ============================================================
const argentina1986 = [
  p("maradona_1986", "Diego Maradona", "Argentina", 1986, "MID", 98, 93, 96, 28,
    "Single-handedly carried Argentina to the 1986 title, scoring the 'Goal of the Century' against England — a 60-yard solo dribble past 5 defenders.",
    { legend: true, superpower: { name: "Hand of God", description: "+5 MID rating to your squad" },
      record: { metric: "goals", value: 5, headline: "Hand of God — Your midfield conjured Maradona-level magic!" } }),
  p("valdano_1986", "Jorge Valdano", "Argentina", 1986, "FW", 89, 88, 58, 22,
    "Scored in the 1986 World Cup Final and was Maradona's key attacking partner — an intellectual striker who later became one of football's great thinkers.",
    { legend: true, superpower: { name: "The Professor", description: "+2 ATK to all Forwards" } }),
  p("burruchaga_1986", "Jorge Burruchaga", "Argentina", 1986, "MID", 89, 80, 85, 38,
    "Scored the winning goal in the 1986 World Cup Final against West Germany — a moment that made him immortal in Argentine football."),
  p("pumpido_1986", "Nery Pumpido", "Argentina", 1986, "GK", 87, 8, 15, 88,
    "A reliable shot-stopper who kept Argentina's defense organized while Maradona worked his magic further up the pitch."),
  p("brown_1986", "José Luis Brown", "Argentina", 1986, "DEF", 87, 25, 48, 88,
    "Scored the opening goal in the 1986 Final and played the second half with a dislocated shoulder — the heart of Argentina's defense."),
  p("ruggeri_1986", "Oscar Ruggeri", "Argentina", 1986, "DEF", 88, 28, 50, 90,
    "A fearsome center-back nicknamed 'El Cabezón' who formed a rock-solid partnership with Brown in Argentina's title-winning defense."),
  p("cuciuffo_1986", "José Cuciuffo", "Argentina", 1986, "DEF", 85, 30, 48, 86,
    "A versatile defender who could play across the back line, providing Bilardo's tactical system with crucial flexibility."),
  p("olarticoechea_1986", "Julio Olarticoechea", "Argentina", 1986, "DEF", 86, 35, 52, 87,
    "A left-back who scored a crucial goal against England in the quarterfinals — the same match as Maradona's two legendary goals."),
  p("batista_1986", "Sergio Batista", "Argentina", 1986, "MID", 86, 35, 86, 65,
    "The defensive midfielder who shielded the backline and gave Maradona the freedom to roam — an unsung hero of 1986."),
  p("giusti_1986", "Ricardo Giusti", "Argentina", 1986, "MID", 85, 40, 84, 60,
    "A tough-tackling midfielder who did the hard running and man-marking that Bilardo's disciplined tactical system demanded."),
  p("enrique_1986", "Héctor Enrique", "Argentina", 1986, "MID", 86, 55, 85, 50,
    "Provided the crucial pass to Maradona before the 'Goal of the Century' — without Enrique's assist, the most famous goal ever wouldn't exist."),
];

// ============================================================
// 5. WEST GERMANY 1990 — Matthäus Commands the World
// ============================================================
const westGermany1990 = [
  p("matthaus_1990", "Lothar Matthäus", "West Germany", 1990, "MID", 95, 78, 96, 72,
    "Holds the record for most World Cup matches played (25) and captained Germany to the 1990 title with his relentless box-to-box energy.",
    { legend: true, superpower: { name: "Iron Captain", description: "+3 MID to all Midfielders" },
      record: { metric: "goals", value: 5, headline: "Iron Lothar — Your midfield ran every blade of grass like Matthäus!" } }),
  p("klinsmann_1990", "Jürgen Klinsmann", "West Germany", 1990, "FW", 92, 91, 55, 22,
    "A devastating striker who scored 11 World Cup goals across three tournaments (1990, 1994, 1998) and later managed both Germany and the USA.",
    { legend: true, superpower: { name: "Golden Striker", description: "+3 ATK rating" } }),
  p("brehme_1990", "Andreas Brehme", "West Germany", 1990, "DEF", 92, 70, 72, 90,
    "Scored the penalty that won the 1990 World Cup Final — taken with his weaker right foot because the ball was on that side. Ice in his veins.",
    { legend: true, superpower: { name: "The Decider", description: "+2 ATK for all Defenders" } }),
  p("illgner_1990", "Bodo Illgner", "West Germany", 1990, "GK", 87, 8, 15, 88,
    "Became West Germany's first-choice keeper at just 22 and kept clean sheets in the quarterfinal and semifinal en route to the 1990 title."),
  p("berthold_1990", "Thomas Berthold", "West Germany", 1990, "DEF", 87, 35, 55, 88,
    "A versatile defender who could play center-back or right-back, providing Beckenbauer (as manager) with tactical flexibility."),
  p("augenthaler_1990", "Klaus Augenthaler", "West Germany", 1990, "DEF", 88, 30, 60, 90,
    "A commanding sweeper who read the game brilliantly, clearing danger before it materialized in Germany's disciplined defensive system."),
  p("kohler_1990", "Jürgen Kohler", "West Germany", 1990, "DEF", 89, 22, 52, 92,
    "One of the great man-markers in football history — Kohler could nullify any striker in the world through sheer defensive intelligence."),
  p("buchwald_1990", "Guido Buchwald", "West Germany", 1990, "MID", 87, 35, 82, 78,
    "Man-marked Maradona out of the 1990 Final — a tactical masterclass that neutralized the world's best player on the biggest stage."),
  p("hassler_1990", "Thomas Häßler", "West Germany", 1990, "MID", 88, 72, 88, 38,
    "A diminutive playmaker nicknamed 'Icke' whose technical ability and vision provided the creative spark in Germany's midfield."),
  p("littbarski_1990", "Pierre Littbarski", "West Germany", 1990, "FW", 87, 82, 70, 28,
    "A tricky winger who played in three World Cups (1982, 1986, 1990) and provided the speed and creativity on the flanks."),
  p("voller_1990", "Rudi Völler", "West Germany", 1990, "FW", 90, 90, 50, 20,
    "A prolific striker remembered for his infamous spitting incident with Rijkaard in 1990 and for later managing Germany to the 2002 World Cup Final."),
];

// ============================================================
// 6. BRAZIL 1994 — Romário's Samba Magic
// ============================================================
const brazil1994 = [
  p("romario_1994", "Romário", "Brazil", 1994, "FW", 96, 97, 55, 18,
    "Scored 5 goals in 7 games to win the 1994 World Cup and Golden Ball — a predator in the box who said 'I was born to score goals, like Beethoven was born to write music.'",
    { legend: true, superpower: { name: "Baixinho Brilliance", description: "+4 ATK rating" },
      record: { metric: "goals", value: 7, headline: "Baixinho's Magic — Your striker was as lethal as Romário in the USA!" } }),
  p("bebeto_1994", "Bebeto", "Brazil", 1994, "FW", 90, 89, 62, 20,
    "Formed a legendary partnership with Romário and created football's most famous celebration — the 'baby rocking' after scoring against the Netherlands.",
    { legend: true, superpower: { name: "The Celebration", description: "+2 ATK rating" } }),
  p("taffarel_1994", "Taffarel", "Brazil", 1994, "GK", 89, 8, 15, 90,
    "Saved the decisive penalty in the 1994 World Cup Final shootout against Italy — Brazil's first title in 24 years came down to his gloves."),
  p("jorginho_1994", "Jorginho", "Brazil", 1994, "DEF", 87, 45, 60, 87,
    "An attacking right-back who balanced defensive duties with surging runs forward, setting the template for modern Brazilian fullbacks."),
  p("aldair_1994", "Aldair", "Brazil", 1994, "DEF", 89, 25, 50, 92,
    "A elegant center-back who was the defensive rock of Brazil 1994 — composed on the ball and commanding in the air."),
  p("marcio_santos_1994", "Márcio Santos", "Brazil", 1994, "DEF", 86, 22, 48, 87,
    "Partnered Aldair in central defense and scored the winning penalty in the shootout against the Netherlands in the quarterfinals."),
  p("branco_1994", "Branco", "Brazil", 1994, "DEF", 88, 55, 60, 87,
    "A left-back with a ferocious free kick — his stunning strike against the Netherlands in the quarterfinals is one of Brazil's most iconic World Cup goals."),
  p("dunga_1994", "Dunga", "Brazil", 1994, "MID", 88, 40, 88, 70,
    "The captain who lifted Brazil's fourth World Cup trophy — a warrior in midfield who prioritized winning over flair, dividing fan opinion forever."),
  p("mauro_silva_1994", "Mauro Silva", "Brazil", 1994, "MID", 87, 35, 87, 68,
    "The unsung defensive midfielder who broke up play and recycled possession, giving Romário and Bebeto the platform to shine."),
  p("mazinho_1994", "Mazinho", "Brazil", 1994, "MID", 86, 45, 85, 55,
    "Father of future Barcelona stars Thiago and Rafinha, Mazinho was a tireless midfielder who covered every blade of grass."),
  p("zinho_1994", "Zinho", "Brazil", 1994, "MID", 89, 68, 90, 40,
    "The creative hub of Brazil's midfield, Zinho was named in the All-Star Team of the 1994 World Cup for his vision and technical brilliance."),
];

// ============================================================
// 7. FRANCE 1998 — Les Bleus' First Star
// ============================================================
const france1998 = [
  p("zidane_1998", "Zinedine Zidane", "France", 1998, "MID", 97, 85, 97, 35,
    "Scored two headers in the 1998 World Cup Final to give France their first-ever title on home soil, becoming a national icon overnight.",
    { legend: true, superpower: { name: "Le Maestro", description: "+4 MID rating" },
      record: { metric: "goals", value: 4, headline: "Zizou's Touch — Your midfield orchestrated the game like the French maestro!" } }),
  p("thuram_1998", "Lilian Thuram", "France", 1998, "DEF", 93, 42, 58, 95,
    "Scored the only two goals of his entire international career in the 1998 semifinal to knock out Croatia — a defender's fairytale.",
    { legend: true, superpower: { name: "The Wall", description: "+3 DEF rating" } }),
  p("barthez_1998", "Fabien Barthez", "France", 1998, "GK", 90, 10, 18, 91,
    "An eccentric, bald goalkeeper who kissed Laurent Blanc's head before every match as a good luck ritual — and kept clean sheets throughout the knockout rounds."),
  p("desailly_1998", "Marcel Desailly", "France", 1998, "DEF", 91, 25, 55, 94,
    "A powerful center-back who was sent off in the 1998 Final but had already helped France build an unassailable 3-0 lead."),
  p("blanc_1998", "Laurent Blanc", "France", 1998, "DEF", 90, 30, 60, 93,
    "Scored France's first ever World Cup golden goal against Paraguay, but was cruelly suspended for the Final after a red card in the semis."),
  p("lizarazu_1998", "Bixente Lizarazu", "France", 1998, "DEF", 88, 40, 58, 89,
    "A tenacious left-back who combined defensive solidity with surging runs, forming an impenetrable backline with Thuram and Desailly."),
  p("deschamps_1998", "Didier Deschamps", "France", 1998, "MID", 89, 30, 90, 68,
    "Captained France to the 1998 title and later became the only third person to win the World Cup as both player (1998) and manager (2018)."),
  p("petit_1998", "Emmanuel Petit", "France", 1998, "MID", 88, 60, 87, 62,
    "Scored the third goal in the 1998 Final with a flowing run into the box — a ponytailed icon of French football's golden generation."),
  p("karembeu_1998", "Christian Karembeu", "France", 1998, "MID", 86, 48, 84, 58,
    "A versatile midfielder from New Caledonia who provided energy and defensive cover in France's midfield, one of the tournament's most multicultural squads."),
  p("djorkaeff_1998", "Youri Djorkaeff", "France", 1998, "FW", 89, 87, 72, 28,
    "The 'Snake' was one of France's most technically gifted forwards, providing guile and goals throughout their triumphant home tournament."),
  p("guivarch_1998", "Stéphane Guivarc'h", "France", 1998, "FW", 85, 78, 50, 22,
    "Famously failed to score in the entire tournament despite starting in the Final — proof that you can be a World Cup winner without scoring a goal."),
];

// ============================================================
// 8. BRAZIL 2002 — Ronaldo's Redemption
// ============================================================
const brazil2002 = [
  p("ronaldo_2002", "Ronaldo Nazário", "Brazil", 2002, "FW", 98, 98, 60, 22,
    "After a devastating knee injury and a seizure before the 1998 Final, R9 returned to score 8 goals in the 2002 World Cup — the ultimate redemption story.",
    { legend: true, superpower: { name: "O Fenômeno", description: "+5 ATK rating" },
      record: { metric: "goals", value: 8, headline: "O Fenômeno Returns — Your attack rivaled Ronaldo's legendary 2002 redemption!" } }),
  p("ronaldinho_2002", "Ronaldinho", "Brazil", 2002, "MID", 94, 85, 93, 28,
    "Lobbed England's David Seaman from 35 yards with a free kick that may or may not have been a cross — he insists it was deliberate, and Brazil believed.",
    { legend: true, superpower: { name: "Joga Bonito", description: "+3 MID, +2 ATK" } }),
  p("roberto_carlos_2002", "Roberto Carlos", "Brazil", 2002, "DEF", 93, 68, 65, 90,
    "The left-back with the most powerful shot in football — his physics-defying free kick against France in 1997 changed how the world saw defenders.",
    { legend: true, superpower: { name: "Banana Free Kick", description: "+3 DEF, +2 ATK" } }),
  p("cafu_2002", "Cafú", "Brazil", 2002, "DEF", 93, 65, 70, 92,
    "The only player to appear in three consecutive World Cup Finals (1994, 1998, 2002), captaining Brazil to victory in the last — an unmatched achievement."),
  p("rivaldo_2002", "Rivaldo", "Brazil", 2002, "FW", 94, 93, 78, 25,
    "Scored a hat-trick against England, including a legendary overhead kick, and was part of the fearsome 'Three Rs' with Ronaldo and Ronaldinho."),
  p("marcos_2002", "Marcos", "Brazil", 2002, "GK", 87, 8, 15, 88,
    "A surprise starter who kept his nerve in the biggest tournament, including saves in the semifinal against Turkey that sent Brazil to the Final."),
  p("lucio_2002", "Lúcio", "Brazil", 2002, "DEF", 89, 38, 52, 90,
    "An adventurous center-back who loved to charge forward with the ball, scoring goals that most strikers would be proud of."),
  p("edmilson_2002", "Edmílson", "Brazil", 2002, "MID", 87, 35, 85, 72,
    "A versatile defensive midfielder-turned-center-back who provided tactical flexibility across Brazil's victorious campaign."),
  p("gilberto_silva_2002", "Gilberto Silva", "Brazil", 2002, "MID", 88, 35, 88, 70,
    "Scored in the 2002 Final and went on to become Arsenal's 'Invincible' — a World Cup winner at 25 before most knew his name."),
  p("kleberson_2002", "Kléberson", "Brazil", 2002, "MID", 86, 50, 85, 55,
    "A box-to-box midfielder who earned a transfer to Manchester United on the strength of his 2002 World Cup performances."),
  p("roque_junior_2002", "Roque Júnior", "Brazil", 2002, "DEF", 85, 20, 45, 86,
    "A center-back who won the World Cup and Champions League in the same year (2002) — then incredibly was relegated with Leeds United the next season."),
];

// ============================================================
// 9. ITALY 2006 — Buffon's Blue Fortress
// ============================================================
const italy2006 = [
  p("buffon_2006", "Gianluigi Buffon", "Italy", 2006, "GK", 96, 8, 15, 98,
    "Conceded only 2 goals in the entire 2006 World Cup (one an own goal, one a penalty) as Italy won their 4th title — 453 minutes of near-perfection.",
    { legend: true, superpower: { name: "Superman", description: "+4 DEF for all Defenders" },
      record: { metric: "clean_sheets", value: 5, headline: "Buffon's Fortress — Your keeper was virtually unbeatable, just like Gigi in Germany!" } }),
  p("cannavaro_2006", "Fabio Cannavaro", "Italy", 2006, "DEF", 95, 22, 50, 98,
    "Won the Ballon d'Or in 2006 — the last defender to do so — after captaining Italy to the World Cup with a series of immaculate performances.",
    { legend: true, superpower: { name: "The Shield", description: "+4 DEF rating" } }),
  p("pirlo_2006", "Andrea Pirlo", "Italy", 2006, "MID", 95, 72, 97, 48,
    "The deep-lying playmaker who dictated games with surgical passing, making Italy's attack tick while barely breaking a sweat — the ultimate maestro.",
    { legend: true, superpower: { name: "The Architect", description: "+4 MID rating" } }),
  p("zambrotta_2006", "Gianluca Zambrotta", "Italy", 2006, "DEF", 89, 52, 62, 89,
    "A versatile fullback who could play on either flank, providing width and energy for Lippi's disciplined tactical system."),
  p("materazzi_2006", "Marco Materazzi", "Italy", 2006, "DEF", 87, 38, 42, 88,
    "Scored the equalizer in the 2006 Final and was headbutted by Zidane moments later — the most infamous moment in World Cup Final history."),
  p("grosso_2006", "Fabio Grosso", "Italy", 2006, "DEF", 87, 45, 55, 87,
    "Scored Italy's decisive goal against Germany in the semifinal and then converted the winning penalty in the Final — an unlikely hero."),
  p("gattuso_2006", "Gennaro Gattuso", "Italy", 2006, "MID", 89, 35, 88, 78,
    "The midfield enforcer whose relentless pressing and tackling protected the defense — 'Sometimes the best pass is a tackle,' he once said."),
  p("camoranesi_2006", "Mauro Camoranesi", "Italy", 2006, "MID", 87, 68, 85, 48,
    "An Argentine-born Italian who provided pace and directness on the right wing, stretching defenses for Totti and Pirlo to exploit."),
  p("totti_2006", "Francesco Totti", "Italy", 2006, "FW", 91, 90, 80, 25,
    "Roma's eternal captain, Totti's vision and technique brought a unique attacking dimension even as a substitute in the 2006 tournament."),
  p("toni_2006", "Luca Toni", "Italy", 2006, "FW", 88, 88, 42, 22,
    "A towering target man who led the line for Italy, winning aerial duels and holding up play to bring others into the attack."),
  p("del_piero_2006", "Alessandro Del Piero", "Italy", 2006, "FW", 90, 90, 72, 20,
    "Scored a magnificent curling goal in the semifinal against Germany in the last minute — one of the great World Cup goals by one of Italy's greatest ever."),
];

// ============================================================
// 10. SPAIN 2010 — Tiki-Taka Perfection
// ============================================================
const spain2010 = [
  p("xavi_2010", "Xavi", "Spain", 2010, "MID", 95, 65, 97, 50,
    "The heartbeat of Spain's tiki-taka revolution — Xavi completed more passes in the 2010 World Cup than any player, controlling games with metronomic precision.",
    { legend: true, superpower: { name: "Tiki-Taka", description: "+3 MID to all Midfielders" },
      record: { metric: "goals", value: 3, headline: "Tiki-Taka Mastery — Your midfield controlled possession like Xavi's Spain!" } }),
  p("iniesta_2010", "Andrés Iniesta", "Spain", 2010, "MID", 95, 78, 96, 45,
    "Scored the most important goal in Spanish football history — the 116th-minute winner in the 2010 Final, then revealed a shirt reading 'Dani Jarque, always with us' in tribute to his late friend.",
    { legend: true, superpower: { name: "Clutch Artist", description: "+3 MID, +2 ATK" } }),
  p("villa_2010", "David Villa", "Spain", 2010, "FW", 92, 93, 58, 20,
    "Spain's all-time top scorer netted 5 goals at the 2010 World Cup, including a stunning volley against Chile — the sharp point of tiki-taka's spear.",
    { legend: true, superpower: { name: "El Guaje", description: "+3 ATK rating" } }),
  p("casillas_2010", "Iker Casillas", "Spain", 2010, "GK", 93, 8, 15, 95,
    "Made a legendary one-on-one save against Robben in the 2010 Final — without it, the Netherlands would have been world champions."),
  p("ramos_2010", "Sergio Ramos", "Spain", 2010, "DEF", 91, 42, 55, 92,
    "At just 24, Ramos was already Spain's rock at the back, beginning a career that would see him become the most-capped European male player in history."),
  p("puyol_2010", "Carles Puyol", "Spain", 2010, "DEF", 91, 25, 48, 94,
    "Scored the towering header in the semifinal against Germany that sent Spain to their first-ever World Cup Final — raw passion personified."),
  p("pique_2010", "Gerard Piqué", "Spain", 2010, "DEF", 90, 30, 55, 92,
    "A ball-playing center-back who embodied Spain's philosophy of building from the back, treating defensive duties as the first act of attack."),
  p("capdevila_2010", "Joan Capdevila", "Spain", 2010, "DEF", 86, 40, 55, 87,
    "A dependable left-back who provided defensive stability in a team that prioritized possession and pressing."),
  p("busquets_2010", "Sergio Busquets", "Spain", 2010, "MID", 90, 30, 92, 72,
    "The invisible metronome — Busquets rarely made headlines but touched the ball more than almost anyone, keeping Spain's tiki-taka machine ticking."),
  p("xabi_alonso_2010", "Xabi Alonso", "Spain", 2010, "MID", 90, 55, 91, 65,
    "A deep-lying playmaker with the range of a quarterback — Alonso switched play with 60-yard passes that defenses couldn't cope with."),
  p("pedro_2010", "Pedro", "Spain", 2010, "FW", 87, 85, 62, 28,
    "Became the only player in history to score in six different official competitions in one calendar year (2009-10), including the World Cup."),
];

// ============================================================
// 11. GERMANY 2014 — The Machine That Broke Brazil
// ============================================================
const germany2014 = [
  p("neuer_2014", "Manuel Neuer", "Germany", 2014, "GK", 95, 12, 28, 96,
    "Redefined goalkeeping by playing as a sweeper-keeper, charging 40 yards off his line to intercept through balls — won the Golden Glove in 2014.",
    { legend: true, superpower: { name: "Sweeper Keeper", description: "+3 DEF, +2 MID" },
      record: { metric: "clean_sheets", value: 4, headline: "Neuer's Revolution — Your keeper swept and saved like the modern master!" } }),
  p("kroos_2014", "Toni Kroos", "Germany", 2014, "MID", 93, 65, 95, 52,
    "Scored two goals in 69 seconds during the 7-1 demolition of Brazil in the semifinal — the most shocking result in World Cup history.",
    { legend: true, superpower: { name: "Metronome", description: "+3 MID rating" } }),
  p("thomas_muller_2014", "Thomas Müller", "Germany", 2014, "FW", 92, 90, 75, 42,
    "Scored 10 World Cup goals by age 24 — a 'Raumdeuter' (space interpreter) who finds pockets of space that don't seem to exist.",
    { legend: true, superpower: { name: "Raumdeuter", description: "+3 ATK rating" } }),
  p("lahm_2014", "Philipp Lahm", "Germany", 2014, "DEF", 92, 42, 75, 93,
    "Captained Germany to the 2014 title and retired from international football immediately after — going out on the ultimate high."),
  p("boateng_2014", "Jérôme Boateng", "Germany", 2014, "DEF", 90, 25, 50, 92,
    "Made a goal-line clearance against France in the quarterfinal that saved Germany's tournament — one foot prevented elimination."),
  p("hummels_2014", "Mats Hummels", "Germany", 2014, "DEF", 90, 30, 55, 91,
    "Scored the winning goal against France in the quarterfinal with a powerful header, leading Germany's defense with composure."),
  p("howedes_2014", "Benedikt Höwedes", "Germany", 2014, "DEF", 87, 22, 48, 88,
    "A center-back who played every minute of the 2014 World Cup at left-back — selflessly adapting for the team's tactical needs."),
  p("schweinsteiger_2014", "Bastian Schweinsteiger", "Germany", 2014, "MID", 91, 55, 92, 65,
    "Played the 2014 Final with a cut above his eye, bleeding and battered but refusing to come off — won the Man of the Match in the ultimate warrior display."),
  p("khedira_2014", "Sami Khedira", "Germany", 2014, "MID", 88, 50, 87, 62,
    "Scored in the 7-1 rout of Brazil and provided the engine room power that allowed Kroos and Özil to create."),
  p("ozil_2014", "Mesut Özil", "Germany", 2014, "MID", 89, 78, 90, 30,
    "A magician with the ball at his feet, Özil's vision and passing range unlocked defenses with assists that strikers dream of receiving."),
  p("klose_2014", "Miroslav Klose", "Germany", 2014, "FW", 89, 88, 48, 22,
    "Scored his 16th World Cup goal against Brazil to become the all-time top scorer in World Cup history — surpassing Ronaldo's record."),
];

// ============================================================
// 12. FRANCE 2018 — Les Bleus Strike Again
// ============================================================
const france2018 = [
  p("mbappe_2018", "Kylian Mbappé", "France", 2018, "FW", 94, 96, 55, 22,
    "Became the first teenager since Pelé in 1958 to score in a World Cup Final — at 19, Mbappé announced himself as football's next superstar.",
    { legend: true, superpower: { name: "Lightning Pace", description: "+4 ATK rating" },
      record: { metric: "goals", value: 6, headline: "Lightning Strikes — Your attack was as explosive as teenage Mbappé!" } }),
  p("griezmann_2018", "Antoine Griezmann", "France", 2018, "FW", 92, 90, 72, 35,
    "Won the World Cup Final Man of the Match, scoring from the penalty spot and winning the free kick that led to France's second goal.",
    { legend: true, superpower: { name: "The Conductor", description: "+3 ATK, +2 MID" } }),
  p("kante_2018", "N'Golo Kanté", "France", 2018, "MID", 92, 35, 92, 82,
    "Covers more ground than any other player in world football — there's a joke that 70% of the Earth is covered by water and the rest by Kanté.",
    { legend: true, superpower: { name: "Everywhere Man", description: "+3 MID, +3 DEF" } }),
  p("lloris_2018", "Hugo Lloris", "France", 2018, "GK", 89, 8, 15, 90,
    "Captained France to the 2018 title despite a costly fumble in the Final — leadership isn't about perfection, it's about keeping the team together."),
  p("varane_2018", "Raphaël Varane", "France", 2018, "DEF", 91, 25, 50, 93,
    "At just 25, headed in the opening goal against Uruguay in the quarterfinal — the rock at the heart of France's defense."),
  p("umtiti_2018", "Samuel Umtiti", "France", 2018, "DEF", 89, 22, 48, 90,
    "Scored the semifinal winning goal against Belgium with a towering header from a corner — a defender's dream goal on the biggest stage."),
  p("pavard_2018", "Benjamin Pavard", "France", 2018, "DEF", 87, 42, 55, 87,
    "Scored the Goal of the Tournament — a stunning right-foot volley against Argentina that was voted the best goal of the 2018 World Cup."),
  p("hernandez_2018", "Lucas Hernández", "France", 2018, "DEF", 87, 35, 52, 88,
    "A fearless left-back who played through pain barriers, bombing forward and defending with equal intensity at just 22 years old."),
  p("pogba_2018", "Paul Pogba", "France", 2018, "MID", 90, 72, 90, 52,
    "Scored a screamer in the 2018 Final and produced his best football on the biggest stage — silencing years of criticism with a World Cup winners medal."),
  p("matuidi_2018", "Blaise Matuidi", "France", 2018, "MID", 87, 45, 86, 65,
    "The workhorse midfielder who sacrificed his natural game to play left midfield for Deschamps' tactical system — selfless team play rewarded."),
  p("giroud_2018", "Olivier Giroud", "France", 2018, "FW", 86, 82, 50, 30,
    "Didn't have a single shot on target in the entire 2018 World Cup but was crucial as a target man — winning a World Cup without scoring proves there are many ways to contribute."),
];

// ============================================================
// 13. CROATIA 2018 — The Smallest Nation to Reach a Final
// ============================================================
const croatia2018 = [
  p("modric_2018", "Luka Modrić", "Croatia", 2018, "MID", 95, 72, 96, 52,
    "Won the Golden Ball as the 2018 World Cup's best player, leading Croatia to their first Final — proof that a nation of 4 million can compete with giants.",
    { legend: true, superpower: { name: "Golden Ball", description: "+4 MID rating" },
      record: { metric: "goals", value: 4, headline: "Modrić's Mastery — Your midfield controlled the game like the Golden Ball winner!" } }),
  p("rakitic_2018", "Ivan Rakitić", "Croatia", 2018, "MID", 90, 68, 90, 55,
    "Scored the decisive penalty in two shootouts (Denmark and Russia) with ice-cold composure — Croatia's Mr. Reliable when it mattered most.",
    { legend: true, superpower: { name: "Ice-Cold Penalties", description: "+2 MID rating" } }),
  p("subasic_2018", "Danijel Subašić", "Croatia", 2018, "GK", 87, 8, 15, 88,
    "Saved three penalties against Denmark in the Round of 16 — a shootout masterclass that opened Croatia's path to the Final."),
  p("vrsaljko_2018", "Šime Vrsaljko", "Croatia", 2018, "DEF", 86, 45, 55, 86,
    "An energetic right-back who provided width and crossing ability, tirelessly overlapping through extra time in multiple knockout games."),
  p("lovren_2018", "Dejan Lovren", "Croatia", 2018, "DEF", 86, 22, 48, 87,
    "A center-back whose passion and intensity helped anchor Croatia's defense through three consecutive extra-time knockout matches."),
  p("vida_2018", "Domagoj Vida", "Croatia", 2018, "DEF", 86, 25, 45, 87,
    "Scored in the quarterfinal against Russia and became a cult hero with his bleach-blond hair and fearless defending."),
  p("strinic_2018", "Ivan Strinić", "Croatia", 2018, "DEF", 85, 35, 50, 85,
    "A steady left-back who provided defensive stability on a team known more for its midfield creativity and attacking flair."),
  p("brozovic_2018", "Marcelo Brozović", "Croatia", 2018, "MID", 88, 55, 88, 62,
    "The metronome in Croatia's midfield who covered more distance than any other player in the 2018 World Cup — a running machine."),
  p("rebic_2018", "Ante Rebić", "Croatia", 2018, "FW", 86, 84, 55, 28,
    "A direct and powerful winger who terrorized Argentina's defense in the group stage, scoring in Croatia's stunning 3-0 victory."),
  p("mandzukic_2018", "Mario Mandžukić", "Croatia", 2018, "FW", 88, 87, 50, 30,
    "Scored an own goal AND Croatia's second goal in the 2018 Final — the only player in history to score at both ends in a World Cup Final."),
  p("perisic_2018", "Ivan Perišić", "Croatia", 2018, "FW", 88, 86, 60, 32,
    "Scored a stunning equalizer in the 2018 Final with a brilliant left-foot volley — one of the great World Cup Final goals."),
];

// ============================================================
// 14. ARGENTINA 2022 — Messi Completes Football
// ============================================================
const argentina2022 = [
  p("messi_2022", "Lionel Messi", "Argentina", 2022, "FW", 99, 99, 88, 25,
    "At 35, finally completed football by winning the 2022 World Cup in the greatest final ever played — scoring twice and converting the decisive penalty against France.",
    { legend: true, superpower: { name: "The GOAT", description: "+3 to all squad stats" },
      record: { metric: "goals", value: 8, headline: "The GOAT Cometh — Your forwards achieved the impossible, just like Messi in Qatar!" } }),
  p("di_maria_2022", "Ángel Di María", "Argentina", 2022, "FW", 91, 90, 72, 25,
    "Scored a magnificent goal in the 2022 Final — kept on the bench for most of the tournament but delivered when it mattered most, fulfilling a childhood dream.",
    { legend: true, superpower: { name: "Fideo's Magic", description: "+3 ATK, +2 MID" } }),
  p("emi_martinez_2022", "Emiliano Martínez", "Argentina", 2022, "GK", 92, 8, 15, 93,
    "Made a legendary save against Kolo Muani in the last second of extra time in the Final, then dominated the penalty shootout with mind games — instantly iconic.",
    { legend: true, superpower: { name: "Dibu's Mind Games", description: "+3 DEF, penalty shootout bonus" } }),
  p("molina_2022", "Nahuel Molina", "Argentina", 2022, "DEF", 86, 50, 55, 86,
    "Scored a goal in the quarterfinal against the Netherlands with a perfectly timed run — an attacking right-back who contributed at both ends."),
  p("romero_2022", "Cristian Romero", "Argentina", 2022, "DEF", 88, 25, 48, 90,
    "An aggressive, front-foot center-back whose intensity set the tone for Argentina's defense throughout their triumphant campaign."),
  p("otamendi_2022", "Nicolás Otamendi", "Argentina", 2022, "DEF", 87, 22, 45, 89,
    "The experienced head in defense who had waited years for World Cup glory — finally lifted the trophy at 34 alongside Messi."),
  p("tagliafico_2022", "Nicolás Tagliafico", "Argentina", 2022, "DEF", 86, 38, 52, 87,
    "A reliable left-back who provided defensive cover and allowed Di María the freedom to push forward in the matches he started."),
  p("de_paul_2022", "Rodrigo De Paul", "Argentina", 2022, "MID", 88, 60, 88, 58,
    "Messi's personal bodyguard on the pitch — De Paul ran tirelessly to win the ball back and immediately feed it to the captain."),
  p("enzo_fernandez_2022", "Enzo Fernández", "Argentina", 2022, "MID", 88, 58, 88, 62,
    "Won the Young Player Award at just 21, announcing himself to the world with a stunning curling goal against Mexico."),
  p("mac_allister_2022", "Alexis Mac Allister", "Argentina", 2022, "MID", 87, 62, 86, 55,
    "A Brighton midfielder who played every minute of the knockout rounds, providing intelligence and composure in Argentina's engine room."),
  p("alvarez_2022", "Julián Álvarez", "Argentina", 2022, "FW", 88, 88, 58, 30,
    "Scored 4 goals in the tournament at just 22 — including a brilliant solo goal against Croatia in the semifinal that announced a future superstar."),
];

// ============================================================
// 15. MOROCCO 2022 — Africa's Historic First
// ============================================================
const morocco2022 = [
  p("bounou_2022", "Yassine Bounou", "Morocco", 2022, "GK", 90, 8, 15, 92,
    "Known as 'Bono,' this Sevilla keeper was the foundation of Morocco's historic run — keeping clean sheets against Belgium, Spain, and Portugal.",
    { legend: true, superpower: { name: "The Wall of Marrakech", description: "+3 DEF rating" },
      record: { metric: "clean_sheets", value: 4, headline: "Bono's Wall — Your keeper was as impenetrable as Morocco's historic defense!" } }),
  p("hakimi_2022", "Achraf Hakimi", "Morocco", 2022, "DEF", 90, 62, 60, 89,
    "Scored the winning penalty against Spain with an audacious Panenka chip — born in Madrid, he eliminated the country of his birth with ice-cold nerve.",
    { legend: true, superpower: { name: "The Panenka", description: "+3 DEF, +2 ATK" } }),
  p("amrabat_2022", "Sofyan Amrabat", "Morocco", 2022, "MID", 88, 35, 89, 72,
    "The midfield destroyer who tackled, intercepted, and recycled possession relentlessly — the engine behind Morocco's improbable semifinal run."),
  p("saiss_2022", "Romain Saïss", "Morocco", 2022, "DEF", 86, 22, 48, 87,
    "The captain who played through injury against Portugal in the quarterfinals — carried off on a stretcher but already a hero."),
  p("aguerd_2022", "Nayef Aguerd", "Morocco", 2022, "DEF", 86, 20, 45, 87,
    "A composed center-back whose reading of the game and passing ability helped Morocco build attacks from deep."),
  p("mazraoui_2022", "Noussair Mazraoui", "Morocco", 2022, "DEF", 86, 48, 58, 85,
    "A Bayern Munich fullback whose technical ability and overlapping runs gave Morocco an extra dimension in attack."),
  p("ounahi_2022", "Azzedine Ounahi", "Morocco", 2022, "MID", 86, 60, 85, 45,
    "An unknown Angers midfielder who became the breakout star of the 2022 World Cup — his dribbling and passing drew comparisons to Zidane."),
  p("ziyech_2022", "Hakim Ziyech", "Morocco", 2022, "FW", 88, 86, 72, 28,
    "The Chelsea playmaker whose creativity and dead-ball delivery unlocked defenses — Morocco's chief chance creator."),
  p("en_nesyri_2022", "Youssef En-Nesyri", "Morocco", 2022, "FW", 86, 84, 42, 22,
    "Scored the winning goal against Portugal in the quarterfinals with a towering header — sending Morocco and an entire continent into delirium."),
  p("boufal_2022", "Sofiane Boufal", "Morocco", 2022, "FW", 85, 82, 55, 22,
    "Danced with his mother on the pitch after beating Portugal — a moment that captured the joy and family spirit of Morocco's historic run."),
  p("amallah_2022", "Selim Amallah", "Morocco", 2022, "MID", 85, 50, 82, 48,
    "A versatile midfielder who provided squad depth and tactical flexibility as Morocco rotated to stay fresh through extra time games."),
];

// ============================================================
// 16. ENGLAND 1966 — Football Comes Home
// ============================================================
const england1966 = [
  p("bobby_moore_1966", "Bobby Moore", "England", 1966, "DEF", 95, 30, 65, 97,
    "Captained England to their only World Cup in 1966 and made a legendary tackle on Jairzinho in 1970 that Pelé called 'the fairest tackle I ever faced.'",
    { legend: true, superpower: { name: "The Perfect Defender", description: "+4 DEF rating" },
      record: { metric: "clean_sheets", value: 4, headline: "Moore's Command — Your captain marshaled the defense like Bobby Moore at Wembley!" } }),
  p("gordon_banks_1966", "Gordon Banks", "England", 1966, "GK", 94, 8, 18, 96,
    "Made the 'Save of the Century' against Pelé's header in 1970 and was the backbone of England's only World Cup triumph in 1966.",
    { legend: true, superpower: { name: "Save of the Century", description: "+4 DEF rating" } }),
  p("geoff_hurst_1966", "Geoff Hurst", "England", 1966, "FW", 92, 90, 52, 25,
    "The only player to score a hat-trick in a World Cup Final — his controversial second goal ('Did it cross the line?') remains football's greatest debate.",
    { legend: true, superpower: { name: "Hat-Trick Hero", description: "+4 ATK rating" } }),
  p("bobby_charlton_1966", "Bobby Charlton", "England", 1966, "MID", 94, 85, 92, 38,
    "Survived the Munich air disaster in 1958 and went on to become England's greatest ever player, scoring thunderous goals from midfield."),
  p("jack_charlton_1966", "Jack Charlton", "England", 1966, "DEF", 88, 25, 50, 89,
    "Bobby's older brother and a towering center-back who later managed Ireland to their first-ever World Cup in 1990."),
  p("george_cohen_1966", "George Cohen", "England", 1966, "DEF", 86, 38, 52, 87,
    "A marauding right-back who played every minute of the 1966 tournament and was one of the most reliable defenders in English football history."),
  p("ray_wilson_1966", "Ray Wilson", "England", 1966, "DEF", 87, 35, 55, 88,
    "A composed left-back who formed part of the most famous defense in English football history — later became an undertaker after retirement."),
  p("nobby_stiles_1966", "Nobby Stiles", "England", 1966, "MID", 87, 30, 85, 72,
    "A toothless, tough-tackling midfielder famous for his victory jig while holding the Jules Rimet trophy — man-marked Eusébio out of the semifinal."),
  p("alan_ball_1966", "Alan Ball", "England", 1966, "MID", 89, 68, 88, 48,
    "The youngest member of the 1966 squad at 21, Ball ran tirelessly in the Final and was named Man of the Match."),
  p("martin_peters_1966", "Martin Peters", "England", 1966, "MID", 88, 75, 85, 42,
    "Scored England's second goal in the 1966 Final — Alf Ramsey called him 'ten years ahead of his time' for his intelligent off-the-ball movement."),
  p("roger_hunt_1966", "Roger Hunt", "England", 1966, "FW", 87, 86, 48, 22,
    "The unsung hero who scored 3 goals in the group stage and selflessly made space for Hurst in the Final — Liverpool's record scorer for decades."),
];

// ============================================================
// 17. USA 2026 — The Hosts
// ============================================================
const usa2026 = [
  p("turner_2026", "Matt Turner", "USA", 2026, "GK", 83, 8, 15, 84,
    "The hosts' first-choice goalkeeper brings shot-stopping ability honed in the Premier League to the biggest stage on home soil."),
  p("dest_2026", "Sergiño Dest", "USA", 2026, "RB", 84, 48, 58, 83,
    "A Dutch-born American who chose the Stars and Stripes, Dest combines Barcelona-trained technique with attacking fullback instincts."),
  p("richards_2026", "Chris Richards", "USA", 2026, "CB", 84, 22, 48, 86,
    "A composed, ball-playing center-back who developed at Bayern Munich and represents the new generation of American defenders."),
  p("m_robinson_2026", "Miles Robinson", "USA", 2026, "CB", 83, 20, 42, 85,
    "A physical, aggressive center-back whose recovery pace and aerial dominance anchor the American backline."),
  p("a_robinson_2026", "Antonee Robinson", "USA", 2026, "LB", 85, 42, 58, 85,
    "A tireless left-back whose lung-busting overlapping runs from Fulham have made him one of the Premier League's most dangerous fullbacks.",
    { legend: true, superpower: { name: "Jedi", description: "+2 DEF, +2 MID" } }),
  p("adams_2026", "Tyler Adams", "USA", 2026, "CDM", 85, 35, 86, 70,
    "The youngest-ever US captain at a World Cup (2022), Adams is a pressing machine who wins the ball back and keeps things simple."),
  p("mckennie_2026", "Weston McKennie", "USA", 2026, "CM", 86, 60, 86, 58,
    "A box-to-box midfielder with Juventus pedigree whose energy, aerial ability, and late runs into the box make him a unique threat."),
  p("reyna_2026", "Giovanni Reyna", "USA", 2026, "CAM", 87, 80, 86, 32,
    "The son of USMNT legend Claudio Reyna, Gio's silky technique and vision at Borussia Dortmund mark him as American soccer's brightest talent.",
    { legend: true, superpower: { name: "American Dream", description: "+3 MID, +2 ATK" },
      record: { metric: "goals", value: 5, headline: "The American Dream — Reyna lit up the home World Cup like his father never could!" } }),
  p("pulisic_2026", "Christian Pulisic", "USA", 2026, "LW", 89, 90, 72, 30,
    "Captain America — the face of US soccer who has proven himself at Dortmund, Chelsea, and AC Milan. The host nation's talisman for their biggest tournament ever.",
    { legend: true, superpower: { name: "Captain America", description: "+4 ATK rating" },
      record: { metric: "goals", value: 6, headline: "Captain America Rises — Pulisic delivered on the biggest stage on home soil!" } }),
  p("weah_2026", "Timothy Weah", "USA", 2026, "RW", 86, 85, 55, 30,
    "Son of Ballon d'Or winner George Weah, Tim has carved his own path with blistering pace and directness on the right wing for Juventus."),
  p("balogun_2026", "Folarin Balogun", "USA", 2026, "ST", 86, 87, 45, 22,
    "Born in New York, raised in London, the Monaco striker chose the USA and brings clinical finishing and intelligent movement to the host nation's attack."),
];

// ============================================================
// 18. ENGLAND 2026 — The Three Lions
// ============================================================
const england2026 = [
  p("pickford_2026", "Jordan Pickford", "England", 2026, "GK", 86, 10, 18, 88,
    "England's undisputed number one across three major tournaments, Pickford's penalty shootout heroics and big-game mentality are unmatched."),
  p("taa_2026", "Trent Alexander-Arnold", "England", 2026, "RB", 89, 70, 80, 82,
    "The Liverpool right-back whose passing range rivals a playmaker's. Has reinvented the fullback position with quarterback-like distribution.",
    { legend: true, superpower: { name: "Quarterback", description: "+3 MID, +2 ATK" } }),
  p("stones_2026", "John Stones", "England", 2026, "CB", 88, 25, 58, 90,
    "Guardiola transformed Stones from a talented but erratic defender into one of the most composed ball-playing center-backs in the world."),
  p("guehi_2026", "Marc Guéhi", "England", 2026, "CB", 87, 22, 48, 89,
    "The Crystal Palace captain whose maturity and reading of the game belie his age — England's defensive future became their present."),
  p("shaw_2026", "Luke Shaw", "England", 2026, "LB", 86, 40, 58, 87,
    "Scored in the Euro 2020 Final and has become one of England's most reliable defenders — a warrior who overcame a horrific leg break."),
  p("rice_2026", "Declan Rice", "England", 2026, "CDM", 90, 42, 90, 80,
    "The Arsenal midfielder who can do everything — tackle, pass, dribble, and score. England's engine and one of the best midfielders in the world.",
    { legend: true, superpower: { name: "The Engine", description: "+3 MID, +3 DEF" },
      record: { metric: "clean_sheets", value: 3, headline: "Rice's Fortress — Your midfield shield was as impenetrable as Declan Rice!" } }),
  p("bellingham_2026", "Jude Bellingham", "England", 2026, "CAM", 93, 85, 94, 52,
    "At 22, already a Ballon d'Or contender. Bellingham's move to Real Madrid produced one of the great debut seasons in football history — goals, assists, and Champions League glory.",
    { legend: true, superpower: { name: "The Prodigy", description: "+4 MID, +3 ATK" },
      record: { metric: "goals", value: 6, headline: "Bellingham's Brilliance — The prodigy delivered a tournament for the ages!" } }),
  p("palmer_2026", "Cole Palmer", "England", 2026, "CM", 89, 82, 88, 35,
    "Chelsea's ice-cold playmaker who scored in the Euro 2024 Final. Palmer's composure under pressure and deadly finishing make him undroppable."),
  p("foden_2026", "Phil Foden", "England", 2026, "LW", 91, 88, 85, 32,
    "Manchester City's homegrown genius whose close control and left foot can unlock any defense — England's most technically gifted player.",
    { legend: true, superpower: { name: "Stockport Iniesta", description: "+3 ATK, +2 MID" } }),
  p("saka_2026", "Bukayo Saka", "England", 2026, "RW", 91, 90, 72, 35,
    "Arsenal's Starboy whose directness, work rate, and end product from the right wing terrorize defenders. Overcame his Euro 2020 penalty miss to become England's best attacker.",
    { legend: true, superpower: { name: "Starboy", description: "+4 ATK rating" } }),
  p("kane_2026", "Harry Kane", "England", 2026, "ST", 91, 94, 60, 25,
    "England's all-time top scorer with over 65 international goals. The Bayern Munich striker's finishing, link-up play, and leadership define a generation.",
    { legend: true, superpower: { name: "The Hurricane", description: "+4 ATK rating" },
      record: { metric: "goals", value: 8, headline: "Kane's Crowning Glory — Football finally came home thanks to the Hurricane!" } }),
];

// ============================================================
// 19. BRAZIL 2026 — The Seleção Reborn
// ============================================================
const brazil2026 = [
  p("alisson_2026", "Alisson", "Brazil", 2026, "GK", 89, 10, 18, 91,
    "Liverpool's sweeper-keeper whose calmness and shot-stopping have made him arguably the best goalkeeper in the world for half a decade."),
  p("emerson_2026", "Emerson Royal", "Brazil", 2026, "RB", 84, 45, 55, 84,
    "A solid right-back who brings defensive reliability and overlapping runs to Brazil's backline."),
  p("marquinhos_2026", "Marquinhos", "Brazil", 2026, "CB", 89, 25, 52, 93,
    "PSG's captain and Brazil's defensive rock — a center-back whose reading of the game and composure make him virtually unbeatable one-on-one.",
    { legend: true, superpower: { name: "The General", description: "+3 DEF rating" } }),
  p("militao_2026", "Éder Militão", "Brazil", 2026, "CB", 87, 22, 48, 90,
    "A physically imposing center-back whose pace and aggression at Real Madrid make him one of the most complete defenders in world football."),
  p("arana_2026", "Guilherme Arana", "Brazil", 2026, "LB", 84, 42, 58, 84,
    "An attacking left-back whose crossing ability and set-piece delivery provide Brazil with width and creativity from deep."),
  p("bruno_g_2026", "Bruno Guimarães", "Brazil", 2026, "CDM", 89, 55, 91, 70,
    "Newcastle's midfield maestro whose elegance on the ball and tactical intelligence have drawn comparisons to Sergio Busquets.",
    { legend: true, superpower: { name: "The Magician", description: "+3 MID, +2 DEF" },
      record: { metric: "goals", value: 4, headline: "Bruno's Samba — Your midfield danced through the tournament with Brazilian flair!" } }),
  p("paqueta_2026", "Lucas Paquetá", "Brazil", 2026, "CAM", 87, 75, 87, 38,
    "A flair player whose stepovers, body feints, and eye for a pass bring the joy back to Brazilian football."),
  p("andre_2026", "André", "Brazil", 2026, "CM", 86, 40, 86, 62,
    "A tireless ball-winner whose energy and pressing from midfield set the tempo for Brazil's new generation."),
  p("vinicius_2026", "Vinícius Jr", "Brazil", 2026, "LW", 94, 95, 62, 22,
    "The Ballon d'Or winner whose explosive dribbling, devastating pace, and big-game goals for Real Madrid make him the most exciting player on the planet.",
    { legend: true, superpower: { name: "Jogo Bonito Reborn", description: "+5 ATK rating" },
      record: { metric: "goals", value: 8, headline: "Vinícius' Samba — The new king of Brazilian football lit up the World Cup!" } }),
  p("rodrygo_2026", "Rodrygo", "Brazil", 2026, "RW", 89, 88, 65, 28,
    "Real Madrid's clutch performer whose Champions League heroics — including a legendary brace against Man City — prove he delivers when it matters most."),
  p("endrick_2026", "Endrick", "Brazil", 2026, "ST", 87, 89, 45, 22,
    "The teenage sensation who became Real Madrid's youngest-ever Champions League scorer. At just 19, Endrick carries Brazil's hopes for a new golden era.",
    { legend: true, superpower: { name: "O Menino", description: "+3 ATK rating" } }),
];

// ============================================================
// COMBINED EXPORT
// ============================================================
export const legends = [
  ...brazil1970,
  ...westGermany1974,
  ...netherlands1974,
  ...argentina1986,
  ...westGermany1990,
  ...brazil1994,
  ...france1998,
  ...brazil2002,
  ...italy2006,
  ...spain2010,
  ...germany2014,
  ...france2018,
  ...croatia2018,
  ...argentina2022,
  ...morocco2022,
  ...england1966,
  ...usa2026,
  ...england2026,
  ...brazil2026,
];

export const formations = {
  "4-3-3": {
    name: "4-3-3",
    slots: ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CM", "LW", "ST", "RW"],
  },
  "5-3-2": {
    name: "5-3-2",
    slots: ["GK", "LB", "CB", "CB", "CB", "RB", "CM", "CM", "CM", "ST", "ST"],
  },
  "4-2-3-1": {
    name: "4-2-3-1",
    slots: ["GK", "LB", "CB", "CB", "RB", "CDM", "CDM", "LW", "CAM", "RW", "ST"],
  },
  "4-4-2": {
    name: "4-4-2",
    slots: ["GK", "LB", "CB", "CB", "RB", "LW", "CM", "CM", "RW", "ST", "ST"],
  },
};

export const playingStyles = [
  {
    id: "attacking",
    name: "All-Out Attack",
    formation: "4-3-3",
    description: "An aggressive 4-3-3 with pacey wingers and a central striker. Width stretches defenses while three midfielders control the tempo.",
  },
  {
    id: "defensive",
    name: "Park the Bus",
    formation: "5-3-2",
    description: "Five at the back with wing-backs providing width. Three center-backs absorb pressure while two strikers hit on the counter.",
  },
  {
    id: "tikitaka",
    name: "Tiki-Taka",
    formation: "4-2-3-1",
    description: "Spain's 2010 blueprint. A double pivot shields the defense while a creative trio and playmaker dominate possession behind a lone striker.",
  },
  {
    id: "balanced",
    name: "The Classic",
    formation: "4-4-2",
    description: "The time-tested 4-4-2. Wingers provide width, a midfield pair controls the center, and a strike partnership leads the line.",
  },
];

export const formationPositions = {
  "4-3-3": [
    { role: "GK", x: 50, y: 90 },
    { role: "LB", x: 15, y: 72 }, { role: "CB", x: 37, y: 75 }, { role: "CB", x: 63, y: 75 }, { role: "RB", x: 85, y: 72 },
    { role: "CM", x: 25, y: 50 }, { role: "CM", x: 50, y: 48 }, { role: "CM", x: 75, y: 50 },
    { role: "LW", x: 18, y: 25 }, { role: "ST", x: 50, y: 22 }, { role: "RW", x: 82, y: 25 },
  ],
  "5-3-2": [
    { role: "GK", x: 50, y: 90 },
    { role: "LB", x: 10, y: 65 }, { role: "CB", x: 30, y: 75 }, { role: "CB", x: 50, y: 77 }, { role: "CB", x: 70, y: 75 }, { role: "RB", x: 90, y: 65 },
    { role: "CM", x: 30, y: 48 }, { role: "CM", x: 50, y: 46 }, { role: "CM", x: 70, y: 48 },
    { role: "ST", x: 38, y: 22 }, { role: "ST", x: 62, y: 22 },
  ],
  "4-2-3-1": [
    { role: "GK", x: 50, y: 90 },
    { role: "LB", x: 15, y: 72 }, { role: "CB", x: 37, y: 75 }, { role: "CB", x: 63, y: 75 }, { role: "RB", x: 85, y: 72 },
    { role: "CDM", x: 38, y: 55 }, { role: "CDM", x: 62, y: 55 },
    { role: "LW", x: 18, y: 32 }, { role: "CAM", x: 50, y: 30 }, { role: "RW", x: 82, y: 32 },
    { role: "ST", x: 50, y: 18 },
  ],
  "4-4-2": [
    { role: "GK", x: 50, y: 90 },
    { role: "LB", x: 15, y: 72 }, { role: "CB", x: 37, y: 75 }, { role: "CB", x: 63, y: 75 }, { role: "RB", x: 85, y: 72 },
    { role: "LW", x: 15, y: 48 }, { role: "CM", x: 38, y: 50 }, { role: "CM", x: 62, y: 50 }, { role: "RW", x: 85, y: 48 },
    { role: "ST", x: 38, y: 22 }, { role: "ST", x: 62, y: 22 },
  ],
};

export const positionLabels = {
  FW: "Forward",
  MID: "Midfielder",
  DEF: "Defender",
  GK: "Goalkeeper",
};

export const roleLabels = {
  GK: "Goalkeeper", LB: "Left Back", CB: "Center Back", RB: "Right Back",
  CDM: "Def. Midfielder", CM: "Central Midfielder", CAM: "Att. Midfielder",
  LW: "Left Wing", RW: "Right Wing", ST: "Striker",
};

export const roleCompatibility = {
  GK: [], LB: ["RB"], CB: ["LB", "RB"], RB: ["LB"],
  CDM: ["CM"], CM: ["CDM", "CAM"], CAM: ["CM", "RW", "LW"],
  LW: ["RW", "ST", "CAM"], RW: ["LW", "ST", "CAM"], ST: ["LW", "RW", "CAM"],
};

export { roleToPosition };

export const countryFlags = {
  "Brazil": "br",
  "West Germany": "de",
  "Germany": "de",
  "Netherlands": "nl",
  "Argentina": "ar",
  "France": "fr",
  "Italy": "it",
  "Spain": "es",
  "Croatia": "hr",
  "Morocco": "ma",
  "England": "gb-eng",
  "USA": "us",
};

export const historicOpponents = [
  { name: "1954 Hungary", attack: 90, midfield: 84, defense: 68, era: "Golden Age" },
  { name: "1958 Sweden", attack: 78, midfield: 76, defense: 80, era: "Nordic Grit" },
  { name: "1966 Portugal", attack: 85, midfield: 80, defense: 72, era: "Eusébio's Fire" },
  { name: "1970 Italy", attack: 82, midfield: 80, defense: 86, era: "Catenaccio" },
  { name: "1978 Argentina", attack: 84, midfield: 82, defense: 76, era: "Host Nation" },
  { name: "1982 Brazil", attack: 92, midfield: 90, defense: 62, era: "Beautiful Losers" },
  { name: "1986 France", attack: 82, midfield: 86, defense: 74, era: "Platini's Magic" },
  { name: "1990 Cameroon", attack: 78, midfield: 72, defense: 76, era: "Milla Time" },
  { name: "1994 Bulgaria", attack: 80, midfield: 78, defense: 72, era: "Stoichkov's Dream" },
  { name: "1998 Croatia", attack: 82, midfield: 84, defense: 76, era: "Šuker's Surprise" },
  { name: "2002 South Korea", attack: 74, midfield: 78, defense: 82, era: "Red Devils" },
  { name: "2006 Portugal", attack: 84, midfield: 86, defense: 78, era: "Figo's Last Dance" },
  { name: "2010 Uruguay", attack: 80, midfield: 78, defense: 84, era: "Forlán's Firepower" },
  { name: "2014 Colombia", attack: 86, midfield: 82, defense: 74, era: "James' Volley" },
  { name: "2018 Belgium", attack: 88, midfield: 86, defense: 78, era: "Golden Generation" },
  { name: "2022 Japan", attack: 78, midfield: 82, defense: 80, era: "Giant Killers" },
];
