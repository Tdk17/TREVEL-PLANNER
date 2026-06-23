/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Check, X, Shield, Star, Hotel, Home, Users, Tent } from "lucide-react";
import { AccommodationComparison } from "../types";

interface ComparisonCardProps {
  options: AccommodationComparison[];
  currencySymbol: string;
  preferredType: string;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  options,
  currencySymbol,
  preferredType,
}) => {
  return (
    <div className="w-full">
      <div className="border-b border-white/40 pb-4 mb-6">
        <h3 className="font-display font-bold text-xl text-slate-800">
          Comparativo de Hospedagem
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Comparamos as 4 modalidades principais do mercado turístico local para guiar sua escolha.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {options.map((acc) => {
          const isPreferred =
            preferredType.toLowerCase().includes(acc.type.toLowerCase()) ||
            (preferredType === "Ainda não sei" && acc.type === "Hotel");

          const getIcon = () => {
            switch (acc.type) {
              case "Hotel":
                return <Hotel className="w-5 h-5 text-blue-600" />;
              case "Airbnb":
                return <Home className="w-5 h-5 text-rose-500" />;
              case "Hostel":
                return <Users className="w-5 h-5 text-emerald-500" />;
              default:
                return <Tent className="w-5 h-5 text-amber-500" />;
            }
          };

          return (
            <div
              key={acc.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 relative group hover:shadow-lg ${
                isPreferred
                  ? "border-blue-500 bg-blue-500/10 backdrop-blur-md ring-2 ring-blue-500/20"
                  : "glass-card"
              }`}
            >
              {isPreferred && (
                <span className="absolute -top-3 left-6 px-3 py-1 text-[10px] font-extrabold bg-blue-600 text-white rounded-full flex items-center space-x-1 shadow-sm">
                  <Star className="w-3 h-3 fill-white stroke-none" />
                  <span>Sua Preferência</span>
                </span>
              )}

              <div>
                {/* Header card */}
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2.5 rounded-2xl bg-white/40 group-hover:bg-white/60 transition-colors">
                    {getIcon()}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Média Diária
                    </span>
                    <div className="font-mono text-sm font-bold text-slate-800">
                      {currencySymbol} {acc.averagePrice}/noite
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-display font-extrabold text-base text-slate-800">
                    {acc.type}
                  </h4>
                  <div className="flex items-center space-x-1.5 mt-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Conforto: <strong>{acc.comfortLevel}</strong>
                    </span>
                  </div>
                </div>

                {/* Pros */}
                <div className="border-t border-white/40 pt-4 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
                    Prós
                  </span>
                  <ul className="space-y-1.5">
                    {acc.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contras */}
                <div className="border-t border-white/40 pt-4 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
                    Contras
                  </span>
                  <ul className="space-y-1.5">
                    {acc.contras.map((contra, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-500">
                        <X className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span>{contra}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Profile suggestion */}
              <div className="border-t border-white/40 pt-4 mt-auto">
                <span className="text-[9px] font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded block w-fit uppercase mb-1">
                  Perfil Recomendado
                </span>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  &ldquo;{acc.bestProfile}&rdquo;
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
