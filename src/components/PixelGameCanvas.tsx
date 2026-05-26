import React, { useRef, useEffect, useState } from 'react';
import { Hero, Enemy, Projectile, Particle, HeroClass, HeroStats, PlacedBlock, ItemOnGround } from '../types';
import { drawPixelSprite, SpriteName } from '../utils/sprites';
import { sfx } from '../utils/sound';
import { HERO_TEMPLATES } from '../data';
import { 
  Volume2, VolumeX, Pause, Play, Heart, Flame, Shield, ArrowRight,
  Sparkles, Compass, Check, HelpCircle, Eye, Hammer, Moon, Sun, ArrowRightLeft
} from 'lucide-react';

interface PixelGameCanvasProps {
  selectedHeroClass: HeroClass;
  onGameOver: (finalScore: number, waveReached: number) => void;
  onExit: () => void;
}

// Canvas proportions
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const TILE_SIZE = 20; // 40 columns x 25 rows

interface GridCell {
  col: number;
  row: number;
  type: 'grass' | 'water' | 'tree' | 'rock' | 'wood_wall' | 'stone_wall' | 'door_closed' | 'door_open' | 'bed' | 'campfire';
  hp: number;
  maxHp: number;
}

export default function PixelGameCanvas({ selectedHeroClass, onGameOver, onExit }: PixelGameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game state syncing with UI
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [heroHp, setHeroHp] = useState<number>(100);
  const [heroMaxHp, setHeroMaxHp] = useState<number>(100);
  
  // Survival parameters
  const [hunger, setHunger] = useState<number>(100);
  const [energy, setEnergy] = useState<number>(100);
  const [woodCount, setWoodCount] = useState<number>(10);
  const [stoneCount, setStoneCount] = useState<number>(5);
  const [meatCount, setMeatCount] = useState<number>(2);
  const [fishCount, setFishCount] = useState<number>(0);
  
  // Day / Night state
  const [gameDay, setGameDay] = useState<number>(1);
  const [gameHour, setGameHour] = useState<number>(8);
  const [gameMinute, setGameMinute] = useState<number>(0);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [ambientLight, setAmbientLight] = useState<number>(0); // Darkness overlay opacity
  
  // Custom Costume Theme selection
  const [currentOutfit, setCurrentOutfit] = useState<string>('outfit_silver'); // outfit_red, outfit_blue, outfit_black, outfit_purple, outfit_silver
  
  // Build systems
  const [isBuildMode, setIsBuildMode] = useState<boolean>(false);
  const [selectedBuildType, setSelectedBuildType] = useState<'wood_wall' | 'stone_wall' | 'door' | 'campfire' | 'bed'>('wood_wall');
  
  // Sleeping triggers
  const [isSleeping, setIsSleeping] = useState<boolean>(false);
  const [sleepProgress, setSleepProgress] = useState<number>(0);
  
  // Fishing system state
  const [fishingState, setFishingState] = useState<'idle' | 'casting' | 'waiting' | 'bite' | 'fail'>('idle');
  const [fishingTargetTile, setFishingTargetTile] = useState<{ col: number; row: number } | null>(null);
  
  // Notifications
  const [survivalBanner, setSurvivalBanner] = useState<string | null>("HARI BARU DIMULAI! BERTAHANLAH 🪵");

  // State refs to bypass react closures during RAF
  const stateRef = useRef<{
    hero: Hero;
    keys: Record<string, boolean>;
    mouse: { x: number; y: number; isDown: boolean };
    gameTime: number; // Ticks
    mapGrid: GridCell[];
    enemies: Enemy[];
    projectiles: Projectile[];
    particles: Particle[];
    droppedItems: ItemOnGround[];
    isGameActive: boolean;
    flashTimer: number;
    fishingState: 'idle' | 'casting' | 'waiting' | 'bite' | 'fail';
    fishingTimer: number;
    isSleeping: boolean;
    wood: number;
    stone: number;
    meat: number;
    fish: number;
    score: number;
  }>({
    hero: {
      id: selectedHeroClass,
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      width: 24,
      height: 28,
      hp: HERO_TEMPLATES[selectedHeroClass].maxHp,
      maxHp: HERO_TEMPLATES[selectedHeroClass].maxHp,
      level: 1,
      xp: 0,
      maxXp: 100,
      coins: 0,
      abilityTimer: 0,
      lastAttackTime: 0,
      facingRight: true,
      score: 0,
      hunger: 100,
      maxHunger: 100,
      energy: 100,
      maxEnergy: 100,
      wood: 10,
      stone: 5,
      meat: 2,
      fish: 0,
      currentOutfit: 'outfit_silver',
    },
    keys: {},
    mouse: { x: 0, y: 0, isDown: false },
    gameTime: 1440, // Start at 8:00 (calculated as gameTime / 180 hours)
    mapGrid: [],
    enemies: [],
    projectiles: [],
    particles: [],
    droppedItems: [],
    isGameActive: true,
    flashTimer: 0,
    fishingState: 'idle',
    fishingTimer: 0,
    isSleeping: false,
    wood: 10,
    stone: 5,
    meat: 2,
    fish: 0,
    score: 0,
  });

  // Sound syncs
  useEffect(() => {
    setIsMuted(sfx.getMuteStatus());
    sfx.startMusic();
    return () => {
      sfx.stopMusic();
    };
  }, []);

  const toggleMute = () => {
    const muted = sfx.toggleMute();
    setIsMuted(muted);
  };

  // Generate grid map on mount
  useEffect(() => {
    const grid: GridCell[] = [];
    // 40 columns x 25 rows
    for (let r = 0; r < 25; r++) {
      for (let c = 0; c < 40; c++) {
        let type: GridCell['type'] = 'grass';
        let hp = 100;
        let maxHp = 100;

        // Create winding lake/pond on left and bottom side for fishing
        const distToLeftBottom = Math.hypot(c - 0, r - 24);
        const distBottomRiver = Math.abs(r - 23) + Math.random() * 2;
        
        if (distToLeftBottom < 10 || (c < 8 && r > 12) || (c > 32 && r < 5)) {
          type = 'water';
        } else {
          // Scattered natural resources
          const rng = Math.random();
          // Skip spawn area
          const distToCenter = Math.hypot(c - 20, r - 12);
          if (distToCenter > 4) {
            if (rng < 0.08) {
              type = 'tree';
              hp = 3; // 3 chops
              maxHp = 3;
            } else if (rng < 0.12) {
              type = 'rock';
              hp = 4; // 4 mining hits
              maxHp = 4;
            }
          }
        }

        grid.push({ col: c, row: r, type, hp, maxHp });
      }
    }
    stateRef.current.mapGrid = grid;

    // Spawn starting cute animals
    trySpawnAnimals(12);

    // Initial message
    setTimeout(() => setSurvivalBanner(null), 3500);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      stateRef.current.keys[key] = true;

      // Space or Q for attack / chop / mine
      if (e.key === ' ' || key === 'q') {
        e.preventDefault();
        triggerInteractOrSwing();
      }

      // F to trigger quick Fishing near water
      if (key === 'f') {
        triggerFishingAction();
      }

      // T to trigger quick Sleep near Bed
      if (key === 't') {
        triggerSleepAction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      stateRef.current.keys[key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Sync Outfit state with ref
  useEffect(() => {
    stateRef.current.hero.currentOutfit = currentOutfit;
  }, [currentOutfit]);

  // Handle Action functions
  const triggerInteractOrSwing = () => {
    const state = stateRef.current;
    if (state.isSleeping) return;

    // Expend energy slightly on swing
    state.hero.energy = Math.max(0, state.hero.energy - 0.5);
    setEnergy(Math.floor(state.hero.energy));

    const range = 60;
    const hX = state.hero.x + state.hero.width / 2;
    const hY = state.hero.y + state.hero.height / 2;

    // Standard attack sprite swing sound
    sfx.playAttack(selectedHeroClass);

    // 1. Swing visual effect
    const angle = state.hero.facingRight ? 0 : Math.PI;
    const slashVX = Math.cos(angle) * 3;
    const slashVY = Math.sin(angle) * 3;
    state.projectiles.push({
      id: Math.random().toString(),
      x: hX + (state.hero.facingRight ? 24 : -24),
      y: hY,
      vx: slashVX,
      vy: slashVY,
      radius: 20,
      damage: 10,
      color: '#ffffff',
      isPlayerOwned: true,
      survivalTime: 8,
      maxSurvivalTime: 8,
      type: 'sword_slash'
    });

    // Spawn swing spark particles
    for (let i = 0; i < 4; i++) {
      state.particles.push({
        id: Math.random().toString(),
        x: hX + (state.hero.facingRight ? 15 : -15) + (Math.random() * 10 - 5),
        y: hY + (Math.random() * 10 - 5),
        vx: (state.hero.facingRight ? 2 : -2) + Math.random() * 1 - 0.5,
        vy: Math.random() * 2 - 1,
        color: '#E5E7EB',
        size: Math.random() * 3 + 1,
        life: 1.0,
        maxLife: 15,
        type: 'spark'
      });
    }

    // 2. Damage nearby natural resources (Trees / Rocks) or toggle doors
    const pCol = Math.floor(hX / TILE_SIZE);
    const pRow = Math.floor(hY / TILE_SIZE);

    // Look at adjacent cells to check if resource
    const adjacentOffsets = [
      { c: 0, r: 0 },
      { c: 1, r: 0 },
      { c: -1, r: 0 },
      { c: 0, r: 1 },
      { c: 0, r: -1 },
      { c: 1, r: 1 },
      { c: -1, r: -1 },
      { c: -1, r: 1 },
      { c: 1, r: -1 }
    ];

    let hitSomething = false;

    for (const offset of adjacentOffsets) {
      const tc = pCol + offset.c;
      const tr = pRow + offset.r;
      if (tc < 0 || tc >= 40 || tr < 0 || tr >= 25) continue;

      const idx = tr * 40 + tc;
      const cell = state.mapGrid[idx];
      if (!cell) continue;

      // Distance to block
      const cellCenterX = tc * TILE_SIZE + 10;
      const cellCenterY = tr * TILE_SIZE + 10;
      const dist = Math.hypot(hX - cellCenterX, hY - cellCenterY);

      if (dist < 45) {
        if (cell.type === 'tree') {
          cell.hp -= 1;
          hitSomething = true;
          sfx.playHit();
          addFloatingText(cellCenterX, cellCenterY - 10, 'CHOP! 🪵', '#B45309');
          // Spawn wood shavings particles
          spawnShavingsParticles(cellCenterX, cellCenterY, '#78350F', 'wood');
          
          if (cell.hp <= 0) {
            cell.type = 'grass';
            const logYield = Math.floor(Math.random() * 3) + 2; // 2-4 wood logs
            spawnGroundItem(cellCenterX, cellCenterY, 'wood', logYield);
            state.score += 5;
            sfx.playCoin();
          }
          break; // Hit one resource block per click
        } else if (cell.type === 'rock') {
          cell.hp -= 1;
          hitSomething = true;
          sfx.playHit();
          addFloatingText(cellCenterX, cellCenterY - 10, 'MINE! 🪨', '#6B7280');
          // Spawn stone bits
          spawnShavingsParticles(cellCenterX, cellCenterY, '#9CA3AF', 'stone');
          
          if (cell.hp <= 0) {
            cell.type = 'grass';
            const stoneYield = Math.floor(Math.random() * 2) + 1; // 1-3 stone ores
            spawnGroundItem(cellCenterX, cellCenterY, 'stone', stoneYield);
            state.score += 7;
            sfx.playCoin();
          }
          break;
        } else if (cell.type === 'door_closed') {
          cell.type = 'door_open';
          hitSomething = true;
          sfx.playHeal();
          addFloatingText(cellCenterX, cellCenterY - 10, 'PINTU DIBUKA 🔓', '#10B981');
          break;
        } else if (cell.type === 'door_open') {
          cell.type = 'door_closed';
          hitSomething = true;
          sfx.playHeal();
          addFloatingText(cellCenterX, cellCenterY - 10, 'PINTU DITUTUP 🔒', '#EF4444');
          break;
        }
      }
    }

    // 3. Attack nearby mobs / animals
    state.enemies.forEach((enemy) => {
      const eCX = enemy.x + enemy.width / 2;
      const eCY = enemy.y + enemy.height / 2;
      const dist = Math.hypot(hX - eCX, hY - eCY);

      if (dist < 50) {
        // Match directional orientation to be generous
        const matchDir = state.hero.facingRight ? (eCX > hX - 10) : (eCX < hX + 10);
        if (matchDir) {
          enemy.hp -= 10 + (selectedHeroClass === 'knight' ? 5 : 0); // Knight bonus strike
          enemy.flashTimer = 8;
          sfx.playHit();
          hitSomething = true;

          // Push back animal / monster!
          const angle = Math.atan2(eCY - hY, eCX - hX);
          enemy.x += Math.cos(angle) * 15;
          enemy.y += Math.sin(angle) * 15;

          // If animal, trigger panic!
          if (enemy.type === 'chicken' || enemy.type === 'deer' || enemy.type === 'boar') {
            addFloatingText(enemy.x, enemy.y - 10, '❗ PANIK!', '#FB923C');
            enemy.speed = 4.5; // Runs super fast when hunted
          }

          // Blood / hit splatters
          spawnShavingsParticles(eCX, eCY, enemy.type === 'skeleton' ? '#E5E7EB' : '#EF4444', 'blood');

          if (enemy.hp <= 0) {
            // Defeated!
            addFloatingText(eCX, eCY - 8, `X_X ${enemy.name}`, '#ffffff');
            handleEntityDefeated(enemy);
          }
        }
      }
    });
  };

  // Ground resource items
  const spawnGroundItem = (x: number, y: number, type: ItemOnGround['type'], amount: number) => {
    stateRef.current.droppedItems.push({
      id: Math.random().toString(),
      x,
      y,
      type,
      amount,
      lifetime: 600 // 10 seconds before decay
    });
  };

  // Shards visual debris particles
  const spawnShavingsParticles = (x: number, y: number, color: string, type: 'wood' | 'stone' | 'blood' | 'splash') => {
    const state = stateRef.current;
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const sp = Math.random() * 2 + 1;
      state.particles.push({
        id: Math.random().toString(),
        x,
        y,
        vx: Math.cos(angle) * sp,
        vy: Math.sin(angle) * sp - 1, // Slightly rising path
        color,
        size: Math.random() * 3 + 1,
        life: 1.0,
        maxLife: 20 + Math.random() * 20,
        type: type === 'blood' ? 'blood' : type === 'wood' ? 'wood' : 'stone'
      });
    }
  };

  // Mob/Animal defeat payouts
  const handleEntityDefeated = (e: Enemy) => {
    const state = stateRef.current;
    
    // Delete enemy from state array
    state.enemies = state.enemies.filter(item => item.id !== e.id);

    if (e.type === 'chicken') {
      spawnGroundItem(e.x + 10, e.y + 10, 'meat', 1);
      state.score += 15;
    } else if (e.type === 'deer') {
      spawnGroundItem(e.x + 12, e.y + 12, 'meat', 2);
      state.score += 25;
    } else if (e.type === 'boar') {
      spawnGroundItem(e.x + 14, e.y + 14, 'meat', 3);
      if (Math.random() < 0.5) spawnGroundItem(e.x + 14, e.y + 14, 'potion', 1);
      state.score += 35;
    } else {
      // Monsters
      spawnGroundItem(e.x + 12, e.y + 12, 'coin', Math.floor(Math.random() * 3) + 1);
      state.score += e.points;
    }

    sfx.playCoin();
  };

  // Quick Action: Fishing
  const triggerFishingAction = () => {
    const state = stateRef.current;
    if (state.isSleeping) return;

    if (fishingState !== 'idle') {
      // Reel it in!
      reelFishingRod();
      return;
    }

    // Must be adjacent to water cell
    const hX = state.hero.x + state.hero.width / 2;
    const hY = state.hero.y + state.hero.height / 2;
    const col = Math.floor(hX / TILE_SIZE);
    const row = Math.floor(hY / TILE_SIZE);

    // Look for adjacent water cells
    const offsets = [
      { c: 0, r: -1 }, { c: 0, r: 1 }, { c: -1, r: 0 }, { c: 1, r: 0 },
      { c: -1, r: -1 }, { c: 1, r: -1 }, { c: -1, r: 1 }, { c: 1, r: 1 }
    ];

    let foundWaterCell: GridCell | null = null;
    for (const off of offsets) {
      const tc = col + off.c;
      const tr = row + off.r;
      if (tc >= 0 && tc < 40 && tr >= 0 && tr < 25) {
        const cell = state.mapGrid[tr * 40 + tc];
        if (cell && cell.type === 'water') {
          foundWaterCell = cell;
          break;
        }
      }
    }

    if (!foundWaterCell) {
      addFloatingText(hX, hY - 15, "Cari air di tepi danau! 🌊", "#3B82F6");
      return;
    }

    // Cast the fishing line!
    setFishingState('casting');
    stateRef.current.fishingState = 'casting';
    const wtCol = foundWaterCell.col;
    const wtRow = foundWaterCell.row;
    setFishingTargetTile({ col: wtCol, row: wtRow });

    sfx.playHeal();
    addFloatingText(hX, hY - 15, "Pancingan Dilempar... 🎣", "#06B6D4");

    // Spawn splashes visual entry
    spawnGroundSplashes(wtCol * TILE_SIZE + 10, wtRow * TILE_SIZE + 10);

    // Casting period timer
    stateRef.current.fishingTimer = 110 + Math.random() * 120; // 2-4 seconds of wait
  };

  const spawnGroundSplashes = (x: number, y: number) => {
    const state = stateRef.current;
    for (let i = 0; i < 6; i++) {
      state.particles.push({
        id: Math.random().toString(),
        x,
        y,
        vx: Math.random() * 1.5 - 0.75,
        vy: -(Math.random() * 2 + 1),
        color: '#60A5FA',
        size: Math.random() * 2.5 + 1.5,
        life: 1.0,
        maxLife: 25,
        type: 'text' // simple particle
      });
    }
  };

  const reelFishingRod = () => {
    const state = stateRef.current;
    const hX = state.hero.x + state.hero.width / 2;
    const hY = state.hero.y + state.hero.height / 2;

    if (state.fishingState === 'bite') {
      // SUCCESSFUL CATCH!
      sfx.playHeal();
      sfx.playCoin();

      const fishRng = Math.random();
      let fishType = "Ikan Mas";
      let textCol = "#60A5FA";

      if (fishRng < 0.25) {
        fishType = "Lele Jumbo 🐟";
        textCol = "#B45309";
      } else if (fishRng < 0.50) {
        fishType = "Salmon Gurih 🐠";
        textCol = "#F43F5E";
      } else if (fishRng < 0.75) {
        fishType = "Kakap Emas 🌟";
        textCol = "#F59E0B";
      } else if (fishRng < 0.90) {
        fishType = "Udang Segar 🦐";
        textCol = "#FB7185";
      } else {
        fishType = "Ikan Tuna Gergasi 🐋";
        textCol = "#A855F7";
      }

      state.fish += 1;
      setFishCount(state.fish);
      addFloatingText(hX, hY - 18, `DAPAT! ${fishType}`, textCol);

      // Splash on player
      spawnGroundSplashes(hX, hY);
      state.score += 50;

    } else {
      // Too early or missed
      addFloatingText(hX, hY - 18, "Pancingan ditarik kosong... 💨", "#9CA3AF");
      sfx.playHit();
    }

    // Reset rod
    setFishingState('idle');
    stateRef.current.fishingState = 'idle';
    setFishingTargetTile(null);
  };

  // Quick Action: Sleep close to placed bedtime
  const triggerSleepAction = () => {
    const state = stateRef.current;
    if (state.isSleeping) return;

    // Check if player is near any Bed block
    const hX = state.hero.x + state.hero.width / 2;
    const hY = state.hero.y + state.hero.height / 2;

    let nearBed = false;
    for (const cell of state.mapGrid) {
      if (cell.type === 'bed') {
        const d = Math.hypot(hX - (cell.col * TILE_SIZE + 10), hY - (cell.row * TILE_SIZE + 10));
        if (d < 50) {
          nearBed = true;
          break;
        }
      }
    }

    if (!nearBed) {
      addFloatingText(hX, hY - 15, "Kamu harus berada di dekat kasur ranjang! 🛌", "#F59E0B");
      return;
    }

    // Trigger Sleep Sequence
    setIsSleeping(true);
    stateRef.current.isSleeping = true;
    sfx.playHeal();
    setSurvivalBanner("TIDUR NYENYAK... 💤 Waktu berlalu cepat.");
  };

  // Block builder placement click
  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || isPaused) return;

    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    // Translate to model coordinates
    const clickX = (relativeX / rect.width) * CANVAS_WIDTH;
    const clickY = (relativeY / rect.height) * CANVAS_HEIGHT;

    const col = Math.floor(clickX / TILE_SIZE);
    const row = Math.floor(clickY / TILE_SIZE);

    if (col < 0 || col >= 40 || row < 0 || row >= 25) return;

    const state = stateRef.current;
    const hX = state.hero.x + state.hero.width / 2;
    const hY = state.hero.y + state.hero.height / 2;

    const cellIdx = row * 40 + col;
    const cell = state.mapGrid[cellIdx];
    if (!cell) return;

    // If build mode is active
    if (isBuildMode) {
      // Must be standing moderately near the cell
      const buildDist = Math.hypot(hX - (col * TILE_SIZE + 10), hY - (row * TILE_SIZE + 10));
      if (buildDist > 120) {
        addFloatingText(clickX, clickY - 10, "Terlalu Jauh! 🚫", "#EF4444");
        return;
      }

      if (cell.type !== 'grass') {
        addFloatingText(clickX, clickY - 10, "Lantai Terhalang! 🚫", "#EF4444");
        return;
      }

      // Check cost requirements
      let woodCost = 0;
      let stoneCost = 0;
      let cellType: GridCell['type'] = 'grass';

      if (selectedBuildType === 'wood_wall') {
        woodCost = 3;
        cellType = 'wood_wall';
      } else if (selectedBuildType === 'stone_wall') {
        stoneCost = 3;
        cellType = 'stone_wall';
      } else if (selectedBuildType === 'door') {
        woodCost = 4;
        cellType = 'door_closed';
      } else if (selectedBuildType === 'campfire') {
        woodCost = 3;
        cellType = 'campfire';
      } else if (selectedBuildType === 'bed') {
        woodCost = 6;
        stoneCost = 2;
        cellType = 'bed';
      }

      if (state.wood < woodCost || state.stone < stoneCost) {
        addFloatingText(hX, hY - 15, "Bahan tidak cukup! 🌲🪵", "#EF4444");
        sfx.playHit();
        return;
      }

      // Perform Build placement
      state.wood -= woodCost;
      state.stone -= stoneCost;
      setWoodCount(state.wood);
      setStoneCount(state.stone);

      cell.type = cellType;
      cell.hp = 10;
      cell.maxHp = 10;

      sfx.playHeal();
      addFloatingText(col * TILE_SIZE + 10, row * TILE_SIZE - 5, "TERBANGUN! 🛠️", "#10B981");

      // Spawn smoke building particles
      for (let i = 0; i < 6; i++) {
        state.particles.push({
          id: Math.random().toString(),
          x: col * TILE_SIZE + 10 + (Math.random() * 10 - 5),
          y: row * TILE_SIZE + 10 + (Math.random() * 10 - 5),
          vx: Math.random() * 1 - 0.5,
          vy: -Math.random() * 1,
          color: '#E5E7EB',
          size: Math.random() * 4 + 2,
          life: 1.0,
          maxLife: 20,
          type: 'spark'
        });
      }

    } else {
      // Non-build mode: Check if clicking a door or block next to player to break it
      const clickDist = Math.hypot(hX - (col * TILE_SIZE + 10), hY - (row * TILE_SIZE + 10));
      if (clickDist < 80) {
        if (cell.type === 'wood_wall' || cell.type === 'stone_wall' || cell.type === 'door_closed' || cell.type === 'door_open' || cell.type === 'campfire' || cell.type === 'bed') {
          // Miner/Deconstruct tool
          sfx.playHit();
          spawnShavingsParticles(col * TILE_SIZE + 10, row * TILE_SIZE + 10, '#9CA3AF', 'stone');
          
          cell.hp -= 2;
          addFloatingText(col * TILE_SIZE + 10, row * TILE_SIZE - 5, `BONGKAR ${cell.hp}hp`, '#F59E0B');

          if (cell.hp <= 0) {
            // Drop some back
            if (cell.type === 'wood_wall') spawnGroundItem(col * TILE_SIZE + 10, row * TILE_SIZE + 10, 'wood', 1);
            if (cell.type === 'stone_wall') spawnGroundItem(col * TILE_SIZE + 10, row * TILE_SIZE + 10, 'stone', 1);
            if (cell.type === 'bed') {
              spawnGroundItem(col * TILE_SIZE + 10, row * TILE_SIZE + 10, 'wood', 3);
              spawnGroundItem(col * TILE_SIZE + 10, row * TILE_SIZE + 10, 'stone', 1);
            }
            cell.type = 'grass';
            sfx.playCoin();
          }
        }
      }
    }
  };

  // Eating triggers
  const handleEatFood = (type: 'meat' | 'fish') => {
    const state = stateRef.current;
    if (state.isSleeping) return;

    if (type === 'meat') {
      if (state.meat <= 0) return;
      state.meat -= 1;
      setMeatCount(state.meat);
      
      // Determine if cooked nearby campfire
      const cooked = isNearCampfire();
      const healAmount = cooked ? 40 : 20;
      const hungerRestore = cooked ? 50 : 30;

      state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + healAmount);
      state.hero.hunger = Math.min(100, state.hero.hunger + hungerRestore);
      
      setHeroHp(state.hero.hp);
      setHunger(Math.ceil(state.hero.hunger));
      sfx.playHeal();
      addFloatingText(state.hero.x + 12, state.hero.y - 12, cooked ? "Makan Daging Bakar Enak! 🥩🔥" : "Makan Daging Mentah! 🥩", "#EF4444");

    } else if (type === 'fish') {
      if (state.fish <= 0) return;
      state.fish -= 1;
      setFishCount(state.fish);

      const cooked = isNearCampfire();
      const healAmount = cooked ? 45 : 25;
      const hungerRestore = cooked ? 60 : 35;

      state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + healAmount);
      state.hero.hunger = Math.min(100, state.hero.hunger + hungerRestore);

      setHeroHp(state.hero.hp);
      setHunger(Math.ceil(state.hero.hunger));
      sfx.playHeal();
      addFloatingText(state.hero.x + 12, state.hero.y - 12, cooked ? "Ikan Bakar Sempurna! 🐟🔥" : "Makan Ikan Mentah! 🐟", "#06B6D4");
    }
  };

  const isNearCampfire = (): boolean => {
    const state = stateRef.current;
    const hX = state.hero.x + state.hero.width / 2;
    const hY = state.hero.y + state.hero.height / 2;

    for (const cell of state.mapGrid) {
      if (cell.type === 'campfire') {
        const d = Math.hypot(hX - (cell.col * TILE_SIZE + 10), hY - (cell.row * TILE_SIZE + 10));
        if (d < 70) return true;
      }
    }
    return false;
  };

  // Floating text visuals generator
  const addFloatingText = (x: number, y: number, text: string, color: string) => {
    stateRef.current.particles.push({
      id: Math.random().toString(),
      x,
      y,
      vx: 0,
      vy: -0.7,
      color,
      size: 12, // text flag
      life: 1.0,
      maxLife: 60,
      type: 'text',
      textValue: text
    });
  };

  // Passive Mob spawners
  const trySpawnAnimals = (count: number) => {
    const types: Enemy['type'][] = ['chicken', 'deer', 'boar'];
    const names = { chicken: 'Ayam Hutan 🐔', deer: 'Rusa Liar 🦌', boar: 'Babi Hutan 🐗' };
    const hps = { chicken: 1, deer: 15, boar: 25 };
    const speeds = { chicken: 1.2, deer: 1.8, boar: 1.4 };

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      // Grab grass tiles
      const grassTiles = stateRef.current.mapGrid.filter(cell => cell.type === 'grass');
      if (grassTiles.length === 0) continue;

      const dest = grassTiles[Math.floor(Math.random() * grassTiles.length)];
      stateRef.current.enemies.push({
        id: Math.random().toString(),
        type,
        name: names[type],
        x: dest.col * TILE_SIZE,
        y: dest.row * TILE_SIZE,
        width: type === 'boar' ? 24 : type === 'deer' ? 22 : 18,
        height: type === 'boar' ? 20 : type === 'deer' ? 26 : 18,
        hp: hps[type],
        maxHp: hps[type],
        speed: speeds[type],
        damage: type === 'boar' ? 4 : 0, // boar fights back slightly!
        points: type === 'boar' ? 30 : 20,
        isBoss: false,
        color: '#ffffff',
        facingRight: Math.random() < 0.5,
        flashTimer: 0
      });
    }
  };

  // Night aggressive mob spawners (Gua slimes, skeleton, bat)
  const trySpawnNightMonsters = () => {
    const grassTiles = stateRef.current.mapGrid.filter(cell => cell.type === 'grass');
    if (grassTiles.length === 0) return;

    const spawnCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 monsters at once
    const types: Enemy['type'][] = ['slime_blue', 'slime_red', 'bat', 'skeleton'];
    const names = { slime_blue: 'Slime Biru 👻', slime_red: 'Slime Merah 😡', bat: 'Kelelawar Malam 🦇', skeleton: 'Tengkorak Hidup 💀' };
    const hps = { slime_blue: 20, slime_red: 35, bat: 12, skeleton: 45 };
    const damages = { slime_blue: 6, slime_red: 10, bat: 4, skeleton: 14 };
    const speeds = { slime_blue: 1.3, slime_red: 1.6, bat: 2.2, skeleton: 1.0 };

    for (let i = 0; i < spawnCount; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const targetCell = grassTiles[Math.floor(Math.random() * grassTiles.length)];

      const distPlayer = Math.hypot(
        targetCell.col * TILE_SIZE - stateRef.current.hero.x,
        targetCell.row * TILE_SIZE - stateRef.current.hero.y
      );

      // Do not spawn next to the player's camp
      if (distPlayer > 150) {
        stateRef.current.enemies.push({
          id: Math.random().toString(),
          type,
          name: names[type],
          x: targetCell.col * TILE_SIZE,
          y: targetCell.row * TILE_SIZE,
          width: type === 'skeleton' ? 22 : type === 'bat' ? 18 : 20,
          height: type === 'skeleton' ? 28 : type === 'bat' ? 18 : 20,
          hp: hps[type],
          maxHp: hps[type],
          speed: speeds[type],
          damage: damages[type],
          points: hps[type],
          isBoss: false,
          color: '#ffffff',
          facingRight: Math.random() < 0.5,
          flashTimer: 0
        });
      }
    }
  };

  // Core Game Loop hook
  useEffect(() => {
    let animationFrameId: number;

    const updateFrame = () => {
      if (isPaused || !stateRef.current.isGameActive) {
        animationFrameId = requestAnimationFrame(updateFrame);
        return;
      }

      const state = stateRef.current;
      const hero = state.hero;

      // --- INCREMENT GAME CLOCK ---
      if (state.isSleeping) {
        // Sleep fast-forwards until dawn (06:00 AM)
        state.gameTime += 20; 
        const hour = Math.floor(state.gameTime / 180) % 24;
        
        // Sleep healing
        hero.hp = Math.min(hero.maxHp, hero.hp + 0.5);
        hero.hunger = Math.min(100, hero.hunger + 0.4);
        hero.energy = Math.min(100, hero.energy + 0.8);

        setHeroHp(Math.ceil(hero.hp));
        setHunger(Math.ceil(hero.hunger));
        setEnergy(Math.ceil(hero.energy));

        if (hour === 6) {
          // Morning arrives!
          setIsSleeping(false);
          state.isSleeping = false;
          setGameDay(prev => prev + 1);
          setSurvivalBanner("SELAMAT PAGI! 🌞 Hari Baru Telah Tiba.");
          setTimeout(() => setSurvivalBanner(null), 3500);
          sfx.playLevelUp();

          // Safely incinerate night monsters
          state.enemies = state.enemies.filter(enemy => {
            const isNightBorn = enemy.type === 'slime_blue' || enemy.type === 'slime_red' || enemy.type === 'bat' || enemy.type === 'skeleton';
            if (isNightBorn) {
              spawnShavingsParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#F59E0B', 'splash');
              return false;
            }
            return true;
          });
        }
      } else {
        state.gameTime += 1;
      }

      // Sync clock variables
      const timeTotalHours = Math.floor(state.gameTime / 180);
      const hour = timeTotalHours % 24;
      const minute = Math.floor(((state.gameTime % 180) / 180) * 60);

      setGameHour(hour);
      setGameMinute(minute);

      // Dusk/Night opacity overlays
      const isNight = hour >= 18 || hour < 5;
      setIsNightMode(isNight);

      let opacity = 0;
      if (hour === 17) {
        // Transition to dusk (0 to 0.4)
        opacity = (minute / 60) * 0.4;
      } else if (hour === 18) {
        // Transition to deeper dusk (0.4 to 0.75)
        opacity = 0.4 + (minute / 60) * 0.35;
      } else if (hour >= 19 || hour < 4) {
        opacity = 0.75;
      } else if (hour === 4) {
        // Dawn break (0.75 to 0.3)
        opacity = 0.75 - (minute / 60) * 0.45;
      } else if (hour === 5) {
        // Sunrise (0.3 to 0)
        opacity = 0.3 - (minute / 60) * 0.3;
      }
      setAmbientLight(opacity);

      // --- HUNGER / STARVATION BAR DRAIN ---
      if (!state.isSleeping) {
        // Slowly lose hunger over time
        hero.hunger = Math.max(0, hero.hunger - 0.004);
        setHunger(Math.ceil(hero.hunger));

        // Slowly lose energy over time if moving
        const hasInput = state.keys['w'] || state.keys['a'] || state.keys['s'] || state.keys['d'] ||
                         state.keys['arrowup'] || state.keys['arrowdown'] || state.keys['arrowleft'] || state.keys['arrowright'];
        if (hasInput) {
          hero.energy = Math.max(0, hero.energy - 0.008);
        } else {
          // Passive recharge energy near campfires
          if (isNearCampfire()) {
            hero.energy = Math.min(100, hero.energy + 0.1);
          } else {
            hero.energy = Math.min(100, hero.energy + 0.015);
          }
        }
        setEnergy(Math.ceil(hero.energy));

        // Starvation damage!
        if (hero.hunger <= 0) {
          hero.hp -= 0.03; // Slowly die of hunger!
          setHeroHp(Math.max(0, Math.ceil(hero.hp)));
          state.flashTimer = 2; // minor red flash

          if (Math.random() < 0.02) {
            addFloatingText(hero.x + 12, hero.y - 12, "Lapar! Makan daging/ikan! 🍖🐟", "#EF4444");
          }
        }
      }

      // --- SPAWN MECHANICS OVER TIME ---
      // Passive animal replenishment
      const passiveCount = state.enemies.filter(e => e.type === 'chicken' || e.type === 'deer' || e.type === 'boar').length;
      if (passiveCount < 5 && Math.random() < 0.002) {
        trySpawnAnimals(2);
      }

      // Night monster triggers
      if (isNight && !state.isSleeping) {
        const monsterCount = state.enemies.filter(e => e.type === 'slime_blue' || e.type === 'slime_red' || e.type === 'bat' || e.type === 'skeleton').length;
        if (monsterCount < 8 && Math.random() < 0.015) {
          trySpawnNightMonsters();
        }
      }

      // Natural forest replenishment
      const treeCount = state.mapGrid.filter(cell => cell.type === 'tree').length;
      if (treeCount < 8 && Math.random() < 0.001) {
        const grassTiles = state.mapGrid.filter(cell => cell.type === 'grass');
        if (grassTiles.length > 10) {
          grassTiles[Math.floor(Math.random() * grassTiles.length)].type = 'tree';
        }
      }

      // --- FISHING MINIGAME SYSTEM UPDATES ---
      if (state.fishingState === 'casting') {
        state.fishingTimer -= 1;
        if (state.fishingTimer <= 0) {
          // BITE HAPPENED!
          state.fishingState = 'bite';
          setFishingState('bite');
          sfx.playHit(); // loud bite chime splash
          addFloatingText(hero.x + 12, hero.y - 16, "❗ REEL SEKARANG! PRESS F ATAU SPACE", "#FB923C");
          state.fishingTimer = 45; // 0.75 seconds to react!
        }
      } else if (state.fishingState === 'bite') {
        state.fishingTimer -= 1;
        if (state.fishingTimer <= 0) {
          // MISSED!
          state.fishingState = 'fail';
          setFishingState('fail');
          addFloatingText(hero.x + 12, hero.y - 16, "Ikan Melarikan diri... 💨", "#9CA3AF");
          // Reset
          setTimeout(() => {
            setFishingState('idle');
            stateRef.current.fishingState = 'idle';
            setFishingTargetTile(null);
          }, 1500);
        }
      }

      // --- HERO MOVEMENT ---
      if (!state.isSleeping) {
        let dx = 0;
        let dy = 0;

        if (state.keys['w'] || state.keys['arrowup']) dy = -1;
        if (state.keys['s'] || state.keys['arrowdown']) dy = 1;
        if (state.keys['a'] || state.keys['arrowleft']) {
          dx = -1;
          hero.facingRight = false;
        }
        if (state.keys['d'] || state.keys['arrowright']) {
          dx = 1;
          hero.facingRight = true;
        }

        // Normalize velocity
        if (dx !== 0 || dy !== 0) {
          const mag = Math.hypot(dx, dy);
          const currentSpeed = HERO_TEMPLATES[selectedHeroClass].speed;
          
          let nextX = hero.x + (dx / mag) * currentSpeed;
          let nextY = hero.y + (dy / mag) * currentSpeed;

          // Stand open door check (walk to closed doors opens them, or locks collisions)
          const aheadCol = Math.floor((nextX + (dx >= 0 ? hero.width : 0)) / TILE_SIZE);
          const aheadRow = Math.floor((nextY + (dy >= 0 ? hero.height : 0)) / TILE_SIZE);
          
          if (aheadCol >= 0 && aheadCol < 40 && aheadRow >= 0 && aheadRow < 25) {
            const checkCell = state.mapGrid[aheadRow * 40 + aheadCol];
            // Walk touch opens door
            if (checkCell && checkCell.type === 'door_closed') {
              checkCell.type = 'door_open';
              addFloatingText(aheadCol * TILE_SIZE + 10, aheadRow * TILE_SIZE - 5, "Disentuh: Tok! 🚪🔓", "#10B981");
              sfx.playHeal();
            }
          }

          // Boundary + Solid Block collision checks
          const collisionX = checkSolidCollision(nextX, hero.y, hero.width, hero.height);
          const collisionY = checkSolidCollision(hero.x, nextY, hero.width, hero.height);

          if (!collisionX) hero.x = nextX;
          if (!collisionY) hero.y = nextY;
        }
      }

      // --- DETECT MAGNETIZED DROPPED PERSISTING ITEMS ---
      const hCX = hero.x + hero.width / 2;
      const hCY = hero.y + hero.height / 2;
      
      state.droppedItems.forEach((item) => {
        item.lifetime -= 1;
        
        // Magnet pulling range
        const d = Math.hypot(hCX - item.x, hCY - item.y);
        if (d < 75) {
          // Pull close
          const angle = Math.atan2(hCY - item.y, hCX - item.x);
          item.x += Math.cos(angle) * 4.5;
          item.y += Math.sin(angle) * 4.5;

          // Pick up!
          if (d < 18) {
            item.lifetime = -100; // trigger delete
            sfx.playCoin();

            if (item.type === 'wood') {
              state.wood += item.amount;
              setWoodCount(state.wood);
              addFloatingText(item.x, item.y, `+${item.amount} Kayu 🪵`, '#FB923C');
            } else if (item.type === 'stone') {
              state.stone += item.amount;
              setStoneCount(state.stone);
              addFloatingText(item.x, item.y, `+${item.amount} Batu 🪨`, '#9CA3AF');
            } else if (item.type === 'meat') {
              state.meat += item.amount;
              setMeatCount(state.meat);
              addFloatingText(item.x, item.y, `+${item.amount} Daging Segar 🥩`, '#F87171');
            } else if (item.type === 'fish') {
              state.fish += item.amount;
              setFishCount(state.fish);
              addFloatingText(item.x, item.y, `+${item.amount} Ikan Mentah 🐟`, '#60A5FA');
            } else if (item.type === 'potion') {
              // Direct HP restore
              hero.hp = Math.min(hero.maxHp, hero.hp + 35);
              setHeroHp(Math.ceil(hero.hp));
              addFloatingText(item.x, item.y, "RAMUAN DARAH HP! ❤️", "#F43F5E");
            } else if (item.type === 'coin') {
              // Direct XP/Score boost
              hero.coins += item.amount;
              state.score += item.amount * 10;
              addFloatingText(item.x, item.y, `+${item.amount * 10}XP Skor! ⭐`, '#FBBF24');
            }
          }
        }
      });

      // Filter decayed or scooped items
      state.droppedItems = state.droppedItems.filter(i => i.lifetime > 0);

      // --- ENEMY SYSTEM (Passive Wanders & Aggressive Seekers) ---
      state.enemies.forEach((enemy) => {
        const eCX = enemy.x + enemy.width / 2;
        const eCY = enemy.y + enemy.height / 2;
        
        enemy.flashTimer = Math.max(0, enemy.flashTimer - 1);

        // Movement AI
        const isPassive = enemy.type === 'chicken' || enemy.type === 'deer' || enemy.type === 'boar';
        
        if (isPassive) {
          // Passive herds wander randomly on grass lawns
          if (Math.random() < 0.015) {
            enemy.facingRight = Math.random() < 0.5;
            // set temporary wander vector
            (enemy as any).wanderAngle = Math.random() * Math.PI * 2;
            (enemy as any).wanderTicks = 30 + Math.random() * 40;
          }

          if ((enemy as any).wanderTicks && (enemy as any).wanderTicks > 0) {
            (enemy as any).wanderTicks -= 1;
            const a = (enemy as any).wanderAngle || 0;
            const stepX = enemy.x + Math.cos(a) * enemy.speed;
            const stepY = enemy.y + Math.sin(a) * enemy.speed;

            // Restrict from falling into full water / walls
            if (!checkSolidCollision(stepX, stepY, enemy.width, enemy.height)) {
              enemy.x = stepX;
              enemy.y = stepY;
              enemy.facingRight = Math.cos(a) >= 0;
            } else {
              // Collided, cancel wander
              (enemy as any).wanderTicks = 0;
            }
          }

        } else {
          // Night Aggressive creatures seek player!
          const dToHero = Math.hypot(hero.x - enemy.x, hero.y - enemy.y);
          if (dToHero < 250) {
            const angle = Math.atan2(hero.y - enemy.y, hero.x - enemy.x);
            const stepX = enemy.x + Math.cos(angle) * enemy.speed;
            const stepY = enemy.y + Math.sin(angle) * enemy.speed;

            // Simple collision avoid with scenery
            if (!checkSolidCollision(stepX, stepY, enemy.width, enemy.height)) {
              enemy.x = stepX;
              enemy.y = stepY;
              enemy.facingRight = Math.cos(angle) >= 0;
            }
          }

          // Attack player on contact
          if (dToHero < 22) {
            if (Math.random() < 0.03) { // Delay contact hits
              hero.hp -= enemy.damage;
              setHeroHp(Math.max(0, Math.ceil(hero.hp)));
              state.flashTimer = 8; // Flash red screen
              sfx.playHit();
              addFloatingText(hero.x + 12, hero.y - 10, `-${enemy.damage} HP! 💥`, '#EF4444');

              if (hero.hp <= 0) {
                // Game Over trigger
                handlePlayerDefeated();
              }
            }
          }
        }
      });

      // --- DECAY PROJECTILES & PARTICLES ---
      state.projectiles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.survivalTime -= 1;
      });
      state.projectiles = state.projectiles.filter(p => p.survivalTime > 0);

      // Decay particles
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1 / p.maxLife;
      });
      state.particles = state.particles.filter(p => p.life > 0);

      // Decrement player visual pain flash
      state.flashTimer = Math.max(0, state.flashTimer - 1);

      // --- RENDERING CANVAS DRAW CALLS ---
      drawCanvasAssets();

      animationFrameId = requestAnimationFrame(updateFrame);
    };

    animationFrameId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, selectedHeroClass]);

  const checkSolidCollision = (x: number, y: number, w: number, h: number): boolean => {
    // Canvas bounds borders
    if (x < 0 || x + w > CANVAS_WIDTH) return true;
    if (y < 0 || y + h > CANVAS_HEIGHT) return true;

    const cells = stateRef.current.mapGrid;
    if (cells.length === 0) return false;

    // Check corners of the entity box
    const checkPoints = [
      { x: x, y: y },
      { x: x + w, y: y },
      { x: x, y: y + h },
      { x: x + w, y: y + h },
      { x: x + w/2, y: y + h/2 }
    ];

    for (const pt of checkPoints) {
      const col = Math.floor(pt.x / TILE_SIZE);
      const row = Math.floor(pt.y / TILE_SIZE);
      if (col < 0 || col >= 40 || row < 0 || row >= 25) continue;

      const cell = cells[row * 40 + col];
      if (cell) {
        if (cell.type === 'tree' || cell.type === 'rock' || cell.type === 'wood_wall' || cell.type === 'stone_wall' || cell.type === 'door_closed' || cell.type === 'bed') {
          return true;
        }
      }
    }
    return false;
  };

  const handlePlayerDefeated = () => {
    const state = stateRef.current;
    state.isGameActive = false;
    sfx.playGameOver();
    onGameOver(state.score, gameDay);
  };

  // HTML5 Render pipeline
  const drawCanvasAssets = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = stateRef.current;
    const hero = state.hero;

    // Clear background
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // --- 1. DRAW TILE GRID MAP (Grass, Water) ---
    for (let r = 0; r < 25; r++) {
      for (let c = 0; c < 40; c++) {
        const cell = state.mapGrid[r * 40 + c];
        if (!cell) continue;

        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;

        if (cell.type === 'water') {
          // Rippling water logic
          const isRipple = (state.gameTime + c * 30 + r * 15) % 80 < 40;
          ctx.fillStyle = isRipple ? '#1D4ED8' : '#1E40AF';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

          // Add little animated foam details
          if (isRipple) {
            ctx.fillStyle = '#60A5FA';
            ctx.fillRect(x + 4, y + 6, 2, 2);
            ctx.fillRect(x + 12, y + 14, 2, 2);
          }
        } else {
          // Grass plains
          ctx.fillStyle = '#166534'; // Grass base
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

          // Simple decorative moss weeds
          if ((c + r * 7) % 11 === 0) {
            ctx.fillStyle = '#15803d';
            ctx.fillRect(x + 6, y + 8, 2, 2);
          }
        }
      }
    }

    // --- 2. DRAW NATURAL SENSORS AND PLACED BLOCKS ---
    for (let r = 0; r < 25; r++) {
      for (let c = 0; c < 40; c++) {
        const cell = state.mapGrid[r * 40 + c];
        if (!cell || cell.type === 'grass' || cell.type === 'water') continue;

        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;

        // Render matching sprites
        let targetSprite: SpriteName = 'tree';

        if (cell.type === 'tree') {
          targetSprite = 'tree';
          // Draw Tree (double size height, offset slightly)
          drawPixelSprite(ctx, targetSprite, x - 4, y - TILE_SIZE, TILE_SIZE + 8, true, false);
          continue;
        } else if (cell.type === 'rock') {
          targetSprite = 'rock';
        } else if (cell.type === 'wood_wall') {
          targetSprite = 'wood_wall';
        } else if (cell.type === 'stone_wall') {
          targetSprite = 'stone_wall';
        } else if (cell.type === 'door_closed') {
          targetSprite = 'door_closed';
        } else if (cell.type === 'door_open') {
          targetSprite = 'door_open';
        } else if (cell.type === 'bed') {
          targetSprite = 'bed';
        } else if (cell.type === 'campfire') {
          // Animate flame sparking
          const frame = state.gameTime % 20 < 10 ? 'campfire_1' : 'campfire_2';
          drawPixelSprite(ctx, frame, x, y, TILE_SIZE, true, false);
          continue;
        }

        drawPixelSprite(ctx, targetSprite, x, y, TILE_SIZE, true, false);
      }
    }

    // Draw fishing bobber if casted
    if (fishingState !== 'idle' && fishingTargetTile) {
      const bX = fishingTargetTile.col * TILE_SIZE + 10;
      const bY = fishingTargetTile.row * TILE_SIZE + 10;
      
      // Line from player
      ctx.beginPath();
      ctx.moveTo(hero.x + hero.width/2, hero.y + 10);
      ctx.lineTo(bX, bY);
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ripple around bait
      ctx.beginPath();
      ctx.arc(bX, bY, 4 + (state.gameTime % 20) / 4, 0, Math.PI * 2);
      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bobber float
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(bX, bY, 3, 0, Math.PI * 2);
      ctx.fill();

      if (fishingState === 'bite') {
        // Floating exclamation above bobber
        ctx.fillStyle = '#FB923C';
        ctx.font = 'black 14px monospace';
        ctx.fillText("❗ REEL", bX - 18, bY - 14);
      }
    }

    // --- 3. DRAW GROUND DROPPED ITEMS ---
    state.droppedItems.forEach((item) => {
      let spriteName: SpriteName = 'coin';
      if (item.type === 'wood') spriteName = 'wood_item';
      else if (item.type === 'stone') spriteName = 'stone_item';
      else if (item.type === 'meat') spriteName = 'meat_item';
      else if (item.type === 'fish') spriteName = 'fish_item';
      else if (item.type === 'potion') spriteName = 'potion';

      // Floating amplitude animation
      const ampY = Math.sin(state.gameTime / 10 + item.x) * 3;
      drawPixelSprite(ctx, spriteName, item.x - 8, item.y - 8 + ampY, 16, true, false);
    });

    // --- 4. DRAW ENEMIES (Animals & Monsters) ---
    state.enemies.forEach((e) => {
      let frame: SpriteName = 'slime_blue_1';
      const bounce = state.gameTime % 30 < 15;

      if (e.type === 'chicken') {
        frame = bounce ? 'chicken_1' : 'chicken_2';
      } else if (e.type === 'deer') {
        frame = bounce ? 'deer_1' : 'deer_2';
      } else if (e.type === 'boar') {
        frame = bounce ? 'boar_1' : 'boar_2';
      } else if (e.type === 'slime_blue') {
        frame = bounce ? 'slime_blue_1' : 'slime_blue_2';
      } else if (e.type === 'slime_red') {
        frame = bounce ? 'slime_red_1' : 'slime_red_2';
      } else if (e.type === 'bat') {
        frame = (state.gameTime % 16 < 8) ? 'bat_1' : 'bat_2';
      } else if (e.type === 'skeleton') {
        frame = bounce ? 'skeleton_1' : 'skeleton_2';
      }

      drawPixelSprite(ctx, frame, e.x, e.y, Math.max(e.width, e.height), e.facingRight, e.flashTimer > 0);

      // HP indicator beneath wild aggressive types if hurt
      if (e.hp < e.maxHp && (e.type === 'boar' || !['chicken', 'deer'].includes(e.type))) {
        ctx.fillStyle = '#111827';
        ctx.fillRect(e.x + (e.width - 20)/2, e.y - 6, 20, 3);
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(e.x + (e.width - 20)/2, e.y - 6, 20 * (e.hp / e.maxHp), 3);
      }
    });

    // --- 5. DRAW HERO (PLAYER WITH CUSTOM OUTPALETTES) ---
    let frame: SpriteName = 'knight_idle';
    const hasVelocity = state.keys['w'] || state.keys['a'] || state.keys['s'] || state.keys['d'] ||
                        state.keys['arrowup'] || state.keys['arrowdown'] || state.keys['arrowleft'] || state.keys['arrowright'];
                        
    const altTicker = state.gameTime % 20 < 10;

    if (hero.id === 'knight') {
      frame = hasVelocity ? (altTicker ? 'knight_idle' : 'knight_walk') : 'knight_idle';
    } else if (hero.id === 'mage') {
      frame = hasVelocity ? (altTicker ? 'mage_idle' : 'mage_walk') : 'mage_idle';
    } else {
      frame = hasVelocity ? (altTicker ? 'rogue_idle' : 'rogue_walk') : 'rogue_idle';
    }

    // Set custom recolored outfit override parameter
    drawPixelSprite(ctx, frame, hero.x, hero.y, 32, hero.facingRight, state.flashTimer > 0, currentOutfit);

    // --- 6. DRAW SECTOR PROJECTILES ---
    state.projectiles.forEach((p) => {
      let subSp: SpriteName = 'fireball';
      if (p.type === 'sword_slash') subSp = 'sword_slash';
      else if (p.type === 'dagger') subSp = 'dagger';

      drawPixelSprite(ctx, subSp, p.x - p.radius, p.y - p.radius, p.radius * 2, p.vx >= 0, false);
    });

    // --- 7. DRAW PARTICLES ---
    state.particles.forEach((p) => {
      if (p.type === 'text' && p.textValue) {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillStyle = p.color;
        ctx.font = 'bold 11px monospace';
        ctx.fillText(p.textValue, p.x - 15, p.y);
        ctx.restore();
      } else {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
      }
    });

    // --- 8. BUILD MODE GRID OVERLAY PREVIEW ---
    if (isBuildMode) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;

      // Draw gridlines
      for (let c = 0; c <= CANVAS_WIDTH; c += TILE_SIZE) {
        ctx.beginPath();
        ctx.lineTo(c, 0);
        ctx.lineTo(c, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let r = 0; r <= CANVAS_HEIGHT; r += TILE_SIZE) {
        ctx.beginPath();
        ctx.lineTo(0, r);
        ctx.lineTo(CANVAS_WIDTH, r);
        ctx.stroke();
      }

      // Draw cursor cell glowing box if adjacent is close
      const mouseCol = Math.floor(state.mouse.x / TILE_SIZE);
      const mouseRow = Math.floor(state.mouse.y / TILE_SIZE);

      if (mouseCol >= 0 && mouseCol < 40 && mouseRow >= 0 && mouseRow < 25) {
        const destCenterX = mouseCol * TILE_SIZE + 10;
        const destCenterY = mouseRow * TILE_SIZE + 10;
        const dist = Math.hypot(hero.x + 12 - destCenterX, hero.y + 14 - destCenterY);

        ctx.lineWidth = 2;
        if (dist < 120) {
          ctx.strokeStyle = '#10B981'; // Green valid place
          ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        } else {
          ctx.strokeStyle = '#EF4444'; // Red out of range
          ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        }
        ctx.fillRect(mouseCol * TILE_SIZE, mouseRow * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.strokeRect(mouseCol * TILE_SIZE, mouseRow * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
      ctx.restore();
    }

    // --- 9. DUSK / NIGHT PORTABLE LIGHTING SHADOWING EFFECT ---
    if (ambientLight > 0) {
      ctx.save();
      // Draw dark overlay covering screen
      ctx.fillStyle = `rgba(11, 11, 35, ${ambientLight})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // XOR/cutout light circle around hero
      ctx.globalCompositeOperation = 'destination-out';
      
      // Hero lantern light circle glow
      const hCX = hero.x + hero.width/2;
      const hCY = hero.y + hero.height/2;
      
      const pLightGrad = ctx.createRadialGradient(hCX, hCY, 10, hCX, hCY, 90);
      pLightGrad.addColorStop(0, 'rgba(0,0,0,1)');
      pLightGrad.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = pLightGrad;
      ctx.beginPath();
      ctx.arc(hCX, hCY, 90, 0, Math.PI * 2);
      ctx.fill();

      // Placed campfire custom glowing lights cutout
      state.mapGrid.forEach(cell => {
        if (cell.type === 'campfire') {
          const cX = cell.col * TILE_SIZE + 10;
          const cY = cell.row * TILE_SIZE + 10;

          const fLightGrad = ctx.createRadialGradient(cX, cY, 12, cX, cY, 110);
          fLightGrad.addColorStop(0, 'rgba(0,0,0,1)');
          fLightGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = fLightGrad;
          ctx.beginPath();
          ctx.arc(cX, cY, 110, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.restore();

      // 10. Warm color glow for campfires (Amber overlay)
      state.mapGrid.forEach(cell => {
        if (cell.type === 'campfire') {
          const cX = cell.col * TILE_SIZE + 10;
          const cY = cell.row * TILE_SIZE + 10;

          ctx.save();
          ctx.globalAlpha = ambientLight * 0.45;
          const aG = ctx.createRadialGradient(cX, cY, 5, cX, cY, 50);
          aG.addColorStop(0, 'rgba(245, 158, 11, 1)'); // golden glow
          aG.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = aG;
          ctx.beginPath();
          ctx.arc(cX, cY, 50, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Spawn random little cozy embers rising from campfires
          if (Math.random() < 0.12) {
            state.particles.push({
              id: Math.random().toString(),
              x: cX + (Math.random() * 12 - 6),
              y: cY - 2,
              vx: Math.random() * 0.8 - 0.4,
              vy: -(Math.random() * 1.5 + 0.5),
              color: Math.random() < 0.4 ? '#EF4444' : '#F59E0B',
              size: Math.random() * 2 + 1,
              life: 1.0,
              maxLife: 20 + Math.random() * 15,
              type: 'spark'
            });
          }
        }
      });
    }

    // --- 11. HIT RED DAMAGE VIGNETTE FLASH ---
    if (state.flashTimer > 0) {
      ctx.fillStyle = `rgba(220, 38, 38, ${state.flashTimer * 0.035})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  };

  // Tracking mouse over canvas coordinates
  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    // Convert to model terms
    stateRef.current.mouse.x = (relativeX / rect.width) * CANVAS_WIDTH;
    stateRef.current.mouse.y = (relativeY / rect.height) * CANVAS_HEIGHT;
  };

  return (
    <div className="flex flex-col items-center bg-[#15191E] w-full rounded-none border-4 border-black p-4 relative overflow-hidden text-[#e0e0e0] font-mono select-none shadow-[10px_10px_0_0_#000]">
      
      {/* FULL SCREEN BANNER MESSAGE (Morning notification, etc) */}
      {survivalBanner && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#B45309] text-white border-4 border-black px-8 py-3.5 font-mono font-black text-sm tracking-widest uppercase text-center shadow-[4px_4px_0_0_#000] animate-pulse z-40">
          {survivalBanner}
        </div>
      )}

      {/* SLEEPING BLACKOUT CANVAS OVERLAY OVERVIEW */}
      {isSleeping && (
        <div className="absolute inset-0 bg-[#0B0B16] flex flex-col items-center justify-center z-30 transition-opacity">
          <div className="text-center space-y-4">
            <span className="text-5xl animate-bounce block">💤</span>
            <h3 className="text-xl font-black text-yellow-400 tracking-widest uppercase">HERO SEDANG TIDUR NYENYAK...</h3>
            <p className="text-xs text-slate-400 font-mono">Kemah aman. Memulihkan Darah, Kelaparan, dan Tenaga...</p>
            
            <div className="w-64 bg-black h-4 border-2 border-white mx-auto overflow-hidden p-0.5">
              <div className="bg-[#10B981] h-full animate-pulse transition-all duration-300" style={{ width: `${Math.min(100, (stateRef.current.gameTime % 4320) / 43.2)}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER SUB-MENU AND CONTROLLER */}
      <div className="w-full flex flex-col xl:flex-row gap-3 justify-between items-center bg-[#1E252D] border-4 border-black px-4 py-3 mb-4 shadow-[4px_4px_0_0_#000]">
        
        {/* Day/Time clock strip */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black border-2 border-black rounded">
            {isNightMode ? <Moon className="w-4 h-4 text-indigo-400 animate-pulse" /> : <Sun className="w-4 h-4 text-yellow-400 animate-spin-slow" />}
            <span className="text-xs font-bold text-white uppercase shrink-0">SUNYI HARI {gameDay}</span>
          </div>

          <div className="px-3 py-1.5 bg-black border-2 border-black text-[#00fff5] font-black text-sm rounded">
            ⏰ {String(gameHour).padStart(2, '0')}:{String(gameMinute).padStart(2, '0')}
            <span className="text-[9px] text-[#00d2ff] uppercase ml-1.5">{isNightMode ? 'Malam 🌌' : 'Siang ☀️'}</span>
          </div>
        </div>

        {/* CUSTOM COSTUME SELECTOR PANEL */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase mr-1 flex items-center gap-1">
            <ArrowRightLeft className="w-3.5 h-3.5 text-vibrant-cyan" /> GANTI COSTUME:
          </span>
          {[
            { id: 'outfit_red', name: 'Adventurer 🔴' },
            { id: 'outfit_blue', name: 'Casual 🔵' },
            { id: 'outfit_black', name: 'Ninja ⚫' },
            { id: 'outfit_purple', name: 'Wizard 🔮' },
            { id: 'outfit_silver', name: 'Plate 🪙' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                sfx.playHeal();
                setCurrentOutfit(opt.id);
              }}
              className={`px-2 py-1.5 text-[9px] font-bold uppercase transition rounded border-2 cursor-pointer select-none active:translate-y-0.5 ${
                currentOutfit === opt.id 
                  ? 'bg-[#10B981] border-[#10B981] text-black font-black shadow-none' 
                  : 'bg-black/40 hover:bg-[#252f3d] border-black text-slate-305 shadow-[2px_2px_0_0_#000]'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>

        {/* SFX settings */}
        <div className="flex gap-2">
          <button 
            onClick={toggleMute}
            className="p-2.5 bg-[#0f172a] hover:bg-[#1e293b] border-2 border-black text-white select-none transition shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer rounded"
            title="Suara"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="p-2.5 bg-[#0f172a] hover:bg-[#1e293b] border-2 border-black text-white select-none transition shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer rounded"
            title="Pause"
          >
            {isPaused ? <Play className="w-4 h-4 text-yellow-400 animate-pulse" /> : <Pause className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>

      {/* CORE SANDBOX LAYOUT GRID (Left: canvas, Right: survival action sidebar) */}
      <div className="w-full flex flex-col lg:flex-row gap-5 items-stretch">
        
        {/* LEFT COLUMN: CANVAS PANEL */}
        <div className="flex-1 flex flex-col items-center">
          <div 
            className="relative w-full border-4 border-black overflow-hidden cursor-crosshair shadow-[6px_6px_0_0_#000] bg-emerald-950"
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
          >
            <canvas 
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="w-full block"
              style={{ imageRendering: 'pixelated' }}
            />

            {/* PAUSE POPUP SCREEN COVER */}
            {isPaused && (
              <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-20">
                <Pause className="w-16 h-16 text-cyan-400 animate-pulse mb-2" />
                <h3 className="text-xl font-black text-white tracking-widest uppercase">PETUALANGAN DIHENTIKAN</h3>
                <p className="text-xs text-slate-400 mt-1 mb-5 font-mono">Tekan tombol resume atau tombol pause untuk melanjutkan bermain</p>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-5 py-2 bg-[#10B981] hover:bg-[#059669] text-black border-4 border-black font-black font-mono transition shadow-[3px_3px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs cursor-pointer"
                >
                  RESUME ADVENTURE
                </button>
              </div>
            )}
          </div>

          {/* LOWER HELP BUTTON MANUALS */}
          <div className="w-full mt-3 flex flex-wrap gap-2 justify-between text-[11px] bg-black/60 p-2.5 border-2 border-black rounded">
            <span className="flex items-center gap-1.5 text-amber-400"><Compass className="w-3.5 h-3.5" /> DEKAT DENGAN AIR: Cast pancingan dengan tombol <b>F</b> atau tombol Mancing di kanan!</span>
            <span className="flex items-center gap-1.5 text-cyan-300"><b>Pintu Otomatis:</b> Berjalanlah menembus pintu untuk membukanya!</span>
          </div>
        </div>

        {/* RIGHT COLUMN: SURVIVAL STATS & INVENTORIES & ACTIONS SIDEBAR */}
        <div className="w-full lg:w-72 bg-[#1C232B] border-4 border-black p-4 flex flex-col justify-between shadow-[6px_6px_0_0_#000]">
          
          <div className="space-y-4">
            
            {/* 1. SURVIVAL PROGRESS BARS BAR STATS */}
            <div className="bg-black/50 p-3 border-2 border-black space-y-3">
              <h4 className="text-[11px] font-black text-red-400 uppercase tracking-wider border-b border-black pb-1">📊 SURVIVAL BAR INDIKATOR:</h4>
              
              {/* HP Bar */}
              <div>
                <div className="flex justify-between text-[10px] items-center text-rose-500 font-bold mb-0.5">
                  <span className="flex items-center gap-1">❤️ DARAH (HP)</span>
                  <span>{heroHp} / {heroMaxHp}</span>
                </div>
                <div className="w-full bg-[#111] h-3 border-2 border-black rounded overflow-hidden">
                  <div 
                    className="bg-rose-600 h-full transition-all duration-100" 
                    style={{ width: `${Math.max(0, (heroHp / heroMaxHp) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Hunger Bar */}
              <div>
                <div className="flex justify-between text-[10px] items-center text-amber-500 font-bold mb-0.5">
                  <span className="flex items-center gap-1 flex-row">🍖 MAKANAN (LAPAR)</span>
                  <span>{hunger} / 100</span>
                </div>
                <div className="w-full bg-[#111] h-3 border-2 border-black rounded overflow-hidden">
                  <div 
                    className="bg-amber-600 h-full transition-all duration-100" 
                    style={{ width: `${hunger}%` }}
                  ></div>
                </div>
              </div>

              {/* Energy Bar */}
              <div>
                <div className="flex justify-between text-[10px] items-center text-cyan-400 font-bold mb-0.5">
                  <span className="flex items-center gap-1">⚡ TENAGA (ENERGI)</span>
                  <span>{energy} / 100</span>
                </div>
                <div className="w-full bg-[#111] h-3 border-2 border-black rounded overflow-hidden">
                  <div 
                    className="bg-cyan-500 h-full transition-all duration-100" 
                    style={{ width: `${energy}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 2. INVENTORY ITEMS */}
            <div className="bg-black/50 p-3 border-2 border-black">
              <h4 className="text-[11px] font-black text-amber-400 uppercase tracking-wider border-b border-black pb-1.5 mb-2.5">🎒 TAS INVENTORI:</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Wood log */}
                <div className="flex items-center justify-between p-1.5 bg-[#252F3D] border-2 border-black">
                  <span>🪵 Kayu</span>
                  <span className="font-extrabold text-[#FB923C]">{woodCount}</span>
                </div>
                {/* Stone */}
                <div className="flex items-center justify-between p-1.5 bg-[#252F3D] border-2 border-black">
                  <span>🪨 Batu</span>
                  <span className="font-extrabold text-slate-350">{stoneCount}</span>
                </div>

                {/* Fresh Meat with Eat function Button */}
                <div className="col-span-2 flex items-center justify-between p-1 bg-[#252F3D] border-2 border-black">
                  <div className="flex items-center gap-1 pl-1 text-[11px]">
                    <span>Meat:</span>
                    <span className="font-bold text-red-400">🥩 {meatCount}</span>
                  </div>
                  <button
                    onClick={() => handleEatFood('meat')}
                    disabled={meatCount <= 0}
                    className="px-2.5 py-1 text-[9px] bg-[#dc2626] hover:bg-red-500 active:translate-y-0.5 disabled:opacity-50 text-white rounded border border-black cursor-pointer select-none"
                  >
                    Makan
                  </button>
                </div>

                {/* Fresh fish cooked eating btn */}
                <div className="col-span-2 flex items-center justify-between p-1 bg-[#252F3D] border-2 border-black">
                  <div className="flex items-center gap-1 pl-1 text-[11px]">
                    <span>Fish:</span>
                    <span className="font-bold text-cyan-400">🐟 {fishCount}</span>
                  </div>
                  <button
                    onClick={() => handleEatFood('fish')}
                    disabled={fishCount <= 0}
                    className="px-2.5 py-1 text-[9px] bg-cyan-600 hover:bg-cyan-500 active:translate-y-0.5 disabled:opacity-50 text-white rounded border border-black cursor-pointer select-none"
                  >
                    Makan
                  </button>
                </div>
              </div>
            </div>

            {/* 3. MINECRAFT BLOCK PLACING CRAFT MANUAL */}
            <div className="bg-black/50 p-3 border-2 border-black">
              <div className="flex justify-between items-center border-b border-black pb-1.5 mb-2.5">
                <span className="text-[11px] font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                  <Hammer className="w-3.5 h-3.5" /> MEMBANGUN BLOK:
                </span>
                
                <button
                  onClick={() => {
                    sfx.playHeal();
                    setIsBuildMode(!isBuildMode);
                  }}
                  className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                     isBuildMode ? 'bg-[#10B981] text-black' : 'bg-rose-700 text-white'
                  }`}
                >
                  {isBuildMode ? 'AKTIFF 🛠️' : 'OFF'}
                </button>
              </div>

              {isBuildMode ? (
                <div className="space-y-2">
                  <p className="text-[9px] text-[#A7F3D0] leading-tight mb-2 font-bold">🛠️ Klik sel grid di dekat pahlawan untuk membangun blok!</p>
                  
                  <div className="space-y-1.5">
                    {[
                      { id: 'wood_wall', name: 'Dinding Kayu 🪵', cost: '3 Kayu' },
                      { id: 'stone_wall', name: 'Dinding Batu 🪨', cost: '3 Batu' },
                      { id: 'door', name: 'Pintu Rumah 🚪', cost: '4 Kayu' },
                      { id: 'campfire', name: 'Api Unggun 🔥', cost: '3 Kayu' },
                      { id: 'bed', name: 'Tempat Tidur 🛌', cost: '6 Kayu, 2 Batu' }
                    ].map(block => (
                      <button
                        key={block.id}
                        onClick={() => {
                          sfx.playHeal();
                          setSelectedBuildType(block.id as any);
                        }}
                        className={`w-full text-left p-1 text-[10px] border rounded flex justify-between select-none active:translate-y-0.5 ${
                          selectedBuildType === block.id 
                            ? 'bg-[#15803D] border-[#10B981] text-white font-extrabold'
                            : 'bg-black/35 border-black text-slate-350 hover:bg-[#333]'
                        }`}
                      >
                        <span>{block.name}</span>
                        <span className="text-[8px] font-bold text-amber-500 uppercase">{block.cost}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 text-slate-400 space-y-1">
                  <p className="text-[9px] leading-relaxed">Penyortir blok dinonaktifkan.</p>
                  <button 
                    onClick={() => {
                      sfx.playHeal();
                      setIsBuildMode(true);
                    }}
                    className="px-3 py-1 text-[9px] bg-sky-700 text-white border-2 border-black rounded font-bold hover:bg-sky-600 active:translate-y-0.5 cursor-pointer"
                  >
                    KTIFKAN MODE BANGUN 🔨
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* 4. LOWER ACTION COMMAND BUTTONS BLOCK */}
          <div className="mt-4 pt-3 border-t-2 border-black space-y-2.5">
            {/* MANCING QUICK ACTION BUTTON */}
            <button
              onClick={triggerFishingAction}
              className={`w-full py-2.5 font-bold uppercase rounded border-4 border-black font-mono transition text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                fishingState === 'bite' 
                  ? 'bg-orange-500 text-black font-black animate-pulse'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              🎣 {fishingState === 'idle' ? 'LUNCURKAN PANCING' : fishingState === 'bite' ? 'TARIK SEKARANG (REEL!)' : 'MENUNGGU GIGITAN...'}
            </button>

            {/* TIDUR / SKIP malam */}
            <button
              onClick={triggerSleepAction}
              className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white font-bold uppercase rounded border-4 border-black font-mono transition text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              🛌 TIDUR MASUK PAGI (Skip Malam)
            </button>

            {/* EXIT SANDBOX */}
            <button
              onClick={onExit}
              className="w-full py-1.5 bg-[#4B5563] hover:bg-[#374151] text-white font-mono text-[10px] tracking-widest uppercase transition rounded border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer"
            >
              KELUAR PETUALANGAN
            </button>
          </div>

        </div>

      </div>

      {/* FOOTER TUTORIAL */}
      <div className="w-full mt-4 bg-black/60 p-4 border-4 border-black shadow-[4px_4px_0_0_#000] text-xs leading-relaxed space-y-2">
        <h4 className="text-amber-400 font-extrabold uppercase flex items-center gap-1"><HelpCircle className="w-4 h-4" /> BAGAIMANA CARA BERTAHAN HIDUP & MEMBANGUN?</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-350">
          <div>
            <b className="text-white">🪵 Berburu & Tebang Pohon:</b> Dekati Pohon atau Batu dan tekan <b>SPASI / Q</b> untuk mendapat bahan mentah. Cari hewan (Boar/Deer/Ayam) untuk diburu!
          </div>
          <div>
            <b className="text-white">🧱 Membangun Rumah (Minecraft):</b> Aktifkan <b>MODE BANGUN</b> di kanan, pilih blok seperti Dinding Kayu/Pintu/Kasur/Api Unggun, lalu klik bidang hijau di sekitar pahlawan.
          </div>
          <div>
            <b className="text-white">💤 Menghindari Malam Buruk:</b> Malam hari dipenuhi kegelapan & monster berbahaya. Bangunlah Kasur (Bed) di dalam rumah beratap Anda, berdiri di dekatnya dan tekan tombol <b>TIDUR</b>.
          </div>
        </div>
      </div>

    </div>
  );
}
