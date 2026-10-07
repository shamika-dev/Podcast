import './style.css';


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
