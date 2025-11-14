// src/data/PLANS.js

import Basic from "/images/Plans/Basic.jpg";
import Plus from "/images/Plans/Plus.jpg";
import Vip from "/images/Plans/Vip.jpg";

export const PLANS = [
  {
    id: "basic",
    name: "Plan Básico",
    priceMonthly: 3500,
    image: Basic,
    badge: "Ideal para empezar",
    description:
      "El Plan Básico ofrece una cobertura esencial y accesible para quienes buscan acompañamiento veterinario sin complicaciones...",
    features: ["Consultas por chat 24/7", "3 videollamadas/mes", "Recetas digitales"],
  },

  {
    id: "plus",
    name: "Plan Plus",
    priceMonthly: 5400,
    image: Plus,
    badge: "Más elegido",
    description:
      "El Plan Plus combina una atención integral con más beneficios para tu mascota...",
    features: ["Chat y video 24/7 ilimitado", "20% en guardias", "Recordatorios de vacunas"],
  },

  {
    id: "premium",
    name: "Plan VIP",
    priceMonthly: 7000,
    image: Vip,
    badge: "Cobertura total",
    description:
      "El Plan VIP está pensado para quienes quieren brindarle a su mascota el máximo nivel de cuidado...",
    features: ["Atención 24/7 ilimitada", "30% en farmacia", "Coordinación de turnos"],
  },
];
