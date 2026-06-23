/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  id,
  className = "",
}) => {
  return (
    <div
      id={id}
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 ${className}`}
    >
      {children}
    </div>
  );
};
