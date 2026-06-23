/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Check } from "lucide-react";

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full">
      {/* Dynamic Progress Bar line */}
      <div className="relative mb-6">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/30 backdrop-blur-sm -translate-y-1/2 rounded-full" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />

        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;

            return (
              <div
                key={index}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : isActive
                        ? "bg-emerald-500 text-white ring-4 ring-emerald-500/10 shadow-md shadow-emerald-500/20"
                        : "bg-white/40 backdrop-blur-sm border-2 border-white/60 text-slate-500"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                
                {/* Responsive labels for bigger screens */}
                <span
                  className={`hidden sm:block absolute top-12 text-[11px] font-semibold text-center whitespace-nowrap transition-colors duration-300 ${
                    isActive
                      ? "text-emerald-700"
                      : isCompleted
                        ? "text-emerald-600"
                        : "text-slate-400"
                  }`}
                >
                  {stepLabels[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Simple step label for mobile screens */}
      <div className="sm:hidden text-center mt-8">
        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">
          Etapa {currentStep} de {totalSteps}
        </span>
        <h3 className="text-sm font-bold text-slate-800 mt-1">
          {stepLabels[currentStep - 1]}
        </h3>
      </div>
      
      {/* Extra spacer on desktop for labels */}
      <div className="hidden sm:block h-6" />
    </div>
  );
};
