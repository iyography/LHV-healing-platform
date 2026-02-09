"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useRef, useState } from "react";

// Hero video URL - optimized for streaming
const HERO_VIDEO_URL = "/peace/3.mp4";

// Generate poster image URL from Cloudinary video URL
function getPosterFromVideo(videoUrl: string): string {
  if (videoUrl.startsWith("/")) return "";
  return videoUrl
    .replace("/video/upload/q_auto,f_auto/", "/video/upload/so_0,f_jpg,q_auto/")
    .replace(".mp4", ".jpg");
}

// AutoPlay Video component - shows poster immediately, then video when ready
function AutoPlayVideo({ src, className }: { src: string; className: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const posterUrl = getPosterFromVideo(src);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force muted state (required for autoplay)
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const playVideo = () => {
      if (video.paused) {
        video.play().then(() => {
          setIsReady(true);
        }).catch(() => {
          video.muted = true;
          video.play().then(() => setIsReady(true)).catch(() => {});
        });
      }
    };

    // Show video once it's playing
    const handlePlaying = () => setIsReady(true);
    video.addEventListener("playing", handlePlaying);

    // Try to play on various events
    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("canplay", playVideo);

    // Immediate play attempt
    playVideo();

    // Retry intervals for reliability
    const retryIntervals = [50, 100, 200, 400, 800, 1200, 1600, 2000, 3000];
    const timeouts = retryIntervals.map((ms) => setTimeout(playVideo, ms));

    // Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) playVideo();
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(video);

    // User interaction fallback
    const handleInteraction = () => playVideo();
    document.addEventListener("touchstart", handleInteraction, { once: true, passive: true });
    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("scroll", handleInteraction, { once: true, passive: true });

    return () => {
      observer.disconnect();
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("loadeddata", playVideo);
      video.removeEventListener("canplay", playVideo);
      timeouts.forEach(clearTimeout);
    };
  }, [src]);

  return (
    <div className={className} style={{ backgroundImage: `url(${posterUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isReady ? "opacity-100" : "opacity-0"}`}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

// ============================================
// LIGHT HEART VISION
// ============================================
function LightHeartVision() {
  const videos = {
    hero: "https://res.cloudinary.com/dzlnqcmqn/video/upload/v1770663329/heart_t8d5vn.mp4",
    about: "/peace/5.mp4",
    midStatement: "/peace/12.mp4",
    whatIsnt: "/peace/10.mp4",
  };

  return (
    <div className="bg-[#0A0A0A] text-[#FAF6E3] relative">
      {/* Hero */}
      <section className="min-h-screen relative overflow-hidden flex items-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src={videos.hero} type="video/mp4" />
        </video>
        <div className="relative z-20 max-w-5xl mx-auto px-8 py-32 text-center">
          <h1 className="font-ninja text-3xl md:text-4xl lg:text-5xl leading-tight mb-8">
            Embody a Higher Vision <span className="text-[#EF4444]">of a Life You Love</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl lg:text-3xl text-[#FAF6E3] max-w-3xl mx-auto mb-6 leading-relaxed">
            Stop building in isolation — start building from your <strong>Soul-aligned purpose</strong>
          </p>
          <p className="font-sans text-lg md:text-xl text-[#FAF6E3]/70 max-w-2xl mx-auto mb-4">
            For spiritual Skool creators &amp; collaborators who feel called to a higher vision.
          </p>
          <p className="font-sans text-base text-[#FAF6E3]/50 max-w-2xl mx-auto mb-12">
            🔥 Free for now ~ not forever ⏳
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.skool.com/lightheartvision" target="_blank" rel="noopener noreferrer" className="inline-block font-sans font-semibold bg-[#EF4444] text-white px-12 py-4 rounded-full hover:bg-[#DC2626] transition-colors">
              Join Free
            </a>
            <a href="/quiz" className="inline-block font-sans font-semibold border-2 border-[#EF4444] text-[#EF4444] px-12 py-4 rounded-full hover:bg-[#EF4444]/10 transition-colors">
              Heart Path Assessment
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
          <span className="font-sans text-xs tracking-widest text-[#EF4444]/60">NATHANIEL PARANT</span>
          <span className="font-sans text-xs tracking-widest text-[#EF4444]/60">TOGETHER — WE CO-CREATE HOME</span>
        </div>
      </section>

      {/* About Section */}
      <section id="why" className="grid lg:grid-cols-2">
        <div className="aspect-square lg:aspect-auto lg:h-screen relative">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videos.about} type="video/mp4" />
          </video>
        </div>
        <div className="flex items-center justify-center p-12 lg:p-24">
          <div className="max-w-lg">
            <span className="font-sans text-sm tracking-[0.3em] uppercase text-[#EF4444] block mb-6">The Vision</span>
            <h2 className="font-ninja text-3xl lg:text-4xl leading-relaxed mb-8">
              Built for spiritual creators,<br />not just influencers.
            </h2>
            <p className="font-sans text-lg text-[#FAF6E3]/60 leading-relaxed mb-6">
              You feel called to something greater. You have wisdom to share, a community to build, a vision to manifest.
            </p>
            <p className="font-sans text-lg text-[#FAF6E3]/60 leading-relaxed mb-6">
              Most spiritual creators struggle alone — unsure how to share their gifts without losing authenticity.
            </p>
            <p className="font-sans text-lg text-[#FAF6E3]/60 leading-relaxed mb-6">
              I have 20+ years of experience on the path, and have helped hundreds of individuals find peace and their purpose in life. I am devoted to World Enlightenment. Now, I&apos;m teaching all of it.
            </p>
            <p className="font-serif text-2xl text-[#EF4444] italic">
              &quot;Together — We Co-Create HOME!&quot;
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-24 px-8 bg-[#0F0F0F]">
        <div className="max-w-6xl mx-auto">
          <span className="font-sans text-sm tracking-[0.3em] uppercase text-[#EF4444] block mb-4 text-center">In Here You&apos;ll Learn To</span>
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="p-10 border border-[#FAF6E3]/10 rounded-2xl hover:border-[#EF4444]/50 transition-colors">
              <span className="text-4xl mb-4 block">🔥</span>
              <h3 className="font-ninja text-2xl mb-4">Structure Heart-Centered Offers</h3>
              <p className="font-sans text-lg text-[#FAF6E3]/60 leading-relaxed">
                Create offers that attract aligned souls — without compromising your spiritual integrity.
              </p>
            </div>
            <div className="p-10 border border-[#FAF6E3]/10 rounded-2xl hover:border-[#EF4444]/50 transition-colors">
              <span className="text-4xl mb-4 block">🍀</span>
              <h3 className="font-ninja text-2xl mb-4">Maintain High-Vibe Leadership</h3>
              <p className="font-sans text-lg text-[#FAF6E3]/60 leading-relaxed">
                Lead your community without depletion. Stay grounded while holding space for others.
              </p>
            </div>
            <div className="p-10 border border-[#FAF6E3]/10 rounded-2xl hover:border-[#EF4444]/50 transition-colors">
              <span className="text-4xl mb-4 block">🦋</span>
              <h3 className="font-ninja text-2xl mb-4">Communicate Spiritual Awareness</h3>
              <p className="font-sans text-lg text-[#FAF6E3]/60 leading-relaxed">
                Share your wisdom while keeping authentic connection — no spiritual bypassing.
              </p>
            </div>
            <div className="p-10 border border-[#FAF6E3]/10 rounded-2xl hover:border-[#EF4444]/50 transition-colors">
              <span className="text-4xl mb-4 block">🫶</span>
              <h3 className="font-ninja text-2xl mb-4">Nurture Members Into Contributors</h3>
              <p className="font-sans text-lg text-[#FAF6E3]/60 leading-relaxed">
                Transform free members into founding contributors who believe in your vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section id="features" className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <span className="font-sans text-sm tracking-[0.3em] uppercase text-[#EF4444] block mb-4 text-center">What&apos;s Inside (Priceless)</span>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <div className="p-8 border border-[#FAF6E3]/10 rounded-2xl hover:border-[#EF4444]/50 transition-colors">
              <span className="text-3xl mb-4 block">🛠️</span>
              <h3 className="font-ninja text-xl mb-3">Spiritual Community Launch Templates</h3>
              <p className="font-sans text-[#FAF6E3]/60 leading-relaxed">
                Heart-centered frameworks to structure offers that attract aligned souls.
              </p>
            </div>
            <div className="p-8 border border-[#FAF6E3]/10 rounded-2xl hover:border-[#EF4444]/50 transition-colors">
              <span className="text-3xl mb-4 block">🧘</span>
              <h3 className="font-ninja text-xl mb-3">8-Day Gratitude Tune-UP Series</h3>
              <p className="font-sans text-[#FAF6E3]/60 leading-relaxed">
                Daily practices to maintain high-vibe leadership without depletion.
              </p>
            </div>
            <div className="p-8 border border-[#FAF6E3]/10 rounded-2xl hover:border-[#EF4444]/50 transition-colors">
              <span className="text-3xl mb-4 block">✨</span>
              <h3 className="font-ninja text-xl mb-3">333+ Light Code Activations</h3>
              <p className="font-sans text-[#FAF6E3]/60 leading-relaxed">
                Communicate spiritual awareness while keeping authentic connection.
              </p>
            </div>
            <div className="p-8 border border-[#FAF6E3]/10 rounded-2xl hover:border-[#EF4444]/50 transition-colors">
              <span className="text-3xl mb-4 block">🎙️</span>
              <h3 className="font-ninja text-xl mb-3">LHV Pod Guest Opportunities</h3>
              <p className="font-sans text-[#FAF6E3]/60 leading-relaxed">
                Share your wisdom and gifts with our growing conscious community.
              </p>
            </div>
            <div className="p-8 border border-[#FAF6E3]/10 rounded-2xl hover:border-[#EF4444]/50 transition-colors">
              <span className="text-3xl mb-4 block">🤝</span>
              <h3 className="font-ninja text-xl mb-3">Monthly Co-Creation Circles</h3>
              <p className="font-sans text-[#FAF6E3]/60 leading-relaxed">
                Connect with fellow spiritual Skool creators and collaborators called to higher vision.
              </p>
            </div>
            <div className="p-8 border border-[#FAF6E3]/10 rounded-2xl hover:border-[#EF4444]/50 transition-colors">
              <span className="text-3xl mb-4 block">💗</span>
              <h3 className="font-ninja text-xl mb-3">Direct Access to Nathaniel</h3>
              <p className="font-sans text-[#FAF6E3]/60 leading-relaxed">
                20+ years of experience on the path. Real guidance from real awakening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mid Statement */}
      <section className="h-[70vh] relative">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videos.midStatement} type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <p className="font-ninja text-4xl md:text-6xl text-white text-center px-8">
            Together — We Co-Create HOME!
          </p>
        </div>
      </section>

      {/* Who This Is For */}
      <section id="for-you" className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-sans text-sm tracking-[0.3em] uppercase text-[#EF4444] block mb-6">Is This For You?</span>
          <h2 className="font-ninja text-3xl lg:text-4xl mb-12">This community is for...</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
            <div className="flex items-start gap-4 p-6 bg-[#0F0F0F] rounded-xl">
              <span className="text-2xl">✨</span>
              <div>
                <h4 className="font-semibold text-[#FAF6E3] mb-1">Spiritual Skool creators</h4>
                <p className="text-[#FAF6E3]/60">Called to build conscious community bridges</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-[#0F0F0F] rounded-xl">
              <span className="text-2xl">💗</span>
              <div>
                <h4 className="font-semibold text-[#FAF6E3] mb-1">Heart-centered leaders</h4>
                <p className="text-[#FAF6E3]/60">Who want to structure offers that attract aligned souls</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-[#0F0F0F] rounded-xl">
              <span className="text-2xl">🦋</span>
              <div>
                <h4 className="font-semibold text-[#FAF6E3] mb-1">Awakening guides</h4>
                <p className="text-[#FAF6E3]/60">Ready to nurture free members into founding contributors</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-[#0F0F0F] rounded-xl">
              <span className="text-2xl">🔥</span>
              <div>
                <h4 className="font-semibold text-[#FAF6E3] mb-1">Visionaries</h4>
                <p className="text-[#FAF6E3]/60">Who feel called to co-create the New Earth</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What This Isn't */}
      <section className="py-24 px-8 relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videos.whatIsnt} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="font-sans text-sm tracking-[0.3em] uppercase text-[#EF4444] block mb-8">What This Isn&apos;t</span>
          <div className="space-y-4 text-xl md:text-2xl mb-12">
            <p className="flex items-center justify-center gap-4">
              <span className="text-red-400">✗</span>
              <span>This isn&apos;t about chasing followers or going viral</span>
            </p>
            <p className="flex items-center justify-center gap-4">
              <span className="text-red-400">✗</span>
              <span>No hustle culture. No burnout. No inauthenticity.</span>
            </p>
            <p className="flex items-center justify-center gap-4">
              <span className="text-red-400">✗</span>
              <span>You don&apos;t need to compromise your spiritual integrity</span>
            </p>
          </div>
          <p className="font-serif text-3xl lg:text-4xl text-[#FAF6E3] italic">
            Built for souls who value authenticity and alignment.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 text-center">
        <span className="font-sans text-sm tracking-[0.5em] uppercase text-[#EF4444] block mb-8">Your Calling</span>
        <h2 className="font-ninja text-3xl lg:text-4xl mb-6">
          Ready to embody your higher vision?
        </h2>
        <p className="text-lg text-[#FAF6E3]/60 mb-10 max-w-2xl mx-auto">
          Join the free community and start co-creating with aligned souls.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://www.skool.com/lightheartvision" target="_blank" rel="noopener noreferrer" className="inline-block font-sans font-semibold bg-[#EF4444] text-white px-14 py-5 rounded-full hover:bg-[#DC2626] transition-colors text-xl">
            Join Free
          </a>
          <a href="/quiz" className="inline-block font-sans font-semibold border-2 border-[#EF4444] text-[#EF4444] px-14 py-5 rounded-full hover:bg-[#EF4444]/10 transition-colors text-xl">
            Heart Path Assessment
          </a>
        </div>
        <p className="text-sm text-[#FAF6E3]/50 mt-6">
          🔥 Free for now ~ not forever ⏳
        </p>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 border-t border-[#FAF6E3]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="font-ninja text-2xl">✨💗🦋 Light Heart Vision</span>
          <span className="font-sans text-xs text-[#FAF6E3]/30">
            <a href="/admin" className="hover:text-[#FAF6E3]/50 transition-colors">&copy;</a> 2026 Light Heart Vision. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function Home() {
  return (
    <>
      <Navbar />
      <LightHeartVision />
    </>
  );
}
