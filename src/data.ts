import { HeroStats, GameUpgrade } from './types';

export const HERO_TEMPLATES: Record<string, HeroStats> = {
  knight: {
    id: 'knight',
    name: 'Gladiator Knight',
    description: 'Tough melee warrior equipped with silver-steel plate armor. Attacks with heavy sweeping sword slashes, clearing waves of slimes.',
    maxHp: 120,
    speed: 3.2,
    attackSpeed: 1.4, // attacks per second
    damage: 25,
    range: 120, // sweep radius
    abilityName: 'Iron Fortress',
    abilityCooldown: 10,
    color: '#3B82F6', // Blue aura
    accentColor: '#9CA3AF'
  },
  mage: {
    id: 'mage',
    name: 'Celestial Mage',
    description: 'Masters magic elements. Shoots burning dynamic fireballs from a distance. Can trigger explosive multi-directional blasts.',
    maxHp: 80,
    speed: 2.8,
    attackSpeed: 1.1,
    damage: 18,
    range: 350, // ranged fireballs
    abilityName: 'Supernova',
    abilityCooldown: 12,
    color: '#8B5CF6', // Purple aura
    accentColor: '#FBBF24'
  },
  rogue: {
    id: 'rogue',
    name: 'Shadow Rogue',
    description: 'Fast, lethal rogue armed with dual throwing daggers. Moves extremely quickly, critical strikes bypass tough enemy shells.',
    maxHp: 90,
    speed: 4.2,
    attackSpeed: 2.0,
    damage: 12,
    range: 250, // throwing daggers
    abilityName: 'Shadowstep Strike',
    abilityCooldown: 8,
    color: '#10B981', // Green aura
    accentColor: '#CC5200'
  }
};

export interface UpgradePerk {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
}

export const UPGRADE_PERKS: UpgradePerk[] = [
  {
    id: 'hp_max',
    name: 'Giant Heart',
    description: 'Increase maximum health by +25 points and fully restores health.',
    icon: '❤️',
    maxLevel: 5
  },
  {
    id: 'damage_boost',
    name: 'Sharpened Edge',
    description: 'Empowers attacks, increasing damage output by +20%.',
    icon: '⚔️',
    maxLevel: 5
  },
  {
    id: 'speed_boost',
    name: 'Cheetah Soles',
    description: 'Enhance agility, increasing movement speed by +15%.',
    icon: '⚡',
    maxLevel: 5
  },
  {
    id: 'attack_speed',
    name: 'Adrenaline Rush',
    description: 'Accelerate hand-eye reflexes, firing or slashing +20% faster.',
    icon: '⏱️',
    maxLevel: 5
  },
  {
    id: 'magnet',
    name: 'Coin Magnet',
    description: 'Expand your wealth radius by +60%, vacuuming up distant coins and gold.',
    icon: '🧲',
    maxLevel: 4
  },
  {
    id: 'barrier',
    name: 'Aegis Shield',
    description: 'Gain a spectral barrier that block 1 incoming attack. Barrier regenerates every 12s.',
    icon: '🛡️',
    maxLevel: 3
  },
  {
    id: 'ice_ring',
    name: 'Frozen Pulse',
    description: 'Releases a chilling radial wave every 4s, slowing down and damaging nearby slimes.',
    icon: '❄️',
    maxLevel: 4
  },
  {
    id: 'multishot',
    name: 'Frenzy Shot',
    description: 'Adds +1 bonus projectile/slash per regular attack for ultimate screen coverage.',
    icon: '✴️',
    maxLevel: 3
  },
  {
    id: 'lifesteal',
    name: 'Drain Fangs',
    description: 'Restores +1 Health point back on every 4 enemies defeated (Life Steal).',
    icon: '🦇',
    maxLevel: 4
  }
];
