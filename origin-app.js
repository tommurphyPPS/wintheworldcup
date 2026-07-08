let selectedState = null;
let opponentState = null;
let availableSquads = [];
let aiAvailableSquads = [];
let currentSquad = null;
let selectedPlayer = null;
let roster = POSITIONS.map(pos => ({ ...pos, player: null }));
let aiRoster = POSITIONS.map(pos => ({ ...pos, player: null }));
let usedPlayerIds = new Set();
let aiUsedPlayerIds = new Set();
let moveFromKey = null;
let series = null;
let lastGameStats = null;
let lastGameResult = null;
let lastTimelineEvents = [];
let isWatching = false;
let challengeOpponent = null;
let draftPickNo = 1;
let selectedCoach = null;
let opponentCoach = null;

const stateScreen = document.getElementById('stateScreen');
const draftScreen = document.getElementById('draftScreen');
const coachScreen = document.getElementById('coachScreen');
const coachTitle = document.getElementById('coachTitle');
const coachOptions = document.getElementById('coachOptions');
const coachStatus = document.getElementById('coachStatus');
const resetBtn = document.getElementById('resetBtn');
const stateTitle = document.getElementById('stateTitle');
const pickCount = document.getElementById('pickCount');
const pickBar = document.getElementById('pickBar');
const squadName = document.getElementById('squadName');
const squadNote = document.getElementById('squadNote');
const choices = document.getElementById('choices');
const rosterEl = document.getElementById('roster');
const oppRosterEl = document.getElementById('oppRoster');
const oppRosterTitle = document.getElementById('oppRosterTitle');
const spinBtn = document.getElementById('spinBtn');
const simulateBtn = document.getElementById('simulateBtn');
const simResult = document.getElementById('simResult');
const aiTitle = document.getElementById('aiTitle');
const aiNote = document.getElementById('aiNote');
const aiChoices = document.getElementById('aiChoices');
const draftLog = document.getElementById('draftLog');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const teamCode = document.getElementById('teamCode');
const challengeStatus = document.getElementById('challengeStatus');
const friendCode = document.getElementById('friendCode');
const friendStatus = document.getElementById('friendStatus');
const startChallengeBtn = document.getElementById('startChallengeBtn');
const turnLabel = document.getElementById('turnLabel');
const oppPickingBadge = document.getElementById('oppPickingBadge');
const draftArena = document.getElementById('draftArena');

const SCORE_PROFILES = [
  [6,4], [8,6], [10,6], [12,8], [12,10], [14,10], [14,12], [16,10], [16,12],
  [18,12], [18,14], [20,12], [20,16], [22,12], [22,18], [24,14], [26,18], [30,12], [32,18], [38,10]
];

const VENUES = ['Suncorp Stadium', 'Accor Stadium', 'Melbourne Cricket Ground'];
function getVenueForGame(gameNo) { return VENUES[(gameNo - 1) % VENUES.length]; }
function homeAdvantageForVenue(venue) {
  if (venue.includes('Suncorp')) return { state: 'QLD', label: 'Queensland home-town advantage at Suncorp Stadium' };
  if (venue.includes('Accor')) return { state: 'NSW', label: 'NSW home-town advantage at Accor Stadium' };
  return { state: null, label: 'Neutral venue: no home-town advantage' };
}
function homeAdvantageEdge(venue) {
  const home = homeAdvantageForVenue(venue);
  if (!home.state) return 0;
  if (home.state === selectedState) return 1.8;
  if (home.state === opponentState) return -1.8;
  return 0;
}
const WEATHER = ['Dry track', 'Heavy rain', 'Hot night', 'Slippery ball'];
const REFS = ['Lets it flow', 'Strict ruck', 'Fast play-the-ball', 'Penalty happy'];

const SLOT_MATCHUPS = {
  FB: 'FB', WG1: 'WG1', CE1: 'CE1', CE2: 'CE2', WG2: 'WG2', FE: 'FE', HB: 'HB',
  PR1: 'PR1', HK: 'HK', PR2: 'PR2', ED1: 'ED1', ED2: 'ED2', LK: 'LK', B1: 'B1', B2: 'B2', B3: 'B3', B4: 'B4'
};

const POSITION_WEIGHTS = {
  FB: { attack: 1.2, defence: 0.8, speed: 1.3, kicking: 0.5, toughness: 0.6, clutch: 0.8, aura: 1.0 },
  WG: { attack: 1.1, defence: 0.7, speed: 1.5, kicking: 0.1, toughness: 0.8, clutch: 0.6, aura: 0.8 },
  CE: { attack: 1.2, defence: 1.0, speed: 1.0, kicking: 0.1, toughness: 1.0, clutch: 0.7, aura: 0.9 },
  FE: { attack: 1.3, defence: 0.6, speed: 0.7, kicking: 1.3, toughness: 0.6, clutch: 1.2, aura: 1.0 },
  HB: { attack: 1.1, defence: 0.5, speed: 0.6, kicking: 1.5, toughness: 0.5, clutch: 1.4, aura: 1.0 },
  PR: { attack: 0.6, defence: 1.2, speed: 0.2, kicking: 0.0, toughness: 1.6, clutch: 0.5, aura: 1.0 },
  HK: { attack: 1.0, defence: 1.1, speed: 0.7, kicking: 0.8, toughness: 1.0, clutch: 1.1, aura: 1.1 },
  ED: { attack: 0.9, defence: 1.2, speed: 0.6, kicking: 0.0, toughness: 1.3, clutch: 0.7, aura: 1.0 },
  LK: { attack: 0.9, defence: 1.4, speed: 0.4, kicking: 0.3, toughness: 1.3, clutch: 0.8, aura: 1.0 },
  B:  { attack: 0.8, defence: 0.9, speed: 0.5, kicking: 0.3, toughness: 1.1, clutch: 0.7, aura: 0.8 }
};

const SIGNATURES = {
  // Rare boosts only. These are not passive rating boosts; they trigger only in the right match context.
  'Wally Lewis': { name: 'The King', tier: 'legendary', chance: 0.09, edge: 2.6, text: 'lifts Queensland when the match tightens' },
  'Cameron Smith': { name: 'Calm Resolve', tier: 'legendary', chance: 0.10, edge: 2.4, text: 'slows the tempo and settles the side' },
  'Johnathan Thurston': { name: 'Ice in the Veins', tier: 'legendary', chance: 0.09, edge: 2.5, text: 'owns late-game kicking pressure' },
  'Andrew Johns': { name: 'Mastermind', tier: 'legendary', chance: 0.09, edge: 2.5, text: 'finds a tactical weakness and controls field position' },
  'Darren Lockyer': { name: 'Big Game Captain', tier: 'legendary', chance: 0.08, edge: 2.2, text: 'keeps everyone composed under pressure' },
  'Billy Slater': { name: 'Support Runner', tier: 'legendary', chance: 0.08, edge: 2.1, text: 'appears on the inside when a break opens up' },
  'Greg Inglis': { name: 'Beast Mode', tier: 'legendary', chance: 0.08, edge: 2.2, text: 'takes over a one-on-one edge battle' },
  'Brad Fittler': { name: 'Freddy Flow', tier: 'legendary', chance: 0.08, edge: 2.0, text: 'opens the match with instinctive running' },
  'Cooper Cronk': { name: 'Game Manager', tier: 'legendary', chance: 0.07, edge: 1.9, text: 'turns pressure into repeat sets and territory' },
  'Allan Langer': { name: 'Never Beaten', tier: 'legendary', chance: 0.08, edge: 2.0, text: 'creates chaos when the game looks lost' },
  'Mal Meninga': { name: 'Power Centre', tier: 'legendary', chance: 0.07, edge: 1.9, text: 'wins the collision on the edge' },
  'Arthur Beetson': { name: 'First Captain', tier: 'legendary', chance: 0.07, edge: 1.9, text: 'sets the tone through the middle' },
  'Glenn Lazarus': { name: 'Brick Wall', tier: 'legendary', chance: 0.07, edge: 1.8, text: 'shuts down the middle third' },
  'Shane Webcke': { name: 'Middle Enforcer', tier: 'legendary', chance: 0.07, edge: 1.8, text: 'changes the collision speed' },
  'Danny Buderus': { name: 'Sharp Service', tier: 'legendary', chance: 0.07, edge: 1.7, text: 'quickens the ruck at the right time' },
  'Paul Gallen': { name: 'Competitive Beast', tier: 'legendary', chance: 0.08, edge: 1.8, text: 'drags the pack forward after pressure' },
  'Dane Gagai': { name: 'Origin Specialist', tier: 'hero', chance: 0.12, edge: 1.7, text: 'finds his Origin gear in a big moment' },
  'Harry Grant': { name: 'Spark Plug', tier: 'hero', chance: 0.14, edge: 1.8, benchOnly: true, text: 'changes the tempo from dummy-half off the bench' },
  'Ben Hunt': { name: 'Redemption Moment', tier: 'hero', chance: 0.10, edge: 1.4, text: 'settles after pressure and makes the next play count' },
  'Michael Morgan': { name: 'Utility Hero', tier: 'hero', chance: 0.10, edge: 1.5, text: 'solves a backline problem in a clutch moment' },
  'Matt Gillett': { name: 'Quiet Hero', tier: 'hero', chance: 0.10, edge: 1.4, text: 'does the hidden work that turns a set' },
  'Brett Morris': { name: 'Big Game Finisher', tier: 'hero', chance: 0.10, edge: 1.4, text: 'turns a half chance into points' },
  'Josh Addo-Carr': { name: 'Flying Foxx', tier: 'hero', chance: 0.10, edge: 1.4, text: 'burns the defence when the game opens up' },
  'Steve Renouf': { name: 'The Pearl', tier: 'hero', chance: 0.10, edge: 1.5, text: 'slices through broken defensive shape' },
  'Brett Kenny': { name: 'Silky Runner', tier: 'hero', chance: 0.09, edge: 1.4, text: 'glides through a tired defensive line' },
  'Trevor Gillmeister': { name: 'Axe Defence', tier: 'hero', chance: 0.10, edge: 1.5, text: 'lands a momentum-shifting defensive shot' }
};

const SERIES_TRAITS = {
  competitive: ['Greg Inglis','Wally Lewis','Paul Gallen','Cameron Smith','Gorden Tallis','Mal Meninga','Trevor Gillmeister','Dane Gagai','Steve Roach','Payne Haas'],
  calm: ['Johnathan Thurston','Nathan Cleary','Andrew Johns','Darren Lockyer','Cameron Smith','Cooper Cronk','Wally Lewis','Daly Cherry-Evans'],
  decider: ['Wally Lewis','Johnathan Thurston','Andrew Johns','Billy Slater','Cameron Smith','Brad Fittler','Darren Lockyer','Nathan Cleary','Mal Meninga','Laurie Daley'],
  emotional: ['Gorden Tallis','Paul Gallen','Steve Roach','Mark Geyer','Corey Horsburgh']
};

const CHEMISTRY_COMBOS = [
  { names: ['Cameron Smith','Cooper Cronk','Billy Slater'], label: 'Storm spine', bonus: 8, stats: ['attack','clutch'] },
  { names: ['Cameron Smith','Johnathan Thurston','Billy Slater'], label: 'Maroons dynasty spine', bonus: 8, stats: ['attack','aura'] },
  { names: ['Darren Lockyer','Johnathan Thurston'], label: 'Lockyer + Thurston', bonus: 5, stats: ['kicking','clutch'] },
  { names: ['Wally Lewis','Mal Meninga'], label: 'The King and Big Mal', bonus: 5, stats: ['aura','attack'] },
  { names: ['Nathan Cleary','Isaah Yeo'], label: 'Panthers control', bonus: 5, stats: ['kicking','defence'] },
  { names: ['Andrew Johns','Danny Buderus'], label: 'Knights ruck control', bonus: 5, stats: ['attack','clutch'] },
  { names: ['Brad Fittler','Andrew Johns'], label: 'Freddy + Joey', bonus: 6, stats: ['attack','kicking'] },
  { names: ['James Tedesco','Tom Trbojevic','Latrell Mitchell'], label: 'Modern Blues strike', bonus: 7, stats: ['attack','speed'] },
  { names: ['Paul Gallen','Boyd Cordner'], label: 'Blues grit', bonus: 4, stats: ['toughness','defence'] },
  { names: ['Cameron Munster','Harry Grant'], label: 'Modern Maroons deception', bonus: 5, stats: ['attack','speed'] }
];


const COACHES = {
  QLD: [
    { id:'bennett', name:'Wayne Bennett', style:'Calm under pressure', desc:'Defence, composure and late-game error control.', boosts:{defence:1.2, clutch:1.1}, edge:1.25, power:'Calm Box', chance:0.12, powerText:'Bennett slows the game down and steadies the defensive line.' },
    { id:'meninga-coach', name:'Mal Meninga', style:'Dynasty builder', desc:'Chemistry, leadership and Game 3 composure.', boosts:{aura:1.3, clutch:0.9}, edge:1.15, deciderEdge:1.2, power:'Dynasty Mentality', chance:0.11, powerText:'Meninga has this side looking like they have been here before.' },
    { id:'slater-coach', name:'Billy Slater', style:'Modern speed and support', desc:'Fullback, edges, kick returns and support-play tries.', boosts:{speed:1.4, attack:0.8}, edge:1.1, power:'Support Sweep', chance:0.12, powerText:'Slater has the support runners flooding through the middle.' },
    { id:'walters', name:'Kevin Walters', style:'Emotional lift', desc:'Momentum swings after tries, big tackles and crowd moments.', boosts:{aura:1.0, toughness:0.8}, edge:1.05, momentum:8, power:'Maroons Lift', chance:0.13, powerText:'Walters gets an emotional lift out of the Maroons.' }
  ],
  NSW: [
    { id:'gould', name:'Phil Gould', style:'Defensive system', desc:'Line speed, discipline and Game 2 response.', boosts:{defence:1.4, toughness:0.6}, edge:1.2, power:'Blue Wall', chance:0.12, powerText:'Gould has the defensive system squeezing the ruck.' },
    { id:'stuart', name:'Ricky Stuart', style:'Aggressive edge', desc:'Intensity, physicality and early-match pressure.', boosts:{toughness:1.3, defence:0.6}, edge:1.1, momentum:7, power:'Opening Ambush', chance:0.12, powerText:'Stuart has the Blues flying into the opening collisions.' },
    { id:'fittler-coach', name:'Brad Fittler', style:'Attacking freedom', desc:'Offloads, broken-play attack and outside backs.', boosts:{attack:1.2, speed:0.9}, edge:1.1, power:'Freddy Ball', chance:0.12, powerText:'Fittler gives the outside backs licence to play what they see.' },
    { id:'daley', name:'Laurie Daley', style:'Balanced Origin control', desc:'Kicking, composure and halves control.', boosts:{kicking:1.2, clutch:0.8}, edge:1.05, power:'Controlled Set', chance:0.11, powerText:'Daley keeps the halves patient and the kicking game tidy.' }
  ]
};

function showCoachSelection() {
  if (!coachScreen || !coachOptions) return beginDraft();
  coachTitle.textContent = `Choose your ${DATA[selectedState].name} coach`;
  coachStatus.textContent = 'Pick one coach. The opposition will secretly choose a coach too.';
  coachOptions.innerHTML = '';
  COACHES[selectedState].forEach(coach => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'coach-card';
    btn.innerHTML = `<h3>${coach.name}</h3><p><strong>${coach.style}</strong></p><p>${coach.desc}</p><span>${coach.power}: rare match power-up</span>`;
    btn.addEventListener('click', () => selectCoach(coach.id));
    coachOptions.appendChild(btn);
  });
  stateScreen.classList.add('hidden');
  coachScreen.classList.remove('hidden');
  draftScreen.classList.add('hidden');
  resetBtn.classList.remove('hidden');
}

function selectCoach(coachId) {
  selectedCoach = COACHES[selectedState].find(c => c.id === coachId) || COACHES[selectedState][0];
  opponentCoach = pick(COACHES[opponentState]);
  beginDraft();
}

function beginDraft() {
  if (coachScreen) coachScreen.classList.add('hidden');
  stateScreen.classList.add('hidden');
  draftScreen.classList.remove('hidden');
  resetBtn.classList.remove('hidden');
  renderRoster();
  renderOppRoster();
  updateProgress();
  if (selectedCoach) {
    squadName.textContent = `${selectedCoach.name} appointed`;
    squadNote.textContent = `${selectedCoach.style}. Opposition coach: ${opponentCoach ? opponentCoach.name : 'unknown'}. Spin once to start the draft.`;
  }
}

function coachFor(team) {
  return team === 'user' ? selectedCoach : opponentCoach;
}

function coachStatBonus(team, stat) {
  const c = coachFor(team);
  return c && c.boosts && c.boosts[stat] ? c.boosts[stat] : 0;
}

function coachMatchEdge(gameNo) {
  const user = selectedCoach || { edge:0 };
  const opp = opponentCoach || { edge:0 };
  let userEdge = user.edge || 0;
  let oppEdge = opp.edge || 0;
  const notes = [];
  if (gameNo === 3) {
    userEdge += user.deciderEdge || 0;
    oppEdge += opp.deciderEdge || 0;
  }
  if (selectedCoach) notes.push(`${DATA[selectedState].name} coach: ${selectedCoach.name} — ${selectedCoach.style}`);
  if (opponentCoach) notes.push(`${DATA[opponentState].name} coach: ${opponentCoach.name} — ${opponentCoach.style}`);
  return { userEdge, oppEdge, notes };
}

function planCoachPowerEvents(gameNo) {
  const events = [];
  [['user', selectedCoach], ['opp', opponentCoach]].forEach(([team, coach]) => {
    if (!coach) return;
    let chance = coach.chance || 0.1;
    if (gameNo === 3 && coach.deciderEdge) chance += 0.04;
    if (Math.random() < chance) {
      const minute = randBetween(18, 72);
      events.push({ minute, team, kind:'coach', userPoints:0, oppPoints:0, momentum: team === 'user' ? (coach.momentum || 7) : -(coach.momentum || 7), text:`Coach power: ${coach.name} — ${coach.power}. ${coach.powerText}`, coachName: coach.name });
    }
  });
  return events;
}

function renderCoachSummary() {
  if (!selectedCoach && !opponentCoach) return '';
  const c1 = selectedCoach ? `<p><strong>${DATA[selectedState].name} coach:</strong> ${selectedCoach.name} — ${selectedCoach.style}. <em>${selectedCoach.power}</em></p>` : '';
  const c2 = opponentCoach ? `<p><strong>${DATA[opponentState].name} coach:</strong> ${opponentCoach.name} — ${opponentCoach.style}. <em>${opponentCoach.power}</em></p>` : '';
  return `<div class="coach-summary">${c1}${c2}</div>`;
}

document.querySelectorAll('.state-btn').forEach(btn => btn.addEventListener('click', () => chooseState(btn.dataset.state)));
spinBtn.addEventListener('click', spinSquad);
resetBtn.addEventListener('click', resetGame);
simulateBtn.addEventListener('click', showSeriesSetup);
exportBtn.addEventListener('click', () => exportTeam());
importBtn.addEventListener('click', () => importOpponent());
if (startChallengeBtn) startChallengeBtn.addEventListener('click', () => startFriendChallenge());

function chooseState(state) {
  selectedState = state;
  opponentState = state === 'QLD' ? 'NSW' : 'QLD';
  availableSquads = [...DATA[state].squads];
  aiAvailableSquads = [...DATA[opponentState].squads];
  document.documentElement.style.setProperty('--gold', state === 'QLD' ? '#f3c15c' : '#8fd1ff');
  document.documentElement.style.setProperty('--userStateColor', DATA[state].colour);
  document.documentElement.style.setProperty('--oppStateColor', DATA[opponentState].colour);
  stateTitle.textContent = `${DATA[state].name} vs ${DATA[opponentState].name}`;
  oppRosterTitle.textContent = `${DATA[opponentState].name} 17`;
  showCoachSelection();
}

function spinSquad() {
  if (isWatching) return;
  if (selectedPlayer || currentSquad) {
    alert('You only get one spin. Pick from the squad on screen and place that player.');
    return;
  }
  if (rosterFull()) return;
  const eligible = availableSquads
    .map((squad, index) => ({ squad, index, options: squad.players.filter(pl => !usedPlayerIds.has(pl.id) && legalSlots(pl, roster).length) }))
    .filter(item => item.options.length);
  if (!eligible.length) {
    squadName.textContent = 'No legal squads left';
    squadNote.textContent = 'No remaining squad has a legal player for your open slots. Reset to draft again.';
    choices.innerHTML = '';
    spinBtn.disabled = true;
    return;
  }
  const selected = pick(eligible);
  currentSquad = selected.squad;
  availableSquads.splice(selected.index, 1);
  selectedPlayer = null;
  moveFromKey = null;
  spinBtn.disabled = true;
  draftArena.classList.remove('active-opp-turn');
  draftArena.classList.add('active-user-turn');
  turnLabel.textContent = `Pick ${draftPickNo}: your turn`;
  squadName.textContent = currentSquad.name;
  squadNote.textContent = `${DATA[selectedState].name} only. No respin. Tap a player, then tap a legal empty position in your 17.`;
  renderChoices();
  renderRoster();
}

function renderChoices() {
  choices.innerHTML = '';
  const availablePlayers = currentSquad.players.filter(pl => !usedPlayerIds.has(pl.id));
  if (!availablePlayers.length) {
    choices.innerHTML = '<p class="muted">No legal player from this squad fits your open slots.</p>';
    return;
  }
  availablePlayers.forEach(player => {
    const legalCount = legalSlots(player, roster).length;
    const card = playerCard(player, legalCount, selectedPlayer && selectedPlayer.id === player.id);
    card.disabled = legalCount === 0;
    card.addEventListener('click', () => selectPlayer(player));
    choices.appendChild(card);
  });
}

function playerCard(player, legalCount, selected = false, picked = false) {
  const sig = SIGNATURES[player.name];
  const card = document.createElement('button');
  card.type = 'button';
  card.className = `player-card choice-button ${selected ? 'selected' : ''} ${picked ? 'ai-picked' : ''}`;
  const posTags = player.positions.map(pos => {
    const rating = positionRating(player, pos);
    const primary = isPrimaryPosition(player, pos);
    const drop = player.rating - rating;
    const label = primary ? `${pos} ${rating}` : `${pos} ${rating} (-${drop})`;
    return `<span class="tag ${primary ? 'primary-pos' : 'secondary-pos'}">${label}</span>`;
  }).join('');
  card.innerHTML = `
    <div>
      <h3>${player.name}</h3>
      <p class="muted">${player.note}</p>
      <div class="tags">${posTags}${sig ? `<span class="tag trait">${sig.name}</span>` : ''}</div>
      <small class="slot-hint">${legalCount !== null ? (legalCount ? `${legalCount} legal open slot${legalCount === 1 ? '' : 's'} — yellow tags show ability drop` : 'No legal open slots') : 'AI option'}</small>
    </div>
    <div class="rating">${player.rating}</div>
  `;
  return card;
}

function selectPlayer(player) {
  const openSlots = legalSlots(player, roster);
  if (!openSlots.length) {
    alert(`${player.name} does not fit any open legal slot.`);
    return;
  }
  selectedPlayer = player;
  moveFromKey = null;
  squadNote.textContent = `${player.name} selected. Only legal positions are highlighted. Yellow secondary slots are valid but reduce his rating.`;
  renderChoices();
  renderRoster();
}

function placeSelectedPlayer(slotKey) {
  if (!selectedPlayer) return;
  const rosterSlot = roster.find(s => s.key === slotKey);
  if (!rosterSlot || rosterSlot.player) return;
  if (!canPlay(selectedPlayer, rosterSlot)) {
    alert(`${selectedPlayer.name} cannot play ${rosterSlot.label}. Pick a highlighted slot.`);
    return;
  }
  rosterSlot.player = selectedPlayer;
  usedPlayerIds.add(selectedPlayer.id);
  addDraftLog(`Pick ${draftPickNo}: You took ${selectedPlayer.name} from ${currentSquad.name} at ${rosterSlot.key} (${candidateSlotLabel(selectedPlayer, rosterSlot)}).`);
  selectedPlayer = null;
  currentSquad = null;
  renderRoster();
  updateProgress();
  if (challengeOpponent) {
    draftPickNo += 1;
    choices.innerHTML = `<p class="muted">Player drafted. Your friend's 17 is already loaded as the opposition.</p>`;
    setTimeout(turnBackToUser, 350);
    return;
  }
  choices.innerHTML = '<p class="muted">Player drafted. The same draft screen now flips to the opposition pick.</p>';
  draftArena.classList.remove('active-user-turn');
  draftArena.classList.add('active-opp-turn');
  squadName.textContent = 'Opposition pick coming';
  squadNote.textContent = 'Opposition will spin on this same screen, view the squad options, then choose their player.';
  setTimeout(runAiDraftPick, 500);
}

function runAiDraftPick() {
  oppPickingBadge && oppPickingBadge.classList.remove('hidden');
  draftArena.classList.remove('active-user-turn');
  draftArena.classList.add('active-opp-turn');
  spinBtn.disabled = true;
  turnLabel.textContent = `${DATA[opponentState].name} turn`;
  squadName.textContent = 'Opposition spinning...';
  squadNote.textContent = 'Opposition picking their player on this same screen. You can see every option they were offered.';
  choices.innerHTML = '<p class="muted">Opposition spinning...</p>';

  if (aiRosterFull() || challengeOpponent) {
    draftPickNo += 1;
    turnBackToUser();
    return;
  }

  const eligible = aiAvailableSquads
    .map((squad, index) => ({ squad, index, options: squad.players.filter(pl => !aiUsedPlayerIds.has(pl.id) && legalSlots(pl, aiRoster).length) }))
    .filter(item => item.options.length);

  if (!eligible.length) {
    oppPickingBadge && oppPickingBadge.classList.add('hidden');
    squadName.textContent = 'Opposition has no legal squads left';
    squadNote.textContent = 'No remaining opposition squad has a legal player for its open slots.';
    return;
  }

  const selected = pick(eligible);
  const squad = selected.squad;
  aiAvailableSquads.splice(selected.index, 1);
  const options = squad.players.filter(pl => !aiUsedPlayerIds.has(pl.id));

  setTimeout(() => {
    squadName.textContent = `${DATA[opponentState].name} spin: ${squad.name}`;
    squadNote.textContent = 'Opposition sees this full team, weighs ratings, needs, chemistry and traits, then makes one pick.';
    choices.innerHTML = '';
    options.forEach(player => choices.appendChild(playerCard(player, legalSlots(player, aiRoster).length, false, false)));

    const aiPick = chooseAiPlayer(options);
    setTimeout(() => {
      choices.innerHTML = '';
      options.forEach(player => choices.appendChild(playerCard(player, legalSlots(player, aiRoster).length, false, player.id === aiPick.player.id)));
      aiRoster.find(s => s.key === aiPick.slot.key).player = aiPick.player;
      aiUsedPlayerIds.add(aiPick.player.id);
      squadNote.textContent = `${DATA[opponentState].name} selected ${aiPick.player.name} at ${aiPick.slot.label}. Reason: ${aiPick.reason}`;
      addDraftLog(`Pick ${draftPickNo}: ${DATA[opponentState].name} took ${aiPick.player.name} from ${squad.name} at ${aiPick.slot.key} (${candidateSlotLabel(aiPick.player, aiPick.slot)}).`);
      renderOppRoster();
      oppPickingBadge && oppPickingBadge.classList.add('hidden');
      draftPickNo += 1;
      updateProgress();
      setTimeout(turnBackToUser, 1100);
    }, 1100);
  }, 650);
}

function chooseAiPlayer(options) {
  const names = aiRoster.map(s => s.player && s.player.name).filter(Boolean);
  const openStarting = aiRoster.filter(s => !s.key.startsWith('B') && !s.player);
  const openBench = aiRoster.filter(s => s.key.startsWith('B') && !s.player);
  const scored = [];
  options.forEach(player => {
    const slots = legalSlots(player, aiRoster);
    if (!slots.length) return;
    const bestPlayableScore = Math.max(...slots.map(slot => weightedPlayerScore(player, slotType(slot.key))));
    slots.forEach(slot => {
      const type = slotType(slot.key);
      let score = weightedPlayerScore(player, type);
      const starPower = bestPlayableScore - 88;

      // Traits and chemistry make elite or historically useful Origin players worth stockpiling.
      if (SIGNATURES[player.name]) score += SIGNATURES[player.name].tier === 'legendary' ? 3.5 : 1.8;
      CHEMISTRY_COMBOS.forEach(c => {
        if (c.names.includes(player.name) && c.names.some(n => names.includes(n))) score += c.bonus;
      });

      // Fill vital open starting positions, but do not ignore a superstar who is slightly out of role.
      if (criticalNeed(slot.key, aiRoster)) score += 8;
      if (!slot.key.startsWith('B') && openStarting.length <= 5) score += 2;

      // Bench is no longer a dumping ground: if the player is clearly better than what is on the field,
      // draft him and let the final shuffle push him into the starting 13 later.
      if (slot.key.startsWith('B')) {
        const benchPenalty = starPower >= 8 ? 0.5 : 3.5;
        score -= benchPenalty;
        if (canUpgradeStarter(player, aiRoster)) score += 5;
        if (openStarting.length === 0 && openBench.length) score += 2;
      }

      // A secondary-position superstar can still be better than an average primary-position fit.
      const drop = positionDrop(player, slot);
      if (drop > 0 && weightedPlayerScore(player, type) >= 93) score += 1.5;
      scored.push({ player, slot, score });
    });
  });
  if (!scored.length) {
    const fallback = options[0];
    return { player: fallback, slot: aiRoster.find(s => !s.player), reason: 'only available legal fit' };
  }
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, Math.min(4, scored.length));
  const chosen = Math.random() < 0.82 ? top[0] : pick(top);
  let reason = criticalNeed(chosen.slot.key, aiRoster) ? `needed a ${chosen.slot.label}` : `best squad value at ${chosen.slot.label}`;
  if (chosen.slot.key.startsWith('B')) reason = 'stockpiled an elite player for the bench shuffle';
  if (SIGNATURES[chosen.player.name]) reason += ` with ${SIGNATURES[chosen.player.name].name}`;
  const drop = positionDrop(chosen.player, chosen.slot);
  if (drop > 0) reason += ` despite a -${drop} secondary-position drop because the effective rating was still higher`;
  return { ...chosen, reason };
}

function canUpgradeStarter(player, targetRoster) {
  return targetRoster.some(slot => {
    if (slot.key.startsWith('B') || !slot.player || !canPlay(player, slot)) return false;
    return weightedPlayerScore(player, slotType(slot.key)) > weightedPlayerScore(slot.player, slotType(slot.key)) + 2.5;
  });
}

function turnBackToUser() {
  currentSquad = null;
  draftArena.classList.remove('active-opp-turn');
  draftArena.classList.add('active-user-turn');
  spinBtn.disabled = rosterFull() || Boolean(currentSquad);
  oppPickingBadge && oppPickingBadge.classList.add('hidden');
  if (rosterFull()) {
    spinBtn.disabled = true;
    squadName.textContent = 'Draft complete';
    squadNote.textContent = 'Your 17 is ready. Reorder your side, export it, import a challenge, or start the series.';
    choices.innerHTML = '<p class="muted">Draft complete.</p>';
    turnLabel.textContent = 'Draft complete';
    return;
  }
  turnLabel.textContent = `Pick ${draftPickNo}: your turn`;
  squadName.textContent = 'Ready for next spin';
  squadNote.textContent = 'Your turn on the same draft screen. Spin once and pick from the squad you get.';
  choices.innerHTML = '<p class="muted">Your turn. Spin once and pick from the squad you get.</p>';
}

function addDraftLog(text) {
  const div = document.createElement('div');
  div.textContent = text;
  draftLog.prepend(div);
}

function legalSlots(player, targetRoster) {
  return targetRoster.filter(slot => !slot.player && canPlay(player, slot));
}

function canPlay(player, slot) {
  if (!player || !slot) return false;
  if (slot.key.startsWith('B')) return true;
  if (slot.key.startsWith('WG')) return player.positions.includes('WG');
  if (slot.key.startsWith('CE')) return player.positions.includes('CE');
  if (slot.key.startsWith('PR')) return player.positions.includes('PR');
  if (slot.key.startsWith('ED')) return player.positions.includes('ED');
  if (slot.key === 'FE') return player.positions.includes('FE');
  if (slot.key === 'HB') return player.positions.includes('HB');
  if (slot.key === 'FB') return player.positions.includes('FB');
  if (slot.key === 'HK') return player.positions.includes('HK');
  if (slot.key === 'LK') return player.positions.includes('LK');
  return false;
}

function positionRating(player, posOrSlot) {
  if (!player) return 0;
  const type = typeof posOrSlot === 'string' ? slotType(posOrSlot) : slotType(posOrSlot.key);
  if (type === 'B') return player.rating;
  return player.positionRatings && player.positionRatings[type] != null ? player.positionRatings[type] : player.rating;
}

function isPrimaryPosition(player, posOrSlot) {
  if (!player) return false;
  const type = typeof posOrSlot === 'string' ? slotType(posOrSlot) : slotType(posOrSlot.key);
  if (type === 'B') return true;
  return positionRating(player, type) >= player.rating;
}

function positionDrop(player, slot) {
  if (!player || !slot || slot.key.startsWith('B')) return 0;
  return Math.max(0, player.rating - positionRating(player, slot));
}

function slotRatingLabel(player, slot) {
  const rating = positionRating(player, slot);
  const drop = positionDrop(player, slot);
  return drop > 0 ? `${rating} <span class="pos-drop">-${drop}</span>` : `${rating}`;
}

function candidateSlotLabel(player, slot) {
  if (!player) return '';
  const rating = positionRating(player, slot);
  const drop = positionDrop(player, slot);
  return drop > 0 ? `${rating} ⚠ -${drop}` : `${rating}`;
}

function swapCandidateLabel(fromKey, targetSlot) {
  const from = roster.find(s => s.key === fromKey);
  return from && from.player ? candidateSlotLabel(from.player, targetSlot) : '+';
}

function legalSlotSummary(player, targetRoster) {
  return legalSlots(player, targetRoster).map(slot => `${slot.key}: ${candidateSlotLabel(player, slot)}`).join(' • ');
}

function renderRoster() {
  rosterEl.innerHTML = '';
  roster.forEach(slot => rosterEl.appendChild(slotButton(slot, true)));
}

function renderOppRoster() {
  oppRosterEl.innerHTML = '';
  aiRoster.forEach(slot => {
    const row = document.createElement('div');
    row.className = `slot ${slot.player ? 'filled' : ''}`;
    row.innerHTML = `
      <div class="slot-pos">${slot.key}</div>
      <div>${slot.player ? `<strong>${slot.player.name}</strong><br><small>${slot.label}</small>` : `<span class="muted">${slot.label}</span>`}</div>
      <div>${slot.player ? slotRatingLabel(slot.player, slot) : ''}</div>
    `;
    oppRosterEl.appendChild(row);
  });
}

function slotButton(slot) {
  const legalForSelected = selectedPlayer && !slot.player && canPlay(selectedPlayer, slot);
  const movingFrom = moveFromKey === slot.key;
  const legalMoveTarget = moveFromKey && moveFromKey !== slot.key && canSwap(moveFromKey, slot.key);
  const row = document.createElement('button');
  row.type = 'button';
  row.className = `slot ${slot.player ? 'filled' : ''} ${legalForSelected || legalMoveTarget ? 'legal' : ''} ${movingFrom ? 'selected-slot' : ''}`;
  row.disabled = isWatching || (!selectedPlayer && !slot.player && !moveFromKey) || Boolean(selectedPlayer && slot.player);
  row.innerHTML = `
    <div class="slot-pos">${slot.key}</div>
    <div>${slot.player ? `<strong>${slot.player.name}</strong><br><small>${slot.label}</small>` : `<span class="muted">${slot.label}</span>`}</div>
    <div>${slot.player ? slotRatingLabel(slot.player, slot) : legalForSelected ? candidateSlotLabel(selectedPlayer, slot) : legalMoveTarget ? swapCandidateLabel(moveFromKey, slot) : ''}</div>
  `;
  row.addEventListener('click', () => handleSlotClick(slot.key));
  return row;
}

function handleSlotClick(slotKey) {
  if (isWatching) return;
  const slot = roster.find(s => s.key === slotKey);
  if (selectedPlayer) {
    placeSelectedPlayer(slotKey);
    return;
  }
  if (!slot) return;
  if (!moveFromKey) {
    if (!slot.player) return;
    moveFromKey = slotKey;
    squadNote.textContent = `${slot.player.name} selected for reorder. Tap a bench or legal slot to swap.`;
    renderRoster();
    return;
  }
  if (moveFromKey === slotKey) {
    moveFromKey = null;
    squadNote.textContent = 'Reorder cancelled.';
    renderRoster();
    return;
  }
  if (canSwap(moveFromKey, slotKey)) {
    swapSlots(moveFromKey, slotKey);
    moveFromKey = null;
    squadNote.textContent = 'Team reordered. Matchup advantages updated.';
    renderRoster();
    if (series) showSeriesSetup(false);
  } else {
    alert('That swap is not legal for the two positions. Bench slots can hold anyone.');
  }
}

function canSwap(fromKey, toKey) {
  const from = roster.find(s => s.key === fromKey);
  const to = roster.find(s => s.key === toKey);
  if (!from || !to || !from.player) return false;
  if (to.player) return canPlay(from.player, to) && canPlay(to.player, from);
  return canPlay(from.player, to);
}

function swapSlots(fromKey, toKey) {
  const from = roster.find(s => s.key === fromKey);
  const to = roster.find(s => s.key === toKey);
  const tmp = to.player;
  to.player = from.player;
  from.player = tmp || null;
}

function updateProgress() {
  const picked = roster.filter(s => s.player).length;
  pickCount.textContent = `${picked}/17`;
  pickBar.style.width = `${picked / 17 * 100}%`;
  const ready = picked === 17 && (aiRosterFull() || challengeOpponent);
  simulateBtn.disabled = !ready;
  simulateBtn.textContent = ready ? 'Review matchups / set team order' : 'Draft both 17s first';
  exportBtn.disabled = picked < 17;
}

function rosterFull() { return roster.every(s => s.player); }
function aiRosterFull() { return aiRoster.every(s => s.player); }
function criticalNeed(key, targetRoster) {
  const slot = targetRoster.find(s => s.key === key);
  if (!slot || slot.player) return false;
  return ['FB','FE','HB','HK','PR1','PR2'].includes(key);
}

function optimiseOpponentLineup() {
  if (challengeOpponent) return;
  // Final coach shuffle: the opposition now treats all 17 players as a squad.
  // It repeatedly promotes bench stars if their effective out-of-position rating beats a starter,
  // then optimises matchup edge against your selected 13.
  let improved = true;
  let attempts = 0;
  const shuffleNotes = [];
  while (improved && attempts < 16) {
    improved = false;
    attempts += 1;
    let best = null;
    const base = opponentOptimiseScore(aiRoster);
    aiRoster.forEach((benchSlot, bi) => {
      if (!benchSlot.key.startsWith('B') || !benchSlot.player) return;
      aiRoster.forEach((startSlot, si) => {
        if (startSlot.key.startsWith('B') || !startSlot.player) return;
        if (!canPlay(benchSlot.player, startSlot) || !canPlay(startSlot.player, benchSlot)) return;
        const trial = cloneRoster(aiRoster);
        const tmp = trial[si].player;
        trial[si].player = trial[bi].player;
        trial[bi].player = tmp;
        let score = opponentOptimiseScore(trial);
        const oldStarterScore = weightedPlayerScore(startSlot.player, slotType(startSlot.key));
        const newStarterScore = weightedPlayerScore(benchSlot.player, slotType(startSlot.key));
        const upgrade = newStarterScore - oldStarterScore;
        if (upgrade > 0) score += upgrade * 0.8;
        if (score > base + 0.45 && (!best || score > best.score)) best = { bi, si, score, upgrade };
      });
    });
    if (best) {
      const start = aiRoster[best.si];
      const bench = aiRoster[best.bi];
      shuffleNotes.push(`${bench.player.name} promoted to ${start.key}${best.upgrade > 0 ? ` (+${best.upgrade.toFixed(1)} effective)` : ''}`);
      const tmp = start.player;
      start.player = bench.player;
      bench.player = tmp;
      improved = true;
    }
  }
  if (shuffleNotes.length) {
    addDraftLog(`Opposition final shuffle: ${shuffleNotes.slice(0, 3).join('; ')}${shuffleNotes.length > 3 ? '...' : ''}`);
    squadNote.textContent = `${DATA[opponentState].name} completed a final shuffle to get its highest-value players into the starting 13.`;
  }
  renderOppRoster();
}

function opponentOptimiseScore(testRoster) {
  const rating = getTeamRating(testRoster).total;
  const matchup = calculateMatchupReport(roster, testRoster);
  return rating - matchup.edge * 0.65;
}

function showSeriesSetup(resetSeries = true) {
  if (!rosterFull()) return;
  if (resetSeries || !series) series = { game: 1, userWins: 0, oppWins: 0, results: [], playerPoints: {} };
  optimiseOpponentLineup();
  selectedPlayer = null;
  moveFromKey = null;
  showMode('prematch');
  renderRoster();
  const opp = getActiveOpponentRoster();
  const matchup = calculateMatchupReport(roster, opp);
  const userRating = getTeamRating(roster);
  const oppRating = getTeamRating(opp);
  const attr = attributeComparison(roster, opp);
  simResult.innerHTML = `
    <div class="pre-match-card">
      <div class="pre-match-head">
        <div>
          <p class="eyebrow">Game ${series.game} pre-game analysis</p>
          <h3>${DATA[selectedState].name} vs ${DATA[opponentState].name}</h3>
          <p class="muted">Starting 13 only counts toward team overall. The rows below are locked one-to-one so FB faces FB, HB faces HB, and each edge is easy to compare. Swap your bench before kick-off to repair weak matchups.</p>
        </div>
        <button class="primary play-now" onclick="playNextGame()">Play Game ${series.game}</button>
      </div>
      <div class="rating-grid">
        <div><strong>Your series score</strong><span>${series.userWins}</span></div>
        <div><strong>Opposition series score</strong><span>${series.oppWins}</span></div>
        <div><strong>Your starting 13</strong><span>${userRating.total}</span></div>
        <div><strong>Opp starting 13</strong><span>${oppRating.total}</span></div>
        <div><strong>Matchup edge</strong><span>${matchup.edge > 0 ? '+' : ''}${matchup.edge}</span></div>
      </div>
      ${renderCoachSummary()}
      <div class="compare-grid compact-compare">
        <div class="compare-side user-compare">
          <h4>${DATA[selectedState].name} strengths</h4>
          ${renderStrengthWeaknessList(attr.userStrong, attr.userWeak, 'Your')}
        </div>
        <div class="compare-side opp-compare">
          <h4>${DATA[opponentState].name} strengths</h4>
          ${renderStrengthWeaknessList(attr.oppStrong, attr.oppWeak, 'Opposition')}
        </div>
      </div>
      ${renderTraitSummary(roster, opp)}
      ${renderMatchupTable(matchup)}
      <div class="bench-tip"><strong>Bench fix tip:</strong> green rows favour you, red rows favour the opposition. Click a player in your 17, then click a legal bench or position slot to swap and update the comparison.</div>
    </div>
  `;
  window.scrollTo({ top: simResult.closest('.sim-card').offsetTop - 20, behavior: 'smooth' });
}

function showMode(mode) {
  document.body.classList.remove('draft-mode', 'prematch-mode', 'simulation-mode', 'summary-mode');
  if (mode) document.body.classList.add(`${mode}-mode`);
}

function attributeComparison(userRoster, oppRoster) {
  const keys = ['attack','defence','speed','kicking','toughness','clutch','aura'];
  const labels = { attack:'Attack', defence:'Defence', speed:'Speed', kicking:'Kicking', toughness:'Middle toughness', clutch:'Clutch', aura:'Origin aura' };
  const rows = keys.map(key => ({
    key,
    label: labels[key],
    user: Math.round(teamAvg(userRoster, key)),
    opp: Math.round(teamAvg(oppRoster, key))
  })).map(row => ({ ...row, diff: row.user - row.opp }));
  const userStrong = [...rows].sort((a,b)=>b.diff-a.diff).slice(0,3);
  const userWeak = [...rows].sort((a,b)=>a.diff-b.diff).slice(0,3);
  const oppStrong = [...rows].sort((a,b)=>a.diff-b.diff).slice(0,3).map(r => ({...r, diff: -r.diff, user: r.opp, opp: r.user}));
  const oppWeak = [...rows].sort((a,b)=>b.diff-a.diff).slice(0,3).map(r => ({...r, diff: -r.diff, user: r.opp, opp: r.user}));
  return { rows, userStrong, userWeak, oppStrong, oppWeak };
}

function renderStrengthWeaknessList(strengths, weaknesses, label) {
  const strong = strengths.map(r => `<li class="good"><strong>${r.label}</strong><span>${r.user} vs ${r.opp}</span></li>`).join('');
  const weak = weaknesses.map(r => `<li class="bad"><strong>${r.label}</strong><span>${r.user} vs ${r.opp}</span></li>`).join('');
  return `<div class="sw-grid"><div><p class="mini-title">Strengths</p><ul>${strong}</ul></div><div><p class="mini-title">Weaknesses</p><ul>${weak}</ul></div></div>`;
}

function getActiveOpponentRoster() {
  return challengeOpponent ? challengeOpponent.roster : aiRoster;
}

function startingSlots(targetRoster) {
  return targetRoster.filter(s => !s.key.startsWith('B'));
}

function startingPlayers(targetRoster) {
  return startingSlots(targetRoster).map(s => s.player).filter(Boolean);
}

function cloneRoster(targetRoster) {
  return targetRoster.map(s => ({ ...s }));
}

function getTeamRating(targetRoster) {
  // Team overall is based on the starting 13 only, using each player's rating in the slot he is actually playing.
  const slots = startingSlots(targetRoster).filter(s => s.player);
  if (!slots.length) return { total: 0, comboText: '' };
  const avg = key => slots.reduce((sum, s) => sum + effectiveStats(s.player, slotType(s.key))[key], 0) / slots.length;
  const names = slots.map(s => s.player.name);
  const combo = chemistry(names);
  const total = Math.round((avg('attack') + avg('defence') + avg('speed') * 0.6 + avg('kicking') * 0.7 + avg('toughness') + avg('clutch') + avg('aura')) / 6.3 + combo.bonus);
  return { total, comboText: combo.text, combo };
}

function calculateMatchupReport(userRoster, oppRoster) {
  const battles = [];
  Object.keys(SLOT_MATCHUPS).forEach(key => {
    if (key.startsWith('B')) return; // head-to-head comparison is starting 13 only
    const us = userRoster.find(s => s.key === key);
    const them = oppRoster.find(s => s.key === SLOT_MATCHUPS[key]);
    if (!us || !them || !us.player || !them.player) return;
    const type = slotType(key);
    const userScore = weightedPlayerScore(us.player, type);
    const oppScore = weightedPlayerScore(them.player, type);
    const diff = Math.round(userScore - oppScore);
    battles.push({ key, label: us.label, type, user: us.player, opp: them.player, diff, userScore, oppScore });
  });
  battles.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  const edge = Math.round(battles.reduce((sum, b) => sum + b.diff, 0) / Math.max(1, battles.length));
  return { edge, battles };
}

function weightedPlayerScore(player, type) {
  const stats = effectiveStats(player, type);
  const weights = POSITION_WEIGHTS[type] || POSITION_WEIGHTS.B;
  let totalWeight = 0;
  let total = 0;
  Object.keys(weights).forEach(k => { total += stats[k] * weights[k]; totalWeight += weights[k]; });
  return total / totalWeight;
}

function effectiveStats(player, positionType = null) {
  const ratingDelta = positionType ? positionRating(player, positionType) - player.rating : 0;
  const stats = { ...player.stats };
  if (ratingDelta) Object.keys(stats).forEach(key => stats[key] = clamp(stats[key] + ratingDelta));
  // Signature traits are rare match events, not passive always-on rating boosts.
  return stats;
}

function slotType(key) {
  if (key.startsWith('WG')) return 'WG';
  if (key.startsWith('CE')) return 'CE';
  if (key.startsWith('PR')) return 'PR';
  if (key.startsWith('ED')) return 'ED';
  if (key.startsWith('B')) return 'B';
  return key;
}

function renderMatchupSummary(report) {
  const rows = report.battles.slice(0, 7).map(b => {
    const who = b.diff >= 0 ? b.user.name : b.opp.name;
    const side = b.diff >= 0 ? 'Your edge' : 'Opp edge';
    return `<div class="matchup-row ${b.diff >= 0 ? 'good' : 'bad'}"><strong>${b.key}</strong><span>${b.user.name} vs ${b.opp.name}</span><em>${side}: ${who} ${Math.abs(b.diff)}</em></div>`;
  }).join('');
  return `<h4>Head-to-head advantages</h4><div class="matchup-list">${rows}</div>`;
}

function renderMatchupTable(report) {
  const byKey = new Map(report.battles.map(b => [b.key, b]));
  const rows = POSITIONS.filter(pos => !pos.key.startsWith('B')).map(pos => {
    const b = byKey.get(pos.key);
    if (!b) return '';
    const diff = Math.round(b.diff);
    const cls = diff > 2 ? 'good' : diff < -2 ? 'bad' : 'even';
    const adv = diff > 2 ? `${DATA[selectedState].name} +${diff}` : diff < -2 ? `${DATA[opponentState].name} +${Math.abs(diff)}` : 'Even';
    const uStats = topPlayerStats(b.user, b.type);
    const oStats = topPlayerStats(b.opp, b.type);
    return `<div class="h2h-row ${cls}">
      <div class="h2h-player left"><strong>${b.user.name}</strong><small>${uStats}</small></div>
      <div class="h2h-pos"><span>${pos.key}</span><em>${adv}</em></div>
      <div class="h2h-player right"><strong>${b.opp.name}</strong><small>${oStats}</small></div>
    </div>`;
  }).join('');
  return `<h4>Aligned head-to-head matchups</h4><div class="h2h-table">${rows}</div>`;
}

function topPlayerStats(player, type) {
  const stats = effectiveStats(player, type);
  const weights = POSITION_WEIGHTS[type] || POSITION_WEIGHTS.B;
  return Object.keys(weights)
    .filter(k => weights[k] > 0)
    .sort((a,b) => stats[b] - stats[a])
    .slice(0,2)
    .map(k => `${prettyStat(k)} ${Math.round(stats[k])}`)
    .join(' • ');
}

function prettyStat(key) {
  return ({ attack:'Atk', defence:'Def', speed:'Spd', kicking:'Kick', toughness:'Tough', clutch:'Clutch', aura:'Aura' })[key] || key;
}

function renderTraitSummary(userRoster, oppRoster) {
  const userTraits = startingPlayers(userRoster).filter(p => SIGNATURES[p.name]).slice(0, 5).map(p => `${p.name}: ${SIGNATURES[p.name].name}`);
  const oppTraits = startingPlayers(oppRoster).filter(p => SIGNATURES[p.name]).slice(0, 5).map(p => `${p.name}: ${SIGNATURES[p.name].name}`);
  const userCombo = chemistry(startingPlayers(userRoster).map(p => p.name)).text || 'No major combo';
  const oppCombo = chemistry(startingPlayers(oppRoster).map(p => p.name)).text || 'No major combo';
  return `<div class="trait-box"><p><strong>Your traits:</strong> ${userTraits.join('; ') || 'None'}</p><p><strong>Opp traits:</strong> ${oppTraits.join('; ') || 'None'}</p><p><strong>Your chemistry:</strong> ${userCombo}</p><p><strong>Opp chemistry:</strong> ${oppCombo}</p></div>`;
}

function playNextGame() {
  if (!series || isWatching) return;
  const gameNo = series.game;
  const opp = getActiveOpponentRoster();
  const matchup = calculateMatchupReport(roster, opp);
  const userRating = getTeamRating(roster).total;
  const oppRating = getTeamRating(opp).total;
  const weather = pick(WEATHER);
  const ref = pick(REFS);
  const venue = getVenueForGame(gameNo);
  const home = homeAdvantageForVenue(venue);
  const homeEdge = homeAdvantageEdge(venue);
  const seriesMods = calculateSeriesModifiers(gameNo, roster, opp);
  const coachEdge = coachMatchEdge(gameNo);
  if (coachEdge.notes.length) seriesMods.notes.push(...coachEdge.notes);
  const coachEvents = planCoachPowerEvents(gameNo);
  const rareTraits = planRareTraitBoosts(gameNo, roster, opp, seriesMods);
  const benchPlan = planBenchRotations(roster, opp);
  annotateInterchangesWithLiveRatings(benchPlan, roster, opp);
  const liveSwing = calculateLiveMatchSwing(roster, opp, benchPlan, rareTraits);
  if (homeEdge > 0) seriesMods.notes.push(home.label + ': +1.8 momentum edge');
  if (homeEdge < 0) seriesMods.notes.push(home.label + ': opposition +1.8 momentum edge');
  if (rareTraits.notes.length) seriesMods.notes.push(...rareTraits.notes);
  if (benchPlan.notes.length) seriesMods.notes.push(...benchPlan.notes.slice(0, 2));
  if (liveSwing.notes.length) seriesMods.notes.push(...liveSwing.notes);
  const ratingEdge = (userRating - oppRating) * 0.42; // six overall points is a real edge, not an automatic win
  const matchupEdge = matchup.edge * 0.55;
  const randomEdge = (Math.random() * 13 - 6.5);
  // Bench players and rare player boosts now affect the match only from the minute they are on the field / triggered.
  const diff = ratingEdge + matchupEdge + weatherModifier(weather, roster, opp) + homeEdge + coachEdge.userEdge - coachEdge.oppEdge + seriesMods.userBoost - seriesMods.oppBoost + liveSwing.edge + randomEdge;
  let [high, low] = pick(SCORE_PROFILES);
  let userScore = diff >= 0 ? high : low;
  let oppScore = diff >= 0 ? low : high;
  if (Math.abs(diff) < 3.5 && Math.random() < 0.62) {
    [userScore, oppScore] = pick([[8,6],[10,8],[12,10],[14,12],[16,14],[18,16],[20,18],[13,12],[15,14]]);
    if (diff < 0) [userScore, oppScore] = [oppScore, userScore];
  }
  if (weather === 'Heavy rain' || weather === 'Slippery ball') {
    userScore = Math.max(2, userScore - 4);
    oppScore = Math.max(2, oppScore - 4);
  }
  userScore = normaliseLeagueScore(userScore);
  oppScore = normaliseLeagueScore(oppScore);

  let goldenPoint = null;
  const regulationUserScore = userScore;
  const regulationOppScore = oppScore;
  if (userScore === oppScore) {
    const calmEdge = seriesMods.userCalm - seriesMods.oppCalm;
    const gpChance = clampStat(50 + diff * 3 + calmEdge * 4, 25, 75);
    const userWinsGolden = Math.random() * 100 < gpChance;
    goldenPoint = { winner: userWinsGolden ? 'user' : 'opp', minute: Math.floor(Math.random() * 9) + 82 };
    if (userWinsGolden) userScore += 1; else oppScore += 1;
  }

  lastGameStats = generateMatchStats(regulationUserScore, regulationOppScore, userScore, oppScore, matchup, weather, ref, opp, goldenPoint, venue, home);
  lastGameStats.seriesMods = seriesMods;
  lastGameStats.benchPlan = benchPlan;
  lastGameStats.liveSwing = liveSwing;
  if (coachEvents.length) { rareTraits.events.push(...coachEvents); seriesMods.notes.push(...coachEvents.map(e => e.text)); }
  const events = generateGameEvents(gameNo, regulationUserScore, regulationOppScore, matchup, weather, ref, opp, goldenPoint, seriesMods, rareTraits, benchPlan, liveSwing);
  lastTimelineEvents = events;
  lastGameResult = { gameNo, userScore, oppScore, weather, ref, goldenPoint, seriesMods };
  renderGameShell(gameNo, weather, ref, goldenPoint, matchup, seriesMods);
  watchEvents(events, userScore, oppScore);
}

function calculateSeriesModifiers(gameNo, userRoster, oppRoster) {
  const previous = series && series.results ? series.results[series.results.length - 1] : null;
  const userPlayers = startingPlayers(userRoster);
  const oppPlayers = startingPlayers(oppRoster);
  const userCompetitive = countTraitPlayers(userPlayers, SERIES_TRAITS.competitive);
  const oppCompetitive = countTraitPlayers(oppPlayers, SERIES_TRAITS.competitive);
  const userCalm = countTraitPlayers(userPlayers, SERIES_TRAITS.calm);
  const oppCalm = countTraitPlayers(oppPlayers, SERIES_TRAITS.calm);
  const userDecider = countTraitPlayers(userPlayers, SERIES_TRAITS.decider);
  const oppDecider = countTraitPlayers(oppPlayers, SERIES_TRAITS.decider);
  const userEmotional = countTraitPlayers(userPlayers, SERIES_TRAITS.emotional);
  const oppEmotional = countTraitPlayers(oppPlayers, SERIES_TRAITS.emotional);
  let userBoost = 0, oppBoost = 0;
  const notes = [];
  if (previous) {
    const userLost = !previous.won;
    const oppLost = previous.won;
    if (userLost) {
      const boost = userCompetitive * 0.85 + userCalm * 0.25;
      userBoost += boost;
      notes.push(`${DATA[selectedState].name} respond after defeat: Competitive Edge +${boost.toFixed(1)}`);
    }
    if (oppLost) {
      const boost = oppCompetitive * 0.85 + oppCalm * 0.25;
      oppBoost += boost;
      notes.push(`${DATA[opponentState].name} respond after defeat: Competitive Edge +${boost.toFixed(1)}`);
    }
    if (previous.won && userCalm < 2) { userBoost -= 0.8; notes.push(`${DATA[selectedState].name} risk a small let-down after winning.`); }
    if (!previous.won && oppCalm < 2) { oppBoost -= 0.8; notes.push(`${DATA[opponentState].name} risk a small let-down after winning.`); }
  }
  if (gameNo === 3) {
    const u = userDecider * 0.65 + userCalm * 0.2 - userEmotional * 0.18;
    const o = oppDecider * 0.65 + oppCalm * 0.2 - oppEmotional * 0.18;
    userBoost += u; oppBoost += o;
    notes.push(`Game 3 decider traits: ${DATA[selectedState].name} +${u.toFixed(1)}, ${DATA[opponentState].name} +${o.toFixed(1)}`);
  }
  return { userBoost, oppBoost, userCompetitive, oppCompetitive, userCalm, oppCalm, userDecider, oppDecider, userEmotional, oppEmotional, notes };
}

function countTraitPlayers(players, list) {
  return players.filter(p => list.includes(p.name)).length;
}

function weatherModifier(weather, userRoster, oppRoster) {
  if (weather === 'Heavy rain') return teamAvg(userRoster, 'toughness') > teamAvg(oppRoster, 'toughness') ? 2 : -2;
  if (weather === 'Hot night') return teamAvg(userRoster, 'clutch') > teamAvg(oppRoster, 'clutch') ? 1.5 : -1.5;
  return 0;
}

function teamAvg(targetRoster, key) {
  const slots = startingSlots(targetRoster).filter(s => s.player);
  const base = slots.reduce((sum, s) => sum + effectiveStats(s.player, slotType(s.key))[key], 0) / Math.max(1, slots.length);
  const team = targetRoster === roster ? 'user' : 'opp';
  return base + coachStatBonus(team, key);
}

function renderGameShell(gameNo, weather, ref, goldenPoint, matchup, seriesMods) {
  isWatching = true;
  showMode('simulation');
  spinBtn.disabled = true;
  simulateBtn.disabled = true;
  const venue = getVenueForGame(gameNo);
  const home = homeAdvantageForVenue(venue);
  const lead = seriesMods && seriesMods.notes.length ? seriesMods.notes.slice(0,2).map(n => `<li>${n}</li>`).join('') : '<li>No major series trait modifier before kick-off.</li>';
  simResult.innerHTML = `
    <div class="match-card simulation-page broadcast-page">
      <div class="match-page-head broadcast-head">
        <div>
          <p class="eyebrow">Live Origin broadcast</p>
          <h2>Game ${gameNo} • ${venue}</h2>
          <p class="muted">${weather} • ${ref} • ${home.label}${goldenPoint ? ' • Golden point enabled' : ''}</p>
        </div>
        <div class="broadcast-clock" id="matchClock">Kick-off</div>
      </div>
      <div class="scoreboard live-scoreboard">
        <div><small>${DATA[selectedState].name}</small><strong>${DATA[selectedState].name}</strong><span id="userScore">0</span><ul id="userScorers" class="scorer-list"></ul></div>
        <div><small>${DATA[opponentState].name}</small><strong>${DATA[opponentState].name}</strong><span id="oppScore">0</span><ul id="oppScorers" class="scorer-list"></ul></div>
      </div>
      <div class="momentum-wrap"><span>${DATA[selectedState].name}</span><div class="momentum-track"><div id="momentumDot" class="momentum-dot"></div></div><span>${DATA[opponentState].name}</span></div>
      <div class="minute-bar"><div id="minuteFill"></div></div>
      <div class="broadcast-grid">
        <div id="timeline" class="timeline live-timeline broadcast-timeline"></div>
        <aside class="live-sidebar">
          <h4>Live read</h4>
          <div id="liveStats" class="live-stats">
            <p><strong>Momentum:</strong> arm wrestle</p>
            <p><strong>Last play:</strong> waiting for kick-off</p>
          </div>
          <h4>Series traits</h4>
          <ul class="trait-feed">${lead}</ul>
          <h4>Matchup watch</h4>
          <div>${renderMatchupSummary(matchup)}</div>
        </aside>
      </div>
    </div>
  `;
  window.scrollTo({ top: simResult.closest('.sim-card').offsetTop - 20, behavior: 'smooth' });
}

function watchEvents(events, finalUserScore, finalOppScore) {
  const timeline = document.getElementById('timeline');
  const clock = document.getElementById('matchClock');
  const fill = document.getElementById('minuteFill');
  const userScoreEl = document.getElementById('userScore');
  const oppScoreEl = document.getElementById('oppScore');
  const userScorers = document.getElementById('userScorers');
  const oppScorers = document.getElementById('oppScorers');
  const momentumDot = document.getElementById('momentumDot');
  const liveStats = document.getElementById('liveStats');
  const maxMinute = Math.max(80, ...events.map(ev => ev.minute));
  let idx = 0, currentUser = 0, currentOpp = 0, momentum = 0;
  let previousText = '';
  const opening = document.createElement('div');
  opening.className = 'timeline-event neutral-final';
  opening.innerHTML = renderBroadcastLine({ minute: 0, kind: 'filler', team: 'neutral', text: 'Kick-off. The simulation will only pause for tries, momentum swings, matchup moments and key broadcast updates.' });
  timeline.prepend(opening);
  const timer = setInterval(() => {
    if (idx >= events.length) {
      clearInterval(timer);
      userScoreEl.textContent = finalUserScore;
      oppScoreEl.textContent = finalOppScore;
      fill.style.width = '100%';
      clock.textContent = `${maxMinute}' FULL TIME`;
      const ft = document.createElement('div');
      ft.className = 'timeline-event neutral-final';
      ft.innerHTML = `<strong>${maxMinute}'</strong> FULL TIME`;
      timeline.prepend(ft);
      setTimeout(() => finishGame(finalUserScore, finalOppScore), 1400);
      return;
    }
    const ev = events[idx++];
    fill.style.width = `${Math.min(ev.minute, 80) / 80 * 100}%`;
    clock.textContent = ev.minute <= 80 ? `${ev.minute}'` : `${ev.minute}' Golden point`;
    currentUser += ev.userPoints || 0;
    currentOpp += ev.oppPoints || 0;
    userScoreEl.textContent = currentUser;
    oppScoreEl.textContent = currentOpp;
    if (ev.isTry) {
      const li = document.createElement('li');
      li.textContent = `${ev.minute}' ${ev.scorer} (${ev.points} pts)`;
      (ev.team === 'user' ? userScorers : oppScorers).appendChild(li);
    }
    let text = ev.text;
    if (text === previousText) text = alternateNeutralText(text);
    previousText = text;
    momentum += ev.momentum || (ev.team === 'user' ? 5 : ev.team === 'opp' ? -5 : 0);
    momentum = clampStat(momentum, -45, 45);
    if (momentumDot) momentumDot.style.left = `${50 + momentum}%`;
    const div = document.createElement('div');
    div.className = `timeline-event ${ev.kind || ''} ${ev.team === 'user' ? 'mine' : ev.team === 'opp' ? 'theirs' : ''}`;
    div.innerHTML = renderBroadcastLine({ ...ev, text });
    timeline.prepend(div);
    if (liveStats) {
      const leader = momentum > 10 ? DATA[selectedState].name : momentum < -10 ? DATA[opponentState].name : 'Arm wrestle';
      liveStats.innerHTML = `<p><strong>Momentum:</strong> ${leader}</p><p><strong>Score:</strong> ${DATA[selectedState].name} ${currentUser}, ${DATA[opponentState].name} ${currentOpp}</p><p><strong>Last play:</strong> ${stripTags(text)}</p>`;
    }
  }, 2850);
}


function renderBroadcastLine(ev) {
  const minute = ev.minute === 0 ? "0'" : `${ev.minute}'`;
  const lines = commentatorLines(ev);
  return `<div class="broadcast-minute"><strong>${minute}</strong></div><div class="commentator-line caller"><span>Caller</span>${lines.caller}</div><div class="commentator-line analyst"><span>Analyst</span>${lines.analyst}</div>`;
}

function stripTags(value) {
  const div = document.createElement('div');
  div.innerHTML = value || '';
  return div.textContent || div.innerText || '';
}

function commentatorLines(ev) {
  const raw = stripTags(ev.text || '');
  const mine = DATA[selectedState].name;
  const theirs = DATA[opponentState].name;
  const team = ev.team === 'user' ? mine : ev.team === 'opp' ? theirs : 'Both sides';
  const other = ev.team === 'user' ? theirs : mine;
  if (ev.isTry || ev.kind === 'try') {
    return {
      caller: `TRY ${team.toUpperCase()}! ${raw}`,
      analyst: `That came from the pressure building through the matchup edge. ${other} have to answer that defensive problem.`
    };
  }
  if (ev.kind === 'golden') {
    return {
      caller: raw,
      analyst: `This is where calm resolve and big-game kicking matter more than overall ratings.`
    };
  }
  if (ev.kind === 'coach') {
    return {
      caller: raw,
      analyst: `That's the coach's fingerprint on this game. It is a small edge, but in Origin small edges matter.`
    };
  }
  if (ev.kind === 'score') {
    return {
      caller: raw,
      analyst: `Valuable points in an Origin arm wrestle. Field position and discipline are starting to tell.`
    };
  }
  if (ev.kind === 'matchup') {
    return {
      caller: raw,
      analyst: `That is the kind of one-on-one battle the coach can target. The bench and edge shape can change this before the next game.`
    };
  }
  if (ev.kind === 'bench') {
    return {
      caller: raw,
      analyst: `Fresh legs matter in Origin. The bench does not inflate the pre-game overall, but it can change the middle battle once fatigue hits.`
    };
  }
  if (ev.kind === 'trait') {
    return {
      caller: raw,
      analyst: `That is a rare Origin boost. Most games are still decided by ratings, matchups and fatigue — these moments only cut through occasionally.`
    };
  }
  return {
    caller: raw,
    analyst: neutralAnalystLine()
  };
}

function neutralAnalystLine() {
  const lines = [
    'Neither side is getting cheap points here. It is turning into a proper Origin grind.',
    'The scoreline will be shaped by patience, completions and who wins the next big collision.',
    'You can feel both coaches waiting for a weakness to open up.',
    'This is exactly the period where a calm spine can settle the whole side.',
    'No panic yet. The next momentum swing will matter.'
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

function finishGame(userScore, oppScore) {
  const gameNo = series.game;
  const won = userScore > oppScore;
  if (won) series.userWins += 1; else series.oppWins += 1;
  const potm = awardSeriesPoints(lastTimelineEvents, won);
  series.results.push({ gameNo, userScore, oppScore, won, potm });
  isWatching = false;
  renderPostGameSummary(gameNo, userScore, oppScore, won);
  spinBtn.disabled = rosterFull() || Boolean(currentSquad);
}

function renderPostGameSummary(gameNo, userScore, oppScore, won) {
  showMode('summary');
  const nextButton = gameNo < 3
    ? `<button class="primary" onclick="advanceToNextGame()">Review matchups for Game ${gameNo + 1}</button>`
    : `<button class="primary" onclick="renderSeriesFinal()">Show series result</button>`;
  const scorers = renderScorerSummary(lastTimelineEvents);
  const keyMoments = lastTimelineEvents.filter(ev => ev.isTry || ev.userPoints || ev.oppPoints || ev.text.includes('advantage') || ev.text.includes('Golden point')).slice(-10)
    .map(ev => `<li><strong>${ev.minute}'</strong> ${ev.text}</li>`).join('');
  simResult.innerHTML = `
    <div class="post-game-page result-card ${won ? 'series-win' : 'series-loss'}">
      <p class="eyebrow">Post-game summary</p>
      <h2>${won ? 'Game won' : 'Game lost'}: ${DATA[selectedState].name} ${userScore} - ${oppScore} ${DATA[opponentState].name}</h2>
      <p>Series: ${DATA[selectedState].name} ${series.userWins}, ${DATA[opponentState].name} ${series.oppWins}</p>
      ${series.results[series.results.length - 1] && series.results[series.results.length - 1].potm ? `<p><strong>Player of the Match:</strong> ${series.results[series.results.length - 1].potm.name}</p>` : ''}
      ${scorers}
      ${renderMatchStats(lastGameStats)}
      ${renderSeriesStory(lastGameStats)}
      <div class="key-moments"><h4>Key moments</h4><ul>${keyMoments}</ul></div>
      <div class="button-row summary-actions">${nextButton}<button class="ghost" onclick="resetGame()">Generate a new team</button></div>
    </div>
  `;
  window.scrollTo({ top: simResult.closest('.sim-card').offsetTop - 20, behavior: 'smooth' });
}

function advanceToNextGame() {
  if (!series || series.game >= 3) return;
  series.game += 1;
  showSeriesSetup(false);
}

function renderScorerSummary(events) {
  const mine = events.filter(ev => ev.isTry && ev.team === 'user').map(ev => `<li>${ev.minute}' ${ev.scorer} (${ev.points})</li>`).join('') || '<li>No tries</li>';
  const theirs = events.filter(ev => ev.isTry && ev.team === 'opp').map(ev => `<li>${ev.minute}' ${ev.scorer} (${ev.points})</li>`).join('') || '<li>No tries</li>';
  return `<div class="try-summary"><div><h4>${DATA[selectedState].name} tries</h4><ul>${mine}</ul></div><div><h4>${DATA[opponentState].name} tries</h4><ul>${theirs}</ul></div></div>`;
}


function addSeriesPoints(name, team, points, tryInc = 0, statPatch = {}) {
  if (!name || !series) return;
  if (!series.playerPoints) series.playerPoints = {};
  if (!series.playerPoints[name]) {
    series.playerPoints[name] = {
      name, team, points: 0, tries: 0, potm: 0, gamesInfluenced: 0,
      runMetres: 0, tackles: 0, tackleBusts: 0, lineBreaks: 0, tryAssists: 0, fieldGoals: 0, goals: 0, errors: 0, impactPlays: 0
    };
  }
  const rec = series.playerPoints[name];
  rec.points += points;
  rec.tries += tryInc;
  rec.gamesInfluenced += 1;
  Object.entries(statPatch).forEach(([key, value]) => {
    rec[key] = (rec[key] || 0) + value;
  });
}

function awardSeriesPoints(events, userWon) {
  const gameScores = {};
  events.forEach(ev => {
    if (!ev.playerName) return;
    const pts = (ev.isTry ? 8 : 0) + (ev.kind === 'golden' ? 12 : 0) + (ev.kind === 'score' ? 4 : 0) + (ev.kind === 'matchup' ? 3 : 0) + (ev.kind === 'trait' ? 3 : 0) + (ev.kind === 'bench' ? 1 : 0);
    const team = ev.team === 'user' ? selectedState : opponentState;
    gameScores[ev.playerName] = (gameScores[ev.playerName] || 0) + pts;
    const patch = {};
    if (ev.isTry) {
      patch.runMetres = randBetween(55, 125);
      patch.tackleBusts = randBetween(1, 5);
      patch.lineBreaks = 1;
      patch.impactPlays = 1;
    } else if (ev.kind === 'golden') {
      patch.fieldGoals = 1;
      patch.impactPlays = 1;
    } else if (ev.kind === 'score') {
      patch.goals = ev.points === 2 ? 1 : 0;
      patch.impactPlays = 1;
    } else if (ev.kind === 'matchup') {
      patch.runMetres = randBetween(28, 80);
      patch.tackleBusts = randBetween(1, 3);
      patch.lineBreaks = Math.random() < 0.45 ? 1 : 0;
      patch.impactPlays = 1;
    } else if (ev.kind === 'trait') {
      patch.runMetres = randBetween(18, 65);
      patch.tackleBusts = Math.random() < 0.5 ? 1 : 0;
      patch.tryAssists = ev.text && ev.text.toLowerCase().includes('tempo') ? 1 : 0;
      patch.impactPlays = 1;
    } else if (ev.kind === 'bench') {
      patch.runMetres = randBetween(20, 70);
      patch.tackles = randBetween(5, 18);
    }
    addSeriesPoints(ev.playerName, team, pts, ev.isTry ? 1 : 0, patch);
  });
  const winners = startingPlayers(userWon ? roster : getActiveOpponentRoster());
  winners.forEach(p => addSeriesPoints(p.name, userWon ? selectedState : opponentState, 1, 0, { tackles: randBetween(12, 35), runMetres: randBetween(40, 105) }));
  const top = Object.entries(gameScores).sort((a,b)=>b[1]-a[1])[0];
  if (top) {
    const record = series.playerPoints[top[0]];
    record.potm = (record.potm || 0) + 1;
    record.points += 6;
    return { name: top[0], team: record.team, tries: record.tries, lineBreaks: record.lineBreaks, runMetres: record.runMetres };
  }
  return null;
}

function renderPlayerOfSeries() {
  if (!series || !series.playerPoints) return '';
  const top = Object.values(series.playerPoints).sort((a,b)=>b.points-a.points)[0];
  if (!top) return '';
  const teamName = DATA[top.team] ? DATA[top.team].name : top.team;
  const statBits = [
    `${top.tries || 0} tries`,
    `${top.potm || 0} player-of-match awards`,
    `${Math.round(top.runMetres || 0)} run metres`,
    `${top.lineBreaks || 0} line breaks`,
    `${top.tackleBusts || 0} tackle busts`,
    `${top.tackles || 0} tackles`,
    top.fieldGoals ? `${top.fieldGoals} field goal${top.fieldGoals === 1 ? '' : 's'}` : null,
    top.tryAssists ? `${top.tryAssists} try assist${top.tryAssists === 1 ? '' : 's'}` : null
  ].filter(Boolean).join(' • ');
  return `<div class="player-of-series"><h3>Player of the Series</h3><p><strong>${top.name}</strong> — ${teamName}</p><p>${statBits}</p></div>`;
}

function renderSeriesFinal() {
  showMode('summary');
  const won = series.userWins > series.oppWins;
  const rows = series.results.map(r => `<li>Game ${r.gameNo}: ${DATA[selectedState].name} ${r.userScore} - ${r.oppScore} ${DATA[opponentState].name}${r.potm ? ` • Player of match: ${r.potm.name}` : ''}</li>`).join('');
  const pots = renderPlayerOfSeries();
  simResult.innerHTML = `<div class="post-game-page result-card final-series"><h2>${won ? 'Origin series won' : 'Series lost'}</h2><p>${DATA[selectedState].name} ${series.userWins} - ${series.oppWins} ${DATA[opponentState].name}</p><ul class="series-results">${rows}</ul>${pots}<p class="muted">Export your side and challenge another drafted opponent, or generate a new team.</p><div class="button-row"><button class="ghost" onclick="exportTeam()">Export this team</button><button class="primary" onclick="resetGame()">Generate a new team</button></div></div>`;
}


function planRareTraitBoosts(gameNo, userRoster, oppRoster, seriesMods) {
  const userEvents = selectRareTraitEvents(userRoster, 'user', gameNo, seriesMods);
  const oppEvents = selectRareTraitEvents(oppRoster, 'opp', gameNo, seriesMods);
  const userEdge = userEvents.reduce((sum, ev) => sum + (ev.edge || 0), 0);
  const oppEdge = oppEvents.reduce((sum, ev) => sum + (ev.edge || 0), 0);
  const notes = [];
  if (userEvents.length) notes.push(`${DATA[selectedState].name} rare trait: ${userEvents.map(e => e.playerName + ' — ' + e.signature).join(', ')}`);
  if (oppEvents.length) notes.push(`${DATA[opponentState].name} rare trait: ${oppEvents.map(e => e.playerName + ' — ' + e.signature).join(', ')}`);
  return { userEdge, oppEdge, events: [...userEvents, ...oppEvents], notes };
}

function selectRareTraitEvents(targetRoster, team, gameNo, seriesMods) {
  const slots = targetRoster.filter(s => s.player && SIGNATURES[s.player.name]);
  const out = [];
  slots.forEach(slot => {
    const player = slot.player;
    const sig = SIGNATURES[player.name];
    const isBench = slot.key.startsWith('B');
    if (sig.benchOnly && !isBench) return;
    let chance = sig.chance || 0.08;
    if (gameNo === 3 && SERIES_TRAITS.decider.includes(player.name)) chance += 0.05;
    if (series && series.results && series.results.length) {
      const last = series.results[series.results.length - 1];
      const teamLostLast = team === 'user' ? !last.won : last.won;
      if (teamLostLast && SERIES_TRAITS.competitive.includes(player.name)) chance += 0.04;
    }
    // Keep boosts rare even when the conditions are right.
    chance = Math.min(chance, sig.tier === 'legendary' ? 0.16 : 0.18);
    if (Math.random() < chance) {
      const minute = sig.benchOnly ? randBetween(42, 66) : (gameNo === 3 ? randBetween(55, 79) : randBetween(18, 76));
      const sideName = team === 'user' ? DATA[selectedState].name : DATA[opponentState].name;
      out.push({
        minute,
        team,
        kind: 'trait',
        userPoints: 0,
        oppPoints: 0,
        momentum: team === 'user' ? 9 : -9,
        edge: sig.edge || 1.5,
        signature: sig.name,
        playerName: player.name,
        text: `${sideName}: ${player.name} produces a rare ${sig.name} moment — ${sig.text}.`
      });
    }
  });
  // Two rare boosts from the same side in one match is usually too much.
  return out.sort((a,b) => (SIGNATURES[b.playerName].edge || 0) - (SIGNATURES[a.playerName].edge || 0)).slice(0, 1);
}

function planBenchRotations(userRoster, oppRoster) {
  const userEvents = createBenchEvents(userRoster, 'user');
  const oppEvents = createBenchEvents(oppRoster, 'opp');
  const userBench = benchImpact(userRoster);
  const oppBench = benchImpact(oppRoster);
  const activeUserEdge = activeBenchEdge(userEvents);
  const activeOppEdge = activeBenchEdge(oppEvents);
  const notes = [];
  if (userEvents.length) notes.push(`${DATA[selectedState].name} bench rotation: ${userEvents.map(e => `${e.playerName} for ${e.offName}`).join(', ')} (${formatBenchLabel(userBench)})`);
  if (oppEvents.length) notes.push(`${DATA[opponentState].name} bench rotation: ${oppEvents.map(e => `${e.playerName} for ${e.offName}`).join(', ')} (${formatBenchLabel(oppBench)})`);
  return { activeUserEdge, activeOppEdge, userBench, oppBench, events: [...userEvents, ...oppEvents], userEvents, oppEvents, notes };
}

function activeBenchEdge(events) {
  // Bench players only influence the simulation after they enter. A late interchange gets a smaller effect.
  return events.reduce((sum, ev) => {
    const minutesOn = Math.max(0, 80 - ev.minute);
    return sum + (ev.delta * minutesOn / 80) * 0.18;
  }, 0);
}

function createBenchEvents(targetRoster, team) {
  const bench = targetRoster.filter(s => s.key.startsWith('B') && s.player);
  const starters = targetRoster.filter(s => !s.key.startsWith('B') && s.player).map(s => ({...s}));
  const minutes = [24, 43, 57, 66];
  const events = [];
  bench.slice(0, 4).forEach((slot, index) => {
    const player = slot.player;
    const sideName = team === 'user' ? DATA[selectedState].name : DATA[opponentState].name;
    const replacement = chooseReplacementForBench(player, starters);
    if (!replacement) return;
    const type = slotType(replacement.key);
    const onRating = Math.round(weightedPlayerScore(player, type));
    const offRating = Math.round(weightedPlayerScore(replacement.player, type));
    const delta = onRating - offRating;
    // After this minute, the bench player is now the active player in that role for future rotation choices.
    replacement.player = player;
    const sig = SIGNATURES[player.name];
    const spark = sig && sig.benchOnly && Math.random() < 0.22;
    const minute = minutes[index] + Math.floor(Math.random() * 4) - 1;
    const deltaLabel = delta >= 0 ? `+${delta}` : `${delta}`;
    events.push({
      minute,
      team,
      kind: spark ? 'trait' : 'bench',
      userPoints: 0,
      oppPoints: 0,
      momentum: team === 'user' ? (spark ? 8 : clampStat(Math.round(delta / 2), -5, 6)) : (spark ? -8 : -clampStat(Math.round(delta / 2), -5, 6)),
      playerName: player.name,
      offName: replacement.player && replacement.player.name === player.name ? 'starter' : '',
      offPlayerName: null,
      positionKey: replacement.key,
      positionType: type,
      onRating,
      offRating,
      delta,
      text: ''
    });
    const ev = events[events.length - 1];
    // The replacement player was overwritten above; restore display names from captured scores by storing before overwrite.
  });
  return rebuildBenchEventText(events, targetRoster, team);
}

function chooseReplacementForBench(player, activeStarters) {
  let best = null;
  activeStarters.forEach(s => {
    if (!canPlay(player, s)) return;
    const type = slotType(s.key);
    const onScore = weightedPlayerScore(player, type);
    const offScore = weightedPlayerScore(s.player, type);
    const fatigueBonus = ['PR','ED','LK','HK'].includes(type) ? 2.5 : 0.5;
    const value = (onScore - offScore) + fatigueBonus;
    if (!best || value > best.value) best = { slot: s, value };
  });
  return best ? best.slot : null;
}

function rebuildBenchEventText(events, originalRoster, team) {
  // Recreate events with accurate off-player names because the active-starter copy mutates during planning.
  const sideName = team === 'user' ? DATA[selectedState].name : DATA[opponentState].name;
  const active = originalRoster.filter(s => !s.key.startsWith('B') && s.player).map(s => ({...s}));
  return originalRoster.filter(s => s.key.startsWith('B') && s.player).slice(0,4).map((slot, index) => {
    const player = slot.player;
    const replacement = chooseReplacementForBench(player, active);
    if (!replacement) return null;
    const offPlayer = replacement.player;
    const type = slotType(replacement.key);
    const onRating = Math.round(weightedPlayerScore(player, type));
    const offRating = Math.round(weightedPlayerScore(offPlayer, type));
    const delta = onRating - offRating;
    replacement.player = player;
    const sig = SIGNATURES[player.name];
    const spark = sig && sig.benchOnly && Math.random() < 0.22;
    const minute = [24,43,57,66][index] + Math.floor(Math.random() * 4) - 1;
    const deltaLabel = delta >= 0 ? `+${delta}` : `${delta}`;
    return {
      minute,
      team,
      kind: spark ? 'trait' : 'bench',
      userPoints: 0,
      oppPoints: 0,
      momentum: team === 'user' ? (spark ? 8 : clampStat(Math.round(delta / 2), -5, 6)) : (spark ? -8 : -clampStat(Math.round(delta / 2), -5, 6)),
      playerName: player.name,
      offName: offPlayer.name,
      offPlayerName: offPlayer.name,
      positionKey: replacement.key,
      positionType: type,
      onRating,
      offRating,
      delta,
      onPlayer: player,
      offPlayer,
      text: spark
        ? `${sideName}: ${player.name} ON for ${offPlayer.name} at ${replacement.key}. ${sig.name} sparks the ruck (${onRating} vs ${offRating}, ${deltaLabel}).`
        : `${sideName}: ${player.name} ON for ${offPlayer.name} at ${replacement.key}. Interchange impact ${onRating} vs ${offRating} (${deltaLabel}).`
    };
  }).filter(Boolean);
}


function annotateInterchangesWithLiveRatings(benchPlan, userRoster, oppRoster) {
  if (!benchPlan || !benchPlan.events) return;
  benchPlan.events.sort((a,b)=>a.minute-b.minute).forEach(ev => {
    const minute = ev.minute || 0;
    const liveUser = getLiveTeamRating(userRoster, benchPlan.userEvents || [], 'user', minute).total;
    const liveOpp = getLiveTeamRating(oppRoster, benchPlan.oppEvents || [], 'opp', minute).total;
    const sideLabel = `${DATA[selectedState].name} ${liveUser} • ${DATA[opponentState].name} ${liveOpp}`;
    ev.liveUserRating = liveUser;
    ev.liveOppRating = liveOpp;
    ev.text += ` Live on-field overall: ${sideLabel}.`;
  });
}

function calculateLiveMatchSwing(userRoster, oppRoster, benchPlan, rareTraits) {
  const startUser = getTeamRating(userRoster).total;
  const startOpp = getTeamRating(oppRoster).total;
  const startDiff = startUser - startOpp;
  const samples = [10, 25, 40, 55, 70, 80];
  let ratingSwing = 0;
  samples.forEach(minute => {
    const liveUser = getLiveTeamRating(userRoster, benchPlan.userEvents || [], 'user', minute).total;
    const liveOpp = getLiveTeamRating(oppRoster, benchPlan.oppEvents || [], 'opp', minute).total;
    const liveDiff = liveUser - liveOpp;
    ratingSwing += ((liveDiff - startDiff) * 0.42) / samples.length;
  });
  let traitSwing = 0;
  (rareTraits && rareTraits.events ? rareTraits.events : []).forEach(ev => {
    // Rare boosts are temporary. They influence the match after they happen, not before.
    const minutesActive = Math.max(0, 80 - (ev.minute || 80));
    const weighted = (ev.edge || 0) * Math.min(1, minutesActive / 28);
    traitSwing += ev.team === 'user' ? weighted : -weighted;
  });
  const edge = ratingSwing + traitSwing;
  const notes = [`Live on-field engine: starters set the opening rating; interchanges and rare boosts only count after they happen (${edge >= 0 ? '+' : ''}${edge.toFixed(1)} swing).`];
  return { edge, ratingSwing, traitSwing, notes };
}

function getLiveTeamRating(targetRoster, teamBenchEvents, team, minute) {
  const active = startingSlots(targetRoster).filter(s => s.player).map(s => ({ ...s }));
  (teamBenchEvents || [])
    .filter(ev => ev.team === team && ev.minute <= minute && ev.onPlayer)
    .sort((a,b)=>a.minute-b.minute)
    .forEach(ev => {
      const slot = active.find(s => s.key === ev.positionKey);
      if (slot && canPlay(ev.onPlayer, slot)) slot.player = ev.onPlayer;
    });
  return getTeamRating(active);
}

function formatBenchLabel(value) {
  if (value > 8) return 'strong bench';
  if (value > 2) return 'solid bench';
  if (value < -6) return 'weak bench';
  if (value < -2) return 'thin bench';
  return 'balanced bench';
}

function bestBenchType(player) {
  if (!player || !player.positions) return 'B';
  const preferred = ['PR','LK','ED','HK','FE','HB','CE','WG','FB'];
  return preferred.find(pos => player.positions.includes(pos)) || 'B';
}

function benchImpact(targetRoster) {
  const bench = targetRoster.filter(s => s.key.startsWith('B') && s.player);
  if (!bench.length) return 0;
  return bench.reduce((sum, s) => sum + (weightedPlayerScore(s.player, bestBenchType(s.player)) - 84), 0) / bench.length;
}

function randBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateGameEvents(gameNo, userScore, oppScore, matchup, weather, ref, oppRoster, goldenPoint, seriesMods, rareTraits = null, benchPlan = null, liveSwing = null) {
  const events = [];
  const used = new Set();
  events.push({ minute: 3, team: 'neutral', kind: 'filler', userPoints: 0, oppPoints: 0, momentum: 0, text: neutralText(weather, ref) });
  used.add(3);

  if (seriesMods && seriesMods.notes.length) {
    const fav = seriesMods.userBoost >= seriesMods.oppBoost ? 'user' : 'opp';
    events.push({ minute: 6, team: fav, kind: 'trait', userPoints: 0, oppPoints: 0, momentum: fav === 'user' ? 6 : -6, text: `Series trait watch: ${seriesMods.notes[0]}` });
    used.add(6);
  }

  const scoringMinutes = pickScoringMinutes(scoringParts(userScore).length + scoringParts(oppScore).length);
  let sm = 0;
  scoringParts(userScore).forEach(points => {
    const ev = makeScoringEvent('user', points, matchup, oppRoster);
    ev.minute = scoringMinutes[sm++] || findFreeMinute(used);
    ev.kind = ev.isTry ? 'try' : 'score';
    ev.momentum = points >= 4 ? 16 : 8;
    used.add(ev.minute);
    events.push(ev);
  });
  scoringParts(oppScore).forEach(points => {
    const ev = makeScoringEvent('opp', points, matchup, oppRoster);
    ev.minute = scoringMinutes[sm++] || findFreeMinute(used);
    ev.kind = ev.isTry ? 'try' : 'score';
    ev.momentum = points >= 4 ? -16 : -8;
    used.add(ev.minute);
    events.push(ev);
  });

  matchup.battles.slice(0, 4).forEach(b => {
    const team = b.diff >= 0 ? 'user' : 'opp';
    const winner = b.diff >= 0 ? b.user : b.opp;
    const ev = { minute: findFreeMinute(used), team, kind: 'matchup', userPoints: 0, oppPoints: 0, momentum: team === 'user' ? 7 : -7, text: matchupText(b), playerName: winner.name };
    used.add(ev.minute);
    events.push(ev);
  });

  (benchPlan && benchPlan.events ? benchPlan.events : []).forEach(ev => { ev.minute = findFreeMinute(used, ev.minute); used.add(ev.minute); events.push(ev); });
  (rareTraits && rareTraits.events ? rareTraits.events : []).forEach(ev => {
    ev.minute = findFreeMinute(used, ev.minute);
    if (liveSwing) ev.text += ` Current-play boost counted from ${ev.minute}' only.`;
    used.add(ev.minute); events.push(ev);
  });

  if (gameNo === 3) {
    const deciderTeam = seriesMods && seriesMods.userDecider >= seriesMods.oppDecider ? 'user' : 'opp';
    events.push({ minute: findFreeMinute(used), team: deciderTeam, kind: 'trait', userPoints: 0, oppPoints: 0, momentum: deciderTeam === 'user' ? 8 : -8, text: `Decider pressure: ${deciderTeam === 'user' ? DATA[selectedState].name : DATA[opponentState].name} have more big-game specialists staying composed.` });
  }

  if (goldenPoint) {
    const gpTeam = goldenPoint.winner;
    const p = selectEventPlayer(gpTeam === 'user' ? roster : oppRoster, 1);
    const teamName = gpTeam === 'user' ? DATA[selectedState].name : DATA[opponentState].name;
    events.push({ minute: 80, team: 'neutral', kind: 'golden', userPoints: 0, oppPoints: 0, momentum: 0, text: 'Scores are level after 80. We are into golden point.' });
    events.push({ minute: goldenPoint.minute, team: gpTeam, kind: 'golden', userPoints: gpTeam === 'user' ? 1 : 0, oppPoints: gpTeam === 'opp' ? 1 : 0, momentum: gpTeam === 'user' ? 25 : -25, text: `${teamName}: ${p.name} nails the golden point field goal. Game over.`, scorer: p.name, playerName: p.name });
  }

  let sorted = events.sort((a, b) => a.minute - b.minute);
  sorted = addFillerForLongGaps(sorted, weather, ref);
  let last = '';
  sorted.forEach(ev => {
    if (ev.text === last) ev.text = alternateNeutralText(last);
    last = ev.text;
  });
  return sorted;
}

function addFillerForLongGaps(events, weather, ref) {
  const out = [];
  let lastMinute = 0;
  events.forEach(ev => {
    if (ev.minute - lastMinute >= 9 && ev.minute < 80) {
      const fillerMinute = Math.round((lastMinute + ev.minute) / 2);
      out.push({ minute: fillerMinute, team: 'neutral', kind: 'filler', userPoints: 0, oppPoints: 0, momentum: 0, text: neutralText(weather, ref) });
    }
    out.push(ev);
    lastMinute = ev.minute;
  });
  if (80 - lastMinute >= 8) out.push({ minute: Math.min(79, lastMinute + 6), team: 'neutral', kind: 'filler', userPoints: 0, oppPoints: 0, momentum: 0, text: neutralText(weather, ref) });
  return out.sort((a,b)=>a.minute-b.minute);
}

function pickScoringMinutes(count) {
  const candidates = [6, 12, 18, 24, 31, 37, 44, 51, 58, 64, 70, 76].sort(() => Math.random() - 0.5);
  return candidates.slice(0, count).sort((a, b) => a - b);
}

function findFreeMinute(used, preferred = null) {
  if (preferred != null) {
    let p = Math.max(2, Math.min(90, Math.round(preferred)));
    for (let offset = 0; offset < 6; offset++) {
      const a = p + offset;
      const b = p - offset;
      if (a <= 90 && !used.has(a)) return a;
      if (b >= 2 && !used.has(b)) return b;
    }
  }
  for (let i = 0; i < 40; i++) {
    const m = randMinute();
    if (!used.has(m)) return m;
  }
  for (let m = 2; m <= 89; m++) if (!used.has(m)) return m;
  return randMinute();
}


function generateMatchStats(regUserScore, regOppScore, finalUserScore, finalOppScore, matchup, weather, ref, oppRoster, goldenPoint, venue, home) {
  const userRating = getTeamRating(roster).total;
  const oppRating = getTeamRating(oppRoster).total;
  const edge = userRating - oppRating + matchup.edge * 0.35;
  const userPoss = clampStat(Math.round(50 + edge * 0.35 + (Math.random() * 6 - 3)), 42, 58);
  const oppPoss = 100 - userPoss;
  const userCompletions = clampStat(Math.round(78 + edge * 0.25 + (weather.includes('rain') || weather.includes('Slippery') ? -5 : 0) + Math.random() * 7), 65, 92);
  const oppCompletions = clampStat(Math.round(78 - edge * 0.25 + (weather.includes('rain') || weather.includes('Slippery') ? -5 : 0) + Math.random() * 7), 65, 92);
  const userLineBreaks = clampStat(Math.round(finalUserScore / 6 + Math.max(0, matchup.edge) / 18 + Math.random() * 2), 0, 8);
  const oppLineBreaks = clampStat(Math.round(finalOppScore / 6 + Math.max(0, -matchup.edge) / 18 + Math.random() * 2), 0, 8);
  const userErrors = clampStat(Math.round(10 - userCompletions / 12 + Math.random() * 5 + (ref === 'Penalty happy' ? 1 : 0)), 3, 14);
  const oppErrors = clampStat(Math.round(10 - oppCompletions / 12 + Math.random() * 5 + (ref === 'Penalty happy' ? 1 : 0)), 3, 14);
  const userPenalties = clampStat(Math.round(4 + Math.random() * 5 + (ref === 'Penalty happy' ? 2 : 0) - Math.max(0, edge) / 18), 1, 10);
  const oppPenalties = clampStat(Math.round(4 + Math.random() * 5 + (ref === 'Penalty happy' ? 2 : 0) - Math.max(0, -edge) / 18), 1, 10);
  const userMetres = clampStat(Math.round(1450 + userPoss * 8 + userLineBreaks * 65 + edge * 8 + Math.random() * 120), 1200, 2200);
  const oppMetres = clampStat(Math.round(1450 + oppPoss * 8 + oppLineBreaks * 65 - edge * 8 + Math.random() * 120), 1200, 2200);
  const userTries = scoringParts(regUserScore).filter(points => points === 4 || points === 6).length;
  const oppTries = scoringParts(regOppScore).filter(points => points === 4 || points === 6).length;
  const userCarries = clampStat(Math.round(userMetres / 9.4 + Math.random() * 12), 130, 230);
  const oppCarries = clampStat(Math.round(oppMetres / 9.4 + Math.random() * 12), 130, 230);
  const userTackles = clampStat(Math.round(300 + oppPoss * 1.35 + oppCarries * 0.22 + Math.random() * 30), 280, 430);
  const oppTackles = clampStat(Math.round(300 + userPoss * 1.35 + userCarries * 0.22 + Math.random() * 30), 280, 430);
  const userTackleBusts = clampStat(Math.round(userLineBreaks * 3 + Math.max(0, edge) * 0.55 + Math.random() * 12), 8, 55);
  const oppTackleBusts = clampStat(Math.round(oppLineBreaks * 3 + Math.max(0, -edge) * 0.55 + Math.random() * 12), 8, 55);
  const topBattle = matchup.battles[0];
  const reason = finalUserScore > finalOppScore
    ? `${DATA[selectedState].name} won it through ${topBattle && topBattle.diff >= 0 ? topBattle.user.name + ' winning his matchup' : 'better finishing under pressure'}.`
    : `${DATA[opponentState].name} won it through ${topBattle && topBattle.diff < 0 ? topBattle.opp.name + ' winning his matchup' : 'better field position and late control'}.`;
  return { regUserScore, regOppScore, finalUserScore, finalOppScore, goldenPoint, venue, home, userPoss, oppPoss, userCompletions, oppCompletions, userLineBreaks, oppLineBreaks, userErrors, oppErrors, userPenalties, oppPenalties, userMetres, oppMetres, userCarries, oppCarries, userTackles, oppTackles, userTackleBusts, oppTackleBusts, userTries, oppTries, reason };
}


function renderSeriesStory(stats) {
  if (!stats || !stats.seriesMods) return '';
  const notes = stats.seriesMods.notes.map(n => `<li>${n}</li>`).join('') || '<li>No major series trait swings this game.</li>';
  const pressure = stats.goldenPoint ? 'Golden point pressure decided it.' : (stats.finalUserScore > stats.finalOppScore ? `${DATA[selectedState].name} handled the big moments better.` : `${DATA[opponentState].name} handled the big moments better.`);
  return `<div class="series-story"><h4>Series story</h4><ul>${notes}</ul><p>${pressure}</p></div>`;
}

function renderMatchStats(stats) {
  if (!stats) return '';
  const gp = stats.goldenPoint ? `<p class="golden-note"><strong>Golden point:</strong> scores were ${stats.regUserScore}-${stats.regOppScore} after 80 before the field goal.</p>` : '';
  return `
    ${gp}
    <div class="stats-summary">
      <h4>Match summary stats</h4>
      <div class="stat-grid">
        <span>Stat</span><strong>${DATA[selectedState].name}</strong><strong>${DATA[opponentState].name}</strong>
        <span>Possession</span><b>${stats.userPoss}%</b><b>${stats.oppPoss}%</b>
        <span>Completion rate</span><b>${stats.userCompletions}%</b><b>${stats.oppCompletions}%</b>
        <span>Tries scored</span><b>${stats.userTries}</b><b>${stats.oppTries}</b>
        <span>Line breaks</span><b>${stats.userLineBreaks}</b><b>${stats.oppLineBreaks}</b>
        <span>Carries</span><b>${stats.userCarries}</b><b>${stats.oppCarries}</b>
        <span>Tackles</span><b>${stats.userTackles}</b><b>${stats.oppTackles}</b>
        <span>Tackle busts</span><b>${stats.userTackleBusts}</b><b>${stats.oppTackleBusts}</b>
        <span>Errors</span><b>${stats.userErrors}</b><b>${stats.oppErrors}</b>
        <span>Penalties conceded</span><b>${stats.userPenalties}</b><b>${stats.oppPenalties}</b>
        <span>Run metres</span><b>${stats.userMetres}</b><b>${stats.oppMetres}</b>
        <span>Bench rotation</span><b>${stats.benchPlan ? formatBenchLabel(stats.benchPlan.userBench) : '—'}</b><b>${stats.benchPlan ? formatBenchLabel(stats.benchPlan.oppBench) : '—'}</b>
        <span>Interchange effect</span><b>${stats.benchPlan ? formatSigned(stats.benchPlan.activeUserEdge) : '—'}</b><b>${stats.benchPlan ? formatSigned(stats.benchPlan.activeOppEdge) : '—'}</b>
        <span>Live on-field swing</span><b>${stats.liveSwing ? formatSigned(stats.liveSwing.edge) : '—'}</b><b>${stats.liveSwing ? formatSigned(-stats.liveSwing.edge) : '—'}</b>
      </div>
      ${renderInterchangeSummary(stats.benchPlan)}
      <p class="why-win"><strong>Why:</strong> ${stats.reason}</p>
      <p class="why-win"><strong>Venue:</strong> ${stats.home ? stats.home.label : 'Neutral venue.'}</p>
    </div>`;
}

function formatSigned(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return value >= 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
}

function renderInterchangeSummary(benchPlan) {
  if (!benchPlan || !benchPlan.events || !benchPlan.events.length) return '';
  const rows = benchPlan.events.sort((a,b)=>a.minute-b.minute).map(ev => {
    const side = ev.team === 'user' ? DATA[selectedState].name : DATA[opponentState].name;
    const delta = ev.delta >= 0 ? `+${ev.delta}` : `${ev.delta}`;
    return `<tr><td>${ev.minute}'</td><td>${side}</td><td>${ev.playerName} ON</td><td>${ev.offName || ev.offPlayerName || '—'} OFF</td><td>${ev.positionKey}</td><td>${ev.onRating} vs ${ev.offRating} (${delta})</td></tr>`;
  }).join('');
  return `<div class="interchange-summary"><h4>Interchange summary</h4><p class="muted">Bench players only affect the match from the minute they enter.</p><table><thead><tr><th>Min</th><th>Team</th><th>On</th><th>Off</th><th>Role</th><th>Effect</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function clampStat(value, min, max) { return Math.max(min, Math.min(max, value)); }

function normaliseLeagueScore(score) {
  const legal = [0,1,2,4,6,8,10,12,13,14,15,16,18,20,21,22,24,25,26,28,30,32,34,36,38,40,42,44,46,48,50];
  return legal.reduce((best, n) => Math.abs(n - score) < Math.abs(best - score) ? n : best, legal[0]);
}

function scoringParts(score) {
  // Rugby league scoring only: tries 4, conversions +2, penalty goals 2, field goals 1.
  // This returns individual scoring events that add exactly to the final score.
  const patterns = {
    0: [], 1: [1], 2: [2], 4: [4], 6: [6], 8: [6,2], 10: [6,4], 12: [6,6],
    13: [6,6,1], 14: [6,6,2], 15: [6,6,2,1], 16: [6,6,4], 18: [6,6,6],
    20: [6,6,6,2], 21: [6,6,6,2,1], 22: [6,6,6,4], 24: [6,6,6,6],
    25: [6,6,6,6,1], 26: [6,6,6,6,2], 28: [6,6,6,6,4], 30: [6,6,6,6,6],
    32: [6,6,6,6,6,2], 34: [6,6,6,6,6,4], 36: [6,6,6,6,6,6],
    38: [6,6,6,6,6,6,2], 40: [6,6,6,6,6,6,4], 42: [6,6,6,6,6,6,6],
    44: [6,6,6,6,6,6,6,2], 46: [6,6,6,6,6,6,6,4], 48: [6,6,6,6,6,6,6,6],
    50: [6,6,6,6,6,6,6,6,2]
  };
  return patterns[normaliseLeagueScore(score)] || [6,6,6];
}

function makeScoringEvent(team, points, matchup, oppRoster) {
  const user = team === 'user';
  const targetRoster = user ? roster : oppRoster;
  const player = selectEventPlayer(targetRoster, points);
  const teamName = user ? DATA[selectedState].name : DATA[opponentState].name;
  let text;
  if (points === 6 || points === 4) {
    const assist = selectEventPlayer(targetRoster, 1);
    text = `${teamName}: ${player.name} ${pick(['crashes over','finishes a sweeping edge move','scores off a short ball','pounces on a grubber','beats his opposite number'])}${assist && assist.name !== player.name ? ` after ${assist.name} creates the chance` : ''}${points === 6 ? '. Try converted: 6 points.' : '. Conversion missed: 4 points.'}`;
  } else if (points === 2) {
    text = `${teamName}: ${player.name} kicks a penalty goal after sustained pressure: 2 points.`;
  } else {
    text = `${teamName}: ${player.name} snaps a field goal under pressure: 1 point.`;
  }
  return { minute: randMinute(), team, userPoints: user ? points : 0, oppPoints: user ? 0 : points, text, scorer: player.name, playerName: player.name, isTry: points === 4 || points === 6, points };
}

function selectEventPlayer(targetRoster, points) {
  const keys = points >= 4 ? ['FB','WG1','WG2','CE1','CE2','FE','HB','B1','B2'] : ['HB','FE','HK','FB'];
  const candidates = targetRoster.filter(s => keys.includes(s.key) && s.player).map(s => s.player);
  return pick(candidates.length ? candidates : targetRoster.map(s => s.player).filter(Boolean));
}

function matchupText(b) {
  const winner = b.diff >= 0 ? b.user : b.opp;
  const loser = b.diff >= 0 ? b.opp : b.user;
  const side = b.diff >= 0 ? DATA[selectedState].name : DATA[opponentState].name;
  const stat = b.type === 'PR' || b.type === 'LK' || b.type === 'ED' ? 'collision' : b.type === 'HB' || b.type === 'FE' ? 'playmaking' : 'one-on-one';
  return `${side} advantage: ${winner.name} wins the ${stat} battle against ${loser.name}.`;
}

function signatureEvent(targetRoster, team) {
  const players = targetRoster.map(s => s.player).filter(Boolean).filter(p => SIGNATURES[p.name]);
  if (!players.length || Math.random() > 0.8) return null;
  const p = pick(players);
  const sig = SIGNATURES[p.name];
  return { minute: randMinute(), team, userPoints: 0, oppPoints: 0, text: `${p.name} triggers ${sig.name}: ${sig.text}.`, playerName: p.name };
}

function neutralText(weather, ref, avoidText = '') {
  const base = [
    'Huge defensive set forces a kick from deep territory.',
    'A handling error kills a promising attacking raid.',
    'Big contact in the middle. Origin tempo is brutal.',
    'Repeat set earned from a grubber into the in-goal.',
    'Interchange forwards come on and lift the collision speed.',
    'A try goes upstairs and is ruled no try.',
    'The kick chase pins the returner inside the 10.',
    'Both packs trade heavy carries through the middle.',
    'Smart last-tackle kick turns the back three around.',
    'The defensive line jams in and shuts down the shift.',
    'A captain slows the tempo and settles the next set.',
    'Clean service from dummy-half gets the set rolling.'
  ];
  if (weather === 'Heavy rain' || weather === 'Slippery ball') base.push('The wet ball causes another loose carry.');
  if (ref === 'Strict ruck' || ref === 'Penalty happy') base.push('The referee blows another ruck penalty.');
  const options = base.filter(t => t !== avoidText);
  return pick(options.length ? options : base);
}

function alternateNeutralText(avoidText) {
  return neutralText('Dry track', 'Lets it flow', avoidText);
}

function randMinute() { return Math.floor(Math.random() * 78) + 2; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function chemistry(names) {
  let bonus = 0;
  const found = [];
  CHEMISTRY_COMBOS.forEach(combo => {
    if (combo.names.every(name => names.includes(name))) {
      bonus += combo.bonus;
      found.push(combo.label);
    }
  });
  return { bonus, text: found.length ? found.join('; ') : '' };
}


async function exportTeam() {
  if (!rosterFull()) return;
  const payload = makeChallengePayload(selectedState, roster);
  const token = await encodeChallengeToken(payload);
  teamCode.value = token;
  challengeStatus.textContent = 'Team exported. Copy this challenge token and send it to someone. It is signed so the game can detect broken codes.';
  teamCode.select();
  navigator.clipboard && navigator.clipboard.writeText(token).catch(() => {});
}

async function importOpponent() {
  try {
    const payload = await decodeChallengeToken(teamCode.value.trim());
    if (payload.state === selectedState) {
      challengeStatus.textContent = 'That code is for your own state. Import an opposition state team.';
      return;
    }
    setChallengeOpponent(payload);
    challengeStatus.textContent = `Imported ${payload.stateName || DATA[opponentState].name}. This team replaces the AI opposition for this series.`;
  } catch (e) {
    challengeStatus.textContent = e && e.message ? e.message : 'Could not import that code. Check you pasted the full challenge token.';
  }
}

async function startFriendChallenge() {
  if (!friendCode || !friendCode.value.trim()) {
    friendStatus.textContent = 'Paste a challenge token first.';
    return;
  }
  try {
    const payload = await decodeChallengeToken(friendCode.value.trim());
    const userState = payload.state === 'QLD' ? 'NSW' : 'QLD';
    chooseState(userState);
    setChallengeOpponent(payload);
    document.body.classList.add('challenge-mode');
    friendStatus.textContent = '';
    challengeStatus.textContent = `Friend challenge loaded: ${payload.stateName || DATA[payload.state].name}. Draft ${DATA[userState].name}, then play their squad instead of the AI.`;
    teamCode.value = friendCode.value.trim();
    if (coachStatus) coachStatus.textContent = `Friend challenge loaded: ${payload.stateName || DATA[payload.state].name}. Choose your coach, then draft your ${DATA[userState].name} 17.`;
    squadName.textContent = 'Friend challenge loaded';
    squadNote.textContent = `${payload.stateName || DATA[payload.state].name} are already set. Spin to draft your ${DATA[userState].name} 17.`;
  } catch (e) {
    friendStatus.textContent = e && e.message ? e.message : 'Could not read that challenge token.';
  }
}

function makeChallengePayload(state, sourceRoster) {
  return {
    v: 2,
    game: 'WinTheOrigin',
    state,
    stateName: DATA[state].name,
    createdAt: new Date().toISOString(),
    roster: sourceRoster.map(s => ({ key: s.key, id: s.player && s.player.id })).filter(s => s.id)
  };
}

function setChallengeOpponent(payload) {
  if (!payload || payload.game !== 'WinTheOrigin' || !payload.roster || payload.roster.length !== 17) {
    throw new Error('That token does not contain a complete 17-player Origin side.');
  }
  opponentState = payload.state;
  challengeOpponent = {
    state: payload.state,
    roster: POSITIONS.map(pos => {
      const found = payload.roster.find(s => s.key === pos.key);
      const player = found ? resolveTokenPlayer(found, payload.state) : null;
      return { ...pos, player };
    })
  };
  if (!challengeOpponent.roster.every(s => s.player)) {
    throw new Error('That token is missing one or more players. Export the full 17 again.');
  }
  aiRoster = challengeOpponent.roster.map(s => ({ ...s }));
  aiUsedPlayerIds = new Set(aiRoster.map(s => s.player && s.player.id).filter(Boolean));
  aiAvailableSquads = [];
  oppRosterTitle.textContent = `${payload.stateName || DATA[opponentState].name} challenge 17`;
  renderOppRoster();
  updateProgress();
}

function resolveTokenPlayer(entry, state) {
  if (entry.player) return entry.player; // legacy payload support
  return findPlayerById(state, entry.id) || findPlayerById(state === 'QLD' ? 'NSW' : 'QLD', entry.id);
}

function findPlayerById(state, id) {
  if (!state || !id || !DATA[state]) return null;
  for (const squad of DATA[state].squads) {
    const player = squad.players.find(p => p.id === id);
    if (player) return player;
  }
  return null;
}

async function encodeChallengeToken(payload) {
  const json = JSON.stringify(payload);
  const body = base64UrlEncode(json);
  const sig = (await sha256Hex(body + '.WinTheOrigin.v2')).slice(0, 16);
  return `WTO2.${body}.${sig}`;
}

async function decodeChallengeToken(raw) {
  const token = raw.trim();
  if (!token) throw new Error('Paste a challenge token first.');
  if (token.startsWith('WTO2.')) {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('This challenge token is incomplete.');
    const expected = (await sha256Hex(parts[1] + '.WinTheOrigin.v2')).slice(0, 16);
    if (parts[2] !== expected) throw new Error('This challenge token has been changed or pasted incorrectly.');
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    validateChallengePayload(payload);
    return payload;
  }
  // Legacy v1 support from earlier prototypes.
  const legacy = JSON.parse(decodeURIComponent(escape(atob(token))));
  if (legacy && legacy.version === 1 && legacy.roster && legacy.roster[0] && legacy.roster[0].player) {
    const payload = {
      v: 1,
      game: legacy.game,
      state: legacy.state,
      stateName: legacy.stateName,
      createdAt: legacy.createdAt,
      roster: legacy.roster.map(s => ({ key: s.key, player: s.player }))
    };
    validateChallengePayload(payload);
    return payload;
  }
  throw new Error('This is not a valid Win The Origin challenge token.');
}

function validateChallengePayload(payload) {
  if (!payload || payload.game !== 'WinTheOrigin') throw new Error('This is not a Win The Origin token.');
  if (!['QLD','NSW'].includes(payload.state)) throw new Error('This token does not contain a valid Origin state.');
  if (!Array.isArray(payload.roster) || payload.roster.length !== 17) throw new Error('This token does not contain a full 17-player squad.');
  const keys = new Set(payload.roster.map(s => s.key));
  if (POSITIONS.some(p => !keys.has(p.key))) throw new Error('This token is missing one or more positions.');
}

function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function sha256Hex(str) {
  // Stable browser-safe token signature. This keeps challenge codes portable
  // between local previews and GitHub Pages.
  let a = 0x811c9dc5;
  let b = 0x9e3779b9;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    a ^= c;
    a = Math.imul(a, 0x01000193) >>> 0;
    b ^= (c + i);
    b = Math.imul(b, 0x85ebca6b) >>> 0;
  }
  return (a.toString(16).padStart(8, '0') + b.toString(16).padStart(8, '0')).repeat(4).slice(0, 64);
}

function resetGame() {
  selectedState = null;
  opponentState = null;
  availableSquads = [];
  aiAvailableSquads = [];
  currentSquad = null;
  selectedPlayer = null;
  moveFromKey = null;
  series = null;
  isWatching = false;
  challengeOpponent = null;
  selectedCoach = null;
  opponentCoach = null;
  document.body.classList.remove('challenge-mode');
  draftPickNo = 1;
  roster = POSITIONS.map(pos => ({ ...pos, player: null }));
  aiRoster = POSITIONS.map(pos => ({ ...pos, player: null }));
  usedPlayerIds = new Set();
  aiUsedPlayerIds = new Set();
  choices.innerHTML = '';
  aiChoices.innerHTML = '';
  draftLog.innerHTML = '';
  simResult.innerHTML = '';
  teamCode.value = '';
  challengeStatus.textContent = '';
  if (friendCode) friendCode.value = '';
  if (friendStatus) friendStatus.textContent = '';
  lastGameStats = null;
  lastGameResult = null;
  lastTimelineEvents = [];
  showMode(null);
  squadName.textContent = 'Spin to reveal';
  aiTitle.textContent = 'Waiting for your first pick';
  aiNote.textContent = 'After each of your picks, the opposition spins one historical squad from the other state, shows its options, and makes its selection.';
  spinBtn.disabled = rosterFull() || Boolean(currentSquad);
  stateScreen.classList.remove('hidden');
  if (coachScreen) coachScreen.classList.add('hidden');
  draftScreen.classList.add('hidden');
  resetBtn.classList.add('hidden');
}
