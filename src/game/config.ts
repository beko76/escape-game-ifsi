import type { LucideIcon } from 'lucide-react'
import { Camera, Gavel, Lightbulb, MessageCircle, Monitor, Music2, Scale, Shield, ShieldCheck } from 'lucide-react'

export const GAME_DURATION_MS = 45 * 60 * 1000
export const WARNING_THRESHOLD_MS = 5 * 60 * 1000
export const FINAL_CODE = '428165'
/** Mot de passe de l'espace enseignant (réinitialisation). À changer ici si besoin. */
export const TEACHER_PASSWORD = 'IFSI2026'
export const STORAGE_KEY = 'escape-ifsi-confidentialite-v1'

export type EnigmaId = 1 | 2 | 3 | 4 | 5 | 6

export interface EnigmaMeta {
  id: EnigmaId
  title: string
  subtitle: string
  icon: LucideIcon
  answer: string
  hint: string
  /** Point de droit rappelé au débriefing */
  debrief: { law: string; takeaway: string }
}

export const ENIGMAS: EnigmaMeta[] = [
  {
    id: 1,
    title: 'La Story Instagram',
    subtitle: 'Une pause café qui en dit trop',
    icon: Camera,
    answer: '4',
    hint: "Comptez les chambres lisibles sur le tableau en arrière-plan, puis ouvrez la Fiche Législation pour la peine de l'Art. 226-13.",
    debrief: {
      law: 'Art. 226-13 Code pénal : 1 an d’emprisonnement et 15 000 € d’amende',
      takeaway:
        "Un arrière-plan suffit à violer le secret professionnel : tableau, écran, dossier, bracelet… On ne photographie jamais dans un lieu de soins.",
    },
  },
  {
    id: 2,
    title: 'Le Puzzle Juridique',
    subtitle: 'Associez chaque situation à son texte',
    icon: Scale,
    answer: '2',
    hint: "Une photo concerne d'abord l'image de la personne : quel code protège la vie privée et l'image ?",
    debrief: {
      law: 'Art. 9 Code civil : droit au respect de la vie privée et à l’image',
      takeaway:
        "Photo de patient = consentement écrit, éclairé et spécifique obligatoire. Diagnostic divulgué = secret professionnel. Cloud perso = RGPD.",
    },
  },
  {
    id: 3,
    title: 'Le Fil WhatsApp',
    subtitle: 'Une conversation de promo qui dérape',
    icon: MessageCircle,
    answer: '8',
    hint: "Une donnée identifiante n'est pas forcément un nom : fonction, adresse, numéro de chambre… Qui en a donné ?",
    debrief: {
      law: 'RGPD / CNIL : l’identification indirecte est une divulgation',
      takeaway:
        "« La dame de la 204, ancienne maire » : pas de nom, mais tout le village la reconnaît. Un groupe privé reste un écrit diffusable.",
    },
  },
  {
    id: 4,
    title: "L'Arbre de Décision",
    subtitle: 'Deux dilemmes, une seule bonne route',
    icon: Lightbulb,
    answer: '1',
    hint: 'Relation soignant-soigné = distance professionnelle. Et on ne pose jamais de diagnostic à distance sur une photo.',
    debrief: {
      law: 'Art. R. 4312-25 CSP : relation de soin & distance professionnelle',
      takeaway:
        "On refuse poliment les demandes d'amis de patients. On ne fait pas de « télé-diagnostic » par SMS : on oriente vers un médecin.",
    },
  },
  {
    id: 5,
    title: "L'Ordinateur du Poste de Soins",
    subtitle: 'Inspectez la scène',
    icon: Monitor,
    answer: '6',
    hint: "Regardez l'écran, le lecteur de carte, le bord de l'écran, les ports USB et… ce que voient les gens dans le couloir.",
    debrief: {
      law: 'Art. L. 1110-4 CSP & sécurité des SI de santé (Politique Générale de Sécurité)',
      takeaway:
        "Je verrouille ma session (Windows + L), je retire ma CPS, je ne note jamais mes mots de passe, je n'utilise pas de clé USB perso.",
    },
  },
  {
    id: 6,
    title: 'La Vidéo TikTok',
    subtitle: 'Le buzz qui fait tache',
    icon: Music2,
    answer: '5',
    hint: "Mettez la vidéo en pause et observez : la tenue, le logo, les panneaux, les numéros, le chariot… et l'image que la vidéo donne de la profession.",
    debrief: {
      law: 'Art. R. 4312-4 & R. 4312-6 CSP : dignité et image de la profession',
      takeaway:
        "La tenue n'est pas un costume. Logo IFPM, « service de chirurgie », chambre 210 et dossier « Mme DURAND » à l'écran : l'institut, le service et une patiente deviennent identifiables.",
    },
  },
]

export interface LawArticle {
  ref: string
  title: string
  icon: LucideIcon
  summary: string
  points: string[]
}

export const LAWS: LawArticle[] = [
  {
    ref: 'Art. L. 1110-4 CSP',
    title: 'Secret professionnel',
    icon: Shield,
    summary: 'Code de la santé publique',
    points: [
      'Toute personne prise en charge a droit au respect de sa vie privée et au secret des informations la concernant.',
      "Le secret couvre l'ensemble des informations venues à la connaissance du professionnel (ce qu'on lui a confié, mais aussi ce qu'il a vu, entendu ou compris).",
      "Il s'impose à tous les professionnels intervenant dans le système de santé, y compris les étudiants en stage.",
    ],
  },
  {
    ref: 'Art. 226-13 Code pénal',
    title: 'Violation du secret',
    icon: Gavel,
    summary: 'Sanction pénale',
    points: [
      "La révélation d'une information à caractère secret par une personne qui en est dépositaire est punie de :",
      '1 an d’emprisonnement et 15 000 € d’amende.',
      "S'ajoutent possibles sanctions disciplinaires (IFSI, employeur, Ordre infirmier) et civiles (dommages et intérêts).",
    ],
  },
  {
    ref: 'Art. 9 Code civil',
    title: "Droit à l'image & vie privée",
    icon: Camera,
    summary: 'Code civil',
    points: [
      'Chacun a droit au respect de sa vie privée.',
      "Toute captation ou diffusion de l'image d'une personne nécessite son consentement préalable, écrit et spécifique.",
      'Un patient, un collègue ou un visiteur en arrière-plan sont concernés.',
    ],
  },
  {
    ref: 'RGPD / CNIL',
    title: 'Données de santé & identification indirecte',
    icon: ShieldCheck,
    summary: 'Règlement européen 2016/679',
    points: [
      'Les données de santé sont des données « sensibles » : leur traitement est strictement encadré.',
      "Une personne est identifiable même sans son nom : numéro de chambre, fonction, lieu, date, signe distinctif…",
      'Stockage uniquement sur des outils validés par l’établissement (pas de cloud, messagerie ou clé USB perso).',
    ],
  },
]

export const GOLDEN_RULES: { title: string; text: string }[] = [
  {
    title: 'Aucune photo, vidéo ou enregistrement en lieu de soins',
    text: 'Même sans patient visible : un tableau, un écran ou un dossier en arrière-plan suffit à violer le secret.',
  },
  {
    title: 'Aucune information patient sur les réseaux ou messageries',
    text: 'Groupe privé, story éphémère, message « entre nous »… tout écrit peut être capturé et diffusé.',
  },
  {
    title: "Attention à l'identification indirecte",
    text: 'Une chambre, une fonction, une commune ou une date permettent de reconnaître quelqu’un sans son nom.',
  },
  {
    title: 'Distance professionnelle en ligne',
    text: "Je n'accepte pas de patients ou de familles en « amis ». Je ne donne pas d'avis médical à distance.",
  },
  {
    title: 'Je protège les outils et mon image professionnelle',
    text: 'Session verrouillée, CPS retirée, mots de passe secrets. Ma tenue et le matériel de soins ne sont pas des accessoires de mise en scène.',
  },
]
