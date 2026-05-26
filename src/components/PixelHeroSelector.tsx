import React, { useEffect, useRef } from 'react';
import { HeroClass, HeroStats } from '../types';
import { HERO_TEMPLATES } from '../data';
import { drawPixelSprite, SpriteName } from '../utils/sprites';
import { sfx } from '../utils/sound';
import { Shield, Swords, Zap, Heart, Sparkles } from 'lucide-react';

interface PixelHeroSelectorProps {
  onSelect: (heroClass: HeroClass) => void;
  onBack: () => void;
}

export default function PixelHeroSelector({ onSelect, onBack }: PixelHeroSelectorProps) {
  
  // Audio cue callback helper
  const handleHeroHover = (id: HeroClass) => {
    // Play subtle class tone
    sfx.playAttack(id);
  };

  const getAttributeBars = (stats: HeroStats) => {
    // Relative scaling indicators
    const maxBarVal = 150;
    const hpPercent = (stats.maxHp / maxBarVal) * 100;
    const speedPercent = (stats.speed / 5.0) * 100;
    const dmgPercent = (stats.damage / 30) * 100;
    
    return (
      <div className="space-y-2 w-full font-mono mt-3 text-slate-300">
        {/* HP Attribute */}
        <div>
          <div className="flex justify-between text-[10px] uppercase font-bold mb-0.5">
            <span className="flex items-center gap-1 text-[#ff2e63]"><Heart className="w-3 h-3 text-[#ff2e63]" /> DARAH (HP)</span>
            <span className="text-[#ff2e63]">{stats.maxHp} HP</span>
          </div>
          <div className="w-full bg-black h-3 border-2 border-black overflow-hidden shadow-[inset_1px_1px_0_0_#000]">
            <div className="bg-[#ff2e63] h-full" style={{ width: `${hpPercent}%` }}></div>
          </div>
        </div>

        {/* Speed Attribute */}
        <div>
          <div className="flex justify-between text-[10px] uppercase font-bold mb-0.5">
            <span className="flex items-center gap-1 text-[#00d2ff]"><Zap className="w-3 h-3 text-[#00d2ff]" /> KELINCAHAN</span>
            <span className="text-[#00d2ff]">{(stats.speed * 10).toFixed(0)} SPEED</span>
          </div>
          <div className="w-full bg-black h-3 border-2 border-black overflow-hidden shadow-[inset_1px_1px_0_0_#000]">
            <div className="bg-[#00d2ff] h-full" style={{ width: `${speedPercent}%` }}></div>
          </div>
        </div>

        {/* Damage Attribute */}
        <div>
          <div className="flex justify-between text-[10px] uppercase font-bold mb-0.5">
            <span className="flex items-center gap-1 text-vibrant-cyan"><Swords className="w-3 h-3 text-vibrant-cyan" /> KEKUATAN SERANG</span>
            <span className="text-vibrant-cyan">{stats.damage} DMG</span>
          </div>
          <div className="w-full bg-black h-3 border-2 border-black overflow-hidden shadow-[inset_1px_1px_0_0_#000]">
            <div className="bg-[#00fff5] h-full" style={{ width: `${dmgPercent}%` }}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-vibrant-panel border-4 border-black p-6 shadow-[6px_6px_0_0_#000] relative overflow-hidden flex flex-col items-center rounded-none font-mono">
      {/* Visual background lines scan */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(26,26,46,0)_95%,rgba(0,0,0,0.30)_95%)] bg-[length:100%_4px] pointer-events-none opacity-40"></div>

      <div className="relative z-10 w-full text-center mb-6">
        <span className="text-vibrant-cyan text-xs font-bold tracking-widest font-mono uppercase">RETRO PIXEL SELECTION</span>
        <h2 className="text-3xl font-black text-white mt-1 tracking-wider font-mono uppercase flex items-center justify-center gap-2">
          ⚔️ PILIH HERO SENJATAMU
        </h2>
        <p className="text-slate-350 text-xs font-mono mt-1.5 max-w-md mx-auto">
          Masing-masing pahlawan memiliki atribut bawaan, jangkauan serang, dan kemampuan tempur khusus yang mematikan.
        </p>
      </div>

      {/* Hero Class selection Cards columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8 relative z-10">
        {Object.entries(HERO_TEMPLATES).map(([key, template]) => {
          const id = key as HeroClass;
          const config = HERO_TEMPLATES[id];
          
          let cardBorderClass = 'border-black hover:border-black';
          let hoverShadowClass = 'hover:shadow-[4px_4px_0_0_#00d2ff] hover:border-vibrant-blue';
          let glowDotColor = 'bg-slate-400';
          let badgeClass = 'bg-black border border-black text-[#e0e0e0]';
          
          if (id === 'knight') {
            hoverShadowClass = 'hover:shadow-[6px_6px_0_0_#00d2ff] hover:border-vibrant-blue';
            glowDotColor = 'bg-vibrant-blue';
            badgeClass = 'bg-[#0f3460] text-vibrant-blue border-2 border-black';
          } else if (id === 'mage') {
            hoverShadowClass = 'hover:shadow-[6px_6px_0_0_#00fff5] hover:border-vibrant-cyan';
            glowDotColor = 'bg-vibrant-cyan';
            badgeClass = 'bg-vibrant-panel text-vibrant-cyan border-2 border-black';
          } else if (id === 'rogue') {
            hoverShadowClass = 'hover:shadow-[6px_6px_0_0_#4ecca3] hover:border-vibrant-green';
            glowDotColor = 'bg-vibrant-green';
            badgeClass = 'bg-black text-vibrant-green border-2 border-black';
          }

          return (
            <div
              key={id}
              onClick={() => {
                sfx.playLevelUp();
                onSelect(id);
              }}
              onMouseEnter={() => handleHeroHover(id)}
              className={`bg-black p-5 border-4 flex flex-col items-center cursor-pointer transition-all duration-150 scale-[0.99] hover:scale-[1.01] shadow-[2px_2px_0_0_#000] ${cardBorderClass} ${hoverShadowClass}`}
            >
              <div className="flex justify-between items-center w-full">
                <span className={`px-2.5 py-0.5 text-[9px] font-bold tracking-wider font-mono uppercase ${badgeClass}`}>
                  HERO CLASS
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${glowDotColor} animate-pulse`}></span>
              </div>

              {/* Animated Pixel visual preview box */}
              <div className="my-5 w-24 h-24 bg-vibrant-bg border-4 border-black flex items-center justify-center shadow-inner group overflow-hidden relative">
                <HeroPreviewRenderer id={id} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
              </div>

              <h3 className="text-lg font-black text-white font-mono tracking-wide mt-1">
                {config.name}
              </h3>

              <p className="text-[11px] text-slate-350 mt-2 flex-1 text-center font-mono tracking-wide leading-relaxed px-1">
                {config.description}
              </p>

              {/* Stats ratings bars */}
              {getAttributeBars(config)}

              {/* Action Button confirmation */}
              <button className="w-full mt-5 py-2 bg-[#0f3460] hover:bg-[#16213e] text-white border-2 border-black text-xs font-bold font-mono tracking-widest transition-colors duration-150 uppercase shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5">
                PILIH HERO INI
              </button>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 border-t-4 border-black w-full pt-4 flex justify-center">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-[#e94560] hover:bg-[#ff2e63] text-white border-4 border-black font-black shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-sm tracking-wider select-none cursor-pointer"
        >
          KEMBALI KE MENU UTAMA
        </button>
      </div>
    </div>
  );
}

// Inner helper component to draw an animated canvas sprite preview
function HeroPreviewRenderer({ id }: { id: HeroClass }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Select idle vs walk frames based on oscillator
      const isAltFrame = Math.floor(frame / 15) % 2 === 0;
      let spriteName: SpriteName;
      
      if (id === 'knight') {
        spriteName = isAltFrame ? 'knight_idle' : 'knight_walk';
      } else if (id === 'mage') {
        spriteName = isAltFrame ? 'mage_idle' : 'mage_walk';
      } else {
        spriteName = isAltFrame ? 'rogue_idle' : 'rogue_walk';
      }

      ctx.imageSmoothingEnabled = false;
      // Draw centered in canvas
      drawPixelSprite(ctx, spriteName, 12, 12, 56, true, false);

      frame++;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [id]);

  return <canvas ref={canvasRef} width={80} height={80} className="w-full h-full block" />;
}
