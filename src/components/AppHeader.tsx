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
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 text-white shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-display font-bold text-lg tracking-tight text-white">
                Travel Planner
              </span>
              <span className="font-display font-extrabold text-lg text-emerald-400">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Agente Inteligente de Viagens
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1 text-xs text-slate-300 font-medium mr-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1" />
            <span>Versão 1.0</span>
            <span className="mx-2 text-slate-700">•</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] border border-slate-700/50">
              Offline-first
            </span>
          </div>

          {showStartBtn && onStartClick && (
            <button
              onClick={onStartClick}
              className="px-5 py-2 rounded-lg bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-600/10 flex items-center space-x-2"
            >
              <span>Começar</span>
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
