/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MapPin, Calendar, Users, Globe, Languages, Thermometer, Coins, PiggyBank } from "lucide-react";
import { TravelPlan } from "../types";

interface TravelSummaryCardProps {
  plan: TravelPlan;
}

export const TravelSummaryCard: React.FC<TravelSummaryCardProps> = ({ plan }) => {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/40 pb-6 mb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-500 animate-bounce" />
            <span>Destino Oficial Gerado</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
            {plan.destination}
          </h2>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Saindo de: <strong className="text-slate-600 font-semibold">{plan.departureCity}</strong>
          </p>
        </div>
        
        {/* Badges of days & people */}
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2.5 rounded-2xl bg-blue-500/10 backdrop-blur-sm border border-blue-200/50 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <div className="text-left">
              <p className="text-[9px] text-blue-500 font-bold uppercase leading-none">Duração</p>
              <p className="text-xs font-bold text-blue-900 mt-0.5">{plan.daysCount} dias</p>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 backdrop-blur-sm border border-emerald-200/50 flex items-center space-x-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <div className="text-left">
              <p className="text-[9px] text-emerald-500 font-bold uppercase leading-none">Pessoas</p>
              <p className="text-xs font-bold text-emerald-900 mt-0.5">{plan.peopleCount} {plan.peopleCount > 1 ? "pessoas" : "pessoa"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid metadata */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60 flex items-start space-x-3 hover:bg-white/60 transition-colors">
          <Calendar className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Melhor Época</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">{plan.bestTimeToVisit}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60 flex items-start space-x-3 hover:bg-white/60 transition-colors">
          <Coins className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Moeda Local</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">{plan.localCurrency}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60 flex items-start space-x-3 hover:bg-white/60 transition-colors">
          <Languages className="w-5 h-5 text-emerald-500 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Idioma</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">{plan.localLanguage}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60 flex items-start space-x-3 hover:bg-white/60 transition-colors">
          <Thermometer className="w-5 h-5 text-rose-500 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Temperatura Média</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">{plan.averageTemp}</span>
          </div>
        </div>
      </div>

      {/* Financial Target Goal section */}
      <div className="mt-6 p-5 sm:p-6 bg-slate-900/95 backdrop-blur-md text-white border border-white/10 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl shadow-slate-950/15">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-400/20 blur-2xl" />
        <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl" />
        
        <div className="relative z-10 flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 text-emerald-400">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg tracking-tight text-white">Meta de Poupança Planejada</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-md">
              Com base no tempo estimado até a sua viagem, organizamos um planejamento de poupança mensal recomendado para realizar este sonho sem surpresas.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-left md:text-right bg-white/10 border border-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl min-w-[200px]">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Guardar mensalmente</span>
          <div className="font-mono text-xl sm:text-2xl font-black text-white mt-1">
            {plan.localCurrency.split(" ")[0]} {plan.costEstimate.monthlySavingsRequired.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Até a data estimada</span>
        </div>
      </div>
    </div>
  );
};
