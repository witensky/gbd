import { LoveStoryConfig } from '../types';

import crusto from '../assets/images/crusto.jpg';
import romanticMoment1 from '../assets/images/romantic_moment_1_1785561712534.jpg';
import romanticMoment2 from '../assets/images/romantic_moment_2_1785561724595.jpg';
import romanticMoment3 from '../assets/images/romantic_moment_3_1785561737159.jpg';

export const DEFAULT_LOVE_STORY: LoveStoryConfig = {
  recipientName: "Beverlie",
  senderName: "Witensky J.",
  introTitle: "Une chose spéciale pour toi ma Beverlie, pour ce jour.. ❤️",
  introSubtitle: "Un voyage à travers nos sentiments, et tout ce que tu représentes pour moi.",
  
  declarations: [
    {
      id: "decl-1",
      title: "Premye Fwa",
      content: "Premye fwa mwen te wè w, mwen te reyalize ke lavi m patap menm jan. ou pote lakay mwen yon  santiman ke m t ap chèche. Ou chanje fason mwen te konn panse e fason mwen te konn aji, mwen etone paske mwen pat atann ak efè sa.",
      subtext: "Yon moman ki grave nan memwa mwen pou tout tan",
      category: "first_sight",
      icon: "✨"
    },
    {
      id: "decl-2",
      title: "Ce Que Tu Es Pour Moi",
      content: "Tu es ce que je desire, mon éclat de rire spontané, ma confidente la plus chère et mon plus beau rêve éveillé.",
      subtext: "Chaque seconde pensée à toi est un trésor que je chéris profondément.",
      category: "feeling",
      icon: "🌹"
    },
    {
      id: "decl-3",
      title: "Ton Sourire",
      content: "Il suffit d'un seul de tes sourires pour me sentir bien. Ta présence m'apporte un confort d'une façon indescriptible.",
      subtext: "La plus belle des mélodies",
      category: "daily",
      icon: "💖"
    },
    {
      id: "decl-4",
      title: "Notre Futur",
      content: "J'aime imaginer tous les chapitres que nous n'avons pas encore écrits. Notre rétrouvaille, les rires complices, les matins tranquilles et toutes nos aventures à venir.",
      subtext: "Ensemble vers demain",
      category: "future",
      icon: "🕊️"
    }
  ],

  photos: [
    {
      id: "photo-1",
      url: romanticMoment1,
      title: "Moman silans nou yo",
      date: "2026",
      location: "Haiti - Maroc",
      caption: "Moman silans nou yo pa vle di absans lanmou, ni mank atansyon. lè moman sa yo rive n ap eseye aprann de yo pou n revin atache ankò plis, pou n sipòte lòt chak jou e avanse ansanm.",
      rotation: -3
    },
    {
      id: "photo-2",
      url: romanticMoment2,
      title: "Yon chokola myèl",
      date: "2026",
      location: "Haiti - Maroc",
      caption: "Yon bote ki bay lanati gou myèl, Mwen poko goute w men po bouch ou te gentan banm yon apèsi, ou pa sèlman sa w ye a, ou se tout valè elegans pa genyen, ou jid espesyal.",
      rotation: 4
    },
    {
      id: "photo-3",
      url: romanticMoment3,
      title: "Sous le soleil",
      date: "Une journée magique",
      location: "Haiti - Maroc",
      caption: "Il  y a une journée parmi les plus belles que nous avons vécues, où le ciel ensoleillé semblait refléter la lumière de ton âme, une journée qui m'est jusqu'ici inoubliable.",
      rotation: -2
    },
    {
      id: "photo-4",
      url: crusto,
      title: "Lettres & Cœurs",
      date: "Tous les jours",
      location: "Dans nos pensées",
      caption: "Chaque petit détail me rappelle à quel point tu es précieuse. et je suis pret à façonner un amour unique, un amour qui nous ressemble et qui nous unit pour toujours.",
      rotation: 3
    }
  ],

  memories: [
    {
      id: "mem-1",
      title: "Notre premier fou rire",
      date: "Jour 1",
      description: "Ce moment où nous avons ri jusqu'en avoir mal au ventre pour presque rien.",
      icon: "😄"
    },
    {
      id: "mem-2",
      title: "Le premier 'Je t'aime'",
      date: "Un soir de douceur",
      description: "Des mots chuchotés avec émotion qui risonnaient encore longuement.",
      icon: "❤️"
    },
    {
      id: "mem-3",
      title: "Notre première promenade sous la pluie",
      date: "Automne",
      description: "Un seul parapluie pour deux, serrés l'un contre l'autre.",
      icon: "🌧️"
    }
  ],

  loveLetter: `Ma p'tite Bev,

Mon cœur bat un peu plus vite chaque fois que je pense à nous.

Ces derniers temps, je m'inquiète beaucoup pour l'avenir. Je n'aime pas les surprises, parce que je ne sais jamais ce que demain nous réserve. Cette incertitude fait naître en moi de nombreuses questions, et parmi elles, une revient sans cesse : **qu'est-ce qui nous arrive ?**

C'est une question à laquelle j'essaie de répondre depuis longtemps. Je cherche des explications, je cherche à comprendre, mais plus je réfléchis, plus mes doutes et mes angoisses grandissent.

Il m'arrive de tout arrêter : de réfléchir, d'imaginer, d'agir, de vouloir comprendre à tout prix. J'essaie simplement de retrouver un peu de paix, cette paix qui me permettrait de voir les choses avec plus de clarté.

J'ai imaginé mille scénarios. J'ai analysé les moindres détails, chaque parole, chaque silence, chaque instant partagé. Tout cela dans l'espoir de trouver une réponse...

Aujourd'hui, je veux te dire une chose.

Tu es devenue une personne extrêmement importante dans ma vie. Plus le temps passe, plus mon admiration pour toi grandit. J'admire ta personne, ta façon d'être, ta force, tes qualités et tout ce qui fait de toi la femme que tu es.

Je sais que je suis loin d'être parfait. Je fais des erreurs, je doute parfois, je ne trouve pas toujours les bons mots, j'agis pas souvent comme tu le veux. Mais une chose est certaine : les sentiments que j'ai pour toi sont authentiques.

Je ne veux pas seulement  t'évaluer avec des paroles. Je veux que mes actes te considèrent. Je veux être l'homme qui te rassure lorsque tu en as besoin ce qui n'est pas le cas pour le moment, je veux celui qui te soutient dans les moments difficiles, celui qui célèbre chacune de tes réussites et qui marche à tes côtés, quelles que soient les épreuves.

Beverlie, tu sais que je ne suis pas quelqu'un qui parle beaucoup. J'ai souvent du mal à exprimer tout ce que je ressens. Pourtant, aujourd'hui, je veux que tu saches une chose.

Je veux faire ce que tu attends de moi.

Je veux agir de manière à ce que tu sois fière du soutiens que tu recois. Je veux être un homme sur qui tu peux compter, un homme dont les paroles ont de la valeur parce qu'elles sont suivies d'actions.

Je ne sais pas de quoi demain sera fait. Je ne peux pas promettre que notre chemin sera toujours facile. Il y aura toujours des moments de doute, des incompréhensions et des obstacles. Mais ce que je veux, c'est de ne jamais cesser de faire des efforts pour nous, de continuer à te choisir et de protéger ce que nous construisons ensemble.

Si j'écris cette lettre, ce n'est pas parce que j'ai toutes les réponses. C'est parce que je refuse de laisser les non-dits prendre la place de ce que je ressens vraiment.

Je t'aime profondément. Et malgré mes peurs, malgré mes doutes et toutes les incertitudes, une seule certitude demeure dans mon cœur : je veux avancer avec toi en couple ou pas, je veux te voir heureuse, te voir grandir et construire quelque chose de beau, de vrai et de durable.



Avec tout mon amour et ma passion,
Jose ❤️`,

  finalQuestion: "En ce jour spécial, dis-moi une chose que tu désires et moi je l'exauce en l'appliquant ✨",
  quizQuestions: [],
};

const STORAGE_KEY = 'love_story_config_v1';

export function getLoveStoryConfig(): LoveStoryConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_LOVE_STORY, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.error("Failed to load love story config", err);
  }
  return DEFAULT_LOVE_STORY;
}
