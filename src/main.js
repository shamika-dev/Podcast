import './style.css';
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger"; // { ScrollTrigger } වෙනුවට කෙලින්ම ScrollTrigger ගන්න

// JS File එකේ උඩින්ම මේ ටික දාන්න
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);



document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('hero-play-btn');
    const progressBar = document.getElementById('hero-progress');
    const progressContainer = document.getElementById('progress-container');

    
    if (!playBtn) {
        console.error('Play button setup error: #hero-play-btn හමු වූයේ නැත!');
        return;
    }

    // Sample Audio Track
    const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    let isPlaying = false;

    // 1. Play / Pause Button Event
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playBtn.textContent = '▶';
        } else {
            audio.play().then(() => {
                console.log('Audio is playing successfully!');
            }).catch(err => {
                console.error('Audio playback error:', err);
            });
            playBtn.textContent = '⏸';
        }
        isPlaying = !isPlaying;
    });

    // 2. Audio progress update
    audio.addEventListener('timeupdate', () => {
        if (audio.duration && progressBar) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
    });

    // 3. Audio Ended Reset
    audio.addEventListener('ended', () => {
        isPlaying = false;
        playBtn.textContent = '▶';
        if (progressBar) progressBar.style.width = '0%';
    });

    // 4. Seek on progress bar click
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;

            if (duration) {
                audio.currentTime = (clickX / width) * duration;
            }
        });
    }

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
});

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('podcast-slider');
    const prevBtn = document.getElementById('slide-prev');
    const nextBtn = document.getElementById('slide-next');
    const dots = document.querySelectorAll('.dot');

    if (slider) {
        
        const updateDots = () => {
            const firstCard = slider.querySelector('div');
            if (!firstCard) return;

            const cardWidth = firstCard.offsetWidth + 24; // Card width + gap
            const activeIndex = Math.round(slider.scrollLeft / cardWidth);

            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.remove('bg-gray-300', 'w-2.5');
                    dot.classList.add('bg-gray-800', 'w-6'); // Active Dot 
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
});





//gsap animations 



document.addEventListener('DOMContentLoaded', () => {

    // Hero Section Items (Page එක Load වෙද්දිම Animate වේ)
    gsap.fromTo(".hero-section-items",
        {
            opacity: 0,
            y: 60
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.2
        }
    );

    // Hero Title Animation
    gsap.fromTo(".hero-title", 
        {
            opacity: 0,
            x: -60
        },
        {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.2
        }
    );

    //Hero Button animation
    gsap.fromTo(".hero-section-btn", 
        {
            opacity: 0,
            x: -60
        },

        {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.2
        }
    );

    // Design Section Animation 
    gsap.fromTo(".design-section", 
        {
            opacity: 0,
            y: 70
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".design-section", 
                start: "top 80%",
                //toggleActions: "play none none reverse"
            }
        }
    );

    //top podcast titles
    gsap.fromTo(".top-podcast-titles" , 
        {
        opacity:0,
        y:30,

        },
        {
            opacity:1,
            y:0,
            duration:0.8,
            ease:"power2.out",
            stagger:0.2,
            scrollTrigger:{
                trigger:".top-podcast-titles",
                start:"top 90%",
            }
        }
    )

    //top podcast slider cards

    const podcastTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".top-podcast-titles", // Section එක උඩට එද්දී Animation එක පටන් ගනී
            start: "top 80%",
            toggleActions: "play none "
        }
    });

    // 1. Title සහ Subtitle Fade In & Slide Down
    podcastTl.fromTo(".top-podcast-titles", 
        { opacity: 0, y: -30 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    )

    // 2. Podcast Cards එකින් එක Left-to-Right හෝ Upward Fade In වීම (Staggered)
    .fromTo(".top-podcast-cads > div", 
        { opacity: 0, y: 50 }, 
        { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: "power2.out", 
            stagger: 0.2 
        },
        "-=0.3" // Title එක ඉවර වෙන්න 0.3s කට කලින් Cards animate වීම පටන් ගනී
    )

    // 3. Slider Buttons සහ Dots පහළින් Smooth ව ඇතුළු වීම
    .fromTo("#slide-prev, #slide-next, .dot", 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)", stagger: 0.05 },
        "-=0.4"
    );


    //EPISODES GRID

    // 2. Scroll Animation එක ලියන්න
gsap.fromTo(".epi-card", 
        {
            opacity: 0,
            y:20,
        },
        {
            opacity: 1,
            y: 0, // මුල් තැනට පැමිණේ
            duration: 0.2,
            ease: "power1.out",
            stagger: 0.3, // Card එකකට පස්සේ එකක් තත්පර 0.2 කින් animate වේ
            scrollTrigger: {
                trigger: ".epi-card", // ප්‍රධාන Trigger Target එක
                start: "top 80%", // Screen එකේ 85% ට ආවාම trigger වේ
                
            }
        }
    );

});