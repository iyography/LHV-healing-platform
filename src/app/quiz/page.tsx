"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = "intro" | "questions" | "open-response" | "contact" | "calculating" | "results";

type SpiritualPathType = "isolated" | "stagnated" | "bridgeReady";
type ChallengeType = "alignment" | "scaling" | "integration" | "community";
type ReadinessLevel = "exploring" | "committed" | "ready" | "transformation";
type InvestmentLevel = "free" | "low" | "medium" | "high";

interface QuizOption {
  text: string;
  tags?: {
    path?: SpiritualPathType;
    challenge?: ChallengeType;
    readiness?: ReadinessLevel;
    investment?: InvestmentLevel;
  };
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

// ─── Questions (Tony's 25-Question Quiz) ─────────────────────────────────────

const QUESTIONS: QuizQuestion[] = [
  // SPIRITUAL BUSINESS DIAGNOSTIC (1-5)
  {
    question: "When you think about your spiritual business, which resonates most?",
    options: [
      { text: "I feel like I'm building in isolation, without real community", tags: { path: "isolated" } },
      { text: "I have the spiritual knowledge but struggle with practical implementation", tags: { path: "stagnated" } },
      { text: "I'm ready to bridge spirituality and technology to serve others", tags: { path: "bridgeReady" } },
    ],
  },
  {
    question: "What's your biggest challenge as a spiritual entrepreneur?",
    options: [
      { text: "Feeling misaligned from my true purpose", tags: { challenge: "alignment" } },
      { text: "Can't scale my spiritual gifts into a sustainable business", tags: { challenge: "scaling" } },
      { text: "Struggle to integrate spirituality with modern technology", tags: { challenge: "integration" } },
      { text: "Building alone without supportive community", tags: { challenge: "community" } },
    ],
  },
  {
    question: "When it comes to using technology in your spiritual work:",
    options: [
      { text: "I avoid it - feels inauthentic to my spiritual path", tags: { path: "isolated" } },
      { text: "I want to use it but don't know how to integrate it meaningfully", tags: { path: "stagnated" } },
      { text: "I'm excited about the possibilities of spiritual-tech integration", tags: { path: "bridgeReady" } },
    ],
  },
  {
    question: "How do you currently connect with other spiritual entrepreneurs?",
    options: [
      { text: "I don't - I mostly work in isolation", tags: { path: "isolated" } },
      { text: "I try but struggle to find the right community", tags: { challenge: "community" } },
      { text: "I'm building connections and want deeper collaboration", tags: { path: "bridgeReady" } },
    ],
  },
  {
    question: "What would 'success' look like for your spiritual business in 60 days?",
    options: [
      { text: "Finding my authentic voice and purpose clarity", tags: { challenge: "alignment" } },
      { text: "Building a sustainable income from my spiritual gifts", tags: { challenge: "scaling" } },
      { text: "Creating a connected community of like-minded souls", tags: { challenge: "community" } },
      { text: "Seamlessly blending spirituality with cutting-edge tools", tags: { challenge: "integration" } },
    ],
  },
  // SPIRITUAL BUSINESS ALIGNMENT (6-10)
  {
    question: "When you wake up and think about your spiritual work:",
    options: [
      { text: "I feel disconnected from my purpose", tags: { path: "isolated" } },
      { text: "I have ideas but struggle to implement them", tags: { path: "stagnated" } },
      { text: "I'm excited about the possibilities ahead", tags: { path: "bridgeReady" } },
    ],
  },
  {
    question: "How do you feel about combining ancient spiritual wisdom with modern technology?",
    options: [
      { text: "Uncomfortable - they seem to conflict", tags: { path: "isolated" } },
      { text: "Intrigued but unsure how to do it authentically", tags: { path: "stagnated" } },
      { text: "Excited - I see them as natural allies", tags: { path: "bridgeReady" } },
    ],
  },
  {
    question: "What's the biggest gap between your spiritual vision and your current reality?",
    options: [
      { text: "I lack clarity on my unique spiritual gifts", tags: { challenge: "alignment" } },
      { text: "I can't turn my wisdom into sustainable income", tags: { challenge: "scaling" } },
      { text: "I feel isolated without a supportive community", tags: { challenge: "community" } },
      { text: "I can't leverage technology to amplify my impact", tags: { challenge: "integration" } },
    ],
  },
  {
    question: "When you imagine your ideal spiritual business:",
    options: [
      { text: "I see myself working alone, serving individuals deeply", tags: { path: "isolated" } },
      { text: "I have the vision but struggle with practical steps", tags: { path: "stagnated" } },
      { text: "I see connected communities co-creating transformation", tags: { path: "bridgeReady" } },
    ],
  },
  {
    question: "What's your relationship with spiritual authority and teaching?",
    options: [
      { text: "I avoid positioning myself as a teacher - feels inauthentic", tags: { path: "isolated" } },
      { text: "I have wisdom to share but struggle with confidence", tags: { path: "stagnated" } },
      { text: "I'm ready to step into spiritual leadership", tags: { path: "bridgeReady" } },
    ],
  },
  // SPIRITUAL BUSINESS CHALLENGES (11-15)
  {
    question: "When your spiritual business faces a setback, you:",
    options: [
      { text: "Question if this path is meant for you", tags: { challenge: "alignment" } },
      { text: "Worry about financial sustainability", tags: { challenge: "scaling" } },
      { text: "Feel frustrated with slow progress", tags: { challenge: "integration" } },
      { text: "Feel alone in the struggle", tags: { challenge: "community" } },
    ],
  },
  {
    question: "Which statement resonates most with your current spiritual business journey?",
    options: [
      { text: "I'm stuck between spiritual authenticity and business success", tags: { challenge: "alignment" } },
      { text: "I have followers but struggle to monetize ethically", tags: { challenge: "scaling" } },
      { text: "I resist technology because it feels disconnected from spirit", tags: { challenge: "integration" } },
      { text: "I'm building alone and feel isolated from peers", tags: { challenge: "community" } },
    ],
  },
  {
    question: "What's your biggest fear around growing your spiritual business?",
    options: [
      { text: "Losing my authentic spiritual connection", tags: { challenge: "alignment" } },
      { text: "Not being able to sustain it financially", tags: { challenge: "scaling" } },
      { text: "Technology making my work feel impersonal", tags: { challenge: "integration" } },
      { text: "Success isolating me from real community", tags: { challenge: "community" } },
    ],
  },
  {
    question: "When you imagine your spiritual business thriving, what excites you most?",
    options: [
      { text: "Being fully aligned with my soul's purpose", tags: { challenge: "alignment" } },
      { text: "Creating sustainable income from my gifts", tags: { challenge: "scaling" } },
      { text: "Using technology to reach souls worldwide", tags: { challenge: "integration" } },
      { text: "Building a transformational community", tags: { challenge: "community" } },
    ],
  },
  // SPIRITUAL BUSINESS READINESS & APPROACH (15-19)
  {
    question: "What kind of support does your spiritual business need most right now?",
    options: [
      { text: "Clarity on my unique spiritual gifts and offerings", tags: { challenge: "alignment" } },
      { text: "Practical systems to generate consistent income", tags: { challenge: "scaling" } },
      { text: "Technology that enhances rather than replaces human connection", tags: { challenge: "integration" } },
      { text: "Connection with other spiritual entrepreneurs", tags: { challenge: "community" } },
    ],
  },
  {
    question: "How do you usually handle spiritual business challenges?",
    options: [
      { text: "Retreat into meditation and inner work alone", tags: { path: "isolated" } },
      { text: "Research solutions but struggle to implement", tags: { path: "stagnated" } },
      { text: "Seek collaborative solutions with others", tags: { path: "bridgeReady" } },
    ],
  },
  {
    question: "How ready are you to invest time in building your spiritual business?",
    options: [
      { text: "I'm exploring but haven't fully committed", tags: { readiness: "exploring" } },
      { text: "I'm committed but need the right guidance", tags: { readiness: "committed" } },
      { text: "I'm ready to take serious action", tags: { readiness: "ready" } },
      { text: "I'm ready for complete transformation", tags: { readiness: "transformation" } },
    ],
  },
  {
    question: "How much time can you realistically dedicate to your spiritual business weekly?",
    options: [
      { text: "2-5 hours (exploring phase)", tags: { readiness: "exploring" } },
      { text: "5-15 hours (building phase)", tags: { readiness: "committed" } },
      { text: "15+ hours (growth phase)", tags: { readiness: "ready" } },
      { text: "Full-time dedication (transformation phase)", tags: { readiness: "transformation" } },
    ],
  },
  {
    question: "What feels most challenging about your spiritual entrepreneurship journey?",
    options: [
      { text: "Finding my authentic voice in a crowded market", tags: { challenge: "alignment" } },
      { text: "Balancing spiritual integrity with business success", tags: { challenge: "scaling" } },
      { text: "Keeping up with technology while staying heart-centered", tags: { challenge: "integration" } },
      { text: "Building without compromising my values", tags: { challenge: "community" } },
    ],
  },
  // TRANSFORMATION READINESS & INVESTMENT (20-23)
  {
    question: "What do you want help with FIRST in your spiritual business?",
    options: [
      { text: "Clarifying my unique spiritual gifts and message", tags: { challenge: "alignment" } },
      { text: "Building sustainable income streams", tags: { challenge: "scaling" } },
      { text: "Integrating technology authentically", tags: { challenge: "integration" } },
      { text: "Building genuine community and connections", tags: { challenge: "community" } },
    ],
  },
  {
    question: "How supported do you feel as a spiritual entrepreneur?",
    options: [
      { text: "Very isolated - building completely alone", tags: { path: "isolated" } },
      { text: "Somewhat supported but need more guidance", tags: { path: "stagnated" } },
      { text: "Well-supported and ready to collaborate", tags: { path: "bridgeReady" } },
    ],
  },
  {
    question: "When it comes to investing in your spiritual business growth, what feels most true?",
    options: [
      { text: "I need free resources and community support first", tags: { investment: "free" } },
      { text: "I could invest modestly in the right guidance", tags: { investment: "low" } },
      { text: "I'm open to meaningful investment in transformation", tags: { investment: "medium" } },
      { text: "I'm ready to invest significantly in building my legacy", tags: { investment: "high" } },
    ],
  },
  {
    question: "What kind of spiritual business guidance resonates most with you?",
    options: [
      { text: "Gentle, heart-centered approach", tags: { readiness: "exploring" } },
      { text: "Clear, step-by-step frameworks", tags: { readiness: "committed" } },
      { text: "Accelerated growth strategies", tags: { readiness: "ready" } },
      { text: "Complete business transformation", tags: { readiness: "transformation" } },
    ],
  },
];

// ─── Result Content ──────────────────────────────────────────────────────────

const SPIRITUAL_PATH_RESULTS: Record<SpiritualPathType, {
  title: string;
  subtitle: string;
  description: string[];
  helps: string[];
  doesntHelp: string[];
  startHere: string[];
  truth: string;
}> = {
  isolated: {
    title: "The Isolated Creator",
    subtitle: "You have gifts, but you're building alone.",
    description: [
      "You're a spiritual entrepreneur working in isolation, feeling disconnected from a supportive community.",
      "You have knowledge and wisdom, but you're missing the collaborative energy that amplifies impact.",
      "This often happens when you're building something meaningful but feel like you're the only one who 'gets it'.",
      "Your gifts are real. They just need the right community to flourish.",
    ],
    helps: [
      "Authentic spiritual community connection",
      "Collaborative creation spaces",
      "Shared vision and purpose alignment",
      "Gentle integration support",
    ],
    doesntHelp: [
      "More solo work",
      "Generic business advice",
      "Surface-level networking",
    ],
    startHere: [
      "Community-building frameworks",
      "Authentic connection practices",
      "Collaborative spiritual business models",
      "Soul-aligned partnerships",
    ],
    truth: "Spiritual transformation happens in relationship. Your gifts multiply when shared with the right souls.",
  },
  stagnated: {
    title: "The Visionary Stuck",
    subtitle: "You see the vision but struggle with implementation.",
    description: [
      "You have spiritual wisdom and business ideas, but translating them into practical action feels overwhelming.",
      "You're caught between ancient wisdom and modern technology, unsure how to bridge them authentically.",
      "Your vision is clear, but the path to manifestation feels foggy or blocked.",
    ],
    helps: [
      "Step-by-step implementation frameworks",
      "Spiritual-tech integration guides",
      "Practical manifestation tools",
      "Clear action pathways",
    ],
    doesntHelp: [
      "More planning without action",
      "Complex systems",
      "Tech-first approaches",
    ],
    startHere: [
      "Spiritual business blueprints",
      "Technology integration for soul work",
      "Practical manifestation methods",
      "Vision-to-reality frameworks",
    ],
    truth: "Your vision is sacred, but it needs grounded action. Spirit without structure remains just a dream.",
  },
  bridgeReady: {
    title: "The Bridge Builder",
    subtitle: "You're ready to unite spirituality with technology.",
    description: [
      "You see the powerful potential in combining ancient wisdom with modern tools.",
      "You're excited about creating transformational experiences that serve others at scale.",
      "You understand that technology can amplify spiritual impact when used consciously.",
      "You're ready to lead the new wave of conscious entrepreneurs.",
    ],
    helps: [
      "Advanced spiritual-tech frameworks",
      "Scaling transformation systems",
      "Community-building platforms",
      "Impact amplification strategies",
    ],
    doesntHelp: [
      "Basic spiritual practices alone",
      "Tech-only solutions",
      "Small-scale thinking",
    ],
    startHere: [
      "Conscious technology integration",
      "Scalable transformation systems",
      "Community platform development",
      "Impact measurement frameworks",
    ],
    truth: "You're here to bridge worlds. When spirituality and technology unite consciously, healing happens at scale.",
  },
};

const CHALLENGE_OVERLAYS: Record<ChallengeType, { label: string; description: string; focus: string }> = {
  alignment: {
    label: "Spiritual Alignment Challenge",
    description: "You're seeking clarity on your authentic spiritual gifts and how to share them with the world.",
    focus: "Purpose discovery, gift identification, authentic expression.",
  },
  scaling: {
    label: "Scaling Challenge",
    description: "You have spiritual wisdom but struggle to turn it into sustainable income and impact.",
    focus: "Business models, monetization, sustainable systems.",
  },
  integration: {
    label: "Spiritual-Tech Integration Challenge",
    description: "You want to use technology to amplify your spiritual work but don't know how to do it authentically.",
    focus: "Conscious technology, authentic automation, digital spirituality.",
  },
  community: {
    label: "Community Building Challenge",
    description: "You're building alone and need authentic connection with like-minded spiritual entrepreneurs.",
    focus: "Community creation, collaboration, partnership building.",
  },
};

// ─── Animation Variants ──────────────────────────────────────────────────────

const slideVariants = {
  enter: { x: 300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function QuizPage() {
  const [step, setStep] = useState<Step>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [openResponses, setOpenResponses] = useState({ ninetyDay: "", oneThingHelp: "" });
  const [contactForm, setContactForm] = useState({ fullName: "", email: "", phone: "" });
  const [calcText, setCalcText] = useState("Analyzing your spiritual path...");
  const [direction, setDirection] = useState(1);
  const [version, setVersion] = useState<1 | 2>(2);

  // Video source based on version
  const bgVideo = version === 1 ? "https://res.cloudinary.com/dzlnqcmqn/video/upload/v1770663329/heart_t8d5vn.mp4" : "https://res.cloudinary.com/dzlnqcmqn/video/upload/v1770663327/6_ytzsdd.mp4";

  // Computed results
  const [resultPath, setResultPath] = useState<SpiritualPathType>("isolated");
  const [resultChallenge, setResultChallenge] = useState<ChallengeType>("alignment");
  const [resultInvestment, setResultInvestment] = useState<InvestmentLevel>("free");

  const totalQuestions = QUESTIONS.length;

  // ─── Navigation helpers ──────────────────────────────────────────────────

  function goTo(next: Step) {
    setDirection(1);
    setStep(next);
  }

  function goBack() {
    setDirection(-1);
    if (step === "open-response") {
      setCurrentQuestion(QUESTIONS.length - 1);
      setStep("questions");
    } else if (step === "questions") {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
        setAnswers(answers.slice(0, -1));
      } else {
        setStep("intro");
      }
    }
  }

  // ─── Answer selection ────────────────────────────────────────────────────

  function selectAnswer(optionIndex: number) {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        setDirection(1);
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        goTo("open-response");
      }, 300);
    }
  }

  // ─── Scoring ─────────────────────────────────────────────────────────────

  function calculateResults() {
    const pathCounts: Record<SpiritualPathType, number> = { isolated: 0, stagnated: 0, bridgeReady: 0 };
    const challengeCounts: Record<ChallengeType, number> = { alignment: 0, scaling: 0, integration: 0, community: 0 };
    let investment: InvestmentLevel = "free";

    answers.forEach((optIdx, qIdx) => {
      const q = QUESTIONS[qIdx];
      if (!q || !q.options[optIdx]) return;
      const tags = q.options[optIdx].tags;
      if (!tags) return;

      if (tags.path) pathCounts[tags.path]++;
      if (tags.challenge) challengeCounts[tags.challenge]++;
      if (tags.investment) investment = tags.investment;
    });

    const sortedPaths = (Object.entries(pathCounts) as [SpiritualPathType, number][])
      .sort((a, b) => b[1] - a[1]);
    const path = sortedPaths[0][0];

    const sortedChallenges = (Object.entries(challengeCounts) as [ChallengeType, number][])
      .sort((a, b) => b[1] - a[1]);
    const challenge = sortedChallenges[0][0];

    setResultPath(path);
    setResultChallenge(challenge);
    setResultInvestment(investment);

    return { path, challenge, investment };
  }

  // ─── Submit ──────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { path, challenge, investment } = calculateResults();

    goTo("calculating");

    const answersData = answers.map((optIdx, qIdx) => ({
      questionIndex: qIdx,
      question: QUESTIONS[qIdx]?.question ?? "",
      selectedOption: QUESTIONS[qIdx]?.options[optIdx]?.text ?? "",
    }));

    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: contactForm.fullName,
          email: contactForm.email,
          phone: contactForm.phone,
          spiritualPath: path,
          primaryChallenge: challenge,
          investmentLevel: investment,
          ninetyDayGoal: openResponses.ninetyDay,
          oneThingHelp: openResponses.oneThingHelp,
          answers: answersData,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        }),
      });
    } catch {
      // Silently continue to results
    }
  }

  // ─── Calculating animation ──────────────────────────────────────────────

  useEffect(() => {
    if (step !== "calculating") return;
    const messages = [
      "Analyzing your spiritual path...",
      "Mapping your entrepreneurial soul alignment...",
      "Preparing your transformation pathway...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < messages.length) {
        setCalcText(messages[i]);
      } else {
        clearInterval(interval);
        goTo("results");
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ─── Result data ─────────────────────────────────────────────────────────

  const pathResult = SPIRITUAL_PATH_RESULTS[resultPath];
  const challengeOverlay = CHALLENGE_OVERLAYS[resultChallenge];

  // ─── Progress ────────────────────────────────────────────────────────────

  const progressNumber = step === "questions" ? currentQuestion + 1 : 0;
  const progressPercent = (progressNumber / totalQuestions) * 100;

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0A0A] text-[#FAF6E3] overflow-hidden font-sans pt-20">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ── Intro ─────────────────────────────────────────────── */}
          {step === "intro" && (
            <motion.div
              key="intro"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative"
            >
              <video
                autoPlay muted loop playsInline preload="auto"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              >
                <source src={bgVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[#0A0A0A]/30" />

              <div className="relative z-10 max-w-2xl">
                <h1 className="font-ninja text-3xl md:text-5xl mb-6 leading-tight">
                  ✨💗🦋{" "}
                  <span className="text-[#EF4444]">SPIRITUAL ENTREPRENEUR PATHWAY</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 mb-4 leading-relaxed">
                  Soul-Aligned Business Assessment
                </p>
                <p className="text-base text-gray-500 mb-10 leading-relaxed max-w-lg mx-auto">
                  25 questions to discover your spiritual business path, identify your unique challenges, and
                  reveal the transformation framework that will align your soul's work with sustainable success.
                </p>
                <button
                  onClick={() => goTo("questions")}
                  className="bg-[#EF4444] hover:bg-[#DC2626] text-white text-lg font-semibold px-10 py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                >
                  Discover My Spiritual Business Path &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Questions ───────────────────────────────────────────── */}
          {step === "questions" && (
            <motion.div
              key="questions"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="min-h-screen flex flex-col px-6 pt-8 pb-12 relative"
            >
              <video
                autoPlay muted loop playsInline preload="auto"
                className="absolute inset-0 w-full h-full object-cover opacity-75"
              >
                <source src={bgVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[#0A0A0A]/40" />

              <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-center relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`q-${currentQuestion}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Progress bar */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <button onClick={goBack} className="hover:text-white transition-colors">
                          &larr; Back
                        </button>
                        <span>
                          Question {progressNumber} of {totalQuestions}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#EF4444] rounded-full"
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-8">
                      {QUESTIONS[currentQuestion]?.question}
                    </h3>
                    <div className="space-y-3">
                      {QUESTIONS[currentQuestion]?.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectAnswer(idx)}
                          className="w-full text-left p-5 rounded-xl border border-gray-800 bg-[#111111] hover:border-[#EF4444] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 text-lg"
                        >
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── Open Response Questions (24-25) ──────────────────── */}
          {step === "open-response" && (
            <motion.div
              key="open-response"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="min-h-screen flex flex-col items-center justify-center px-6 relative"
            >
              <video
                autoPlay muted loop playsInline preload="auto"
                className="absolute inset-0 w-full h-full object-cover opacity-75"
              >
                <source src={bgVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[#0A0A0A]/40" />

              <div className="max-w-lg w-full relative z-10">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                  <button onClick={goBack} className="hover:text-white transition-colors">
                    &larr; Back
                  </button>
                  <span>Almost done</span>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-3">
                      In 60 days, what would feel like real success for your spiritual business?
                    </h3>
                    <textarea
                      value={openResponses.ninetyDay}
                      onChange={(e) => setOpenResponses({ ...openResponses, ninetyDay: e.target.value })}
                      className="w-full bg-[#111111] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#EF4444] transition-colors min-h-[100px] resize-none"
                      placeholder="Take a moment to imagine..."
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3">
                      If I could help you with ONE thing in your spiritual entrepreneurship journey, what would it be?
                    </h3>
                    <textarea
                      value={openResponses.oneThingHelp}
                      onChange={(e) => setOpenResponses({ ...openResponses, oneThingHelp: e.target.value })}
                      className="w-full bg-[#111111] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#EF4444] transition-colors min-h-[100px] resize-none"
                      placeholder="Be honest — there's no wrong answer."
                    />
                  </div>

                  <button
                    onClick={() => goTo("contact")}
                    className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white text-lg font-semibold py-4 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    Continue &rarr;
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Contact Form ──────────────────────────────────────── */}
          {step === "contact" && (
            <motion.div
              key="contact"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="min-h-screen flex flex-col items-center justify-center px-6 relative"
            >
              <video
                autoPlay muted loop playsInline preload="auto"
                className="absolute inset-0 w-full h-full object-cover opacity-75"
              >
                <source src={bgVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[#0A0A0A]/40" />

              <div className="max-w-md w-full relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
                  Almost there
                </h2>
                <p className="text-gray-400 text-center mb-8">
                  Enter your details to see your personalized spiritual entrepreneurship pathway.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.fullName}
                      onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                      className="w-full bg-[#111111] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#EF4444] transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-[#111111] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#EF4444] transition-colors"
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full bg-[#111111] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#EF4444] transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white text-lg font-semibold py-4 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] mt-4"
                  >
                    Reveal My Spiritual Business Path
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── Calculating ───────────────────────────────────────── */}
          {step === "calculating" && (
            <motion.div
              key="calculating"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-7xl mb-8"
              >
                🌿
              </motion.div>
              <h2 className="text-2xl font-bold mb-6">Reading your responses...</h2>
              <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-[#EF4444] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                />
              </div>
              <motion.p
                key={calcText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gray-400 text-lg"
              >
                {calcText}
              </motion.p>
            </motion.div>
          )}

          {/* ── Results ───────────────────────────────────────────── */}
          {step === "results" && (
            <motion.div
              key="results"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="min-h-screen px-6 py-12"
            >
              <div className="max-w-2xl mx-auto">
                {/* Energy Type Badge */}
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="inline-block text-7xl mb-4"
                  >
                    {resultPath === "isolated" ? "🌱" : resultPath === "stagnated" ? "🔥" : "🌉"}
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl md:text-4xl font-bold mb-2"
                  >
                    <span className="text-[#F87171]">{pathResult.title}</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl text-gray-300 italic"
                  >
                    &ldquo;{pathResult.subtitle}&rdquo;
                  </motion.p>
                </div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mb-8 space-y-4"
                >
                  {pathResult.description.map((p, i) => (
                    <p key={i} className="text-gray-300 text-lg leading-relaxed">
                      {p}
                    </p>
                  ))}
                </motion.div>

                {/* What helps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-[#111111] rounded-xl p-6 mb-6"
                >
                  <h3 className="text-lg font-semibold text-[#F87171] mb-4">
                    What helps you most right now
                  </h3>
                  <div className="space-y-3">
                    {pathResult.helps.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-[#EF4444] mt-0.5">&#10003;</span>
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* What doesn't help */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-red-900/10 border border-red-900/30 rounded-xl p-6 mb-6"
                >
                  <h3 className="text-lg font-semibold text-red-400 mb-4">
                    What doesn&apos;t help
                  </h3>
                  <div className="space-y-2">
                    {pathResult.doesntHelp.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-red-400 mt-0.5">&#10007;</span>
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Start Here */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="border-2 border-[#EF4444] rounded-xl p-6 mb-6 bg-red-900/10"
                >
                  <h3 className="text-lg font-semibold text-[#F87171] mb-4">
                    Start here
                  </h3>
                  <div className="space-y-3">
                    {pathResult.startHere.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-[#F87171]">&#10024;</span>
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Gentle Truth */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="bg-[#111111] rounded-xl p-6 mb-8 border-l-4 border-[#EF4444]"
                >
                  <h3 className="text-sm font-semibold text-[#F87171] uppercase tracking-wider mb-2">
                    A gentle truth
                  </h3>
                  <p className="text-gray-300 text-lg italic leading-relaxed">
                    {pathResult.truth}
                  </p>
                </motion.div>

                {/* Emotional Overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-[#111111] rounded-xl p-6 mb-8"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    Your primary challenge: <span className="text-[#F87171]">{challengeOverlay.label}</span>
                  </h3>
                  <p className="text-gray-300 mb-3">{challengeOverlay.description}</p>
                  <p className="text-[#F87171] font-medium">Focus: {challengeOverlay.focus}</p>
                </motion.div>

                {/* Coaching Invitation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="bg-[#111111] rounded-xl p-8 mb-8 border border-gray-800"
                >
                  <h3 className="text-xl font-semibold mb-4">A personal note</h3>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      If you&apos;re feeling a quiet &ldquo;yes&rdquo; as you read this, it may help to talk it through.
                    </p>
                    <p>
                      I offer guidance for souls who want clarity, not guesswork — especially when your path feels confusing or overwhelming.
                    </p>
                    <p className="font-medium text-[#FAF6E3]">
                      This isn&apos;t a sales call. It&apos;s a conversation.
                    </p>
                    <div className="space-y-2 text-sm">
                      <p>We&apos;ll look at:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        <li>Your heart path</li>
                        <li>What&apos;s actually holding you back</li>
                        <li>What would help you most right now</li>
                      </ul>
                    </div>
                    <p className="text-gray-400 text-sm">
                      If it feels aligned, we can talk about working together. If not, you&apos;ll still leave with clarity.
                    </p>
                  </div>
                  <a
                    href="https://calendly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                  >
                    Request a Clarity Conversation
                  </a>
                </motion.div>

                {/* Retake */}
                <div className="text-center pb-8">
                  <button
                    onClick={() => {
                      setStep("intro");
                      setCurrentQuestion(0);
                      setAnswers([]);
                      setOpenResponses({ ninetyDay: "", oneThingHelp: "" });
                      setContactForm({ fullName: "", email: "", phone: "" });
                    }}
                    className="text-gray-500 hover:text-white transition-colors underline underline-offset-4"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Version Toggle */}
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => setVersion(version === 1 ? 2 : 1)}
            className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-white/20 text-white text-xs px-4 py-2 rounded-full hover:bg-black/90 transition-all"
          >
            <span className="opacity-60">Version</span>
            <span className="font-bold">{version}</span>
            <span className="opacity-40">|</span>
            <span className="opacity-60">Switch to {version === 1 ? 2 : 1}</span>
          </button>
        </div>
      </div>
    </>
  );
}
