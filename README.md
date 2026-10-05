# Escape Game IFSI : Alerte Confidentialité

Escape game numérique sur la confidentialité médicale et les réseaux sociaux, pour les étudiants en soins infirmiers (ESI 1re année). Il fonctionne sur téléphone, tablette et ordinateur, directement dans le navigateur.

## Déroulé

1. **Briefing** : l'équipe saisit son nom et lance la mission, ce qui démarre un compte à rebours de 45 minutes.
2. **6 énigmes**, dans l'ordre de son choix. Chacune donne un chiffre :

   | # | Énigme | Chiffre |
   |---|--------|---------|
   | 1 | Story Instagram | 4 |
   | 2 | Puzzle juridique | 2 |
   | 3 | Fil WhatsApp | 8 |
   | 4 | Arbre de décision | 1 |
   | 5 | Ordinateur du poste de soins | 6 |
   | 6 | Vidéo TikTok | 5 |

3. **Cadenas final** : code `428165`.
4. **Débriefing** : temps réalisé, indices utilisés, erreurs, points de droit et fiche imprimable « Les 5 règles d'or ».

La progression et le chrono sont enregistrés dans le navigateur (`localStorage`). Un rafraîchissement de la page ne fait rien perdre. Après 45 minutes, la partie continue en temps additionnel.

## Espace enseignant

Cliquez sur l'icône 🔑 dans l'en-tête, ou sur « Espace enseignant » en bas de l'accueil, pour réinitialiser la partie pour une nouvelle équipe.

- Mot de passe par défaut : `IFSI2026` (majuscules et minuscules indifférentes).
- Pour le modifier, changez `TEACHER_PASSWORD` dans [src/game/config.ts](src/game/config.ts).

La durée, le code final et tous les textes pédagogiques se trouvent dans ce même fichier.

## Développement

```bash
npm install
npm run dev      # serveur de développement
npm run build    # version de production dans dist/
```

Stack : React 19, TypeScript, Vite, Tailwind CSS v4, composants façon shadcn/ui (Radix), Framer Motion, Lucide.

## Structure

```
src/
  game/        config.ts (énigmes, lois, réponses, mot de passe) · GameContext.tsx (état + localStorage)
  components/  Briefing, Header, Dashboard, EnigmaShell, AnswerPanel, FinalLock, Victory, ...
  components/ui/  Button, Card, Dialog
  enigmas/     E1Instagram … E6TikTok
  lib/         sound.ts (Web Audio), utils.ts
```
