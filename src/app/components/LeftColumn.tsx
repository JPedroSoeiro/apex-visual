// src/app/components/LeftColumn.tsx
"use client";

import React from "react";
import CarViewer from "./CarViewer";

export default function LeftColumn() {
  return (
    <div className="w-full md:w-1/2 h-full flex items-center justify-center">
      <CarViewer modelPath="/models/impala/scene.gltf" showWireframe={true} />
    </div>
  );
}
