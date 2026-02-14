gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis();
requestAnimationFrame(function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
});

const scrolled = () => {

    const navbar = document.getElementById("navbar");
    const navbarDiv = document.getElementById("navber-div");
    let lastScroll = 0;

    // window.addEventListener("scroll", () => {
    //     const currentScroll = window.pageYOffset;

    //     if (currentScroll <= 0) {
    //         navbar.classList.remove("backdrop-blur-md", "bg-zinc-950/60", "shadow-md");
    //         gsap.to(navbar, { y: 0, duration: 0.1, ease: "power3.out" });
    //         return;
    //     }

    //     if (currentScroll > lastScroll) {
    //         gsap.to(navbar, { y: "-100%", duration: 0.1, ease: "power3.out" });
    //     }
    //     else {
    //         gsap.to(navbar, { y: "0%", duration: 0.1, ease: "power3.out" });
    //         navbar.classList.add("backdrop-blur-md", "bg-zinc-950/60", "shadow-md");
    //     }

    //     lastScroll = currentScroll;
    // });
    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbarDiv.classList.remove("bg-zinc-950/60", "shadow-md");
            gsap.to(navbar, { y: 0, duration: 0.2, ease: "power3.out" });
            return;
        }

        if (currentScroll > lastScroll) {
            gsap.to(navbar, { y: "-100%", duration: 0.1, ease: "power3.out" });
        }
        else {
            gsap.to(navbar, { y: "0%", duration: 0.1, ease: "power3.out" });

            navbarDiv.classList.add("backdrop-blur-md", "bg-zinc-950/60", "shadow-md");
        }

        lastScroll = currentScroll;
    });



}



const textSrolled = () => {



    document.querySelectorAll('.cardsingle').forEach((card) => {

        gsap.to(card, {
            scale: 0.8,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
                // markers:true,
                trigger: card,
                start: "top 10%",
                end: "top -50%",
                scrub: 1,

            }
        });
    });


    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = faqItem.querySelector('.faq-icon');
            const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.querySelector('.faq-answer').style.maxHeight = '0';
                    item.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                }
            });
            if (isOpen) {
                answer.style.maxHeight = '0';
                icon.style.transform = 'rotate(0deg)';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}
scrolled()
textSrolled()


document.querySelectorAll(".nav-item").forEach((item) => {
    const letters = item.querySelectorAll(".letter");

    item.addEventListener("mouseenter", () => {
        letters.forEach((letter, index) => {
            const top = letter.querySelector(".top");
            const bottom = letter.querySelector(".bottom");

            gsap.to(top, {
                y: "-100%",
                duration: 0.6,
                delay: index * 0.03,
                ease: "power3.out"
            });

            gsap.to(bottom, {
                y: "-100%",
                duration: 0.6,
                delay: index * 0.03,
                ease: "power3.out"
            });
        });
    });

    item.addEventListener("mouseleave", () => {
        letters.forEach((letter, index) => {
            const top = letter.querySelector(".top");
            const bottom = letter.querySelector(".bottom");

            gsap.to(top, {
                y: "0%",
                duration: 0.4,
                delay: index * 0.03,
                ease: "power3.out"
            });

            gsap.to(bottom, {
                y: "0%",
                duration: 0.4,
                delay: index * 0.03,
                ease: "power3.out"
            });
        });
    });
});







