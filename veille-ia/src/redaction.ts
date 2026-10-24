import Anthropic from "@anthropic-ai/sdk";
import type { Collecte } from "./collecte.ts";

const MODELE = process.env.VEILLE_MODELE ?? "claude-opus-5-5";
const EFFORT = (process.env.VEILLE_EFFORT ?? "medium") as "low" | "medium" | "high";
const RECHERCHES_MAX = Number(process.env.VEILLE_RECHERCHES_MAX ?? 12);
const REPRISES_MAX = 5;

const CONSIGNES = `Tu es un agent de veille sur l'intelligence artificielle. Chaque matin, tu rédiges en français une synthèse des nouveautés des dernières 24 heures pour un lecteur francophone curieux mais pas spécialiste : il veut savoir quelles nouvelles IA sortent et comment l'IA est utilisée, sans jargon inutile.

Ta matière première :
1. Les articles collectés dans les flux RSS (fournis dans le message).
2. Les modèles en tendance sur Hugging Face.
3. L'outil de recherche web, pour combler les trous : vérifie les annonces importantes, cherche les lancements de modèles et de produits IA du jour qui manqueraient (OpenAI, Anthropic, Google, Meta, Mistral, xAI, DeepSeek, Alibaba, Apple, Microsoft, Amazon, Nvidia, startups), et les nouveaux usages marquants (santé, éducation, travail, création, services publics).

Règles :
- Ne retiens que ce qui est daté des dernières 24 à 48 heures. Ignore les rétrospectives et les articles d'opinion sans fait nouveau.
- N'invente rien : chaque élément s'appuie sur une source, avec son lien en Markdown. Si une information n'est pas confirmée, écris « (non confirmé) ».
- Regroupe les articles qui parlent du même sujet en un seul point.
- Pour chaque nouvelle IA : ce que c'est, qui la publie, ce qui change concrètement, comment y accéder (gratuit, payant, open source, API).
- Phrases courtes. Explique un terme technique la première fois qu'il apparaît.
- Omets une section s'il n'y a rien de notable.

Écris le rapport uniquement dans ta réponse finale, sans préambule ni commentaire sur tes recherches, avec exactement cette structure :

# Veille IA du {date}

## L'essentiel
3 à 5 puces : les faits les plus importants du jour.

## Nouvelles IA et modèles
Un point par lancement (nom en gras, éditeur, nouveautés, accès, lien).

## Nouveaux usages
Applications concrètes de l'IA, groupées par domaine (santé, éducation, entreprise, création, vie quotidienne...).

## Recherche et open source
Publications, modèles ouverts et outils pour développeurs.

## Régulation, éthique et société
Lois, procès, sécurité, impact sur l'emploi.

## À tester
2 ou 3 outils ou fonctionnalités qu'on peut essayer dès aujourd'hui, avec le lien.`;

export async function rediger(collecte: Collecte, date: string): Promise<string> {
  const client = new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    { role: "user", content: formaterCollecte(collecte, date) },
  ];

  for (let reprise = 0; reprise <= REPRISES_MAX; reprise++) {
    const reponse = await client.beta.messages
      .stream({
        model: MODELE,
        max_tokens: 64000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: EFFORT },
        system: CONSIGNES.replace("{date}", date),
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: RECHERCHES_MAX }],
        messages,
      })
      .finalMessage();

    if (reponse.stop_reason === "pause_turn") {
      // La recherche web a atteint sa limite d'itérations côté serveur : on relance, elle reprend où elle en était.
      messages.push({ role: "assistant", content: reponse.content });
      continue;
    }
    if (reponse.stop_reason === "refusal") {
      throw new Error(`Rédaction refusée par le modèle (${reponse.stop_details?.category ?? "sans catégorie"}).`);
    }
    if (reponse.stop_reason === "max_tokens") {
      throw new Error("Rapport tronqué : limite de longueur atteinte.");
    }

    const rapport = texteFinal(reponse.content);
    if (!rapport) throw new Error("Le modèle n'a renvoyé aucun texte.");
    return rapport;
  }
  throw new Error(`Recherche web toujours en cours après ${REPRISES_MAX} reprises.`);
}

// Le texte écrit avant ou entre les recherches n'est pas le rapport : on garde ce qui suit la dernière recherche.
function texteFinal(contenu: Anthropic.Beta.BetaContentBlock[]): string {
  const derniereRecherche = contenu.findLastIndex((bloc) => bloc.type === "web_search_tool_result");
  return contenu
    .slice(derniereRecherche + 1)
    .flatMap((bloc) => (bloc.type === "text" ? [bloc.text] : []))
    .join("")
    .trim();
}

function formaterCollecte({ articles, modeles }: Collecte, date: string): string {
  const lignesArticles = articles.map(
    (a) => `- [${a.source}] ${a.titre} (${a.date.toISOString().slice(0, 16)}Z)\n  ${a.lien}\n  ${a.extrait}`,
  );
  const lignesModeles = modeles.map(
    (m) =>
      `- ${m.id} : ${m.tache ?? "tâche inconnue"}, ${m.likes} likes, ${m.telechargements} téléchargements` +
      (m.creeLe ? `, créé le ${m.creeLe.toISOString().slice(0, 10)}` : ""),
  );

  return [
    `Nous sommes le ${date}. Rédige la veille IA du jour.`,
    `## Articles collectés (${articles.length})`,
    lignesArticles.join("\n") || "Aucun article collecté : appuie-toi sur la recherche web.",
    `## Modèles en tendance sur Hugging Face`,
    lignesModeles.join("\n") || "Indisponible.",
  ].join("\n\n");
}
