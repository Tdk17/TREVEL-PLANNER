/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Compass, Check, Calendar, Landmark, BookOpen, Printer, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { TravelPlan } from "../types";

interface PDFPreviewCardProps {
  plan: TravelPlan;
}

export const PDFPreviewCard: React.FC<PDFPreviewCardProps> = ({ plan }) => {
  const [activePage, setActivePage] = useState<number>(1);
  const totalPages = 5;

  const nextPage = () => setActivePage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setActivePage((p) => Math.max(p - 1, 1));

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header page count controls */}
      <div className="flex items-center justify-between w-full mb-4 px-1 bg-white/20 backdrop-blur-sm border border-white/40 p-2.5 rounded-2xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <span>Página {activePage} de {totalPages}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={activePage === 1}
            className="p-1.5 rounded-lg bg-white/50 border border-white/60 text-slate-600 hover:bg-white/80 disabled:opacity-50 transition-all duration-300 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextPage}
            disabled={activePage === totalPages}
            className="p-1.5 rounded-lg bg-white/50 border border-white/60 text-slate-600 hover:bg-white/80 disabled:opacity-50 transition-all duration-300 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Styled A4 Document Area */}
      <div className="w-full max-w-[480px] aspect-[1/1.41] bg-white border border-white/40 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between font-sans text-left relative selection:bg-emerald-100">
        
        {/* Subtle page background grid lines mock */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {/* Page Content Selector */}
        <div className="relative z-10 flex-grow flex flex-col justify-between">
          
          {/* HEADER WATERMARK (Same for all inner pages except Cover) */}
          {activePage > 1 && (
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Travel Planner AI</span>
              </div>
              <span className="text-[8px] font-mono text-slate-400">Roteiro Oficial: {plan.destination}</span>
            </div>
          )}

          {/* PAGE 1: COVER */}
          {activePage === 1 && (
            <div className="flex flex-col justify-center items-center text-center my-auto py-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-lg mb-6">
                <Compass className="w-8 h-8" />
              </div>
              
              <span className="px-3 py-1 text-[10px] font-extrabold bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 rounded-full tracking-widest uppercase mb-3 backdrop-blur-sm">
                Roteiro Inteligente Autorizado
              </span>
              
              <h1 className="font-display font-black text-3xl text-slate-900 tracking-tight leading-tight">
                {plan.destination}
              </h1>
              
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Guia Completo de Organização, Custos e Itinerário
              </p>

              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full my-8" />

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left w-full max-w-xs mt-4">
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Origem</span>
                  <span className="text-xs font-bold text-slate-700">{plan.departureCity}</span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Duração</span>
                  <span className="text-xs font-bold text-slate-700">{plan.daysCount} Dias</span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Estilo Selecionado</span>
                  <span className="text-xs font-bold text-slate-700">Premium / Sob Medida</span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Emissão</span>
                  <span className="text-xs font-mono text-slate-700">Junho, 2026</span>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2: RESUMO & DESTINO INFO */}
          {activePage === 2 && (
            <div className="flex-grow flex flex-col justify-start">
              <h3 className="font-display font-extrabold text-lg text-slate-900 mb-3 flex items-center">
                <Sparkles className="w-4 h-4 text-emerald-600 mr-2" />
                Informações Locais e Resumo
              </h3>
              
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Este plano estratégico para <strong>{plan.destination}</strong> foi customizado considerando um perfil dinâmico de {plan.peopleCount} {plan.peopleCount > 1 ? "pessoas" : "pessoa"}.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Melhor Época para Visitar</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">{plan.bestTimeToVisit}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Idioma Oficial</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">{plan.localLanguage}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Moeda Oficial</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">{plan.localCurrency}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Temperatura Esperada</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">{plan.averageTemp}</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <h4 className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest mb-1">Dica do Agente Virtual</h4>
                <p className="text-[10px] text-emerald-700 leading-relaxed">
                  As temperaturas na época selecionada são perfeitas para passeios externos. Sugerimos calçados confortáveis e sempre carregar dinheiro vivo convertido para pequenas transações em comércios tradicionais.
                </p>
              </div>
            </div>
          )}

          {/* PAGE 3: PLANEJAMENTO FINANCEIRO */}
          {activePage === 3 && (
            <div className="flex-grow flex flex-col justify-start">
              <h3 className="font-display font-extrabold text-lg text-slate-900 mb-2 flex items-center">
                <Landmark className="w-4 h-4 text-emerald-600 mr-2" />
                Planejamento Orçamentário
              </h3>
              <p className="text-[11px] text-slate-500 mb-4">
                Estrutura de investimento financeiro estimado em <strong>{plan.localCurrency.split(" ")[0]}</strong>.
              </p>

              <div className="space-y-2 mb-6">
                {[
                  { name: "Passagens Aéreas", val: plan.costEstimate.flight },
                  { name: "Hospedagem", val: plan.costEstimate.accommodation },
                  { name: "Alimentação", val: plan.costEstimate.food },
                  { name: "Transporte Local", val: plan.costEstimate.transport },
                  { name: "Atividades & Passeios", val: plan.costEstimate.activities },
                  { name: "Seguro Viagem", val: plan.costEstimate.insurance },
                  { name: "Reserva de Segurança", val: plan.costEstimate.extraReserve },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-mono text-slate-800 font-bold">{plan.localCurrency.split(" ")[0]} {item.val.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-white mt-auto">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">CUSTO TOTAL ESTIMADO</span>
                    <p className="text-xs text-emerald-400 mt-0.5">Média por pessoa: {plan.localCurrency.split(" ")[0]} {plan.costEstimate.costPerPerson.toLocaleString()}</p>
                  </div>
                  <div className="font-mono font-black text-lg text-white">
                    {plan.localCurrency.split(" ")[0]} {plan.costEstimate.total.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 4: ROTEIRO RESUMIDO */}
          {activePage === 4 && (
            <div className="flex-grow flex flex-col justify-start">
              <h3 className="font-display font-extrabold text-lg text-slate-900 mb-2 flex items-center">
                <Calendar className="w-4 h-4 text-emerald-600 mr-2" />
                Roteiro Resumido Dia-a-Dia
              </h3>
              <p className="text-[11px] text-slate-500 mb-4">
                Consolidação diária de atividades projetadas:
              </p>

              <div className="space-y-3.5">
                {plan.itinerary.slice(0, 5).map((day, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-display font-extrabold text-[11px] text-emerald-700 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                      D{day.dayNumber}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800">{day.title.replace(`Dia ${day.dayNumber}: `, "")}</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[300px]">
                        {day.activities.map((a) => a.place).join(" ➔ ")}
                      </p>
                    </div>
                  </div>
                ))}

                {plan.daysCount > 5 && (
                  <div className="text-[10px] text-slate-400 text-center font-medium italic pt-2">
                    + {plan.daysCount - 5} dias detalhados no arquivo completo anexo.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PAGE 5: CHECKLIST DE PREPARAÇÃO */}
          {activePage === 5 && (
            <div className="flex-grow flex flex-col justify-start">
              <h3 className="font-display font-extrabold text-lg text-slate-900 mb-2 flex items-center">
                <Check className="w-4 h-4 text-emerald-500 mr-2 stroke-[3]" />
                Checklist Oficial Emitido
              </h3>
              <p className="text-[11px] text-slate-500 mb-4">
                Lembretes fundamentais antes de iniciar o embarque internacional/nacional:
              </p>

              <div className="space-y-2.5">
                {plan.checklist.slice(0, 7).map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs text-slate-700">
                    <div className="w-4.5 h-4.5 rounded border border-slate-300 flex items-center justify-center text-emerald-500 flex-shrink-0 mt-0.5">
                      {idx < 2 ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                    </div>
                    <span className={idx < 2 ? "line-through text-slate-400 font-medium" : "font-medium text-slate-600"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-dashed border-slate-200 pt-4 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                <span>VERIFICADO POR AGENTE IA</span>
                <span>ID: {plan.id.slice(0, 10)}</span>
              </div>
            </div>
          )}

          {/* WATERMARK / SIGNATURE (Same for all inner pages except Cover) */}
          {activePage > 1 && (
            <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-4 text-[8px] text-slate-400 font-mono">
              <span>GERADO EM: 2026-06-23</span>
              <span>PÁGINA {activePage} DE {totalPages}</span>
            </div>
          )}
          
          {/* Cover Watermark */}
          {activePage === 1 && (
            <div className="flex flex-col items-center border-t border-slate-100 pt-4 mt-8">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Travel Planner AI Studio</span>
              <p className="text-[8px] text-slate-300 mt-0.5">Documento reservado e customizado para o utilizador.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
