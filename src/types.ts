/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TravelRequest {
  destination: string;
  departureCity: string;
  originCountry: string;
  timeUntilTrip: string; // e.g. "3 meses", "6 meses"
  estimatedDate: string;
  daysCount: number;
  peopleCount: number;
  currency: string; // e.g. "BRL", "USD", "EUR"
  budget: number;
  email: string;
  
  style: string; // e.g. "Econômica", "Custo-benefício", "Confortável", "Luxo", etc.
  interests: string[]; // List of selected interest tags
  
  accommodationType: string; // "Hotel", "Airbnb", "Hostel", "Resort", "Pacote", "Ainda não sei"
  accommodationPref: {
    priority: "economy" | "comfort" | "luxury";
    nearCenter: boolean;
    nearTransit: boolean;
    sharedAllowed: boolean;
  };

  transportOption: string; // e.g. "Transporte público", "Carro alugado", "Melhor opção automática"
  
  mealsOption: string; // "Econômico", "Médio", "Premium", "Experiência gastronômica"
  mealsPref: {
    mealsPerDay: number;
    cooksMeals: boolean;
    goesToRestaurants: boolean;
  };
}

export interface CostEstimate {
  flight: number;
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  insurance: number;
  extraReserve: number;
  total: number;
  costPerPerson: number;
  costPerDay: number;
  monthlySavingsRequired: number; // calculated based on budget and timeUntilTrip
}

export interface AccommodationComparison {
  id: string;
  type: string; // "Hotel", "Airbnb", "Hostel", "Resort / Pacote"
  averagePrice: number;
  comfortLevel: "Baixo" | "Médio" | "Alto" | "Premium";
  pros: string[];
  contras: string[];
  bestProfile: string;
}

export interface ItineraryActivity {
  time: string;
  place: string;
  description: string;
  averageTime: string;
  estimatedCost: number;
  agentTip: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  activities: ItineraryActivity[];
}

export interface TravelSpot {
  name: string;
  description: string;
  reason: string;
  imageUrl: string;
}

export interface ChecklistItemModel {
  id: string;
  label: string;
  checked: boolean;
  category: "preparacao" | "documentacao" | "financeiro" | "essenciais";
}

export interface TravelPlan {
  id: string;
  destination: string;
  departureCity: string;
  daysCount: number;
  peopleCount: number;
  bestTimeToVisit: string;
  localCurrency: string;
  localLanguage: string;
  averageTemp: string;
  costEstimate: CostEstimate;
  accommodations: AccommodationComparison[];
  itinerary: ItineraryDay[];
  spots: TravelSpot[];
  checklist: ChecklistItemModel[];
}
