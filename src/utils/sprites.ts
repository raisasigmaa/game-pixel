// Procedural Custom 16x16 Pixel Art Sprites for Retro Style Dungeon Game
// . = Transparent
// K = Dark Gray Armor / Outlines (#374151)
// S = Silver Steel (#9CA3AF)
// W = White (#FFFFFF)
// B = Absolute Black (#111827)
// s = Peach Skin (#FDBA74)
// h = Brown Hair / Boots (#78350F)
// y = Gold Gold (#FBBF24)
// r = Bright Red (#EF4444)
// o = Dark Orange (#CC5200)
// g = Rogue Slate Green (#10B981)
// d = Dark Forest Green (#047857)
// p = Purple Velvet (#8B5CF6)
// v = Midnight Violet (#4C1D95)
// b = Ice Blue (#3B82F6)
// c = Cyan Magic (#06B6D4)
// m = Magenta/Pink (#EC4899)

export type SpriteName = 
  | 'knight_idle' | 'knight_walk' 
  | 'mage_idle' | 'mage_walk' 
  | 'rogue_idle' | 'rogue_walk' 
  | 'slime_blue_1' | 'slime_blue_2'
  | 'slime_red_1' | 'slime_red_2'
  | 'bat_1' | 'bat_2'
  | 'skeleton_1' | 'skeleton_2'
  | 'slime_king_1' | 'slime_king_2'
  | 'dragon_1' | 'dragon_2'
  | 'coin' | 'potion' | 'sword_slash' | 'fireball' | 'dagger'
  // NEW SURVIVAL SANDBOX SPRITES
  | 'tree' | 'rock' | 'wood_wall' | 'stone_wall' | 'door_open' | 'door_closed'
  | 'bed' | 'campfire_1' | 'campfire_2' | 'boar_1' | 'boar_2' | 'deer_1' | 'deer_2'
  | 'chicken_1' | 'chicken_2' | 'fish_item' | 'meat_item' | 'wood_item' | 'stone_item' | 'fishing_rod';

const COLOR_MAP: Record<string, string> = {
  '.': 'transparent',
  'K': '#374151',
  'S': '#9CA3AF',
  'W': '#FFFFFF',
  'B': '#111827',
  's': '#FDBA74',
  'h': '#78350F',
  'y': '#FBBF24',
  'r': '#EF4444',
  'o': '#CC5200',
  'g': '#10B981',
  'd': '#047857',
  'p': '#8B5CF6',
  'v': '#4C1D95',
  'b': '#3B82F6',
  'c': '#06B6D4',
  'm': '#EC4899',
};

export const SPRITES: Record<SpriteName, string[]> = {
  // --- KNIGHT ---
  knight_idle: [
    '....KKKKKK......',
    '..KKssssssKK....',
    '.KKsshhhhssss...',
    '.KKshhhhhhsss...',
    '.KKKkkkkkkKK....',
    '..KKSSSSSSKK....',
    '..KKSWWWWSSK....',
    '..KKSBBBBSSK....',
    '..KKSSSSSSKK....',
    '..KKKSSSSSsh....',
    '....KSSSSShh...',
    '....KSSSSShh....',
    '....KSS..SSK....',
    '....KK...KK.....',
    '....hh...hh.....',
    '....hh...hh.....'
  ],
  knight_walk: [
    '....KKKKKK......',
    '..KKssssssKK....',
    '.KKsshhhhssss...',
    '.KKshhhhhhsss...',
    '.KKKkkkkkkKK....',
    '..KKSSSSSSKK....',
    '..KKSWWWWSSK....',
    '..KKSBBBBSSK....',
    '..KKSSSSSSKK....',
    '..KKKSSSSSsh....',
    '....KSSSSShh....',
    '....KSSSSShh....',
    '....hKSS..hS....',
    '....hKK...hK....',
    '....h......h....',
    '...........h....'
  ],

  // --- MAGE ---
  mage_idle: [
    '.....pppp.......',
    '...vvpppppvv....',
    '..vpppppppppv...',
    '..vppWWWWpppv...',
    '...vpssSVssp....',
    '...vpssssssp....',
    '..vpppppppppv...',
    '.vppvpppppvvpp..',
    '.vppvpppppvvpp..',
    '..vvvpppppvvv...',
    '....vppvvppv.y..',
    '....vp.cc.pv.y..',
    '....vp.cc.pv.S..',
    '....vv.cc.vv.S..',
    '....hh....hh.S..',
    '....hh....hh.S..'
  ],
  mage_walk: [
    '.....pppp.......',
    '...vvpppppvv....',
    '..vpppppppppv...',
    '..vppWWWWpppv...',
    '...vpssSVssp....',
    '...vpssssssp....',
    '..vpppppppppv...',
    '.vppvpppppvvpp..',
    '.vppvpppppvvpp..',
    '..vvvpppppvvv...',
    '....vppvvppvy...',
    '....hvp.cc.pv...',
    '....hvp.cc.pv.S.',
    '....hvv.cc.vv.S.',
    '..........hh..S.',
    '..........hh..S.'
  ],

  // --- ROGUE ---
  rogue_idle: [
    '.....ddddd......',
    '...ddgggggdd....',
    '..dgggggggggd...',
    '..dggKKKggggyS..',
    '...dsssssssdyS..',
    '...dKKsssKKdy...',
    '..dgggggggggd...',
    '.dggggggggggggd.',
    '.dggggggggggggd.',
    '..dddggggggddd..',
    '....dggggggd.yS.',
    '....dg.KK.gd.yS.',
    '....dg.KK.gd....',
    '....dd.KK.dd....',
    '....hh....hh....',
    '....hh....hh....'
  ],
  rogue_walk: [
    '.....ddddd......',
    '...ddgggggdd....',
    '..dgggggggggd...',
    '..dggKKKggggyS..',
    '...dsssssssdyS..',
    '...dKKsssKKdy...',
    '..dgggggggggd...',
    '.dggggggggggggd.',
    '.dggggggggggggd.',
    '..dddggggggddd..',
    '....dggggggd.yS.',
    '...hdg.KK.gdyS..',
    '...hdg....gd....',
    '....dd....dd....',
    '....h......hh...',
    '...........hh...'
  ],

  // --- SLIME BLUE ---
  slime_blue_1: [
    '................',
    '......bbbb......',
    '....bbbbbbbb....',
    '...bbbbbbbbbb...',
    '..bbWbbbbWbbbb..',
    '..bBBBbbBBBbbb..',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..',
    '...bbbbbbbbbb...',
    '....bbbbbbbb....',
    '......bbbb......'
  ],
  slime_blue_2: [
    '................',
    '................',
    '......bbbb......',
    '....bbbbbbbb....',
    '...bbbbbbbbbb...',
    '..bWbbbbbbWbbb..',
    '..bBBbbbbBBbbb..',
    '..bbbbbbbbbbbb..',
    '.bbbbbbbbbbbbbb.',
    '.bbbbbbbbbbbbbb.',
    '.bbbbbbbbbbbbbb.',
    '.bbbbbbbbbbbbbb.',
    '.bbbbbbbbbbbbbb.',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..'
  ],

  // --- SLIME RED ---
  slime_red_1: [
    '................',
    '......rrrr......',
    '....rrrrrrrr....',
    '...rrrrrrrrrr...',
    '..rrWrrrrWrrrr..',
    '..rBBBrrBBBrrr..',
    '..rrrrrrrrrrrr..',
    '..rrrrrrrrrrrr..',
    '..rrrrrrrrrrrr..',
    '..rrrrrrrrrrrr..',
    '..rrrrrrrrrrrr..',
    '..rrrrrrrrrrrr..',
    '..rrrrrrrrrrrr..',
    '...rrrrrrrrrr...',
    '....rrrrrrrr....',
    '......rrrr......'
  ],
  slime_red_2: [
    '................',
    '................',
    '......rrrr......',
    '....rrrrrrrr....',
    '...rrrrrrrrrr...',
    '..rWrrrrrrWrrr..',
    '..rBBrrrrBBrrr..',
    '..rrrrrrrrrrrr..',
    '.rrrrrrrrrrrrrr.',
    '.rrrrrrrrrrrrrr.',
    '.rrrrrrrrrrrrrr.',
    '.rrrrrrrrrrrrrr.',
    '.rrrrrrrrrrrrrr.',
    '..rrrrrrrrrrrr..',
    '..rrrrrrrrrrrr..',
    '..rrrrrrrrrrrr..'
  ],

  // --- BAT ---
  bat_1: [
    '................',
    '...KK......KK...',
    '..KKKK....KKKK..',
    '..KKKKKKKKKKKK..',
    '.KKWKKKKKKKKWKK.',
    '.KKBKKKKKKKKBKK.',
    '.KKKKKKKKKKKKKK.',
    '..KKKKKKKKKKKK..',
    '..KKyKKKKKKyKK..',
    '..KKKKKKKKKKKK..',
    '.KK..........KK.',
    'KK............KK',
    'K..............K',
    '................',
    '................',
    '................'
  ],
  bat_2: [
    '................',
    '................',
    '...KK......KK...',
    '..KKKKKKKKKKKK..',
    '.KKWKKKKKKKKWKK.',
    '.KKBKKKKKKKKBKK.',
    '.KKKKKKKKKKKKKK.',
    '..KKKKKKKKKKKK..',
    '..KKyKKKKKKyKK..',
    '..KKKKKKKKKKKK..',
    '...KK.KKKK.KK...',
    '....KK.KK.KK....',
    '.....K....K.....',
    '................',
    '................',
    '................'
  ],

  // --- SKELETON ---
  skeleton_1: [
    '.....WWWW.......',
    '....WWWWWW......',
    '....WKWKWK......',
    '....WWWWWW......',
    '.....WWWW.......',
    '......SS........',
    '....SSSSSS......',
    '...S.SS.SS.S....',
    '..S..SS..SS.S...',
    '.....SS.........',
    '....SSSS........',
    '....S..S........',
    '....S..S........',
    '....S..S........',
    '....S..S........',
    '...SS..SS.......'
  ],
  skeleton_2: [
    '.....WWWW.......',
    '....WWWWWW......',
    '....WKWKWK......',
    '....WWWWWW......',
    '.....WWWW.......',
    '......SS........',
    '....SSSSSS......',
    '...S.SS.SS.S....',
    '..S..SS..SS.S...',
    '.....SS.........',
    '....SSSS........',
    '....S..S........',
    '....S..S........',
    '....SS.SS.......',
    '....S....S......',
    '...SS....S......'
  ],

  // --- SLIME KING ---
  slime_king_1: [
    '...yyyy..yyyy...',
    '....yWWyyWWy....',
    '.....yWWWWy.....',
    '......bbbb......',
    '....bbbbbbbb....',
    '...bbbbbbbbbb...',
    '..bbWbbbbWbbbb..',
    '..bBBBbbBBBbbb..',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..',
    '...bbbbbbbbbb...',
    '....bbbbbbbb....',
    '......bbbb......'
  ],
  slime_king_2: [
    '................',
    '...yyyy..yyyy...',
    '....yWWyyWWy....',
    '.....yWWWWy.....',
    '......bbbb......',
    '....bbbbbbbb....',
    '...bbbbbbbbbb...',
    '..bWbbbbbbWbbb..',
    '..bBBbbbbBBbbb..',
    '..bbbbbbbbbbbb..',
    '.bbbbbbbbbbbbbb.',
    '.bbbbbbbbbbbbbb.',
    '.bbbbbbbbbbbbbb.',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..',
    '..bbbbbbbbbbbb..'
  ],

  // --- DRAGON ---
  dragon_1: [
    '......rrrr......',
    '....rroooor.....',
    '..rroooooooorr..',
    '..roWooooooWor..',
    '..rBBoorrrBBrr..',
    '..roorrrrrroor..',
    '..rroorrrrroor..',
    '...KK.KKKK.KK...',
    '...KK.KKKK.KK...',
    '..KKKKKKKKKKKK..',
    '.KK..KKKKKK..KK.',
    'KK...KKKKKK...KK',
    'K....KKKKKK....K',
    '.....K....K.....',
    '.....h....h.....',
    '....hh....hh....'
  ],
  dragon_2: [
    '......rrrr......',
    '....rroooor.....',
    '..rroooooooorr..',
    '..roWooooooWor..',
    '..rBBoorrrBBrr..',
    '..roorrrrrroor..',
    '..rroorrrrroor..',
    '...K........K...',
    '...KK......KK...',
    '..KKKKKKKKKKKK..',
    '.KK.KKKKKKKK.KK.',
    'KK..KKKKKKKK..KK',
    'K....K....K....K',
    '.....K....K.....',
    '....hh....hh....',
    '....h......h....'
  ],

  // --- ITEMS & PARTICLES ---
  coin: [
    '......yyyy......',
    '....yyyyWWyy....',
    '...yyyWWWWyyy...',
    '..yyWWWWWWWWyy..',
    '..yyWWBByyWWyy..',
    '..yyWByyyyWWyy..',
    '..yyWByyyyWWyy..',
    '..yyWByyyyWWyy..',
    '..yyWWBByyWWyy..',
    '..yyWWWWWWWWyy..',
    '...yyyWWWWyyy...',
    '....yyyyWWyy....',
    '......yyyy......',
    '................',
    '................',
    '................'
  ],
  potion: [
    '......KK........',
    '.....KSSK.......',
    '.....KSSK.......',
    '.....KKKK.......',
    '....KrrrrK......',
    '...KrrrrrrK.....',
    '..KrrrrrrrrK....',
    '..KrrrrrrrrK....',
    '..KrrWrrrrrK....',
    '..KrrWrWWrrK....',
    '..KrrrrrrrrK....',
    '..KrrrrrrrrK....',
    '...KrrrrrrK.....',
    '....KKKKKK......',
    '................',
    '................'
  ],
  sword_slash: [
    '............SS..',
    '..........SSSS..',
    '........SSSSS...',
    '......SSSSS.....',
    '....SSSSS.......',
    '...SSSSS........',
    '..SSSSS.........',
    '..SSSS..........',
    '..SSS...........',
    '...SS...........',
    '....S...........',
    '................',
    '................',
    '................',
    '................',
    '................'
  ],
  fireball: [
    '......rrrr......',
    '....rroooorr....',
    '...rroooooyyr...',
    '..rroooooyywyr..',
    '..roooooyywwyr..',
    '..roooooyywwyr..',
    '..rroooooyywyr..',
    '...rroooooyyr...',
    '....rroooorr....',
    '......rrrr......',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................'
  ],
  dagger: [
    '............S...',
    '...........S....',
    '..........S.....',
    '.........S......',
    '........S.......',
    '.......S........',
    '......h.........',
    '.....K..........',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................'
  ],
  // --- NEW SURVIVAL SANDBOX SPRITES ---
  tree: [
    '......dddd......',
    '....dddddddd....',
    '...dddddddddd...',
    '..ddddgggggddd..',
    '..dddgggggggdd..',
    '..ddgggggggggd..',
    '..ddgggggggggd..',
    '...dggggggggd...',
    '....KKhhhhKK....',
    '......hhhh......',
    '......hhhh......',
    '......hhhh......',
    '......hhhh......',
    '.....hhhhhh.....',
    '....hhhhhhhh....',
    '................'
  ],
  rock: [
    '................',
    '......KKKK......',
    '....KKSSSSKK....',
    '...KKSSSSSSsK...',
    '..KSSSSSSSSSSK..',
    '.KSSWWSSSSSsSSK.',
    '.KSSWSSSSSSSSSK.',
    'KSSWWSSSSSSSSSSK',
    'KSSSWSSSSSSSSSSK',
    'KSSSSSSSSSSSSSSK',
    'KKSSSSSSSSSSSSKK',
    '.KKSSSSSSSSSSKK.',
    '..KKKKKKKKKKKK..',
    '................',
    '................',
    '................'
  ],
  wood_item: [
    '................',
    '................',
    '......hhhh......',
    '....hhhhhhhh....',
    '...hhhhWWhhhh...',
    '..hhhhWWWWhhhh..',
    '..hhhhKKKKhhhh..',
    '..hhhhhhhhhhhh..',
    '...hhhhhhhhhh...',
    '....hhhhhhhh....',
    '......hhhh......',
    '................',
    '................',
    '................',
    '................',
    '................'
  ],
  stone_item: [
    '................',
    '................',
    '......KKKK......',
    '....KKSSSSKK....',
    '...KKSSSSSSKK...',
    '..KSSSSSSSSSSK..',
    '..KKSSSSSSSSKK..',
    '....KKKKKKKK....',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................'
  ],
  meat_item: [
    '................',
    '......KKKK......',
    '....KKrrrrKK....',
    '...KKWWrrrrrKK..',
    '..KKWWWWrrrrrKK.',
    '..KWWWWWWrrrrrK.',
    '..KWWKKWWrrrrrK.',
    '..KWWKKWWrrrrrK.',
    '..KKWKKWrrrrrKK.',
    '...KKKKrrrrrKK..',
    '.....KKrrrrKK...',
    '......KKKK......',
    '................',
    '................',
    '................',
    '................'
  ],
  fish_item: [
    '......cccc......',
    '....ccbbbbcc....',
    '...ccbbWWbbcc...',
    '..ccbbbbbbbbcc..',
    '.ccbbbbbbbbbbcc.',
    'ccbbccbbbbccbbcc',
    'cbbc..ccbb..cbbc',
    'cb......cc....bc',
    'c.............c.',
    'cc...........cc.',
    '.cc.........cc..',
    '..cc...cc..cc...',
    '....ccc..ccc....',
    '................',
    '................',
    '................'
  ],
  wood_wall: [
    'KKKKKKKKKKKKKKKK',
    'KhhhhhhhhhhhhhhK',
    'KhhhhhhhhhhhhhhK',
    'KKKKKKKKKKKKKKKK',
    'KhhhhhhhhhhhhhhK',
    'KhhhhhhhhhhhhhhK',
    'KKKKKKKKKKKKKKKK',
    'KhhhhhhhhhhhhhhK',
    'KhhhhhhhhhhhhhhK',
    'KKKKKKKKKKKKKKKK',
    'KhhhhhhhhhhhhhhK',
    'KhhhhhhhhhhhhhhK',
    'KKKKKKKKKKKKKKKK',
    'KhhhhhhhhhhhhhhK',
    'KhhhhhhhhhhhhhhK',
    'KKKKKKKKKKKKKKKK'
  ],
  stone_wall: [
    'KKKKKKKKKKKKKKKK',
    'KSSSSSSSSSSSSSSK',
    'KSSSSSSSSSSSSSSK',
    'KKKKKKKKKKKKKKKK',
    'KSSSSSSSSSSSSSSK',
    'KSSSSSSSSSSSSSSK',
    'KKKKKKKKKKKKKKKK',
    'KSSSSSSSSSSSSSSK',
    'KSSSSSSSSSSSSSSK',
    'KKKKKKKKKKKKKKKK',
    'KSSSSSSSSSSSSSSK',
    'KSSSSSSSSSSSSSSK',
    'KKKKKKKKKKKKKKKK',
    'KSSSSSSSSSSSSSSK',
    'KSSSSSSSSSSSSSSK',
    'KKKKKKKKKKKKKKKK'
  ],
  door_closed: [
    'KKKKKKKKKKKKKKKK',
    'K..hhhhhhhhhh..K',
    'K..hhhhhhhhhh..K',
    'K..hhhhKKhhhh..K',
    'K..hhhhKKhhhh..K',
    'K..hhhhhhhhhh..K',
    'K..hhhh..hhhh..K',
    'K..hhhh.yhhhh..K',
    'K..hhhh.yhhhh..K',
    'K..hhhh..hhhh..K',
    'K..hhhhhhhhhh..K',
    'K..hhhhhhhhhh..K',
    'K..hhhhhhhhhh..K',
    'K..hhhhhhhhhh..K',
    'K..hhhhhhhhhh..K',
    'KKKKKKKKKKKKKKKK'
  ],
  door_open: [
    'KKKK........KKKK',
    'K..h........h..K',
    'K..h........h..K',
    'K..h........h..K',
    'K..h........h..K',
    'K..h........h..K',
    'K..h........h..K',
    'K..h...y....h..K',
    'K..h...y....h..K',
    'K..h........h..K',
    'K..h........h..K',
    'K..h........h..K',
    'K..h........h..K',
    'K..h........h..K',
    'K..h........h..K',
    'KKKK........KKKK'
  ],
  bed: [
    '................',
    '................',
    '................',
    '................',
    '..WWWWWWWWWWWW..',
    '.WWWWWWWWWWWWWW.',
    '.WssWppppppppW.',
    '.WssWppppppppW.',
    '.WWWWppppppppW.',
    '.WWWWppppppppW.',
    '..KKKKKKKKKKKK..',
    '..K..K....K..K..',
    '..h..h....h..h..',
    '................',
    '................',
    '................'
  ],
  campfire_1: [
    '................',
    '......rrrr......',
    '....rroooorr....',
    '...rroooooyyr...',
    '..rroooooyywyr..',
    '..roooooyywwyr..',
    '..KKhhhhKKwwK...',
    '...KKhhhhKKKK...',
    '.....hhhhhh.....',
    '....hhhhhhhh....',
    '....hh....hh....',
    '....hh....hh....',
    '................',
    '................',
    '................',
    '................'
  ],
  campfire_2: [
    '................',
    '......oooo......',
    '....ooyyyyoo....',
    '...ooyyyyyyyo...',
    '..ooyyyyywwyyo..',
    '..oyyyyyywwyyo..',
    '..KKhhhhKKwwK...',
    '...KKhhhhKKKK...',
    '.....hhhhhh.....',
    '....hhhhhhhh....',
    '....hh....hh....',
    '....hh....hh....',
    '................',
    '................',
    '................',
    '................'
  ],
  boar_1: [
    '......hhhhh.....',
    '....hhhhhhhh....',
    '...hhhhWWWhhh...',
    '..hhhhWWWWWhhh..',
    '..hhshWWWWWshh..',
    '..hBshWWWWWsBh..',
    '..hhhhWWWWWhhh..',
    '..hhhhWWWWWhhh..',
    '..hhhhWWWWWhhh..',
    '..KKhhhhhhhKK...',
    '...KKhhhhhKK....',
    '...KKhhhhhKK....',
    '...KK.....KK....',
    '...hh.....hh....',
    '...hh.....hh....',
    '................'
  ],
  boar_2: [
    '......hhhhh.....',
    '....hhhhhhhh....',
    '...hhhhWWWhhh...',
    '..hhhhWWWWWhhh..',
    '..hhshWWWWWshh..',
    '..hBshWWWWWsBh..',
    '..hhhhWWWWWhhh..',
    '..hhhhWWWWWhhh..',
    '..hhhhWWWWWhhh..',
    '..KKhhhhhhhKK...',
    '..KKhhhhhKK.....',
    '..KK......KK....',
    '..hh......hh....',
    '..hh......hh....',
    '................',
    '................'
  ],
  deer_1: [
    '......h..h......',
    '......h..h......',
    '......hhhh......',
    '.....hssssh.....',
    '....hssssssh....',
    '....hBsBsBsh....',
    '....hssssssh....',
    '.....hhhhhh.....',
    '......hhhh......',
    '......hhhh......',
    '......hhhh......',
    '....hhhh.hhhh...',
    '....hh.....hh...',
    '....hh.....hh...',
    '....hh.....hh...',
    '................'
  ],
  deer_2: [
    '......h..h......',
    '......h..h......',
    '......hhhh......',
    '.....hssssh.....',
    '....hssssssh....',
    '....hBsBsBsh....',
    '....hssssssh....',
    '.....hhhhhh.....',
    '......hhhh......',
    '......hhhh......',
    '......hhhh......',
    '.....hh...hh....',
    '.....hh...hh....',
    '......h....h....',
    '......h....h....',
    '................'
  ],
  chicken_1: [
    '......rrr.......',
    '.....rWWWr......',
    '....rWWWWWr.....',
    '....yWWWWWy.....',
    '....yBWWWWy.....',
    '.....WWWWW......',
    '....WWWWWWWW....',
    '...WWWWWWWWWW...',
    '..WWWWWWWWWWWW..',
    '..WWWWWWWWWWWW..',
    '...WWWWWWWWWW...',
    '....WWWWWWWW....',
    '.....y....y.....',
    '....yy....yy....',
    '....yy....yy....',
    '................'
  ],
  chicken_2: [
    '......rrr.......',
    '.....rWWWr......',
    '....rWWWWWr.....',
    '....yWWWWWy.....',
    '....yBWWWWy.....',
    '.....WWWWW......',
    '....WWWWWWWW....',
    '...WWWWWWWWWW...',
    '..WWWWWWWWWWWW..',
    '..WWWWWWWWWWWW..',
    '...WWWWWWWWWW...',
    '....WWWWWWWW....',
    '.....y....y.....',
    '.....y....y.....',
    '................',
    '................'
  ],
  fishing_rod: [
    '............cc..',
    '...........c....',
    '..........c.....',
    '.........c......',
    '........c.......',
    '.......c........',
    '......c.........',
    '.....c..........',
    '....c...........',
    '...c............',
    '..c.............',
    '.c..............',
    'c...............',
    '................',
    '................',
    '................'
  ]
};

/**
 * Draws a pixel-perfect sprite onto the 2D canvas context.
 */
export function drawPixelSprite(
  ctx: CanvasRenderingContext2D,
  spriteName: SpriteName,
  x: number,
  y: number,
  size: number, // Target width/height scaled in pixels
  facingRight: boolean = true,
  isHurt: boolean = false,
  customColorOverride?: string // Optional global fill color
) {
  const spriteRows = SPRITES[spriteName];
  if (!spriteRows) return;

  const rows = spriteRows.length;
  const cols = spriteRows[0].length;
  
  const pixelW = size / cols;
  const pixelH = size / rows;

  ctx.save();

  // If facing left, flip horizontally around the center
  if (!facingRight) {
    ctx.translate(x + size / 2, y + size / 2);
    ctx.scale(-1, 1);
    ctx.translate(-(x + size / 2), -(y + size / 2));
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const char = spriteRows[r][c];
      
      if (char === '.') continue; // Transparent

      let color = COLOR_MAP[char] || '#000000';

      if (isHurt) {
        // Red tinted flash on hurt
        if (char !== 'B' && char !== 'K') {
          color = '#FF4444';
        }
      } else if (customColorOverride) {
        if (customColorOverride === 'outfit_red') {
          if (char === 'S' || char === 'p' || char === 'g' || char === 'b') color = '#EF4444'; // Red clothes/armor
          if (char === 'h' || char === 'v' || char === 'd') color = '#F59E0B'; // Gold trim
        } else if (customColorOverride === 'outfit_blue') {
          if (char === 'S' || char === 'p' || char === 'g' || char === 'r') color = '#3B82F6'; // Blue clothing
          if (char === 'h' || char === 'v' || char === 'd') color = '#06B6D4'; // Cyan highlights
        } else if (customColorOverride === 'outfit_black') {
          if (char === 'S' || char === 'p' || char === 'g' || char === 'b') color = '#1F2937'; // Black ninja outfit
          if (char === 'h' || char === 'v' || char === 'd' || char === 'r') color = '#EF4444'; // Hot red trims
        } else if (customColorOverride === 'outfit_purple') {
          if (char === 'S' || char === 'g' || char === 'b' || char === 'r') color = '#8B5CF6'; // purple robes
          if (char === 'h' || char === 'v' || char === 'd') color = '#F472B6'; // Pink details
        } else if (customColorOverride === 'outfit_silver') {
          if (char === 'p' || char === 'g' || char === 'b' || char === 'r') color = '#E1E7EC'; // silver steel clothing
          if (char === 'h' || char === 'v' || char === 'd') color = '#9CA3AF'; // dark metal
        } else {
          color = customColorOverride;
        }
      }

      ctx.fillStyle = color;
      
      // Draw pixel block ensuring they align cleanly without gaps
      ctx.fillRect(
        x + c * pixelW,
        y + r * pixelH,
        Math.ceil(pixelW),
        Math.ceil(pixelH)
      );
    }
  }

  ctx.restore();
}
