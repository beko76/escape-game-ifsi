import { XMLParser } from "fast-xml-parser";
import { FLUX, HUGGING_FACE_TENDANCES, parleDIA, type SourceFlux } from "./sources.ts";

export interface Article {
  source: string;
  titre: string;
  lien: string;
  date: Date;
  extrait: string;
}

export interface ModeleTendance {
  id: string;
  tache: string | null;
  likes: number;
  telechargements: number;
  creeLe: Date | null;
}

export interface Collecte {
  articles: Article[];
  modeles: ModeleTendance[];
  erreurs: string[];
}

const DELAI_MS = 20_000;
const MAX_PAR_SOURCE = 25;
const ENTETES = { "user-agent": "veille-ia/1.0 (+https://github.com/beko76/escape-game-ifsi)" };

const parseur = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@",
  textNodeName: "#text",
  isArray: (nom) => nom === "item" || nom === "entry" || nom === "link",
});

export async function collecter(depuis: Date): Promise<Collecte> {
  const erreurs: string[] = [];

  const resultats = await Promise.allSettled(FLUX.map((flux) => lireFlux(flux, depuis)));
  const articles = resultats.flatMap((resultat, i) => {
    if (resultat.status === "fulfilled") return resultat.value;
    erreurs.push(`${FLUX[i].nom} : ${messageErreur(resultat.reason)}`);
    return [];
  });

  let modeles: ModeleTendance[] = [];
  try {
    modeles = await lireTendancesHuggingFace();
  } catch (erreur) {
    erreurs.push(`Hugging Face (tendances) : ${messageErreur(erreur)}`);
  }

  return { articles: dedoublonner(articles), modeles, erreurs };
}

async function telecharger(url: string): Promise<Response> {
  const reponse = await fetch(url, { headers: ENTETES, signal: AbortSignal.timeout(DELAI_MS) });
  if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
  return reponse;
}

async function lireFlux(flux: SourceFlux, depuis: Date): Promise<Article[]> {
  const xml = await (await telecharger(flux.url)).text();
  return analyserFlux(xml, flux)
    .filter((article) => article.date >= depuis)
    .filter((article) => !flux.filtrerSurIA || parleDIA(`${article.titre} ${article.extrait}`))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, MAX_PAR_SOURCE);
}

// Lit un flux RSS 2.0 ou Atom.
export function analyserFlux(xml: string, flux: SourceFlux): Article[] {
  const doc = parseur.parse(xml);
  const elements: Record<string, unknown>[] = doc?.rss?.channel?.item ?? doc?.feed?.entry ?? [];

  return elements.flatMap((element) => {
    const titre = nettoyer(texte(element.title));
    const lien = lienDe(element);
    const date = new Date(
      texte(element.pubDate ?? element.published ?? element.updated ?? element["dc:date"]),
    );
    if (!titre || !lien || Number.isNaN(date.getTime())) return [];

    const extrait = nettoyer(
      texte(element.description ?? element.summary ?? element["content:encoded"] ?? element.content),
    ).slice(0, 400);
    return [{ source: flux.nom, titre, lien, date, extrait }];
  });
}

async function lireTendancesHuggingFace(): Promise<ModeleTendance[]> {
  const donnees = (await (await telecharger(HUGGING_FACE_TENDANCES)).json()) as Array<{
    id: string;
    pipeline_tag?: string;
    likes?: number;
    downloads?: number;
    createdAt?: string;
  }>;
  return donnees.map((m) => ({
    id: m.id,
    tache: m.pipeline_tag ?? null,
    likes: m.likes ?? 0,
    telechargements: m.downloads ?? 0,
    creeLe: m.createdAt ? new Date(m.createdAt) : null,
  }));
}

function lienDe(element: Record<string, unknown>): string {
  const liens = (element.link as unknown[] | undefined) ?? [];
  for (const lien of liens) {
    if (typeof lien === "string") return lien.trim();
    const attributs = lien as Record<string, string>;
    if (attributs["@href"] && (!attributs["@rel"] || attributs["@rel"] === "alternate")) {
      return attributs["@href"].trim();
    }
  }
  const guid = texte(element.guid);
  return guid.startsWith("http") ? guid : "";
}

function texte(valeur: unknown): string {
  if (valeur == null) return "";
  if (typeof valeur === "string" || typeof valeur === "number") return String(valeur);
  if (typeof valeur === "object" && "#text" in valeur) return texte((valeur as { "#text": unknown })["#text"]);
  return "";
}

const ENTITES: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&nbsp;": " ",
};

function nettoyer(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&[a-z]+;/g, (entite) => ENTITES[entite] ?? entite)
    .replace(/\s+/g, " ")
    .trim();
}

function dedoublonner(articles: Article[]): Article[] {
  const vus = new Set<string>();
  return articles.filter((article) => {
    const cles = [
      article.lien.replace(/[?#].*$/, "").replace(/\/$/, ""),
      article.titre.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim(),
    ];
    if (cles.some((cle) => vus.has(cle))) return false;
    cles.forEach((cle) => vus.add(cle));
    return true;
  });
}

function messageErreur(erreur: unknown): string {
  return erreur instanceof Error ? erreur.message : String(erreur);
}
