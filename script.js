// Lyricsaucedo.dev — Awwwards redesign interactions
(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const desktop = () => window.innerWidth > 860;
  const mobile = () => !desktop();
  const hasGSAP = typeof gsap !== "undefined";
  const hasLenis = typeof Lenis !== "undefined";

  if (hasGSAP && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ——— Loader ———
  const loader = document.getElementById("loader");
  const fill = document.getElementById("loaderFill");
  const count = document.getElementById("loaderCount");

  const boot = () => {
    initNav();
    initLenis();
    initCursor();
    initMagnets();
    initIntro();
    initStatement();
    initWorkRail();
    initCraft();
    initProcess();
    initProgress();
    initEmail();
  }

// ——— Email CTA ———
  function initEmail() {
    const EMAIL = "lyricsaucedo.dev@gmail.com";
    const btn = document.getElementById("emailBtn");
    const copyBtn = document.getElementById("copyEmail");
    const note = document.getElementById("emailCopied");
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent("Project enquiry")}`;

    const showCopied = () => {
      if (!note) return;
      note.hidden = false;
      clearTimeout(note._t);
      note._t = setTimeout(() => {
        note.hidden = true;
      }, 1800);
    };

    const copyEmail = async () => {
      try {
        await navigator.clipboard.writeText(EMAIL);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = EMAIL;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      showCopied();
    };

    if (btn) {
      btn.setAttribute("href", mailto);
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        let handedOff = false;
        const mark = () => {
          handedOff = true;
        };
        window.addEventListener("blur", mark, { once: true });
        const onVis = () => {
          if (document.hidden) mark();
        };
        document.addEventListener("visibilitychange", onVis);

        // Try opening the mail client
        window.location.href = mailto;

        // If focus never leaves the page, mailto likely failed — copy instead
        setTimeout(() => {
          window.removeEventListener("blur", mark);
          document.removeEventListener("visibilitychange", onVis);
          if (handedOff) return;
          copyEmail();
          const prev = btn.textContent;
          btn.textContent = "Email copied";
          clearTimeout(btn._t);
          btn._t = setTimeout(() => {
            btn.textContent = prev;
          }, 1800);
        }, 1200);
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        copyEmail();
      });
    }
  }

  if (reduced || !loader) {
    if (loader) loader.classList.add("is-done");
    boot();
  } else {
    let p = 0;
    const step = () => {
      p = Math.min(100, p + (p > 78 ? 1.1 : 2.6) + Math.random() * 2.2);
      if (fill) fill.style.width = `${p}%`;
      if (count) count.textContent = String(Math.floor(p)).padStart(2, "0");
      if (p < 100) requestAnimationFrame(step);
      else {
        setTimeout(() => {
          loader.classList.add("is-done");
          boot();
        }, 220);
      }
    };
    requestAnimationFrame(step);
  }

  // ——— Nav ———
  function initNav() {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("navToggle");
    if (!nav) return;

    const links = [...nav.querySelectorAll(".nav__menu a[data-section]")];
    const sections = links
      .map((a) => document.getElementById(a.dataset.section))
      .filter(Boolean);

    const setActive = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      let current = null;
      sections.forEach((sec) => {
        if (sec.offsetTop <= y) current = sec.id;
      });
      links.forEach((a) => {
        a.classList.toggle("is-active", a.dataset.section === current);
      });
      if (window.scrollY < (document.getElementById("intro")?.offsetHeight || 0) * 0.45) {
        links.forEach((a) => a.classList.remove("is-active"));
      }
    };

    setActive();
    window.addEventListener("scroll", setActive, { passive: true });
    window.addEventListener("resize", setActive, { passive: true });

    if (toggle) {
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("nav-open", open);
      });
      nav.querySelectorAll(".nav__menu a").forEach((a) =>
        a.addEventListener("click", () => {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.classList.remove("nav-open");
        })
      );
      document.addEventListener("click", (e) => {
        if (!nav.classList.contains("open")) return;
        const pill = nav.querySelector(".nav__pill");
        if (
          pill?.contains(e.target) ||
          toggle.contains(e.target) ||
          e.target.closest(".nav__cta-pill") ||
          e.target.closest(".nav__brand")
        ) {
          return;
        }
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    }
  }

  // ——— Lenis ———
  let lenis;
  function initLenis() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        const t = id && document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(t, { offset: -20, duration: 1.35 });
        } else {
          t.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        }
      });
    });

    // Native scroll on mobile — Lenis + pin/scrub scenes fight touch momentum
    if (reduced || !hasLenis || mobile()) {
      return;
    }

    const isMac = /Mac|iPhone|iPad/.test(navigator.platform) || /Mac OS/.test(navigator.userAgent);

    lenis = new Lenis({
      // Slightly heavier lerp on Mac trackpads reduces pin/scrub overshoot
      lerp: isMac ? 0.12 : 0.08,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: isMac ? 0.85 : 1,
      touchMultiplier: 1.2,
    });

    if (hasGSAP && typeof ScrollTrigger !== "undefined") {
      // Keep ScrollTrigger locked to Lenis scroll so pins land in the right place
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length) {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.addEventListener("refresh", () => lenis.resize());
      requestAnimationFrame(() => ScrollTrigger.refresh());
    } else {
      const raf = (t) => {
        lenis.raf(t);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  // ——— Cursor ———
  function initCursor() {
    const cursor = document.getElementById("cursor");
    if (!cursor || !fine || !desktop()) return;

    document.body.classList.add("has-cursor");
    const blend = cursor.querySelector(".cursor__blend");
    const core = cursor.querySelector(".cursor__blob--core");
    const mid = cursor.querySelector(".cursor__blob--mid");
    const tail = cursor.querySelector(".cursor__blob--tail");
    const spikes = [...cursor.querySelectorAll(".cursor__spike")];
    const text = cursor.querySelector(".cursor__text");
    const origin = 80;

    // Safari still honors filterRes (deprecated elsewhere). Scale it to the Retina DPR
    // so the goo doesn't render as a chunky low-res bitmap.
    const gooFilter = document.getElementById("cursor-goo");
    if (gooFilter) {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      gooFilter.setAttribute("filterRes", String(Math.round(512 * dpr)));
    }

    let mx = innerWidth / 2;
    let my = innerHeight / 2;
    let c = { x: mx, y: my };
    let m = { x: mx, y: my };
    let t = { x: mx, y: my };
    let vx = 0;
    let vy = 0;
    let magnet = { x: mx, y: my };
    let time = 0;

    const clickableSel =
      'a, button, [role="button"], .btn, summary, label[for], input, select, textarea, [data-hover]';

    const syncHover = () => {
      const hit = document.elementFromPoint(mx, my);
      const target = hit?.closest?.(clickableSel);
      cursor.classList.remove("is-view", "is-link");
      if (!target) return;
      const mode = target.getAttribute("data-hover");
      cursor.classList.add(mode === "view" ? "is-view" : "is-link");
      const r = target.getBoundingClientRect();
      magnet.x = r.left + r.width / 2;
      magnet.y = r.top + r.height / 2;
    };

    addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursor.classList.add("on");
        syncHover();
      },
      { passive: true }
    );
    document.addEventListener("mouseleave", () => {
      cursor.classList.remove("on", "is-view", "is-link");
    });

    // SVG transforms (circles sit at 0,0) — works the same in Safari + Chromium
    const place = (el, x, y, rot = 0, sx = 1, sy = 1) => {
      if (!el) return;
      el.setAttribute(
        "transform",
        `translate(${x},${y}) rotate(${rot}) scale(${sx},${sy})`
      );
    };

    const loop = () => {
      time += 0.016;
      const hovering = cursor.classList.contains("is-link") || cursor.classList.contains("is-view");
      const easeCore = hovering ? 0.28 : 0.4;
      const easeMid = hovering ? 0.2 : 0.22;
      const easeTail = hovering ? 0.12 : 0.13;

      c.x += (mx - c.x) * easeCore;
      c.y += (my - c.y) * easeCore;
      m.x += (mx - m.x) * easeMid;
      m.y += (my - m.y) * easeMid;
      t.x += (mx - t.x) * easeTail;
      t.y += (my - t.y) * easeTail;

      vx += (mx - c.x - vx) * 0.2;
      vy += (my - c.y - vy) * 0.2;
      const speed = Math.min(Math.hypot(vx, vy), 42);
      const moveAngle = (Math.atan2(vy, vx) * 180) / Math.PI || 0;

      if (blend) blend.style.transform = `translate3d(${c.x}px,${c.y}px,0)`;

      if (hovering) {
        const toMagX = magnet.x - c.x;
        const toMagY = magnet.y - c.y;
        const magAngle = Math.atan2(toMagY, toMagX);
        place(core, origin, origin, 0, 1.05, 1.05);
        place(mid, origin + Math.cos(magAngle) * 3, origin + Math.sin(magAngle) * 3, 0, 1, 1);
        place(tail, origin - Math.cos(magAngle) * 2, origin - Math.sin(magAngle) * 2, 0, 1, 1);

        const n = spikes.length || 1;
        spikes.forEach((spike, i) => {
          const base = (i / n) * Math.PI * 2 + time * 0.7;
          const angled = base * 0.5 + magAngle * 0.5 + Math.sin(time * 2 + i) * 0.1;
          // Stay close so goo threshold welds spikes into the blob
          const len = 11 + Math.sin(time * 4.5 + i * 1.3) * 3;
          place(
            spike,
            origin + Math.cos(angled) * len,
            origin + Math.sin(angled) * len,
            (angled * 180) / Math.PI + 90,
            0.75,
            1.4
          );
        });

        if (text) {
          text.style.transform = `translate3d(${c.x + 32}px,${c.y + 22}px,0) translate(-50%,-50%)`;
        }
      } else {
        spikes.forEach((spike) => place(spike, -9999, -9999));
        const stretch = Math.min(speed * 0.04, 1.1);
        // Trailing blobs lag — SVG goo welds them into one stretching fluid shape
        const midX = Math.max(-30, Math.min(30, m.x - c.x));
        const midY = Math.max(-30, Math.min(30, m.y - c.y));
        const tailX = Math.max(-48, Math.min(48, t.x - c.x));
        const tailY = Math.max(-48, Math.min(48, t.y - c.y));
        place(core, origin, origin, moveAngle, 1 + stretch, 1 - stretch * 0.4);
        place(mid, origin + midX, origin + midY, moveAngle, 1 + stretch * 0.6, 1 - stretch * 0.28);
        place(tail, origin + tailX, origin + tailY, moveAngle, 1 + stretch * 0.35, 1 - stretch * 0.18);
        if (text) text.style.transform = `translate3d(${m.x}px,${m.y}px,0) translate(-50%,-50%)`;
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // ——— Magnets ———
  function initMagnets() {
    if (!fine || reduced || !desktop()) return;
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x / 22}px, ${y / 22}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
        el.style.transform = "translate(0,0)";
        setTimeout(() => {
          el.style.transition = "";
        }, 500);
      });
    });
  }

  // ——— Intro ———
  function initIntro() {
    const shots = [...document.querySelectorAll(".intro__shot")];
    const pipsEl = document.getElementById("introPips");
    const nameEl = document.getElementById("introName");
    const typeEl = document.getElementById("introType");
    const liveBtn = document.getElementById("introLive");
    const thumb = document.getElementById("introThumb");

    const items = [
      {
        href: "https://jessesparks714.com/",
        name: "Jesse Sparks",
        type: "MMA & merch store",
        img: "assets/jessesparks.png",
      },
      {
        href: "https://sjrnr.myshopify.com/",
        name: "SJRNR",
        type: "Faith-driven streetwear",
        img: "assets/sjrnr.png",
      },
      {
        href: "https://orthodoxiconscorona.com/",
        name: "Orthodox Icons",
        type: "Sacred e-commerce",
        img: "assets/orthodoxicons.png",
      },
    ];

    if (pipsEl) {
      pipsEl.innerHTML = items
        .map(
          (_, i) =>
            `<button class="pip${i === 0 ? " is-on" : ""}" type="button" aria-label="Feature ${i + 1}"><span class="pip__fill"></span></button>`
        )
        .join("");
    }

    const pips = [...(pipsEl?.querySelectorAll(".pip") || [])];
    const fills = pips.map((p) => p.querySelector(".pip__fill"));
    let idx = 0;
    let elapsed = 0;
    let last = performance.now();
    let paused = false;
    const DUR = 5500;

    const apply = (i) => {
      idx = i;
      const it = items[i];
      if (nameEl) nameEl.textContent = it.name;
      if (typeEl) typeEl.textContent = it.type;
      if (liveBtn) liveBtn.href = it.href;
      if (thumb) thumb.src = it.img;
      shots.forEach((s, si) => {
        s.classList.toggle("is-on", si === i);
        if (si === i) {
          s.style.animation = "none";
          void s.offsetWidth;
          s.style.animation = "";
        }
      });
      pips.forEach((p, pi) => p.classList.toggle("is-on", pi === i));
    };

    const setP = (v) => {
      fills.forEach((f, fi) => {
        if (f) f.style.transform = `scaleX(${fi === idx ? v : 0})`;
      });
    };

    const go = (i) => {
      elapsed = 0;
      setP(0);
      apply(i);
    };

    pips.forEach((p, i) => p.addEventListener("click", () => go(i)));
    if (liveBtn) {
      liveBtn.addEventListener("mouseenter", () => {
        paused = true;
      });
      liveBtn.addEventListener("mouseleave", () => {
        paused = false;
      });
    }

    apply(0);
    const tick = (now) => {
      const dt = now - last;
      last = now;
      if (!paused && !reduced) {
        elapsed += dt;
        if (elapsed >= DUR) go((idx + 1) % items.length);
        else setP(elapsed / DUR);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const bg = document.getElementById("introBg");
    if (bg && !reduced && fine) {
      addEventListener(
        "scroll",
        () => {
          const y = scrollY;
          if (y > innerHeight) return;
          bg.style.transform = `translate3d(0,${y * 0.28}px,0)`;
        },
        { passive: true }
      );
    }

    if (!hasGSAP || reduced) {
      document.querySelectorAll(".clip__in").forEach((el) => {
        el.style.transform = "none";
      });
      return;
    }

    gsap.set(".intro .clip__in", { yPercent: 110 });
    gsap.set(
      ".intro__brand, .intro__lede, .intro__actions, .intro__bottom",
      { y: 40, opacity: 0 }
    );

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.to(".intro .clip__in", { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0.12);
    tl.to(".intro__brand", { y: 0, opacity: 1, duration: 0.85 }, 0.4);
    tl.to(".intro__lede", { y: 0, opacity: 1, duration: 0.85 }, 0.5);
    tl.to(".intro__actions", { y: 0, opacity: 1, duration: 0.85 }, 0.6);
    tl.to(".intro__bottom", { y: 0, opacity: 1, duration: 0.9 }, 0.72);
  }

  // ——— Statement word light-up ———
  function initStatement() {
    const line = document.getElementById("statementLine");
    if (!line) return;

    const raw = line.textContent.trim();
    line.innerHTML = raw
      .split(/\s+/)
      .map((w) => `<span class="word">${w}</span>`)
      .join(" ");

    const words = [...line.querySelectorAll(".word")];

    if (!hasGSAP || typeof ScrollTrigger === "undefined" || reduced) {
      words.forEach((w) => w.classList.add("is-lit"));
      return;
    }

    ScrollTrigger.create({
      trigger: ".statement",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const n = Math.floor(self.progress * words.length);
        words.forEach((w, i) => w.classList.toggle("is-lit", i <= n));
      },
    });
  }

  // ——— Horizontal work rail ———
  function initWorkRail() {
    const viewport = document.getElementById("workViewport");
    const rail = document.getElementById("workRail");
    if (!viewport || !rail) return;

    // Title reveal
    if (hasGSAP && typeof ScrollTrigger !== "undefined" && !reduced) {
      gsap.set(".work__title .clip__in", { yPercent: 110 });
      gsap.to(".work__title .clip__in", {
        yPercent: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: ".work__head", start: "top 80%" },
      });
    }

    if (!hasGSAP || typeof ScrollTrigger === "undefined" || reduced) {
      return;
    }

    const getScroll = () => Math.max(0, rail.scrollWidth - viewport.clientWidth);
    const isMob = mobile();

    // Pin with the section bottom flush to the viewport bottom so the next
    // (black) background never shows underneath while scrubbing the rail.
    const workSection = document.querySelector(".work");
    const pinStart = () => {
      const vh = window.innerHeight;
      const h = workSection.offsetHeight;
      const offset = h >= vh ? 0 : Math.round(vh - h);
      return `top ${offset}px`;
    };

    gsap.to(rail, {
      x: () => -getScroll(),
      ease: "none",
      scrollTrigger: {
        trigger: ".work",
        start: pinStart,
        end: () =>
          `+=${getScroll() * (isMob ? 1.35 : 1) + window.innerHeight * (isMob ? 0.55 : 0.35)}`,
        pin: true,
        scrub: isMob ? 1.4 : 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        pinType: lenis ? "transform" : "fixed",
      },
    });

    if (isMob) {
      addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    }

    // Recalc after project images load (wrong pin distance is common on Mac)
    rail.querySelectorAll("img").forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    });

    gsap.utils.toArray(".panel").forEach((panel) => {
      const img = panel.querySelector("img");
      if (!img) return;
      gsap.fromTo(
        img,
        { scale: 1.12 },
        {
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top 90%",
            end: "top 30%",
            scrub: true,
          },
        }
      );
    });
  }

  // ——— Craft demos ———
  function initCraft() {
    if (!hasGSAP || typeof ScrollTrigger === "undefined") {
      document.querySelectorAll(".cap__frame").forEach((f) => f.classList.add("is-open"));
      return;
    }

    if (reduced) {
      document.querySelectorAll(".cap__frame").forEach((f) => f.classList.add("is-open"));
      return;
    }

    // Cap sections fade up (skip kinetic — it has its own pin scene)
    gsap.utils.toArray("[data-cap]").forEach((el) => {
      if (el.getAttribute("data-cap") === "type") return;
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
    });

    // Kinetic type — pinned word-by-word mask reveal
    const display = document.getElementById("capType");
    const stage = document.getElementById("capTypeStage");
    const hint = document.getElementById("capTypeHint");
    const thumb = document.getElementById("capTypeThumb");
    if (display && stage) {
      const phrase = (display.textContent || "").trim().split(/\s+/);
      display.textContent = "";
      const inners = phrase.map((word) => {
        const wrap = document.createElement("span");
        wrap.className = "cap__word";
        const inner = document.createElement("span");
        inner.className = "cap__word-in";
        inner.textContent = word;
        wrap.appendChild(inner);
        display.appendChild(wrap);
        return inner;
      });

      const words = display.querySelectorAll(".cap__word");
      gsap.set(inners, { yPercent: 110, opacity: 0.15 });

      if (mobile()) {
        gsap.to(inners, {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          stagger: 0.14,
          scrollTrigger: {
            trigger: stage,
            start: "top 85%",
            end: "bottom 15%",
            scrub: 1.8,
            onUpdate: (self) => {
              if (thumb) thumb.style.height = `${self.progress * 100}%`;
              if (hint) hint.classList.toggle("is-done", self.progress > 0.92);
              words.forEach((word, i) => {
                const start = i / words.length;
                word.classList.toggle("is-on", self.progress > start + 0.05);
              });
            },
          },
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top 28%",
          end: "+=90%",
          scrub: 0.55,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          pinType: lenis ? "transform" : "fixed",
          onUpdate: (self) => {
            if (thumb) thumb.style.height = `${self.progress * 100}%`;
            if (hint) hint.classList.toggle("is-done", self.progress > 0.92);
            words.forEach((word, i) => {
              const start = i / words.length;
              word.classList.toggle("is-on", self.progress > start + 0.05);
            });
          },
        },
      });

      tl.to(inners, {
        yPercent: 0,
        opacity: 1,
        ease: "none",
        stagger: 0.18,
      });
    }

    // Image clip reveal
    const frame = document.querySelector(".cap__frame");
    const frameImg = frame?.querySelector("img");
    if (frame) {
      gsap.fromTo(
        frame,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.3,
          ease: "power4.inOut",
          scrollTrigger: { trigger: frame, start: "top 75%" },
          onComplete: () => frame.classList.add("is-open"),
        }
      );
    }
    if (frameImg) {
      gsap.fromTo(
        frameImg,
        { scale: 1.2 },
        {
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: { trigger: frame, start: "top 75%" },
        }
      );
    }

    // Infinite motion ticker
    const track = document.getElementById("tickerTrack");
    if (track && !reduced) {
      track.innerHTML = track.innerHTML + track.innerHTML;
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 32,
        ease: "none",
        repeat: -1,
      });
      ScrollTrigger.create({
        trigger: "#ticker",
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(0.55, 2.6, 1 + Math.abs(self.getVelocity()) / 3500);
          tween.timeScale(boost);
        },
      });
    }

    // Tiles stagger
    gsap.fromTo(
      ".tile",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cap__tiles", start: "top 80%" },
      }
    );
  }

  // ——— Process ———
  function initProcess() {
    if (!hasGSAP || typeof ScrollTrigger === "undefined" || reduced) return;

    gsap.utils.toArray("[data-step]").forEach((el, i) => {
      gsap.fromTo(
        el,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          delay: i * 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        }
      );
    });

    gsap.fromTo(
      ".contact__title, .contact__lede, .contact .btn, .contact__email-row",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "#contact", start: "top 75%", toggleActions: "play none none none" },
      }
    );
  }

  // ——— Progress ———
  function initProgress() {
    const bar = document.getElementById("progress");
    if (!bar) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    };
    update();
    addEventListener("scroll", update, { passive: true });
  }

  // Refresh ScrollTrigger after fonts/images
  if (hasGSAP && typeof ScrollTrigger !== "undefined") {
    const refreshPins = () => ScrollTrigger.refresh();
    addEventListener("load", refreshPins);
    if (document.fonts?.ready) {
      document.fonts.ready.then(refreshPins);
    }
    let resizeTimer;
    addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refreshPins, 200);
    });
    // MacBook notch / toolbar show-hide changes visual viewport without a full resize
    if (window.visualViewport) {
      visualViewport.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(refreshPins, 200);
      });
    }
  }
})();
