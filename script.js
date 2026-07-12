gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis();

// Sync ScrollTrigger with Lenis's smoothed scroll position
lenis.on("scroll", ScrollTrigger.update);

// Drive Lenis with GSAP's ticker ONLY (removed the manual rAF loop that was fighting with this)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const textSrolled = () => {
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
  const tweens = [];

  document.querySelectorAll(".marquee_inner").forEach((inner) => {
    const parts = inner.querySelectorAll(".marquee_part");
    const partsCount = parts.length;

    // GPU hint
    gsap.set(inner, { force3D: true });

    // Shifting by exactly one "period" (item + gap) of the track
    // makes the repeat snap-back visually seamless, since every
    // part looks the same.
    const tween = gsap
      .to(inner, {
        xPercent: -(100 / partsCount),
        duration: 10,
        ease: "none",
        repeat: -1,
      })
      .totalProgress(0.5); // start mid-loop, optional

    tweens.push(tween);
  });

  let isDown = true;

  ScrollTrigger.create({
    onUpdate: (self) => {
      const down = self.direction === 1;
      if (down === isDown) return;
      isDown = down;

      tweens.forEach((t) =>
        gsap.to(t, { timeScale: isDown ? 1 : -1, overwrite: true }),
      );

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
    const imglayerbg = card.querySelector(".imglayerbg");
    const arrowBtn = card.querySelector(".arrowBtn");
    const bottomTitle = card.querySelector(".bottomTitle");
    const cursorDot = card.querySelector(".cursorDot");

    const PARALLAX = 20;

    gsap.set(imgLayer, { scale: 1.0 });

    // Mouse Enter
    card.addEventListener("mouseenter", () => {
      gsap.to(imgLayer, {
        scale: 1.05,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.set(arrowBtn, { visibility: "visible" });
      gsap.fromTo(
        arrowBtn,
        { opacity: 0, y: -10, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.7)" },
      );

      gsap.set(imglayerbg, { opacity: 1, visibility: "visible" });
      gsap.fromTo(
        imglayerbg,
        { y: 100 },
        { y: 0, duration: 1, ease: "power3.out" },
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
      gsap.to(imglayerbg, {
        opacity: 0,
        y: 100,

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



cardAnimation();
initMarquees();

textSrolled();
navlinkflipping();
cardHover();

const rotateWords = () => {
  const rotator = document.getElementById("wordRotator");
  const track = document.getElementById("wordTrack");
  if (!track || !rotator) return;

  const words = track.querySelectorAll(".word");
  const total = words.length;
  let index = 0;
  let wordHeight = 0;
  let tl;

  const measure = () => {
    wordHeight = words[0].getBoundingClientRect().height;
    rotator.style.height = wordHeight + "px";
    gsap.set(track, { y: -wordHeight * index });
  };

  const buildTimeline = () => {
    if (tl) tl.kill();

    tl = gsap
      .timeline({ repeat: -1 })
      .to({}, { duration: 3 }) // hold current word for 3s
      .add(() => {
        index++;

        if (index === total - 1) {
          // last item is the duplicate "Website" — animate to it normally,
          // then instantly snap back to real index 0 with no visible jump
          gsap.to(track, {
            y: -wordHeight * index,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
              index = 0;
              gsap.set(track, { y: 0 });
            },
          });
        } else {
          gsap.to(track, {
            y: -wordHeight * index,
            duration: 0.8,
            ease: "power3.inOut",
          });
        }
      });
  };

  measure();
  buildTimeline();

  // Recalculate on resize (debounced) so breakpoint font-size changes
  // (text-4xl -> sm:text-6xl -> lg:text-9xl) never desync the track
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 150);
  });
};

rotateWords();
const mobileMenuAnim = () => {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const links = document.querySelectorAll(".mobile-link span, .mobile-link");

  if (!menuBtn || !mobileMenu) return;

  let isOpen = false;

  // initial state
  gsap.set(mobileMenu, { clipPath: "circle(0% at 100% 0%)" });
  gsap.set(links, { y: 40, opacity: 0 });

  menuBtn.addEventListener("click", () => {
    isOpen = !isOpen;
    menuBtn.classList.toggle("open", isOpen);

    if (isOpen) {
      mobileMenu.classList.remove("pointer-events-none");
      document.body.style.overflow = "hidden";

      gsap.to(mobileMenu, {
        clipPath: "circle(150% at 100% 0%)",
        duration: 0.7,
        ease: "power3.inOut",
      });

      gsap.to(links, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.25,
        ease: "power3.out",
      });
    } else {
      gsap.to(links, {
        y: 20,
        opacity: 0,
        duration: 0.25,
        stagger: 0.04,
        ease: "power2.in",
      });

      gsap.to(mobileMenu, {
        clipPath: "circle(0% at 100% 0%)",
        duration: 0.6,
        delay: 0.1,
        ease: "power3.inOut",
        onComplete: () => {
          mobileMenu.classList.add("pointer-events-none");
          document.body.style.overflow = "auto";
        },
      });
    }
  });
};

mobileMenuAnim();

const countUpStats = () => {
  const counters = document.querySelectorAll(
    "#ratingCount, #projectsCount, #countriesCount",
  );

  counters.forEach((el) => {
    const target = parseFloat(el.dataset.target);
    const isDecimal = el.dataset.decimal === "true";
    const counterObj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true, // fires only once — no re-triggering, no memory buildup
      onEnter: () => {
        gsap.to(counterObj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = isDecimal
              ? counterObj.val.toFixed(1)
              : Math.round(counterObj.val);
          },
        });
      },
    });
  });
};

countUpStats();
const contactFormHandler = () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  // Initialize with your EmailJS public key (same account as your bug reporting setup)
  emailjs.init("siVG8IMv9HLqNG40E");

  const submitBtn = document.getElementById("submitBtn");
  const submitBtnText = document.getElementById("submitBtnText");
  const formStatus = document.getElementById("formStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtnText.textContent = "Sending...";
    formStatus.classList.add("hidden");

    emailjs
      .sendForm("service_qnx153s", "template_4rxz9kn", form)
      .then(() => {
        submitBtnText.textContent = "Sent ✓";
        formStatus.textContent =
          "Thanks! We'll get back to you within 24 hours.";
        formStatus.classList.remove("hidden", "text-red-400");
        formStatus.classList.add("text-green-400");
        form.reset();

        setTimeout(() => {
          submitBtnText.textContent = "Send Message →";
          submitBtn.disabled = false;
        }, 2500);
      })
      .catch(() => {
        submitBtnText.textContent = "Send Message →";
        submitBtn.disabled = false;
        formStatus.textContent =
          "Something went wrong. Please try again or email us directly.";
        formStatus.classList.remove("hidden", "text-green-400");
        formStatus.classList.add("text-red-400");
      });
  });
};

contactFormHandler();
const footerReveal = () => {
  document.querySelectorAll(".footer-reveal").forEach((el) => {
    gsap.set(el, { y: 30, opacity: 0 });

    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    });
  });
};


footerReveal();
const bookMeetingScroll = () => {
  const bookBtns = document.querySelectorAll(".getInTouchBtn");
  if (!bookBtns.length) return;

  bookBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById("getInTouch");

      if (target) {
        // Already on the page that has the contact section — just scroll to it
        if (typeof lenis !== "undefined" && lenis) {
          lenis.scrollTo(target, {
            duration: 1.5,
            easing: (t) => 1 - Math.pow(1 - t, 3),
          });
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        // Not on the home page — redirect there with a hash, scroll happens after load
        window.location.href = "./index.html#getInTouch";
      }
    });
  });
};
const scrollToHashOnLoad = () => {
  if (window.location.hash === "#getInTouch") {
    const target = document.getElementById("getInTouch");
    if (!target) return;

    // slight delay so Lenis has finished initializing before we scroll
    setTimeout(() => {
      if (typeof lenis !== "undefined" && lenis) {
        lenis.scrollTo(target, {
          duration: 1.5,
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  }
};
console.log('dsds')
const backToTopButton = () => {
  const btns = document.querySelectorAll(".scrollTopBtn");
  if (!btns.length) return;

  const getScrollProgress = () => {
    const scrollY = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return 0;
    return Math.min(1, Math.max(0, scrollY / maxScroll));
  };

  let visible = false;
  const progressObj = { value: 0 };

  const updateProgress = () => {
    const progress = getScrollProgress();
    const targetPercent = progress * 100;

    gsap.to(progressObj, {
      value: targetPercent,
      duration: 0.2,
      ease: "none",
      overwrite: "auto",
      onUpdate: () => {
        const deg = progressObj.value * 3.6; // 0–100% → 0–360deg
        btns.forEach((btn) => {
          btn.style.background = `conic-gradient(#2B7FFF ${deg}deg, rgba(255,255,255,0.15) ${deg}deg)`;
        });
      },
    });

    const shouldShow = window.pageYOffset > 100;

    if (shouldShow && !visible) {
      visible = true;
      gsap.to(btns, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
        pointerEvents: "auto",
      });
    } else if (!shouldShow && visible) {
      visible = false;
      gsap.to(btns, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
        pointerEvents: "none",
      });
    }
  };

  if (typeof lenis !== "undefined" && lenis) {
    lenis.on("scroll", updateProgress);
  } else {
    window.addEventListener("scroll", updateProgress, { passive: true });
  }

  window.addEventListener("resize", updateProgress);
  updateProgress();

  btns.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, { scale: 1.08, duration: 0.3, ease: "power2.out" });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
    });

    btn.addEventListener("mousedown", () => {
      gsap.to(btn, { scale: 0.94, duration: 0.15, ease: "power2.out" });
    });

    btn.addEventListener("mouseup", () => {
      gsap.to(btn, { scale: 1.08, duration: 0.15, ease: "power2.out" });
    });

    btn.addEventListener("click", () => {
      if (typeof lenis !== "undefined" && lenis) {
        lenis.scrollTo(0, {
          duration: 1.6,
          easing: (t) => 1 - Math.pow(1 - t, 4),
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
};

backToTopButton();

backToTopButton();
bookMeetingScroll();
scrollToHashOnLoad();


