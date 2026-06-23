/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Check } from "lucide-react";

interface SelectableCardProps {
  title: string;
  subtitle?: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  badge?: string;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  title,
  subtitle,
  selected,
  onClick,
  icon,
  badge,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 select-none flex flex-col justify-between h-full group ${
        selected
          ? "border-blue-500 bg-blue-500/10 backdrop-blur-md shadow-lg shadow-blue-500/5 translate-y-[-2px]"
          : "border-white/60 bg-white/40 backdrop-blur-sm hover:bg-white/65 hover:border-white/90 hover:shadow-md"
      }`}
    >
      {/* Check Indicator */}
      <div
        className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
          selected
            ? "bg-blue-600 scale-100 opacity-100 text-white"
            : "bg-transparent scale-70 opacity-0"
        }`}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </div>

      {badge && (
        <span className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded-full">
          {badge}
        </span>
      )}

      {/* Icon */}
      {icon && (
        <div
          className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
            selected
              ? "bg-blue-600/10 text-blue-600"
              : "bg-slate-50 text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-700"
          }`}
        >
          {icon}
        </div>
      )}

      {/* Text Container */}
      <div className={badge && !icon ? "mt-5" : ""}>
        <h4
          className={`font-display font-bold text-sm tracking-tight transition-colors duration-300 ${
            selected ? "text-blue-900" : "text-slate-800"
          }`}
        >
          {title}
        </h4>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
