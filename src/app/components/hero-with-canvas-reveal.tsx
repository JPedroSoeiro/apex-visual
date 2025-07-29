// src/app/components/hero-with-canvas-reveal.tsx
"use client";
import React, { useState, useCallback } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/app/components/ui/canvas-reveal-effect";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";

export default function HeroWithCanvasReveal() {
  const [currentModelPath, setCurrentModelPath] = useState(
    "/models/impala/scene.gltf"
  );
  const [isWireframeMode, setIsWireframeMode] = useState(false);

  // Renomeado para terminar com 'Action' conforme sugestão do Next.js
  const handleModelChangeAction = useCallback((modelName: string) => {
    let newPath = "";
    switch (modelName) {
      case "Skyline":
        newPath = "/models/skyline/scene.gltf";
        break;
      case "Supra":
        newPath = "/models/supra/scene.gltf";
        break;
      case "Impala 67":
        newPath = "/models/impala/scene.gltf";
        break;
      case "MD-902":
        newPath = "/models/md-902/scene.gltf";
        break;
      default:
        newPath = "/models/impala/scene.gltf"; // Padrão
    }
    setCurrentModelPath(newPath);
  }, []);

  // Renomeado para terminar com 'Action' conforme sugestão do Next.js
  const handleWireframeToggleAction = useCallback((mode: boolean) => {
    setIsWireframeMode(mode);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Canvas Reveal Effect Background */}
      <div className="absolute inset-0">
        <CanvasRevealEffect
          animationSpeed={2}
          containerClassName="bg-black"
          colors={[
            [0, 0, 180],
            [0, 0, 220],
            [100, 100, 255],
          ]}
          dotSize={3}
          opacities={[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1]}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
      </div>

      <div className="relative z-10 w-full h-screen flex justify-center items-center p-8 sm:p-20">
        <div className="flex flex-col md:flex-row w-full h-full max-w-[2000px] gap-8">
          <LeftColumn
            modelPath={currentModelPath}
            showWireframe={isWireframeMode}
          />
          {/* Passando as funções renomeadas */}
          <RightColumn
            onModelChangeAction={handleModelChangeAction} // Renomeado aqui
            onWireframeToggleAction={handleWireframeToggleAction} // Renomeado aqui
          />
        </div>
      </div>
    </div>
  );
}

// Card, AceternityIcon, Icon (se estiverem neste arquivo, mova-os ou remova-os)
