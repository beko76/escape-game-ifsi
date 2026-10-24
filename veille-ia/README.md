# Veille IA quotidienne

Chaque matin, un agent lit l'actualité de l'IA et rédige en français un résumé des nouveautés du jour : nouveaux modèles et outils, nouveaux usages, recherche, régulation, et deux ou trois outils à tester.

## Fonctionnement

1. **Collecte** ([src/collecte.ts](src/collecte.ts)) : lecture des flux RSS des laboratoires (OpenAI, Google DeepMind, Hugging Face…), de la presse tech anglophone et francophone et de Hacker News. L'agent garde les articles des dernières 26 heures. Il récupère aussi les modèles en tendance sur Hugging Face.
2. **Rédaction** ([src/redaction.ts](src/redaction.ts)) : Claude reçoit ces articles. Il complète avec la **recherche web** pour vérifier les annonces importantes et trouver les lancements qui manquent. Il regroupe les doublons, puis rédige la synthèse avec un lien vers chaque source.
3. **Diffusion** ([.github/workflows/veille-ia.yml](../.github/workflows/veille-ia.yml)) : chaque jour à 6 h 13 (heure de Paris en hiver), GitHub Actions lance l'agent, enregistre le rapport dans [rapports/](rapports/) et l'ouvre en **issue** GitHub. Vous recevez la notification par e-mail.

Une source injoignable n'interrompt pas la veille : elle est signalée en bas du rapport.

## Mise en route

1. Créez une clé API sur [platform.claude.com](https://platform.claude.com/settings/keys).
2. Sur GitHub, dans *Settings → Secrets and variables → Actions*, ajoutez un secret `ANTHROPIC_API_KEY` contenant cette clé.
3. Fusionnez ce dossier et le workflow sur `main` : GitHub n'exécute les tâches planifiées que depuis la branche par défaut.
4. Pour un premier essai sans attendre le lendemain : onglet *Actions → Veille IA quotidienne → Run workflow*.

Pour recevoir les e-mails, vous devez suivre le dépôt (*Watch*) avec au moins l'option « Issues » cochée. C'est le cas par défaut pour le propriétaire du dépôt.

## En local

Node 22.18 ou plus récent :

```bash
cd veille-ia
npm install
npm run collecte                         # liste les articles trouvés, sans appeler Claude
ANTHROPIC_API_KEY=sk-ant-... npm start   # écrit rapports/AAAA-MM-JJ.md
```

## Personnaliser

| Quoi | Où |
|---|---|
| Ajouter ou retirer des sources (tout flux RSS ou Atom) | `FLUX` dans [src/sources.ts](src/sources.ts) |
| Mots-clés du filtre IA pour les flux généralistes | `SIGLES_IA` et `MOTS_CLES_IA` dans [src/sources.ts](src/sources.ts) |
| Plan du rapport, ton, public visé, sujets à surveiller | `CONSIGNES` dans [src/redaction.ts](src/redaction.ts) |
| Heure d'exécution | `cron` dans [.github/workflows/veille-ia.yml](../.github/workflows/veille-ia.yml) (heure UTC) |

Variables d'environnement facultatives :

| Variable | Défaut | Rôle |
|---|---|---|
| `VEILLE_FENETRE_HEURES` | `26` | Ancienneté maximale des articles collectés |
| `VEILLE_RECHERCHES_MAX` | `12` | Nombre maximal de recherches web par rapport |
| `VEILLE_EFFORT` | `medium` | Profondeur de réflexion de Claude (`low`, `medium`, `high`) |
| `VEILLE_MODELE` | `claude-opus-5-5` | Modèle utilisé |

## Coût

Estimation : 0,50 à 1 $ par rapport, soit 15 à 30 $ par mois. Le prix dépend du nombre d'articles lus et de recherches web effectuées (12 au maximum). Pour réduire la facture, passez `VEILLE_EFFORT` à `low` ou baissez `VEILLE_RECHERCHES_MAX`.
