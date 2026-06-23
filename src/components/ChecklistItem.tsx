/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CheckSquare, Square, ClipboardCheck, Sparkles } from "lucide-react";
import { ChecklistItemModel } from "../types";

interface ChecklistItemProps {
  items: ChecklistItemModel[];
  onToggle: (id: string) => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ items, onToggle }) => {
  // Categories mapping
  const categories = [
    { key: "documentacao", label: "Documentação & Vistos" },
    { key: "preparacao", label: "Reservas & Logística" },
    { key: "financeiro", label: "Financeiro & Câmbio" },
    { key: "essenciais", label: "Bagagem & Essenciais" },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8">
      <div className="border-b border-white/40 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-800 flex items-center">
            <ClipboardCheck className="w-5 h-5 text-blue-600 mr-2" />
            Checklist de Viagem Inteligente
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Marque os itens à medida que concluir os preparativos da sua viagem.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold bg-blue-500/10 text-blue-800 border border-blue-200/50 px-3 py-1 rounded-full">
            {items.filter((i) => i.checked).length} de {items.length} Concluídos
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const filteredItems = items.filter((i) => i.category === cat.key);
          if (filteredItems.length === 0) return null;

          return (
            <div key={cat.key} className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/50 shadow-sm">
              <h4 className="font-display font-extrabold text-xs text-slate-700 uppercase tracking-widest border-b border-white/30 pb-2 mb-3">
                {cat.label}
              </h4>
              
              <div className="space-y-2.5">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onToggle(item.id)}
                    className="flex items-start space-x-3 cursor-pointer select-none group"
                  >
                    <div className="mt-0.5 text-slate-400 group-hover:text-blue-600 transition-colors">
                      {item.checked ? (
                        <CheckSquare className="w-4.5 h-4.5 text-blue-600" />
                      ) : (
                        <Square className="w-4.5 h-4.5 text-slate-300 group-hover:border-slate-400" />
                      )}
                    </div>
                    <span
                      className={`text-xs transition-all duration-300 leading-relaxed ${
                        item.checked
                          ? "line-through text-slate-400 font-medium"
                          : "text-slate-700 font-medium group-hover:text-slate-950"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
