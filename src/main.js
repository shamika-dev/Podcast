import './style.css';
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis'; // Lenis නිවැරදිව import කර ඇතැයි සිතමු

// 1. Lenis Smooth Scroll Setup
const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. GSAP & ScrollTrigger Sync සමඟ සම්බන්ධ කිරීම (ලැග් වීම වැළැක්වීමට අත්‍යවශ්‍යයි)
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


// සියලුම DOM Events එකම තැනකට සකස් කිරීම
document.addEventListener('DOMContentLoaded', () => {

    // --- Audio Player Setup ---
    const playBtn = document.getElementById('hero-play-btn');
    const progressBar = document.getElementById('hero-progress');
    const progressContainer = document.getElementById('progress-container');

    if (playBtn) {
        const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
        let isPlaying = false;

        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                playBtn.textContent = '▶';
            } else {
                audio.play().catch(err => console.error('Audio playback error:', err));
                playBtn.textContent = '⏸';
            }
            isPlaying = !isPlaying;
        });

        audio.addEventListener('timeupdate', () => {
            if (audio.duration && progressBar) {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = `${progressPercent}%`;
            }
        });

        audio.addEventListener('ended', () => {
            isPlaying = false;
            playBtn.textContent = '▶';
            if (progressBar) progressBar.style.width = '0%';
        });

        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                const width = progressContainer.clientWidth;
                const clickX = e.offsetX;
                if (audio.duration) {
                    audio.currentTime = (clickX / width) * audio.duration;
                }
            });
        }
    }

    // --- Mobile Menu Setup ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            hamburgerIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    }

    // --- Podcast Slider Setup ---
    const slider = document.getElementById('podcast-slider');
    const prevBtn = document.getElementById('slide-prev');
    const nextBtn = document.getElementById('slide-next');
    const dots = document.querySelectorAll('.dot');

    if (slider) {
        const updateDots = () => {
            const firstCard = slider.querySelector('div');
            if (!firstCard) return;

            const cardWidth = firstCard.offsetWidth + 24;
            const activeIndex = Math.round(slider.scrollLeft / cardWidth);

            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.remove('bg-gray-300', 'w-2.5');
                    dot.classList.add('bg-gray-800', 'w-6');
                } else {
                    dot.classList.remove('bg-gray-800', 'w-6');
                    dot.classList.add('bg-gray-300', 'w-2.5');
                }
            });
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const cardWidth = slider.querySelector('div').offsetWidth + 24;
                slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const cardWidth = slider.querySelector('div').offsetWidth + 24;
                slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            });
        }

        slider.addEventListener('scroll', updateDots);
    }


    // --- GSAP Animations (Optimized) ---

    // Hero Section Items
    gsap.fromTo(".hero-section-items, .hero-title, .hero-section-btn",
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
            clearProps: "transform" // ඇනිමේෂන් එක ඉවර වුණාම CPU load එක අඩු කිරීමට මෙය උදව් වේ
        }
    );

    // Design Section Animation
    gsap.fromTo(".design-section",
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".design-section",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            clearProps: "transform"
        }
    );

    // Episode Cards Scroll Animation (ස්මූත් කර ඇත)
    gsap.fromTo(".epi-card",
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.15,
            scrollTrigger: {
                trigger: ".epi-card",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            clearProps: "transform"
        }
    );
});