import { useEffect, useRef, useState } from "react";
import { useBlip } from "../../hooks/useBlip";

const POKEMON_ID = 25; // national dex number — swap to change the companion
const SPRITE = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${POKEMON_ID}.gif`;

const SIZE = 40;
const WALK_SPEED = 38;
const CHASE_SPEED = 80;
const CLIMB_SPEED = 110;
const FETCH_SPEED = 170;
const GRAVITY = 1000;
const MAX_FALL = 720;
const MAX_CLIMB_MS = 4500;

type Mode = "walk" | "idle" | "fall" | "sleep" | "climb" | "drag";
type Platform = { left: number; right: number; top: number; el: Element | null };
type Wall = { x: number; top: number; bottom: number; face: 1 | -1 }; // face: direction of travel that hits it

// original 8-bit blob, shown only if the sprite fails to load
const FALLBACK_PIXELS = ["..####..", ".######.", "#o####o#", "########", ".######.", ".##..##."];

function fallbackShadow(px: number) {
  const shadows: string[] = [];
  FALLBACK_PIXELS.forEach((row, y) => {
    [...row].forEach((c, x) => {
      if (c === ".") return;
      shadows.push(`${x * px}px ${y * px}px 0 0 ${c === "o" ? "#020403" : "#00ff9f"}`);
    });
  });
  return shadows.join(",");
}

function collectSurfaces(): { platforms: Platform[]; walls: Wall[] } {
  const platforms: Platform[] = [];
  const walls: Wall[] = [];
  const sy = window.scrollY;
  document.querySelectorAll(".term-window, .pixel-shadow, .res-folder, h1, h2, h3, footer").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 70 || r.height < 8) return;
    const top = r.top + sy;
    const bottom = r.bottom + sy;
    platforms.push({ left: r.left + 4, right: r.right - 4, top, el });
    if (r.height > 34) {
      walls.push({ x: r.left, top, bottom, face: 1 });
      walls.push({ x: r.right, top, bottom, face: -1 });
    }
  });
  const doc = document.documentElement;
  platforms.push({ left: 0, right: doc.clientWidth, top: doc.scrollHeight - 12, el: null });
  return { platforms, walls };
}

export function PixelPet() {
  const layerRef = useRef<HTMLDivElement>(null);
  const petRef = useRef<HTMLButtonElement>(null);
  const flipRef = useRef<HTMLSpanElement>(null);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [bubble, setBubble] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  const [carrying, setCarrying] = useState(false);
  const blip = useBlip();

  const stateRef = useRef({
    x: 120,
    y: 0,
    vx: 0,
    vy: 0,
    dir: 1 as 1 | -1,
    mode: "fall" as Mode,
    nextThink: 0,
    offscreenAt: 0,
    greetAt: 0,
    lastInput: 0,
    edgeLatch: false,
    climb: null as { x: number; top: number; dir: 1 | -1 } | null,
    climbStart: 0,
    ground: null as Platform | null,
    // resume-courier errand driven by the ResumeFolder component
    fetch: null as
      | null
      | {
          stage: "toFolder" | "deliver" | "offer";
          x: number;
          y: number;
          until: number;
          startedAt: number;
        },
    // drag bookkeeping
    grabDX: 0,
    grabDY: 0,
    moved: false,
    pressAt: 0,
    pressX: 0,
    pressY: 0,
    lastPX: 0,
    lastPY: 0,
    lastPT: 0,
    dragVX: 0,
    dragVY: 0,
  });

  const showBubble = (text: string, ms: number) => {
    setBubble(text);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    if (ms !== Infinity) bubbleTimer.current = setTimeout(() => setBubble(null), ms);
  };

  // hand over the goods — the ResumeTerminal command panel picks this up
  // and replays the document in-page instead of opening a new tab
  const takeResume = () => {
    const s = stateRef.current;
    s.fetch = null;
    setCarrying(false);
    window.dispatchEvent(new Event("pet:resume-done"));
    window.dispatchEvent(new Event("pet:resume-open"));
    blip("tap");
    showBubble("♥", 1200);
  };

  const hop = () => {
    const s = stateRef.current;
    if (s.fetch?.stage === "offer") {
      takeResume();
      return;
    }
    s.lastInput = performance.now();
    if (s.mode !== "fall" && s.mode !== "drag") {
      s.mode = "fall";
      s.vy = -320;
    }
    blip("tap");
    showBubble("!", 900);
  };

  useEffect(() => {
    const layer = layerRef.current;
    const pet = petRef.current;
    const flip = flipRef.current;
    if (!layer || !pet || !flip) return;

    const s = stateRef.current;
    s.x = window.innerWidth * 0.3;
    s.y = window.scrollY + window.innerHeight * 0.2;
    s.lastInput = performance.now();
    pet.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;

    let surfaces = collectSurfaces();
    const refresh = window.setInterval(() => {
      surfaces = collectSurfaces();
    }, 1200);

    const mouse = { x: 0, y: 0, has: false };
    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX + window.scrollX;
      mouse.y = e.clientY + window.scrollY;
      mouse.has = true;
      s.lastInput = performance.now();
    };
    const onInput = () => {
      s.lastInput = performance.now();
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onInput, { passive: true });
    window.addEventListener("keydown", onInput);
    window.addEventListener("touchstart", onInput, { passive: true });

    // ---- drag & drop (with throw) ----
    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      try {
        pet.setPointerCapture(e.pointerId);
      } catch {
        /* window listeners still track the drag */
      }
      const px = e.clientX + window.scrollX;
      const py = e.clientY + window.scrollY;
      s.mode = "drag";
      s.moved = false;
      s.pressAt = performance.now();
      s.pressX = px;
      s.pressY = py;
      s.grabDX = px - s.x;
      s.grabDY = py - s.y;
      s.lastPX = px;
      s.lastPY = py;
      s.lastPT = performance.now();
      s.dragVX = 0;
      s.dragVY = 0;
      s.climb = null;
      // grabbing the courier before pickup cancels the errand; a carried
      // delivery survives the interruption
      if (s.fetch && s.fetch.stage === "toFolder") {
        s.fetch = null;
        window.dispatchEvent(new Event("pet:resume-done"));
      }
      s.lastInput = performance.now();
      pet.classList.add("pet-drag");
    };
    const onPointerMove = (e: PointerEvent) => {
      if (s.mode !== "drag") return;
      const px = e.clientX + window.scrollX;
      const py = e.clientY + window.scrollY;
      const now = performance.now();
      const dt = Math.max(8, now - s.lastPT) / 1000;
      s.dragVX = (px - s.lastPX) / dt;
      s.dragVY = (py - s.lastPY) / dt;
      s.lastPX = px;
      s.lastPY = py;
      s.lastPT = now;
      s.x = px - s.grabDX;
      s.y = py - s.grabDY;
      s.dir = s.dragVX >= 0 ? 1 : -1;
      if (Math.hypot(px - s.pressX, py - s.pressY) > 6) s.moved = true;
      s.lastInput = now;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (s.mode !== "drag") return;
      try {
        pet.releasePointerCapture(e.pointerId);
      } catch {
        /* capture already gone */
      }
      pet.classList.remove("pet-drag");
      const now = performance.now();
      const quickTap = !s.moved && now - s.pressAt < 350;
      if (quickTap && s.fetch?.stage === "offer") {
        s.mode = "idle";
        s.lastInput = now;
        takeResume();
        return;
      }
      s.mode = "fall";
      if (quickTap) {
        s.vy = -320;
        s.vx = 0;
        blip("tap");
        showBubble("!", 900);
      } else {
        // throw it
        s.vx = Math.max(-460, Math.min(460, s.dragVX * 0.55));
        s.vy = Math.max(-520, Math.min(380, s.dragVY * 0.55));
        blip("hover");
        showBubble("!?", 800);
      }
      s.lastInput = now;
    };
    // capture on the pet, but track move/up on window too so a missed
    // capture (or a pointer that escapes the 40px box) can't strand a drag
    pet.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    const flicker = () => {
      pet.classList.add("pet-glitch");
      window.setTimeout(() => pet.classList.remove("pet-glitch"), 320);
    };
    let glitchTimer = 0;
    const scheduleGlitch = () => {
      glitchTimer = window.setTimeout(() => {
        flicker();
        scheduleGlitch();
      }, 6000 + Math.random() * 9000);
    };
    scheduleGlitch();

    const dust = () => {
      for (let i = 0; i < 4; i++) {
        const p = document.createElement("span");
        p.className = "pet-dust";
        p.style.left = `${s.x + SIZE / 2 + (Math.random() * 16 - 8)}px`;
        p.style.top = `${s.y + SIZE - 4}px`;
        p.style.setProperty("--dx", `${Math.random() * 24 - 12}px`);
        layer.appendChild(p);
        window.setTimeout(() => p.remove(), 550);
      }
    };

    // the object it lands on flinches under the impact
    const thump = (el: Element | null) => {
      if (!el || !(el instanceof HTMLElement)) return;
      try {
        el.animate(
          [
            { transform: "translateY(0)" },
            { transform: "translateY(3px)" },
            { transform: "translateY(-1px)" },
            { transform: "translateY(0)" },
          ],
          { duration: 220, easing: "steps(4)", composite: "add" },
        );
      } catch {
        /* older browsers: skip the nudge */
      }
    };

    // glitch-teleport back to wherever the reader is
    const respawn = () => {
      surfaces = collectSurfaces();
      // nothing to land on in view (e.g. mid-banner scrub) — stay put and retry
      // later instead of raining through the empty viewport on repeat
      const vTop = window.scrollY;
      const hasGround = surfaces.platforms.some(
        (p) => p.top > vTop + SIZE && p.top < vTop + window.innerHeight,
      );
      if (!hasGround) {
        s.offscreenAt = 0;
        return;
      }
      s.x = window.innerWidth * (0.15 + Math.random() * 0.7);
      s.y = window.scrollY - SIZE * 2;
      s.vx = 0;
      s.vy = 0;
      s.mode = "fall";
      s.climb = null;
      s.offscreenAt = 0;
      flicker();
    };

    const onFetch = (e: Event) => {
      const det = (e as CustomEvent<{ x: number; y: number }>).detail;
      if (!det || s.fetch) return;
      const t = performance.now();
      s.fetch = { stage: "toFolder", x: det.x, y: det.y, until: t + 25000, startedAt: t };
      s.lastInput = performance.now();
      if (s.mode === "sleep") s.mode = "idle";
      showBubble("!", 800);
      // offscreen courier? zap in near the reader so the errand starts promptly
      const vTop = window.scrollY;
      const vBot = vTop + window.innerHeight;
      if (s.y + SIZE < vTop - 60 || s.y > vBot + 60) respawn();
    };
    window.addEventListener("pet:fetch-resume", onFetch);

    const support = () =>
      surfaces.platforms.find(
        (p) =>
          Math.abs(p.top - (s.y + SIZE)) < 14 &&
          s.x + SIZE * 0.7 > p.left &&
          s.x + SIZE * 0.3 < p.right,
      );

    const land = (p: Platform, now: number) => {
      s.ground = p;
      s.y = p.top - SIZE;
      s.vy = 0;
      s.mode = "walk";
      s.nextThink = now + 400 + Math.random() * 1200;
      s.edgeLatch = false;
      dust();
      thump(p.el);
    };

    // ground locomotion shared by wandering and errands: walls ahead get
    // climbed or dodged, ledges stepped off or turned from — couriers on an
    // errand always climb and never turn back
    const advanceWalk = (ground: Platform, now: number, dt: number) => {
      const urgent = !!s.fetch;
      const nx = s.x + s.vx * dt;
      const d = s.dir;
      const prevLead = d === 1 ? s.x + SIZE - 6 : s.x + 6;
      const nextLead = d === 1 ? nx + SIZE - 6 : nx + 6;

      let hitWall: Wall | undefined;
      for (const w of surfaces.walls) {
        if (w.face !== d) continue;
        const crossed =
          d === 1 ? prevLead <= w.x && nextLead >= w.x : prevLead >= w.x && nextLead <= w.x;
        if (!crossed) continue;
        const feet = s.y + SIZE;
        if (feet > w.top + 12 && feet < w.bottom + 24 && w.top < feet - 20) {
          hitWall = w;
          break;
        }
      }

      if (hitWall) {
        if (urgent || Math.random() < 0.6) {
          s.mode = "climb";
          s.climb = { x: hitWall.x, top: hitWall.top, dir: d };
          s.climbStart = now;
          s.vx = 0;
        } else {
          s.dir = (d * -1) as 1 | -1;
          s.vx = s.dir * Math.abs(s.vx);
        }
      } else {
        const center = nx + SIZE / 2;
        const beyondEdge = center < ground.left || center > ground.right;
        const onFloor = ground.top >= document.documentElement.scrollHeight - 40;
        if (beyondEdge && !s.edgeLatch) {
          s.edgeLatch = true;
          // sometimes turn back, sometimes step off the ledge
          if (onFloor || (!urgent && Math.random() < 0.55)) {
            s.dir = (s.dir * -1) as 1 | -1;
            s.vx = s.dir * Math.abs(s.vx);
          }
        }
        if (!beyondEdge) s.edgeLatch = false;
        s.x = nx;
      }
    };

    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      try {
        step(now);
      } catch {
        /* never let one bad frame kill the loop */
      }
      raf = requestAnimationFrame(tick);
    };

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const vTop = window.scrollY;
      const vBot = vTop + window.innerHeight;
      const visible = s.y + SIZE > vTop - 60 && s.y < vBot + 60;
      if (visible || s.mode === "drag") s.offscreenAt = 0;
      else if (!s.offscreenAt) s.offscreenAt = now;
      else if (now - s.offscreenAt > 1300) respawn();

      if (s.fetch) {
        const f = s.fetch;
        if (now > f.until) {
          // errand expired — give up gracefully
          setBubble(null);
          s.fetch = null;
          setCarrying(false);
          window.dispatchEvent(new Event("pet:resume-done"));
        } else if (f.stage === "toFolder") {
          // grab is proximity-based (works mid-air too, e.g. falling past it)
          const dx = f.x - (s.x + SIZE / 2);
          const dy = f.y - (s.y + SIZE / 2);
          if (Math.abs(dx) < 44 && Math.abs(dy) < 240) {
            f.stage = "deliver";
            setCarrying(true);
            window.dispatchEvent(new Event("pet:resume-picked"));
            showBubble("!", 700);
            if (s.mode === "walk" || s.mode === "idle") {
              s.mode = "fall";
              s.vy = -260; // triumphant grab-hop
            }
          } else if (now - f.startedAt > 8000 && s.mode !== "drag") {
            // no navigable path — glitch-warp beside the folder, like a respawn
            flicker();
            s.x = f.x - SIZE / 2;
            s.y = f.y - SIZE - 70;
            s.vx = 0;
            s.vy = 0;
            s.climb = null;
            s.mode = "fall";
            f.startedAt = now;
          }
        }
      }

      if (s.mode === "drag") {
        // position follows the pointer; just dangle
      } else if (s.mode === "fall") {
        s.vy = Math.min(MAX_FALL, s.vy + GRAVITY * dt);
        const ny = s.y + s.vy * dt;
        let landing: Platform | undefined;
        if (s.vy > 0) {
          const prevBottom = s.y + SIZE;
          const nextBottom = ny + SIZE;
          for (const p of surfaces.platforms) {
            if (
              p.top >= prevBottom - 2 &&
              p.top <= nextBottom &&
              s.x + SIZE * 0.7 > p.left &&
              s.x + SIZE * 0.3 < p.right &&
              (!landing || p.top < landing.top)
            ) {
              landing = p;
            }
          }
        }
        if (landing) {
          land(landing, now);
        } else {
          s.y = ny;
        }
        s.x += s.vx * dt;
        s.vx *= 1 - Math.min(1, 1.6 * dt); // air drag so throws settle
      } else if (s.mode === "climb" && s.climb) {
        s.y -= CLIMB_SPEED * dt;
        s.x = s.climb.dir === 1 ? s.climb.x - SIZE + 8 : s.climb.x - 8;
        s.dir = s.climb.dir;
        if (s.y + SIZE <= s.climb.top + 2) {
          // reached the top — hop onto the surface
          s.y = s.climb.top - SIZE;
          s.x += s.climb.dir * (SIZE * 0.5);
          s.climb = null;
          s.mode = "walk";
          s.ground = null; // re-acquire under the new position
          s.nextThink = now + 600 + Math.random() * 1400;
          dust();
        } else if (now - s.climbStart > MAX_CLIMB_MS) {
          // too tall — give up and drop
          s.climb = null;
          s.mode = "fall";
          s.vy = -80;
          showBubble("...", 900);
        }
      } else if (s.mode === "sleep") {
        if (now - s.lastInput < 500) {
          s.mode = "idle";
          s.nextThink = now + 600;
          setBubble(null);
        }
      } else {
        // ride the held platform by identity, re-reading its live rect every
        // frame — cached snapshots lag up to 1.2s, which makes the pet drift
        // against pinned (sticky) surfaces that move in document space
        let ground = s.ground;
        if (ground?.el) {
          const el = ground.el;
          if (!el.isConnected) {
            ground = null;
          } else {
            const r = el.getBoundingClientRect();
            if (r.width < 70 || r.height < 8) {
              ground = null;
            } else {
              ground.left = r.left + 4;
              ground.right = r.right - 4;
              ground.top = r.top + window.scrollY;
            }
          }
        }
        if (ground && (s.x + SIZE * 0.7 <= ground.left || s.x + SIZE * 0.3 >= ground.right)) {
          ground = null; // walked off the span
        }
        if (!ground) ground = support() ?? null;
        s.ground = ground;
        if (!ground) {
          s.mode = "fall";
          s.vy = 0;
        } else {
          s.y = ground.top - SIZE; // ride along if the card moves

          if (s.fetch) {
            const f = s.fetch;
            s.lastInput = now; // errands don't nap
            let targetX = f.stage === "toFolder" ? f.x : window.scrollX + window.innerWidth / 2;
            if (f.stage === "toFolder" && f.y - (s.y + SIZE / 2) > 240) {
              // folder is below this platform — dropping in place just re-lands
              // here, so sprint for the nearest ledge and run off it
              const center = s.x + SIZE / 2;
              targetX =
                center - ground.left < ground.right - center
                  ? ground.left - SIZE
                  : ground.right + SIZE;
            }
            const dx = targetX - (s.x + SIZE / 2);

            if (f.stage === "offer") {
              s.vx = 0;
              s.mode = "idle";
            } else if (Math.abs(dx) > 26) {
              s.dir = dx > 0 ? 1 : -1;
              s.vx = s.dir * FETCH_SPEED;
              s.mode = "walk";
              if (Math.random() < dt * 5) dust(); // sprinting kicks up dust
            } else if (f.stage === "toFolder") {
              const dy = f.y - (s.y + SIZE / 2);
              s.vx = 0;
              if (dy < -40) {
                s.mode = "fall";
                s.vy = -340; // folder above — jump for it
              }
            } else {
              // deliver: at the reader's spot — present the goods
              const vTop2 = window.scrollY;
              s.vx = 0;
              if (s.y > vTop2 && s.y + SIZE < vTop2 + window.innerHeight) {
                f.stage = "offer";
                s.mode = "idle";
                showBubble("resume.pdf ▶ take it!", Infinity);
              }
            }

            if (s.mode === "walk" && s.vx !== 0) advanceWalk(ground, now, dt);
          } else if (now - s.lastInput > 20000) {
            s.mode = "sleep";
            s.vx = 0;
            showBubble("Zzz", Infinity);
          } else {
            // cursor curiosity
            const cx = s.x + SIZE / 2;
            let chasing = false;
            if (mouse.has && Math.abs(mouse.y - (s.y + SIZE / 2)) < 130) {
              const dx = mouse.x - cx;
              if (Math.abs(dx) < 200 && Math.abs(dx) > 26) {
                s.dir = dx > 0 ? 1 : -1;
                s.vx = s.dir * CHASE_SPEED;
                s.mode = "walk";
                chasing = true;
              } else if (Math.abs(dx) <= 26) {
                s.vx = 0;
                chasing = true;
                if (now > s.greetAt) {
                  s.greetAt = now + 6000;
                  showBubble("♥", 1300);
                  s.mode = "fall";
                  s.vy = -240;
                }
              }
            }

            if (!chasing) {
              if (now >= s.nextThink) {
                const roll = Math.random();
                if (roll < 0.3) {
                  s.mode = "idle";
                  s.vx = 0;
                  if (roll < 0.08) showBubble(["?", "...", "♪"][Math.floor(Math.random() * 3)], 1100);
                } else if (roll < 0.38) {
                  s.mode = "fall";
                  s.vy = -260; // spontaneous hop
                } else {
                  s.mode = "walk";
                  s.dir = roll < 0.69 ? 1 : -1;
                  s.vx = s.dir * WALK_SPEED;
                }
                s.nextThink = now + 1200 + Math.random() * 2600;
              }
              if (s.mode === "idle") s.vx = 0;
            }

            if (s.mode === "walk" && s.vx !== 0) advanceWalk(ground, now, dt);
          }
        }
      }

      const maxX = window.innerWidth - SIZE - 4;
      if (s.mode !== "climb") {
        if (s.x < 4) {
          s.x = 4;
          s.dir = 1;
          s.vx = Math.abs(s.vx);
        } else if (s.x > maxX) {
          s.x = maxX;
          s.dir = -1;
          s.vx = -Math.abs(s.vx);
        }
      }

      pet.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      let flipT = s.dir === 1 ? "scaleX(-1)" : "scaleX(1)";
      if (s.mode === "climb") {
        flipT += ` rotate(${s.dir === 1 ? -90 : 90}deg)`;
      } else if (s.mode === "drag") {
        flipT += ` rotate(${Math.sin(now / 90) * 10}deg)`;
      }
      flip.style.transform = flipT;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(refresh);
      window.clearTimeout(glitchTimer);
      window.removeEventListener("pet:fetch-resume", onFetch);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onInput);
      window.removeEventListener("keydown", onInput);
      window.removeEventListener("touchstart", onInput);
      pet.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={layerRef} className="pet-layer">
      <button
        ref={petRef}
        className={`pixel-pet${carrying ? " pet-carrying" : ""}`}
        aria-label="Pixel companion"
        data-cursor-hover
        onClick={(e) => {
          // pointer events handle mouse/touch; this catches keyboard activation only
          if (e.detail === 0) hop();
        }}
      >
        {bubble && <span className="pet-bubble">{bubble}</span>}
        {carrying && <span className="pet-paper" />}
        <span ref={flipRef} className="pet-flip">
          {broken ? (
            <span
              className="pet-fallback"
              style={{ boxShadow: fallbackShadow(4), width: 4, height: 4 }}
            />
          ) : (
            <img src={SPRITE} alt="" draggable={false} onError={() => setBroken(true)} />
          )}
        </span>
      </button>
    </div>
  );
}
