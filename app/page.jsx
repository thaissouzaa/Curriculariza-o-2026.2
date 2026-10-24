"use client";

import { useEffect, useRef, useState } from "react";

/**
 * React inicia o jogo e mantém o ciclo de vida do motor legado isolado.
 * Essa camada mantém a compatibilidade com index.html enquanto o app migra
 * gradualmente para componentes React sem aumentar o JavaScript do jogo.
 */
export default function HomePage() {
  const mountRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return undefined;

    const gameRoot = document.createElement("div");
    gameRoot.id = "app";
    gameRoot.className = "app";
    host.replaceChildren(gameRoot);

    let disposed = false;
    const scripts = [];
    const loadScript = (src) => new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Não foi possível carregar ${src}`));
      scripts.push(script);
      document.body.appendChild(script);
    });

    (async () => {
      try {
        await loadScript("/questions.js?v=20261023-music");
        if (disposed) return;
        await loadScript("/game.js?v=20261023-music");
        if (!disposed) setStatus("ready");
      } catch (error) {
        console.error(error);
        if (!disposed) setStatus("error");
      }
    })();

    return () => {
      disposed = true;
      scripts.forEach((script) => script.remove());
      gameRoot.remove();
    };
  }, []);

  return (
    <div className="next-shell">
      <div ref={mountRef} />
      {status !== "ready" && (
        <section className="framework-status" role="status" aria-live="polite">
          {status === "error" ? (
            <>
              <h1>Não conseguimos abrir a trilha agora.</h1>
              <p>Confira se os arquivos do jogo foram publicados junto com esta página.</p>
            </>
          ) : (
            <>
              <span className="framework-spinner" aria-hidden="true">✦</span>
              <h1>Preparando a Trilha Mágica…</h1>
              <p>Já vamos começar!</p>
            </>
          )}
        </section>
      )}
    </div>
  );
}
