/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Mail,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Home,
  ShieldCheck,
  Send,
  Heart,
  Tent,
  Building2,
  X,
  FileText,
  ThumbsUp,
  Plus,
  Info,
  Coins,
  Coffee,
  Car,
  Languages,
  Thermometer,
  AlertCircle,
  FileDown,
  ChevronDown,
  Activity,
  Award,
  Clock,
  User,
  Map
} from "lucide-react";

import { TravelRequest, TravelPlan, ChecklistItemModel } from "./types";
import { TravelPlannerMockService, PdfMockService, EmailMockService } from "./services";

import { AppHeader } from "./components/AppHeader";
import { ResponsiveContainer } from "./components/ResponsiveContainer";
import { ProgressStepper } from "./components/ProgressStepper";
import { SelectableCard } from "./components/SelectableCard";
import { TravelSummaryCard } from "./components/TravelSummaryCard";
import { CostCard } from "./components/CostCard";
import { ComparisonCard } from "./components/ComparisonCard";
import { ItineraryDayCard } from "./components/ItineraryDayCard";
import { ChecklistItem } from "./components/ChecklistItem";
import { PDFPreviewCard } from "./components/PDFPreviewCard";

export default function App() {
  // Screens state: 'splash' | 'home' | 'wizard' | 'processing' | 'result' | 'success'
  const [currentScreen, setCurrentScreen] = useState<
    "splash" | "home" | "wizard" | "processing" | "result" | "success"
  >("splash");

  // Wizard steps: 1 | 2 | 3 | 4 | 5 | 6
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Form Input data representation
  const [formData, setFormData] = useState<TravelRequest>({
    destination: "",
    departureCity: "",
    originCountry: "Brasil",
    timeUntilTrip: "3 meses",
    estimatedDate: "2026-10-15",
    daysCount: 5,
    peopleCount: 1,
    currency: "BRL (R$)",
    budget: 5000,
    email: "peidinho16@gmail.com", // injected user email for delightful preset
    style: "Custo-benefício", // default selected
    interests: ["Gastronomia", "Cultura local", "Natureza"], // defaults selected
    accommodationType: "Hotel",
    accommodationPref: {
      priority: "comfort",
      nearCenter: true,
      nearTransit: true,
      sharedAllowed: false,
    },
    transportOption: "Melhor opção automática",
    mealsOption: "Médio",
    mealsPref: {
      mealsPerDay: 3,
      cooksMeals: false,
      goesToRestaurants: true,
    },
  });

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Generated Plan State
  const [generatedPlan, setGeneratedPlan] = useState<TravelPlan | null>(null);

  // Modals & sending states
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [isEmailSending, setIsEmailSending] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Processing sequential loading items
  const [processingIndex, setProcessingIndex] = useState<number>(0);
  const processingSteps = [
    "Analisando destino e clima histórico...",
    "Buscando as melhores atrações e segredos locais...",
    "Organizando roteiro dia a dia otimizado...",
    "Estimando custos de passagens aéreas aproximados...",
    "Comparando hospedagens da região...",
    "Calculando plano de alimentação sugerido...",
    "Calculando rotas e opções de transporte...",
    "Criando planejamento financeiro e metas de poupança...",
    "Gerando arquivo PDF exclusivo para envio..."
  ];

  // Splash timeout
  useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        setCurrentScreen("home");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Processing screen tick generator
  useEffect(() => {
    if (currentScreen === "processing") {
      setProcessingIndex(0);
      const interval = setInterval(() => {
        setProcessingIndex((prev) => {
          if (prev >= processingSteps.length - 1) {
            clearInterval(interval);
            // Finish processing and transition to Result page
            setTimeout(() => {
              const plan = TravelPlannerMockService.generatePlan(formData);
              setGeneratedPlan(plan);
              setCurrentScreen("result");
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 700);

      return () => clearInterval(interval);
    }
  }, [currentScreen]);

  // Toggle interest logic
  const handleToggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      const newInterests = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      
      // Clear error if selected at least 1
      if (newInterests.length > 0 && errors.interests) {
        setErrors((errs) => {
          const { interests, ...rest } = errs;
          return rest;
        });
      }
      return { ...prev, interests: newInterests };
    });
  };

  // Validate Step 1 Fields
  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.destination.trim()) {
      errs.destination = "Campo obrigatório. Informe um destino.";
    }
    if (!formData.departureCity.trim()) {
      errs.departureCity = "Campo obrigatório. Informe a cidade de saída.";
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Insira um endereço de e-mail válido.";
    }
    if (formData.daysCount <= 0) {
      errs.daysCount = "A viagem precisa durar pelo menos 1 dia.";
    }
    if (formData.peopleCount <= 0) {
      errs.peopleCount = "É necessário pelo menos 1 viajante.";
    }
    if (formData.budget <= 0) {
      errs.budget = "Orçamento deve ser maior que zero.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Step 2 Style Selection
  const validateStep2 = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.style) {
      errs.style = "Por favor, selecione 1 estilo de viagem principal.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Step 3 Interests Selection
  const validateStep3 = () => {
    const errs: { [key: string]: string } = {};
    if (formData.interests.length === 0) {
      errs.interests = "Nenhum interesse selecionado. Escolha pelo menos 1 interesse para personalizar o roteiro.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Move wizard steps
  const handleNextStep = () => {
    if (wizardStep === 1 && !validateStep1()) return;
    if (wizardStep === 2 && !validateStep2()) return;
    if (wizardStep === 3 && !validateStep3()) return;

    if (wizardStep < 6) {
      setWizardStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Transition to loading/processing screen
      setCurrentScreen("processing");
    }
  };

  const handlePrevStep = () => {
    if (wizardStep > 1) {
      setWizardStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentScreen("home");
    }
  };

  // Trigger PDF Mock Download
  const handleDownloadPdf = () => {
    if (!generatedPlan) return;
    PdfMockService.downloadPdf(generatedPlan);
    triggerAlert("success", "Roteiro baixado com sucesso!");
  };

  // Trigger Email Send Mock
  const handleSendEmail = async () => {
    if (!generatedPlan) return;
    setIsEmailSending(true);
    try {
      const success = await EmailMockService.sendEmailWithPdf(formData.email, generatedPlan);
      if (success) {
        setShowPdfModal(false);
        setCurrentScreen("success");
      } else {
        triggerAlert("error", "Erro ao enviar e-mail. Tente novamente.");
      }
    } catch (e) {
      triggerAlert("error", "Erro inesperado ao enviar o planejamento.");
    } finally {
      setIsEmailSending(false);
    }
  };

  // Custom persistent notice banners
  const triggerAlert = (type: "success" | "error", text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleToggleChecklistItem = (id: string) => {
    if (!generatedPlan) return;
    const updatedChecklist = generatedPlan.checklist.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setGeneratedPlan({ ...generatedPlan, checklist: updatedChecklist });
  };

  // Standard preset of travel interests
  const interestsList = [
    { name: "Castelos", emoji: "🏰" },
    { name: "Museus", emoji: "🏛️" },
    { name: "Igrejas históricas", emoji: "⛪" },
    { name: "História", emoji: "📜" },
    { name: "Cultura local", emoji: "🎭" },
    { name: "Natureza", emoji: "🌲" },
    { name: "Montanhas", emoji: "🏔️" },
    { name: "Lagos", emoji: "💧" },
    { name: "Trilhas", emoji: "🥾" },
    { name: "Gastronomia", emoji: "🍷" },
    { name: "Compras", emoji: "🛍️" },
    { name: "Arquitetura", emoji: "📐" },
    { name: "Vida noturna", emoji: "🍹" },
    { name: "Lugares medievais", emoji: "🛡️" },
    { name: "Pontos instagramáveis", emoji: "📸" },
    { name: "Vilarejos", emoji: "🏡" },
    { name: "Praias", emoji: "🏖️" },
    { name: "Parques", emoji: "🎡" },
  ];

  // Travel Styles database for Step 2
  const travelStyles = [
    { title: "Econômica", desc: "Foco total em economizar, priorizando atrações grátis e hostel.", icon: <Coins className="w-5 h-5 text-emerald-500" /> },
    { title: "Custo-benefício", desc: "Balanço ideal entre boas experiências e gastos moderados.", icon: <Wallet className="w-5 h-5 text-blue-500" /> },
    { title: "Confortável", desc: "Viagem relaxada em bons hotéis e restaurantes consagrados.", icon: <Home className="w-5 h-5 text-indigo-500" /> },
    { title: "Luxo", desc: "Experiências exclusivas premium de alto nível sem restrições.", icon: <Award className="w-5 h-5 text-amber-500" />, badge: "Premium" },
    { title: "Mochilão", desc: "Aventura crua desbravadora, transporte público e ritmos intensos.", icon: <Tent className="w-5 h-5 text-sky-500" /> },
    { title: "Família", desc: "Atividades para todas as idades, segurança e roteiro espaçado.", icon: <Users className="w-5 h-5 text-violet-500" /> },
    { title: "Romântica", desc: "Foco em clima de romance, jantares à luz de velas e ótimos cenários.", icon: <Heart className="w-5 h-5 text-rose-500" /> },
    { title: "Aventura", desc: "Atividades esportivas, adrenalina, trilhas e muita exploração.", icon: <Activity className="w-5 h-5 text-orange-500" /> },
  ];

  // Start plan from scratch
  const handleResetPlanner = () => {
    setFormData((prev) => ({
      ...prev,
      destination: "",
      departureCity: "",
      daysCount: 5,
      peopleCount: 1,
      budget: 5000,
    }));
    setWizardStep(1);
    setErrors({});
    setCurrentScreen("wizard");
  };

  // Demo Example Trigger
  const handleLoadDemo = () => {
    setFormData({
      destination: "Roma, Itália",
      departureCity: "São Paulo",
      originCountry: "Brasil",
      timeUntilTrip: "6 meses",
      estimatedDate: "2026-09-10",
      daysCount: 6,
      peopleCount: 2,
      currency: "EUR (€)",
      budget: 15000,
      email: "viajante.demo@gmail.com",
      style: "Romântica",
      interests: ["História", "Castelos", "Gastronomia", "Igrejas históricas", "Pontos instagramáveis"],
      accommodationType: "Hotel",
      accommodationPref: {
        priority: "comfort",
        nearCenter: true,
        nearTransit: true,
        sharedAllowed: false,
      },
      transportOption: "Melhor opção automática",
      mealsOption: "Premium",
      mealsPref: {
        mealsPerDay: 3,
        cooksMeals: false,
        goesToRestaurants: true,
      }
    });
    
    // Auto run demo calculation
    setCurrentScreen("processing");
  };

  return (
    <div className="min-h-screen bg-[#f4f7f8] text-[#606c71] font-sans selection:bg-[#155799]/15 flex flex-col justify-between">
      
      {/* Toast alert system notifications */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl shadow-xl flex items-center space-x-3 text-sm font-semibold border ${
              alertMessage.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                : "bg-rose-50 border-rose-100 text-rose-800"
            }`}
          >
            <AlertCircle className={`w-4 h-4 ${alertMessage.type === "success" ? "text-emerald-500" : "text-rose-500"}`} />
            <span>{alertMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER RENDERING */}
      {currentScreen !== "splash" && (
        <AppHeader
          showStartBtn={currentScreen === "home"}
          onStartClick={() => setCurrentScreen("wizard")}
        />
      )}

      {/* ACTIVE PAGE CONTENT DISPATCHER */}
      <main className="flex-grow">
        
        {/* 1. SPLASH SCREEN */}
        {currentScreen === "splash" && (
          <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-white overflow-hidden">
            {/* Visual ambient circular lights */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="text-center relative z-10 flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 mb-6 relative">
                <Compass className="w-10 h-10 animate-pulse" />
                <div className="absolute inset-0 rounded-3xl border border-white/20 animate-pulse-ring" />
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight">
                Travel Planner <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">AI</span>
              </h1>
              <p className="text-sm text-slate-400 font-medium tracking-wide uppercase mt-2">
                Seu agente inteligente de viagens
              </p>

              {/* Progress visual loader bar */}
              <div className="w-40 h-1 bg-slate-800 rounded-full overflow-hidden mt-8">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-[#155799] to-[#159957]"
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* 2. HOME PAGE (JEKYLL CAYMAN THEME) */}
        {currentScreen === "home" && (
          <div className="relative">
            {/* Cayman Theme Page Header Banner */}
            <section className="bg-gradient-to-r from-[#155799] to-[#159957] text-white py-16 sm:py-24 px-6 text-center shadow-lg relative overflow-hidden">
              {/* Subtle visual grid lines to simulate static pages feel */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
              
              <div className="max-w-4xl mx-auto relative z-10">
                <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white drop-shadow-sm">
                  Travel Planner AI
                </h1>
                <h2 className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-normal leading-relaxed mt-4 mb-8 drop-shadow-sm">
                  Seu agente inteligente de viagens que gera roteiros personalizados, estimativas de custos e comparações de hospedagem com o visual oficial do tema Jekyll Cayman.
                </h2>
                
                {/* Cayman-style action buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    id="btn-start-planning"
                    onClick={() => setCurrentScreen("wizard")}
                    className="px-5 py-2.5 rounded-lg border border-white/20 bg-white/10 text-white font-semibold text-xs hover:bg-white/20 hover:border-white/40 transition-all shadow-sm cursor-pointer"
                  >
                    Começar Planejamento
                  </button>
                  <button
                    id="btn-ver-exemplo"
                    onClick={handleLoadDemo}
                    className="px-5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white/95 font-semibold text-xs hover:bg-white/15 hover:border-white/30 transition-all shadow-sm cursor-pointer"
                  >
                    Ver Exemplo Pronto
                  </button>
                  <a
                    href="https://github.com/jasonlong/cayman-theme"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white/80 font-semibold text-xs hover:bg-white/10 hover:text-white hover:border-white/20 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>Jekyll Cayman Theme</span>
                  </a>
                </div>
              </div>
            </section>

            {/* Cayman Theme Main Content Container */}
            <ResponsiveContainer className="max-w-[1012px] mx-auto px-4 sm:px-8 py-12 space-y-16 relative z-10">
              
              {/* Introduction Text Block */}
              <div className="prose prose-slate max-w-none text-left bg-white border border-slate-200/80 p-8 sm:p-10 rounded-2xl shadow-sm">
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#159957] border-b border-slate-200/80 pb-2 flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-[#159957] shrink-0" />
                  <span>Sobre o Agente Inteligente</span>
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mt-4">
                  O <strong>Travel Planner AI</strong> é um software de simulação inteligente integrado que ajuda viajantes a automatizarem seu planejamento financeiro e logístico. Com apenas alguns cliques, configure preferências, simule opções de hospedagem, calcule estimativas locais com câmbio e receba um roteiro detalhado completo.
                </p>
                <blockquote className="border-l-4 border-[#159957] bg-slate-50 p-4 rounded-r-xl text-xs text-slate-500 italic mt-6">
                  &ldquo;A inteligência de curadoria do sistema permite simular o custo de vida local histórico de centenas de destinos em poucos segundos, eliminando horas de pesquisa manual.&rdquo;
                </blockquote>
              </div>

              {/* Benefits Section styled cleanly with Jekyll Cayman colors */}
              <div className="space-y-6 text-left">
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#159957] border-b border-slate-200/80 pb-2">
                  Funcionalidades do Sistema
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Roteiro Personalizado",
                      desc: "Dias customizados de ponta a ponta com base nos seus interesses e no ritmo escolhido.",
                      icon: <Compass className="w-5 h-5 text-[#1e6bb8]" />,
                    },
                    {
                      title: "Estimativa de Custos",
                      desc: "Valores simulados reais para passagens, hotéis, alimentação e gastos diários localizados.",
                      icon: <Wallet className="w-5 h-5 text-[#159957]" />,
                    },
                    {
                      title: "Comparação de Hospedagens",
                      desc: "Quadro comparativo de custos, prós e contras entre Hotéis, Airbnb, Hostels e Resorts.",
                      icon: <Home className="w-5 h-5 text-rose-600" />,
                    },
                    {
                      title: "PDF por E-mail",
                      desc: "Receba o material de planejamento no seu endereço de e-mail formatado em folha A4 oficial.",
                      icon: <Mail className="w-5 h-5 text-sky-600" />,
                    },
                    {
                      title: "Sem Cadastro Prévio",
                      desc: "Utilize toda a infraestrutura de planejamento sem barreiras, passwords ou formulários demorados.",
                      icon: <ShieldCheck className="w-5 h-5 text-violet-600" />,
                    },
                    {
                      title: "Planejamento em Minutos",
                      desc: "Nosso motor de cálculo estruturado e IA organizam dados locais instantaneamente.",
                      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
                    },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className="p-6 bg-white border border-slate-200 hover:border-[#1e6bb8]/40 hover:shadow-md rounded-xl transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                        {card.icon}
                      </div>
                      <h3 className="font-display font-bold text-base text-slate-800">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">
                        {card.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* How it works section */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-left space-y-6">
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#159957] border-b border-slate-200/80 pb-2">
                  Como funciona?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
                  <div className="space-y-2">
                    <div className="text-xs font-mono font-bold text-[#1e6bb8] bg-[#1e6bb8]/10 px-2.5 py-1 rounded inline-block">
                      ETAPA 1
                    </div>
                    <h4 className="font-display font-bold text-sm text-slate-800">Insira Suas Preferências</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Informe datas, estilo de hospedagem, orçamento e interesses favoritos.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs font-mono font-bold text-[#159957] bg-[#159957]/10 px-2.5 py-1 rounded inline-block">
                      ETAPA 2
                    </div>
                    <h4 className="font-display font-bold text-sm text-slate-800">Cálculo e Curadoria</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">O motor de simulação processa as cotações e monta a planilha financeira ideal.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-mono font-bold text-[#1e6bb8] bg-[#1e6bb8]/10 px-2.5 py-1 rounded inline-block">
                      ETAPA 3
                    </div>
                    <h4 className="font-display font-bold text-sm text-slate-800">Roteiro Completo</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Visualize os pontos turísticos, baixe um arquivo ou receba o documento por e-mail.</p>
                  </div>
                </div>
              </div>

              {/* Premium Features banner */}
              <div className="text-center border border-dashed border-[#159957]/40 p-5 rounded-xl bg-white max-w-xl mx-auto flex items-center justify-center space-x-3 shadow-sm">
                <Sparkles className="w-5 h-5 text-[#159957] shrink-0" />
                <span className="text-xs text-slate-500 leading-relaxed">
                  <strong>Premium em Breve:</strong> Integração com passagens reais, alertas de preço, IA avançada e sincronização do roteiro com o Google Agenda.
                </span>
              </div>
            </ResponsiveContainer>
          </div>
        )}

        {/* 3. WIZARD DE PLANEJAMENTO (ETAPAS 1-6) */}
        {currentScreen === "wizard" && (
          <ResponsiveContainer>
            <div className="max-w-3xl mx-auto">
              
              {/* Back Button */}
              <button
                onClick={handlePrevStep}
                className="mb-6 inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-all bg-white/45 backdrop-blur-sm px-3.5 py-2 border border-white/60 rounded-xl shadow-sm hover:bg-white/60"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{wizardStep === 1 ? "Voltar para Home" : "Etapa Anterior"}</span>
              </button>

              {/* Stepper progress indicator */}
              <ProgressStepper
                currentStep={wizardStep}
                totalSteps={6}
                stepLabels={[
                  "Dados da viagem",
                  "Estilo",
                  "Interesses",
                  "Hospedagem",
                  "Transporte",
                  "Alimentação",
                ]}
              />

              {/* Card wrapper for Wizard Steps */}
              <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-xl">
                
                {/* STEP 1: DADOS GERAIS DA VIAGEM */}
                {wizardStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                        Fale sobre a viagem dos seus sonhos
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Estes dados básicos ajudam a calcular passagens locais, taxas de câmbio e orçamentos recomendados.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                      {/* Destination */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 mr-1" />
                          Destino Desejado <span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <input
                          id="input-destination"
                          type="text"
                          value={formData.destination}
                          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                          placeholder="Ex: Paris, Roma, Gramado, Orlando..."
                          className={`w-full px-4 py-3 text-sm rounded-xl border ${
                            errors.destination ? "border-rose-500 bg-rose-50/20" : "glass-input"
                          } focus:outline-none`}
                        />
                        {errors.destination && (
                          <span className="text-[10px] font-bold text-rose-500 mt-1 block flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" /> {errors.destination}
                          </span>
                        )}
                      </div>

                      {/* Departure City */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                          <Map className="w-3.5 h-3.5 text-slate-400 mr-1" />
                          Cidade de Saída <span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <input
                          id="input-departureCity"
                          type="text"
                          value={formData.departureCity}
                          onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                          placeholder="Ex: São Paulo, Rio de Janeiro..."
                          className={`w-full px-4 py-3 text-sm rounded-xl border ${
                            errors.departureCity ? "border-rose-500 bg-rose-50/20" : "glass-input"
                          } focus:outline-none`}
                        />
                        {errors.departureCity && (
                          <span className="text-[10px] font-bold text-rose-500 mt-1 block flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" /> {errors.departureCity}
                          </span>
                        )}
                      </div>

                      {/* Estimated Country */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          País de Origem
                        </label>
                        <input
                          type="text"
                          value={formData.originCountry}
                          onChange={(e) => setFormData({ ...formData, originCountry: e.target.value })}
                          placeholder="Ex: Brasil"
                          className="w-full px-4 py-3 text-sm rounded-xl glass-input focus:outline-none"
                        />
                      </div>

                      {/* Time until trip dropdown selector */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Daqui a quanto tempo pretende viajar?
                        </label>
                        <select
                          value={formData.timeUntilTrip}
                          onChange={(e) => setFormData({ ...formData, timeUntilTrip: e.target.value })}
                          className="w-full px-4 py-3 text-sm rounded-xl glass-input focus:outline-none"
                        >
                          <option value="1 mês">1 mês (Curto prazo)</option>
                          <option value="3 meses">3 meses</option>
                          <option value="6 meses">6 meses (Recomendado)</option>
                          <option value="12 meses">12 meses (Longo prazo)</option>
                        </select>
                      </div>

                      {/* Date Estimated Input */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Data Estimada da Viagem
                        </label>
                        <input
                          type="date"
                          value={formData.estimatedDate}
                          onChange={(e) => setFormData({ ...formData, estimatedDate: e.target.value })}
                          className="w-full px-4 py-3 text-sm rounded-xl glass-input focus:outline-none"
                        />
                      </div>

                      {/* Quantidade de Dias */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1" />
                          Quantidade de Dias <span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={formData.daysCount}
                          onChange={(e) => setFormData({ ...formData, daysCount: parseInt(e.target.value) || 1 })}
                          className={`w-full px-4 py-3 text-sm rounded-xl border ${
                            errors.daysCount ? "border-rose-500" : "glass-input"
                          } focus:outline-none`}
                        />
                        {errors.daysCount && (
                          <span className="text-[10px] font-bold text-rose-500 mt-1 block">
                            {errors.daysCount}
                          </span>
                        )}
                      </div>

                      {/* Quantidade de Pessoas */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                          <Users className="w-3.5 h-3.5 text-slate-400 mr-1" />
                          Quantidade de Pessoas <span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={formData.peopleCount}
                          onChange={(e) => setFormData({ ...formData, peopleCount: parseInt(e.target.value) || 1 })}
                          className={`w-full px-4 py-3 text-sm rounded-xl border ${
                            errors.peopleCount ? "border-rose-500" : "glass-input"
                          } focus:outline-none`}
                        />
                        {errors.peopleCount && (
                          <span className="text-[10px] font-bold text-rose-500 mt-1 block">
                            {errors.peopleCount}
                          </span>
                        )}
                      </div>

                      {/* Moeda preferred */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                          <Coins className="w-3.5 h-3.5 text-slate-400 mr-1" />
                          Moeda para Visualização
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                          className="w-full px-4 py-3 text-sm rounded-xl glass-input focus:outline-none"
                        >
                          <option value="BRL (R$)">BRL (R$)</option>
                          <option value="USD ($)">USD ($)</option>
                          <option value="EUR (€)">EUR (€)</option>
                        </select>
                      </div>

                      {/* Orçamento Aproximado */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                          <Wallet className="w-3.5 h-3.5 text-slate-400 mr-1" />
                          Orçamento Máximo Total ({formData.currency.split(" ")[0]})
                        </label>
                        <input
                          type="number"
                          step="500"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                          className={`w-full px-4 py-3 text-sm rounded-xl border ${
                            errors.budget ? "border-rose-500" : "glass-input"
                          } focus:outline-none`}
                        />
                        {errors.budget && (
                          <span className="text-[10px] font-bold text-rose-500 mt-1 block">
                            {errors.budget}
                          </span>
                        )}
                      </div>

                      {/* Email for PDF Delivery */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                          <Mail className="w-3.5 h-3.5 text-slate-400 mr-1" />
                          Seu E-mail <span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <input
                          id="input-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Ex: seu-email@gmail.com"
                          className={`w-full px-4 py-3 text-sm rounded-xl border ${
                            errors.email ? "border-rose-500 bg-rose-50/20" : "glass-input"
                          } focus:outline-none`}
                        />
                        {errors.email && (
                          <span className="text-[10px] font-bold text-rose-500 mt-1 block flex items-center">
                            <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.email}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 block mt-1">O roteiro em PDF será gerado e enviado para este e-mail.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: ESTILO DE VIAGEM */}
                {wizardStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                        Qual o estilo da sua viagem?
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Selecione a opção que melhor se aproxima do seu perfil para calibrarmos acomodações e passeios recomendados.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      {travelStyles.map((style) => (
                        <SelectableCard
                          key={style.title}
                          title={style.title}
                          subtitle={style.desc}
                          icon={style.icon}
                          badge={style.badge}
                          selected={formData.style === style.title}
                          onClick={() => {
                            setFormData({ ...formData, style: style.title });
                            setErrors({});
                          }}
                        />
                      ))}
                    </div>

                    {errors.style && (
                      <span className="text-xs font-bold text-rose-500 block pt-2">
                        {errors.style}
                      </span>
                    )}
                  </div>
                )}

                {/* STEP 3: INTERESSES / SELEÇÃO MÚLTIPLA */}
                {wizardStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                        O que você mais quer ver e fazer?
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Selecione as atrações que mais combinam com você. Selecione quantas quiser.
                      </p>
                    </div>

                    {errors.interests && (
                      <div className="p-4 rounded-xl bg-rose-500/10 backdrop-blur-sm border border-rose-200 text-xs text-rose-900 flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>{errors.interests}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {interestsList.map((interest) => {
                        const isSelected = formData.interests.includes(interest.name);
                        return (
                          <div
                            key={interest.name}
                            onClick={() => handleToggleInterest(interest.name)}
                            className={`p-3.5 rounded-xl border text-center cursor-pointer select-none transition-all duration-300 flex items-center space-x-2.5 ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500/10 backdrop-blur-sm text-emerald-950 font-bold shadow-sm"
                                : "border-white/60 bg-white/40 backdrop-blur-sm text-slate-600 hover:bg-white/60 hover:border-white/80"
                            }`}
                          >
                            <span className="text-lg">{interest.emoji}</span>
                            <span className="text-xs text-left truncate leading-tight">{interest.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 4: HOSPEDAGEM PREFERIDA */}
                {wizardStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                        Preferências de Hospedagem
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Estes ajustes auxiliam na montagem do comparativo de estadia do destino.
                      </p>
                    </div>

                    <div className="space-y-6 pt-4">
                      {/* Lodging Option Selectable Grid */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                          Tipo de Hospedagem Preferido
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            { name: "Hotel", icon: <Building2 className="w-4 h-4" /> },
                            { name: "Airbnb", icon: <Home className="w-4 h-4" /> },
                            { name: "Hostel", icon: <Users className="w-4 h-4" /> },
                            { name: "Resort", icon: <Award className="w-4 h-4" /> },
                            { name: "Pacote de viagem", icon: <FileText className="w-4 h-4" /> },
                            { name: "Ainda não sei", icon: <Compass className="w-4 h-4" /> },
                          ].map((item) => (
                            <div
                              key={item.name}
                              onClick={() => setFormData({ ...formData, accommodationType: item.name })}
                              className={`p-3 rounded-xl border text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-1.5 ${
                                formData.accommodationType === item.name
                                  ? "border-emerald-500 bg-emerald-500/10 backdrop-blur-sm font-bold text-emerald-950"
                                  : "border-white/60 bg-white/40 backdrop-blur-sm text-slate-500 hover:bg-white/60 hover:border-white/80"
                              }`}
                            >
                              {item.icon}
                              <span className="text-xs leading-none">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Preference checklist queries */}
                      <div className="border-t border-white/40 pt-5 space-y-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Ajustes e Exigências
                        </label>

                        {/* Dropdown priority comfort */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-white/40 gap-2">
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-slate-700">Foco de escolha</h4>
                            <p className="text-[10px] text-slate-400">Qual o fator mais determinante para as recomendações de hotéis?</p>
                          </div>
                          <select
                            value={formData.accommodationPref.priority}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                accommodationPref: {
                                  ...formData.accommodationPref,
                                  priority: e.target.value as "economy" | "comfort" | "luxury",
                                },
                              })
                            }
                            className="text-xs font-bold text-slate-700 px-3 py-1.5 rounded-lg border border-white/60 glass-input focus:outline-none"
                          >
                            <option value="economy">Máxima Economia</option>
                            <option value="comfort">Conforto Moderado (Custo-Benefício)</option>
                            <option value="luxury">Luxo e Localização Premium</option>
                          </select>
                        </div>

                        {/* Near Center toggle */}
                        <div className="flex justify-between items-center py-2 border-b border-white/40">
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-slate-700">Ficar perto do centro?</h4>
                            <p className="text-[10px] text-slate-400">Fácil acesso a museus históricos e vida comercial.</p>
                          </div>
                          <button
                            onClick={() =>
                              setFormData({
                                ...formData,
                                accommodationPref: {
                                  ...formData.accommodationPref,
                                  nearCenter: !formData.accommodationPref.nearCenter,
                                },
                              })
                            }
                            className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${
                              formData.accommodationPref.nearCenter ? "bg-emerald-500" : "bg-slate-300/60 border border-white/10"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${
                                formData.accommodationPref.nearCenter ? "right-1" : "left-1"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Near Transit toggle */}
                        <div className="flex justify-between items-center py-2 border-b border-white/40">
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-slate-700">Perto de transporte público?</h4>
                            <p className="text-[10px] text-slate-400">Facilidade de usar metrôs, bondes ou linhas de ônibus locais.</p>
                          </div>
                          <button
                            onClick={() =>
                              setFormData({
                                ...formData,
                                accommodationPref: {
                                  ...formData.accommodationPref,
                                  nearTransit: !formData.accommodationPref.nearTransit,
                                },
                              })
                            }
                            className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${
                              formData.accommodationPref.nearTransit ? "bg-emerald-500" : "bg-slate-300/60 border border-white/10"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${
                                formData.accommodationPref.nearTransit ? "right-1" : "left-1"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Shared Allowed toggle */}
                        <div className="flex justify-between items-center py-2">
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-slate-700">Aceita hospedagem compartilhada?</h4>
                            <p className="text-[10px] text-slate-400">Ex: Quartos coletivos de hostels ou cômodos privados em casas locais.</p>
                          </div>
                          <button
                            onClick={() =>
                              setFormData({
                                ...formData,
                                accommodationPref: {
                                  ...formData.accommodationPref,
                                  sharedAllowed: !formData.accommodationPref.sharedAllowed,
                                },
                              })
                            }
                            className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${
                              formData.accommodationPref.sharedAllowed ? "bg-emerald-500" : "bg-slate-300/60 border border-white/10"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${
                                formData.accommodationPref.sharedAllowed ? "right-1" : "left-1"
                              }`}
                            />
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: TRANSPORTE PREFERIDO */}
                {wizardStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                        Opções de Transporte Local
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Como você prefere se deslocar de um ponto turístico para outro durante os passeios diários?
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                      {[
                        { name: "Transporte público", desc: "Metrô e Ônibus", icon: <Users className="w-4 h-4" /> },
                        { name: "Trem", desc: "Intermunicipal", icon: <Activity className="w-4 h-4" /> },
                        { name: "Metrô", desc: "Rápido e prático", icon: <Compass className="w-4 h-4" /> },
                        { name: "Uber / Táxi", desc: "Conforto porta a porta", icon: <Car className="w-4 h-4" /> },
                        { name: "Carro alugado", desc: "Total flexibilidade", icon: <ArrowRight className="w-4 h-4" /> },
                        { name: "Bicicleta", desc: "Saudável e livre", icon: <Sparkles className="w-4 h-4" /> },
                        { name: "Caminhada", desc: "Explorar a pé", icon: <Compass className="w-4 h-4" /> },
                        { name: "Melhor opção automática", desc: "Otimizado pelo agente", icon: <Check className="w-4 h-4" />, highlight: true },
                      ].map((item) => (
                        <div
                          key={item.name}
                          onClick={() => setFormData({ ...formData, transportOption: item.name })}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between h-24 ${
                            formData.transportOption === item.name
                              ? "border-emerald-500 bg-emerald-500/10 backdrop-blur-sm font-bold text-emerald-950 shadow-sm"
                              : "border-white/60 bg-white/40 backdrop-blur-sm text-slate-500 hover:bg-white/60 hover:border-white/80"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="p-1.5 rounded-lg bg-white/50 border border-white/50 text-slate-600">{item.icon}</span>
                            {item.highlight && <span className="text-[8px] uppercase tracking-wider bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold">Recomendado</span>}
                          </div>
                          <div>
                            <span className="text-xs font-bold block leading-tight">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal block truncate mt-0.5">{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: ALIMENTAÇÃO */}
                {wizardStep === 6 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                        Alimentação & Experiências Gastronômicas
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Estes últimos ajustes determinam a fatia do orçamento designada para as refeições diárias recomendadas.
                      </p>
                    </div>

                    <div className="space-y-6 pt-4">
                      {/* Food Options Row */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                          Nível de Gastronomia
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { name: "Econômico", desc: "Fast food, mercados e lanchonetes", icon: <Coins className="w-4 h-4" /> },
                            { name: "Médio", desc: "Restaurantes cotidianos honestos", icon: <Coffee className="w-4 h-4" /> },
                            { name: "Premium", desc: "Alimentação sofisticada e requinte", icon: <Award className="w-4 h-4" /> },
                            { name: "Experiência gastronômica", desc: "Restaurantes estrelados Michelin", icon: <Sparkles className="w-4 h-4" /> },
                          ].map((item) => (
                            <div
                              key={item.name}
                              onClick={() => setFormData({ ...formData, mealsOption: item.name })}
                              className={`p-3 rounded-xl border text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-1.5 ${
                                formData.mealsOption === item.name
                                  ? "border-emerald-500 bg-emerald-500/10 backdrop-blur-sm font-bold text-emerald-950"
                                  : "border-white/60 bg-white/40 backdrop-blur-sm text-slate-500 hover:bg-white/60 hover:border-white/80"
                              }`}
                            >
                              {item.icon}
                              <span className="text-xs font-bold leading-tight mt-1">{item.name}</span>
                              <span className="text-[9px] text-slate-400 font-normal leading-tight line-clamp-2">{item.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Meals preferences queries */}
                      <div className="border-t border-white/40 pt-5 space-y-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Ajustes de Alimentação Diária
                        </label>

                        {/* Meals count slider input */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-white/40 gap-2">
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-slate-700">Refeições completas por dia?</h4>
                            <p className="text-[10px] text-slate-400">Excluindo pequenos lanches.</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4].map((num) => (
                              <button
                                key={num}
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    mealsPref: {
                                      ...formData.mealsPref,
                                      mealsPerDay: num,
                                    },
                                  })
                                }
                                className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors duration-200 ${
                                  formData.mealsPref.mealsPerDay === num
                                    ? "bg-emerald-500 text-white shadow-sm"
                                    : "bg-white/45 backdrop-blur-sm text-slate-600 border border-white/60 hover:bg-white/60"
                                }`}
                              >
                                {num}x
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Pretende cozinhar toggle */}
                        <div className="flex justify-between items-center py-2 border-b border-white/40">
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-slate-700">Pretende cozinhar na estadia?</h4>
                            <p className="text-[10px] text-slate-400">Economiza significativamente comprando ingredientes locais.</p>
                          </div>
                          <button
                            onClick={() =>
                              setFormData({
                                ...formData,
                                mealsPref: {
                                  ...formData.mealsPref,
                                  cooksMeals: !formData.mealsPref.cooksMeals,
                                },
                              })
                            }
                            className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${
                              formData.mealsPref.cooksMeals ? "bg-emerald-500" : "bg-slate-300/60 border border-white/10"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${
                                formData.mealsPref.cooksMeals ? "right-1" : "left-1"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Goes to Restaurants toggle */}
                        <div className="flex justify-between items-center py-2">
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-slate-700">Pretende frequentar restaurantes renomados?</h4>
                            <p className="text-[10px] text-slate-400">Fatia dedicada para pratos de alta gastronomia local.</p>
                          </div>
                          <button
                            onClick={() =>
                              setFormData({
                                ...formData,
                                mealsPref: {
                                  ...formData.mealsPref,
                                  goesToRestaurants: !formData.mealsPref.goesToRestaurants,
                                },
                              })
                            }
                            className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${
                              formData.mealsPref.goesToRestaurants ? "bg-emerald-500" : "bg-slate-300/60 border border-white/10"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${
                                formData.mealsPref.goesToRestaurants ? "right-1" : "left-1"
                              }`}
                            />
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation actions footer */}
                <div className="mt-8 pt-6 border-t border-white/40 flex justify-between items-center">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 rounded-xl border border-white/60 bg-white/45 backdrop-blur-sm text-slate-600 font-bold text-xs hover:bg-white/60 transition-colors"
                  >
                    Voltar
                  </button>

                  <button
                    id="btn-next-step"
                    onClick={handleNextStep}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center space-x-2 shadow-md shadow-emerald-500/10 hover:translate-y-[-1px]"
                  >
                    <span>{wizardStep === 6 ? "Gerar Planejamento" : "Continuar"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          </ResponsiveContainer>
        )}

        {/* 4. PROCESSING / LOADING CHECKLIST PAGE */}
        {currentScreen === "processing" && (
          <ResponsiveContainer className="flex flex-col items-center justify-center py-20">
            <div className="w-full max-w-md glass-card rounded-3xl p-8 text-center relative overflow-hidden shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/30">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300"
                  style={{ width: `${((processingIndex + 1) / processingSteps.length) * 100}%` }}
                />
              </div>

              {/* Animated Spinner Icon */}
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-white/30" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                <Compass className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>

              <h2 className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
                Análise de Roteiro Inteligente
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Aguarde um momento enquanto consolidamos dados locais para {formData.destination || "seu destino"}...
              </p>

              {/* Checklist animado items */}
              <div className="text-left mt-8 space-y-3.5 border-t border-white/40 pt-6">
                {processingSteps.map((step, idx) => {
                  const isCompleted = idx < processingIndex;
                  const isActive = idx === processingIndex;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center space-x-3 transition-opacity duration-300 ${
                        isCompleted ? "opacity-100" : isActive ? "opacity-100 font-semibold" : "opacity-30"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isActive ? (
                          <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300" />
                        )}
                      </div>
                      <span className="text-xs text-slate-700 truncate">{step}</span>
                    </div>
                  );
                })}
              </div>

            </div>
          </ResponsiveContainer>
        )}

        {/* 5. RESULT PAGE (DASHBOARD) */}
        {currentScreen === "result" && generatedPlan && (
          <ResponsiveContainer className="space-y-8">
            
            {/* Top Command Banner Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-card p-5 rounded-3xl shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center border border-emerald-500/20 shadow-sm">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-slate-900 text-sm">Roteiro Completo Pronto!</h3>
                  <p className="text-xs text-slate-400 font-medium">Recomendado para {formData.email}</p>
                </div>
              </div>

              {/* Action Buttons to print/pdf */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  id="btn-baixar-pdf"
                  onClick={handleDownloadPdf}
                  className="flex-grow md:flex-grow-0 px-4 py-2.5 rounded-xl border border-white/60 bg-white/45 backdrop-blur-sm text-slate-700 hover:bg-white/60 hover:border-white/80 transition-colors font-bold text-xs flex items-center justify-center space-x-2"
                >
                  <FileDown className="w-4 h-4 text-slate-500" />
                  <span>Baixar Roteiro (.txt)</span>
                </button>

                <button
                  id="btn-visualizar-pdf"
                  onClick={() => setShowPdfModal(true)}
                  className="flex-grow md:flex-grow-0 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/10 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ver PDF Completo</span>
                </button>

                <button
                  onClick={handleResetPlanner}
                  className="flex-grow md:flex-grow-0 px-4 py-2.5 rounded-xl bg-slate-200/50 hover:bg-slate-200 text-slate-600 font-semibold text-xs border border-white/40 backdrop-blur-sm transition-colors flex items-center justify-center"
                >
                  Nova Viagem
                </button>
              </div>
            </div>

            {/* Grid 1: Summary Card and Budget Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <TravelSummaryCard plan={generatedPlan} />
              </div>
              <div className="lg:col-span-5">
                <CostCard
                  estimate={generatedPlan.costEstimate}
                  currency={generatedPlan.localCurrency}
                />
              </div>
            </div>

            {/* Section: Comparative Lodging */}
            <ComparisonCard
              options={generatedPlan.accommodations}
              currencySymbol={generatedPlan.localCurrency.split(" ")[0]}
              preferredType={formData.accommodationType}
            />

            {/* Grid 2: Daily Itinerary & Imperdível Spots */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Daily Itinerary days accordion */}
              <div className="lg:col-span-8 space-y-4">
                <div className="border-b border-white/40 pb-3 mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-800">Roteiro Sugerido Dia a Dia</h3>
                    <p className="text-xs text-slate-400 mt-1">Organizado de forma cronológica para otimizar tempo de locomoção.</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    {generatedPlan.daysCount} dias gerados
                  </span>
                </div>

                <div className="space-y-4">
                  {generatedPlan.itinerary.map((day, idx) => (
                    <ItineraryDayCard
                      key={day.dayNumber}
                      day={day}
                      currencySymbol={generatedPlan.localCurrency.split(" ")[0]}
                      defaultExpanded={idx === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar Spots to visit */}
              <div className="lg:col-span-4 space-y-6">
                <div className="border-b border-white/40 pb-3 mb-6">
                  <h3 className="font-display font-bold text-xl text-slate-800">Lugares Imperdíveis</h3>
                  <p className="text-xs text-slate-400 mt-1">Visitas absolutamente obrigatórias que valem cada centavo.</p>
                </div>

                <div className="space-y-6">
                  {generatedPlan.spots.map((spot, idx) => (
                    <div
                      key={idx}
                      className="glass-card rounded-3xl overflow-hidden shadow-sm group hover:scale-[1.01] transition-all duration-300"
                    >
                      <div className="relative h-44 w-full bg-slate-200 overflow-hidden">
                        <img
                          src={spot.imageUrl}
                          alt={spot.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-slate-900/60 backdrop-blur-md text-white font-display font-black text-xs px-2.5 py-1 rounded-lg">
                          Dica #{idx + 1}
                        </div>
                      </div>

                      <div className="p-5">
                        <h4 className="font-display font-extrabold text-base text-slate-800">
                          {spot.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          {spot.description}
                        </p>
                        
                        <div className="border-t border-white/20 pt-3 mt-4 text-[11px] text-slate-500 leading-relaxed italic bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 backdrop-blur-sm">
                          <strong>Por que ir:</strong> &ldquo;{spot.reason}&rdquo;
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Checklist Component */}
            <ChecklistItem
              items={generatedPlan.checklist}
              onToggle={handleToggleChecklistItem}
            />

            {/* Bottom Actions footer */}
            <div className="flex justify-center py-6 border-t border-white/40 gap-4">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setCurrentScreen("wizard");
                }}
                className="px-6 py-3.5 rounded-xl border border-white/60 bg-white/45 backdrop-blur-sm text-slate-600 hover:bg-white/60 hover:border-white/80 transition-all font-bold text-xs"
              >
                Gerar Nova Viagem
              </button>

              <button
                onClick={() => setShowPdfModal(true)}
                className="px-8 py-3.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/15"
              >
                Enviar Roteiro por E-mail
              </button>
            </div>

          </ResponsiveContainer>
        )}

        {/* 6. SUCCESS PAGE */}
        {currentScreen === "success" && (
          <ResponsiveContainer className="flex flex-col items-center justify-center py-20 text-center">
            <div className="max-w-md glass-card rounded-3xl shadow-xl p-8 sm:p-10 relative overflow-hidden flex flex-col items-center">
              
              <div className="absolute right-[-40px] top-[-40px] w-32 h-32 bg-emerald-500/10 rounded-full blur-xl" />

              {/* Checked/Send Animated Icon badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mb-6 relative backdrop-blur-sm">
                <Send className="w-7 h-7" />
              </div>

              <span className="px-3 py-1 text-[10px] font-extrabold bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 rounded-full uppercase tracking-wider mb-3 backdrop-blur-sm">
                Sucesso!
              </span>

              <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight leading-tight">
                Seu planejamento foi enviado com sucesso.
              </h2>
              
              <p className="text-xs text-slate-400 leading-relaxed mt-3 px-2">
                O arquivo PDF oficial formatado para impressão foi enviado para o endereço de e-mail cadastrado:
              </p>

              <div className="my-5 px-4 py-2.5 rounded-xl bg-white/40 border border-white/60 text-xs font-mono font-bold text-slate-700 w-full truncate backdrop-blur-sm">
                {formData.email}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                <button
                  onClick={() => {
                    handleResetPlanner();
                  }}
                  className="w-full px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
                >
                  Criar Nova Viagem
                </button>

                <button
                  onClick={() => {
                    setWizardStep(1);
                    setCurrentScreen("home");
                  }}
                  className="w-full px-5 py-3 rounded-xl bg-white/45 border border-white/60 hover:bg-white/60 text-slate-700 font-bold text-xs backdrop-blur-sm transition-all cursor-pointer"
                >
                  Voltar para Home
                </button>
              </div>

            </div>
          </ResponsiveContainer>
        )}

      </main>

      {/* PDF PREVIEW MODAL RENDERING */}
      {showPdfModal && generatedPlan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col justify-between">
            
            {/* Modal Header bar */}
            <div className="p-5 border-b border-white/40 flex justify-between items-center bg-white/20 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 backdrop-blur-sm">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm text-slate-800">Prévia do PDF de Viagem</h3>
                  <p className="text-[10px] text-slate-400">Verifique a diagramação do documento antes de disparar o e-mail.</p>
                </div>
              </div>

              <button
                onClick={() => setShowPdfModal(false)}
                className="p-1.5 rounded-lg bg-white/50 border border-white/60 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Document area container */}
            <div className="p-6 bg-white/10 flex justify-center border-b border-white/40 max-h-[480px] overflow-y-auto">
              <PDFPreviewCard plan={generatedPlan} />
            </div>

            {/* Modal Actions Footer */}
            <div className="p-5 bg-white/20 backdrop-blur-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Enviar para:</span>
                <span className="text-xs font-semibold text-slate-700 truncate block max-w-[200px]">{formData.email}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowPdfModal(false)}
                  disabled={isEmailSending}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/60 bg-white/45 backdrop-blur-sm text-slate-600 hover:bg-white/60 font-bold text-xs disabled:opacity-50 transition-all cursor-pointer"
                >
                  Voltar
                </button>

                <button
                  id="btn-confirmar-envio"
                  onClick={handleSendEmail}
                  disabled={isEmailSending}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/15 flex items-center justify-center space-x-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isEmailSending ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirmar Envio</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-500 mt-16 text-xs text-center relative z-10">
        <ResponsiveContainer className="max-w-[1012px] mx-auto px-4 sm:px-8 space-y-4">
          <p className="site-footer-owner">
            Este site é mantido por <span className="font-semibold text-slate-700">peidinho16@gmail.com</span>. O projeto foi desenvolvido com o tema <a href="https://github.com/jasonlong/cayman-theme" target="_blank" rel="noopener noreferrer" className="text-[#1e6bb8] hover:underline font-bold">Jekyll Cayman</a>.
          </p>
          <p className="site-footer-credits text-[11px] text-slate-400">
            Gerado de forma inteligente com <span className="font-semibold text-[#159957]">Travel Planner AI</span> para a melhor experiência de planejamento de viagens.
          </p>
          <div className="text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-100">
            © 2026 Travel Planner AI. Hospedado via GitHub Pages.
          </div>
        </ResponsiveContainer>
      </footer>

    </div>
  );
}
