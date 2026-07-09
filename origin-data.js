const POSITIONS = [
  { key: 'FB', label: 'Fullback' },
  { key: 'WG1', label: 'Wing' },
  { key: 'CE1', label: 'Centre' },
  { key: 'CE2', label: 'Centre' },
  { key: 'WG2', label: 'Wing' },
  { key: 'FE', label: 'Five-eighth' },
  { key: 'HB', label: 'Halfback' },
  { key: 'PR1', label: 'Prop' },
  { key: 'HK', label: 'Hooker' },
  { key: 'PR2', label: 'Prop' },
  { key: 'ED1', label: 'Edge' },
  { key: 'ED2', label: 'Edge' },
  { key: 'LK', label: 'Lock' },
  { key: 'B1', label: 'Bench' },
  { key: 'B2', label: 'Bench' },
  { key: 'B3', label: 'Bench' },
  { key: 'B4', label: 'Bench' }
];

// Data note: v2 uses full 17+ player Origin squads/era squads so every spin shows the whole team.
// The current 2026 squads include extended interchange/reserve players, while historical squads are curated representative Origin-era squads.
const DATA = {
  QLD: {
    name: 'Queensland Maroons',
    colour: '#7b1231',
    gauntlet: ['NSW 1985', 'NSW 1992', 'NSW 2005', 'NSW 2014', 'NSW 2018', 'All-Time NSW'],
    squads: [
      squad('qld-1980', 'Queensland 1980 Origin Birth', [
        ['Colin Scott',['FB'],87,'First Origin fullback'], ['Kerry Boustead',['WG'],90,'Flying winger'], ['Chris Close',['CE','WG'],91,'Origin hard-head'], ['Mal Meninga',['CE'],97,'Power centre and goal-kicker'], ['John Ribot',['WG'],86,'Finisher'], ['Wally Lewis',['FE','LK'],99,'The King'], ['Ross Strudwick',['HB'],84,'Game manager'], ['Arthur Beetson',['PR','LK'],96,'First Origin captain'], ['John Lang',['HK'],84,'Tough hooker'], ['Rod Morris',['PR'],86,'Front-row grind'], ['Rohan Hancock',['ED','PR'],84,'Hard edge'], ['Rod Reddy',['ED','LK'],88,'Rugged forward'], ['Greg Oliphant',['LK','HB'],84,'Old-school utility'], ['Dave Brown',['B','PR'],82,'Bench middle'], ['Greg Conescu',['B','HK'],83,'Hooking depth'], ['Norm Carr',['B','ED'],82,'Bench forward'], ['John Dowling',['B','PR'],82,'Bench impact']
      ]),
      squad('qld-1982', 'Queensland 1982 Early Maroons', [
        ['Colin Scott',['FB'],87,'Safe at the back'], ['Kerry Boustead',['WG'],90,'Elite finisher'], ['Mal Meninga',['CE'],97,'Representative giant'], ['Chris Close',['CE'],91,'Tough centre'], ['John Ribot',['WG'],86,'Wing speed'], ['Wally Lewis',['FE','LK'],99,'Dominant playmaker'], ['Mark Murray',['HB'],88,'Sharp half'], ['Dave Brown',['PR'],84,'Middle workhorse'], ['John Lang',['HK'],85,'Hooker'], ['Rod Morris',['PR'],87,'Prop power'], ['Rohan Hancock',['ED'],84,'Edge defence'], ['Paul Vautin',['ED','LK'],91,'Fatty'], ['Bryan Niebling',['LK','PR'],86,'Middle toughness'], ['Greg Conescu',['B','HK'],84,'Bench hooker'], ['Mitch Brennan',['B','WG'],82,'Outside back cover'], ['Norm Carr',['B','ED'],82,'Forward cover'], ['Tony Currie',['B','WG','CE'],84,'Backline spark']
      ]),
      squad('qld-1984', 'Queensland 1984 Lewis Control', [
        ['Colin Scott',['FB'],87,'Reliable fullback'], ['Kerry Boustead',['WG'],90,'Class winger'], ['Mal Meninga',['CE'],97,'Strike centre'], ['Gene Miles',['CE','ED'],92,'Class and size'], ['Tony Currie',['WG','CE'],86,'Backline threat'], ['Wally Lewis',['FE'],99,'The King'], ['Mark Murray',['HB'],88,'Tactical half'], ['Greg Dowling',['PR'],88,'Front-row presence'], ['Greg Conescu',['HK'],86,'Hooking craft'], ['Bryan Niebling',['PR','LK'],87,'Middle engine'], ['Paul Vautin',['ED','LK'],91,'Work-rate leader'], ['Rohan Hancock',['ED'],84,'Tough edge'], ['Bob Lindner',['LK','ED'],92,'Elite lock'], ['Chris Close',['B','CE'],90,'Bench fire'], ['Rod Morris',['B','PR'],86,'Prop depth'], ['John Ribot',['B','WG'],84,'Back cover'], ['Billy Moore',['B','ED'],86,'Queenslander energy']
      ]),
      squad('qld-1987', 'Queensland 1987 Giants', [
        ['Gary Belcher',['FB'],93,'Silky fullback'], ['Kerry Boustead',['WG'],89,'Veteran finisher'], ['Mal Meninga',['CE'],97,'Goal-kicking centre'], ['Gene Miles',['CE','ED'],93,'Big strike centre'], ['Dale Shearer',['WG','FB'],91,'Explosive outside back'], ['Wally Lewis',['FE'],99,'Captain and king'], ['Allan Langer',['HB'],96,'Alfie chaos'], ['Greg Dowling',['PR'],88,'Middle power'], ['Greg Conescu',['HK'],86,'Hooker'], ['Bryan Niebling',['PR','LK'],87,'Front-row toughness'], ['Paul Vautin',['ED','LK'],91,'Fatty'], ['Bob Lindner',['ED','LK'],92,'Class forward'], ['Trevor Gillmeister',['LK','ED'],94,'Axe defence'], ['Chris Close',['B','CE'],90,'Origin specialist'], ['Tony Currie',['B','WG','CE'],85,'Backline cover'], ['Peter Jackson',['B','CE','FE'],89,'Skill utility'], ['Sam Backo',['B','PR'],88,'Bench prop']
      ]),
      squad('qld-1989', 'Queensland 1989 Kings', [
        ['Gary Belcher',['FB'],93,'Class fullback'], ['Dale Shearer',['WG','FB'],91,'Speed and power'], ['Mal Meninga',['CE'],97,'Origin icon'], ['Gene Miles',['CE','ED'],93,'Big centre'], ['Alan McIndoe',['WG'],86,'Finisher'], ['Wally Lewis',['FE','LK'],99,'The King'], ['Allan Langer',['HB'],96,'Alfie'], ['Sam Backo',['PR'],88,'Front-row punch'], ['Kerrod Walters',['HK'],91,'Elite service'], ['Greg Dowling',['PR'],88,'Prop'], ['Bob Lindner',['ED','LK'],92,'Class forward'], ['Paul Vautin',['ED','LK'],91,'Leader'], ['Trevor Gillmeister',['LK','ED'],94,'Defensive menace'], ['Peter Jackson',['B','CE','FE'],89,'Creative utility'], ['Billy Moore',['B','ED'],87,'Passion forward'], ['Mark Hohn',['B','PR'],87,'Middle impact'], ['Kevin Walters',['B','FE','HB'],91,'Bench playmaker']
      ]),
      squad('qld-1991', 'Queensland 1991 Walters Era', [
        ['Gary Belcher',['FB'],93,'Veteran fullback'], ['Dale Shearer',['WG','FB'],91,'Explosive'], ['Mal Meninga',['CE'],97,'Captain power'], ['Gene Miles',['CE'],92,'Class centre'], ['Willie Carne',['WG'],88,'Big winger'], ['Kevin Walters',['FE','HB'],91,'Creative five-eighth'], ['Allan Langer',['HB'],96,'Alfie'], ['Martin Bella',['PR'],88,'Hard prop'], ['Kerrod Walters',['HK'],91,'Hooker'], ['Steve Jackson',['PR'],86,'Front-row depth'], ['Trevor Gillmeister',['ED','LK'],94,'Axe'], ['Bob Lindner',['ED','LK'],92,'Mobile forward'], ['Billy Moore',['LK','ED'],88,'Queenslander'], ['Steve Renouf',['B','CE'],92,'Pearl emerging'], ['Mark Hohn',['B','PR'],87,'Bench middle'], ['Gary Coyne',['B','CE','ED'],87,'Utility'], ['Peter Jackson',['B','CE','FE'],88,'Backline skill']
      ]),
      squad('qld-1995', 'Queensland 1995 Miracle', [
        ['Matt Seers',['FB'],84,'Underdog fullback'], ['Willie Carne',['WG'],88,'Wing power'], ['Steve Renouf',['CE'],92,'The Pearl'], ['Chris Johns',['CE'],84,'Centre'], ['Michael Hancock',['WG'],88,'Broncos finisher'], ['Ben Ikin',['FE','CE'],85,'Teenage Origin story'], ['Adrian Lam',['HB','FE'],87,'Crafty half'], ['Mark Hohn',['PR'],87,'Middle'], ['Wayne Bartrim',['HK'],86,'Hooker and goals'], ['Martin Bella',['PR'],88,'Prop'], ['Gary Larson',['ED','LK'],88,'Workhorse'], ['Trevor Gillmeister',['ED','LK'],94,'Captain courage'], ['Billy Moore',['LK','ED'],88,'Queenslander call'], ['Danny Moore',['B','CE','WG'],84,'Bench back'], ['Andrew Gee',['B','PR','ED'],88,'Forward cover'], ['Jason Smith',['B','LK','FE'],89,'Skill utility'], ['Terry Cook',['B','PR'],82,'Bench middle']
      ]),
      squad('qld-1998', 'Queensland 1998 Super League Reset', [
        ['Darren Lockyer',['FB','FE'],98,'Class anywhere'], ['Wendell Sailor',['WG'],91,'Power winger'], ['Steve Renouf',['CE'],92,'Pearl'], ['Tonnie Carroll',['CE','ED'],89,'Tough utility'], ['Michael Hancock',['WG'],88,'Finisher'], ['Kevin Walters',['FE','HB'],91,'Veteran playmaker'], ['Allan Langer',['HB'],96,'Alfie'], ['Shane Webcke',['PR'],95,'Elite prop'], ['Kerrod Walters',['HK'],90,'Hooker'], ['Andrew Gee',['PR','ED'],88,'Forward leader'], ['Gorden Tallis',['ED','LK'],96,'Raging Bull'], ['Gary Larson',['ED','LK'],88,'Workhorse'], ['Jason Smith',['LK','FE'],89,'Ball-playing lock'], ['Paul Green',['B','HB'],86,'Bench half'], ['John Plath',['B','HK','LK'],86,'Utility'], ['Brad Thorn',['B','ED','PR'],91,'Power forward'], ['Kevin Campion',['B','ED'],88,'Hard edge']
      ]),
      squad('qld-2001', 'Queensland 2001 Alfie Returns', [
        ['Darren Lockyer',['FB','FE'],98,'Class anywhere'], ['Lote Tuqiri',['WG','CE'],90,'Power winger'], ['Paul Bowman',['CE'],88,'Defensive centre'], ['Chris Walker',['WG','CE'],86,'Speed'], ['Wendell Sailor',['WG'],91,'Power finisher'], ['Ben Ikin',['FE'],86,'Five-eighth'], ['Allan Langer',['HB'],96,'Alfie returns'], ['Shane Webcke',['PR'],95,'Elite prop'], ['John Doyle',['HK'],84,'Hooker'], ['Petero Civoniceva',['PR'],96,'Relentless middle'], ['Gorden Tallis',['ED','LK'],96,'Raging Bull'], ['Brad Thorn',['ED','PR'],91,'Power edge'], ['Kevin Campion',['LK','ED'],88,'Tough forward'], ['John Plath',['B','HK','LK'],86,'Utility'], ['Dane Carlaw',['B','ED','PR'],87,'Bench forward'], ['Carl Webb',['B','PR'],88,'Impact prop'], ['Chris Flannery',['B','ED','CE'],86,'Utility']
      ]),
      squad('qld-2003', 'Queensland 2003 Transition', [
        ['Darren Lockyer',['FB','FE'],98,'Elite spine'], ['Lote Tuqiri',['WG'],90,'Wing power'], ['Justin Hodges',['CE'],92,'Elite centre'], ['Paul Bowman',['CE'],88,'Defensive centre'], ['Matt Sing',['WG','CE'],89,'Finisher'], ['Shaun Berrigan',['FE','HK','CE'],89,'Utility playmaker'], ['Scott Prince',['HB'],90,'Halfback'], ['Shane Webcke',['PR'],95,'Prop leader'], ['Cameron Smith',['HK','LK'],99,'Control and craft'], ['Petero Civoniceva',['PR'],96,'Middle leader'], ['Gorden Tallis',['ED','LK'],96,'Raging Bull'], ['Michael Crocker',['ED','LK'],90,'Aggressive edge'], ['Dane Carlaw',['LK','ED','PR'],87,'Forward utility'], ['Chris Flannery',['B','ED','CE'],86,'Utility'], ['Carl Webb',['B','PR'],88,'Impact'], ['Corey Parker',['B','LK','ED'],92,'Work-rate'], ['Billy Slater',['B','FB','WG'],98,'Emerging fullback']
      ]),
      squad('qld-2006', 'Queensland 2006 Dynasty Begins', [
        ['Karmichael Hunt',['FB'],89,'Young fullback'], ['Brent Tate',['WG','CE'],90,'Brave outside back'], ['Greg Inglis',['CE','WG','FB'],98,'Big-game weapon'], ['Justin Hodges',['CE'],92,'Elite centre'], ['Adam Mogg',['WG','CE'],87,'Series hero'], ['Darren Lockyer',['FE'],98,'Captain class'], ['Johnathan Thurston',['HB','FE'],99,'Clutch genius'], ['Steve Price',['PR'],93,'Front-row leader'], ['Cameron Smith',['HK','LK'],99,'Control and craft'], ['Petero Civoniceva',['PR'],96,'Relentless middle'], ['Nate Myles',['ED','PR'],90,'Tough forward'], ['Carl Webb',['ED','PR'],88,'Impact edge'], ['Dallas Johnson',['LK'],91,'Tackle machine'], ['Shaun Berrigan',['B','HK','CE'],89,'Utility'], ['Sam Thaiday',['B','ED','PR'],93,'Energy forward'], ['Ben Ross',['B','PR'],87,'Bench prop'], ['Matt Bowen',['B','FB','HB'],90,'X-factor']
      ]),
      squad('qld-2008', 'Queensland 2008 Dynasty Engine', [
        ['Billy Slater',['FB'],98,'Explosive fullback'], ['Darius Boyd',['WG','FB'],92,'Origin finisher'], ['Greg Inglis',['CE','WG'],98,'Strike weapon'], ['Justin Hodges',['CE'],92,'Centre'], ['Israel Folau',['WG','CE'],92,'Aerial power'], ['Darren Lockyer',['FE'],98,'Playmaking class'], ['Johnathan Thurston',['HB','FE'],99,'Genius half'], ['Steve Price',['PR'],93,'Prop'], ['Cameron Smith',['HK','LK'],99,'Hooker control'], ['Petero Civoniceva',['PR'],96,'Middle'], ['Sam Thaiday',['ED','PR'],93,'Energy'], ['Nate Myles',['ED','PR'],90,'Tough'], ['Dallas Johnson',['LK'],91,'Defence'], ['Karmichael Hunt',['B','FB','CE'],89,'Utility back'], ['Ben Hannant',['B','PR'],89,'Bench prop'], ['Michael Crocker',['B','ED'],90,'Aggression'], ['Cooper Cronk',['B','HB'],96,'System master']
      ]),
      squad('qld-2010', 'Queensland 2010 Dynasty Peak', [
        ['Billy Slater',['FB'],98,'Peak fullback'], ['Darius Boyd',['WG','FB'],92,'Finisher'], ['Greg Inglis',['CE','WG','FB'],98,'Big-game weapon'], ['Willie Tonga',['CE'],89,'Centre'], ['Israel Folau',['WG','CE'],92,'Aerial strike'], ['Darren Lockyer',['FE'],98,'Captain'], ['Johnathan Thurston',['HB','FE'],99,'Halfback genius'], ['Matt Scott',['PR'],93,'Middle leader'], ['Cameron Smith',['HK','LK'],99,'Control'], ['Petero Civoniceva',['PR'],96,'Veteran prop'], ['Sam Thaiday',['ED','PR'],93,'Forward energy'], ['Nate Myles',['ED','PR'],90,'Toughness'], ['Ashley Harrison',['LK','ED'],90,'Reliable lock'], ['Cooper Cronk',['B','HB'],96,'Bench playmaker'], ['Ben Hannant',['B','PR'],89,'Prop'], ['David Shillington',['B','PR'],88,'Middle'], ['Dave Taylor',['B','ED'],87,'Impact edge']
      ]),
      squad('qld-2013', 'Queensland 2013 Eight Straight', [
        ['Billy Slater',['FB'],98,'Elite fullback'], ['Darius Boyd',['WG'],92,'Wing finisher'], ['Greg Inglis',['CE'],98,'Weapon'], ['Justin Hodges',['CE'],92,'Centre leader'], ['Brent Tate',['WG','CE'],90,'Warrior'], ['Johnathan Thurston',['FE','HB'],99,'Clutch'], ['Cooper Cronk',['HB'],96,'Control'], ['Matt Scott',['PR'],93,'Prop'], ['Cameron Smith',['HK'],99,'Captain'], ['Nate Myles',['PR','ED'],90,'Middle grit'], ['Chris McQueen',['ED'],87,'Edge'], ['Sam Thaiday',['ED','PR'],93,'Energy'], ['Corey Parker',['LK','ED'],92,'Work-rate'], ['Daly Cherry-Evans',['B','HB'],91,'Bench half'], ['Ben Te’o',['B','ED'],88,'Impact'], ['Josh Papalii',['B','PR','ED'],91,'Power'], ['Matt Gillett',['B','ED'],91,'Edge machine']
      ]),
      squad('qld-2015', 'Queensland 2015 Legends Last Stand', [
        ['Billy Slater',['FB'],98,'Fullback great'], ['Darius Boyd',['WG'],92,'Finisher'], ['Greg Inglis',['CE','FB'],98,'Weapon'], ['Justin Hodges',['CE'],92,'Legend centre'], ['Will Chambers',['WG','CE'],90,'Competitive back'], ['Johnathan Thurston',['FE','HB'],99,'Genius'], ['Cooper Cronk',['HB'],96,'System master'], ['Matt Scott',['PR'],93,'Middle leader'], ['Cameron Smith',['HK'],99,'Captain'], ['Nate Myles',['PR','ED'],90,'Tough'], ['Aidan Guerra',['ED'],88,'Edge'], ['Sam Thaiday',['ED','PR'],93,'Energy'], ['Corey Parker',['LK','ED'],92,'Work-rate and goals'], ['Michael Morgan',['B','FE','CE'],90,'Utility'], ['Josh McGuire',['B','PR','LK'],90,'Middle'], ['Matt Gillett',['B','ED'],91,'Edge'], ['Daly Cherry-Evans',['B','HB'],91,'Half cover']
      ]),
      squad('qld-2017', 'Queensland 2017 Thurston Farewell', [
        ['Billy Slater',['FB'],98,'Returning legend'], ['Valentine Holmes',['WG','FB'],91,'Speed and kicking'], ['Will Chambers',['CE'],90,'Centre'], ['Dane Gagai',['CE','WG'],94,'Origin specialist'], ['Corey Oates',['WG'],88,'Big winger'], ['Johnathan Thurston',['FE','HB'],99,'Clutch genius'], ['Cooper Cronk',['HB'],96,'Control'], ['Dylan Napa',['PR'],87,'Impact prop'], ['Cameron Smith',['HK'],99,'Captain'], ['Jarrod Wallace',['PR'],87,'Middle'], ['Gavin Cooper',['ED'],88,'Edge runner'], ['Matt Gillett',['ED'],91,'Edge machine'], ['Josh McGuire',['LK','PR'],90,'Middle'], ['Michael Morgan',['B','FE','CE'],90,'Utility'], ['Coen Hess',['B','ED'],88,'Impact edge'], ['Josh Papalii',['B','PR','ED'],91,'Power'], ['Tim Glasby',['B','PR'],86,'Bench middle']
      ]),
      squad('qld-2020', 'Queensland 2020 Underdogs', [
        ['Valentine Holmes',['FB','WG'],91,'Speed and kicking'], ['Xavier Coates',['WG'],88,'Aerial winger'], ['Brenko Lee',['CE'],84,'Centre'], ['Dane Gagai',['CE','WG'],94,'Origin specialist'], ['Edrick Lee',['WG'],84,'Tall winger'], ['Cameron Munster',['FE'],96,'Chaos and clutch'], ['Daly Cherry-Evans',['HB'],91,'Captain half'], ['Christian Welch',['PR'],89,'Middle leader'], ['Jake Friend',['HK'],87,'Veteran hooker'], ['Josh Papalii',['PR'],91,'Power prop'], ['Felise Kaufusi',['ED'],89,'Edge defence'], ['Kurt Capewell',['ED','CE'],88,'Utility edge'], ['Tino Fa’asuamaleaui',['LK','PR'],92,'Enforcer'], ['Ben Hunt',['B','HB','HK'],91,'Utility spine'], ['Lindsay Collins',['B','PR'],89,'Impact middle'], ['Jai Arrow',['B','LK','PR'],89,'Tough middle'], ['Jaydn Su’A',['B','ED'],87,'Edge impact']
      ]),
      squad('qld-2022', 'Queensland 2022 New Wave', [
        ['Kalyn Ponga',['FB'],94,'X-factor fullback'], ['Selwyn Cobbo',['WG'],89,'Young flyer'], ['Valentine Holmes',['CE','WG','FB'],91,'Speed and goals'], ['Dane Gagai',['CE','WG'],94,'Origin specialist'], ['Murray Taulagi',['WG'],88,'Strong carries'], ['Cameron Munster',['FE'],96,'Clutch chaos'], ['Daly Cherry-Evans',['HB'],91,'Control'], ['Tino Fa’asuamaleaui',['PR','LK'],92,'Enforcer'], ['Ben Hunt',['HK','HB'],91,'Spine utility'], ['Josh Papalii',['PR'],91,'Power'], ['Felise Kaufusi',['ED'],89,'Edge'], ['Kurt Capewell',['ED','CE'],88,'Utility'], ['Patrick Carrigan',['LK','PR'],91,'Middle engine'], ['Harry Grant',['B','HK'],94,'Modern hooker'], ['Lindsay Collins',['B','PR'],89,'Impact'], ['Reuben Cotter',['B','LK','PR'],91,'High-motor middle'], ['Jeremiah Nanai',['B','ED'],89,'Edge strike']
      ]),
      squad('qld-2026', 'Queensland 2026 Current Squad', [
        ['Kalyn Ponga',['FB'],94,'X-factor fullback'], ['Selwyn Cobbo',['WG'],89,'Power winger'], ['Robert Toia',['CE'],86,'Current centre'], ['Hamiso Tabuai-Fidow',['CE','WG','FB'],92,'The Hammer'], ['Jojo Fifita',['WG'],87,'Current winger'], ['Cameron Munster',['FE'],96,'Captain chaos'], ['Sam Walker',['HB'],89,'Creative half'], ['Thomas Flegler',['PR'],89,'Middle punch'], ['Harry Grant',['HK','B'],94,'Modern hooker'], ['Tino Fa’asuamaleaui',['PR','LK'],92,'Enforcer'], ['Briton Nikora',['ED'],88,'Edge runner'], ['Kurt Capewell',['ED','CE'],88,'Utility edge'], ['Reuben Cotter',['LK','PR'],91,'High-motor middle'], ['Max Plath',['B','LK','HK'],87,'Utility forward'], ['Pat Carrigan',['B','LK','PR'],91,'Middle engine'], ['Jeremiah Nanai',['B','ED'],89,'Edge strike'], ['Trent Loiero',['B','ED','LK'],87,'Forward cover'], ['Reece Walsh',['B','FB'],91,'Explosive reserve'], ['Murray Taulagi',['B','WG'],88,'Wing cover'], ['Corey Horsburgh',['B','PR','LK'],87,'Middle cover']
      ]),
      squad('qld-alltime', 'Queensland All-Time Legends', [
        ['Billy Slater',['FB'],99,'All-time fullback'], ['Dale Shearer',['WG','FB'],93,'Explosive outside back'], ['Mal Meninga',['CE'],99,'Immortal-level centre'], ['Greg Inglis',['CE','WG','FB'],99,'Big-game weapon'], ['Darius Boyd',['WG','FB'],93,'Origin finisher'], ['Wally Lewis',['FE','LK'],100,'The King'], ['Johnathan Thurston',['HB','FE'],100,'Clutch genius'], ['Arthur Beetson',['PR','LK'],98,'Origin foundation'], ['Cameron Smith',['HK','LK'],100,'Control and craft'], ['Petero Civoniceva',['PR'],97,'Relentless middle'], ['Gorden Tallis',['ED','LK'],97,'Raging Bull'], ['Bob Lindner',['ED','LK'],94,'Class forward'], ['Trevor Gillmeister',['LK','ED'],95,'Axe defence'], ['Cooper Cronk',['B','HB'],97,'System master'], ['Darren Lockyer',['B','FB','FE'],99,'Class anywhere'], ['Shane Webcke',['B','PR'],96,'Elite prop'], ['Allan Langer',['B','HB'],97,'Alfie chaos']
      ])
    ]
  },
  NSW: {
    name: 'NSW Blues',
    colour: '#1b76c5',
    gauntlet: ['QLD 1989', 'QLD 1995', 'QLD 2006', 'QLD 2013', 'QLD 2020', 'All-Time QLD'],
    squads: [
      squad('nsw-1980', 'NSW 1980 First Blues', [
        ['Graham Eadie',['FB'],91,'Class fullback'], ['Steve Rogers',['CE','WG'],93,'Elite back'], ['Mick Cronin',['CE'],92,'Goal-kicking centre'], ['Chris Anderson',['WG'],85,'Wing'], ['Eric Grothe Sr',['WG'],92,'Power winger'], ['Brett Kenny',['FE','CE'],96,'Big-game five-eighth'], ['Tom Raudonikis',['HB'],91,'First captain'], ['Steve Roach',['PR'],94,'Blocker'], ['Max Krilich',['HK'],88,'Hooker'], ['Craig Young',['PR'],90,'Prop leader'], ['Les Boyd',['ED'],89,'Hard edge'], ['Ray Price',['ED','LK'],95,'Parramatta legend'], ['Wayne Pearce',['LK','ED'],94,'Junior toughness'], ['Geoff Gerard',['B','ED'],84,'Forward cover'], ['John Dorahy',['B','FB','WG'],84,'Back cover'], ['Greg Brentnall',['B','FB'],84,'Utility back'], ['Steve Edge',['B','HK'],84,'Hooker cover']
      ]),
      squad('nsw-1985', 'NSW 1985 First Series Win', [
        ['Garry Jack',['FB'],92,'Reliable fullback'], ['Michael O’Connor',['WG','CE'],92,'Points machine'], ['Andrew Farrar',['CE'],88,'Reliable centre'], ['Steve Ella',['CE','FE'],90,'Skilful back'], ['Eric Grothe Sr',['WG'],92,'Power winger'], ['Brett Kenny',['FE','CE'],96,'Big-game five-eighth'], ['Steve Mortimer',['HB'],94,'Leader and half'], ['Steve Roach',['PR'],94,'Blocker'], ['Ben Elias',['HK'],94,'Crafty hooker'], ['Craig Young',['PR'],90,'Prop'], ['Noel Cleal',['ED','CE'],91,'Crusher'], ['Paul Sironen',['ED'],93,'Power back-rower'], ['Wayne Pearce',['LK','ED'],94,'Junior'], ['Peter Sterling',['B','HB'],95,'Elite half option'], ['Paul Dunn',['B','PR'],86,'Bench prop'], ['David Gillespie',['B','ED','PR'],89,'Hard forward'], ['Andrew Farrar',['B','CE'],86,'Back cover']
      ]),
      squad('nsw-1988', 'NSW 1988 Power Backs', [
        ['Garry Jack',['FB'],92,'Safe fullback'], ['Andrew Ettingshausen',['WG','CE','FB'],94,'ET'], ['Michael O’Connor',['CE','WG'],92,'Goal-kicker'], ['Mark McGaw',['CE'],88,'Centre'], ['Eric Grothe Sr',['WG'],92,'Power winger'], ['Cliff Lyons',['FE'],93,'Creative five-eighth'], ['Peter Sterling',['HB'],95,'Champion half'], ['Steve Roach',['PR'],94,'Blocker'], ['Ben Elias',['HK'],94,'Hooker craft'], ['Paul Dunn',['PR'],86,'Middle'], ['Paul Sironen',['ED'],93,'Edge power'], ['David Gillespie',['ED','PR'],89,'Hard defender'], ['Wayne Pearce',['LK','ED'],94,'Leader'], ['Brett Kenny',['B','FE','CE'],96,'Bench class'], ['Noel Cleal',['B','ED','CE'],90,'Impact'], ['Glenn Lazarus',['B','PR'],96,'Brick with eyes'], ['Brad Mackay',['B','ED','CE'],90,'Utility forward']
      ]),
      squad('nsw-1992', 'NSW 1992 Power Pack', [
        ['Garry Jack',['FB'],92,'Fullback'], ['Rod Wishart',['WG'],89,'Goal-kicking winger'], ['Brad Fittler',['CE','FE','LK'],98,'Freddy emerging'], ['Mark Geyer',['CE','ED'],89,'Aggression'], ['Andrew Ettingshausen',['WG','CE','FB'],94,'ET'], ['Laurie Daley',['FE','CE'],97,'Class and leadership'], ['Ricky Stuart',['HB'],96,'Long kicking half'], ['Glenn Lazarus',['PR'],96,'Brick with eyes'], ['Ben Elias',['HK'],94,'Crafty hooker'], ['Steve Roach',['PR'],94,'Blocker'], ['Paul Sironen',['ED'],93,'Power edge'], ['Brad Mackay',['ED','CE'],90,'Athletic forward'], ['Wayne Pearce',['LK','ED'],94,'Junior'], ['David Gillespie',['B','ED','PR'],89,'Hard forward'], ['Paul Harragon',['B','PR'],91,'Chief'], ['Brett Mullins',['B','FB','WG'],91,'Speed back'], ['Jim Dymock',['B','LK','FE'],91,'Ball-playing forward']
      ]),
      squad('nsw-1994', 'NSW 1994 Blues Control', [
        ['Tim Brasher',['FB','WG'],91,'Safe and sharp'], ['Rod Wishart',['WG'],89,'Goal-kicker'], ['Brad Fittler',['CE','FE'],98,'Freddy'], ['Andrew Ettingshausen',['CE','WG','FB'],94,'ET'], ['Brett Mullins',['WG','FB'],91,'Speed'], ['Laurie Daley',['FE','CE'],97,'Class'], ['Ricky Stuart',['HB'],96,'Controller'], ['Glenn Lazarus',['PR'],96,'Prop king'], ['Ben Elias',['HK'],94,'Hooker'], ['Paul Harragon',['PR'],91,'Chief'], ['Paul Sironen',['ED'],93,'Edge'], ['David Gillespie',['ED','PR'],89,'Defender'], ['Jim Dymock',['LK','FE'],91,'Ball-playing lock'], ['Geoff Toovey',['B','HB','HK'],90,'Tough utility'], ['Mark Carroll',['B','PR'],90,'Spudd'], ['Brad Mackay',['B','ED','CE'],90,'Utility'], ['Steve Menzies',['B','ED','CE'],94,'Beaver emerging']
      ]),
      squad('nsw-1997', 'NSW 1997 Daley Era', [
        ['Tim Brasher',['FB','WG'],91,'Fullback'], ['Rod Wishart',['WG'],89,'Goal-kicker'], ['Andrew Ettingshausen',['CE','WG','FB'],94,'ET'], ['Matt Gidley',['CE'],90,'Skilful centre'], ['Adam MacDougall',['WG','CE'],89,'Power back'], ['Laurie Daley',['FE','CE','LK'],97,'Captain class'], ['Geoff Toovey',['HB','HK'],90,'Tough half'], ['Paul Harragon',['PR'],91,'Chief'], ['Danny Buderus',['HK'],96,'Elite hooker emerging'], ['Mark Carroll',['PR'],90,'Spudd'], ['Steve Menzies',['ED','CE'],94,'Beaver'], ['Bryan Fletcher',['ED'],89,'Edge'], ['Brad Fittler',['LK','FE','CE'],98,'Freddy'], ['Jim Dymock',['B','LK','FE'],91,'Utility'], ['Robbie O’Davis',['B','FB'],90,'Back cover'], ['David Barnhill',['B','ED'],87,'Forward cover'], ['Jason Stevens',['B','PR'],89,'Bench prop']
      ]),
      squad('nsw-2000', 'NSW 2000 Fittler Blues', [
        ['Robbie O’Davis',['FB'],90,'Fullback'], ['Adam MacDougall',['WG','CE'],89,'Power back'], ['Ryan Girdler',['CE'],91,'Goal-kicking centre'], ['Matt Gidley',['CE'],90,'Centre'], ['Timana Tahu',['WG','CE'],89,'Strike back'], ['Brad Fittler',['FE','CE','LK'],98,'Freddy captain'], ['Andrew Johns',['HB','HK'],99,'Joey'], ['Jason Stevens',['PR'],89,'Prop'], ['Danny Buderus',['HK'],96,'Elite hooker'], ['Jason Ryles',['PR'],89,'Big prop'], ['Steve Menzies',['ED','CE'],94,'Beaver'], ['Bryan Fletcher',['ED'],89,'Edge'], ['Scott Hill',['LK','FE'],90,'Ball-player'], ['Craig Fitzgibbon',['B','ED','LK'],91,'Goals and grit'], ['David Peachey',['B','FB','LK'],90,'X-factor'], ['Nathan Hindmarsh',['B','ED'],93,'Workhorse'], ['Luke Bailey',['B','PR'],90,'Bench prop']
      ]),
      squad('nsw-2003', 'NSW 2003 Johns/Fittler Bridge', [
        ['Anthony Minichiello',['FB','WG'],93,'Golden boot fullback'], ['Timana Tahu',['WG','CE'],89,'Strike'], ['Mark Gasnier',['CE'],94,'Silky centre'], ['Matt Gidley',['CE'],90,'Centre'], ['Luke Rooney',['WG'],88,'Finisher'], ['Brad Fittler',['FE'],98,'Freddy'], ['Andrew Johns',['HB','HK'],99,'Joey'], ['Luke Bailey',['PR'],90,'Prop'], ['Danny Buderus',['HK'],96,'Hooker'], ['Jason Ryles',['PR'],89,'Big prop'], ['Nathan Hindmarsh',['ED'],93,'Workhorse'], ['Craig Fitzgibbon',['ED','LK'],91,'Goals and grit'], ['Ben Kennedy',['LK','ED'],94,'Tough forward'], ['Craig Wing',['B','HK','HB'],91,'Utility spark'], ['Steve Simpson',['B','ED'],89,'Edge'], ['Joel Clinton',['B','PR'],87,'Bench prop'], ['Shaun Timmins',['B','CE','LK'],89,'Utility']
      ]),
      squad('nsw-2005', 'NSW 2005 Joey Masterclass', [
        ['Anthony Minichiello',['FB','WG'],93,'Elite fullback'], ['Matt King',['WG','CE'],90,'Tall finisher'], ['Mark Gasnier',['CE'],94,'Silky centre'], ['Matt Cooper',['CE'],90,'Defensive centre'], ['Timana Tahu',['WG','CE'],89,'Strike'], ['Braith Anasta',['FE','LK'],90,'Five-eighth'], ['Andrew Johns',['HB','HK'],99,'Joey'], ['Luke Bailey',['PR'],90,'Prop'], ['Danny Buderus',['HK'],96,'Captain hooker'], ['Jason Ryles',['PR'],89,'Prop'], ['Nathan Hindmarsh',['ED'],93,'Workhorse'], ['Craig Fitzgibbon',['ED','LK'],91,'Goals and grit'], ['Ben Kennedy',['LK','ED'],94,'Forward leader'], ['Craig Wing',['B','HK','HB'],91,'Bench spark'], ['Steve Simpson',['B','ED'],89,'Edge'], ['Willie Mason',['B','PR','ED'],92,'Impact forward'], ['Andrew Ryan',['B','ED'],89,'Forward cover']
      ]),
      squad('nsw-2008', 'NSW 2008 Hayne Plane', [
        ['Brett Stewart',['FB'],92,'Speed fullback'], ['Jarryd Hayne',['WG','FB','CE'],96,'Origin freak'], ['Mark Gasnier',['CE'],94,'Class centre'], ['Matt Cooper',['CE'],90,'Defensive centre'], ['Anthony Quinn',['WG'],86,'Wing'], ['Greg Bird',['FE','LK'],91,'Tough playmaker'], ['Mitchell Pearce',['HB'],90,'Young half'], ['Brett White',['PR'],87,'Prop'], ['Danny Buderus',['HK'],96,'Hooker'], ['Willie Mason',['PR','ED'],92,'Impact'], ['Nathan Hindmarsh',['ED'],93,'Tackle machine'], ['Ryan Hoffman',['ED'],90,'Edge runner'], ['Paul Gallen',['LK','PR'],96,'Inspirational middle'], ['Craig Fitzgibbon',['B','ED','LK'],91,'Grit'], ['Kurt Gidley',['B','FB','HK','HB'],88,'Utility'], ['Anthony Laffranchi',['B','ED'],88,'Forward'], ['Ben Cross',['B','PR'],86,'Prop']
      ]),
      squad('nsw-2011', 'NSW 2011 Gallen Middle', [
        ['Josh Dugan',['FB'],90,'Power fullback'], ['Brett Morris',['WG','FB'],92,'Elite finisher'], ['Mark Gasnier',['CE'],94,'Centre'], ['Michael Jennings',['CE'],91,'Speed centre'], ['Akuila Uate',['WG'],89,'Power winger'], ['Jamie Soward',['FE'],88,'Kicking five-eighth'], ['Mitchell Pearce',['HB'],90,'Half'], ['Tim Mannah',['PR'],87,'Middle'], ['Michael Ennis',['HK'],89,'Hooker pest'], ['Paul Gallen',['PR','LK'],96,'Middle monster'], ['Beau Scott',['ED','CE'],89,'Defensive edge'], ['Greg Bird',['ED','LK','FE'],91,'Tough utility'], ['Luke Lewis',['LK','ED','CE'],93,'Ultimate utility'], ['Kurt Gidley',['B','FB','HK','HB'],88,'Utility'], ['Trent Merrin',['B','PR','LK'],88,'Bench middle'], ['Anthony Watmough',['B','ED'],90,'Impact'], ['Tom Learoyd-Lahrs',['B','PR'],87,'Bench prop']
      ]),
      squad('nsw-2014', 'NSW 2014 Drought Breakers', [
        ['Jarryd Hayne',['FB','WG','CE'],96,'Series hero'], ['Brett Morris',['WG','FB'],92,'Elite finisher'], ['Josh Morris',['CE','WG'],91,'Defensive centre'], ['Michael Jennings',['CE'],91,'Speed centre'], ['Daniel Tupou',['WG'],88,'Tall winger'], ['Josh Reynolds',['FE'],88,'Energy five-eighth'], ['Trent Hodkinson',['HB'],88,'Controller and goals'], ['Aaron Woods',['PR'],89,'Middle'], ['Robbie Farah',['HK'],93,'Creative hooker'], ['James Tamou',['PR'],89,'Prop'], ['Ryan Hoffman',['ED'],90,'Edge'], ['Beau Scott',['ED','CE'],89,'Defence'], ['Paul Gallen',['LK','PR'],96,'Inspirational captain'], ['Trent Merrin',['B','PR','LK'],88,'Middle'], ['Anthony Watmough',['B','ED'],90,'Impact'], ['Tony Williams',['B','ED'],86,'Power bench'], ['Luke Lewis',['B','ED','CE'],93,'Utility']
      ]),
      squad('nsw-2016', 'NSW 2016 Blues Reset', [
        ['Matt Moylan',['FB','FE'],89,'Ball-playing fullback'], ['Blake Ferguson',['WG','CE'],90,'Power winger'], ['Michael Jennings',['CE'],91,'Centre'], ['Josh Morris',['CE','WG'],91,'Defensive centre'], ['Brett Morris',['WG','FB'],92,'Finisher'], ['James Maloney',['FE'],91,'Five-eighth and goals'], ['Adam Reynolds',['HB'],89,'Kicking half'], ['Aaron Woods',['PR'],89,'Prop'], ['Robbie Farah',['HK'],93,'Hooker'], ['James Tamou',['PR'],89,'Prop'], ['Josh Jackson',['ED','LK'],90,'Worker'], ['Boyd Cordner',['ED'],94,'Captain material'], ['Paul Gallen',['LK','PR'],96,'Middle'], ['Jack Bird',['B','CE','FE'],88,'Utility'], ['David Klemmer',['B','PR'],91,'Aggressive prop'], ['Andrew Fifita',['B','PR'],92,'Impact prop'], ['Tyson Frizell',['B','ED'],91,'Edge impact']
      ]),
      squad('nsw-2018', 'NSW 2018 New Blues', [
        ['James Tedesco',['FB'],97,'Teddy'], ['Tom Trbojevic',['WG','CE','FB'],97,'Turbo'], ['Latrell Mitchell',['CE','WG','FB'],95,'Power and skill'], ['James Roberts',['CE'],90,'Speed centre'], ['Josh Addo-Carr',['WG'],92,'Foxx'], ['James Maloney',['FE'],91,'Control and cheek'], ['Nathan Cleary',['HB'],97,'Young organiser'], ['David Klemmer',['PR'],91,'Aggressive prop'], ['Damien Cook',['HK'],92,'Speed hooker'], ['Reagan Campbell-Gillard',['PR'],89,'Prop'], ['Boyd Cordner',['ED'],94,'Captain'], ['Tyson Frizell',['ED'],91,'Edge'], ['Jack de Belin',['LK','PR'],89,'Middle lock'], ['Paul Vaughan',['B','PR'],89,'Bench prop'], ['Jake Trbojevic',['B','LK','PR'],93,'Middle brain'], ['Angus Crichton',['B','ED'],93,'Edge weapon'], ['Tyrone Peachey',['B','CE','LK','HK'],88,'Utility']
      ]),
      squad('nsw-2021', 'NSW 2021 Cleary Class', [
        ['James Tedesco',['FB'],97,'Teddy'], ['Brian To’o',['WG'],92,'Metres machine'], ['Latrell Mitchell',['CE','WG','FB'],95,'Power centre'], ['Tom Trbojevic',['CE','WG','FB'],97,'Turbo'], ['Josh Addo-Carr',['WG'],92,'Speed'], ['Jarome Luai',['FE'],91,'Running five-eighth'], ['Nathan Cleary',['HB'],97,'Control and kicking'], ['Daniel Saifiti',['PR'],90,'Prop'], ['Damien Cook',['HK'],92,'Hooker speed'], ['Payne Haas',['PR'],95,'Modern super prop'], ['Cameron Murray',['ED','LK'],94,'Elite forward'], ['Tariq Sims',['ED'],89,'Edge'], ['Isaah Yeo',['LK','PR'],94,'Middle brain'], ['Jack Wighton',['B','CE','FE'],91,'Utility'], ['Junior Paulo',['B','PR'],91,'Impact middle'], ['Angus Crichton',['B','ED'],93,'Edge weapon'], ['Liam Martin',['B','ED'],91,'Aggressive edge']
      ]),
      squad('nsw-2023', 'NSW 2023 Turbo/Teddy', [
        ['James Tedesco',['FB'],97,'Captain fullback'], ['Brian To’o',['WG'],92,'Metres winger'], ['Stephen Crichton',['CE','WG'],92,'Clutch centre'], ['Tom Trbojevic',['CE','WG','FB'],97,'Turbo'], ['Josh Addo-Carr',['WG'],92,'Speed'], ['Jarome Luai',['FE'],91,'Five-eighth'], ['Nathan Cleary',['HB'],97,'Control'], ['Payne Haas',['PR'],95,'Super prop'], ['Api Koroisau',['HK'],92,'Craft hooker'], ['Junior Paulo',['PR'],91,'Impact prop'], ['Hudson Young',['ED'],89,'Aggressive edge'], ['Tyson Frizell',['ED'],91,'Veteran edge'], ['Isaah Yeo',['LK','PR'],94,'Middle brain'], ['Nicho Hynes',['B','HB','FE'],90,'Utility half'], ['Cameron Murray',['B','LK','ED'],94,'Elite forward'], ['Liam Martin',['B','ED'],91,'Edge impact'], ['Stefano Utoikamanu',['B','PR'],88,'Bench prop']
      ]),
      squad('nsw-2026', 'NSW 2026 Current Squad', [
        ['James Tedesco',['FB'],97,'Veteran fullback'], ['Jack Bostock',['WG'],87,'Current winger'], ['Bradman Best',['CE'],89,'Strike centre'], ['Stephen Crichton',['CE','WG'],92,'Clutch centre'], ['Mark Nawaqanitawase',['WG'],88,'Aerial winger'], ['Mitchell Moses',['FE','HB'],93,'Kicking and tempo'], ['Nathan Cleary',['HB'],97,'Control and kicking'], ['Payne Haas',['PR'],95,'Modern super prop'], ['Reece Robson',['HK'],90,'Hooker'], ['Mitch Barnett',['PR','ED'],90,'Tough middle'], ['Hudson Young',['ED'],89,'Aggressive edge'], ['Liam Martin',['ED'],91,'Panthers edge'], ['Isaah Yeo',['LK','PR'],94,'Middle brain'], ['Cameron Murray',['B','LK','ED'],94,'Elite forward'], ['Addin Fonua-Blake',['B','PR'],92,'Power prop'], ['Haumole Olakau’atu',['B','ED'],91,'Edge power'], ['Blayke Brailey',['B','HK'],88,'Bench hooker'], ['Ethan Strange',['B','FE','CE'],87,'Utility back'], ['Tolu Koula',['B','CE','WG'],88,'Backline speed'], ['Victor Radley',['B','LK','HK'],89,'Utility lock']
      ]),
      squad('nsw-alltime', 'NSW All-Time Legends', [
        ['James Tedesco',['FB'],98,'All-time fullback'], ['Brett Morris',['WG','FB'],94,'Elite finisher'], ['Mark Gasnier',['CE'],96,'Silky centre'], ['Andrew Ettingshausen',['CE','WG','FB'],95,'ET'], ['Jarryd Hayne',['WG','FB','CE'],97,'Origin freak'], ['Brad Fittler',['FE','CE','LK'],99,'Freddy'], ['Andrew Johns',['HB','HK'],100,'Joey'], ['Glenn Lazarus',['PR'],97,'Brick with eyes'], ['Danny Buderus',['HK'],97,'Elite hooker'], ['Steve Roach',['PR'],95,'Blocker'], ['Paul Sironen',['ED'],94,'Power edge'], ['Steve Menzies',['ED','CE'],95,'Beaver'], ['Paul Gallen',['LK','PR'],97,'Inspirational middle'], ['Laurie Daley',['B','FE','CE'],98,'Class and leadership'], ['Benny Elias',['B','HK'],95,'Crafty hooker'], ['Ben Kennedy',['B','LK','ED'],95,'Tough forward'], ['Nathan Cleary',['B','HB'],97,'Modern controller']
      ])
    ]
  }
};


// v31 ratings audit: ratings now use a deliberate Origin-impact scale instead of the older
// rough squad-list numbers. These are game ratings, not a claim of objective historical ranking.
// The goal is balance between QLD and NSW while making iconic Origin players feel meaningfully elite.
const RATING_AUDIT = {
  // Queensland / Maroons legends and notable Origin performers
  'Wally Lewis': 100, 'Johnathan Thurston': 100, 'Cameron Smith': 99, 'Darren Lockyer': 99,
  'Billy Slater': 99, 'Greg Inglis': 98, 'Mal Meninga': 98, 'Allan Langer': 98,
  'Arthur Beetson': 98, 'Cooper Cronk': 98, 'Gorden Tallis': 97, 'Petero Civoniceva': 97,
  'Shane Webcke': 96, 'Steve Renouf': 97, 'Gene Miles': 94, 'Bob Lindner': 94,
  'Trevor Gillmeister': 95, 'Paul Vautin': 92, 'Gary Belcher': 93, 'Dale Shearer': 93,
  'Kerrod Walters': 92, 'Kevin Walters': 92, 'Sam Backo': 89, 'Martin Bella': 89,
  'Steve Price': 94, 'Matt Scott': 94, 'Nate Myles': 91, 'Corey Parker': 93,
  'Sam Thaiday': 93, 'Justin Hodges': 94, 'Brent Tate': 91, 'Darius Boyd': 93,
  'Israel Folau': 93, 'Karmichael Hunt': 90, 'Matt Bowen': 91, 'Wendell Sailor': 95,
  'Lote Tuqiri': 95, 'Matt Sing': 93, 'Willie Carne': 89, 'Michael Hancock': 90,
  'Dane Gagai': 95, 'Cameron Munster': 97, 'Daly Cherry-Evans': 92, 'Kalyn Ponga': 95,
  'Harry Grant': 95, 'Tino Fa’asuamaleaui': 93, "Tino Fa\'asuamaleaui": 93, 'Reuben Cotter': 92,
  'Patrick Carrigan': 92, 'Pat Carrigan': 92, 'Josh Papalii': 92, 'Valentine Holmes': 92,
  'Hamiso Tabuai-Fidow': 93, 'Reece Walsh': 92, 'Ben Hunt': 92, 'Michael Morgan': 91,
  'Matt Gillett': 92, 'Kurt Capewell': 89, 'Felise Kaufusi': 90, 'Lindsay Collins': 90,
  'Ben Ikin': 87, 'Adrian Lam': 88, 'Wayne Bartrim': 87, 'Billy Moore': 89,
  // NSW / Blues legends and notable Origin performers
  'Andrew Johns': 99, 'Brad Fittler': 98, 'Laurie Daley': 97, 'Peter Sterling': 96,
  'Ricky Stuart': 96, 'Brett Kenny': 96, 'Glenn Lazarus': 98, 'Ben Elias': 95,
  'Danny Buderus': 97, 'Paul Gallen': 97, 'Steve Roach': 95, 'Wayne Pearce': 95,
  'Ray Price': 95, 'Steve Mortimer': 95, 'Paul Sironen': 94, 'Andrew Ettingshausen': 95,
  'Michael O’Connor': 95, "Michael O\'Connor": 95, 'Mick Cronin': 94, 'Eric Grothe Sr': 94,
  'Garry Jack': 93, 'Graham Eadie': 92, 'Steve Rogers': 94, 'Noel Cleal': 92,
  'David Gillespie': 91, 'Paul Harragon': 93, 'Jim Dymock': 92, 'Geoff Toovey': 91,
  'Anthony Minichiello': 94, 'Mark Gasnier': 95, 'Matt Cooper': 92, 'Ryan Girdler': 93,
  'Timana Tahu': 91, 'Matt King': 91, 'Craig Fitzgibbon': 92, 'Nathan Hindmarsh': 94,
  'Ben Kennedy': 95, 'Luke Bailey': 91, 'Craig Wing': 92, 'Jarryd Hayne': 96,
  'Brett Morris': 95, 'Josh Morris': 94, 'Jamie Lyon': 94, 'Kurt Gidley': 91,
  'Luke Lewis': 94, 'Boyd Cordner': 93, 'James Tedesco': 97, 'Tom Trbojevic': 97,
  'Latrell Mitchell': 96, 'Nathan Cleary': 97, 'Mitchell Moses': 94, 'Isaah Yeo': 95,
  'Payne Haas': 96, 'Cameron Murray': 95, 'Jake Trbojevic': 93, 'Angus Crichton': 92,
  'Brian To’o': 92, "Brian To\'o": 92, 'Josh Addo-Carr': 94, 'Damien Cook': 93,
  'Robbie Farah': 94, 'Apisai Koroisau': 92, 'Stephen Crichton': 93, 'Stephen Crichton': 93,
  'Dylan Edwards': 91, 'Liam Martin': 91, 'Junior Paulo': 90, 'David Klemmer': 90,
  'Mark Geyer': 91, 'Tony Butterfield': 90, 'Mark Carroll': 91, 'Steve Menzies': 94
};

function squad(id, name, rawPlayers) {
  return { id, name, players: rawPlayers.map(([name, positions, rating, note]) => p(name, positions, rating, note)) };
}

function p(name, positions, rating, note) {
  const auditedRating = RATING_AUDIT[name] || rating;
  const primaryPositions = positions.filter(pos => pos !== 'B');
  const expandedPositions = expandPositions(name, positions);
  const positionRatings = buildPositionRatings(name, primaryPositions, expandedPositions, auditedRating);

  // The headline card rating must always represent the player's best listed position rating.
  // It must never be higher or lower than the best position chip shown on the card.
  const bestPositionRating = Math.max(...Object.values(positionRatings));

  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    primaryPositions,
    positions: expandedPositions,
    positionRatings,
    rating: bestPositionRating,
    note,
    stats: {
      attack: clamp(Math.round(bestPositionRating + Math.random() * 4 - 2)),
      defence: clamp(Math.round(bestPositionRating + Math.random() * 4 - 2)),
      speed: clamp(Math.round(bestPositionRating + Math.random() * 8 - 4)),
      kicking: clamp(expandedPositions.some(x => ['HB','FE','FB'].includes(x)) ? bestPositionRating : Math.round(bestPositionRating - 12)),
      toughness: clamp(Math.round(bestPositionRating + Math.random() * 6 - 1)),
      clutch: clamp(Math.round(bestPositionRating + Math.random() * 5 - 1)),
      aura: bestPositionRating
    }
  };
}

function buildPositionRatings(name, primaryPositions, expandedPositions, rating) {
  const special = {
    'Wally Lewis': { FE: 100, HB: 98, LK: 94 },
    'Johnathan Thurston': { HB: 100, FE: 98 },
    'Darren Lockyer': { FB: 99, FE: 99, HB: 93 },
    'Cameron Smith': { HK: 99, LK: 95 },
    'Billy Slater': { FB: 99 },
    'Greg Inglis': { CE: 98, FB: 97, WG: 96, FE: 92 },
    'Mal Meninga': { CE: 98, WG: 94 },
    'Steve Renouf': { CE: 97, WG: 94 },
    'Allan Langer': { HB: 98, FE: 95 },
    'Andrew Johns': { HB: 99, FE: 96, HK: 91 },
    'Brad Fittler': { FE: 98, CE: 96, LK: 94 },
    'Laurie Daley': { FE: 97, CE: 95, LK: 91 },
    'Jarryd Hayne': { FB: 96, WG: 95, CE: 94 },
    'Tom Trbojevic': { CE: 97, FB: 96, WG: 95 },
    'Latrell Mitchell': { CE: 95, FB: 93, WG: 92 },
    'James Tedesco': { FB: 97, WG: 90 },
    'Cameron Munster': { FE: 96, FB: 93, CE: 90 },
    'Kalyn Ponga': { FB: 94, FE: 91 },
    'Reece Walsh': { FB: 92, FE: 88 },
    'Nathan Cleary': { HB: 97, FE: 94 },
    'Mitchell Moses': { HB: 93, FE: 90 },
    'Cooper Cronk': { HB: 98, FE: 94 },
    'Brett Kenny': { FE: 96, CE: 94, HB: 92 },
    'Ricky Stuart': { HB: 96, FE: 92 },
    'Benny Elias': { HK: 95, LK: 89 },
    'Danny Buderus': { HK: 97, LK: 91 },
    'Robbie Farah': { HK: 93, HB: 88 },
    'Damien Cook': { HK: 92, LK: 86 },
    'Harry Grant': { HK: 95, LK: 90 },
    'Ben Hunt': { HB: 92, HK: 91, FE: 89 },
    'Paul Gallen': { LK: 97, PR: 95 },
    'Isaah Yeo': { LK: 94, PR: 90 },
    'Cameron Murray': { LK: 94, ED: 92, CE: 85 },
    'Jake Trbojevic': { LK: 93, PR: 91 },
    'Arthur Beetson': { PR: 98, LK: 95 },
    'Glenn Lazarus': { PR: 98, LK: 92 },
    'Shane Webcke': { PR: 96, LK: 91 },
    'Petero Civoniceva': { PR: 96, LK: 91 },
    'Payne Haas': { PR: 96, LK: 91 },
    'Gorden Tallis': { ED: 96, LK: 94, PR: 91 },
    'Trevor Gillmeister': { LK: 95, ED: 94 },
    'Sam Thaiday': { ED: 93, PR: 91, LK: 90 },
    'Corey Parker': { LK: 93, ED: 91, PR: 89 },
    'Wendell Sailor': { WG: 95, CE: 92 },
    'Lote Tuqiri': { WG: 95, CE: 93 },
    'Dane Gagai': { CE: 95, WG: 95 },
    'Matt Sing': { WG: 93, CE: 91 },
    'Michael Hancock': { WG: 90, CE: 88 },
    'Darius Boyd': { WG: 93, FB: 91 },
    'Josh Addo-Carr': { WG: 94 },
    'Brett Morris': { WG: 95, FB: 92, CE: 91 },
    'Brian To’o': { WG: 92, CE: 89 },
    "Brian To\'o": { WG: 92, CE: 89 },
    'Michael O’Connor': { CE: 95, WG: 94 },
    "Michael O\'Connor": { CE: 95, WG: 94 },
    'Andrew Ettingshausen': { CE: 95, WG: 94, FB: 92 },
    'Eric Grothe Sr': { WG: 94, CE: 91 },
    'Steve Mortimer': { HB: 95, FE: 92 },
    'Peter Sterling': { HB: 96, FE: 94 },
    'Ben Kennedy': { LK: 95, ED: 94 },
    'Nathan Hindmarsh': { ED: 94, LK: 93 },
    'Mark Gasnier': { CE: 95, WG: 92 },
    'Jamie Lyon': { CE: 94, FE: 91 },
    'Latrell Mitchell': { CE: 96, FB: 94, WG: 93 },
    'Isaah Yeo': { LK: 95, PR: 91 },
    'Cameron Murray': { LK: 95, ED: 93, CE: 86 }
  };
  const ratings = {};
  const explicit = special[name] || {};
  expandedPositions.forEach((pos, index) => {
    if (explicit[pos] != null) {
      ratings[pos] = explicit[pos];
      return;
    }
    if (primaryPositions.includes(pos)) {
      const primaryIndex = primaryPositions.indexOf(pos);
      ratings[pos] = clamp(rating - Math.min(primaryIndex, 2));
    } else {
      const closeBack = adjacentDrop(primaryPositions, pos);
      ratings[pos] = clamp(rating - closeBack - Math.min(index, 3));
    }
  });
  return ratings;
}

function adjacentDrop(primaryPositions, pos) {
  const groups = [
    ['FB','WG','CE'],
    ['FE','HB'],
    ['HK','LK'],
    ['PR','LK','ED']
  ];
  const primary = primaryPositions.find(p => p !== 'B');
  if (!primary) return 7;
  if (groups.some(group => group.includes(primary) && group.includes(pos))) return 3;
  return 7;
}

function expandPositions(name, positions) {
  const specific = {
    'Darren Lockyer': ['FB','FE','HB'],
    'Mal Meninga': ['CE','WG'],
    'Steve Renouf': ['CE','WG'],
    'Greg Inglis': ['CE','FB','WG','FE'],
    'Wally Lewis': ['FE','HB','LK'],
    'Johnathan Thurston': ['HB','FE'],
    'Cameron Smith': ['HK','LK'],
    'Billy Slater': ['FB','WG'],
    'Cooper Cronk': ['HB','FE'],
    'Andrew Johns': ['HB','FE','HK'],
    'Brad Fittler': ['FE','CE','LK'],
    'Laurie Daley': ['FE','CE','HB'],
    'Jarryd Hayne': ['FB','WG','CE'],
    'Tom Trbojevic': ['FB','CE','WG'],
    'Andrew Ettingshausen': ['CE','WG','FB'],
    'Dale Shearer': ['WG','FB','CE'],
    'Allan Langer': ['HB','FE'],
    'Kevin Walters': ['FE','HB'],
    'Shaun Berrigan': ['HK','FE','CE'],
    'Kurt Gidley': ['FB','HK','HB','FE'],
    'Craig Wing': ['HK','HB','FE'],
    'Cameron Munster': ['FE','FB','CE'],
    'Kalyn Ponga': ['FB','FE'],
    'Reece Walsh': ['FB','FE'],
    'Nathan Cleary': ['HB','FE'],
    'Mitchell Moses': ['HB','FE'],
    'James Tedesco': ['FB','WG'],
    'Latrell Mitchell': ['CE','FB','WG'],
    'Mark Gasnier': ['CE','WG'],
    'Josh Morris': ['CE','WG'],
    'Brett Morris': ['WG','FB','CE'],
    'Ryan Girdler': ['CE','WG'],
    'Ricky Stuart': ['HB','FE'],
    'Brett Kenny': ['FE','CE','HB'],
    'Benny Elias': ['HK','LK'],
    'Danny Buderus': ['HK','LK'],
    'Robbie Farah': ['HK','HB'],
    'Damien Cook': ['HK','LK'],
    'Ben Hunt': ['HB','HK','FE'],
    'Harry Grant': ['HK','LK'],
    'Jake Trbojevic': ['LK','PR'],
    'Isaah Yeo': ['LK','PR'],
    'Paul Gallen': ['LK','PR'],
    'Ben Kennedy': ['LK','ED'],
    'Cameron Murray': ['LK','ED','CE'],
    'Luke Lewis': ['ED','CE','LK'],
    'Jason Smith': ['LK','FE','CE'],
    'Arthur Beetson': ['PR','LK'],
    'Shane Webcke': ['PR','LK'],
    'Petero Civoniceva': ['PR','LK'],
    'Glenn Lazarus': ['PR','LK'],
    'Payne Haas': ['PR','LK'],
    'Gorden Tallis': ['ED','LK','PR'],
    'Trevor Gillmeister': ['LK','ED'],
    'Bob Lindner': ['LK','ED'],
    'Boyd Cordner': ['ED','LK'],
    'Matt Gillett': ['ED','LK','CE'],
    'Sam Thaiday': ['ED','PR','LK'],
    'Corey Parker': ['LK','ED','PR']
  };

  const out = new Set(positions);
  (specific[name] || []).forEach(pos => out.add(pos));

  positions.forEach(pos => {
    if (pos === 'B') return;
    if (pos === 'FB') { out.add('WG'); }
    if (pos === 'WG') { out.add('CE'); }
    if (pos === 'CE') { out.add('WG'); }
    if (pos === 'FE') { out.add('HB'); }
    if (pos === 'HB') { out.add('FE'); }
    if (pos === 'HK') { out.add('LK'); }
    if (pos === 'PR') { out.add('LK'); }
    if (pos === 'ED') { out.add('LK'); }
    if (pos === 'LK') { out.add('ED'); }
  });

  if (!out.size) out.add('LK');
  return [...out].filter(pos => pos !== 'B');
}

function clamp(value) {
  return Math.max(50, Math.min(100, value));
}
