import { mkdir, writeFile } from "node:fs/promises";
import { collecter } from "./collecte.ts";
import { rediger } from "./redaction.ts";

const FENETRE_HEURES = Number(process.env.VEILLE_FENETRE_HEURES ?? 26);
const DOSSIER_RAPPORTS = new URL("../rapports/", import.meta.url);

const maintenant = new Date();
const jour = maintenant.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" }); // AAAA-MM-JJ
const dateLisible = maintenant.toLocaleDateString("fr-FR", {
  timeZone: "Europe/Paris",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const collecte = await collecter(new Date(maintenant.getTime() - FENETRE_HEURES * 3_600_000));
console.log(`${collecte.articles.length} articles et ${collecte.modeles.length} modèles collectés.`);
for (const erreur of collecte.erreurs) console.warn(`Source indisponible : ${erreur}`);

if (process.argv.includes("--collecte-seule")) {
  for (const a of collecte.articles) console.log(`- [${a.source}] ${a.titre}\n  ${a.lien}`);
  process.exit(0);
}

const rapport = await rediger(collecte, dateLisible);
const pied = collecte.erreurs.length
  ? `\n\n---\n_Sources indisponibles ce jour : ${collecte.erreurs.join(" ; ")}_\n`
  : "\n";

await mkdir(DOSSIER_RAPPORTS, { recursive: true });
const fichier = new URL(`${jour}.md`, DOSSIER_RAPPORTS);
await writeFile(fichier, rapport + pied);
console.log(`Rapport écrit : rapports/${jour}.md`);
