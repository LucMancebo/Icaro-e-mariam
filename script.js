function startCountdown(targetDate) {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(interval);
            countdownElement.innerHTML = "<h2>O grande dia chegou!</h2>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText = days < 10 ? '0' + days : days;
        hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Run immediately
}

// Set the date we're counting down to: March 6, 2027
// Note: Month is 0-indexed in JS Date? actually simpler to use string parsing or explicit setup.
// "March 6, 2027 00:00:00"
// Using explicit format YYYY-MM-DDT... to avoid locale issues ideally, but standard constructor works well.
// 2027, 2 (March is index 2), 6
const weddingDate = new Date(2027, 2, 6, 15, 0, 0).getTime(); // Assuming 16:00 ceremony based on schedule


// Initialize GSAP
document.addEventListener('DOMContentLoaded', () => {
    startCountdown(weddingDate);

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // GSAP Animations
    // Exclude .main-title from generic animations para evitar conflito com parallax
    const animatedElements = document.querySelectorAll('.animate-on-scroll:not(.main-title)');

    animatedElements.forEach((element) => {
        gsap.fromTo(element,
            {
                opacity: 0,
                y: 50,
                filter: "blur(10px)"
            },
            {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play reverse play reverse"
                },
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.2,
                ease: "power3.out"
            }
        );
    });

    // Título principal: sem animação, aparece direto
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        mainTitle.style.opacity = '1';
        mainTitle.style.transform = 'none';
        mainTitle.style.filter = 'none';
    }

    // Special Stagger for Lists/Grids (Override if they have specific parent classes)

    // Stagger for Schedule Items
    gsap.fromTo(".schedule-item",
        { opacity: 0, x: -30 },
        {
            scrollTrigger: {
                trigger: ".schedule-grid",
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play reverse play reverse"
            },
            opacity: 1,
            x: 0,
            duration: 1,
            stagger: 0.2, // 0.2s between each item
            ease: "power2.out"
        }
    );

    // Stagger for Details Boxes
    gsap.fromTo(".detail-box",
        { opacity: 0, scale: 0.9 },
        {
            scrollTrigger: {
                end: "bottom 20%",
                toggleActions: "play reverse play reverse",
                trigger: ".boxes-row",
                start: "top 80%",
            },
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)"
        }
    );

    // Hero Parallax (Title moves slower)
    // Initial state set by CSS or GSAP set to ensure visibility at start
    gsap.set(".main-title", { opacity: 1, y: 0, visibility: 'visible' }); 

    gsap.to(".main-title", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "center center", // Finish fading out by the time the center of hero hits center of viewport (or earlier)
            scrub: true, // Direct scrub without smoothing to prevent lag in restoration
        },
        y: 100, // Move title down as we scroll down
        opacity: 0,
        ease: "none"
    });

    // Cronômetro: sem animação, aparece direto
    document.querySelector('.cronometro-simples').style.opacity = '1';
    document.querySelector('.cronometro-simples').style.transform = 'none';
    document.querySelectorAll('.cronometro-simples .date-box').forEach(box => {
        box.style.opacity = '1';
        box.style.transform = 'none';
    });
});
