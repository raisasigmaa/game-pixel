export type HeroClass = 'knight' | 'mage' | 'rogue';

export interface HeroStats {
  id: HeroClass;
  name: string;
  description: string;
  maxHp: number;
  speed: number;
  attackSpeed: number; // Attacks per second
  damage: number;
  range: number;
  abilityName: string;
  abilityCooldown: number; // In seconds
  color: string;
  accentColor: string;
}

export interface Hero {
  id: HeroClass;
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  level: number;
  xp: number;
  maxXp: number;
  coins: number;
  abilityTimer: number;
  lastAttackTime: number;
  facingRight: boolean;
  score: number;
  // SURVIVAL MECHANICS STATS
  hunger: number;
  maxHunger: number;
  energy: number;
  maxEnergy: number;
  wood: number;
  stone: number;
  meat: number;
  fish: number;
  currentOutfit: string; // 'red' | 'blue' | 'black' | 'purple' | 'silver'
}

export interface PlacedBlock {
  col: number;
  row: number;
  type: 'wood_wall' | 'stone_wall' | 'door' | 'bed' | 'campfire';
  hp: number;
  maxHp: number;
}

export interface ItemOnGround {
  id: string;
  x: number;
  y: number;
  type: 'wood' | 'stone' | 'meat' | 'fish' | 'potion' | 'coin';
  amount: number;
  lifetime: number;
}

export interface Enemy {
  id: string;
  type: 'slime_blue' | 'slime_red' | 'bat' | 'skeleton' | 'slime_king' | 'dragon' | 'boar' | 'deer' | 'chicken';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  points: number;
  isBoss: boolean;
  color: string;
  facingRight: boolean;
  flashTimer: number; // For taking damage visual feedback
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  color: string;
  isPlayerOwned: boolean;
  survivalTime: number; // Decay timer
  maxSurvivalTime: number;
  type: 'fireball' | 'dagger' | 'sword_slash' | 'enemy_fire' | 'fishing_hook';
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number; // 0 to 1 decay
  maxLife: number;
  type: 'blood' | 'spark' | 'coin' | 'text' | 'wood' | 'stone' | 'splash';
  textValue?: string;
}

export interface GameUpgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  level: number;
  maxLevel: number;
  effect: (hero: Hero, stats: HeroStats) => void;
}

export interface HighScore {
  name: string;
  heroClass: HeroClass;
  score: number;
  wave: number;
  date: string;
}

