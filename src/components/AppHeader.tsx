/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Compass, Sparkles, Send } from "lucide-react";

interface AppHeaderProps {
  onStartClick?: () => void;
  showStartBtn?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onStartClick,
  showStartBtn = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#155799]/95 to-[#159957]/95 backdrop-blur-md border-b border-white/10 text-white shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-display font-bold text-lg tracking-tight text-white">
                Travel Planner
              </span>
              <span className="font-display font-extrabold text-lg text-emerald-300">
                AI
              </span>
            </div>
            <p className="text-[9px] text-white/70 font-medium tracking-wider uppercase">
              Tema Jekyll Cayman Ativo
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1 text-xs text-white/80 font-medium mr-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 mr-1" />
            <span>Versão 1.0</span>
            <span className="mx-2 text-white/30">•</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] border border-white/10">
              Jekyll Page
            </span>
          </div>

          {showStartBtn && onStartClick && (
            <button
              onClick={onStartClick}
              className="px-5 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <span>Começar</span>
              <Send className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
