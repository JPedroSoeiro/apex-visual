// src/app/components/hero-with-canvas-reveal.tsx
"use client";
import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/app/components/ui/canvas-reveal-effect"; // O alias @/ está correto
import LeftColumn from "./LeftColumn"; // Importa o novo componente da coluna esquerda
import RightColumn from "./RightColumn"; // Importa o novo componente da coluna direita

export default function HeroWithCanvasReveal() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Canvas Reveal Effect Background */}
      <div className="absolute inset-0">
        <CanvasRevealEffect
          animationSpeed={2}
          containerClassName="bg-black"
          colors={[
            [0, 0, 180], // Azul escuro
            [0, 0, 220], // Outro tom de azul escuro
            [100, 100, 255], // Azul claro
          ]}
          dotSize={3}
          opacities={[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1]}
        />
        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
      </div>

      {/* Hero Content - Agora usa os novos componentes de coluna */}
      <div className="relative z-10 w-full h-screen flex justify-center items-center p-8 sm:p-20">
        {/* Container para as duas colunas 50/50 */}
        <div className="flex flex-col md:flex-row w-full h-full max-w-[2000px] gap-8">
          {/* Coluna da Esquerda */}
          <LeftColumn />

          {/* Coluna da Direita */}
          <RightColumn />
        </div>
      </div>
    </div>
  );
}

// Card, AceternityIcon, Icon não fazem parte deste arquivo no seu último fornecimento.
// Se eles ainda estiverem aqui, e não forem usados por este componente, você pode movê-los ou removê-los.
// Se eles forem usados por canvas-reveal-effect-demo.tsx, eles devem permanecer lá.
