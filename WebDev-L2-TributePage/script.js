(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasGSAP = typeof gsap !== "undefined";
    const hasLenis = typeof Lenis !== "undefined";

    let lenis = null;

  
    if (hasLenis && !reduceMotion) {
        lenis = new Lenis({
            duration: 1.15,
            smoothWheel: true,
            lerp: 0.09
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            const target = document.querySelector(link.getAttribute("href"));

            if (!target) return;

            e.preventDefault();

            if (lenis) {
                lenis.scrollTo(target, {
                    offset: -60,
                    duration: 1.2
                });
            } else {
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

  
    if (hasGSAP && !reduceMotion) {

        gsap.registerPlugin(ScrollTrigger);

        if (lenis) {
            lenis.on("scroll", ScrollTrigger.update);

            gsap.ticker.add(time => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        }

        window.addEventListener("load", () => {

            gsap.to(".hero-title .mask", {
                y: "0%",
                duration: 1.25,
                ease: "expo.out",
                stagger: 0.12,
                delay: 0.15
            });

            gsap.from(".hero-meta .tag", {
                y: -20,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                delay: 0.2
            });

            gsap.from(".hero-lede p, .scroll-cue", {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.12,
                delay: 0.7
            });

            gsap.fromTo(
                ".hero-figure img",
                {
                    clipPath: "inset(100% 0 0 0)",
                    scale: 1.2
                },
                {
                    clipPath: "inset(0% 0 0 0)",
                    scale: 1,
                    duration: 1.4,
                    ease: "expo.out",
                    delay: 0.4
                }
            );
        });

        
        document.querySelectorAll("[data-reveal]").forEach(el => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%"
                }
            });
        });

        
        document.querySelectorAll("[data-parallax] img").forEach(img => {
            gsap.to(img, {
                yPercent: 12,
                ease: "none",
                scrollTrigger: {
                    trigger: img,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        
        const track = document.querySelector("[data-marquee]");

        if (track) {
            gsap.to(track, {
                x: -(track.scrollWidth / 2),
                duration: 22,
                ease: "none",
                repeat: -1
            });
        }

    } else {

        document
            .querySelectorAll("[data-reveal]")
            .forEach(el => el.classList.add("is-in"));

        document
            .querySelectorAll(".hero-title .mask")
            .forEach(el => (el.style.transform = "none"));
    }

    
    const cursor = document.querySelector("[data-cursor]");

    if (cursor && window.matchMedia("(pointer:fine)").matches) {

        let mouseX = 0,
            mouseY = 0,
            x = 0,
            y = 0;

        document.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            x += (mouseX - x) * 0.2;
            y += (mouseY - y) * 0.2;

            cursor.style.transform =
                `translate(${x}px, ${y}px) translate(-50%, -50%)`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        document.querySelectorAll("[data-cursor-grow], a, button")
            .forEach(el => {
                el.addEventListener("mouseenter", () => {
                    cursor.classList.add("grow");
                });

                el.addEventListener("mouseleave", () => {
                    cursor.classList.remove("grow");
                });
            });
    }

})();