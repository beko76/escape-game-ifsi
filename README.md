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

## Tableau de bord enseignant (suivi en direct)

Adresse : `…/#/prof`. On y accède aussi par l'icône 🔑, puis « Ouvrir le tableau de bord enseignant ». Il est protégé par le mot de passe enseignant.

1. Créez une **séance**. Un code (ex. `3F23S`), un lien et un QR code s'affichent, à projeter.
2. Les équipes scannent le QR code, ou saisissent le code avec leur nom d'équipe sur l'écran d'accueil.
3. Le tableau se met à jour en temps réel :
   - énigmes résolues et énigme en cours ;
   - chrono et temps restant ;
   - indices et erreurs ;
   - dernière activité, et équipes « déconnectées ? » après 90 s sans signal ;
   - classement (équipes terminées par temps, puis par avancement).
4. Le bouton plein écran sert à projeter le classement. Le bouton 🗑 retire une équipe du tableau.

Sans code de séance, la partie fonctionne normalement mais n'apparaît pas au tableau de bord.

### Mise en place (une seule fois)

Le suivi utilise [Supabase](https://supabase.com), avec l'offre gratuite.

1. Créez un compte et un projet sur supabase.com. La région Europe (Paris ou Francfort) est conseillée.
2. Ouvrez **SQL Editor**, collez le contenu de [supabase/migrations/20261005000000_suivi_equipes.sql](supabase/migrations/20261005000000_suivi_equipes.sql), puis cliquez sur **Run**.
3. Dans **Project Settings → API**, copiez la *Project URL* et la clé publique *anon*.
4. Créez un fichier `.env` à la racine du projet :

   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

   La clé *anon* est publique par nature : elle peut être commitée, l'accès étant limité par les règles de la base.

Sans ces variables, l'application fonctionne entièrement hors ligne, sans suivi.

**Données stockées :** noms d'équipe et progression de jeu uniquement, sans aucune donnée personnelle. Toute personne disposant de l'application peut techniquement lire ou modifier ces données, ce qui est acceptable pour un jeu pédagogique.

**Développement local :** `npx supabase start` lance une base locale (Docker requis) sur le port 55321. Mettez ses URL et clé dans `.env.local`.

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
  online/      client Supabase · useProgressSync (envoi de la progression)
  teacher/     tableau de bord enseignant (séances, QR code, suivi en direct)
public/
  videos/tiktok-esi.mp4   vidéo de l'énigme 6 (remplaçable par un autre fichier du même nom)
```
