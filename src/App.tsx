import React, { useState, useEffect, useRef } from 'react';
import { HeroClass, HighScore } from './types';
import PixelHeroSelector from './components/PixelHeroSelector';
import PixelGameCanvas from './components/PixelGameCanvas';
import HighScoreList from './components/HighScoreList';
import { drawPixelSprite } from './utils/sprites';
import { sfx } from './utils/sound';
import { 
  Trophy, Flame, Swords, Heart, Shield, Music, 
  Volume2, VolumeX, BookOpen, User, Play, RefreshCw, LogOut, Info, Sparkles, Home 
} from 'lucide-react';

type ScreenType = 'welcome' | 'hero_select' | 'gameplay' | 'high_scores' | 'game_over';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [selectedHero, setSelectedHero] = useState<HeroClass>('knight');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Statistics for gameplay ending
  const [lastScore, setLastScore] = useState<number>(0);
  const [lastWave, setLastWave] = useState<number>(1);
  const [playerName, setPlayerName] = useState<string>('');
  const [scoreRegistered, setScoreRegistered] = useState<boolean>(false);

  useEffect(() => {
    // Check initial mute status
    setIsMuted(sfx.getMuteStatus());
    // Auto start menu track
    sfx.startMusic();
    return () => {
      sfx.stopMusic();
    };
  }, []);

  const handleToggleMute = () => {
    const newVal = sfx.toggleMute();
    setIsMuted(newVal);
  };

  const startHeroSelection = () => {
    sfx.playLevelUp();
    setScreen('hero_select');
  };

  const handleHeroChosen = (heroClass: HeroClass) => {
    setSelectedHero(heroClass);
    setScreen('gameplay');
  };

  const handleGameOver = (finalScore: number, waveReached: number) => {
    setLastScore(finalScore);
    setLastWave(waveReached);
    setPlayerName(`HERO_${Math.floor(100 + Math.random() * 899)}`);
    setScoreRegistered(false);
    setScreen('game_over');
    sfx.playGameOver();
  };

  const handleRegisterScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    try {
      const cleanedName = playerName.trim().toUpperCase().slice(0, 12);
      const stored = localStorage.getItem('pixel_dungeon_scores');
      let currentScores: HighScore[] = [];
      
      if (stored) {
        currentScores = JSON.parse(stored);
      }

      const newScore: HighScore = {
        name: cleanedName,
        heroClass: selectedHero,
        score: lastScore,
        wave: lastWave,
        date: new Date().toISOString().split('T')[0]
      };

      // Add and sort descending
      currentScores.push(newScore);
      currentScores.sort((a, b) => b.score - a.score);
      
      // Save top 12
      localStorage.setItem('pixel_dungeon_scores', JSON.stringify(currentScores.slice(0, 12)));
      setScoreRegistered(true);
      sfx.playHeal();
    } catch (err) {
      console.error(err);
    }
  };

  // Medal indicator tag based on scores
  const getMedalFeedback = (scoreVal: number) => {
    if (scoreVal >= 10000) return { title: '🏆 NAGA SLAYER SUPREME', desc: 'Luar biasa! Kamu adalah legenda dungeoneering sejati.', color: 'text-yellow-400' };
    if (scoreVal >= 5000) return { title: '⚔️ GLADIATOR ELIT', desc: 'Hebat, seranganmu menebas ratusan monster!', color: 'text-purple-400' };
    if (scoreVal >= 2000) return { title: '🛡️ PETUALANG TANGGUH', desc: 'Bagus sekali! Terus tingkatkan kemampuan tempurmu.', color: 'text-sky-400' };
    return { title: '🪵 REKRUT AMATIR', desc: 'Terus berlatih! Dungeon menyimpan kekayaan melimpah.', color: 'text-slate-400' };
  };

  return (
    <div className="min-h-screen bg-vibrant-bg text-[#e0e0e0] flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-vibrant-cyan selection:text-vibrant-bg font-mono select-none">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(#00fff5 1px, transparent 1px)`, backgroundSize: `20px 20px` }}></div>

      {/* Decorative moving pixel backdrops */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(26,26,46,0)_95%,rgba(0,0,0,0.30)_95%)] bg-[length:100%_4px] pointer-events-none opacity-50 z-0"></div>

      <main className="w-full max-w-4xl relative z-10 my-auto flex flex-col items-center">
        
        {/* ==========================================
            WELCOME SCREEN (MAIN MENU)
            ========================================== */}
        {screen === 'welcome' && (
          <div className="w-full max-w-2xl bg-vibrant-panel border-4 border-black p-6 md:p-8 shadow-[6px_6px_0_0_#000] relative flex flex-col items-center overflow-hidden">
            
            {/* Visual Header strip */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-vibrant-red via-vibrant-cyan to-vibrant-green"></div>

            {/* Top Sound Toggle Mute */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleToggleMute}
                className="p-2.5 bg-vibrant-border hover:bg-vibrant-panel text-[#e0e0e0] border-2 border-black transition shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                title={isMuted ? "Hidupkan Suara" : "Matikan Suara"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-vibrant-red" /> : <Volume2 className="w-4 h-4 text-vibrant-green" />}
              </button>
            </div>

            {/* Glowing Retro Title */}
            <div className="text-center mt-4 mb-4 select-none">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-vibrant-border border-2 border-black rounded shadow-[2px_2px_0_0_#000] mb-2">
                <Flame className="w-3.5 h-3.5 text-vibrant-red animate-pulse" />
                <span className="text-[10px] text-vibrant-cyan font-bold font-mono tracking-widest uppercase">RETRO DUNGEON ARCADE</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-wider text-vibrant-cyan font-mono filter drop-shadow-[0_2px_8px_rgba(0,255,245,0.3)]">
                PIXEL DUNGEON
              </h1>
              <h2 className="text-sm md:text-base font-bold font-mono tracking-widest text-[#e94560] uppercase -mt-1.5 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                ⚔️ SLAYER ARENA ⚔️
              </h2>
            </div>

            {/* LIVE WALK CYCLE RETRO MINI DEMO ANIMATOR */}
            <div className="w-full h-24 bg-black border-4 border-black mb-6 relative overflow-hidden flex items-center justify-between shadow-inner">
              <div className="absolute inset-0 bg-stone-900/10 bg-[radial-gradient(ellipse_at_center,rgba(0,255,245,0.1),transparent)]"></div>
              <WelcomeAnimationChaser />
            </div>

            {/* Main Menu Button Navigation */}
            <div className="flex flex-col gap-4 w-full max-w-sm relative z-10">
              <button
                onClick={startHeroSelection}
                className="group relative flex items-center justify-center gap-3 w-full py-4 bg-vibrant-green hover:bg-[#60f7c2] text-[#1a1a2e] font-black font-mono tracking-widest border-4 border-black shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-base uppercase cursor-pointer"
              >
                <Play className="w-5 h-5 fill-[#1a1a2e] text-[#1a1a2e]" />
                MULAI PETUALANGAN
              </button>

              <button
                onClick={() => {
                  sfx.playLevelUp();
                  setScreen('high_scores');
                }}
                className="flex items-center justify-center gap-3 w-full py-3 bg-vibrant-blue hover:bg-[#3cdbff] text-[#1a1a2e] font-extrabold font-mono tracking-wider border-4 border-black shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-sm cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                LIHAT HALL OF FAME
              </button>

              <button
                onClick={() => {
                  sfx.playHeal();
                  setShowInfo(true);
                }}
                className="flex items-center justify-center gap-3 w-full py-2.5 bg-vibrant-border hover:bg-vibrant-panel text-[#e0e0e0] font-bold font-mono border-4 border-black shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-xs cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-vibrant-cyan" />
                PANDUAN BERMAIN
              </button>
            </div>

            {/* Footer Watermark */}
            <div className="mt-8 text-[10px] text-slate-400 font-mono tracking-wide flex items-center gap-1.5 border-t-2 border-black w-full pt-4 justify-center">
              <span>PRODUKSI RETRO GAME INDONESIA</span>
              <span>•</span>
              <span className="text-vibrant-cyan font-bold">VERSI 1.2.0</span>
            </div>

            {/* ABOUT PANDUAN INFO POPUP DIALOG WINDOW */}
            {showInfo && (
              <div className="absolute inset-0 bg-vibrant-bg/95 p-6 flex flex-col z-30 font-mono transition-opacity border-4 border-black m-2 shadow-[6px_6px_0_0_#000]">
                <div className="flex justify-between items-center border-b-4 border-black pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-vibrant-cyan" />
                    <h3 className="font-mono font-black text-white uppercase tracking-wider text-sm">PANDUAN PETUALANGAN</h3>
                  </div>
                  <button 
                    onClick={() => {
                      sfx.playAttack();
                      setShowInfo(false);
                    }}
                    className="px-3 py-1.5 bg-vibrant-red hover:bg-red-500 text-white border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none rounded font-bold text-xs"
                  >
                    TUTUP [X]
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 text-xs text-[#e0e0e0] leading-relaxed pr-1 pr-2">
                  <div className="p-3 bg-vibrant-panel border-2 border-black shadow-[2px_2px_0_0_#000]">
                    <strong className="text-white font-mono flex items-center gap-1.5 text-xs mb-1.5">
                      ⚔️ TUJUAN UTAMA:
                    </strong>
                    Bertahanlah menembus serangan makhluk slime gua sedalam mungkin! Kamu harus mengumpulkan koin emas dan bunuh slime untuk naik level, membuka skill-skill mutakhir, serta menaklukkan naga naga purba di wave puncak.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-2.5 bg-vibrant-panel border-2 border-black shadow-[2px_2px_0_0_#000]">
                      <h4 className="font-mono font-bold text-vibrant-blue text-[11px] mb-1">🛡️ GLADIATOR KNIGHT</h4>
                      Darah tinggi, tebasan pedangnya menciptakan tabrakan melingkar besar menghabisi gerombolan slime dalam sekejap.
                    </div>
                    <div className="p-2.5 bg-vibrant-panel border-2 border-black shadow-[2px_2px_0_0_#000]">
                      <h4 className="font-mono font-bold text-vibrant-cyan text-[11px] mb-1">🔮 CELESTIAL MAGE</h4>
                      Darinya membara bola api supercepat berkelana jauh yang meledak menghasilkan kerusakan area bakar berkelanjutan.
                    </div>
                    <div className="p-2.5 bg-vibrant-panel border-2 border-black shadow-[2px_2px_0_0_#000]">
                      <h4 className="font-mono font-bold text-vibrant-green text-[11px] mb-1">🗡️ SHADOW ROGUE</h4>
                      Bergerak cepat bagai bayangan, melempar daggers tembus sasaran dengan lincah berkelanjutan.
                    </div>
                  </div>

                  <div className="p-3 bg-vibrant-panel border-2 border-black shadow-[2px_2px_0_0_#000]">
                    <strong className="text-vibrant-cyan font-mono block mb-1">🌟 TIPS PRO:</strong>
                    - Ambil ramuan merah untuk penyembuhan instan.
                    - Upgrade magnet sangat berguna agar uang tersedot mendekat bergantian.
                    - Klik/sentuh tombol SPECIAL Q / SPACE saat terpojok demi mengaktifkan ultimate pahlawan!
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            HERO SELECTION SCREEN
            ========================================== */}
        {screen === 'hero_select' && (
          <PixelHeroSelector
            onSelect={handleHeroChosen}
            onBack={() => {
              sfx.playAttack();
              setScreen('welcome');
            }}
          />
        )}

        {/* ==========================================
            ACTIVE GAMEPLAY SCREEN
            ========================================== */}
        {screen === 'gameplay' && (
          <PixelGameCanvas
            selectedHeroClass={selectedHero}
            onGameOver={handleGameOver}
            onExit={() => {
              sfx.playAttack();
              sfx.stopMusic();
              sfx.startMusic();
              setScreen('welcome');
            }}
          />
        )}

        {/* ==========================================
            LEADERBOARD HALL OF FAME
            ========================================== */}
        {screen === 'high_scores' && (
          <HighScoreList
            onBack={() => {
              sfx.playAttack();
              setScreen('welcome');
            }}
          />
        )}

        {/* ==========================================
            GAME OVER SUMMARY SCOREBOARD SYSTEM
            ========================================== */}
        {screen === 'game_over' && (
          <div className="w-full max-w-xl bg-vibrant-panel border-4 border-black p-6 shadow-[6px_6px_0_0_#000] relative overflow-hidden flex flex-col items-center rounded-none">
            
            {/* Visual Header blood splash strip */}
            <div className="absolute top-0 inset-x-0 h-2 bg-vibrant-red"></div>

            <div className="animate-pulse mb-1 mt-3">
              <span className="text-xs text-vibrant-red font-bold tracking-widest uppercase font-mono">=== DIKALAHKAN MONSTER ===</span>
            </div>
            <h2 className="text-3xl font-black text-vibrant-red font-mono tracking-wider text-center select-none">
              PERTEMPURAN SELESAI
            </h2>

            <div className="my-5 w-full bg-black border-4 border-black p-4 md:p-6 text-center">
              <div className="text-[10px] text-slate-400 font-mono uppercase">HASIL PERJUANGAN JALUR DUNGEON</div>
              
              <div className="text-4xl font-mono font-black text-vibrant-cyan tracking-tight mt-1">
                {lastScore.toLocaleString()} pts
              </div>

              {/* Medal award custom title */}
              <div className="mt-4 border-t-2 border-vibrant-border pt-4 flex flex-col items-center">
                <span className={`text-base font-black font-mono uppercase ${getMedalFeedback(lastScore).color}`}>
                  {getMedalFeedback(lastScore).title}
                </span>
                <p className="text-[11px] text-slate-300 font-mono mt-0.5 max-w-sm">
                  {getMedalFeedback(lastScore).desc}
                </p>
              </div>

              {/* Breakdown stats list */}
              <div className="grid grid-cols-2 gap-3 mt-5 border-t-2 border-vibrant-border pt-4">
                <div className="p-2 bg-vibrant-panel border-2 border-black font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block">BERTAHAN WAVE</span>
                  <strong className="text-xl text-white">🛡️ {lastWave}</strong>
                </div>
                <div className="p-2 bg-vibrant-panel border-2 border-black font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block">HERO DILEPASKAN</span>
                  <strong className="text-sm font-black text-vibrant-cyan uppercase">
                    {selectedHero === 'knight' ? '⚔️ Knight' : selectedHero === 'mage' ? '🔮 Mage' : '🗡️ Rogue'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Score Registering form panel */}
            {!scoreRegistered ? (
              <form onSubmit={handleRegisterScore} className="w-full bg-black border-2 border-black p-4 mb-6 font-mono text-left">
                <label className="block text-xs font-bold text-vibrant-cyan uppercase tracking-wider mb-1.5">
                  ✍️ DAFTARKAN NAMA TERHEBATMU:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value.toUpperCase().slice(0, 12))}
                    className="flex-1 bg-vibrant-panel border-4 border-black focus:border-vibrant-cyan px-3 py-1.5 uppercase tracking-widest text-white focus:outline-none text-sm font-semibold"
                    placeholder="CONTOH: HERO_ONE"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-vibrant-green hover:bg-[#60f7c2] text-black font-bold text-xs border-4 border-black shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none select-none transition cursor-pointer"
                  >
                    SUBMIT
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-1.5">Gunakan keyboard maksimal 12 huruf demi kesopanan.</p>
              </form>
            ) : (
              <div className="w-full bg-[#1b4332] border-4 border-[#2d6a4f] p-4 text-center mb-6">
                <span className="text-vibrant-green font-bold block font-mono text-sm">✅ SKOR TERTINGGI TELAH TERSIMPAN!</span>
                <p className="text-[11px] text-slate-300 mt-0.5 font-mono">Nilaimu sudah dimasukkan ke papan Hall of Fame lokal.</p>
              </div>
            )}

            {/* Final menu navigations */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={() => {
                  sfx.playLevelUp();
                  setScreen('hero_select');
                }}
                className="flex-1 py-3 bg-vibrant-green hover:bg-[#60f7c2] text-black font-black font-mono tracking-wider border-4 border-black shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                MAIN SECARA BARU
              </button>

              <button
                onClick={() => {
                  sfx.playAttack();
                  sfx.startMusic();
                  setScreen('welcome');
                }}
                className="flex-1 py-3 bg-vibrant-border hover:bg-vibrant-panel text-white font-bold font-mono border-4 border-black shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 text-vibrant-cyan" />
                MENU UTAMA
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

// Visual menu animation of Knight chasing Blue Slime across screen
function WelcomeAnimationChaser() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let animId: number;
    
    // Position metrics
    let knightX = 60;
    let slimeX = 260;
    let batX = 420;
    let wizardX = 580;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;

      // Draw subtle guide ground tiles line
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 68, canvas.width, 4);

      // Simple physics running displacement loop
      knightX = (knightX + 1.2) % (canvas.width + 100);
      slimeX = (slimeX + 1.5) % (canvas.width + 100);
      batX = (batX + 2.0) % (canvas.width + 100);
      wizardX = (wizardX + 1.0) % (canvas.width + 100);

      const animToggle = Math.floor(frame / 12) % 2 === 0;

      // Draw characters
      drawPixelSprite(ctx, animToggle ? 'knight_idle' : 'knight_walk', knightX - 50, 20, 36, true, false);
      drawPixelSprite(ctx, animToggle ? 'slime_blue_1' : 'slime_blue_2', slimeX - 50, 34, 24, true, false);
      drawPixelSprite(ctx, animToggle ? 'bat_1' : 'bat_2', batX - 50, 16, 26, true, false);
      drawPixelSprite(ctx, animToggle ? 'mage_idle' : 'mage_walk', wizardX - 50, 18, 38, true, false);

      frame++;
      animId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} width={640} height={80} className="w-full h-full block" />;
}
