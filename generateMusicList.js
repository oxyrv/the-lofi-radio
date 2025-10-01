// generateMusicList.js  (CommonJS, pas besoin de "type": "module")
const fs = require("fs");
const path = require("path");

const musicDir = path.join(process.cwd(), "src", "music");
const outPath = path.join(process.cwd(), "src", "music.json");

try {
  if (!fs.existsSync(musicDir)) {
    console.warn("⚠️  dossier src/music introuvable — création d'un music.json vide.");
    fs.writeFileSync(outPath, JSON.stringify([], null, 2));
    console.log("✅ music.json (vide) généré:", outPath);
    process.exit(0);
  }

  const files = fs.readdirSync(musicDir)
    .filter(f => /\.mp3$/i.test(f))
    .sort();

  fs.writeFileSync(outPath, JSON.stringify(files, null, 2));
  console.log("✅ music.json généré avec", files.length, "fichier(s). ->", outPath);
} catch (err) {
  console.error("Erreur génération music.json :", err);
  try { fs.writeFileSync(outPath, JSON.stringify([], null, 2)); } catch {}
  process.exit(0);
}
