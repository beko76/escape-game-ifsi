import type { LucideIcon } from 'lucide-react'
import {
  BookOpenCheck,
  Camera,
  Gavel,
  Hourglass,
  Landmark,
  Megaphone,
  MessageCircle,
  Monitor,
  Network,
  Scale,
  Shield,
  ShieldCheck,
  ShieldOff,
  Signpost,
  Video,
} from 'lucide-react'

export const GAME_DURATION_MS = 60 * 60 * 1000
export const WARNING_THRESHOLD_MS = 5 * 60 * 1000
/** Mot de passe de l'espace enseignant (réinitialisation). À changer ici si besoin. */
export const TEACHER_PASSWORD = 'IFSI2026'
export const STORAGE_KEY = 'escape-ifsi-confidentialite-v2'

export type EnigmaId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

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
    title: "L'Arrière-plan & la Prescription",
    subtitle: 'Une story Instagram qui en dit trop',
    icon: Camera,
    answer: '7',
    hint: "Comptez les patients lisibles sur le tableau et les soignantes photographiées. La prescription d'un délit et la peine de l'Art. 226-13 sont dans la Bibliothèque légale.",
    debrief: {
      law: 'Art. 226-13 CP : 1 an et 15 000 € · Art. 8 CPP : un délit reste poursuivable 6 ans',
      takeaway:
        "Derrière un fou rire, quatre enfants identifiables : prénom, âge, chambre, diagnostic. Et deux collègues photographiées sans leur accord. L'arrière-plan suffit à violer le secret.",
    },
  },
  {
    id: 2,
    title: 'La Matrice Judiciaire',
    subtitle: 'Une vidéo en réanimation, plusieurs procès',
    icon: Scale,
    answer: '3',
    hint: "Ordre judiciaire = tribunaux pénaux et civils. La CNIL et l'IFSI sont des autorités administratives : leurs sanctions ne sont pas prononcées par un juge judiciaire.",
    debrief: {
      law: 'Cumul : Art. 9 C. civ. + Art. 226-13 CP + Art. 226-1 CP',
      takeaway:
        "Un seul geste, plusieurs procédures qui se cumulent : pénale (secret, vie privée), civile (dommages et intérêts), administrative (CNIL) et disciplinaire (IFSI).",
    },
  },
  {
    id: 3,
    title: 'Le Secret Partagé',
    subtitle: 'Un groupe WhatsApp qui en sait trop',
    icon: MessageCircle,
    answer: '9',
    hint: "Le secret partagé ne vaut qu'entre professionnels qui prennent en charge CE patient. Être soignant ou étudiant ne suffit pas.",
    debrief: {
      law: 'Art. L. 1110-4 CSP : secret partagé au sein de l’équipe de soins',
      takeaway:
        "Diplôme et blouse ne donnent aucun droit d'accès. Seule l'équipe qui soigne le patient échange les informations strictement nécessaires, par des outils sécurisés, jamais WhatsApp.",
    },
  },
  {
    id: 4,
    title: 'Le Labyrinthe des Dérogations',
    subtitle: 'Quand la loi permet-elle de lever le secret ?',
    icon: Signpost,
    answer: '2',
    hint: "Seul l'Art. 226-14 du Code pénal autorise la levée du secret : maltraitance d'un mineur, violences conjugales mettant la vie en danger… La demande de la famille n'en fait pas partie.",
    debrief: {
      law: 'Art. 226-14 CP : les dérogations légales au secret',
      takeaway:
        "Lever le secret est une exception prévue par la loi : protéger un enfant maltraité, une victime en danger immédiat. Adultère, refus de soins, inquiétude des proches : le secret demeure.",
    },
  },
  {
    id: 5,
    title: 'La Session du Tuteur',
    subtitle: 'Cybersécurité & dossier patient informatisé',
    icon: Monitor,
    answer: '8',
    hint: "Identifiants et carte CPS sont personnels, chaque connexion est tracée, et un ESI n'ouvre que les dossiers des patients qu'il prend en charge.",
    debrief: {
      law: 'Art. L. 1110-4 CSP & politique de sécurité des SI de santé',
      takeaway:
        "Une session = une personne. On ne prête ni mot de passe ni CPS, on ne consulte que les dossiers de ses patients. Tout est tracé : la curiosité est une faute.",
    },
  },
  {
    id: 6,
    title: 'Le Tribunal Administratif',
    subtitle: 'Un ESI exclu conteste sa sanction',
    icon: Gavel,
    answer: '4',
    hint: "Relisez la synthèse du guide MACSF : compte « privé », absence de nom, « mes propos n'engagent que moi »… Et le secret s'applique-t-il aux étudiants ?",
    debrief: {
      law: 'Exclusion d’un ESI : décision administrative contrôlée par le tribunal administratif',
      takeaway:
        "Compte privé, aucun nom cité, avertissement en bio, statut d'étudiant : aucune de ces excuses ne tient. Le secret s'impose dès le premier jour de stage.",
    },
  },
  {
    id: 7,
    title: 'La Crise sur Facebook',
    subtitle: 'Une photo de pause devient virale',
    icon: Megaphone,
    answer: '7',
    hint: "Guide MACSF : « J'évite de prendre la parole au nom de mon établissement ». Qui doit décider d'une réponse ? Et avec qui en parler ?",
    debrief: {
      law: 'Guide MACSF : je n’engage pas l’établissement, j’alerte ma hiérarchie',
      takeaway:
        "Face à une attaque en ligne, on ne répond pas, on ne partage pas, on ne se justifie pas : on alerte sa hiérarchie et la communication, et on en parle en équipe.",
    },
  },
  {
    id: 8,
    title: "L'Audit de Viralité",
    subtitle: 'Vrai ou faux ? Le guide MACSF à l’épreuve',
    icon: Network,
    answer: '3',
    hint: "Le guide tient en une phrase : « C'est sur le web, c'est donc public ». Les soignants ont eux aussi un droit à l'image.",
    debrief: {
      law: 'Guide MACSF & Art. 9 C. civ. : « Parler sur un réseau, c’est parler au micro dans un stade »',
      takeaway:
        "Un profil privé ne le reste pas, un message échappe à son auteur, un prénom changé ne protège personne, et filmer un soignant sans son accord est une faute.",
    },
  },
]

/** Code du cadenas : les chiffres des énigmes, dans l'ordre (73928473). */
export const FINAL_CODE = ENIGMAS.map((e) => e.answer).join('')

export interface LawArticle {
  ref: string
  title: string
  icon: LucideIcon
  summary: string
  points: string[]
  group: 'loi' | 'guide'
}

export const LAWS: LawArticle[] = [
  {
    group: 'loi',
    ref: 'Art. L. 1110-4 CSP',
    title: 'Secret professionnel & secret partagé',
    icon: Shield,
    summary: 'Code de la santé publique',
    points: [
      'Toute personne prise en charge a droit au respect de sa vie privée et au secret des informations la concernant.',
      "Le secret couvre tout ce qui est venu à la connaissance du professionnel : ce qu'on lui a confié, mais aussi ce qu'il a vu, entendu ou compris.",
      "Il s'impose à tous les professionnels intervenant dans le système de santé, y compris les étudiants en stage.",
      "Secret partagé : des professionnels peuvent échanger des informations sur une même personne à condition de participer tous à sa prise en charge, et seulement pour les informations strictement nécessaires à la continuité ou à la coordination des soins.",
      "En cas de diagnostic grave, la famille peut recevoir les informations nécessaires pour soutenir le patient, sauf opposition de sa part.",
    ],
  },
  {
    group: 'loi',
    ref: 'Art. 226-13 Code pénal',
    title: 'Violation du secret',
    icon: Gavel,
    summary: 'Sanction pénale',
    points: [
      "La révélation d'une information à caractère secret par une personne qui en est dépositaire est punie de :",
      '1 an d’emprisonnement et 15 000 € d’amende.',
      "S'ajoutent des sanctions disciplinaires (IFSI, employeur, Ordre infirmier) et civiles (dommages et intérêts).",
    ],
  },
  {
    group: 'loi',
    ref: 'Art. 226-14 Code pénal',
    title: 'Dérogations légales au secret',
    icon: ShieldOff,
    summary: 'Les seuls cas où la loi permet de lever le secret',
    points: [
      "L'Art. 226-13 ne s'applique pas lorsque la loi impose ou autorise la révélation du secret. Notamment :",
      '1° Informer les autorités judiciaires, médicales ou administratives de privations ou de sévices infligés à un mineur ou à une personne qui n’est pas en mesure de se protéger.',
      '2° Le médecin qui, avec l’accord de la victime, signale au procureur des sévices ou violences constatés (accord non nécessaire pour un mineur ou une personne vulnérable).',
      '3° Le médecin ou tout professionnel de santé qui signale au procureur des violences au sein du couple mettant la vie de la victime en danger immédiat, en s’efforçant d’obtenir son accord ou, à défaut, en l’informant.',
      'Hors de ces cas (curiosité des proches, vie privée, refus de soins…), le secret demeure.',
    ],
  },
  {
    group: 'loi',
    ref: 'Art. 9 Code civil',
    title: "Droit à l'image & vie privée",
    icon: Camera,
    summary: 'Code civil · action devant le juge civil',
    points: [
      'Chacun a droit au respect de sa vie privée.',
      "Capter ou diffuser l'image d'une personne nécessite son consentement préalable, écrit et spécifique.",
      'Patients, collègues, visiteurs : tous sont concernés, y compris en arrière-plan. Les soignants aussi ont un droit à l’image.',
      'La victime peut obtenir des dommages et intérêts devant le tribunal judiciaire.',
    ],
  },
  {
    group: 'loi',
    ref: 'Art. 226-1 Code pénal',
    title: "Atteinte à l'intimité de la vie privée",
    icon: Video,
    summary: 'Sanction pénale',
    points: [
      "Fixer, enregistrer ou transmettre sans son consentement l'image d'une personne se trouvant dans un lieu privé est un délit.",
      'Une chambre d’hôpital est un lieu privé pour le patient qui l’occupe.',
      '1 an d’emprisonnement et 45 000 € d’amende.',
    ],
  },
  {
    group: 'loi',
    ref: 'RGPD / CNIL',
    title: 'Données de santé & identification indirecte',
    icon: ShieldCheck,
    summary: 'Règlement européen 2016/679',
    points: [
      'Les données de santé sont des données « sensibles » : leur traitement est strictement encadré.',
      'Une personne est identifiable même sans son nom : numéro de chambre, âge, fonction, lieu, date, signe distinctif…',
      'Stockage et échanges uniquement sur des outils validés par l’établissement (pas de cloud, messagerie grand public ou clé USB perso).',
      'En cas de manquement, la CNIL, autorité administrative indépendante, peut prononcer des amendes administratives.',
    ],
  },
  {
    group: 'loi',
    ref: 'Sécurité du SI de santé',
    title: 'DPI, identifiants & carte CPS',
    icon: Monitor,
    summary: 'Politique de sécurité de l’établissement',
    points: [
      'Identifiants, mots de passe et carte CPS sont strictement personnels : ils ne se prêtent jamais, même à la demande d’un tuteur.',
      'Tout acte réalisé sous une session est attribué à son titulaire, qui en porte la responsabilité.',
      'Chaque accès au dossier patient informatisé est tracé (qui, quel dossier, quand) et peut être contrôlé.',
      'On ne consulte que les dossiers des patients que l’on prend en charge. On verrouille sa session dès qu’on s’éloigne.',
    ],
  },
  {
    group: 'loi',
    ref: 'Art. 8 Code de procédure pénale',
    title: 'Prescription des délits',
    icon: Hourglass,
    summary: 'Délai pour engager des poursuites',
    points: [
      "L'action publique des délits se prescrit par 6 années révolues à compter du jour où l'infraction a été commise.",
      'La violation du secret professionnel est un délit : son auteur peut être poursuivi pendant 6 ans.',
    ],
  },
  {
    group: 'loi',
    ref: 'Ordres de juridiction',
    title: 'Judiciaire ou administratif ?',
    icon: Landmark,
    summary: 'Qui sanctionne quoi',
    points: [
      'Ordre judiciaire : juridictions pénales (le tribunal correctionnel juge les délits) et civiles (le tribunal judiciaire accorde des dommages et intérêts).',
      'Autorités et juridictions administratives : la CNIL (amendes RGPD), l’IFSI (sanctions disciplinaires prononcées par le directeur après avis de la section disciplinaire), le tribunal administratif (recours contre ces décisions).',
      'Pour un même fait, ces procédures peuvent se cumuler.',
    ],
  },
  {
    group: 'guide',
    ref: 'Guide MACSF',
    title: 'Bonnes pratiques des réseaux sociaux',
    icon: BookOpenCheck,
    summary: 'Synthèse du guide de la Fondation MACSF',
    points: [
      '« C’est sur le web, c’est donc public. » Un message se diffuse sans contrôle : amis d’amis, anciens amis, inconnus.',
      '« Ces propos n’engagent que moi » ne protège rien : les internautes font le lien avec l’établissement et les collègues.',
      'Paramètres de confidentialité : à vérifier régulièrement. Certains réseaux les modifient (parfois tous les 6 mois) : un profil privé peut devenir public.',
      'Géolocalisation : à utiliser avec prudence, elle indique où vous êtes et à quel moment précis.',
      'Changer le nom d’un patient n’empêche pas qu’il ou sa famille se reconnaisse. Attention aux arrière-plans des photos prises dans les services.',
      'Critiques ou fausses informations sur l’établissement : j’évite de répondre directement. J’informe ma hiérarchie et/ou la direction de la communication, qui décide d’une éventuelle réponse.',
      'Le bon réflexe : en parler à ses proches ou dans son service, pour alerter sur les conséquences.',
      'Un patient qui filme le passage des personnels et diffuse la vidéo porte atteinte à leur droit à l’image : l’hôpital peut porter plainte.',
    ],
  },
]

export const GOLDEN_RULES: { title: string; text: string }[] = [
  {
    title: 'Aucune photo, vidéo ou enregistrement en lieu de soins',
    text: "Même sans patient visible : un tableau, un écran ou un collègue en arrière-plan suffit à violer le secret et le droit à l'image.",
  },
  {
    title: "C'est sur le web, c'est donc public",
    text: 'Groupe privé, story éphémère, compte « privé » : tout se capture et échappe à son auteur. Je vérifie mes paramètres et je coupe la géolocalisation.',
  },
  {
    title: "Le secret ne se partage qu'avec l'équipe qui soigne",
    text: 'Uniquement les informations nécessaires, par les outils sécurisés. Un prénom changé ou « ces propos n’engagent que moi » ne protègent personne.',
  },
  {
    title: 'Mes identifiants sont à moi seul',
    text: 'Session, mot de passe et CPS ne se prêtent pas. Je ne consulte que les dossiers de mes patients : chaque accès est tracé.',
  },
  {
    title: "En cas de crise en ligne, je ne réponds pas : j'alerte",
    text: 'Ma hiérarchie et la direction de la communication décident d’une réponse. J’en parle en équipe, je ne partage pas.',
  },
]
