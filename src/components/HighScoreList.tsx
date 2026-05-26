import React, { useState, useEffect } from 'react';
import { HighScore, HeroClass } from '../types';
import { Trophy, RefreshCw, Trash2, Calendar, Award } from 'lucide-react';

interface HighScoreListProps {
  onBack: () => void;
}

const DEFAULT_SCORES: HighScore[] = [
  { name: 'AXEL_KNIGHT', heroClass: 'knight', score: 12500, wave: 5, date: '2026-05-12' },
  { name: 'CELIA_MAGE', heroClass: 'mage', score: 9800, wave: 4, date: '2026-05-18' },
  { name: 'SLY_ROGUE', heroClass: 'rogue', score: 8100, wave: 3, date: '2026-05-22' },
  { name: 'PIXEL_CHAMP', heroClass: 'knight', score: 5500, wave: 2, date: '2026-05-24' }
];

export default function HighScoreList({ onBack }: HighScoreListProps) {
  const [scores, setScores] = useState<HighScore[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('pixel_dungeon_scores');
    if (stored) {
      try {
        setScores(JSON.parse(stored));
      } catch {
        setScores(DEFAULT_SCORES);
      }
    } else {
      localStorage.setItem('pixel_dungeon_scores', JSON.stringify(DEFAULT_SCORES));
      setScores(DEFAULT_SCORES);
    }
  }, []);

  const handleClear = () => {
    if (window.confirm('Hapus semua skor tertinggi?')) {
      localStorage.setItem('pixel_dungeon_scores', JSON.stringify([]));
      setScores([]);
    }
  };

  const getHeroClassLabel = (id: HeroClass) => {
    switch (id) {
      case 'knight': return { label: '⚔️ Knight', color: 'text-vibrant-blue bg-[#0f3460] border border-black font-mono font-bold' };
      case 'mage': return { label: '🔮 Mage', color: 'text-vibrant-cyan bg-vibrant-panel border border-black font-mono font-bold' };
      case 'rogue': return { label: '🗡️ Rogue', color: 'text-vibrant-green bg-black border border-black font-mono font-bold' };
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-vibrant-panel border-4 border-black p-6 shadow-[6px_6px_0_0_#000] relative overflow-hidden font-mono rounded-none">
      {/* Retro scanlines effect background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(26,26,46,0)_95%,rgba(0,0,0,0.35)_95%)] bg-[length:100%_4px] pointer-events-none opacity-40"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-vibrant-cyan animate-bounce" />
            <h2 className="text-2xl font-black text-vibrant-cyan tracking-wider font-mono">
              SKOR TERTINGGI (HALL OF FAME)
            </h2>
          </div>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-3 py-1.5 bg-vibrant-red hover:bg-[#ff2e63] text-white border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none select-none transition-all duration-150 text-xs font-bold"
            title="Reset Leaderboard"
          >
            <Trash2 className="w-3.5 h-3.5" />
            RESET
          </button>
        </div>

        {scores.length === 0 ? (
          <div className="text-center py-12 border-4 border-black bg-black mb-6">
            <Award className="w-12 h-12 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400 text-sm font-mono">Belum ada skor tercatat. Mulai bermain dan jadilah yang pertama!</p>
          </div>
        ) : (
          <div className="space-y-4 mb-8 max-h-[360px] overflow-y-auto pr-1">
            {scores
              .sort((a, b) => b.score - a.score)
              .map((item, index) => {
                const badgeInfo = getHeroClassLabel(item.heroClass);
                const isTopThree = index < 3;
                
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 border-2 border-black font-mono transition-transform hover:translate-x-1 ${
                      index === 0
                        ? 'bg-black text-yellow-400 shadow-[4px_4px_0_0_#ffd700]'
                        : index === 1
                        ? 'bg-black text-vibrant-cyan shadow-[4px_4px_0_0_#00fff5]'
                        : index === 2
                        ? 'bg-black text-vibrant-green shadow-[4px_4px_0_0_#4ecca3]'
                        : 'bg-black text-slate-300 shadow-[3px_3px_0_0_#000]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Placement crown / circle */}
                      <span className={`w-8 h-8 flex items-center justify-center font-bold text-sm border-2 border-black ${
                        index === 0 
                          ? 'bg-yellow-400 text-black font-black' 
                          : index === 1 
                          ? 'bg-vibrant-cyan text-black font-black' 
                          : index === 2 
                          ? 'bg-vibrant-green text-black font-black' 
                          : 'bg-vibrant-border text-slate-300'
                      }`}>
                        #{index + 1}
                      </span>

                      <div>
                        <div className="font-bold flex items-center gap-2">
                          <span className={isTopThree ? 'text-lg font-black' : 'text-base'}>
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${badgeInfo?.color}`}>
                            {badgeInfo?.label}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-black tracking-tight ${
                        index === 0 ? 'text-xl text-yellow-400' : index === 1 ? 'text-lg text-vibrant-cyan' : 'text-lg text-white'
                      }`}>
                        {item.score.toLocaleString()} XP
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400">
                        WAVE {item.wave} COMPLETE
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        <div className="flex justify-center border-t-4 border-black pt-6">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-vibrant-blue hover:bg-[#3cdbff] text-[#1a1a2e] border-4 border-black font-black shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-sm tracking-wider select-none cursor-pointer"
          >
            KEMBALI KE MENU UTAMA
          </button>
        </div>
      </div>
    </div>
  );
}
