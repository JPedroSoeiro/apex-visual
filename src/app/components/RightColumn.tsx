"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";

interface RightColumnProps {
  onModelChangeAction: (modelName: string) => void;
  onWireframeToggleAction: (mode: boolean) => void;
}

export default function RightColumn({
  onModelChangeAction,
  onWireframeToggleAction,
}: RightColumnProps) {
  return (
    <div
      style={{ background: "rgba(0, 0, 0, 0.2)" }}
      className="w-full md:w-1/2 h-full rounded-lg p-8 flex flex-col items-center justify-center text-white text-center space-y-8"
    >
      {/* Seção de Troca de Veículo */}
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <h2 className="text-3xl font-extrabold mb-4 font-['Montserrat']">
          Troca de Veículo
        </h2>{" "}
        {/* Fonte ajustada */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {" "}
          {/* Grade de 2 colunas com espaçamento */}
          <Button
            className="w-full py-6 text-xl font-bold font-['Roboto']"
            onClick={() => onModelChangeAction("Skyline")}
          >
            Skyline
          </Button>
          <Button
            className="w-full py-6 text-xl font-bold font-['Roboto']"
            onClick={() => onModelChangeAction("Supra")}
          >
            Supra
          </Button>
          <Button
            className="w-full py-6 text-xl font-bold font-['Roboto']"
            onClick={() => onModelChangeAction("Impala 67")}
          >
            Impala 67
          </Button>
          <Button
            className="w-full py-6 text-xl font-bold font-['Roboto']"
            onClick={() => onModelChangeAction("MD-902")}
          >
            MD-902
          </Button>
        </div>
      </div>

      {/* Seção de Wireframe */}
      <div className="flex flex-col space-y-4 w-full max-w-xs mt-8">
        <h3 className="text-3xl font-extrabold mb-4 font-['Montserrat']">
          Modo Wireframe
        </h3>{" "}
        {/* Fonte ajustada */}
        <Button
          className="w-full py-6 text-xl font-bold font-['Roboto']"
          onClick={() => onWireframeToggleAction(true)}
        >
          On
        </Button>
        <Button
          className="w-full py-6 text-xl font-bold font-['Roboto']"
          onClick={() => onWireframeToggleAction(false)}
        >
          Off
        </Button>
      </div>
    </div>
  );
}
