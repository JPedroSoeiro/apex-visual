"use client"; // ESSENCIAL: Garante que este componente roda no navegador

import React, { Suspense, useRef, useState, useEffect } from "react"; // Importado useEffect
import { Canvas, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  Bounds,
  useBounds,
} from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Componente que carrega e exibe o modelo GLTF/GLB
// Removemos onProgressChange e onErrorChange como props aqui,
// pois o onProgress direto do useLoader está causando erros de tipagem.
// O progresso será tratado globalmente (ver useEffect em CarViewer)
function Model({ modelPath }: { modelPath: string }) {
  // Tipo simplificado da prop
  // O onError ainda é uma boa prática para erros não suspensivos, embora Suspense pegue a maioria
  // O try/catch é uma camada extra de segurança.
  try {
    const gltf = useLoader(
      GLTFLoader,
      modelPath,
      // 3º argumento (extensions): undefined se não houver extensões como DracoLoader
      undefined
      // REMOVIDO: o 4º argumento (onProgress) daqui para resolver o erro 2345
      // Se você REALMENTE precisa de progresso específico por loader,
      // precisaria de uma configuração de loader mais complexa fora do useLoader
    );

    const modelRef = useRef<THREE.Group>(null);

    // useLayoutEffect para centralizar o modelo assim que ele é carregado
    React.useLayoutEffect(() => {
      if (modelRef.current) {
        const box = new THREE.Box3().setFromObject(modelRef.current);
        const center = box.getCenter(new THREE.Vector3());
        // Move o modelo para que seu centro fique em (0,0,0), facilitando a rotação com OrbitControls
        modelRef.current.position.sub(center);
        // Ajuste a escala inicial aqui.
        // Tente valores como 0.005, 0.01, 0.1, 1, dependendo do tamanho original do seu modelo
        modelRef.current.scale.set(0.01, 0.01, 0.01);
      }
    }, [gltf.scene]); // Reage quando a cena do modelo é carregada

    return <primitive object={gltf.scene} ref={modelRef} />;
  } catch (error: any) {
    // Este catch pega erros que impedem o useLoader de suspender
    console.error(
      "Erro inesperado ao carregar modelo 3D no Model component:",
      error
    );
    // Podemos relançar para que o Suspense o pegue ou exibir uma mensagem aqui.
    // Para simplificar, vou relançar, e o Suspense do CarViewer vai lidar com isso.
    throw error;
  }
}

// Componente auxiliar para ajustar o modelo dentro dos limites visíveis
function FitToView({ children }: { children: React.ReactNode }) {
  const api = useBounds();

  React.useEffect(() => {
    if (api) {
      api.refresh().clip().fit();
    }
  }, [api, children]);

  return <>{children}</>;
}

// Componente principal do visualizador de carro
interface CarViewerProps {
  modelPath: string;
}

const CarViewer: React.FC<CarViewerProps> = ({ modelPath }) => {
  const [loadingProgress, setLoadingProgress] = useState(0); // Estado para o progresso
  const [loadingError, setLoadingError] = useState<string | null>(null); // Estado para erros de carregamento

  // Use useEffect para o gerenciador de carregamento global do Three.js
  useEffect(() => {
    // Callback para progresso geral de todos os loaders do Three.js
    const onProgressCallback = (
      url: string,
      itemsLoaded: number,
      itemsTotal: number
    ) => {
      setLoadingProgress((itemsLoaded / itemsTotal) * 100);
      // console.log(`Progresso Global: ${itemsLoaded}/${itemsTotal} (${url})`);
    };

    // Callback quando todos os itens são carregados
    const onLoadCallback = () => {
      setLoadingProgress(100);
      setLoadingError(null); // Limpa qualquer erro anterior
      // console.log("Todos os itens carregados globalmente.");
    };

    // Callback em caso de erro no carregamento global
    const onErrorCallback = (url: string) => {
      console.error(`Erro ao carregar recurso global: ${url}`);
      setLoadingError(`Falha ao carregar recurso: ${url}`);
    };

    // Atribua os callbacks ao DefaultLoadingManager do Three.js
    THREE.DefaultLoadingManager.onProgress = onProgressCallback;
    THREE.DefaultLoadingManager.onLoad = onLoadCallback;
    THREE.DefaultLoadingManager.onError = onErrorCallback;

    // Limpeza: remova os callbacks quando o componente for desmontado
    return () => {
      THREE.DefaultLoadingManager.onProgress = () => {};
      THREE.DefaultLoadingManager.onLoad = () => {};
      THREE.DefaultLoadingManager.onError = () => {};
    };
  }, []); // Executa apenas uma vez na montagem

  // Renderiza o erro se houver
  if (loadingError) {
    return (
      <div
        style={{
          width: "100%",
          height: "600px",
          background: "#f0f0f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Html
          center
          className="error-message"
          style={{ color: "red", fontSize: "1.2em" }}
        >
          {loadingError}
        </Html>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "400px",
        height: "400px",
        background: "#f0f0f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 5000 }}
        shadows
      >
        <Suspense
          fallback={
            <Html center>
              Carregando Modelo 3D... {loadingProgress.toFixed(0)}%
            </Html>
          }
        >
          <Bounds fit clip observe>
            <FitToView>
              <Model modelPath={modelPath} />
            </FitToView>
          </Bounds>

          <ambientLight intensity={0.7} />
          <directionalLight position={[1, 1, 1]} intensity={1.5} castShadow />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />

          <OrbitControls makeDefault enableZoom enablePan enableRotate />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CarViewer;
