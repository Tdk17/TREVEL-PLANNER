/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Landmark, Sparkles, DollarSign, ArrowRight } from "lucide-react";
import { ItineraryDay } from "../types";

interface ItineraryDayCardProps {
  day: ItineraryDay;
  currencySymbol: string;
  defaultExpanded?: boolean;
}

export const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({
  day,
  currencySymbol,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Compute total cost for the day
  const totalDayCost = day.activities.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  return (
    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300">
      {/* Accordion Trigger Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/40 transition-colors select-none"
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-200/40 backdrop-blur-sm flex items-center justify-center text-blue-600 font-display font-black">
            D{day.dayNumber}
          </div>
          <div>
            <h4 className="font-display font-extrabold text-base text-slate-800 tracking-tight">
              {day.title}
            </h4>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {day.activities.length} Atividades
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center font-semibold text-emerald-600">
                Custo estimado: {currencySymbol} {totalDayCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <button className="p-2 rounded-xl bg-white/40 border border-white/60 hover:bg-white/60 transition-colors text-slate-500">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Accordion Content */}
      {isExpanded && (
        <div className="p-5 bg-white/25 border-t border-white/40">
          <div className="relative pl-6 border-l-2 border-white/50 ml-4 space-y-6">
            {day.activities.map((act, index) => {
              return (
                <div key={index} className="relative group">
                  {/* Bullet Node Indicator */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-emerald-500 shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform" />

                  {/* Header Activity */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-400 bg-white/60 border border-white/70 px-2 py-0.5 rounded">
                        {act.time}
                      </span>
                      <h5 className="font-display font-extrabold text-sm text-slate-800">
                        {act.place}
                      </h5>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 text-slate-400 mr-1" />
                        {act.averageTime}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className={`font-semibold ${act.estimatedCost > 0 ? "text-slate-700" : "text-emerald-600"}`}>
                        {act.estimatedCost > 0 ? `${currencySymbol} ${act.estimatedCost}` : "Grátis / Incluso"}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {act.description}
                  </p>

                  {/* Smart tip banner */}
                  {act.agentTip && (
                    <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900/90 backdrop-blur-sm text-[11px] flex items-start space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{act.agentTip}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
