"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LogOut, Search, Download, Users, RefreshCw, ChevronDown, ChevronUp, FileText, BookOpen, ClipboardList, Copy, Check } from "lucide-react";
import * as XLSX from "xlsx";

// Hearts video background (same as homepage hero)
const VIDEO_URL = "https://res.cloudinary.com/dzlnqcmqn/video/upload/v1770663329/heart_t8d5vn.mp4";

function BackgroundVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const handlePlaying = () => setIsPlaying(true);
    video.addEventListener("playing", handlePlaying);
    const playVideo = () => {
      if (video.paused) video.play().catch(() => {});
    };
    video.addEventListener("loadedmetadata", playVideo);
    video.addEventListener("canplay", playVideo);
    playVideo();
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && playVideo()),
      { threshold: 0.1 }
    );
    observer.observe(video);
    const handleInteraction = () => playVideo();
    document.addEventListener("touchstart", handleInteraction, { once: true, passive: true });
    document.addEventListener("click", handleInteraction, { once: true });
    return () => {
      observer.disconnect();
      video.removeEventListener("playing", handlePlaying);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0" style={{ backgroundColor: "#0A0A0A" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[#0A0A0A]/80" />
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface QuizSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  spiritual_path: string;
  primary_challenge: string;
  investment_level: string;
  ninety_day_goal: string;
  one_thing_help: string;
  answers: { questionIndex: number; question: string; selectedOption: string }[];
  created_at: string;
}

// ─── Spiritual Path Labels ───────────────────────────────────────────────────

const SPIRITUAL_PATH_LABELS: Record<string, { label: string; color: string }> = {
  isolated: { label: "The Isolated Creator", color: "bg-red-500/20 text-red-400" },
  stagnated: { label: "The Visionary Stuck", color: "bg-amber-500/20 text-amber-400" },
  bridgeReady: { label: "The Bridge Builder", color: "bg-emerald-500/20 text-emerald-400" },
};

const CHALLENGE_LABELS: Record<string, { label: string; color: string }> = {
  alignment: { label: "Spiritual Alignment", color: "bg-purple-500/20 text-purple-400" },
  scaling: { label: "Scaling", color: "bg-blue-500/20 text-blue-400" },
  integration: { label: "Spiritual-Tech Integration", color: "bg-cyan-500/20 text-cyan-400" },
  community: { label: "Community Building", color: "bg-pink-500/20 text-pink-400" },
};

const INVESTMENT_LABELS: Record<string, string> = {
  free: "Free Resources First",
  low: "Modest Investment",
  medium: "Meaningful Investment",
  high: "Significant Investment",
};

// ─── Content Library Data ────────────────────────────────────────────────────

const CONTENT_POSTS = [
  {
    id: 1,
    category: "community",
    title: "Why spiritual creators need community (not just followers)",
    short: "You don't need more followers. You need aligned souls who get it.\n\nBuilding in isolation is the #1 reason spiritual entrepreneurs burn out.\n\nCommunity isn't a nice-to-have. It's the foundation of everything.",
    medium: "You don't need more followers. You need aligned souls who get it.\n\nBuilding in isolation is the #1 reason spiritual entrepreneurs burn out.\n\nHere's what real community gives you:\n- Mirror for your blind spots\n- Energy when you're depleted\n- Accountability without judgment\n- Co-creation that multiplies impact\n\nStop building alone. Start co-creating with aligned souls.",
    long: "You don't need more followers. You need aligned souls who get it.\n\nBuilding in isolation is the #1 reason spiritual entrepreneurs burn out.\n\nI spent years building alone. Had the knowledge, had the vision, but was missing something essential: people who understood the mission.\n\nHere's what real community gives you:\n- Mirror for your blind spots\n- Energy when you're depleted\n- Accountability without judgment\n- Co-creation that multiplies impact\n- Proof that you're not crazy for following this path\n\nThe spiritual path was never meant to be walked alone.\n\nStop building alone. Start co-creating with aligned souls.\n\nWhat would change if you had 10 people who truly understood your vision?",
  },
  {
    id: 2,
    category: "spirituality",
    title: "Spirituality and technology aren't enemies",
    short: "Ancient wisdom + modern tools = unstoppable impact.\n\nThe monks used scrolls. We use screens.\n\nThe medium changes. The message doesn't.\n\nStop resisting technology. Start using it consciously.",
    medium: "Ancient wisdom + modern tools = unstoppable impact.\n\nThe monks used scrolls. We use screens.\n\nThe medium changes. The message doesn't.\n\nTechnology isn't the problem. Unconscious use of technology is.\n\nWhen you use tech with intention:\n- AI becomes a tool for deeper service\n- Social media becomes a bridge to souls who need you\n- Automation frees you to do the sacred work\n\nStop resisting technology. Start using it consciously.",
    long: "Ancient wisdom + modern tools = unstoppable impact.\n\nThe monks used scrolls. We use screens.\n\nThe medium changes. The message doesn't.\n\nI used to think technology was the enemy of spiritual work. That screens killed presence. That automation was inauthentic.\n\nThen I realized: technology isn't the problem. Unconscious use of technology is.\n\nWhen you use tech with intention:\n- AI becomes a tool for deeper service\n- Social media becomes a bridge to souls who need you\n- Automation frees you to do the sacred work\n- Platforms become temples of transformation\n\nThe question isn't whether to use technology. It's whether you'll use it consciously.\n\nStop resisting technology. Start wielding it as a sacred tool.\n\nWhat would your spiritual business look like with technology as an ally?",
  },
  {
    id: 3,
    category: "business",
    title: "Your spiritual gifts deserve sustainable income",
    short: "Charging for your gifts isn't selling out.\n\nIt's honoring the years of practice, the dark nights, the transformation.\n\nSustainable income = sustainable impact.\n\nYou can't pour from an empty cup.",
    medium: "Charging for your gifts isn't selling out.\n\nIt's honoring the years of practice, the dark nights, the transformation.\n\nThe starving healer helps no one.\n\nSustainable income means:\n- You can show up fully for your clients\n- You don't need a soul-draining day job\n- You can invest in your own growth\n- Your impact compounds over time\n\nSustainable income = sustainable impact.\n\nYou can't pour from an empty cup.",
    long: "Charging for your gifts isn't selling out.\n\nIt's honoring the years of practice, the dark nights, the transformation.\n\nI know the guilt. 'Shouldn't this be free?' 'Am I being greedy?'\n\nNo. The starving healer helps no one.\n\nHere's the truth:\n- Your rent doesn't care about your spiritual journey\n- Your family needs you present, not stressed about money\n- Your clients get better results when you're not in survival mode\n\nSustainable income means:\n- You can show up fully for your clients\n- You don't need a soul-draining day job\n- You can invest in your own growth\n- Your impact compounds over time\n\nMoney is energy. Let it flow to you so you can flow it back out as service.\n\nYou can't pour from an empty cup.\n\nWhat would change if money was no longer a worry?",
  },
  {
    id: 4,
    category: "leadership",
    title: "Leading from the heart doesn't mean being soft",
    short: "Heart-centered leadership is the most powerful force in business.\n\nIt's not about being nice. It's about being real.\n\nSoft on people. Hard on standards.\n\nThat's how you build something that lasts.",
    medium: "Heart-centered leadership is the most powerful force in business.\n\nIt's not about being nice. It's about being real.\n\nHeart-centered leaders:\n- Hold space without enabling\n- Set boundaries with compassion\n- Speak truth with love\n- Lead by example, not authority\n\nSoft on people. Hard on standards.\n\nThat's how you build something that lasts.",
    long: "Heart-centered leadership is the most powerful force in business.\n\nIt's not about being nice. It's about being real.\n\nI've seen too many spiritual leaders confuse kindness with weakness. They avoid hard conversations. They let boundaries slide. They people-please their way into burnout.\n\nHeart-centered leaders:\n- Hold space without enabling\n- Set boundaries with compassion\n- Speak truth with love\n- Lead by example, not authority\n- Make hard decisions from wisdom, not fear\n\nThe strongest leaders I know are the most heart-centered.\n\nSoft on people. Hard on standards.\n\nThat's how you build something that lasts.\n\nWhat hard conversation are you avoiding right now?",
  },
  {
    id: 5,
    category: "community",
    title: "Together we co-create HOME",
    short: "HOME isn't a place. It's a frequency.\n\nIt's the feeling of being truly seen by souls who understand.\n\nYou don't find home. You co-create it.\n\nWith intention. With presence. With love.",
    medium: "HOME isn't a place. It's a frequency.\n\nIt's the feeling of being truly seen by souls who understand.\n\nYou don't find home. You co-create it.\n\nWhat does co-creating HOME look like?\n- Showing up authentically, not performing\n- Supporting without fixing\n- Celebrating without competing\n- Growing without leaving anyone behind\n\nWith intention. With presence. With love.\n\nThat's what we're building here.",
    long: "HOME isn't a place. It's a frequency.\n\nIt's the feeling of being truly seen by souls who understand.\n\nFor years I searched for this feeling. In ashrams, retreats, communities, programs. Always close, never quite there.\n\nThen I realized: you don't find home. You co-create it.\n\nWhat does co-creating HOME look like?\n- Showing up authentically, not performing\n- Supporting without fixing\n- Celebrating without competing\n- Growing without leaving anyone behind\n- Holding space for the messy, beautiful process\n\nThis is what Light Heart Vision is building. Not a community OF content. A community OF connection.\n\nWith intention. With presence. With love.\n\nWho are you co-creating home with?",
  },
  {
    id: 6,
    category: "spirituality",
    title: "Your awakening is your business plan",
    short: "Every dark night of the soul was preparation.\n\nEvery challenge was curriculum.\n\nEvery breakthrough is now your offering.\n\nYour awakening IS your business plan. You just need to structure it.",
    medium: "Every dark night of the soul was preparation.\n\nEvery challenge was curriculum.\n\nEvery breakthrough is now your offering.\n\nStop looking for a business idea. Look at your life.\n\n- What have you overcome?\n- What have you learned?\n- What transformation have you lived?\n\nThat's your business. That's your gift.\n\nYour awakening IS your business plan. You just need to structure it.",
    long: "Every dark night of the soul was preparation.\n\nEvery challenge was curriculum.\n\nEvery breakthrough is now your offering.\n\nI spent years thinking I needed a 'real' business idea. Something practical. Something normal.\n\nThen I realized: my awakening journey IS the business.\n\nStop looking for a business idea. Look at your life.\n\n- What have you overcome? That's your expertise.\n- What have you learned? That's your curriculum.\n- What transformation have you lived? That's your offering.\n- Who were you before? That's your ideal client.\n\nThe most powerful teachers teach from lived experience, not textbooks.\n\nYour awakening IS your business plan. You just need to structure it.\n\nWhat chapter of your journey is someone else desperately needing right now?",
  },
];

// ─── Content Library Component ───────────────────────────────────────────────

function ContentLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeVersions, setActiveVersions] = useState<Record<number, "short" | "medium" | "long">>({});
  const [currentFilter, setCurrentFilter] = useState("all");

  const categories = [...new Set(CONTENT_POSTS.map((p) => p.category))];

  const filtered = CONTENT_POSTS.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.short.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = currentFilter === "all" || post.category === currentFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-[#FAF6E3]/10 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#FAF6E3]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6E3]/10 border border-[#FAF6E3]/20 text-[#FAF6E3] placeholder-[#FAF6E3]/40 focus:outline-none focus:border-[#EF4444] font-sans text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCurrentFilter("all")}
              className={`px-4 py-2 rounded-full font-sans text-xs font-medium transition-colors ${
                currentFilter === "all" ? "bg-[#EF4444] text-white" : "bg-[#FAF6E3]/10 text-[#FAF6E3]/60 hover:bg-[#FAF6E3]/20"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCurrentFilter(cat)}
                className={`px-4 py-2 rounded-full font-sans text-xs font-medium transition-colors capitalize ${
                  currentFilter === cat ? "bg-[#EF4444] text-white" : "bg-[#FAF6E3]/10 text-[#FAF6E3]/60 hover:bg-[#FAF6E3]/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.map((post) => {
          const version = activeVersions[post.id] || "short";
          const content = post[version];
          return (
            <div key={post.id} className="bg-[#0A0A0A]/60 backdrop-blur-md border border-[#FAF6E3]/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-[#EF4444]/20 text-[#EF4444] capitalize mb-2">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-lg text-[#FAF6E3]">{post.title}</h3>
                </div>
                <button
                  onClick={() => handleCopy(content, `${post.id}-${version}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF6E3]/10 hover:bg-[#FAF6E3]/20 text-[#FAF6E3]/60 hover:text-[#FAF6E3] transition-colors text-xs font-sans"
                >
                  {copiedId === `${post.id}-${version}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === `${post.id}-${version}` ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Version Toggle */}
              <div className="flex gap-1 mb-4">
                {(["short", "medium", "long"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setActiveVersions({ ...activeVersions, [post.id]: v })}
                    className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors capitalize ${
                      version === v ? "bg-[#EF4444] text-white" : "bg-[#FAF6E3]/10 text-[#FAF6E3]/50 hover:bg-[#FAF6E3]/20"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <pre className="font-sans text-sm text-[#FAF6E3]/70 whitespace-pre-wrap leading-relaxed">{content}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Admin Component ────────────────────────────────────────────────────

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"quiz" | "content">("quiz");
  const [quizSubmissions, setQuizSubmissions] = useState<QuizSubmission[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSearch, setQuizSearch] = useState("");
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [pathFilter, setPathFilter] = useState("all");

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const sessionId = localStorage.getItem("lhv-admin-session");
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/admin/verify", {
          headers: { "x-admin-session": sessionId },
        });
        const data = await response.json();

        if (data.valid) {
          setIsAuthenticated(true);
          fetchQuizSubmissions(sessionId);
        } else {
          localStorage.removeItem("lhv-admin-session");
        }
      } catch {
        localStorage.removeItem("lhv-admin-session");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const fetchQuizSubmissions = async (sessionId: string) => {
    setQuizLoading(true);
    try {
      const response = await fetch("/api/quiz/submissions", {
        headers: { "x-admin-session": sessionId },
      });
      const data = await response.json();

      if (data.success) {
        setQuizSubmissions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch quiz submissions:", error);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("lhv-admin-session", data.sessionId);
        setIsAuthenticated(true);
        fetchQuizSubmissions(data.sessionId);
      } else {
        setLoginError(data.error || "Invalid credentials");
      }
    } catch {
      setLoginError("Failed to login. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    const sessionId = localStorage.getItem("lhv-admin-session");
    if (sessionId) {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: { "x-admin-session": sessionId },
      });
    }
    localStorage.removeItem("lhv-admin-session");
    setIsAuthenticated(false);
    setQuizSubmissions([]);
  };

  const handleRefresh = () => {
    const sessionId = localStorage.getItem("lhv-admin-session");
    if (sessionId) {
      fetchQuizSubmissions(sessionId);
    }
  };

  const handleQuizExport = () => {
    const exportData = filteredQuizSubmissions.map((q) => {
      const answerColumns: Record<string, string> = {};
      if (Array.isArray(q.answers)) {
        q.answers.forEach((a, i) => {
          answerColumns[`Q${i + 1}: ${a.question}`] = a.selectedOption;
        });
      }

      return {
        Name: q.full_name,
        Email: q.email,
        Phone: q.phone,
        "Spiritual Path": SPIRITUAL_PATH_LABELS[q.spiritual_path]?.label || q.spiritual_path || "N/A",
        "Primary Challenge": CHALLENGE_LABELS[q.primary_challenge]?.label || q.primary_challenge || "N/A",
        "Investment Level": INVESTMENT_LABELS[q.investment_level] || q.investment_level || "N/A",
        "90-Day Goal": q.ninety_day_goal || "",
        "One Thing Help": q.one_thing_help || "",
        ...answerColumns,
        "Submitted At": new Date(q.created_at).toLocaleString(),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Submissions");
    XLSX.writeFile(workbook, `lhv-quiz-submissions-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  // ─── Filters & Stats ──────────────────────────────────────────────────────

  const filteredQuizSubmissions = quizSubmissions.filter((q) => {
    const query = quizSearch.toLowerCase();
    const matchesSearch =
      query === "" ||
      q.full_name?.toLowerCase().includes(query) ||
      q.email?.toLowerCase().includes(query) ||
      q.phone?.toLowerCase().includes(query) ||
      (SPIRITUAL_PATH_LABELS[q.spiritual_path]?.label || "").toLowerCase().includes(query);
    const matchesFilter = pathFilter === "all" || q.spiritual_path === pathFilter;
    return matchesSearch && matchesFilter;
  });

  const isolatedCount = quizSubmissions.filter((q) => q.spiritual_path === "isolated").length;
  const stagnatedCount = quizSubmissions.filter((q) => q.spiritual_path === "stagnated").length;
  const bridgeReadyCount = quizSubmissions.filter((q) => q.spiritual_path === "bridgeReady").length;

  const topChallenge = (() => {
    if (quizSubmissions.length === 0) return "N/A";
    const counts: Record<string, number> = {};
    quizSubmissions.forEach((q) => {
      if (q.primary_challenge) counts[q.primary_challenge] = (counts[q.primary_challenge] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? CHALLENGE_LABELS[top[0]]?.label || top[0] : "N/A";
  })();

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#FAF6E3] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF4444]"></div>
      </div>
    );
  }

  // ─── Login Screen ──────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#FAF6E3] flex items-center justify-center px-6 relative">
        <BackgroundVideo src={VIDEO_URL} />

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-10">
            <Link href="/" className="font-ninja text-4xl inline-block mb-4">
              Light Heart Vision
            </Link>
            <h1 className="font-serif text-2xl text-[#FAF6E3]/80">Admin Dashboard</h1>
          </div>

          <form onSubmit={handleLogin} className="bg-[#0A0A0A]/70 backdrop-blur-md border border-[#FAF6E3]/20 rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-[#FAF6E3]/60 mb-2 font-sans text-sm">Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF6E3]/10 border border-[#FAF6E3]/20 text-[#FAF6E3] placeholder-[#FAF6E3]/40 focus:outline-none focus:border-[#EF4444] font-sans"
                placeholder="admin@lightheartvision.com"
              />
            </div>

            <div>
              <label className="block text-[#FAF6E3]/60 mb-2 font-sans text-sm">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF6E3]/10 border border-[#FAF6E3]/20 text-[#FAF6E3] placeholder-[#FAF6E3]/40 focus:outline-none focus:border-[#EF4444] font-sans"
                placeholder="••••••••"
              />
            </div>

            {loginError && <p className="text-[#EF4444] text-sm font-sans">{loginError}</p>}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-4 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-sans font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/" className="text-[#FAF6E3]/50 font-sans text-sm hover:text-[#FAF6E3] transition-colors">
              &larr; Back to Light Heart Vision
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Dashboard ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen text-[#FAF6E3] relative">
      <BackgroundVideo src={VIDEO_URL} />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[#FAF6E3]/10 bg-[#0A0A0A]/60 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-ninja text-2xl">
                Light Heart Vision
              </Link>
              <span className="text-[#FAF6E3]/30">|</span>
              <span className="font-sans text-[#FAF6E3]/60">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#FAF6E3]/60 hover:text-[#FAF6E3] transition-colors font-sans"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="border-b border-[#FAF6E3]/10 bg-[#0A0A0A]/40 backdrop-blur-sm sticky top-[65px] z-30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex items-center gap-2 px-5 py-3 font-sans text-sm border-b-2 transition-all ${
                  activeTab === "quiz"
                    ? "border-[#EF4444] text-[#EF4444] font-medium"
                    : "border-transparent text-[#FAF6E3]/60 hover:text-[#FAF6E3] hover:border-[#FAF6E3]/20"
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Quiz Results
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={`flex items-center gap-2 px-5 py-3 font-sans text-sm border-b-2 transition-all ${
                  activeTab === "content"
                    ? "border-[#EF4444] text-[#EF4444] font-medium"
                    : "border-transparent text-[#FAF6E3]/60 hover:text-[#FAF6E3] hover:border-[#FAF6E3]/20"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Content Library
              </button>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === "content" ? (
            <ContentLibrary />
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-[#FAF6E3]/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EF4444]/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#EF4444]" />
                    </div>
                    <div>
                      <p className="font-sans text-[#FAF6E3]/60 text-xs">Total Submissions</p>
                      <p className="font-serif text-2xl">{quizSubmissions.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-[#FAF6E3]/10 rounded-2xl p-5">
                  <div>
                    <p className="font-sans text-[#FAF6E3]/60 text-xs mb-1">Isolated Creator</p>
                    <p className="font-serif text-2xl text-red-400">{isolatedCount}</p>
                  </div>
                </div>
                <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-[#FAF6E3]/10 rounded-2xl p-5">
                  <div>
                    <p className="font-sans text-[#FAF6E3]/60 text-xs mb-1">Visionary Stuck</p>
                    <p className="font-serif text-2xl text-amber-400">{stagnatedCount}</p>
                  </div>
                </div>
                <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-[#FAF6E3]/10 rounded-2xl p-5">
                  <div>
                    <p className="font-sans text-[#FAF6E3]/60 text-xs mb-1">Bridge Builder</p>
                    <p className="font-serif text-2xl text-emerald-400">{bridgeReadyCount}</p>
                  </div>
                </div>
                <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-[#FAF6E3]/10 rounded-2xl p-5">
                  <div>
                    <p className="font-sans text-[#FAF6E3]/60 text-xs mb-1">Top Challenge</p>
                    <p className="font-serif text-sm mt-1">{topChallenge}</p>
                  </div>
                </div>
              </div>

              {/* Spiritual Path Distribution */}
              {quizSubmissions.length > 0 && (
                <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-[#FAF6E3]/10 rounded-2xl p-6 mb-8">
                  <h2 className="font-serif text-xl mb-4">Spiritual Path Distribution</h2>
                  <div className="space-y-3">
                    {[
                      { key: "isolated", label: "The Isolated Creator", count: isolatedCount, color: "from-red-500 to-red-600" },
                      { key: "stagnated", label: "The Visionary Stuck", count: stagnatedCount, color: "from-amber-500 to-amber-600" },
                      { key: "bridgeReady", label: "The Bridge Builder", count: bridgeReadyCount, color: "from-emerald-500 to-emerald-600" },
                    ].map((item) => {
                      const pct = quizSubmissions.length > 0 ? (item.count / quizSubmissions.length) * 100 : 0;
                      return (
                        <div key={item.key} className="flex items-center gap-4">
                          <div className="w-40 font-sans text-sm font-medium text-[#FAF6E3]/80">{item.label}</div>
                          <div className="flex-1 bg-[#FAF6E3]/10 rounded-full h-7 relative overflow-hidden">
                            <div
                              className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-1000`}
                              style={{ width: `${pct}%` }}
                            />
                            <div className="absolute inset-0 flex items-center px-3 text-xs font-sans font-semibold text-white">
                              {item.count} ({pct.toFixed(0)}%)
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-[#FAF6E3]/10 rounded-2xl p-6 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#FAF6E3]/40" />
                    <input
                      type="text"
                      value={quizSearch}
                      onChange={(e) => setQuizSearch(e.target.value)}
                      placeholder="Search by name, email, phone..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6E3]/10 border border-[#FAF6E3]/20 text-[#FAF6E3] placeholder-[#FAF6E3]/40 focus:outline-none focus:border-[#EF4444] font-sans text-sm"
                    />
                  </div>

                  <select
                    value={pathFilter}
                    onChange={(e) => setPathFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF6E3]/10 border border-[#FAF6E3]/20 text-[#FAF6E3] font-sans text-sm focus:outline-none focus:border-[#EF4444]"
                  >
                    <option value="all">All Paths</option>
                    <option value="isolated">Isolated Creator</option>
                    <option value="stagnated">Visionary Stuck</option>
                    <option value="bridgeReady">Bridge Builder</option>
                  </select>

                  <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF6E3]/10 hover:bg-[#FAF6E3]/20 rounded-xl font-sans text-sm transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${quizLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </button>

                  <button
                    onClick={handleQuizExport}
                    disabled={filteredQuizSubmissions.length === 0}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#EF4444] text-white hover:bg-[#DC2626] rounded-xl font-sans font-semibold text-sm transition-colors disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    Export XLSX
                  </button>
                </div>
              </div>

              {/* Results Count */}
              <h2 className="font-serif text-xl mb-4">
                Quiz Submissions ({filteredQuizSubmissions.length} of {quizSubmissions.length})
              </h2>

              {/* Submissions List */}
              {quizLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EF4444] mx-auto"></div>
                </div>
              ) : filteredQuizSubmissions.length === 0 ? (
                <div className="bg-[#0A0A0A]/60 backdrop-blur-md border border-[#FAF6E3]/10 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-[#FAF6E3]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-[#FAF6E3]/40" />
                  </div>
                  <p className="text-[#FAF6E3]/60 font-sans">
                    {quizSearch || pathFilter !== "all" ? "No submissions match your filters." : "No quiz submissions yet."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQuizSubmissions.map((submission) => {
                    const pathInfo = SPIRITUAL_PATH_LABELS[submission.spiritual_path];
                    const challengeInfo = CHALLENGE_LABELS[submission.primary_challenge];
                    const isExpanded = expandedQuiz === submission.id;

                    return (
                      <div
                        key={submission.id}
                        className="bg-[#0A0A0A]/60 backdrop-blur-md border border-[#FAF6E3]/10 rounded-2xl overflow-hidden"
                      >
                        {/* Summary Row */}
                        <div
                          className="p-5 cursor-pointer hover:bg-[#FAF6E3]/5 transition-colors"
                          onClick={() => setExpandedQuiz(isExpanded ? null : submission.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <div className="w-3 h-3 bg-[#EF4444] rounded-full" />
                                  <h3 className="font-serif text-lg">{submission.full_name}</h3>
                                </div>
                                <p className="font-sans text-sm text-[#FAF6E3]/50">
                                  {submission.email && <span className="mr-3">{submission.email}</span>}
                                  {submission.phone && <span className="mr-3">{submission.phone}</span>}
                                  {new Date(submission.created_at).toLocaleString()}
                                </p>
                              </div>
                              <div className="hidden sm:flex gap-2">
                                {pathInfo && (
                                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-sans font-medium ${pathInfo.color}`}>
                                    {pathInfo.label}
                                  </span>
                                )}
                                {challengeInfo && (
                                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-sans font-medium ${challengeInfo.color}`}>
                                    {challengeInfo.label}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-[#FAF6E3]/40" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-[#FAF6E3]/40" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Detail */}
                        {isExpanded && (
                          <div className="border-t border-[#FAF6E3]/10 bg-[#FAF6E3]/[0.02]">
                            <div className="p-6">
                              {/* Result Summary */}
                              <div className="bg-[#EF4444]/10 rounded-2xl p-5 mb-6">
                                <h4 className="font-serif text-lg mb-2">{pathInfo?.label || submission.spiritual_path}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-sans">
                                  <div>
                                    <p className="text-[#FAF6E3]/40 text-xs uppercase tracking-wider mb-1">Primary Challenge</p>
                                    <p className="text-[#FAF6E3]/80">{challengeInfo?.label || submission.primary_challenge || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-[#FAF6E3]/40 text-xs uppercase tracking-wider mb-1">Investment Level</p>
                                    <p className="text-[#FAF6E3]/80">{INVESTMENT_LABELS[submission.investment_level] || submission.investment_level || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-[#FAF6E3]/40 text-xs uppercase tracking-wider mb-1">Submitted</p>
                                    <p className="text-[#FAF6E3]/80">{new Date(submission.created_at).toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Open Responses */}
                              {(submission.ninety_day_goal || submission.one_thing_help) && (
                                <div className="bg-[#FAF6E3]/5 rounded-2xl p-5 mb-6">
                                  <h4 className="font-serif text-md mb-3">Open Responses</h4>
                                  <div className="space-y-4">
                                    {submission.ninety_day_goal && (
                                      <div>
                                        <p className="font-sans text-xs text-[#EF4444] font-semibold mb-1">90-Day Goal</p>
                                        <p className="font-sans text-sm text-[#FAF6E3]/70">{submission.ninety_day_goal}</p>
                                      </div>
                                    )}
                                    {submission.one_thing_help && (
                                      <div>
                                        <p className="font-sans text-xs text-[#EF4444] font-semibold mb-1">One Thing That Would Help</p>
                                        <p className="font-sans text-sm text-[#FAF6E3]/70">{submission.one_thing_help}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* All Quiz Answers */}
                              {Array.isArray(submission.answers) && submission.answers.length > 0 && (
                                <div className="bg-[#FAF6E3]/5 rounded-2xl p-5">
                                  <h4 className="font-serif text-md mb-4">All Quiz Answers</h4>
                                  <div className="space-y-3">
                                    {submission.answers
                                      .sort((a, b) => a.questionIndex - b.questionIndex)
                                      .map((answer, idx) => (
                                        <div key={idx} className="border-b border-[#FAF6E3]/5 pb-3 last:border-0 last:pb-0">
                                          <p className="font-sans text-xs text-[#EF4444] font-semibold mb-1">Q{answer.questionIndex + 1}</p>
                                          <p className="font-sans text-sm font-medium text-[#FAF6E3]/80 mb-1">{answer.question}</p>
                                          <p className="font-sans text-sm text-[#FAF6E3]/60">{answer.selectedOption}</p>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-[#FAF6E3]/10 mt-auto">
          <div className="max-w-7xl mx-auto text-center">
            <span className="font-sans text-xs text-[#FAF6E3]/30">&copy; 2026 Light Heart Vision. Admin Dashboard.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
