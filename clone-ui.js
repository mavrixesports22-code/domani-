(() => {
  const safeGet = (key) => {
    try { return window.localStorage.getItem(key); } catch { return null; }
  };
  const safeSet = (key, value) => {
    try { window.localStorage.setItem(key, value); } catch { /* file:// storage can be disabled */ }
  };

  const aiLayer = document.querySelector("[data-grace-ai-disclosure]");
  const dismissAI = () => {
    if (!aiLayer) return;
    document.body.style.overflow = "";
    safeSet("grace-ai-disclosure-dismissed", "1");
    aiLayer.classList.add("is-closing");
    window.setTimeout(() => { aiLayer.hidden = true; }, 220);
  };
  if (aiLayer && safeGet("grace-ai-disclosure-dismissed") !== "1") {
    document.body.style.overflow = "hidden";
    aiLayer.querySelector("[data-dismiss-ai-disclosure]")?.addEventListener("click", dismissAI);
  } else if (aiLayer) {
    aiLayer.hidden = true;
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && aiLayer && !aiLayer.hidden) dismissAI();
  });

  const cookieBanner = document.getElementById("cookiebanner");
  const hideCookieBanner = () => {
    if (!cookieBanner) return;
    cookieBanner.classList.add("is-hidden");
    safeSet("grace-cookie-choice", "saved");
  };
  if (cookieBanner && safeGet("grace-cookie-choice")) cookieBanner.classList.add("is-hidden");
  cookieBanner?.querySelectorAll(".c-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      hideCookieBanner();
    });
  });
  document.querySelectorAll("button").forEach((button) => {
    if (button.textContent.trim().toLowerCase() !== "cookie settings") return;
    button.addEventListener("click", () => {
      cookieBanner?.classList.remove("is-hidden");
      if (cookieBanner) cookieBanner.hidden = false;
    });
  });

  const menuButton = document.querySelector('button[aria-controls="mobile-menu"]');
  if (menuButton) {
    let menu = document.getElementById("mobile-menu");
    if (!menu) {
      menu = document.createElement("div");
      menu.id = "mobile-menu";
      menu.dataset.graceMobileMenu = "";
      menu.hidden = true;
      menu.innerHTML = [
        '<a href="https://gracefashion.ai/features">Product</a>',
        '<a href="https://gracefashion.ai/blog">Blog</a>',
        '<a href="https://gracefashion.ai/team">Team</a>',
        '<a href="https://gracefashion.ai/book">Book a demo</a>',
      ].join("");
      document.body.append(menu);
    }
    menuButton.addEventListener("click", () => {
      const open = menu.hidden;
      menu.hidden = !open;
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.textContent = open ? "Close" : "Menu";
    });
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      menu.hidden = true;
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Menu";
    }));
  }

  document.querySelector('[aria-label="Grace - Scroll to top"]')?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const tablist = document.querySelector('[role="tablist"][aria-label="Customer voices"]');
  if (tablist) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const wrapper = tablist.parentElement;
    const quotes = [...wrapper.querySelectorAll("blockquote")];
    const author = wrapper.querySelector(":scope > p.caption");
    const voices = [
      {
        name: "Felix Wolf",
        byline: ", Officer Onlineshop &amp; Operations, Carl Gross &amp; Club of Gents, Création Gross GmbH &amp; Co. KG",
      },
      {
        name: "Ronald Kloiber",
        byline: ", Director Global Marketing, Mustang GmbH",
      },
      {
        name: "Felix Pilgram",
        byline: ", Head of Studio, NOVA Studios GmbH (formerly RCom Studios)",
      },
      {
        name: "Laura Figge &amp; Nadine Rother",
        byline: ", E-Commerce Manager &amp; Social Media Manager, MARC AUREL Textil GmbH",
      },
      {
        name: "Michael Ochmann",
        byline: ", Brand Manager, FALKE",
      },
    ];
    const selectVoice = (index) => {
      quotes.forEach((quote, i) => {
        const active = i === index;
        quote.setAttribute("aria-hidden", String(!active));
        quote.style.pointerEvents = active ? "auto" : "none";
        quote.style.opacity = active ? "1" : "0";
        quote.style.transform = active ? "none" : "translateY(8px)";
      });
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute("aria-selected", String(active));
        const track = tab.querySelector(":scope > span:first-child");
        track?.classList.toggle("bg-black", active);
        track?.classList.toggle("bg-neutral-200", !active);
        let fill = tab.querySelector(":scope > span:nth-child(2)");
        if (active && !fill) {
          fill = document.createElement("span");
          fill.className = "absolute inset-x-0 top-1/2 h-px";
          fill.innerHTML = '<span class="absolute inset-y-0 left-0 transition-colors duration-700 bg-black" style="width:100%"></span>';
          tab.append(fill);
        } else if (!active && fill) {
          fill.remove();
        }
      });
      if (author && voices[index]) {
        author.innerHTML = '<span class="transition-colors duration-700 text-black">' + voices[index].name + "</span>" + voices[index].byline;
      }
    };
    tabs.forEach((tab, index) => tab.addEventListener("click", () => selectVoice(index)));
  }

  // Keep the original scroll-led feel with a local GSAP + ScrollTrigger build.
  const scriptUrl = document.currentScript?.src || window.location.href;
  const localRoot = new URL(".", scriptUrl);
  const loadLocalScript = (path) => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = new URL(path, localRoot).href;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Could not load " + path));
    document.head.append(script);
  });

  const initMotion = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = document.querySelector("nav");
    const hero = document.querySelector(".hero-container");

    if (!reduced) {
      gsap.fromTo(document.body,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.48, ease: "power2.out", clearProps: "opacity,visibility" }
      );

      // Keep local page changes feeling like part of the same editorial site.
      document.addEventListener("click", (event) => {
        const link = event.target.closest("a[href]");
        if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (link.target || link.hasAttribute("download")) return;
        let destination;
        try { destination = new URL(link.href, window.location.href); } catch { return; }
        if (destination.origin !== window.location.origin || destination.protocol !== "http:" && destination.protocol !== "https:") return;
        if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;
        event.preventDefault();
        gsap.to(document.body, {
          autoAlpha: 0,
          y: -7,
          duration: 0.24,
          ease: "power2.in",
          overwrite: "auto",
          onComplete: () => window.location.assign(destination.href)
        });
      });
    }

    if (!reduced && hero) {
      const heroImage = hero.querySelector(".hero-bg img")?.parentElement;
      const heroLogo = hero.querySelector(".hero-logo");
      const tiles = hero.querySelectorAll(".bg-black");
      if (heroImage) {
        gsap.fromTo(heroImage,
          { scale: 1.28, filter: "blur(8px)" },
          { scale: 1.2, filter: "blur(0px)", duration: 1.5, ease: "power3.out", delay: 0.08 }
        );
        gsap.to(heroImage, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: document.documentElement, start: "top top", end: () => Math.max(560, innerHeight * 0.9), scrub: 0.8 }
        });
      }
      if (heroLogo) {
        gsap.fromTo(heroLogo,
          { autoAlpha: 0, scale: 0.86, y: 24 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 1.15, ease: "power3.out", delay: 0.18 }
        );
        gsap.to(heroLogo, {
          autoAlpha: 0,
          y: -110,
          ease: "none",
          scrollTrigger: { trigger: document.documentElement, start: "top top", end: () => Math.max(400, innerHeight * 0.65), scrub: 0.7 }
        });
      }
      if (tiles.length) {
        gsap.fromTo(tiles,
          { opacity: 0.42 },
          { opacity: 0, duration: 0.72, stagger: { amount: 0.62, from: "random" }, ease: "power2.out", delay: 0.12 }
        );
      }
    }

    if (!reduced) {
      const revealTargets = new Set(document.querySelectorAll(
        "section h2, section h3, section .headline-xl, section .headline-large, " +
        "section .headline-medium, section .subheadline, section p.body-large, " +
        "section blockquote, section figure, " +
        "article h1, article h2, article h3, article:not(.transition-all) p, " +
        "article figure, article.transition-all, " +
        "footer, .footer-reveal-wrap"
      ));
      revealTargets.forEach((element) => {
        if (element.classList.contains("sr-only") || element.closest("nav")) return;
        gsap.fromTo(element,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 90%", toggleActions: "play none none reverse" }
          }
        );
      });

      const photos = document.querySelectorAll(
        "section img:not([aria-hidden='true']), article img:not([aria-hidden='true'])"
      );
      photos.forEach((image) => {
        if (!image.getAttribute("alt") || image.closest("[aria-hidden='true']")) return;
        gsap.fromTo(image,
          { scale: 1.055 },
          {
            scale: 1,
            duration: 1.05,
            ease: "power2.out",
            scrollTrigger: { trigger: image, start: "top 94%", toggleActions: "play none none reverse" }
          }
        );
      });

      const autoplayVideos = document.querySelectorAll("video[autoplay]");
      if (autoplayVideos.length && "IntersectionObserver" in window) {
        const videoObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const video = entry.target;
            if (!video.currentSrc && !video.querySelector("source[src]") && !video.getAttribute("src")) return;
            if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
              video.muted = true;
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        }, { threshold: [0, 0.2, 0.7] });
        autoplayVideos.forEach((video) => videoObserver.observe(video));
      }

      if (nav) {
        let navY = 0;
        ScrollTrigger.create({
          start: 80,
          end: 999999,
          onUpdate(self) {
            const nextY = self.direction > 0 && self.scroll() > 180 ? -110 : 0;
            if (nextY === navY) return;
            navY = nextY;
            gsap.to(nav, { yPercent: nextY, duration: 0.32, ease: "power2.out", overwrite: "auto" });
          }
        });
      }
    }

    document.documentElement.classList.add("gsap-motion-ready");
    ScrollTrigger.refresh();
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  };

  loadLocalScript("vendor/gsap.min.js")
    .then(() => loadLocalScript("vendor/ScrollTrigger.min.js"))
    .then(() => {
      if (document.readyState === "complete") initMotion();
      else window.addEventListener("load", initMotion, { once: true });
    })
    .catch((error) => console.warn("[grace clone] motion library unavailable", error));
})();
