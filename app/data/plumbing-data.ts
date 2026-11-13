export type ServiceCategory = "todos" | "urgencias" | "bano" | "climatizacion";

export type ServiceIconKey =
  | "droplets"
  | "wrench"
  | "shower"
  | "flame"
  | "gauge"
  | "hammer";

export interface PlumbingService {
  id: string;
  code: string;
  title: string;
  category: Exclude<ServiceCategory, "todos">;
  categoryLabel: string;
  icon: ServiceIconKey;
  summary: string;
  scope: string;
  points: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProjectItem {
  id: string;
  code: string;
  title: string;
  titleLead: string;
  titleAccent: string;
  category: Exclude<ServiceCategory, "todos">;
  categoryLabel: string;
  locationLabel: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
}

export const CLIENT_INFO = {
  name: "Sergio Fustero",
  trade: "Fontanería y reformas",
  phoneDisplay: "635 55 91 62",
  phoneRaw: "+34635559162",
  phoneHref: "tel:+34635559162",
  whatsappNumber: "34635559162",
  rating: "4,9",
  ratingNumber: 4.9,
  reviewCount: 77,
  closingHour: "19:00",
  scheduleLabel: "Abierto · Cierre: 19:00",
} as const;

export const SERVICE_CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "urgencias", label: "Averías y fugas" },
  { id: "bano", label: "Baño y cocina" },
  { id: "climatizacion", label: "Agua y calor" },
];

export const SERVICES: PlumbingService[] = [
  {
    id: "fugas-humedades",
    code: "01",
    title: "Localización y reparación de fugas",
    category: "urgencias",
    categoryLabel: "Averías y fugas",
    icon: "droplets",
    summary:
      "Detección precisa de pérdidas en tuberías vistas o empotradas, bajantes y llaves de paso para cortar el daño cuanto antes.",
    scope: "Intervención directa",
    points: [
      "Localización de humedades y goteos",
      "Sustitución de tramos en cobre, multicapa o PEX",
      "Sellado y cierre de rozas tras la reparación",
    ],
  },
  {
    id: "griferia-sanitarios",
    code: "02",
    title: "Grifería, inodoros y mecanismos",
    category: "bano",
    categoryLabel: "Baño y cocina",
    icon: "wrench",
    summary:
      "Instalación y cambio de grifos monomando, cisternas que pierden agua, llaves de escuadra, sifones y desagües.",
    scope: "Ajuste en el día",
    points: [
      "Cambio de latiguillos y llaves de corte",
      "Reparación o sustitución de mecanismos de cisterna",
      "Montaje limpio de lavabos y fregaderos",
    ],
  },
  {
    id: "ducha-reforma-bano",
    code: "03",
    title: "Cambio de bañera y reforma de baño",
    category: "bano",
    categoryLabel: "Baño y cocina",
    icon: "shower",
    summary:
      "Renovación completa de tomas de agua y desagües con albañilería y acabado final integrado, sin coordinar varios gremios.",
    scope: "Fontanería + albañilería",
    points: [
      "Sustitución de bañera por plato de ducha a ras",
      "Columnas termostáticas y empotradas",
      "Alicatado, nivelación y sellado profesional",
    ],
  },
  {
    id: "termos-calderas",
    code: "04",
    title: "Termos eléctricos y agua caliente",
    category: "climatizacion",
    categoryLabel: "Agua y calor",
    icon: "flame",
    summary:
      "Instalación, sustitución y revisión de termos eléctricos, válvulas de seguridad, manguitos dieléctricos y purga de circuitos.",
    scope: "Agua caliente sanitaria",
    points: [
      "Instalación completa de termos nuevos",
      "Cambio de válvulas antirretorno y grupos de presión",
      "Revisión de pérdidas y temperatura irregular",
    ],
  },
  {
    id: "presion-desatascos",
    code: "05",
    title: "Desatascos y mejora de presión",
    category: "urgencias",
    categoryLabel: "Averías y fugas",
    icon: "gauge",
    summary:
      "Limpieza de desagües lentos en cocina o baño, ajuste de reductores de presión y sustitución de tuberías obstruidas por cal.",
    scope: "Flujo y drenaje",
    points: [
      "Desatasco de botes sifónicos, pilas y duchas",
      "Regulación de presión en vivienda",
      "Eliminación de ruidos o golpes de ariete",
    ],
  },
  {
    id: "acometidas-obra",
    code: "06",
    title: "Renovación de tuberías y acabados",
    category: "climatizacion",
    categoryLabel: "Agua y calor",
    icon: "hammer",
    summary:
      "Tendido nuevo para cocinas y viviendas completas con remates de albañilería limpia para que cada punto quede listo para usar.",
    scope: "Instalación completa",
    points: [
      "Tomas de electrodomésticos y ósmosis",
      "Colectores y distribución equilibrada",
      "Acabado de pared y suelo sin chapuzas",
    ],
  },
];

export const FAQS: FaqItem[] = [
  {
    id: "trato-directo",
    question: "¿El trato es directamente con Sergio Fustero o con una empresa externa?",
    answer:
      "Siempre tratas directamente con Sergio Fustero en el 635 55 91 62. Sin intermediarios ni comisiones de plataformas, lo que agiliza los tiempos y asegura continuidad de principio a fin.",
  },
  {
    id: "rozas-albanileria",
    question:
      "Si hay que abrir pared o suelo para reparar una tubería, ¿lo dejáis tapado?",
    answer:
      "Sí. Gracias a nuestra experiencia conjunta en fontanería y albañilería de acabados, no tienes que buscar otro profesional aparte: reparamos la tubería, verificamos que no pierda y dejamos el remate listo.",
  },
  {
    id: "presupuesto-previo",
    question: "¿Puedo pedir valoración antes de hacer la reparación o reforma?",
    answer:
      "Por supuesto. Puedes llamarnos directamente al 635 55 91 62 o escribirnos por WhatsApp antes de las 19:00 para orientarte y concertar visita sin compromiso.",
  },
  {
    id: "horario",
    question: "¿Cuál es el horario de atención telefónica?",
    answer:
      "Atendemos en horario laboral hasta las 19:00. Si tu consulta surge fuera de ese tramo, puedes dejarnos un mensaje por WhatsApp para responderte a primera hora.",
  },
  {
    id: "materiales",
    question: "¿Qué tipo de materiales utilizáis en instalaciones y reparaciones?",
    answer:
      "Trabajamos con tubería certificada (multicapa, cobre o PEX según cada instalación), válvulas de corte de latón y sellados profesionales pensados para durar y evitar futuras filtraciones.",
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "ducha-obra",
    code: "PR-01",
    title: "Cambio de bañera por ducha a ras",
    titleLead: "Ducha a ras",
    titleAccent: "de suelo",
    category: "bano",
    categoryLabel: "Baño y cocina",
    locationLabel: "Reforma de baño",
    summary:
      "Sustitución completa de bañera por plato nivelado, columna empotrada, impermeabilización y alicatado cerámico.",
    imageSrc: "/images/project-ducha.jpg",
    imageAlt:
      "Ducha moderna reformada con grifería empotrada, revestimiento porcelánico gris y desagüe lineal",
  },
  {
    id: "colector-vivienda",
    code: "PR-02",
    title: "Colector técnico con llaves por circuito",
    titleLead: "Colector técnico",
    titleAccent: "por circuitos",
    category: "climatizacion",
    categoryLabel: "Agua y calor",
    locationLabel: "Instalación técnica",
    summary:
      "Acometida interior ordenada con llaves de corte de latón, tubería multicapa y manómetro de control de presión.",
    imageSrc: "/images/project-colector.jpg",
    imageAlt:
      "Instalación limpia de colector de fontanería con tuberías alineadas, llaves de corte de latón y manómetro",
  },
  {
    id: "griferia-cocina",
    code: "PR-03",
    title: "Fregadero bajo encimera y monomando",
    titleLead: "Fregadero bajo",
    titleAccent: "encimera",
    category: "bano",
    categoryLabel: "Baño y cocina",
    locationLabel: "Cocina",
    summary:
      "Montaje de seno inoxidable con monomando de caño alto extraíble, sifón optimizado y toma para lavavajillas.",
    imageSrc: "/images/project-griferia.jpg",
    imageAlt:
      "Fregadero de cocina instalado bajo encimera blanca con grifo monomando de acero cepillado",
  },
  {
    id: "aseo-completo",
    code: "PR-04",
    title: "Lavabo suspendido y grifería mural",
    titleLead: "Lavabo mural",
    titleAccent: "sin juntas vistas",
    category: "urgencias",
    categoryLabel: "Averías y fugas",
    locationLabel: "Renovación y acabado",
    summary:
      "Renovación de tomas tras reparación de fuga oculta en pared, grifería mural empotrada y cierre limpio de obra.",
    imageSrc: "/images/project-bano.jpg",
    imageAlt:
      "Lavabo suspendido minimalista con grifería mural cromada y revestimiento cerámico continuo",
  },
];
