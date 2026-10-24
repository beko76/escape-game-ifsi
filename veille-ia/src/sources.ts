// Sources lues chaque jour par l'agent. Ajoutez ou retirez des flux ici :
// tout flux RSS ou Atom fonctionne.

export interface SourceFlux {
  nom: string;
  url: string;
  // Pour les flux généralistes : ne garder que les articles qui parlent d'IA.
  filtrerSurIA?: boolean;
}

export const FLUX: SourceFlux[] = [
  // Laboratoires et éditeurs
  { nom: "OpenAI", url: "https://openai.com/news/rss.xml" },
  { nom: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml" },
  { nom: "Google AI", url: "https://blog.google/technology/ai/rss/" },
  { nom: "Hugging Face", url: "https://huggingface.co/blog/feed.xml" },

  // Presse tech anglophone
  { nom: "TechCrunch IA", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { nom: "The Verge IA", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml" },
  { nom: "VentureBeat IA", url: "https://venturebeat.com/category/ai/feed/" },
  { nom: "MIT Technology Review", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed" },
  { nom: "Ars Technica IA", url: "https://arstechnica.com/ai/feed/" },

  // Presse francophone
  { nom: "ActuIA", url: "https://www.actuia.com/feed/" },
  { nom: "Numerama", url: "https://www.numerama.com/feed/", filtrerSurIA: true },
  { nom: "Siècle Digital", url: "https://siecledigital.fr/feed/", filtrerSurIA: true },

  // Communauté
  { nom: "Hacker News", url: "https://hnrss.org/frontpage?points=100", filtrerSurIA: true },
];

// Modèles qui montent sur Hugging Face : le meilleur signal pour les nouvelles IA open source.
export const HUGGING_FACE_TENDANCES =
  "https://huggingface.co/api/models?sort=trendingScore&limit=20";

// Sigles comparés en respectant la casse : « ai » minuscule est un mot courant en français (« j'ai »).
const SIGLES_IA = ["IA", "I.A.", "AI", "A.I.", "LLM", "LLMs", "AGI"];

const MOTS_CLES_IA = [
  "intelligence artificielle", "artificial intelligence", "gpt", "chatgpt", "openai",
  "anthropic", "claude", "gemini", "mistral", "llama", "deepseek", "copilot", "grok",
  "perplexity", "hugging face", "machine learning", "apprentissage automatique",
  "deep learning", "réseau de neurones", "neural network", "chatbot", "génératif",
  "générative", "generative", "midjourney", "sora", "nvidia",
];

const motif = (mots: string[], options: string) =>
  new RegExp(
    `(^|[^\\p{L}\\p{N}])(${mots.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?=$|[^\\p{L}\\p{N}])`,
    options,
  );

const MOTIF_SIGLES = motif(SIGLES_IA, "u");
const MOTIF_MOTS = motif(MOTS_CLES_IA, "iu");

export function parleDIA(texte: string): boolean {
  return MOTIF_SIGLES.test(texte) || MOTIF_MOTS.test(texte);
}
