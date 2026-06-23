/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TravelRequest,
  TravelPlan,
  CostEstimate,
  AccommodationComparison,
  ItineraryDay,
  TravelSpot,
  ChecklistItemModel,
  ItineraryActivity
} from "./types";

export const TravelPlannerMockService = {
  generatePlan: (request: TravelRequest): TravelPlan => {
    // Determine local currency, language, average temp and best season based on destination
    const destLower = request.destination.toLowerCase();
    
    let localCurrency = request.currency || "BRL";
    let localLanguage = "Português";
    let averageTemp = "22°C";
    let bestTimeToVisit = "Primavera e Outono";
    
    if (destLower.includes("paris") || destLower.includes("frança") || destLower.includes("europa")) {
      localCurrency = "EUR (€)";
      localLanguage = "Francês";
      averageTemp = "15°C - 24°C";
      bestTimeToVisit = "Maio a Setembro";
    } else if (destLower.includes("roma") || destLower.includes("itália") || destLower.includes("milão") || destLower.includes("venezia")) {
      localCurrency = "EUR (€)";
      localLanguage = "Italiano";
      averageTemp = "18°C - 28°C";
      bestTimeToVisit = "Abril a Junho";
    } else if (destLower.includes("nova york") || destLower.includes("ny") || destLower.includes("orlando") || destLower.includes("disney") || destLower.includes("eua") || destLower.includes("miami")) {
      localCurrency = "USD ($)";
      localLanguage = "Inglês";
      averageTemp = "10°C - 26°C";
      bestTimeToVisit = "Setembro a Novembro";
    } else if (destLower.includes("tóquio") || destLower.includes("tokyo") || destLower.includes("japão")) {
      localCurrency = "JPY (¥)";
      localLanguage = "Japonês";
      averageTemp = "12°C - 25°C";
      bestTimeToVisit = "Março a Maio (Cerejeiras)";
    } else if (destLower.includes("gramado") || destLower.includes("canela") || destLower.includes("sul")) {
      localCurrency = "BRL (R$)";
      localLanguage = "Português";
      averageTemp = "8°C - 18°C";
      bestTimeToVisit = "Junho a Agosto (Inverno) ou Dezembro (Natal Luz)";
    } else if (destLower.includes("rio de janeiro") || destLower.includes("nordeste") || destLower.includes("bahia") || destLower.includes("praia")) {
      localCurrency = "BRL (R$)";
      localLanguage = "Português";
      averageTemp = "24°C - 32°C";
      bestTimeToVisit = "Setembro a Março";
    }

    // Cost multi-pliers based on travel style
    let styleMultiplier = 1.0;
    if (request.style === "Econômica" || request.style === "Mochilão") {
      styleMultiplier = 0.6;
    } else if (request.style === "Custo-benefício" || request.style === "Família") {
      styleMultiplier = 1.0;
    } else if (request.style === "Confortável" || request.style === "Romântica") {
      styleMultiplier = 1.5;
    } else if (request.style === "Luxo") {
      styleMultiplier = 3.0;
    }

    // Dynamic cost estimations
    const days = request.daysCount || 5;
    const people = request.peopleCount || 1;
    
    // Core base costs in standard USD equivalent then converted to selected currency logic
    const flightBase = 800 * people * (styleMultiplier * 0.9);
    const accommodationBase = 120 * days * styleMultiplier;
    const foodBase = 45 * days * people * styleMultiplier;
    const transportBase = 25 * days * styleMultiplier;
    const activitiesBase = 30 * days * people * (request.interests.length * 0.2 + 0.5);
    const insuranceBase = 40 * people;
    const extraReserveBase = (flightBase + accommodationBase + foodBase) * 0.15;

    // Convert estimated base costs to currency value visually
    let currencyRate = 1;
    if (request.currency === "BRL") currencyRate = 5.5; // conversion factors for display fun
    if (request.currency === "EUR") currencyRate = 0.9;
    if (request.currency === "USD") currencyRate = 1.0;

    const flight = Math.round(flightBase * currencyRate);
    const accommodation = Math.round(accommodationBase * currencyRate);
    const food = Math.round(foodBase * currencyRate);
    const transport = Math.round(transportBase * currencyRate);
    const activities = Math.round(activitiesBase * currencyRate);
    const insurance = Math.round(insuranceBase * currencyRate);
    const extraReserve = Math.round(extraReserveBase * currencyRate);
    const total = flight + accommodation + food + transport + activities + insurance + extraReserve;

    const costPerPerson = Math.round(total / people);
    const costPerDay = Math.round(total / days);

    // Calculate monthly savings based on timeUntilTrip
    // Extract digit from string like "3 meses", fallback to 6
    const monthsMatch = request.timeUntilTrip.match(/\d+/);
    const monthsToTrip = monthsMatch ? parseInt(monthsMatch[0], 10) : 6;
    const monthlySavingsRequired = Math.round(total / (monthsToTrip || 1));

    const costEstimate: CostEstimate = {
      flight,
      accommodation,
      food,
      transport,
      activities,
      insurance,
      extraReserve,
      total,
      costPerPerson,
      costPerDay,
      monthlySavingsRequired,
    };

    // Accommodations Comparison
    const accommodations: AccommodationComparison[] = [
      {
        id: "acc_hotel",
        type: "Hotel",
        averagePrice: Math.round(110 * currencyRate * styleMultiplier),
        comfortLevel: request.style === "Luxo" ? "Premium" : request.style === "Confortável" ? "Alto" : "Médio",
        pros: ["Serviço de quarto e recepção 24h", "Café da manhã incluso", "Privacidade e segurança completas"],
        contras: ["Preço mais elevado", "Sem cozinha disponível para economizar", "Quartos padronizados"],
        bestProfile: "Viajantes que valorizam praticidade, famílias e viagens românticas."
      },
      {
        id: "acc_airbnb",
        type: "Airbnb",
        averagePrice: Math.round(95 * currencyRate * styleMultiplier),
        comfortLevel: "Alto",
        pros: ["Sensação de morar no destino", "Cozinha completa para economizar nas refeições", "Mais espaço para grupos"],
        contras: ["Sem serviços de limpeza inclusos diariamente", "Check-in às vezes exige combinação prévia", "Taxas de limpeza adicionais"],
        bestProfile: "Grupos de amigos, famílias grandes e estadias mais longas."
      },
      {
        id: "acc_hostel",
        type: "Hostel",
        averagePrice: Math.round(35 * currencyRate * styleMultiplier),
        comfortLevel: "Baixo",
        pros: ["Extremamente econômico", "Excelente ambiente para conhecer novas pessoas", "Dicas locais dos funcionários"],
        contras: ["Falta de privacidade em quartos compartilhados", "Banheiro frequentemente coletivo", "Barulho noturno potencial"],
        bestProfile: "Viajantes solo, mochileiros e jovens de espírito livre."
      },
      {
        id: "acc_resort",
        type: "Resort ou Pacote",
        averagePrice: Math.round(220 * currencyRate * styleMultiplier),
        comfortLevel: "Premium",
        pros: ["All Inclusive (frequentemente)", "Atividades de lazer no próprio local", "Livre de preocupações logísticas"],
        contras: ["Preço mais alto de todos", "Isolamento do centro cultural da cidade", "Menor flexibilidade no roteiro"],
        bestProfile: "Casais em lua de mel, famílias com crianças e viagens puras de descanso."
      }
    ];

    // Generate spots based on destination
    const spots: TravelSpot[] = [];
    if (destLower.includes("paris")) {
      spots.push(
        {
          name: "Torre Eiffel",
          description: "O maior símbolo parisiense, oferecendo uma vista magnífica de toda a cidade luz.",
          reason: "Imprescindível para qualquer viajante, especialmente ao entardecer quando as luzes começam a piscar.",
          imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Museu do Louvre",
          description: "O maior museu de arte do mundo, lar da Mona Lisa, da Vênus de Milo e de milhares de relíquias.",
          reason: "Para absorver a rica história e arte mundial de forma profunda e inspiradora.",
          imageUrl: "https://images.unsplash.com/photo-1499856138074-7957794d11a9?auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Bairro de Montmartre",
          description: "O charme boêmio com ruas de paralelepípedos, artistas de rua e a magnífica Basílica de Sacré-Cœur.",
          reason: "Perfeito para uma caminhada no fim de tarde, café tradicional parisiense e fotos espetaculares.",
          imageUrl: "https://images.unsplash.com/photo-1509840141072-04e12731c6a2?auto=format&fit=crop&w=400&q=80"
        }
      );
    } else if (destLower.includes("roma")) {
      spots.push(
        {
          name: "Coliseu",
          description: "O anfiteatro mais famoso da antiguidade, onde gladiadores lutavam sob o império romano.",
          reason: "Uma viagem espetacular no tempo que te deixa sem fôlego frente à engenhosidade antiga.",
          imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Fontana di Trevi",
          description: "A fonte barroca mais espetacular do mundo, famosa pela tradição de jogar moedas.",
          reason: "Garante sorte e retorno a Roma. Visitar bem cedo ou bem tarde evita as multidões excessivas.",
          imageUrl: "https://images.unsplash.com/photo-1515542690855-4a42b7bab0e2?auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Museus do Vaticano & Capela Sistina",
          description: "Um tesouro incomparável de arte renascentista, culminando nos afrescos de Michelangelo.",
          reason: "Impacto espiritual e estético monumental; um dos ápices da arte humana ocidental.",
          imageUrl: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=400&q=80"
        }
      );
    } else if (destLower.includes("gramado")) {
      spots.push(
        {
          name: "Lago Negro",
          description: "Um lago artificial de águas escuras cercado por árvores trazidas diretamente da Floresta Negra alemã.",
          reason: "Passeio romântico clássico de pedalinho e caminhadas sossegadas em meio à natureza.",
          imageUrl: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Mini Mundo",
          description: "Um parque temático com réplicas detalhadas de prédios de todo o mundo em escala minúscula.",
          reason: "Incrível para fotos detalhadas, despertando a criança interna em um passeio muito charmoso.",
          imageUrl: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Rua Torta & Centro Histórico",
          description: "Ruas icônicas e floridas com arquitetura bávara, cafés coloniais e lojas de chocolates artesanais.",
          reason: "Excelente para passear no fim de tarde, tomar um chocolate quente e curtir o clima europeu no Brasil.",
          imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80"
        }
      );
    } else {
      // Default / Generics high quality travel spots
      spots.push(
        {
          name: "Centro Histórico (Old Town)",
          description: "O coração cultural do destino, onde residem os segredos de fundação, ruelas icônicas e arquitetura clássica.",
          reason: "O melhor ponto de partida para entender a identidade local e saborear a culinária autêntica.",
          imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Mirante Principal da Cidade",
          description: "Ponto elevado que proporciona uma visão de 360 graus sobre a paisagem urbana e natural.",
          reason: "Perfeito para capturar fotos de cartão postal e apreciar um belíssimo pôr do sol.",
          imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Mercado Público Local",
          description: "O centro pulsante do comércio regional repleto de cores, temperos, comidas típicas e artesanatos.",
          reason: "Excelente oportunidade para interagir com moradores locais e adquirir lembranças autênticas.",
          imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80"
        }
      );
    }

    // Dynamic generation of activities based on selection of interests
    const availableActivities: { title: string; desc: string; category: string }[] = [];
    
    // Fill activities database for mock generation
    if (request.interests.includes("Museus") || request.interests.includes("Cultura local") || request.interests.includes("História")) {
      availableActivities.push(
        { title: "Visita guiada ao Museu Histórico Municipal", desc: "Aprofunde-se nas origens e coleções artísticas locais.", category: "cultural" },
        { title: "Walking Tour pelo Centro Histórico", desc: "Caminhada explicativa com guia contando causos e lendas urbanas.", category: "cultural" },
        { title: "Exploração de Galerias de Arte Independentes", desc: "Aprecie trabalhos de artistas contemporâneos locais.", category: "cultural" }
      );
    }
    if (request.interests.includes("Castelos") || request.interests.includes("Lugares medievais") || request.interests.includes("Igrejas históricas")) {
      availableActivities.push(
        { title: "Tour pelas Muralhas e Ruínas Medievais", desc: "Explore fortificações antigas com vistas panorâmicas impressionantes.", category: "medieval" },
        { title: "Visita ao Castelo e Salões Imperiais", desc: "Conheça de perto aposentos reais e armas de época.", category: "medieval" },
        { title: "Visita à Catedral Gótica e subida na torre principal", desc: "Admire os vitrais medievais e tenha a melhor vista aérea da cidade.", category: "medieval" }
      );
    }
    if (request.interests.includes("Natureza") || request.interests.includes("Montanhas") || request.interests.includes("Lagos") || request.interests.includes("Trilhas")) {
      availableActivities.push(
        { title: "Trilha guiada em Reserva Ecológica ou Montanha", desc: "Caminhada revigorante em meio à fauna e flora locais.", category: "nature" },
        { title: "Passeio de barco ou caiaque no lago principal", desc: "Desfrute de momentos de paz absoluta deslizando pelas águas tranquilas.", category: "nature" },
        { title: "Piquenique panorâmico no parque ecológico", desc: "Relaxe saboreando queijos e frutas locais cercado pela natureza exuberante.", category: "nature" }
      );
    }
    if (request.interests.includes("Gastronomia")) {
      availableActivities.push(
        { title: "Aula prática de culinária típica com Chef local", desc: "Aprenda a cozinhar e depois saboreie os pratos mais famosos da região.", category: "gastronomy" },
        { title: "Roteiro de degustação de vinhos/cervejas e queijos", desc: "Visita a produtores locais com degustações guiadas de alta qualidade.", category: "gastronomy" },
        { title: "Jantar especial de alta gastronomia local", desc: "Uma imersão completa em sabores sofisticados com menu autoral.", category: "gastronomy" }
      );
    }
    if (request.interests.includes("Vida noturna")) {
      availableActivities.push(
        { title: "Tour de Pub Crawl / Bares tradicionais", desc: "Conheça a agitação noturna em pontos populares escolhidos a dedo.", category: "nightlife" },
        { title: "Show de música tradicional ao vivo ou Teatro", desc: "Desfrute de apresentações artísticas típicas do país.", category: "nightlife" }
      );
    }
    if (request.interests.includes("Compras") || request.interests.includes("Vilarejos") || request.interests.includes("Pontos instagramáveis")) {
      availableActivities.push(
        { title: "Sessão de fotos nos pontos mais instagramáveis", desc: "Roteiro pelas ruelas coloridas e floridas ideais para retratos memoráveis.", category: "lifestyle" },
        { title: "Passeio no distrito de compras e lojas conceituais", desc: "Garanta lembranças, artesanatos locais e vestuário autoral.", category: "lifestyle" }
      );
    }

    // Default general activities to ensure we have enough
    availableActivities.push(
      { title: "Café da manhã especial em padaria centenária", desc: "Prove pães e doces locais assados de manhãzinha.", category: "general" },
      { title: "Tempo livre para exploração pessoal e descanso", desc: "Aproveite para curtir no seu ritmo ou sentar em uma praça agradável.", category: "general" },
      { title: "Jantar aconchegante em restaurante familiar tradicional", desc: "Pratos quentes e caseiros em um ambiente super hospitaleiro.", category: "general" },
      { title: "Caminhada de despedida sob a iluminação noturna", desc: "Aprecie a cidade sob outro prisma luminoso antes de partir.", category: "general" }
    );

    // Build itinerary day-by-day based on daysCount
    const itinerary: ItineraryDay[] = [];
    const titlesByDay = [
      "Chegada, Reconhecimento e Charme Inicial",
      "Mergulho Histórico e Pontos Emblemáticos",
      "Contato com a Natureza e Paisagens de Cartão Postal",
      "Segredos Locais, Gastronomia e Vivência Autêntica",
      "Imersão Cultural e Compras de Recordações",
      "Vilarejos Próximos e Passeios Fora do Óbvio",
      "Aventura, Parques e Trilhas Desafiadoras",
      "Dia das Artes, Museus e Café Tradicional",
      "Lazer, Compras de Última Hora e Despedida",
      "Último Dia: Relaxamento e Preparação do Retorno"
    ];

    for (let d = 1; d <= days; d++) {
      const activitiesForThisDay: ItineraryActivity[] = [];
      const title = titlesByDay[(d - 1) % titlesByDay.length];

      // Distribute activities by times: Morning, Afternoon, Evening
      const times = [
        { name: "09:00", costFactor: 0.2 },
        { name: "14:30", costFactor: 0.5 },
        { name: "20:00", costFactor: 1.0 }
      ];

      times.forEach((t, index) => {
        // Pick an activity programmatically
        let actSource = availableActivities.filter(a => {
          // simple pseudo-random selection to differentiate days
          const hash = (d * 7 + index * 13) % availableActivities.length;
          return a !== undefined;
        });

        if (actSource.length === 0) actSource = availableActivities;
        const selectedIndex = (d * 11 + index * 17) % actSource.length;
        const rawAct = actSource[selectedIndex];

        // Customize cost based on budget style
        let actCost = Math.round(30 * currencyRate * t.costFactor * styleMultiplier);
        if (rawAct.category === "general" && index === 0) actCost = Math.round(10 * currencyRate); // breakfast is cheap
        if (request.style === "Econômica" && index !== 2) actCost = 0; // free activities in economic option

        activitiesForThisDay.push({
          time: t.name,
          place: rawAct.title,
          description: rawAct.desc,
          averageTime: index === 0 ? "1h 30m" : index === 1 ? "3h" : "2h",
          estimatedCost: actCost,
          agentTip: `Dica do Agente: ${
            index === 0 ? "Chegue 15 minutos antes para evitar filas." :
            index === 1 ? "Ideal levar garrafa d'água e calçado muito confortável." :
            "Faça reserva com antecedência, este local costuma lotar."
          }`
        });
      });

      itinerary.push({
        dayNumber: d,
        title: `Dia ${d}: ${title}`,
        activities: activitiesForThisDay
      });
    }

    // Prepare checklists
    const checklist: ChecklistItemModel[] = [
      { id: "chk_1", label: "Verificar validade do passaporte (mínimo 6 meses)", checked: true, category: "documentacao" },
      { id: "chk_2", label: "Emitir apólice de Seguro Viagem Internacional", checked: false, category: "documentacao" },
      { id: "chk_3", label: "Realizar a compra de passagens aéreas / transporte", checked: false, category: "preparacao" },
      { id: "chk_4", label: "Efetuar reserva da hospedagem preferida", checked: false, category: "preparacao" },
      { id: "chk_5", label: "Solicitar cartão de débito internacional multicaretas (ex: Wise/Nomad)", checked: false, category: "financeiro" },
      { id: "chk_6", label: "Comprar chip eSIM de internet internacional", checked: false, category: "preparacao" },
      { id: "chk_7", label: "Comprar adaptador de tomada universal", checked: false, category: "essenciais" },
      { id: "chk_8", label: "Baixar aplicativo de mapas offline do destino", checked: true, category: "essenciais" },
      { id: "chk_9", label: "Guardar reserva em dinheiro vivo na moeda local", checked: false, category: "financeiro" }
    ];

    if (destLower.includes("europa") || destLower.includes("paris") || destLower.includes("roma")) {
      checklist.push({ id: "chk_10", label: "Verificar isenção de visto ou emitir ETIAS se ativo", checked: false, category: "documentacao" });
    } else if (destLower.includes("eua") || destLower.includes("nova york") || destLower.includes("orlando") || destLower.includes("miami")) {
      checklist.push({ id: "chk_11", label: "Emitir visto americano válido ou autorização ESTA", checked: false, category: "documentacao" });
    }

    return {
      id: `plan_${Date.now()}`,
      destination: request.destination,
      departureCity: request.departureCity,
      daysCount: days,
      peopleCount: people,
      bestTimeToVisit,
      localCurrency,
      localLanguage,
      averageTemp,
      costEstimate,
      accommodations,
      itinerary,
      spots,
      checklist
    };
  }
};

export const PdfMockService = {
  generatePdfBlobUrl: async (plan: TravelPlan): Promise<string> => {
    // Return a beautiful dynamic iframe or a base64 encoded mock PDF content for preview
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate generating PDF URL. We can use a stylized HTML/SVG content representing a gorgeous PDF
        resolve("mock-pdf-url-generated");
      }, 1500);
    });
  },
  downloadPdf: (plan: TravelPlan) => {
    // Simulate downloading PDF by creating a dynamic file
    const element = document.createElement("a");
    const file = new Blob([
      `TRAVEL PLANNER AI - ROTEIRO COMPLETO PARA ${plan.destination.toUpperCase()}\n\n` +
      `Resumo da Viagem:\n` +
      `- Origem: ${plan.departureCity}\n` +
      `- Duração: ${plan.daysCount} dias\n` +
      `- Pessoas: ${plan.peopleCount}\n` +
      `- Melhor época: ${plan.bestTimeToVisit}\n` +
      `- Moeda Local: ${plan.localCurrency}\n` +
      `- Idioma: ${plan.localLanguage}\n` +
      `- Temperatura média: ${plan.averageTemp}\n\n` +
      `FINANCEIRO ESTIMADO:\n` +
      `- Passagens: ${plan.localCurrency} ${plan.costEstimate.flight}\n` +
      `- Hospedagem: ${plan.localCurrency} ${plan.costEstimate.accommodation}\n` +
      `- Alimentação: ${plan.localCurrency} ${plan.costEstimate.food}\n` +
      `- Transporte: ${plan.localCurrency} ${plan.costEstimate.transport}\n` +
      `- Passeios: ${plan.localCurrency} ${plan.costEstimate.activities}\n` +
      `- Seguro Viagem: ${plan.localCurrency} ${plan.costEstimate.insurance}\n` +
      `- Reserva de emergência: ${plan.localCurrency} ${plan.costEstimate.extraReserve}\n` +
      `- CUSTO TOTAL ESTIMADO: ${plan.localCurrency} ${plan.costEstimate.total}\n` +
      `- Meta de economia por mês: ${plan.localCurrency} ${plan.costEstimate.monthlySavingsRequired}/mês\n\n` +
      `COMPARAÇÃO DE HOSPEDAGEM RECOMENDADA:\n` +
      plan.accommodations.map(acc => `- ${acc.type}: Média de ${plan.localCurrency} ${acc.averagePrice} | Prós: ${acc.pros.join(", ")}`).join("\n") + "\n\n" +
      `ROTEIRO DIA A DIA:\n` +
      plan.itinerary.map(day => {
        return `\n${day.title}\n` + day.activities.map(act => `  [${act.time}] ${act.place} (${act.averageTime}) - Custo: ${plan.localCurrency} ${act.estimatedCost}\n  ${act.description}\n  ${act.agentTip}`).join("\n");
      }).join("\n\n") + "\n\n" +
      `LUGARIRES IMPERDÍVEIS:\n` +
      plan.spots.map(spot => `- ${spot.name}: ${spot.description}\n  Por que ir: ${spot.reason}`).join("\n\n") + "\n\n" +
      `CHECKLIST DE PREPARAÇÃO:\n` +
      plan.checklist.map(item => `[${item.checked ? "X" : " "}] ${item.label}`).join("\n")
    ], { type: "text/plain" });
    
    element.href = URL.createObjectURL(file);
    element.download = `Travel_Planner_AI_${plan.destination.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
};

export const EmailMockService = {
  sendEmailWithPdf: async (email: string, plan: TravelPlan): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`E-mail com PDF enviado com sucesso para: ${email} contendo o planejamento de ${plan.destination}`);
        resolve(true);
      }, 2000);
    });
  }
};
