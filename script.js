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
  const scrollThreshold = 5; // 👈 important

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Ignore tiny scroll changes
    if (Math.abs(currentScroll - lastScroll) < scrollThreshold) {
      return;
    }

    if (currentScroll <= 0) {
      navbarDiv.classList.remove(
        "bg-zinc-950/60",
        "shadow-md",
        "backdrop-blur-md",
      );
      gsap.to(navbar, { y: 0, duration: 0.2, ease: "power3.out" });
    } else if (currentScroll > lastScroll) {
      // Scroll down → hide
      gsap.to(navbar, { y: "-115%", duration: 0.2, ease: "power3.out" });
    } else {
      // Scroll up → show
      gsap.to(navbar, { y: "0%", duration: 0.2, ease: "power3.out" });
      navbarDiv.classList.add(
        "backdrop-blur-md",
        "bg-zinc-950/60",
        "shadow-md",
      );
    }

    lastScroll = currentScroll;
  });
};

const textSrolled = () => {
  document.querySelectorAll(".cardsingle").forEach((card) => {
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
      },
    });
  });

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const faqItem = button.parentElement;
      const answer = faqItem.querySelector(".faq-answer");
      const icon = faqItem.querySelector(".faq-icon");
      const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px";

      document.querySelectorAll(".faq-item").forEach((item) => {
        if (item !== faqItem) {
          item.querySelector(".faq-answer").style.maxHeight = "0";
          item.querySelector(".faq-icon").style.transform = "rotate(0deg)";
        }
      });
      if (isOpen) {
        answer.style.maxHeight = "0";
        icon.style.transform = "rotate(0deg)";
      } else {
        answer.style.maxHeight = answer.scrollHeight + "px";
        icon.style.transform = "rotate(180deg)";
      }
    });
  });
};

const navlinkflipping = () => {
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
          ease: "power3.out",
        });

        gsap.to(bottom, {
          y: "-100%",
          duration: 0.6,
          delay: index * 0.03,
          ease: "power3.out",
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
          ease: "power3.out",
        });

        gsap.to(bottom, {
          y: "0%",
          duration: 0.4,
          delay: index * 0.03,
          ease: "power3.out",
        });
      });
    });
  });
};

const cardHover = () => {
  const marquee = document.querySelectorAll(".marquee");

  // base infinite motion
  const tween = gsap.to(marquee, {
    xPercent: -150,
    duration: 25,
    ease: "none",
    repeat: -1,
  });

  // SCROLL DIRECTION + SPEED
  let lastScroll = window.pageYOffset;

  window.addEventListener("scroll", () => {
    const current = window.pageYOffset;
    const delta = current - lastScroll;

    const direction = delta > 0 ? -1 : 1;
    const speed = gsap.utils.clamp(0.5, 6, Math.abs(delta) * 0.05);

    gsap.to(tween, {
      timeScale: speed,
      duration: 0.4,
      ease: "power3.out",
    });

    lastScroll = current;
  });
};

const initMarquees = () => {
  // 1. Wire Lenis into ScrollTrigger so they don't fight
  //   lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const tweens = [];

  // 2. Scope each marquee independently
  document.querySelectorAll(".marquee_inner").forEach((inner) => {
    const parts = inner.querySelectorAll(".marquee_part");

    gsap.set(inner, { xPercent: -50 });

    const tween = gsap
      .to(parts, {
        xPercent: -120,
        repeat: -1,
        duration: 13,
        ease: "linear",
      })
      .totalProgress(0.5);

    tweens.push(tween);
  });

  // 3. ONE shared scroll listener via ScrollTrigger
  let isDown = true;

  ScrollTrigger.create({
    onUpdate: (self) => {
      const down = self.direction === 1;
      if (down === isDown) return; // no change, skip

      isDown = down;

      // Flip all marquee tweens
      tweens.forEach((t) => gsap.to(t, { timeScale: isDown ? 1 : -1 }));

      // Toggle Tailwind class on all marquee wrappers (for arrow rotation)
      document.querySelectorAll(".marquee_inner").forEach((el) => {
        el.classList.toggle("scrolling-down", isDown);
      });
    },
  });
};
const cardAnimation = () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const imgLayer = card.querySelector(".imgLayer");
    const logo = card.querySelector(".logo");
    const arrowBtn = card.querySelector(".arrowBtn");
    const bottomTitle = card.querySelector(".bottomTitle");
    const cursorDot = card.querySelector(".cursorDot");

    const PARALLAX = 20;

    gsap.set(imgLayer, { scale: 1.0 });

    // Mouse Enter
    card.addEventListener("mouseenter", () => {
      gsap.to(imgLayer, {
        scale: 1.1,
        duration: 0.6,
        ease: "power2.out",
      });

      if (logo) {
        gsap.set(logo, { visibility: "visible" });
        gsap.fromTo(
          logo,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
        );
      }

      gsap.set(arrowBtn, { visibility: "visible" });
      gsap.fromTo(
        arrowBtn,
        { opacity: 0, y: -10, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.7)" },
      );

      gsap.set(bottomTitle, { visibility: "visible" });
      gsap.fromTo(
        bottomTitle,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
      );

      gsap.to(cursorDot, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    });

    // Mouse Leave
    card.addEventListener("mouseleave", () => {
      gsap.to(imgLayer, {
        scale: 1.0,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      if (logo) {
        gsap.to(logo, {
          opacity: 0,
          y: -10,
          duration: 0.35,
          ease: "power2.in",
          onComplete: () => gsap.set(logo, { visibility: "hidden" }),
        });
      }

      gsap.to(arrowBtn, {
        opacity: 0,
        y: -10,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => gsap.set(arrowBtn, { visibility: "hidden" }),
      });

      gsap.to(bottomTitle, {
        opacity: 0,
        y: 12,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => gsap.set(bottomTitle, { visibility: "hidden" }),
      });

      gsap.to(cursorDot, {
        opacity: 0,
        duration: 0.2,
      });
    });

    // Mouse Move
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const nx = (x - cx) / cx;
      const ny = (y - cy) / cy;
      const tx = -(nx * PARALLAX);
      const ty = -(ny * PARALLAX);

      gsap.to(imgLayer, {
        x: -tx,
        y: -ty,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.set(cursorDot, {
        left: x,
        top: y,
      });
    });
  });
};
const cardAnimation2 = () => {
  const cards = document.querySelectorAll(".card1");
  cards.forEach((card, index) => {
    gsap.set(card, {
      opacity: 0,
      y: 120,
    });

    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: index * 0.12,
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        end: "top 40%",
        toggleActions: "play none none reverse",
      },
    });
  });
};
// cardAnimation2()
cardAnimation();
initMarquees();

scrolled();
textSrolled();
navlinkflipping();
cardHover();
