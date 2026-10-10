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
  // --- Audio Player Setup ---
  const playBtn = document.getElementById("hero-play-btn");
  const progressBar = document.getElementById("hero-progress");
  const progressContainer = document.getElementById("progress-container");

  if (playBtn) {
    const audio = new Audio(
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    );
    let isPlaying = false;

    playBtn.addEventListener("click", () => {
      if (isPlaying) {
        audio.pause();
        playBtn.textContent = "▶";
      } else {
        audio
          .play()
          .catch((err) => console.error("Audio playback error:", err));
        playBtn.textContent = "⏸";
      }
      isPlaying = !isPlaying;
    });

    audio.addEventListener("timeupdate", () => {
      if (audio.duration && progressBar) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
      }
    });

    audio.addEventListener("ended", () => {
      isPlaying = false;
      playBtn.textContent = "▶";
      if (progressBar) progressBar.style.width = "0%";
    });

    if (progressContainer) {
      progressContainer.addEventListener("click", (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        if (audio.duration) {
          audio.currentTime = (clickX / width) * audio.duration;
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

  // --- Podcast Slider Setup ---
  const slider = document.getElementById("podcast-slider");
  const prevBtn = document.getElementById("slide-prev");
  const nextBtn = document.getElementById("slide-next");
  const dots = document.querySelectorAll(".dot");

  if (slider) {
    const updateDots = () => {
      const firstCard = slider.querySelector(".podcast-card");
      if (!firstCard) return;

      // කාඩ් එකේ පළල සහ CSS හි ඇති gap එක (approx 36px) මතක් කර ගනිමින්
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
      duration: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".design-section",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      clearProps: "transform",
    },
  );

  // Episode Cards Scroll Animation
  // Essential Episode Cards Scroll Animation (Super Smooth Floating Effect)
  // Essential Episode Cards Scroll Animation (Super Smooth Floating Effect)
  gsap.fromTo(
    ".epi-cards",
    {
      opacity: 0,
      y: 100, // පහළ සිට ටිකක් ඉහළට පාවී ඒමට
      scale: 0.96, // ඉතා කුඩා පරිමාණයක සිට සාමාන්‍ය ප්‍රමාණයට පැමිණීමට
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.1, // වේලාව මඳක් වැඩි කිරීමෙන් සිනිදු බව වැඩි වේ
      ease: "power3.in", // කුට්ටි පැනීම වැළැක්වීමට හොඳම සහ සිනිදු easing එකක්
      stagger: {
        amount: 0.3, // කාඩ්ස් එකිනෙක අතර මතු වීමේ පරතරය ස්මූත් කිරීම
        grid: "auto",
        from: "start",
      },
      scrollTrigger: {
        trigger: ".essential-grid", // මෙතැනට ඔබ HTML එකේ දී ඇති class එක දමා ඇත
        start: "top 80%", // තිරයේ 85% කට පැමිණි විට ඇනිමේෂන් එක ඇරඹේ
        scrollTrigger: "play none play revers",
      },
      clearProps: "transform",
    },
  );
});
