/**
 * Mantém a versão Next.js idêntica à entrada HTML.
 * Fonte única: app.js, questions.js, styles.css, imagens/ e audio/ (raiz).
 * Cópias geradas: public/game.js, public/questions.js, app/globals.css,
 * public/imagens/ e public/audio/. Não edite as cópias à mão.
 */
import { cpSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const at = (...parts) => join(root, ...parts);

cpSync(at("app.js"), at("public", "game.js"));
cpSync(at("questions.js"), at("public", "questions.js"));
cpSync(at("imagens"), at("public", "imagens"), { recursive: true });
cpSync(at("audio"), at("public", "audio"), { recursive: true });

// No Next.js o CSS é empacotado em /_next/, então as imagens precisam de caminho absoluto.
const css = readFileSync(at("styles.css"), "utf8").replaceAll('url("imagens/', 'url("/imagens/');
const nextOnly = `
/* ===== Específico do Next.js (gerado por scripts/sync-next.mjs; edite styles.css, não este arquivo) ===== */
.next-shell { min-height: 100vh; min-height: 100svh; }
.framework-status { position: fixed; z-index: 30; inset: 0; display: grid; align-content: center; justify-items: center; gap: 10px; padding: 24px; background: #8bc8ee; color: #15131f; text-align: center; }
.framework-status h1, .framework-status p { margin: 0; }
.framework-status h1 { font-size: clamp(22px, 4vw, 38px); }
.framework-status p { font-weight: 800; }
.framework-spinner { color: #ffbf29; font-size: 56px; animation: sparkle 1s ease-in-out infinite alternate; }
@keyframes sparkle { to { transform: rotate(25deg) scale(1.18); } }
`;
writeFileSync(at("app", "globals.css"), css.trimEnd() + "\n" + nextOnly);
console.log("Next.js sincronizado com a entrada HTML.");
