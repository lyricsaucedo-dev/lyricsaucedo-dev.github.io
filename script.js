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
    const titleAt = wantHero3d ? 1.85 : 0.8;
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x0a0a09, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    const scene = new THREE.Scene();
    scene.environment = createPourEnvMap(renderer);
    scene.fog = new THREE.Fog(0x0a0a09, 8, 22);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 40);
    camera.position.set(0, 0.1, 0.72);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xf3ede0, 0.22));
    const key = new THREE.DirectionalLight(0xf3ede0, 2.4);
    key.position.set(2.8, 4.2, 3.2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x857f72, 0.45);
    fill.position.set(-3.2, 0.6, 1.2);
    scene.add(fill);
    const rim = new THREE.PointLight(0xf3ede0, 10, 14, 2);
    rim.position.set(-2.2, 1.6, 3.4);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    const neon = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xf3ede0,
      emissiveIntensity: 0.55,
      roughness: 0.18,
      metalness: 0.35,
      envMapIntensity: 0.4,
    });
    const metal = new THREE.MeshStandardMaterial({
      color: 0x1a1a17,
      roughness: 0.32,
      metalness: 0.88,
      envMapIntensity: 1,
    });

    const slabs = items.map((item, i) => {
      const root = new THREE.Group();
      const board = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 2.05),
        new THREE.MeshPhysicalMaterial({
          color: 0x22221e,
          roughness: 0.38,
          metalness: 0.12,
          envMapIntensity: 0.7,
          clearcoat: 0.4,
          clearcoatRoughness: 0.35,
        })
      );
      const bezel = new THREE.Mesh(new THREE.PlaneGeometry(3.34, 2.19), metal.clone());
      bezel.position.z = -0.012;
      const back = new THREE.Mesh(new THREE.PlaneGeometry(3.34, 2.19), metal.clone());
      back.position.z = -0.02;
      back.rotation.y = Math.PI;
      root.add(bezel, back, board);
      [
        [3.34, 0.045, 0, 1.12, -0.006],
        [3.34, 0.045, 0, -1.12, -0.006],
        [0.045, 2.19, 1.67, 0, -0.006],
        [0.045, 2.19, -1.67, 0, -0.006],
      ].forEach(([w, h, x, y, z]) => {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.04), neon.clone());
        bar.position.set(x, y, z);
        root.add(bar);
      });
      new THREE.TextureLoader().load(item.img, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        board.material.map = tex;
        board.material.color.set(0xffffff);
        board.material.needsUpdate = true;
      });
      const slot = i - (items.length - 1) / 2;
      root.userData = {
        slot,
        x: slot * 2.55,
        y: slot === 0 ? 0.08 : -0.12,
        z: Math.abs(slot) * -1.15,
        rotY: slot * -0.42,
      };
      group.add(root);
      return root;
    });

    const dustGeo = new THREE.BufferGeometry();
    const n = 180;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0xf3ede0,
        size: 0.016,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      })
    );
    scene.add(dust);

    const mx = { x: 0, y: 0 };
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

    const cam = { z: 0.72, y: 0.1 };
    if (hasGSAP) {
      gsap.to(cam, {
        z: 7.1,
        y: 0.28,
        duration: 2.35,
        ease: "power3.inOut",
        delay: 0.05,
      });
    } else {
      cam.z = 7.1;
      cam.y = 0.28;
    }

    const fit = () => {
      const w = intro?.clientWidth || window.innerWidth;
      const h = intro?.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    fit();
    window.addEventListener("resize", fit);

    let raf = 0;
    const tick3d = () => {
      raf = requestAnimationFrame(tick3d);
      const t = performance.now() * 0.001;
      const featured = hero3d.idx();
      slabs.forEach((root, i) => {
        const d = root.userData;
        const on = i === featured;
        const tx = d.x + (on ? 0 : d.slot * 0.12);
        const ty = d.y + Math.sin(t * 0.7 + i) * 0.06;
        const tz = on ? 0.85 : d.z;
        const ts = on ? 1.08 : 0.78;
        const ry = on ? 0 : d.rotY;
        root.position.x += (tx - root.position.x) * 0.07;
        root.position.y += (ty - root.position.y) * 0.07;
        root.position.z += (tz - root.position.z) * 0.07;
        root.scale.setScalar(root.scale.x + (ts - root.scale.x) * 0.07);
        root.rotation.y += (ry - root.rotation.y) * 0.07;
        root.rotation.x = Math.sin(t * 0.5 + i) * 0.03;
      });
      dust.rotation.y = t * 0.03;
      const pull = hero3d.scroll * 1.8;
      camera.position.z = cam.z + pull;
      camera.position.y = cam.y + mx.y * -0.22 + hero3d.scroll * 0.35;
      camera.position.x = mx.x * 0.55;
      camera.lookAt(mx.x * 0.35, -0.05 + mx.y * -0.12, 0);
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
        img: "assets/justhed.png",
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
    const faceQuat = new THREE.Quaternion();
    const camQuat = new THREE.Quaternion();
    const ridePt = new THREE.Vector3();

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

      loader.load(project.img, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        screenMat.map = tex;
        screenMat.color.set(0xffffff);
        screenMat.needsUpdate = true;
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      });

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

  // ——— Process / atelier + stills ———
  function initProcess() {
    if (hasGSAP && typeof ScrollTrigger !== "undefined" && !reduced) {
      if (mobile()) initBoards();
      else initAtelier();
    }

    if (!hasGSAP || typeof ScrollTrigger === "undefined" || reduced) return;

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
        lede: "Brand, audience, offers, constraints. We define what “done” is before a single pixel moves.",
      },
      {
        num: "02",
        eye: "Art direction",
        title: "Direction",
        lede: "Type, color, motion language. A system that feels like the brand — not a theme.",
      },
      {
        num: "03",
        eye: "Build",
        title: "Build",
        lede: "Pixel-precise front-end. Shopify when it needs to sell. Performance watched like a hawk.",
      },
      {
        num: "04",
        eye: "Launch",
        title: "Ship it.",
        lede: "Train, hand over, stay on call for the next drop.",
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
          { y: 28, opacity: 0.2 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", overwrite: true }
        );
      }
    };

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
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const envMap = createPourEnvMap(renderer);
    scene.environment = envMap;
    scene.fog = new THREE.Fog(0x0a0a09, 7, 18);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 40);
    camera.position.set(0, 0.55, 6.2);
    const state = { progress: 0, mx: 0, my: 0 };

    const key = new THREE.DirectionalLight(0xf3ede0, 2.1);
    key.position.set(3.2, 5.4, 2.4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 16;
    scene.add(key);
    scene.add(new THREE.DirectionalLight(0x857f72, 0.55).translateX(-4).translateY(1.2).translateZ(-2));
    scene.add(new THREE.AmbientLight(0xf3ede0, 0.18));
    const rim = new THREE.PointLight(0xf3ede0, 8, 12, 2);
    rim.position.set(-1.6, 1.8, 3.2);
    scene.add(rim);

    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.55, 1.65, 0.07, 64),
      new THREE.MeshStandardMaterial({
        color: 0x121210,
        roughness: 0.35,
        metalness: 0.45,
        envMapIntensity: 0.8,
      })
    );
    plinth.position.y = -1.12;
    plinth.receiveShadow = true;
    scene.add(plinth);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.58, 0.012, 8, 80),
      new THREE.MeshStandardMaterial({ color: 0xf3ede0, roughness: 0.25, metalness: 0.7 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.08;
    scene.add(ring);

    const cream = new THREE.MeshPhysicalMaterial({
      color: 0xf3ede0,
      roughness: 0.42,
      metalness: 0.08,
      envMapIntensity: 1,
      clearcoat: 0.25,
      clearcoatRoughness: 0.5,
    });
    const creamDark = cream.clone();
    creamDark.color.set(0xc8c0b0);
    const metal = new THREE.MeshStandardMaterial({
      color: 0x2a2a26,
      roughness: 0.28,
      metalness: 0.92,
      envMapIntensity: 1.2,
    });

    const discover = new THREE.Group();
    const sheets = [];
    for (let i = 0; i < 11; i++) {
      const mat = i % 3 === 0 ? creamDark.clone() : cream.clone();
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.018, 1.05), mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const chaos = new THREE.Vector3(
        (Math.random() - 0.5) * 2.6,
        (Math.random() - 0.4) * 1.8,
        (Math.random() - 0.5) * 1.8
      );
      const stack = new THREE.Vector3(0, -0.55 + i * 0.028, 0);
      sheets.push({
        mesh,
        chaos,
        stack,
        fan: ((i - 5) / 5) * 0.55,
        spin: (Math.random() - 0.5) * 0.8,
      });
      discover.add(mesh);
    }
    scene.add(discover);

    const direction = new THREE.Group();
    const aShape = new THREE.Shape();
    aShape.moveTo(0.04, 0);
    aShape.lineTo(0.26, 0);
    aShape.lineTo(0.4, 0.58);
    aShape.lineTo(0.6, 0.58);
    aShape.lineTo(0.74, 0);
    aShape.lineTo(0.96, 0);
    aShape.lineTo(0.58, 1.32);
    aShape.lineTo(0.42, 1.32);
    aShape.closePath();
    const aHole = new THREE.Path();
    aHole.moveTo(0.42, 0.74);
    aHole.lineTo(0.5, 1.08);
    aHole.lineTo(0.58, 0.74);
    aHole.closePath();
    aShape.holes.push(aHole);
    const aGeo = new THREE.ExtrudeGeometry(aShape, {
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.022,
      bevelSegments: 2,
    });
    aGeo.center();
    const aMesh = new THREE.Mesh(aGeo, cream.clone());
    aMesh.castShadow = true;
    aMesh.material.transparent = true;
    const aWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(aGeo, 18),
      new THREE.LineBasicMaterial({ color: 0xf3ede0, transparent: true })
    );
    direction.add(aMesh, aWire);
    direction.scale.setScalar(1.55);
    scene.add(direction);

    const build = new THREE.Group();
    const voxels = [];
    const cols = 7;
    const rows = 5;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.06), metal.clone());
        cell.castShadow = true;
        const tx = (x - (cols - 1) / 2) * 0.32;
        const ty = (y - (rows - 1) / 2) * 0.32;
        voxels.push({
          mesh: cell,
          home: new THREE.Vector3(tx, ty, 0),
          scatter: new THREE.Vector3(
            tx + (Math.random() - 0.5) * 3.2,
            ty + (Math.random() - 0.5) * 2.4,
            (Math.random() - 0.5) * 2.8
          ),
        });
        build.add(cell);
      }
    }
    const frame = new THREE.Group();
    const bezel = (w, h, x, y) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.08), cream.clone());
      m.position.set(x, y, 0.02);
      m.castShadow = true;
      frame.add(m);
    };
    bezel(2.55, 0.08, 0, 0.92);
    bezel(2.55, 0.08, 0, -0.92);
    bezel(0.08, 1.92, -1.24, 0);
    bezel(0.08, 1.92, 1.24, 0);
    build.add(frame);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.28, 1.62),
      new THREE.MeshBasicMaterial({ color: 0x111110, transparent: true, opacity: 0 })
    );
    screen.position.z = 0.05;
    build.add(screen);
    new THREE.TextureLoader().load("assets/jessesparks.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      screen.material.map = tex;
      screen.material.color.set(0xffffff);
      screen.material.needsUpdate = true;
    });
    scene.add(build);

    const ship = new THREE.Group();
    const hullMat = cream.clone();
    hullMat.transparent = true;
    const hull = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.42, 1.15, 8, 24),
      hullMat
    );
    hull.castShadow = true;
    hull.rotation.z = Math.PI / 2;
    const bandMat = metal.clone();
    bandMat.transparent = true;
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.44, 0.045, 8, 32),
      bandMat
    );
    band.rotation.y = Math.PI / 2;
    const sealMat = metal.clone();
    sealMat.transparent = true;
    const seal = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 16), sealMat);
    seal.position.set(0.62, 0.08, 0.28);
    ship.add(hull, band, seal);
    scene.add(ship);

    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 220;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 8;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0xf3ede0,
        size: 0.018,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      })
    );
    scene.add(dust);

    const smooth = (a, b, t) => {
      const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
      return x * x * (3 - 2 * x);
    };
    const actWeight = (p, a, b) => {
      const fade = 0.05;
      if (p <= a - fade || p >= b + fade) return 0;
      if (p < a) return smooth(a - fade, a, p);
      if (p > b) return 1 - smooth(b, b + fade, p);
      return 1;
    };

    const apply = (p) => {
      const w0 = actWeight(p, 0, 0.23);
      const w1 = actWeight(p, 0.23, 0.48);
      const w2 = actWeight(p, 0.48, 0.72);
      const w3 = actWeight(p, 0.72, 1);
      const local0 = smooth(0, 0.23, p);
      const local1 = smooth(0.23, 0.48, p);
      const local2 = smooth(0.48, 0.72, p);
      const local3 = smooth(0.72, 1, p);

      discover.visible = w0 > 0.01;
      direction.visible = w1 > 0.01;
      build.visible = w2 > 0.01;
      ship.visible = w3 > 0.01;
      discover.scale.setScalar(0.2 + w0 * 0.8);
      direction.scale.setScalar((0.2 + w1 * 0.8) * 1.55);
      build.scale.setScalar(0.2 + w2 * 0.8);
      const launch = smooth(0.82, 1, p);
      ship.scale.setScalar((0.2 + w3 * 0.8) * (1 + launch * 2.4));
      ship.position.z = launch * 5.2;
      ship.rotation.y = local3 * Math.PI * 1.4;
      ship.traverse((o) => {
        if (o.material && o.material.transparent !== undefined && o !== dust) {
          o.material.transparent = true;
          o.material.opacity = Math.max(0, 1 - launch * 1.15);
        }
      });

      const gather = smooth(0.12, 0.55, local0);
      const fan = smooth(0.55, 0.95, local0);
      sheets.forEach((s, i) => {
        s.mesh.position.lerpVectors(s.chaos, s.stack, gather);
        s.mesh.position.x += Math.sin(fan * Math.PI) * s.fan * 1.15;
        s.mesh.rotation.set(
          (1 - gather) * s.spin,
          fan * s.fan * 0.9,
          (1 - gather) * s.spin * 0.4
        );
      });

      aMesh.material.opacity = 0.12 + local1 * 0.88;
      aWire.material.opacity = 1 - local1 * 0.55;
      direction.rotation.y = -0.35 + local1 * 1.25;
      direction.rotation.x = Math.sin(local1 * Math.PI) * 0.08;

      voxels.forEach((v) => {
        v.mesh.position.lerpVectors(v.scatter, v.home, smooth(0.08, 0.72, local2));
        v.mesh.rotation.set(
          (1 - local2) * 1.2,
          (1 - local2) * 1.6,
          0
        );
      });
      frame.scale.setScalar(0.15 + smooth(0.35, 0.75, local2) * 0.85);
      screen.material.opacity = smooth(0.55, 0.9, local2);

      const weights = [w0, w1, w2, w3];
      let step = 0;
      let best = -1;
      weights.forEach((w, i) => {
        if (w > best) {
          best = w;
          step = i;
        }
      });
      setHud(step);
    };

    apply(0);
    setHud(0);

    const fit = () => {
      const w = pin.clientWidth || window.innerWidth;
      const h = pin.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    fit();

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=340%",
      scrub: 0.55,
      pin: pin,
      anticipatePin: 0,
      invalidateOnRefresh: true,
      pinType: lenis ? "transform" : "fixed",
      onUpdate: (self) => {
        state.progress = self.progress;
        apply(self.progress);
      },
    });

    const onMove = (e) => {
      state.mx = (e.clientX / window.innerWidth) * 2 - 1;
      state.my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", fit);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = performance.now() * 0.001;
      dust.rotation.y = t * 0.02;
      plinth.rotation.y = t * 0.08;
      camera.position.x += (state.mx * 0.42 - camera.position.x) * 0.06;
      camera.position.y += (0.48 + state.my * -0.18 - camera.position.y) * 0.06;
      camera.lookAt(0, 0.05, 0);
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
