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
    initPour();
    initWorkRail();
    initCraft();
    initProcess();
    initProgress();
    initEmail();
    initMobileNote();
    initHireSticky();
    initShowreel();
  }

  function initHireSticky() {
    const el = document.getElementById("hireSticky");
    if (!el || reduced) return;

    const show = () => el.classList.add("is-on");
    const hide = () => el.classList.remove("is-on");

    if (!hasGSAP || typeof ScrollTrigger === "undefined") {
      // Fallback: show after a bit of scroll
      addEventListener(
        "scroll",
        () => {
          const past = window.scrollY > window.innerHeight * 1.2;
          const contact = document.getElementById("contact");
          const inContact =
            contact && contact.getBoundingClientRect().top < window.innerHeight * 0.7;
          el.classList.toggle("is-on", past && !inContact);
        },
        { passive: true }
      );
      return;
    }

    ScrollTrigger.create({
      trigger: "#work",
      start: "bottom 75%",
      onEnter: show,
      onLeaveBack: hide,
    });
    ScrollTrigger.create({
      trigger: "#contact",
      start: "top 72%",
      onEnter: hide,
      onLeaveBack: show,
    });
  }

  function initShowreel() {
    const btn = document.getElementById("navPlay");
    const catcher = document.getElementById("showCatch");
    if (!btn) return;
    if (reduced) {
      btn.hidden = true;
      return;
    }

    let playing = false;
    let raf = 0;
    let lastT = 0;
    const PX_PER_SEC = 255;
    const nowY = () => (lenis ? lenis.scroll : window.scrollY || 0);
    const maxY = () =>
      Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const wheelMul = { on: 0.9, off: 0.9 };

    const setPlaying = (on) => {
      playing = on;
      document.body.classList.toggle("is-playing", on);
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", on ? "Pause the site" : "Play the site");
      if (catcher) catcher.setAttribute("aria-hidden", on ? "false" : "true");
      if (lenis) {
        if (on) {
          wheelMul.on = lenis.options.wheelMultiplier;
          lenis.options.wheelMultiplier = 0;
          lenis.options.touchMultiplier = 0;
        } else {
          lenis.options.wheelMultiplier = wheelMul.on || 0.9;
          lenis.options.touchMultiplier = 1.2;
        }
      }
    };

    const stop = () => {
      if (!playing) return;
      cancelAnimationFrame(raf);
      raf = 0;
      lastT = 0;
      setPlaying(false);
    };

    const drive = (t) => {
      if (!playing) return;
      if (!lastT) lastT = t;
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;
      const y = nowY();
      const dest = maxY();
      if (y >= dest - 6) {
        stop();
        return;
      }
      const next = Math.min(dest, y + PX_PER_SEC * dt);
      if (lenis) lenis.scrollTo(next, { immediate: true });
      else window.scrollTo(0, next);
      raf = requestAnimationFrame(drive);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      lastT = 0;
      if (maxY() - nowY() < 120) {
        if (lenis) lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
      }
      setPlaying(true);
      raf = requestAnimationFrame(drive);
    };

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (playing) stop();
      else start();
    });
    catcher?.addEventListener("click", (e) => {
      e.preventDefault();
      stop();
    });
    catcher?.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );
    catcher?.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );
  }

  function initMobileNote() {
    const note = document.getElementById("mobileNote");
    const close = document.getElementById("mobileNoteClose");
    if (!note) return;
    if (!mobile()) {
      note.hidden = true;
      return;
    }
    note.hidden = false;
    document.body.classList.add("has-mobile-note");
    const dismiss = () => {
      note.hidden = true;
      document.body.classList.remove("has-mobile-note");
    };
    close?.addEventListener("click", dismiss);
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
      // Snappier lerp — heavy smoothing + scrub felt like rubber-banding
      lerp: isMac ? 0.16 : 0.12,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: isMac ? 0.9 : 1,
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
  let cursorCtl = null;

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
    let mode = "follow"; // follow | drop | ride | return
    let ride = { x: mx, y: my };
    let drop = { x: mx, y: my };

    const clickableSel =
      'a, button, [role="button"], .btn, summary, label[for], input, select, textarea, [data-hover]';

    const syncHover = () => {
      if (mode !== "follow") return;
      const hit = document.elementFromPoint(mx, my);
      const target = hit?.closest?.(clickableSel);
      cursor.classList.remove("is-view", "is-link");
      if (!target) return;
      const hoverMode = target.getAttribute("data-hover");
      cursor.classList.add(hoverMode === "view" ? "is-view" : "is-link");
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
      if (mode === "follow") cursor.classList.remove("on", "is-view", "is-link");
    });

    const place = (el, x, y, rot = 0, sx = 1, sy = 1) => {
      if (!el) return;
      el.setAttribute(
        "transform",
        `translate(${x},${y}) rotate(${rot}) scale(${sx},${sy})`
      );
    };

    cursorCtl = {
      setMode: (next) => {
        mode = next;
        cursor.classList.add("on");
        if (next !== "follow") cursor.classList.remove("is-view", "is-link");
        if (next === "drop") {
          drop.x = innerWidth * 0.5;
          drop.y = innerHeight * 0.58;
        }
        if (next === "return") {
          ride.x = c.x;
          ride.y = c.y;
        }
      },
      setRide: (x, y) => {
        ride.x = x;
        ride.y = y;
      },
      setDrop: (x, y) => {
        drop.x = x;
        drop.y = y;
      },
      getMode: () => mode,
    };

    const loop = () => {
      time += 0.016;
      let tx = mx;
      let ty = my;
      let easeCore = 0.4;
      let easeMid = 0.22;
      let easeTail = 0.13;

      if (mode === "drop") {
        tx = drop.x;
        ty = drop.y;
        easeCore = 0.08;
        easeMid = 0.06;
        easeTail = 0.045;
      } else if (mode === "ride") {
        tx = ride.x;
        ty = ride.y;
        easeCore = 0.06;
        easeMid = 0.045;
        easeTail = 0.032;
      } else if (mode === "return") {
        tx = mx;
        ty = my;
        easeCore = 0.14;
        easeMid = 0.1;
        easeTail = 0.07;
        if (Math.hypot(mx - c.x, my - c.y) < 10) mode = "follow";
      }

      const hovering =
        mode === "follow" &&
        (cursor.classList.contains("is-link") || cursor.classList.contains("is-view"));
      if (mode === "follow") {
        easeCore = hovering ? 0.28 : 0.4;
        easeMid = hovering ? 0.2 : 0.22;
        easeTail = hovering ? 0.12 : 0.13;
      }

      c.x += (tx - c.x) * easeCore;
      c.y += (ty - c.y) * easeCore;
      m.x += (tx - m.x) * easeMid;
      m.y += (ty - m.y) * easeMid;
      t.x += (tx - t.x) * easeTail;
      t.y += (ty - t.y) * easeTail;

      vx += (tx - c.x - vx) * 0.2;
      vy += (ty - c.y - vy) * 0.2;
      const speed = Math.min(Math.hypot(vx, vy), 42);
      const moveAngle = (Math.atan2(vy, vx) * 180) / Math.PI || 0;

      if (blend) {
        const dive = mode === "drop" || mode === "ride" ? 0.55 + Math.min(speed * 0.01, 0.35) : 1;
        blend.style.transform = `translate3d(${c.x}px,${c.y}px,0) scale(${dive})`;
      }

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

    const canvas = document.getElementById("introCanvas");
    const canWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();
    const wantHero3d = !reduced && desktop() && canvas && canWebGL;
    const hero3d = { idx: () => idx, scroll: 0 };

    const startHero3d = () => {
      if (typeof THREE === "undefined") return false;
      document.body.classList.add("intro-webgl");
      initIntroWebGL(items, hero3d, canvas);
      return true;
    };
    if (wantHero3d) {
      if (!startHero3d()) {
        window.addEventListener(
          "three-ready",
          () => {
            startHero3d();
          },
          { once: true }
        );
      }
    }

    const bg = document.getElementById("introBg");
    if (!reduced && fine) {
      addEventListener(
        "scroll",
        () => {
          const y = scrollY;
          if (y > innerHeight * 1.2) return;
          hero3d.scroll = Math.min(1, y / innerHeight);
          if (bg && !document.body.classList.contains("intro-webgl")) {
            bg.style.transform = `translate3d(0,${y * 0.28}px,0)`;
          }
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
    const titleAt = wantHero3d ? 0.95 : 0.8;
    tl.to(".intro .clip__in", { yPercent: 0, duration: 1.2, stagger: 0.1 }, titleAt);
    tl.to(".intro__brand", { y: 0, opacity: 1, duration: 0.85 }, titleAt + 0.28);
    tl.to(".intro__lede", { y: 0, opacity: 1, duration: 0.85 }, titleAt + 0.38);
    tl.to(".intro__actions", { y: 0, opacity: 1, duration: 0.85 }, titleAt + 0.48);
    tl.to(".intro__bottom", { y: 0, opacity: 1, duration: 0.9 }, titleAt + 0.6);
  }

  function initIntroWebGL(items, hero3d, canvas) {
    const intro = document.getElementById("intro");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x0a0a09, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 30);
    camera.position.set(0, 0, 3.2);
    camera.lookAt(0, 0, 0);

    const SW = 4;
    const SH = 2.25;
    const maps = items.map(() => null);
    const aspects = items.map(() => 16 / 9);
    const blank = new THREE.DataTexture(new Uint8Array([12, 12, 10, 255]), 1, 1);
    blank.needsUpdate = true;

    const screenUniforms = {
      uMapA: { value: blank },
      uMapB: { value: blank },
      uMapN: { value: blank },
      uAspectA: { value: 16 / 9 },
      uAspectB: { value: 16 / 9 },
      uAspectN: { value: 16 / 9 },
      uPlaneAspect: { value: SW / SH },
      uMix: { value: 0 },
      uZap: { value: 0 },
      uTime: { value: 0 },
      uWarp: { value: 0.22 },
      uBulge: { value: 0.55 },
      uZoom: { value: 1.04 },
      uDrift: { value: new THREE.Vector2(0, 0) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };
    const screenMat = new THREE.ShaderMaterial({
      uniforms: screenUniforms,
      toneMapped: false,
      vertexShader: `
        uniform float uBulge;
        uniform vec2 uMouse;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          vec2 c = uv * 2.0 - 1.0;
          float r2 = dot(c, c);
          p.z -= uBulge * r2;
          p.x += uMouse.x * 0.05 * r2;
          p.y += uMouse.y * -0.035 * r2;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uMapA;
        uniform sampler2D uMapB;
        uniform sampler2D uMapN;
        uniform float uAspectA;
        uniform float uAspectB;
        uniform float uAspectN;
        uniform float uPlaneAspect;
        uniform float uMix;
        uniform float uZap;
        uniform float uTime;
        uniform float uWarp;
        uniform float uZoom;
        uniform vec2 uDrift;
        uniform vec2 uMouse;
        varying vec2 vUv;

        vec2 cover(vec2 uv, float imgAspect) {
          if (imgAspect > uPlaneAspect) {
            float s = uPlaneAspect / imgAspect;
            uv.x = (uv.x - 0.5) * s + 0.5;
          } else {
            float s = imgAspect / uPlaneAspect;
            uv.y = 1.0 - (1.0 - uv.y) * s;
          }
          uv = (uv - 0.5) / uZoom + 0.5 + uDrift;
          return uv;
        }

        vec3 sampleChroma(sampler2D map, vec2 uv, vec2 off) {
          vec3 col;
          col.r = texture2D(map, uv + off).r;
          col.g = texture2D(map, uv).g;
          col.b = texture2D(map, uv - off).b;
          return col;
        }

        void main() {
          vec2 c = vUv * 2.0 - 1.0;
          float r2 = dot(c, c);
          vec2 warped = c * (1.0 + uWarp * r2);
          vec2 uv = warped * 0.5 + 0.5;
          uv.y = fract(uv.y + uZap * 0.22 * sin(uZap * 14.0));
          if (uv.x < -0.02 || uv.x > 1.02 || uv.y < -0.02 || uv.y > 1.02) {
            gl_FragColor = vec4(0.04, 0.04, 0.035, 1.0);
            return;
          }

          float chroma = 0.0035 + uWarp * 0.02 * r2 + uZap * 0.02;
          vec2 off = vec2(chroma, chroma * 0.15);
          vec2 uvA = cover(uv, uAspectA);
          vec2 uvB = cover(uv, uAspectB);
          vec2 uvN = cover(uv, uAspectN);
          vec3 col = mix(sampleChroma(uMapA, uvA, off), sampleChroma(uMapB, uvB, off), uMix);

          float ghost = smoothstep(0.28, 0.92, r2) * (0.22 + abs(uMouse.x) * 0.2);
          col = mix(col, sampleChroma(uMapN, uvN, off * 1.4), ghost);

          float scan = sin((uv.y + uTime * 0.012) * 560.0) * (0.016 + uWarp * 0.035);
          col *= 1.0 - scan;
          col *= 1.0 - r2 * 0.18;

          vec2 hl = c - vec2(uMouse.x * 0.5, -uMouse.y * 0.38);
          float spec = pow(max(0.0, 1.0 - length(hl * vec2(0.62, 1.35))), 16.0);
          col += spec * 0.14 * vec3(0.96, 0.93, 0.86);

          col += uZap * vec3(0.38, 0.36, 0.32);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH, 64, 36), screenMat);
    scene.add(screen);

    const bindMaps = (cur, next) => {
      const a = maps[cur];
      const n = maps[next];
      if (a) {
        screenUniforms.uMapB.value = a;
        screenUniforms.uAspectB.value = aspects[cur];
      }
      if (n) {
        screenUniforms.uMapN.value = n;
        screenUniforms.uAspectN.value = aspects[next];
      }
    };

    const texLoader = new THREE.TextureLoader();
    items.forEach((item, i) => {
      texLoader.load(item.img, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        tex.minFilter = THREE.LinearFilter;
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
        maps[i] = tex;
        if (tex.image && tex.image.width) {
          aspects[i] = tex.image.width / Math.max(1, tex.image.height);
        }
        if (i === 0) {
          screenUniforms.uMapA.value = tex;
          screenUniforms.uMapB.value = tex;
          screenUniforms.uAspectA.value = aspects[0];
          screenUniforms.uAspectB.value = aspects[0];
        }
        if (i === 1) {
          screenUniforms.uMapN.value = tex;
          screenUniforms.uAspectN.value = aspects[1];
        }
      });
    });

    const glass = { warp: 0.22, bulge: 0.58 };
    if (hasGSAP) {
      gsap.to(glass, {
        warp: 0.115,
        bulge: 0.32,
        duration: 2.4,
        ease: "power2.out",
        delay: 0.08,
      });
    } else {
      glass.warp = 0.115;
      glass.bulge = 0.32;
    }

    const mx = { x: 0, y: 0 };
    const look = { x: 0, y: 0 };
    if (fine) {
      window.addEventListener(
        "pointermove",
        (e) => {
          mx.x = (e.clientX / window.innerWidth) * 2 - 1;
          mx.y = (e.clientY / window.innerHeight) * 2 - 1;
        },
        { passive: true }
      );
    }
    canvas.addEventListener("click", () => {
      const it = items[hero3d.idx()];
      if (it?.href) window.open(it.href, "_blank", "noopener");
    });

    const coverZ = () => {
      const vFov = (camera.fov * Math.PI) / 180;
      const zH = SH / (2 * Math.tan(vFov / 2) * 1.08);
      const zW = SW / (2 * Math.tan(vFov / 2) * camera.aspect * 1.08);
      return Math.min(zH, zW);
    };

    const fit = () => {
      const w = intro?.clientWidth || window.innerWidth;
      const h = intro?.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.fov = w / h > 1.45 ? 32 : 38;
      camera.updateProjectionMatrix();
      camera.position.z = coverZ();
    };
    fit();
    window.addEventListener("resize", fit);

    let lastFeat = 0;
    const tick3d = () => {
      requestAnimationFrame(tick3d);
      const t = performance.now() * 0.001;
      const scroll = hero3d.scroll;
      look.x += (mx.x - look.x) * 0.055;
      look.y += (mx.y - look.y) * 0.055;

      screenUniforms.uTime.value = t;
      screenUniforms.uWarp.value = glass.warp + scroll * 0.05;
      screenUniforms.uBulge.value = glass.bulge + scroll * 0.12;
      screenUniforms.uZoom.value = 1.05 + Math.sin(t * 0.12) * 0.02;
      screenUniforms.uDrift.value.set(Math.sin(t * 0.07) * 0.018, Math.cos(t * 0.05) * 0.012);
      screenUniforms.uMouse.value.set(look.x, look.y);

      const featured = hero3d.idx();
      const next = (featured + 1) % items.length;
      if (featured !== lastFeat && maps[featured]) {
        screenUniforms.uMapA.value = maps[lastFeat] || maps[featured];
        screenUniforms.uAspectA.value = aspects[lastFeat] || aspects[featured];
        screenUniforms.uMix.value = 0;
        screenUniforms.uZap.value = 1;
        lastFeat = featured;
        bindMaps(featured, next);
        if (hasGSAP) {
          gsap.to(screenUniforms.uMix, { value: 1, duration: 0.48, ease: "power2.inOut", overwrite: true });
          gsap.to(screenUniforms.uZap, { value: 0, duration: 0.7, ease: "power3.out", overwrite: true });
        } else {
          screenUniforms.uMix.value = 1;
          screenUniforms.uZap.value = 0;
        }
      } else if (maps[featured]) {
        bindMaps(featured, next);
      }

      const baseZ = coverZ();
      camera.position.x = look.x * 0.24;
      camera.position.y = look.y * -0.14 + scroll * 0.18;
      camera.position.z = baseZ + scroll * 0.55;
      camera.lookAt(look.x * 0.14, look.y * -0.07, 0);
      screen.rotation.y = look.x * 0.08;
      screen.rotation.x = look.y * -0.045;

      renderer.render(scene, camera);
    };
    tick3d();
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

  // ——— The Pour (signature WebGL / mobile cascade) ———
  function initPour() {
    const section = document.getElementById("pour");
    const pin = document.getElementById("pourPin");
    const canvas = document.getElementById("pourCanvas");
    if (!section || !pin) return;

    const projects = [
      {
        name: "Jesse Sparks",
        meta: "MMA & merch · 2026",
        img: "assets/jessesparks.png",
        href: "https://jessesparks714.com/",
      },
      {
        name: "SJRNR",
        meta: "Streetwear · 2026",
        img: "assets/sjrnr.png",
        href: "https://sjrnr.myshopify.com/",
      },
      {
        name: "Orthodox Icons",
        meta: "E-commerce · 2026",
        img: "assets/orthodoxicons.png",
        href: "https://orthodoxiconscorona.com/",
      },
      {
        name: "Just the D",
        meta: "Surf & streetwear · 2023",
        img: "assets/justhed.webp",
        animated: true,
        href: "https://justthed.com/",
      },
      {
        name: "Sarah's Lens",
        meta: "Photography · 2024",
        img: "assets/sarah.png",
        href: "https://smaisanophotography.com/",
      },
      {
        name: "charmedbybanana",
        meta: "E-commerce · 2025",
        img: "assets/charmed.png",
        href: "https://www.charmedbybanana.com/",
      },
      {
        name: "Blessed Beauty",
        meta: "Beauty · 2025",
        img: "assets/blessedbeauty.png",
        href: "https://lyricsaucedo-dev.github.io/blessedbeauty/",
      },
      {
        name: "Conceiving Victory",
        meta: "Brand site · 2025",
        img: "assets/conceiving.png",
        href: "https://conceiving-victory.vercel.app/",
      },
    ];

    const numEl = document.getElementById("pourNum");
    const nameEl = document.getElementById("pourName");
    const metaEl = document.getElementById("pourMeta");
    const hint = document.getElementById("pourHint");
    const hintFill = document.getElementById("pourHintFill");

    const setHud = (i) => {
      const p = projects[i];
      if (!p) return;
      if (numEl) numEl.textContent = String(i + 1).padStart(2, "0");
      if (nameEl) nameEl.textContent = p.name;
      if (metaEl) metaEl.textContent = p.meta;
    };
    setHud(0);

    if (reduced) {
      document.body.classList.add("pour-static");
      section.style.height = "auto";
      return;
    }

    // Mobile: no tunnel — Work section grid only
    if (mobile()) {
      document.body.classList.add("pour-skip");
      section.style.display = "none";
      section.setAttribute("aria-hidden", "true");
      return;
    }

    const canWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();

    const startDesktopPour = () => {
      if (typeof THREE !== "undefined" && canvas && canWebGL) {
        initPourWebGL(section, pin, canvas, projects, setHud, hint, hintFill);
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
        return;
      }
      console.warn("[pour] THREE/WebGL unavailable — using cascade fallback.");
      initPourCascade(section, pin, projects, setHud, hint, hintFill);
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    };

    // Three loads async via ES module; don't block the rest of the site on it
    if (typeof THREE !== "undefined") {
      startDesktopPour();
    } else {
      let started = false;
      const go = () => {
        if (started) return;
        started = true;
        startDesktopPour();
      };
      window.addEventListener("three-ready", go, { once: true });
      setTimeout(go, 4000);
    }
  }

  function initPourCascade(section, pin, projects, setHud, hint, hintFill) {
    document.body.classList.add("pour-cascade");
    section.style.height = "240vh";

    if (!hasGSAP || typeof ScrollTrigger === "undefined") return;

    const cards = [...document.querySelectorAll(".pour__card")];
    gsap.set(cards, {
      opacity: 0,
      z: -900,
      x: 0,
      y: 160,
      rotateY: 40,
      rotateX: 12,
      scale: 0.55,
      transformPerspective: 1600,
      transformOrigin: "center center",
    });

    gsap.to(
      {},
      {
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          pin: pin,
          anticipatePin: 0,
          pinType: lenis ? "transform" : "fixed",
          onUpdate: (self) => {
            const prog = self.progress;
            if (hintFill) hintFill.style.height = `${prog * 100}%`;
            if (hint) hint.classList.toggle("is-done", prog > 0.92);

            const idx = Math.min(
              projects.length - 1,
              Math.floor(prog * Math.max(1, projects.length - 0.01))
            );
            setHud(idx);

            cards.forEach((card, i) => {
              const center = i / Math.max(1, cards.length - 1);
              const d = prog - center;
              const focus = Math.max(0, 1 - Math.abs(d) * 2.4);
              const side = i % 2 === 0 ? -1 : 1;
              gsap.set(card, {
                opacity: focus * 0.2 + focus * 0.8,
                z: -900 + focus * 980,
                x: side * (1 - focus) * 120,
                y: d * -340,
                rotateY: side * (1 - focus) * 48,
                rotateX: (1 - focus) * 10,
                scale: 0.55 + focus * 0.55,
                zIndex: Math.round(focus * 200),
                filter: focus > 0.65 ? "none" : "brightness(0.55)",
              });
            });
          },
        },
      }
    );
  }

  function createPourEnvMap(renderer) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.add(new THREE.AmbientLight(0xffffff, 0.55));

    [
      [0x0a0a09, 0, 7, 0],
      [0x121210, 0, -7, 0],
      [0x1a1a17, 7, 0, 0],
      [0x161614, -7, 1, 0],
      [0x0f0f0d, 0, 2, 7],
      [0x22221e, 0, -1, -7],
    ].forEach(([color, x, y, z]) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(14, 14),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
      );
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      envScene.add(m);
    });

    [
      [0xf3ede0, 3.5, 3.5, -1.5, 0.9],
      [0xc8c0b0, -3.5, 2.5, 2.5, 0.65],
      [0x857f72, 0, -3, 3.5, 0.7],
    ].forEach(([color, x, y, z, r]) => {
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshBasicMaterial({ color })
      );
      ball.position.set(x, y, z);
      envScene.add(ball);
    });

    const tex = pmrem.fromScene(envScene, 0.04).texture;
    pmrem.dispose();
    return tex;
  }

  function initPourWebGL(section, pin, canvas, projects, setHud, hint, hintFill) {
    document.body.classList.add("pour-webgl");
    section.style.height = "580vh";

    const hud = pin.querySelector(".pour__hud");
    const intro = document.getElementById("pourIntro");
    const introTitle = intro?.querySelector(".pour__intro-title");
    const work = document.getElementById("work");
    const workHome = work?.parentNode || null;
    let workSpacer = null;

    const parkWork = () => {
      if (!work || !workHome || !workSpacer) return;
      workSpacer.style.height = `${Math.max(work.offsetHeight || 0, window.innerHeight)}px`;
      if (work.parentNode !== pin) pin.insertBefore(work, canvas);
      work.classList.add("is-pour-portal");
      work.style.opacity = "0";
      work.style.transform = "scale(0.42)";
      work.style.pointerEvents = "none";
    };

    const releaseWork = () => {
      if (!work || !workHome || !workSpacer) return;
      work.classList.remove("is-pour-portal");
      work.style.opacity = "";
      work.style.transform = "";
      work.style.pointerEvents = "";
      // Keep spacer in the DOM so ScrollTrigger can reverse cleanly
      if (work.parentNode === pin) {
        workHome.insertBefore(work, workSpacer.nextSibling);
      }
      workSpacer.style.height = "0px";
    };

    // Permanent spacer — never removed (fixes black tunnel on scroll-back)
    if (work && workHome) {
      workSpacer = document.createElement("div");
      workSpacer.id = "workPourSpacer";
      workSpacer.style.height = `${Math.max(work.offsetHeight, window.innerHeight)}px`;
      workHome.insertBefore(workSpacer, work);
      parkWork();
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x0a0a09, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const envMap = createPourEnvMap(renderer);
    scene.environment = envMap;
    scene.fog = new THREE.Fog(0x0a0a09, 10, 48);

    const camera = new THREE.PerspectiveCamera(68, 1, 0.05, 160);
    const state = { progress: 0, mx: 0, my: 0 };

    const pts = [];
    for (let i = 0; i <= 18; i++) {
      const t = i / 18;
      const a = t * Math.PI * 2.2;
      pts.push(
        new THREE.Vector3(
          Math.sin(a) * (4.6 + Math.sin(t * 6) * 0.7),
          Math.cos(a * 0.5) * 1.8 + Math.sin(t * 4) * 0.55,
          t * 78 - 4
        )
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.4);
    const tubeRadius = 3.5;

    scene.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(curve, 380, tubeRadius, 56, false),
        new THREE.MeshStandardMaterial({
          color: 0x1c1c18,
          metalness: 0.92,
          roughness: 0.32,
          side: THREE.BackSide,
          envMap,
          envMapIntensity: 1.15,
          emissive: 0x0a0a09,
          emissiveIntensity: 0.35,
        })
      )
    );
    scene.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(curve, 260, tubeRadius - 0.16, 32, false),
        new THREE.MeshStandardMaterial({
          color: 0x0a0a09,
          metalness: 0.65,
          roughness: 0.55,
          side: THREE.BackSide,
          envMap,
          envMapIntensity: 0.3,
          transparent: true,
          opacity: 0.28,
        })
      )
    );

    // Thin rings — hidden at the entrance, revealed as you dive in
    const ribMat = new THREE.MeshStandardMaterial({
      color: 0xf3ede0,
      metalness: 0.92,
      roughness: 0.25,
      envMap,
      envMapIntensity: 1.2,
      emissive: 0xf3ede0,
      emissiveIntensity: 0.14,
    });
    const ribs = [];
    const RIB_COUNT = 40;
    for (let i = 0; i < RIB_COUNT; i++) {
      const t = 0.08 + (i / (RIB_COUNT - 1)) * 0.9;
      const p = curve.getPointAt(t);
      const tang = curve.getTangentAt(t).normalize();
      const rib = new THREE.Mesh(
        new THREE.TorusGeometry(tubeRadius - 0.14, 0.018, 8, 64),
        ribMat
      );
      rib.position.copy(p);
      rib.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tang);
      rib.userData.t = t;
      rib.visible = false;
      scene.add(rib);
      ribs.push(rib);
    }
    const lastRibT = ribs[ribs.length - 1].userData.t;

    // Threshold ring — blooms at the mouth of the dark after the title clears
    const thresholdMat = new THREE.MeshStandardMaterial({
      color: 0xf3ede0,
      metalness: 0.95,
      roughness: 0.18,
      envMap,
      envMapIntensity: 1.4,
      emissive: 0xf3ede0,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0,
    });
    const thresholdRing = new THREE.Mesh(
      new THREE.TorusGeometry(tubeRadius - 0.14, 0.028, 10, 64),
      thresholdMat
    );
    {
      const tp = curve.getPointAt(0.035);
      const tt = curve.getTangentAt(0.035).normalize();
      thresholdRing.position.copy(tp);
      thresholdRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tt);
      thresholdRing.scale.setScalar(0.04);
      thresholdRing.visible = false;
      scene.add(thresholdRing);
    }

    const dripGeo = new THREE.SphereGeometry(0.06, 10, 10);
    const dripMat = new THREE.MeshStandardMaterial({
      color: 0xf3ede0,
      metalness: 1,
      roughness: 0.2,
      envMap,
      envMapIntensity: 1.4,
      emissive: 0xf3ede0,
      emissiveIntensity: 0.12,
    });
    for (let i = 0; i < 36; i++) {
      const drip = new THREE.Mesh(dripGeo, dripMat);
      const t = 0.1 + (i / 36) * 0.85;
      const p = curve.getPointAt(t);
      const tang = curve.getTangentAt(t).normalize();
      let b = new THREE.Vector3().crossVectors(tang, new THREE.Vector3(0, 1, 0));
      if (b.lengthSq() < 0.001) b = new THREE.Vector3(1, 0, 0);
      b.normalize();
      const u = new THREE.Vector3().crossVectors(b, tang).normalize();
      const ang = (i / 36) * Math.PI * 11;
      p.add(b.multiplyScalar(Math.cos(ang) * (tubeRadius - 0.7)));
      p.add(u.multiplyScalar(Math.sin(ang) * (tubeRadius - 0.7)));
      drip.position.copy(p);
      drip.scale.setScalar(0.4 + (i % 4) * 0.14);
      scene.add(drip);
    }

    scene.add(new THREE.HemisphereLight(0xc8c0b0, 0x0a0a09, 0.55));
    scene.add(new THREE.AmbientLight(0x3a3832, 0.5));
    const headLight = new THREE.PointLight(0xf3ede0, 48, 30, 2);
    scene.add(headLight);
    const rimLight = new THREE.PointLight(0x857f72, 28, 30, 2);
    scene.add(rimLight);
    const fill = new THREE.PointLight(0xc8c0b0, 16, 22, 2);
    scene.add(fill);

    const mouthT = 0.995;
    const mouthPos = curve.getPointAt(mouthT);
    const mouthTang = curve.getTangentAt(mouthT).normalize();

    const mouthRing = new THREE.Mesh(
      new THREE.TorusGeometry(tubeRadius + 0.1, 0.028, 8, 64),
      new THREE.MeshStandardMaterial({
        color: 0xf3ede0,
        metalness: 0.9,
        roughness: 0.22,
        emissive: 0xf3ede0,
        emissiveIntensity: 0.28,
        envMap,
        envMapIntensity: 1.2,
        transparent: true,
        opacity: 1,
      })
    );
    mouthRing.position.copy(mouthPos);
    mouthRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), mouthTang);
    scene.add(mouthRing);

    const voidCap = new THREE.Mesh(
      new THREE.CircleGeometry(tubeRadius * 1.15, 48),
      new THREE.MeshBasicMaterial({ color: 0x121210, fog: false })
    );
    voidCap.position.copy(mouthPos).addScaledVector(mouthTang, 0.35);
    voidCap.lookAt(mouthPos.clone().add(mouthTang));
    scene.add(voidCap);

    const loader = new THREE.TextureLoader();
    const boards = [];
    const liveTextures = [];
    const faceQuat = new THREE.Quaternion();
    const camQuat = new THREE.Quaternion();
    const ridePt = new THREE.Vector3();

    const bindScreenMap = (screenMat, tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      screenMat.map = tex;
      screenMat.color.set(0xffffff);
      screenMat.needsUpdate = true;
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    };

    const loadAnimatedMap = (url, screenMat) => {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
      const paint = document.createElement("canvas");
      const ctx = paint.getContext("2d", { alpha: false });
      const ready = () => {
        if (!img.naturalWidth) return;
        paint.width = img.naturalWidth;
        paint.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        const tex = new THREE.CanvasTexture(paint);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        bindScreenMap(screenMat, tex);
        liveTextures.push({ img, ctx, paint, tex });
      };
      if (img.complete) ready();
      else img.addEventListener("load", ready, { once: true });
    };

    projects.forEach((project, i) => {
      const group = new THREE.Group();
      const t = 0.18 + ((i + 0.5) / projects.length) * 0.52;
      const pos = curve.getPointAt(t);
      const tang = curve.getTangentAt(t).normalize();
      const worldUp = new THREE.Vector3(0, 1, 0);
      let binormal = new THREE.Vector3().crossVectors(tang, worldUp);
      if (binormal.lengthSq() < 0.001) binormal = new THREE.Vector3(1, 0, 0);
      binormal.normalize();
      const normal = new THREE.Vector3().crossVectors(binormal, tang).normalize();

      const side = i % 2 === 0 ? 1 : -1;
      const wall = pos
        .clone()
        .add(binormal.clone().multiplyScalar(side * 1.5))
        .add(normal.clone().multiplyScalar(0.12));

      group.position.copy(wall);
      group.lookAt(pos);
      const homeQuat = group.quaternion.clone();

      const frame = new THREE.Mesh(
        new THREE.PlaneGeometry(3.5, 2.45),
        new THREE.MeshStandardMaterial({
          color: 0x2a2a26,
          metalness: 0.88,
          roughness: 0.28,
          envMap,
          envMapIntensity: 1.1,
        })
      );
      frame.position.z = -0.05;
      group.add(frame);

      const edge = new THREE.Mesh(
        new THREE.PlaneGeometry(3.62, 2.57),
        new THREE.MeshBasicMaterial({ color: 0xf3ede0, toneMapped: false })
      );
      edge.position.z = -0.06;
      group.add(edge);

      const screenMat = new THREE.MeshBasicMaterial({
        color: 0x1a1a17,
        toneMapped: false,
      });
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.25, 2.25), screenMat);
      group.add(screen);

      if (project.animated) {
        loadAnimatedMap(project.img, screenMat);
      } else {
        loader.load(project.img, (tex) => bindScreenMap(screenMat, tex));
      }

      group.userData = {
        index: i,
        href: project.href,
        t,
        home: wall.clone(),
        homeQuat,
        side,
        pathPoint: pos.clone(),
      };
      scene.add(group);
      boards.push(group);
    });

    const camPos = new THREE.Vector3();
    const camLook = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    // Slow camera / liquid dodge away from project frames
    const dodge = { side: 0, up: 0, look: 0, clear: 0, clearSide: 0 };

    if (fine) {
      addEventListener(
        "mousemove",
        (e) => {
          state.mx = (e.clientX / innerWidth - 0.5) * 2;
          state.my = (e.clientY / innerHeight - 0.5) * 2;
        },
        { passive: true }
      );
    }

    const setMouth = (amount) => {
      const a = Math.max(0, Math.min(1, amount));
      // Soft ease so Work doesn't slam in
      const ease = a * a * (3 - 2 * a);

      if (a < 0.01) {
        canvas.style.webkitMaskImage = "none";
        canvas.style.maskImage = "none";
        pin.style.backgroundColor = "";
      } else {
        const inn = ease * 78;
        const out = inn + Math.max(4, 12 - ease * 7);
        const grad = `radial-gradient(circle at 50% 46%, transparent ${inn}%, #000 ${out}%)`;
        canvas.style.webkitMaskImage = grad;
        canvas.style.maskImage = grad;
        // Match Work section bg (--bg-2) as the mouth opens
        pin.style.backgroundColor = "#121210";
      }

      if (work) {
        work.style.opacity = ease > 0.02 ? String(Math.min(1, ease * 1.15)) : "0";
        work.style.transform = `scale(${0.5 + ease * 0.5})`;
        work.style.pointerEvents = ease > 0.92 ? "auto" : "none";
      }
    };

    const applyIntro = (p) => {
      // 0–0.08 hold · 0.08–0.16 fly-away · then dark threshold before the ride
      if (!intro) return { hold: 0, fly: 1 };
      const hold = Math.min(1, p / 0.08);
      const fly = Math.max(0, Math.min(1, (p - 0.08) / 0.08));
      intro.style.opacity = String(Math.max(0, 1 - fly * 1.15));
      if (introTitle) {
        const rotY = fly * 58;
        const rotX = fly * -28;
        const z = fly * -420;
        const x = fly * 160;
        const y = fly * -40;
        introTitle.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
      }
      if (fly < 1) intro.style.visibility = "visible";
      else intro.style.visibility = "hidden";
      return { hold, fly };
    };

    const applyProgress = (p) => {
      const { fly } = applyIntro(p);

      // Dark beat after title · bloom threshold ring · then dive
      const darkBeat = Math.max(0, Math.min(1, (p - 0.155) / 0.055));
      const bloom = Math.max(0, Math.min(1, (p - 0.195) / 0.075));
      const rideP = Math.max(0, (p - 0.24) / 0.76);
      const mouthAmt = rideP > 0.88 ? Math.min(1, (rideP - 0.88) / 0.12) : 0;
      const travelMax = lastRibT + 0.06;
      const travel = Math.min(travelMax, rideP * travelMax);

      if (rideP <= 0) {
        curve.getPointAt(0.001, camPos);
        curve.getPointAt(0.05, camLook);
      } else if (travel <= 1) {
        curve.getPointAt(Math.min(0.999, Math.max(0.001, travel)), camPos);
        if (mouthAmt > 0) {
          camLook.copy(mouthPos).addScaledVector(mouthTang, 4 + mouthAmt * 20);
        } else {
          curve.getPointAt(Math.min(0.999, travel + 0.07), camLook);
        }
      }

      const tang =
        travel <= 0.001
          ? curve.getTangentAt(0.001).normalize()
          : travel <= 1
            ? curve.getTangentAt(Math.min(0.999, travel)).normalize()
            : mouthTang.clone();
      const worldUp = new THREE.Vector3(0, 1, 0);
      let sideV = new THREE.Vector3().crossVectors(tang, worldUp);
      if (sideV.lengthSq() < 0.001) sideV.set(1, 0, 0);
      sideV.normalize();
      const upV = new THREE.Vector3().crossVectors(sideV, tang).normalize();

      // Dodge timing: hold clear while a site is in full view,
      // then in the gap after it, slowly glide toward clearing the NEXT site
      let dodgeSideT = 0;
      let dodgeUpT = 0;
      let focusSide = 0;
      let focusAmt = 0;
      if (rideP > 0.02 && mouthAmt < 0.65) {
        const travelNow = Math.min(1, travel);
        let cur = null;
        let curD = 999;
        let next = null;
        let nextD = 999;

        boards.forEach((b) => {
          const d = b.userData.t - travelNow;
          if (d > -0.1 && d < 0.14 && Math.abs(d - 0.05) < Math.abs(curD - 0.05)) {
            cur = b;
            curD = d;
          }
          if (d > 0.08 && d < nextD) {
            next = b;
            nextD = d;
          }
        });

        const curFull =
          cur && curD > -0.02 && curD < 0.12
            ? Math.max(0, 1 - Math.abs(curD - 0.05) / 0.1)
            : 0;

        if (curFull > 0.35) {
          const soft = curFull * curFull * (3 - 2 * curFull);
          dodgeSideT = -cur.userData.side * soft * 1.35;
          dodgeUpT = Math.sin(soft * Math.PI) * 0.14 * -cur.userData.side;
          focusSide = cur.userData.side;
          focusAmt = soft;
        } else if (next) {
          let ramp = 0;
          if (nextD >= 0.28) ramp = 0;
          else if (nextD > 0.16) ramp = (0.28 - nextD) / 0.12;
          else if (nextD > 0.08) ramp = 1;
          else ramp = Math.max(0, nextD / 0.08);

          const gapGate = 1 - Math.min(1, curFull / 0.35);
          ramp *= gapGate;

          const soft = ramp * ramp * (3 - 2 * ramp);
          dodgeSideT = -next.userData.side * soft * 1.5;
          dodgeUpT = Math.sin(soft * Math.PI) * 0.16 * -next.userData.side;
          focusSide = next.userData.side;
          focusAmt = soft;
        }
      }
      dodge.side += (dodgeSideT - dodge.side) * 0.018;
      dodge.up += (dodgeUpT - dodge.up) * 0.016;
      dodge.look += (dodgeSideT * 0.35 - dodge.look) * 0.02;
      dodge.clear += (focusAmt - dodge.clear) * 0.02;
      dodge.clearSide += (focusSide - dodge.clearSide) * 0.018;

      const sway = rideP > 0 && mouthAmt < 0.5 ? 1 - mouthAmt * 2 : 0;
      camPos.addScaledVector(upV, 0.06 * sway + dodge.up * sway);
      camPos.addScaledVector(sideV, state.mx * 0.14 * sway + dodge.side * sway);
      camPos.addScaledVector(upV, -state.my * 0.1 * sway);
      camLook.addScaledVector(sideV, dodge.look * sway);

      camera.position.copy(camPos);
      camera.lookAt(camLook);
      camera.fov = 66 + mouthAmt * 8;
      camera.updateProjectionMatrix();

      // Dark threshold beat — lights drop, then bloom back as the ring opens
      const lightMul =
        fly < 1 ? 0.35 : darkBeat > 0 && bloom < 0.35 ? 0.12 + bloom * 0.5 : 0.55 + bloom * 0.45;
      headLight.intensity = 48 * lightMul * (1 - mouthAmt * 0.7);
      rimLight.intensity = 28 * lightMul;
      fill.intensity = 16 * lightMul;
      headLight.position.copy(camPos).addScaledVector(tang, 2.2);
      rimLight.position.copy(camPos).addScaledVector(tang, -2).addScaledVector(upV, 1.5);
      fill.position.copy(camPos).addScaledVector(sideV, 1.1).addScaledVector(upV, 0.35);

      // Threshold bloom ring
      if (bloom > 0.01 && bloom < 0.98 && rideP < 0.12) {
        thresholdRing.visible = true;
        const s = 0.08 + bloom * 0.92;
        thresholdRing.scale.setScalar(s);
        thresholdMat.opacity = bloom < 0.7 ? bloom * 1.2 : Math.max(0, 1 - (bloom - 0.7) / 0.3);
        thresholdMat.emissiveIntensity = 0.35 + bloom * 0.4;
      } else {
        thresholdRing.visible = false;
      }

      // Rings after the threshold; fade out as the Work mouth opens
      const ringsOn = rideP > 0.05;
      const ringFade = 1 - mouthAmt;
      ribs.forEach((rib) => {
        const ahead = rib.userData.t - travel;
        const show = ringsOn && ahead > -0.01 && ahead < 0.42 && ringFade > 0.04;
        rib.visible = show;
        rib.scale.setScalar(show ? Math.max(0.05, ringFade) : 1);
      });
      mouthRing.visible = ringsOn && lastRibT - travel > -0.01 && ringFade > 0.04;
      mouthRing.scale.setScalar(Math.max(0.05, ringFade));
      if (mouthRing.material) mouthRing.material.opacity = ringFade;

      setMouth(mouthAmt);

      // Cursor choreography
      if (cursorCtl) {
        if (p < 0.1) {
          cursorCtl.setMode("follow");
        } else if (p < 0.22) {
          cursorCtl.setMode("drop");
          cursorCtl.setDrop(innerWidth * 0.5, innerHeight * 0.62);
        } else if (mouthAmt > 0.92) {
          if (cursorCtl.getMode() !== "return" && cursorCtl.getMode() !== "follow") {
            cursorCtl.setMode("return");
          }
        } else if (rideP > 0) {
          cursorCtl.setMode("ride");
          const lookT = Math.min(0.999, travel + 0.1);
          curve.getPointAt(lookT, ridePt);
          ridePt.addScaledVector(sideV, dodge.side * 1.6);
          ridePt.addScaledVector(upV, dodge.up * 1.2);
          ridePt.project(camera);
          let sx = (ridePt.x * 0.5 + 0.5) * pin.clientWidth;
          let sy = (-ridePt.y * 0.5 + 0.5) * pin.clientHeight;
          if (dodge.clear > 0.04) {
            const clear = Math.min(1, dodge.clear * 1.2);
            sx += -dodge.clearSide * clear * pin.clientWidth * 0.32;
            sy += -clear * pin.clientHeight * 0.06;
          }
          sx = Math.max(pin.clientWidth * 0.12, Math.min(pin.clientWidth * 0.88, sx));
          sy = Math.max(pin.clientHeight * 0.18, Math.min(pin.clientHeight * 0.82, sy));
          cursorCtl.setRide(sx, sy);
        }
      }

      let best = 0;
      let bestScore = Infinity;
      // Hold projects back until after the threshold bloom
      const showBoards = rideP > 0.08 && mouthAmt < 0.55;

      boards.forEach((b, i) => {
        const d = b.userData.t - Math.min(1, travel);
        const ad = Math.abs(d - 0.05);
        if (ad < bestScore) {
          bestScore = ad;
          best = i;
        }

        const focus = showBoards ? Math.max(0, 1 - Math.abs(d - 0.06) * 5.2) : 0;
        const surge = focus * focus;
        tmp.copy(b.userData.home).lerp(b.userData.pathPoint, surge * 0.28);
        b.position.copy(tmp);
        b.scale.setScalar(0.95 + surge * 0.35);

        faceQuat.copy(b.userData.homeQuat);
        tmp.copy(camPos);
        const prev = b.quaternion.clone();
        b.lookAt(tmp);
        camQuat.copy(b.quaternion);
        b.quaternion.copy(prev);
        b.quaternion.copy(faceQuat).slerp(camQuat, surge * 0.5);
        b.rotateZ((1 - surge) * b.userData.side * 0.06);
        b.visible = showBoards && d > -0.35 && d < 0.55;
      });

      setHud(best);
      const inTunnel = rideP > 0.06 && mouthAmt < 0.4;
      if (hintFill) hintFill.style.height = `${Math.min(1, rideP / 0.88) * 100}%`;
      if (hint) {
        hint.style.opacity = inTunnel ? "1" : "0";
        hint.classList.toggle("is-done", mouthAmt > 0.2);
      }
      if (hud) hud.style.opacity = inTunnel ? "1" : "0";

      // Soft canvas fade into Work (no hard cut)
      const canvasFade = mouthAmt > 0.85 ? 1 - (mouthAmt - 0.85) / 0.15 : 1;
      canvas.style.opacity = String(Math.max(0, canvasFade));
      canvas.style.pointerEvents = mouthAmt > 0.92 ? "none" : "auto";
    };

    const resize = () => {
      const w = pin.clientWidth || window.innerWidth;
      const h = pin.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    resize();
    addEventListener("resize", resize);

    const render = () => renderer.render(scene, camera);
    applyProgress(0);
    render();

    let liveRaf = 0;
    const liveLoop = () => {
      liveRaf = requestAnimationFrame(liveLoop);
      if (!liveTextures.length) return;
      // Keep GIF/WebP frames moving even when scroll is idle
      liveTextures.forEach(({ img, ctx, paint, tex }) => {
        if (!img.complete || !img.naturalWidth) return;
        if (paint.width !== img.naturalWidth || paint.height !== img.naturalHeight) {
          paint.width = img.naturalWidth;
          paint.height = img.naturalHeight;
        }
        ctx.drawImage(img, 0, 0);
        tex.needsUpdate = true;
      });
      render();
    };
    liveLoop();

    let lastP = 0;

    if (hasGSAP && typeof ScrollTrigger !== "undefined") {
      gsap.to(state, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          endTrigger: "#workPourSpacer",
          end: "top top",
          scrub: true,
          pin: pin,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          pinType: lenis ? "transform" : "fixed",
          onUpdate: (self) => {
            lastP = self.progress;
            state.progress = self.progress;
            applyProgress(self.progress);
            render();
          },
          onLeave: () => {
            setMouth(1);
            canvas.style.opacity = "0";
            canvas.style.webkitMaskImage = "none";
            canvas.style.maskImage = "none";
            canvas.style.pointerEvents = "none";
            if (hud) hud.style.opacity = "0";
            if (hint) hint.style.opacity = "0";
            if (intro) intro.style.visibility = "hidden";
            releaseWork();
            if (cursorCtl) cursorCtl.setMode("return");
            requestAnimationFrame(() => {
              if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
            });
          },
          onEnterBack: () => {
            parkWork();
            canvas.style.opacity = "1";
            canvas.style.pointerEvents = "auto";
            if (intro) intro.style.visibility = "hidden";
            if (cursorCtl) cursorCtl.setMode("ride");
            resize();
            const pNow = lastP > 0 ? lastP : 1;
            applyProgress(pNow);
            render();
            requestAnimationFrame(() => {
              if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
              applyProgress(lastP > 0 ? lastP : 1);
              render();
            });
          },
          onLeaveBack: () => {
            if (cursorCtl) cursorCtl.setMode("return");
            if (intro) {
              intro.style.visibility = "visible";
              intro.style.opacity = "1";
            }
          },
        },
      });
    } else {
      const loop = () => {
        render();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    canvas.addEventListener("click", (e) => {
      if (getComputedStyle(canvas).opacity === "0") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(boards, true);
      if (!hits.length) return;
      let obj = hits[0].object;
      while (obj && !obj.userData?.href) obj = obj.parent;
      if (obj?.userData?.href) window.open(obj.userData.href, "_blank", "noopener");
    });
    canvas.style.cursor = "pointer";
  }

  // ——— Horizontal work rail ———
  function initWorkRail() {
    const viewport = document.getElementById("workViewport");
    const rail = document.getElementById("workRail");
    if (!viewport || !rail) return;

    // Title reveal
    if (hasGSAP && typeof ScrollTrigger !== "undefined" && !reduced) {
      const titleIns = gsap.utils.toArray("#work .work__title .clip__in");
      if (document.body.classList.contains("pour-webgl")) {
        // Arriving from the tunnel — keep the real Work title visible
        gsap.set(titleIns, { yPercent: 0 });
      } else {
        gsap.set(titleIns, { yPercent: 110 });
        gsap.to(titleIns, {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: "#work .work__head", start: "top 80%" },
        });
      }
    }

    if (!hasGSAP || typeof ScrollTrigger === "undefined" || reduced) {
      return;
    }

    // Mobile: 2-col grid with scrub scale / reveal (no tunnel, no horizontal pin)
    if (mobile()) {
      gsap.utils.toArray("#workRail .panel").forEach((panel) => {
        gsap.fromTo(
          panel,
          { y: 36, opacity: 0, scale: 0.92 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top 94%",
              end: "top 58%",
              scrub: 0.45,
            },
          }
        );
        const img = panel.querySelector("img");
        if (!img) return;
        gsap.fromTo(
          img,
          { scale: 1.14 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top 92%",
              end: "top 42%",
              scrub: 0.5,
            },
          }
        );
      });
      return;
    }

    // Desktop + The Pour: visual gallery lives in WebGL; Work is a text index
    if (document.body.classList.contains("pour-webgl")) return;

    const getScroll = () => Math.max(0, rail.scrollWidth - viewport.clientWidth);
    const viewH = () =>
      Math.round(window.visualViewport?.height || window.innerHeight);

    // Flush section bottom so no black gap under the rail while scrubbing
    const workSection = document.querySelector(".work");
    const pinStart = () => {
      const vh = viewH();
      const h = workSection.offsetHeight;
      return `top ${Math.round(vh - h)}px`;
    };

    gsap.to(rail, {
      x: () => -getScroll(),
      ease: "none",
      scrollTrigger: {
        trigger: ".work",
        start: pinStart,
        end: () => `+=${getScroll() + viewH() * 0.25}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        anticipatePin: 0,
        fastScrollEnd: true,
        pinType: lenis ? "transform" : "fixed",
      },
    });

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
        { scale: 1.1 },
        {
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top 90%",
            end: "top 30%",
            scrub: 0.35,
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

    // The Rift — page splits, fall into cream eclipse, type builds, slam into Craft
    const rift = document.getElementById("craftRift");
    const riftPin = document.getElementById("riftPin");
    const slabL = document.getElementById("riftSlabL");
    const slabR = document.getElementById("riftSlabR");
    const hair = document.getElementById("riftHair");
    const sun = document.getElementById("riftSun");
    const land = document.getElementById("riftLand");
    const words = gsap.utils.toArray("#riftType span");
    if (rift && riftPin && slabL && slabR) {
      const isMob = mobile();
      gsap.set(hair, { scaleY: 0, opacity: 1, transformOrigin: "top center" });
      gsap.set(slabL, { xPercent: 0 });
      gsap.set(slabR, { xPercent: 0 });
      gsap.set(sun, { scale: 0.06, opacity: 0.4 });
      gsap.set(words, { opacity: 0, y: "1.1em", rotateX: 70 });
      gsap.set(land, { opacity: 0, y: 28 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rift,
          start: "top top",
          end: () => (isMob ? "+=220%" : "+=240%"),
          scrub: isMob ? 0.4 : 0.55,
          pin: riftPin,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          pinType: lenis ? "transform" : "fixed",
        },
      });

      // 1. Hairline cracks the page
      tl.to(hair, { scaleY: 1, duration: 0.12 }, 0)
        // 2. Slabs peel — you see the cream world in the wound
        .to(slabL, { xPercent: -102, duration: 0.28 }, 0.1)
        .to(slabR, { xPercent: 102, duration: 0.28 }, 0.1)
        .to(hair, { opacity: 0, duration: 0.08 }, 0.18)
        // 3. Fall in — sun blooms to a full eclipse field
        .to(sun, { scale: 0.45, opacity: 1, duration: 0.12 }, 0.16)
        .to(sun, { scale: 9.5, duration: 0.28 }, 0.28)
        // 4. Type builds inside the cream
        .to(
          words,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.08,
            stagger: 0.06,
          },
          0.42
        )
        // 5. Hold the sentence
        .to({}, { duration: 0.1 }, 0.72)
        // 6. Slam: type sinks, cream drains, Craft title lands on black
        .to(words, { opacity: 0, y: "-0.6em", duration: 0.1 }, 0.8)
        .to(sun, { scale: 0.01, opacity: 0, duration: 0.14 }, 0.82)
        .to(land, { opacity: 1, y: 0, duration: 0.12 }, 0.86)
        .to(slabL, { xPercent: 0, duration: 0.12 }, 0.86)
        .to(slabR, { xPercent: 0, duration: 0.12 }, 0.86);
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

      const isMob = mobile();
      const viewH = () =>
        Math.round(window.visualViewport?.height || window.innerHeight);
      const typeSection = stage.closest(".cap--type") || stage;

      // Mobile pins the whole kinetic block as a full-screen scene.
      // Desktop pins just the stage mid-viewport like before.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: isMob ? typeSection : stage,
          start: isMob ? "top top" : "top 28%",
          end: () =>
            isMob ? `+=${Math.round(viewH() * 1.25)}` : "+=90%",
          scrub: isMob ? 0.35 : 0.55,
          pin: isMob ? typeSection : stage,
          anticipatePin: 0,
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
        stagger: isMob ? 0.12 : 0.18,
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
          scrollTrigger: { trigger: frame, start: "top 80%" },
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

    // Infinite motion — three loops, scroll sets velocity, hover locks a channel
    const loopTrack = (el, duration, reverse) => {
      if (!el) return null;
      el.innerHTML = el.innerHTML + el.innerHTML;
      if (reverse) gsap.set(el, { xPercent: -50 });
      return gsap.to(el, {
        xPercent: reverse ? 0 : -50,
        duration,
        ease: "none",
        repeat: -1,
      });
    };
    if (!reduced) {
      const typeTween = loopTrack(document.getElementById("tickerTrack"), 34, false);
      const nameTween = loopTrack(document.getElementById("tickerNames"), 48, true);
      const filmTween = loopTrack(document.getElementById("tickerFilm"), 40, false);
      const tweens = [typeTween, nameTween, filmTween].filter(Boolean);
      if (tweens.length) {
        ScrollTrigger.create({
          trigger: "#ticker",
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = gsap.utils.clamp(0.5, 2.8, 1 + Math.abs(self.getVelocity()) / 3200);
            tweens.forEach((tw) => tw.timeScale(boost));
            const type = document.getElementById("tickerTrack");
            if (type) {
              const skew = gsap.utils.clamp(-10, 10, self.getVelocity() / -420);
              gsap.set(type, { skewX: skew });
            }
          },
        });
      }
      const film = document.getElementById("tickerFilm");
      if (film && filmTween) {
        film.querySelectorAll(".ticker__shot").forEach((shot) => {
          shot.addEventListener("pointerenter", () => filmTween.pause());
          shot.addEventListener("pointerleave", () => filmTween.resume());
        });
      }
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

  // ——— Process / atelier + stills ———
  function initProcess() {
    if (hasGSAP && typeof ScrollTrigger !== "undefined" && !reduced) {
      if (mobile()) initBoards();
      else initAtelier();
    }

    if (!hasGSAP || typeof ScrollTrigger === "undefined" || reduced) return;

    gsap.fromTo(
      ".contact__kicker, .contact__title, .contact__lede, .contact__actions, .contact__meta",
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.05,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: "#contact", start: "top 78%", toggleActions: "play none none none" },
      }
    );
  }

  function initBoards() {
    const section = document.getElementById("boards");
    const pin = document.getElementById("boardsPin");
    const flash = document.getElementById("boardsFlash");
    const shots = gsap.utils.toArray(".boards__shot");
    const ticks = gsap.utils.toArray("#boardsTicks li");
    if (!section || !pin || shots.length < 2) return;

    const isMob = mobile();
    const copies = shots.map((s) => s.querySelector(".boards__copy"));
    let last = -1;

    const show = (step, punched) => {
      shots.forEach((s, i) => s.classList.toggle("is-on", i === step));
      ticks.forEach((t, i) => t.classList.toggle("is-on", i === step));
      if (!punched || step === last) return;
      last = step;
      if (flash) {
        gsap.fromTo(
          flash,
          { opacity: 0.92 },
          { opacity: 0, duration: 0.22, ease: "power2.out", overwrite: true }
        );
      }
      if (copies[step]) {
        gsap.fromTo(
          copies[step],
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", overwrite: true }
        );
      }
    };

    show(0, false);
    last = 0;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => (isMob ? "+=220%" : "+=300%"),
      pin: pin,
      anticipatePin: 0,
      invalidateOnRefresh: true,
      pinType: lenis ? "transform" : "fixed",
      onUpdate: (self) => {
        const step = Math.min(shots.length - 1, Math.floor(self.progress * shots.length * 0.999));
        show(step, true);
      },
    });
  }

  function initAtelier() {
    const canvas = document.getElementById("atelierCanvas");
    const section = document.getElementById("boards");
    const pin = document.getElementById("boardsPin");
    if (!canvas || !section || !pin) {
      initBoards();
      return;
    }

    const canWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();

    const start = () => {
      if (typeof THREE !== "undefined" && canWebGL) {
        initAtelierWebGL(section, pin, canvas);
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
        return;
      }
      initBoards();
    };

    if (typeof THREE !== "undefined") start();
    else {
      let started = false;
      const go = () => {
        if (started) return;
        started = true;
        start();
      };
      window.addEventListener("three-ready", go, { once: true });
      setTimeout(go, 4000);
    }
  }

  function initAtelierWebGL(section, pin, canvas) {
    document.body.classList.add("atelier-webgl");
    const hud = document.getElementById("atelierHud");
    if (hud) hud.hidden = false;

    const steps = [
      {
        num: "01",
        eye: "03 — Process",
        title: "Discover",
        lede: "Every site I’ve built, still in pieces — nothing committed yet.",
      },
      {
        num: "02",
        eye: "Art direction",
        title: "Direction",
        lede: "They lock into a border. Then the wireframe of a site appears.",
      },
      {
        num: "03",
        eye: "Build",
        title: "Build",
        lede: "Images, type, and buttons land in the layout.",
      },
      {
        num: "04",
        eye: "Launch",
        title: "Ship it.",
        lede: "Ropes on the rocket. It hauls the next page up with it.",
      },
    ];
    const eyeEl = document.getElementById("atelierEyebrow");
    const numEl = document.getElementById("atelierNum");
    const titleEl = document.getElementById("atelierTitle");
    const ledeEl = document.getElementById("atelierLede");
    const ticks = [...document.querySelectorAll("#boardsTicks li")];
    let lastStep = -1;
    const setHud = (i) => {
      const s = steps[i];
      if (!s) return;
      ticks.forEach((t, n) => t.classList.toggle("is-on", n === i));
      if (i === lastStep) return;
      lastStep = i;
      if (eyeEl) eyeEl.textContent = s.eye;
      if (numEl) numEl.textContent = s.num;
      if (titleEl) titleEl.textContent = s.title;
      if (ledeEl) ledeEl.textContent = s.lede;
      if (hud) {
        gsap.fromTo(
          hud,
          { y: 10, opacity: 0.55 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", overwrite: "auto" }
        );
      }
    };

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x050504, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.04;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050504, 8, 22);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 40);
    const state = { progress: 0, mx: 0, my: 0, siteDirty: true };
    const look = { x: 0, y: 0, z: 3.2, lx: 0, ly: 0 };

    scene.add(new THREE.AmbientLight(0xf3ede0, 0.2));
    const key = new THREE.DirectionalLight(0xf3ede0, 1.8);
    key.position.set(2.8, 4.4, 3.6);
    scene.add(key);
    scene.add(new THREE.DirectionalLight(0x857f72, 0.4).translateX(-3.5).translateY(1).translateZ(1.4));

    const work = [
      { key: "jesse", src: "assets/jessesparks.png" },
      { key: "sjrnr", src: "assets/sjrnr.png" },
      { key: "orthodox", src: "assets/orthodoxicons.png" },
      { key: "justhed", src: "assets/justhed.webp" },
      { key: "sarah", src: "assets/sarah.png" },
      { key: "blessed", src: "assets/blessedbeauty.png" },
      { key: "charmed", src: "assets/charmed.png" },
      { key: "conceiving", src: "assets/conceiving.png" },
    ];
    const htmlImgs = {};
    const creamMat = new THREE.MeshPhysicalMaterial({
      color: 0xf3ede0,
      roughness: 0.46,
      metalness: 0.06,
      clearcoat: 0.2,
      transparent: true,
      opacity: 1,
    });
    const shards = [];
    const tmp = new THREE.Vector3();

    for (let i = 0; i < 12; i++) {
      const isPaper = i >= 8;
      const periW = 3.5;
      const periH = 1.98;
      const per = 2 * (periW + periH);
      let d = (i / 12) * per;
      let bx;
      let by;
      if (d < periW) {
        bx = -periW / 2 + d;
        by = periH / 2;
      } else if ((d -= periW) < periH) {
        bx = periW / 2;
        by = periH / 2 - d;
      } else if ((d -= periH) < periW) {
        bx = periW / 2 - d;
        by = -periH / 2;
      } else {
        d -= periW;
        bx = -periW / 2;
        by = -periH / 2 + d;
      }
      const board = new THREE.Vector3(bx, by, 0.08);
      const ang = i * 2.399;
      const rad = 2.2 + (i % 5) * 0.28;
      const chaos = new THREE.Vector3(
        Math.sin(ang) * rad,
        (i % 7) * 0.22 - 0.7,
        Math.cos(ang) * rad * 0.85
      );
      const sink = new THREE.Vector3(bx * 0.12, by * 0.12, 0.04);
      const spin = new THREE.Vector3(
        (i % 3) * 0.7 - 0.7,
        (i % 5) * 0.5 - 1,
        (i % 4) * 0.4 - 0.6
      );
      let mesh;
      if (isPaper) {
        mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.72), creamMat.clone());
      } else {
        const mat = new THREE.MeshBasicMaterial({
          color: 0x1a1a17,
          transparent: true,
          opacity: 1,
          toneMapped: false,
        });
        mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.18, 0.74), mat);
        const item = work[i];
        const im = new Image();
        im.decoding = "async";
        htmlImgs[item.key] = im;
        im.onload = () => {
          const tex = new THREE.Texture(im);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          tex.needsUpdate = true;
          mat.map = tex;
          mat.color.set(0xffffff);
          mat.needsUpdate = true;
          state.siteDirty = true;
        };
        im.src = item.src;
      }
      mesh.position.copy(chaos);
      scene.add(mesh);
      shards.push({ mesh, chaos, board, sink, spin, isPaper });
    }

    const siteW = 1280;
    const siteH = 720;
    const siteCanvas = document.createElement("canvas");
    siteCanvas.width = siteW;
    siteCanvas.height = siteH;
    const siteCtx = siteCanvas.getContext("2d", { alpha: false });
    const siteTex = new THREE.CanvasTexture(siteCanvas);
    siteTex.colorSpace = THREE.SRGBColorSpace;
    siteTex.minFilter = THREE.LinearFilter;
    siteTex.generateMipmaps = false;

    const drawCover = (img, x, y, w, h, a) => {
      if (!img || !img.naturalWidth) return;
      siteCtx.save();
      siteCtx.globalAlpha = a;
      siteCtx.beginPath();
      siteCtx.rect(x, y, w, h);
      siteCtx.clip();
      const ir = img.naturalWidth / img.naturalHeight;
      const rr = w / h;
      let dw = w;
      let dh = h;
      let dx = x;
      let dy = y;
      if (ir > rr) {
        dw = h * ir;
        dx = x - (dw - w) / 2;
      } else {
        dh = w / ir;
        dy = y;
      }
      siteCtx.drawImage(img, dx, dy, dw, dh);
      siteCtx.restore();
    };

    const paintSite = (t) => {
      const c = siteCtx;
      c.fillStyle = "#0a0a09";
      c.fillRect(0, 0, siteW, siteH);
      const pad = 36;
      const chrome = 30;
      const navH = 54;
      const heroH = 318;
      const gy = chrome + navH + 14 + heroH + 14;
      const gw = (siteW - pad * 2 - 24) / 4;
      const gh = siteH - gy - pad;

      const wireA = smooth(0.16, 0.4, t);
      if (wireA > 0) {
        c.strokeStyle = `rgba(243,237,224,${0.55 * wireA})`;
        c.lineWidth = 1.25;
        c.strokeRect(pad, chrome + 8, siteW - pad * 2, navH);
        c.strokeRect(pad, chrome + navH + 14, siteW - pad * 2, heroH);
        for (let i = 0; i < 4; i++) {
          c.strokeRect(pad + i * (gw + 8), gy, gw, gh);
        }
        c.beginPath();
        c.moveTo(pad + 28, chrome + navH + 108);
        c.lineTo(pad + 420, chrome + navH + 108);
        c.moveTo(pad + 28, chrome + navH + 168);
        c.lineTo(pad + 520, chrome + navH + 168);
        c.strokeRect(pad + 28, chrome + navH + 196, 150, 38);
        c.stroke();
      }

      const chromeA = smooth(0.42, 0.52, t);
      if (chromeA > 0) {
        c.fillStyle = `rgba(18,18,16,${chromeA})`;
        c.fillRect(0, 0, siteW, chrome);
        [
          ["#e25b4a", 16],
          ["#e3b341", 34],
          ["#6dbe5b", 52],
        ].forEach(([col, x]) => {
          c.fillStyle = col;
          c.globalAlpha = chromeA;
          c.beginPath();
          c.arc(x, 15, 5, 0, Math.PI * 2);
          c.fill();
        });
        c.globalAlpha = 1;
        c.fillStyle = `rgba(133,127,114,${chromeA})`;
        c.font = "500 11px Syne, system-ui, sans-serif";
        c.fillText("lyricsaucedo.dev", 72, 19);
      }

      const navA = smooth(0.46, 0.58, t);
      if (navA > 0) {
        c.fillStyle = `rgba(10,10,9,${navA})`;
        c.fillRect(0, chrome, siteW, navH);
        c.fillStyle = `rgba(243,237,224,${navA})`;
        c.font = "700 16px Syne, system-ui, sans-serif";
        c.fillText("Lyricsaucedo.dev", pad, chrome + 34);
        c.fillStyle = `rgba(200,192,176,${navA * 0.85})`;
        c.font = "600 12px Syne, system-ui, sans-serif";
        c.fillText("Work    Craft    Process    Contact", pad + 200, chrome + 34);
        c.fillStyle = `rgba(243,237,224,${navA})`;
        if (c.roundRect) {
          c.beginPath();
          c.roundRect(siteW - pad - 92, chrome + 13, 92, 28, 14);
          c.fill();
        } else {
          c.fillRect(siteW - pad - 92, chrome + 13, 92, 28);
        }
        c.fillStyle = `rgba(10,10,9,${navA})`;
        c.font = "600 11px Syne, system-ui, sans-serif";
        c.fillText("Hire me", siteW - pad - 72, chrome + 32);
      }

      const heroA = smooth(0.5, 0.64, t);
      if (heroA > 0) {
        const hx = pad;
        const hy = chrome + navH + 14;
        const hw = siteW - pad * 2;
        c.save();
        c.beginPath();
        c.rect(hx, hy, hw, heroH * heroA);
        c.clip();
        drawCover(htmlImgs.jesse, hx, hy, hw, heroH, 1);
        c.restore();
      }

      const typeA = smooth(0.58, 0.7, t);
      if (typeA > 0) {
        c.fillStyle = `rgba(243,237,224,${typeA})`;
        c.font = "500 52px Fraunces, Georgia, serif";
        c.fillText("Websites that", pad + 28, chrome + navH + 108);
        c.fillText("feel worth hiring for.", pad + 28, chrome + navH + 168);
      }

      const ctaA = smooth(0.64, 0.76, t);
      if (ctaA > 0) {
        c.fillStyle = `rgba(243,237,224,${ctaA})`;
        if (c.roundRect) {
          c.beginPath();
          c.roundRect(pad + 28, chrome + navH + 196, 150, 38, 4);
          c.fill();
        } else {
          c.fillRect(pad + 28, chrome + navH + 196, 150, 38);
        }
        c.fillStyle = `rgba(10,10,9,${ctaA})`;
        c.font = "600 13px Syne, system-ui, sans-serif";
        c.fillText("View the work", pad + 50, chrome + navH + 220);
      }

      const tiles = ["sjrnr", "orthodox", "justhed", "sarah"];
      tiles.forEach((key, i) => {
        const a = smooth(0.7 + i * 0.055, 0.82 + i * 0.055, t);
        if (a <= 0) return;
        const x = pad + i * (gw + 8);
        c.save();
        c.translate(x + gw / 2, gy + gh / 2);
        c.scale(0.88 + a * 0.12, 0.88 + a * 0.12);
        c.translate(-(x + gw / 2), -(gy + gh / 2));
        drawCover(htmlImgs[key], x, gy, gw, gh, a);
        c.restore();
      });

      siteTex.needsUpdate = true;
    };

    const glassUni = {
      uMap: { value: siteTex },
      uTime: { value: 0 },
      uWarp: { value: 0.2 },
      uBulge: { value: 0.48 },
      uOpacity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };
    const glassMat = new THREE.ShaderMaterial({
      uniforms: glassUni,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      vertexShader: `
        uniform float uBulge;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          vec2 c = uv * 2.0 - 1.0;
          p.z -= uBulge * dot(c, c);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform float uTime;
        uniform float uWarp;
        uniform float uOpacity;
        uniform vec2 uMouse;
        varying vec2 vUv;
        void main() {
          vec2 c = vUv * 2.0 - 1.0;
          float r2 = dot(c, c);
          vec2 uv = c * (1.0 + uWarp * r2) * 0.5 + 0.5;
          vec2 off = vec2(0.004 + uWarp * 0.016 * r2, 0.0);
          vec3 col;
          col.r = texture2D(uMap, uv + off).r;
          col.g = texture2D(uMap, uv).g;
          col.b = texture2D(uMap, uv - off).b;
          col *= 1.0 - sin((uv.y + uTime * 0.01) * 520.0) * 0.02;
          vec2 hl = c - vec2(uMouse.x * 0.4, -uMouse.y * 0.3);
          col += pow(max(0.0, 1.0 - length(hl * vec2(0.7, 1.3))), 14.0) * 0.12;
          gl_FragColor = vec4(col, uOpacity);
        }
      `,
    });
    const vessel = new THREE.Group();
    scene.add(vessel);

    const siteWrap = new THREE.Group();
    vessel.add(siteWrap);

    const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.55, 2.0, 48, 28), glassMat);
    glass.position.z = 0.02;
    siteWrap.add(glass);

    const rocket = new THREE.Group();
    rocket.visible = false;
    vessel.add(rocket);
    const smokePad = new THREE.Group();
    scene.add(smokePad);
    const bodyMats = [];
    const smokeMats = [];
    const smokeMeshes = [];
    const flame = new THREE.Group();
    flame.visible = false;
    const flameMats = [0xf3ede0, 0xe8a15a, 0xc45c4a].map(
      (col) =>
        new THREE.MeshBasicMaterial({
          color: col,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        })
    );
    const flameBalls = [0.18, 0.12, 0.08].map((r, i) => {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), flameMats[i]);
      ball.position.y = -i * 0.14;
      flame.add(ball);
      return ball;
    });
    rocket.add(flame);
    const engineLight = new THREE.PointLight(0xf3c27a, 0, 8, 2);
    engineLight.position.set(0, -0.85, 0.15);
    rocket.add(engineLight);

    const ropeMat = new THREE.MeshStandardMaterial({
      color: 0xf3ede0,
      roughness: 0.48,
      metalness: 0.12,
      transparent: true,
      opacity: 0,
    });
    const ropeGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    const _up = new THREE.Vector3(0, 1, 0);
    const _dir = new THREE.Vector3();
    const _a = new THREE.Vector3();
    const _b = new THREE.Vector3();
    const _mid = new THREE.Vector3();
    const stick = (mesh, p0, p1) => {
      _dir.copy(p1).sub(p0);
      const len = Math.max(_dir.length(), 0.001);
      mesh.position.copy(p0).add(p1).multiplyScalar(0.5);
      mesh.scale.set(1, len, 1);
      mesh.quaternion.setFromUnitVectors(_up, _dir.normalize());
    };
    const ropes = [
      [-0.82, 0.18],
      [0.82, 0.18],
      [-0.32, -0.16],
      [0.32, -0.16],
    ].map(([x, z]) => {
      const hi = new THREE.Mesh(ropeGeo, ropeMat);
      const lo = new THREE.Mesh(ropeGeo, ropeMat);
      scene.add(hi, lo);
      return { hi, lo, x, z };
    });
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.1, 0.22),
      new THREE.MeshStandardMaterial({
        color: 0xf3ede0,
        roughness: 0.38,
        metalness: 0.22,
        transparent: true,
        opacity: 0,
      })
    );
    beam.position.y = -2.35;
    scene.add(beam);
    const contactEl = document.getElementById("contact");

    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(160 * 3);
    for (let i = 0; i < 160; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 10;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0xf3ede0,
        size: 0.016,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      })
    );
    scene.add(dust);

    const smooth = (a, b, t) => {
      const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
      return x * x * (3 - 2 * x);
    };
    const smoother = (a, b, t) => {
      const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
      return x * x * x * (x * (x * 6 - 15) + 10);
    };
    const camKeys = [
      { t: 0, x: 0.85, y: 0.28, z: 2.7, lx: 0.1, ly: 0 },
      { t: 0.18, x: 0.28, y: 0.12, z: 6.05, lx: 0, ly: 0 },
      { t: 0.4, x: 0, y: 0.04, z: 5.05, lx: 0, ly: 0 },
      { t: 0.66, x: 0.06, y: 0.02, z: 4.15, lx: 0, ly: 0 },
      { t: 0.78, x: 0.08, y: 0.04, z: 4.35, lx: 0, ly: 0.05 },
      { t: 0.9, x: 0.14, y: 0.55, z: 5.1, lx: 0, ly: 1.6 },
      { t: 1, x: 0.2, y: 1.85, z: 5.7, lx: 0, ly: 5.2 },
    ];
    const camAt = (p) => {
      let a = camKeys[0];
      let b = camKeys[camKeys.length - 1];
      for (let i = 0; i < camKeys.length - 1; i++) {
        if (p >= camKeys[i].t && p <= camKeys[i + 1].t) {
          a = camKeys[i];
          b = camKeys[i + 1];
          break;
        }
      }
      const u = b.t === a.t ? 1 : (p - a.t) / (b.t - a.t);
      const e = u * u * u * (u * (u * 6 - 15) + 10);
      look.x = a.x + (b.x - a.x) * e;
      look.y = a.y + (b.y - a.y) * e;
      look.z = a.z + (b.z - a.z) * e;
      look.lx = a.lx + (b.lx - a.lx) * e;
      look.ly = a.ly + (b.ly - a.ly) * e;
    };

    let lastPaint = -1;
    const apply = (p) => {
      const formRocket = smoother(0.7, 0.88, p);
      const smokeA = smoother(0.76, 0.92, p);
      const strain = smoother(0.8, 0.88, p);
      const launch = smoother(0.86, 1, p);
      const born = smoother(0.26, 0.46, p);
      const dirPaint = smoother(0.2, 0.5, p) * 0.42;
      const buildPaint = smoother(0.48, 0.72, p);
      const paintT = dirPaint + buildPaint * 0.58;
      const paintKey = Math.round(paintT * 72);
      if (paintKey !== lastPaint || state.siteDirty) {
        lastPaint = paintKey;
        state.siteDirty = false;
        paintSite(paintT);
      }

      shards.forEach((s, i) => {
        const delay = (i / 12) * 0.07;
        const toBorder = smoother(0.14 + delay, 0.4 + delay, p);
        const absorb = smoother(0.34 + delay * 0.5, 0.56 + delay * 0.4, p);
        tmp.copy(s.chaos).lerp(s.board, toBorder).lerp(s.sink, absorb);
        const wobble = (1 - toBorder) * 0.07;
        s.mesh.position.copy(tmp);
        s.mesh.position.y += Math.sin(p * 7 + i) * wobble;
        s.mesh.rotation.set(
          s.spin.x * (1 - toBorder) * 0.85,
          s.spin.y * (1 - toBorder) + toBorder * 0.02,
          s.spin.z * (1 - toBorder) * 0.45
        );
        const sc = (1 - toBorder * 0.4) * (1 - absorb * 0.96);
        s.mesh.scale.setScalar(Math.max(0.03, sc));
        s.mesh.material.opacity = 1 - absorb;
        s.mesh.visible = absorb < 0.995;
      });

      glassUni.uOpacity.value = born * (1 - formRocket);
      glassUni.uWarp.value = 0.16 - formRocket * 0.1;
      glassUni.uBulge.value = 0.42 - formRocket * 0.3;
      glass.visible = born > 0.01 && formRocket < 0.995;
      const siteScale = 1 - formRocket * 0.97;
      siteWrap.scale.setScalar(Math.max(0.03, siteScale));
      siteWrap.visible = formRocket < 0.995;

      rocket.visible = formRocket > 0.01;
      rocket.scale.setScalar(Math.max(0.001, 0.04 + formRocket * 0.96));
      rocket.rotation.y = 0.28 + formRocket * 0.18;
      bodyMats.forEach((m) => {
        m.opacity = formRocket;
        m.transparent = formRocket < 0.97;
      });
      smokePad.visible = smokeA > 0.01;
      smokePad.scale.setScalar(0.55 + smokeA * 0.7);
      smokeMats.forEach((m) => {
        m.opacity = smokeA * 0.88;
      });
      flame.visible = launch > 0.01;
      flameMats.forEach((m, i) => {
        m.opacity = launch * (0.88 - i * 0.16);
      });
      engineLight.intensity = formRocket * 0.6 + launch * 9;

      vessel.rotation.x = -strain * 0.04 - launch * 0.1;
      vessel.position.y = strain * 0.22 + launch * 7.1;
      vessel.position.z = -launch * 1.25;

      const ropeOn = smoother(0.72, 0.86, p) * (1 - smoother(0.94, 1, p) * 0.4);
      ropeMat.opacity = ropeOn * 0.92;
      beam.material.opacity = ropeOn;
      beam.visible = ropeOn > 0.02;
      beam.position.y = -2.35 + strain * 0.35 + launch * 3.5;
      beam.position.z = -launch * 0.5;
      rocket.updateMatrixWorld(true);
      const sag = (1 - strain * 0.45 - launch * 0.5) * 1.2 + 0.05;
      ropes.forEach((r) => {
        const show = ropeOn > 0.02;
        r.hi.visible = r.lo.visible = show;
        if (!show) return;
        _a.set(r.x * 0.55, -0.35, r.z).applyMatrix4(rocket.matrixWorld);
        _b.set(r.x * 1.55, beam.position.y + 0.06, r.z * 0.4 + beam.position.z);
        _mid.lerpVectors(_a, _b, 0.5);
        _mid.y -= sag;
        stick(r.hi, _a, _mid);
        stick(r.lo, _mid, _b);
      });
      scene.fog.near = 8 + launch * 4;
      scene.fog.far = 22 + launch * 16;

      camAt(p);

      const step = p < 0.22 ? 0 : p < 0.48 ? 1 : p < 0.72 ? 2 : 3;
      setHud(step);
    };

    apply(0);
    setHud(0);

    const mountRocket = (Loader) => {
      if (!Loader) {
        console.warn("[process] GLTFLoader missing — rocket.glb skipped");
        return;
      }
      new Loader().load(
        "assets/rocket.glb",
        (gltf) => {
          const model = gltf.scene;
          model.traverse((obj) => {
            if (!obj.isMesh) return;
            const multi = Array.isArray(obj.material);
            const mats = multi ? obj.material : [obj.material];
            const cloned = mats.map((mat) => {
              const next = mat.clone();
              const smoke = /smoke/i.test(`${obj.name} ${mat.name || ""}`);
              next.transparent = true;
              next.opacity = smoke ? 0 : 1;
              next.depthWrite = !smoke;
              next.side = THREE.DoubleSide;
              return next;
            });
            obj.material = multi ? cloned : cloned[0];
            const first = cloned[0];
            const label = `${obj.name} ${first.name || ""}`;
            if (/smoke/i.test(label)) {
              smokeMeshes.push(obj);
              cloned.forEach((m) => {
                if (!smokeMats.includes(m)) smokeMats.push(m);
              });
            } else {
              cloned.forEach((m) => {
                if (!bodyMats.includes(m)) bodyMats.push(m);
              });
              if (/window/i.test(label)) {
                first.map = siteTex;
                first.toneMapped = false;
                first.needsUpdate = true;
              }
            }
          });
          smokeMeshes.forEach((m) => {
            m.visible = false;
          });
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          const tall = Math.max(size.x, size.y, size.z, 0.001);
          const fitS = 2.2 / tall;
          model.scale.setScalar(fitS);
          smokeMeshes.forEach((m) => {
            m.visible = true;
          });
          rocket.add(model);
          rocket.rotation.y = 0.45;
          rocket.updateMatrixWorld(true);
          smokeMeshes.forEach((m) => smokePad.attach(m));
          flame.position.set(0, (box.min.y - center.y) * fitS - 0.04, 0);
          engineLight.position.set(0, flame.position.y + 0.08, 0.12);
          apply(state.progress);
        },
        undefined,
        (err) => console.warn("[process] rocket.glb failed", err)
      );
    };
    const Loader = window.THREE_ADDONS && window.THREE_ADDONS.GLTFLoader;
    if (Loader) mountRocket(Loader);
    else {
      import("https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js")
        .then((m) => mountRocket(m.GLTFLoader))
        .catch((err) => console.warn("[process] GLTFLoader import failed", err));
    }

    const fit = () => {
      const w = pin.clientWidth || window.innerWidth;
      const h = pin.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    fit();

    let autoHaul = false;
    const pullEase = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const pullToContact = (self) => {
      if (autoHaul || !contactEl || document.body.classList.contains("is-playing")) return;
      autoHaul = true;
      const now = lenis ? lenis.scroll : window.scrollY || window.pageYOffset;
      const contactY = contactEl.getBoundingClientRect().top + now;
      const dest = Math.max(contactY, self.end) + 4;
      if (lenis) {
        lenis.scrollTo(dest, { duration: 3.4, easing: pullEase, lock: true, force: true });
      } else {
        window.scrollTo({ top: dest, behavior: "smooth" });
      }
    };

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=620%",
      scrub: 1.35,
      pin: pin,
      anticipatePin: 0,
      invalidateOnRefresh: true,
      pinType: lenis ? "transform" : "fixed",
      onUpdate: (self) => {
        state.progress = self.progress;
        apply(self.progress);
        if (self.direction > 0 && self.progress >= 0.88) pullToContact(self);
        if (self.progress < 0.76) autoHaul = false;
      },
      onEnterBack: () => {
        autoHaul = false;
        apply(state.progress);
      },
    });

    window.addEventListener(
      "pointermove",
      (e) => {
        state.mx = (e.clientX / window.innerWidth) * 2 - 1;
        state.my = (e.clientY / window.innerHeight) * 2 - 1;
      },
      { passive: true }
    );
    window.addEventListener("resize", fit);

    const tick = () => {
      requestAnimationFrame(tick);
      const t = performance.now() * 0.001;
      const p = state.progress;
      dust.rotation.y = t * 0.02;
      const lift = Math.max(0, (p - 0.86) / 0.14);
      if (lift > 0) {
        dust.position.y = -lift * 2.2;
        flameBalls.forEach((ball, i) => {
          const pulse = 0.88 + Math.sin(t * 18 + i * 1.7) * 0.14;
          ball.scale.setScalar(pulse);
        });
        smokePad.rotation.y = t * 0.1;
      }
      glassUni.uTime.value = t;
      glassUni.uMouse.value.set(state.mx, state.my);
      const hand = (0.16 + p * 0.08) * (1 - lift * 0.8);
      const damp = 0.045;
      camera.position.x += (look.x + state.mx * hand - camera.position.x) * damp;
      camera.position.y += (look.y + state.my * -0.08 - camera.position.y) * damp;
      camera.position.z += (look.z - camera.position.z) * damp;
      camera.lookAt(look.lx + state.mx * 0.05, look.ly + state.my * -0.03, 0);
      renderer.render(scene, camera);
    };
    tick();
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
    if (window.visualViewport) {
      visualViewport.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(refreshPins, 200);
      });
    }
  }
})();
