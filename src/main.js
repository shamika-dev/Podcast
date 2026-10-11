import "./style.css";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

// 1. Lenis Smooth Scroll Setup
const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("hero-play-btn");
  const playIcon = document.getElementById("hero-play-icon");
  const progressBar = document.getElementById("hero-progress");
  const progressContainer = document.getElementById("progress-container");
  const audioTime = document.getElementById("audio-time");
  const speed1x = document.getElementById("speed-1x");
  const speed15x = document.getElementById("speed-15x");
  const volumeBtn = document.getElementById("volume-btn");
  const volumeIcon = document.getElementById("volume-icon");

  if (playBtn) {
    // Local හෝ වෙනත් ස්ථාවරව වැඩ කරන පබ්ලික් MP3 ලින්ක් එකක් පාවිච්චි කිරීම වඩාත් ಸುರක්ෂිතයි
    const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    let isPlaying = false;

    // Helper: Format Time (seconds -> mm:ss)
    const formatTime = (seconds) => {
      if (isNaN(seconds)) return "00:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // Play/Pause Toggle
    playBtn.addEventListener("click", () => {
      if (isPlaying) {
        audio.pause();
        playIcon.className = "fa-solid fa-play";
      } else {
        audio.play().catch((err) => console.error("Audio error:", err));
        playIcon.className = "fa-solid fa-pause";
      }
      isPlaying = !isPlaying;
    });

    // Update Progress & Time (readyState පරීක්ෂා කිරීමෙන් duration එක නියතව ලබාගත හැක)
    audio.addEventListener("timeupdate", () => {
      if (audio.duration && !isNaN(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100;
        
        // Progress Bar width එක සහ Dot එකේ position එක අප්ඩේට් කිරීම
        if (progressBar) progressBar.style.width = `${percent}%`;
        const progressDot = document.getElementById("progress-dot");
        if (progressDot) progressDot.style.left = `${percent}%`;

        if (audioTime) {
          audioTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        }
      }
    });

    // Ensure duration is loaded initially
    audio.addEventListener("loadedloadeddata", () => {
      if (audioTime && audio.duration) {
        audioTime.textContent = `00:00 / ${formatTime(audio.duration)}`;
      }
    });

    // Audio Ended Reset
    audio.addEventListener("ended", () => {
      isPlaying = false;
      playIcon.className = "fa-solid fa-play";
      if (progressBar) progressBar.style.width = "0%";
      if (audioTime && audio.duration) {
        audioTime.textContent = `00:00 / ${formatTime(audio.duration)}`;
      }
    });

    // Click to Seek
    if (progressContainer) {
      progressContainer.addEventListener("click", (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        if (audio.duration && !isNaN(audio.duration)) {
          const newTime = (clickX / width) * audio.duration;
          
          // Seek කරන්න කලින් ඕඩියෝ එක පෝස් වෙලා නම් ප්ලේ ස්ටේට් එක තබාගැනීමට
          audio.currentTime = newTime;
          
          // බෆර් ප්‍රශ්න මඟහරවා ගැනීමට ප්ලේ වීම තහවුරු කිරීම
          if (isPlaying) {
            audio.play().catch((err) => console.log("Buffering or wait error:", err));
          }
        }
      });
    }

    // Speed Controls (1.0x සහ 1.5x ලෙස නිවැරදි කර ඇත)
    if (speed1x) {
      speed1x.addEventListener("click", () => {
        audio.playbackRate = 1.0;
        speed1x.className = "text-xs font-semibold text-black cursor-pointer";
        speed15x.className = "text-xs font-semibold text-gray-400 hover:text-black cursor-pointer";
      });
    }

    if (speed15x) {
      speed15x.addEventListener("click", () => {
        audio.playbackRate = 1.5;
        speed15x.className = "text-xs font-semibold text-black cursor-pointer";
        speed1x.className = "text-xs font-semibold text-gray-400 hover:text-black cursor-pointer";
      });
    }

    // Mute/Unmute Control
    if (volumeBtn) {
      volumeBtn.addEventListener("click", () => {
        audio.muted = !audio.muted;
        if (audio.muted) {
          volumeIcon.className = "fa-solid fa-volume-xmark";
        } else {
          volumeIcon.className = "fa-solid fa-volume-high";
        }
      });
    }
  }

  // --- Mobile Menu Setup ---
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      if (hamburgerIcon) hamburgerIcon.classList.toggle("hidden");
      if (closeIcon) closeIcon.classList.toggle("hidden");
    });
  }

  // --- Navigation Links Smooth Scroll using Lenis ---
  const navLinks = document.querySelectorAll("nav a, #mobile-menu a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(href);

        if (targetElement) {
          if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
            mobileMenu.classList.add("hidden");
            if (hamburgerIcon) hamburgerIcon.classList.remove("hidden");
            if (closeIcon) closeIcon.classList.add("hidden");
          }

          lenis.scrollTo(targetElement, {
            offset: -50, 
            duration: 1.2,
          });
        }
      }
    });
  });

  // --- Podcast Slider Setup ---
  const slider = document.getElementById("podcast-slider");
  const prevBtn = document.getElementById("slide-prev");
  const nextBtn = document.getElementById("slide-next");
  const dots = document.querySelectorAll(".dot");

  if (slider) {
    const updateDots = () => {
      const firstCard = slider.querySelector(".podcast-card");
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth + 36;
      const activeIndex = Math.round(slider.scrollLeft / cardWidth);

      dots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.classList.remove("bg-gray-300", "w-2.5");
          dot.classList.add("bg-gray-800", "w-6");
        } else {
          dot.classList.remove("bg-gray-800", "w-6");
          dot.classList.add("bg-gray-300", "w-2.5");
        }
      });
    };

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const firstCard = slider.querySelector(".podcast-card");
        if (!firstCard) return;
        const cardWidth = firstCard.offsetWidth + 36;
        slider.scrollBy({ left: cardWidth, behavior: "smooth" });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const firstCard = slider.querySelector(".podcast-card");
        if (!firstCard) return;
        const cardWidth = firstCard.offsetWidth + 36;
        slider.scrollBy({ left: -cardWidth, behavior: "smooth" });
      });
    }

    slider.addEventListener("scroll", updateDots);
  }

  // --- GSAP Animations (Optimized) ---

  // Hero Title & Buttons Animation
  gsap.fromTo(
    ".hero-title, .hero-section-btn",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.15,
      clearProps: "transform",
    },
  );

  // Hero Floating Card Animation
  gsap.fromTo(
    ".hero-section-items",
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay: 0.3,
      ease: "power2.out",
      clearProps: "transform",
    },
  );

  // Design Section Animation
  gsap.fromTo(
    ".design-section",
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8, 
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".design-section",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      clearProps: "transform",
    },
  );

  // Essential Episode Cards Scroll Animation (Super Smooth)
  gsap.fromTo(
    ".epi-cards", 
    {
      opacity: 0,
      y: 50,
      scale: 0.96,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
      stagger: {
        amount: 0.3,
        grid: "auto",
        from: "start",
      },
      scrollTrigger: {
        trigger: ".essential-grid",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      clearProps: "transform",
    },
  );
});
