// src/app/components/LeftColumn.tsx
"use client";

import React from "react";
import CarViewer from "./CarViewer";

interface LeftColumnProps {
  modelPath: string;
  showWireframe: boolean;
}

export default function LeftColumn({
  modelPath,
  showWireframe,
}: LeftColumnProps) {
  return (
    <div className="w-full md:w-1/2 h-full flex items-center justify-center">
      <CarViewer modelPath={modelPath} showWireframe={showWireframe} />
    </div>
  );
}
