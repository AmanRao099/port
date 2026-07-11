import { useEffect, useRef } from "react";

const SRC = "/images/holo-gundam.jpg";

// Crop window (fractions of the source) trimming the outer starfield and
// most of the caption while keeping the full model, wings and funnels.
const CROP = { left: 0.03, top: 0.06, right: 0.97, bottom: 0.92 };

// Full-screen hologram projection: the source art is cleaned up at runtime —
// night-sky background keyed out, caption lettering erased, star specks
// dropped — then tinted holo-cyan by CSS and given thruster flames.
// Keep this outside any transformed ancestor: position:fixed resolves
// against transformed/perspective containers.
export function GundamHologram({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const W = img.naturalWidth;
      const H = img.naturalHeight;
      const sx = Math.round(W * CROP.left);
      const sy = Math.round(H * CROP.top);
      const w = Math.round(W * (CROP.right - CROP.left));
      const h = Math.round(H * (CROP.bottom - CROP.top));
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);

      const image = ctx.getImageData(0, 0, w, h);
      const d = image.data;
      const alpha = new Uint8Array(w * h);

      for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        const x = (p % w) / w;
        const y = Math.floor(p / w) / h;
        let keep = true;
        if (b > r + 10 && b > g + 10) {
          keep = false; // night sky & nebula smoke: blue/purple dominant
        } else if (luma < 34) {
          keep = false; // near-black adds nothing under screen blending
        } else if (y > 0.83) {
          // caption band: keep only the strip where the trailing leg passes,
          // and erase the warm-white lettering that hugs it
          if (x < 0.36 || x > 0.57) keep = false;
          else if (r > g && luma > 130) keep = false;
        }
        alpha[p] = keep ? 1 : 0;
      }

      // drop isolated bright specks (stars, stray sparks)
      for (let p = 0; p < alpha.length; p++) {
        if (!alpha[p]) continue;
        const i = p * 4;
        const luma = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        if (luma <= 140) continue;
        const px = p % w;
        const py = Math.floor(p / w);
        let neighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const nx = px + dx;
            const ny = py + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h && alpha[ny * w + nx]) neighbors++;
          }
        }
        if (neighbors <= 2) alpha[p] = 0;
      }

      for (let p = 0; p < alpha.length; p++) {
        if (!alpha[p]) d[p * 4 + 3] = 0;
      }
      ctx.putImageData(image, 0, 0);
    };
    img.src = SRC;

    return () => {
      img.onload = null;
    };
  }, []);

  return (
    <div className={`gholo ${active ? "gholo-on" : ""}`} aria-hidden>
      <span className="gholo-beam" />
      <span className="gholo-flight">
        <span className="gholo-model">
          <canvas ref={canvasRef} className="gholo-img" />
          <span className="gholo-thruster" style={{ left: "45%", top: "94%" }} />
          <span className="gholo-thruster gholo-thruster-alt" style={{ left: "61%", top: "70%" }} />
        </span>
      </span>
      <span className="gholo-band" />
      <span className="gholo-scan" />
    </div>
  );
}
