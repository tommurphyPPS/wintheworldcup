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

const stateScreen = document.getElementById('stateScreen');
const draftScreen = document.getElementById('draftScreen');
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
const turnLabel = document.getElementById('turnLabel');
const oppPickingBadge = document.getElementById('oppPickingBadge');
const draftArena = document.getElementById('draftArena');

const SCORE_PROFILES = [
  [6,4], [8,6], [10,6], [12,8], [12,10], [14,10], [14,12], [16,10], [16,12],
  [18,12], [18,14], [20,12], [20,16], [22,12], [22,18], [24,14], [26,18], [30,12], [32,18], [38,10]
];

const VENUES = ['Suncorp Stadium', 'Accor Stadium', 'Melbourne Cricket Ground'];
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
  'Johnathan Thurston': { name: 'Ice in the Veins', bonus: { clutch: 5, kicking: 4 }, text: 'late-game kicking and composure' },
  'Andrew Johns': { name: 'Mastermind', bonus: { attack: 4, kicking: 5 }, text: 'reads the defence and controls territory' },
  'Cameron Smith': { name: 'Control the Ruck', bonus: { defence: 3, clutch: 4, toughness: 2 }, text: 'wins the ruck and manages tempo' },
  'Billy Slater': { name: 'Support Runner', bonus: { attack: 4, speed: 4 }, text: 'appears inside breaks' },
  'Greg Inglis': { name: 'Beast Mode', bonus: { attack: 5, toughness: 4, speed: 2 }, text: 'dominates one-on-one contests' },
  'Wally Lewis': { name: 'The King', bonus: { aura: 6, clutch: 4 }, text: 'lifts the whole side' },
  'Darren Lockyer': { name: 'Calm General', bonus: { clutch: 4, kicking: 4 }, text: 'settles pressure moments' },
  'Cooper Cronk': { name: 'System Master', bonus: { kicking: 4, clutch: 3 }, text: 'plays the percentages' },
  'Allan Langer': { name: 'Alfie Chaos', bonus: { attack: 4, speed: 2, clutch: 2 }, text: 'creates broken-field chances' },
  'Mal Meninga': { name: 'Power Centre', bonus: { attack: 4, toughness: 4 }, text: 'wins contact on the edge' },
  'Dane Gagai': { name: 'Origin Specialist', bonus: { aura: 6, attack: 3 }, text: 'finds another gear in maroon' },
  'Nathan Cleary': { name: 'Ice Controller', bonus: { kicking: 5, clutch: 4 }, text: 'pins corners and closes games' },
  'Brad Fittler': { name: 'Freddy Flow', bonus: { attack: 4, clutch: 4 }, text: 'opens the game with instinct' },
  'James Tedesco': { name: 'Relentless Runner', bonus: { attack: 3, speed: 3, toughness: 2 }, text: 'keeps taking tough carries' },
  'Tom Trbojevic': { name: 'Turbo Mode', bonus: { attack: 5, speed: 4 }, text: 'turns half chances into tries' },
  'Paul Gallen': { name: 'Never Back Down', bonus: { toughness: 5, defence: 3 }, text: 'drags the pack forward' },
  'Payne Haas': { name: 'Relentless Motor', bonus: { toughness: 5, defence: 2 }, text: 'keeps output high late' },
  'Danny Buderus': { name: 'Sharp Service', bonus: { attack: 2, defence: 3, clutch: 2 }, text: 'quickens the ruck' }
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

document.querySelectorAll('.state-btn').forEach(btn => btn.addEventListener('click', () => chooseState(btn.dataset.state)));
spinBtn.addEventListener('click', spinSquad);
resetBtn.addEventListener('click', resetGame);
simulateBtn.addEventListener('click', showSeriesSetup);
exportBtn.addEventListener('click', exportTeam);
importBtn.addEventListener('click', importOpponent);

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
  stateScreen.classList.add('hidden');
  draftScreen.classList.remove('hidden');
  resetBtn.classList.remove('hidden');
  renderRoster();
  renderOppRoster();
  updateProgress();
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
  card.innerHTML = `
    <div>
      <h3>${player.name}</h3>
      <p class="muted">${player.note}</p>
      <div class="tags">${player.positions.map(pos => `<span class="tag">${pos}</span>`).join('')}${sig ? `<span class="tag trait">${sig.name}</span>` : ''}</div>
      <small class="slot-hint">${legalCount !== null ? (legalCount ? `${legalCount} legal open slot${legalCount === 1 ? '' : 's'}` : 'No legal open slots') : 'AI option'}</small>
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
  squadNote.textContent = `${player.name} selected. Now tap one of the highlighted legal positions in your 17.`;
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
  addDraftLog(`Pick ${draftPickNo}: You took ${selectedPlayer.name} from ${currentSquad.name}.`);
  selectedPlayer = null;
  currentSquad = null;
  choices.innerHTML = '<p class="muted">Player drafted. The same draft screen now flips to the opposition pick.</p>';
  draftArena.classList.remove('active-user-turn');
  draftArena.classList.add('active-opp-turn');
  squadName.textContent = 'Opposition pick coming';
  squadNote.textContent = 'Opposition will spin on this same screen, view the squad options, then choose their player.';
  renderRoster();
  updateProgress();
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
      addDraftLog(`Pick ${draftPickNo}: ${DATA[opponentState].name} took ${aiPick.player.name} from ${squad.name}.`);
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
  const scored = [];
  options.forEach(player => {
    const slots = legalSlots(player, aiRoster);
    if (!slots.length) return;
    slots.forEach(slot => {
      const type = slotType(slot.key);
      let score = weightedPlayerScore(player, type);
      if (SIGNATURES[player.name]) score += 4;
      CHEMISTRY_COMBOS.forEach(c => {
        if (c.names.includes(player.name) && c.names.some(n => names.includes(n))) score += c.bonus;
      });
      if (criticalNeed(slot.key, aiRoster)) score += 8;
      if (slot.key.startsWith('B')) score -= 6;
      scored.push({ player, slot, score });
    });
  });
  if (!scored.length) {
    const fallback = options[0];
    return { player: fallback, slot: aiRoster.find(s => !s.player), reason: 'only available legal fit' };
  }
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, Math.min(4, scored.length));
  const chosen = Math.random() < 0.75 ? top[0] : pick(top);
  let reason = criticalNeed(chosen.slot.key, aiRoster) ? `needed a ${chosen.slot.label}` : `highest matchup value at ${chosen.slot.label}`;
  if (SIGNATURES[chosen.player.name]) reason += ` with ${SIGNATURES[chosen.player.name].name}`;
  return { ...chosen, reason };
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
      <div>${slot.player ? slot.player.rating : ''}</div>
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
    <div>${slot.player ? slot.player.rating : legalForSelected || legalMoveTarget ? '+' : ''}</div>
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
  // Opposition coach gets the same right to use the bench to repair weaknesses before each game.
  // It greedily searches legal bench swaps and keeps the swap that improves the opposition's
  // starting-13 rating plus head-to-head edge the most.
  let improved = true;
  let attempts = 0;
  while (improved && attempts < 8) {
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
        const score = opponentOptimiseScore(trial);
        if (score > base + 0.8 && (!best || score > best.score)) best = { bi, si, score };
      });
    });
    if (best) {
      const tmp = aiRoster[best.si].player;
      aiRoster[best.si].player = aiRoster[best.bi].player;
      aiRoster[best.bi].player = tmp;
      improved = true;
    }
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
  if (resetSeries || !series) series = { game: 1, userWins: 0, oppWins: 0, results: [] };
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
  // Team overall is based on the starting 13 only. Bench players can change the matchup after swaps,
  // but they do not inflate the side's headline overall while sitting on the bench.
  const players = startingPlayers(targetRoster);
  if (!players.length) return { total: 0, comboText: '' };
  const avg = key => players.reduce((sum, p) => sum + effectiveStats(p)[key], 0) / players.length;
  const names = players.map(p => p.name);
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
  const stats = effectiveStats(player);
  const weights = POSITION_WEIGHTS[type] || POSITION_WEIGHTS.B;
  let totalWeight = 0;
  let total = 0;
  Object.keys(weights).forEach(k => { total += stats[k] * weights[k]; totalWeight += weights[k]; });
  return total / totalWeight;
}

function effectiveStats(player) {
  const stats = { ...player.stats };
  const sig = SIGNATURES[player.name];
  if (sig) Object.entries(sig.bonus).forEach(([key, value]) => stats[key] = clamp((stats[key] || player.rating) + value));
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
  const stats = effectiveStats(player);
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
  const seriesMods = calculateSeriesModifiers(gameNo, roster, opp);
  const ratingEdge = (userRating - oppRating) * 0.42; // six overall points is a real edge, not an automatic win
  const matchupEdge = matchup.edge * 0.55;
  const randomEdge = (Math.random() * 13 - 6.5);
  const diff = ratingEdge + matchupEdge + weatherModifier(weather, roster, opp) + seriesMods.userBoost - seriesMods.oppBoost + randomEdge;
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

  lastGameStats = generateMatchStats(regulationUserScore, regulationOppScore, userScore, oppScore, matchup, weather, ref, opp, goldenPoint);
  lastGameStats.seriesMods = seriesMods;
  const events = generateGameEvents(gameNo, regulationUserScore, regulationOppScore, matchup, weather, ref, opp, goldenPoint, seriesMods);
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
  const players = startingPlayers(targetRoster);
  return players.reduce((sum, p) => sum + effectiveStats(p)[key], 0) / Math.max(1, players.length);
}

function renderGameShell(gameNo, weather, ref, goldenPoint, matchup, seriesMods) {
  isWatching = true;
  showMode('simulation');
  spinBtn.disabled = true;
  simulateBtn.disabled = true;
  const venue = VENUES[(gameNo - 1) % VENUES.length];
  const lead = seriesMods && seriesMods.notes.length ? seriesMods.notes.slice(0,2).map(n => `<li>${n}</li>`).join('') : '<li>No major series trait modifier before kick-off.</li>';
  simResult.innerHTML = `
    <div class="match-card simulation-page broadcast-page">
      <div class="match-page-head broadcast-head">
        <div>
          <p class="eyebrow">Live Origin broadcast</p>
          <h2>Game ${gameNo} • ${venue}</h2>
          <p class="muted">${weather} • ${ref}${goldenPoint ? ' • Golden point enabled' : ''}</p>
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
  timeline.appendChild(opening);
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
      timeline.appendChild(ft);
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
    timeline.appendChild(div);
    div.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
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
  if (ev.kind === 'trait') {
    return {
      caller: raw,
      analyst: `Those Origin traits are not cosmetic. They shift composure, error risk and momentum when the series tightens.`
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
  series.results.push({ gameNo, userScore, oppScore, won });
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

function renderSeriesFinal() {
  showMode('summary');
  const won = series.userWins > series.oppWins;
  const rows = series.results.map(r => `<li>Game ${r.gameNo}: ${DATA[selectedState].name} ${r.userScore} - ${r.oppScore} ${DATA[opponentState].name}</li>`).join('');
  simResult.innerHTML = `<div class="post-game-page result-card final-series"><h2>${won ? 'Origin series won' : 'Series lost'}</h2><p>${DATA[selectedState].name} ${series.userWins} - ${series.oppWins} ${DATA[opponentState].name}</p><ul class="series-results">${rows}</ul><p class="muted">Export your side and challenge another drafted opponent, or generate a new team.</p><div class="button-row"><button class="ghost" onclick="exportTeam()">Export this team</button><button class="primary" onclick="resetGame()">Generate a new team</button></div></div>`;
}

function generateGameEvents(gameNo, userScore, oppScore, matchup, weather, ref, oppRoster, goldenPoint, seriesMods) {
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
    const ev = { minute: findFreeMinute(used), team, kind: 'matchup', userPoints: 0, oppPoints: 0, momentum: team === 'user' ? 7 : -7, text: matchupText(b) };
    used.add(ev.minute);
    events.push(ev);
  });

  const sigUser = signatureEvent(roster, 'user');
  if (sigUser) { sigUser.minute = findFreeMinute(used); sigUser.kind = 'trait'; sigUser.momentum = 7; used.add(sigUser.minute); events.push(sigUser); }
  const sigOpp = signatureEvent(oppRoster, 'opp');
  if (sigOpp) { sigOpp.minute = findFreeMinute(used); sigOpp.kind = 'trait'; sigOpp.momentum = -7; used.add(sigOpp.minute); events.push(sigOpp); }

  if (gameNo === 3) {
    const deciderTeam = seriesMods && seriesMods.userDecider >= seriesMods.oppDecider ? 'user' : 'opp';
    events.push({ minute: findFreeMinute(used), team: deciderTeam, kind: 'trait', userPoints: 0, oppPoints: 0, momentum: deciderTeam === 'user' ? 8 : -8, text: `Decider pressure: ${deciderTeam === 'user' ? DATA[selectedState].name : DATA[opponentState].name} have more big-game specialists staying composed.` });
  }

  if (goldenPoint) {
    const gpTeam = goldenPoint.winner;
    const p = selectEventPlayer(gpTeam === 'user' ? roster : oppRoster, 1);
    const teamName = gpTeam === 'user' ? DATA[selectedState].name : DATA[opponentState].name;
    events.push({ minute: 80, team: 'neutral', kind: 'golden', userPoints: 0, oppPoints: 0, momentum: 0, text: 'Scores are level after 80. We are into golden point.' });
    events.push({ minute: goldenPoint.minute, team: gpTeam, kind: 'golden', userPoints: gpTeam === 'user' ? 1 : 0, oppPoints: gpTeam === 'opp' ? 1 : 0, momentum: gpTeam === 'user' ? 25 : -25, text: `${teamName}: ${p.name} nails the golden point field goal. Game over.` });
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

function findFreeMinute(used) {
  for (let i = 0; i < 40; i++) {
    const m = randMinute();
    if (!used.has(m)) return m;
  }
  for (let m = 2; m <= 79; m++) if (!used.has(m)) return m;
  return randMinute();
}


function generateMatchStats(regUserScore, regOppScore, finalUserScore, finalOppScore, matchup, weather, ref, oppRoster, goldenPoint) {
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
  const topBattle = matchup.battles[0];
  const reason = finalUserScore > finalOppScore
    ? `${DATA[selectedState].name} won it through ${topBattle && topBattle.diff >= 0 ? topBattle.user.name + ' winning his matchup' : 'better finishing under pressure'}.`
    : `${DATA[opponentState].name} won it through ${topBattle && topBattle.diff < 0 ? topBattle.opp.name + ' winning his matchup' : 'better field position and late control'}.`;
  return { regUserScore, regOppScore, finalUserScore, finalOppScore, goldenPoint, userPoss, oppPoss, userCompletions, oppCompletions, userLineBreaks, oppLineBreaks, userErrors, oppErrors, userPenalties, oppPenalties, userMetres, oppMetres, reason };
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
        <span>Line breaks</span><b>${stats.userLineBreaks}</b><b>${stats.oppLineBreaks}</b>
        <span>Errors</span><b>${stats.userErrors}</b><b>${stats.oppErrors}</b>
        <span>Penalties conceded</span><b>${stats.userPenalties}</b><b>${stats.oppPenalties}</b>
        <span>Run metres</span><b>${stats.userMetres}</b><b>${stats.oppMetres}</b>
      </div>
      <p class="why-win"><strong>Why:</strong> ${stats.reason}</p>
    </div>`;
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
  return { minute: randMinute(), team, userPoints: user ? points : 0, oppPoints: user ? 0 : points, text, scorer: player.name, isTry: points === 4 || points === 6, points };
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
  return { minute: randMinute(), team, userPoints: 0, oppPoints: 0, text: `${p.name} triggers ${sig.name}: ${sig.text}.` };
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

function exportTeam() {
  if (!rosterFull()) return;
  const payload = {
    version: 1,
    game: 'WinTheOrigin',
    state: selectedState,
    stateName: DATA[selectedState].name,
    createdAt: new Date().toISOString(),
    roster: roster.map(s => ({ key: s.key, label: s.label, player: s.player }))
  };
  teamCode.value = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  challengeStatus.textContent = 'Team exported. Copy this code and send it to someone to challenge your Origin side.';
  teamCode.select();
  navigator.clipboard && navigator.clipboard.writeText(teamCode.value).catch(() => {});
}

function importOpponent() {
  try {
    const payload = JSON.parse(decodeURIComponent(escape(atob(teamCode.value.trim()))));
    if (!payload || payload.game !== 'WinTheOrigin' || !payload.roster || payload.roster.length !== 17) throw new Error('Bad code');
    if (payload.state === selectedState) {
      challengeStatus.textContent = 'That code is for your own state. Import an opposition state team.';
      return;
    }
    opponentState = payload.state;
    challengeOpponent = {
      state: payload.state,
      roster: POSITIONS.map(pos => {
        const found = payload.roster.find(s => s.key === pos.key);
        return { ...pos, player: found ? found.player : null };
      })
    };
    aiRoster = challengeOpponent.roster.map(s => ({ ...s }));
    oppRosterTitle.textContent = `${payload.stateName || DATA[opponentState].name} challenge 17`;
    challengeStatus.textContent = `Imported ${payload.stateName || DATA[opponentState].name}. This team will be your series opponent.`;
    renderOppRoster();
    updateProgress();
  } catch (e) {
    challengeStatus.textContent = 'Could not import that code. Check you pasted the full challenge code.';
  }
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
  lastGameStats = null;
  lastGameResult = null;
  lastTimelineEvents = [];
  showMode(null);
  squadName.textContent = 'Spin to reveal';
  aiTitle.textContent = 'Waiting for your first pick';
  aiNote.textContent = 'After each of your picks, the opposition spins one historical squad from the other state, shows its options, and makes its selection.';
  spinBtn.disabled = rosterFull() || Boolean(currentSquad);
  stateScreen.classList.remove('hidden');
  draftScreen.classList.add('hidden');
  resetBtn.classList.add('hidden');
}
