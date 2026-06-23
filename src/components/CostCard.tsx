/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Plane, Home, Utensils, Car, Compass, ShieldCheck, HelpCircle, Landmark, Wallet, AlertCircle } from "lucide-react";
import { CostEstimate } from "../types";

interface CostCardProps {
  estimate: CostEstimate;
  currency: string;
}

export const CostCard: React.FC<CostCardProps> = ({ estimate, currency }) => {
  const currencySymbol = currency.split(" ")[0];

  const categories = [
    {
      label: "Passagem Aérea",
      value: estimate.flight,
      icon: <Plane className="w-4 h-4 text-sky-500" />,
      color: "bg-sky-500",
      textColor: "text-sky-600",
      percent: Math.round((estimate.flight / estimate.total) * 100) || 0,
    },
    {
      label: "Hospedagem",
      value: estimate.accommodation,
      icon: <Home className="w-4 h-4 text-emerald-500" />,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      percent: Math.round((estimate.accommodation / estimate.total) * 100) || 0,
    },
    {
      label: "Alimentação",
      value: estimate.food,
      icon: <Utensils className="w-4 h-4 text-amber-500" />,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      percent: Math.round((estimate.food / estimate.total) * 100) || 0,
    },
    {
      label: "Transporte Local",
      value: estimate.transport,
      icon: <Car className="w-4 h-4 text-purple-500" />,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      percent: Math.round((estimate.transport / estimate.total) * 100) || 0,
    },
    {
      label: "Passeios e Atividades",
      value: estimate.activities,
      icon: <Compass className="w-4 h-4 text-rose-500" />,
      color: "bg-rose-500",
      textColor: "text-rose-600",
      percent: Math.round((estimate.activities / estimate.total) * 100) || 0,
    },
    {
      label: "Seguro Viagem",
      value: estimate.insurance,
      icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
      percent: Math.round((estimate.insurance / estimate.total) * 100) || 0,
    },
    {
      label: "Reserva de Emergência",
      value: estimate.extraReserve,
      icon: <HelpCircle className="w-4 h-4 text-slate-500" />,
      color: "bg-slate-400",
      textColor: "text-slate-600",
      percent: Math.round((estimate.extraReserve / estimate.total) * 100) || 0,
    },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center space-x-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <Landmark className="w-4 h-4 text-emerald-500" />
          <span>Orçamento e Custos Estimados</span>
        </div>
        
        <div className="border-b border-white/40 pb-4 mb-6">
          <h3 className="font-display font-bold text-xl text-slate-800">
            Detalhamento de Custos
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Estimativa calculada de acordo com o seu perfil e as médias históricas do destino.
          </p>
        </div>

        {/* Categories breakdown */}
        <div className="space-y-4 mb-8">
          {categories.map((cat, i) => (
            <div key={i} className="group">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-white/40 group-hover:bg-white/60 transition-colors">
                    {cat.icon}
                  </div>
                  <span className="text-slate-700 font-medium">{cat.label}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-slate-900 font-bold">
                    {currencySymbol} {cat.value.toLocaleString()}
                  </span>
                  <span className={`text-[10px] ml-1.5 font-bold ${cat.textColor} bg-white/40 px-1.5 py-0.5 rounded`}>
                    {cat.percent}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-white/40 border border-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Metrics Panel */}
      <div className="border-t border-white/40 pt-6 mt-auto">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Custo por Pessoa</span>
            <div className="font-mono text-base sm:text-lg font-black text-slate-800 mt-1">
              {currencySymbol} {estimate.costPerPerson.toLocaleString()}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Custo por Dia</span>
            <div className="font-mono text-base sm:text-lg font-black text-slate-800 mt-1">
              {currencySymbol} {estimate.costPerDay.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Heavy Box for Custo Total */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 border border-white/20 text-white flex justify-between items-center shadow-lg shadow-emerald-500/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-emerald-100 uppercase tracking-wider block">Investimento Total Estimado</span>
              <span className="text-xs text-white/80">Todos os dias & pessoas</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xl sm:text-2xl font-black">
              {currencySymbol} {estimate.total.toLocaleString()}
            </div>
          </div>
        </div>
        
        {/* Footnote badge */}
        <div className="flex items-start space-x-2 text-[10px] text-slate-400 mt-3 leading-relaxed">
          <AlertCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
          <span>Este cálculo representa estimativas de mercado e variações cambiais sazonais podem ocorrer.</span>
        </div>
      </div>
    </div>
  );
};
