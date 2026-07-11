// Pixel-art holograms drawn with box-shadows (same trick as the PixelPet
// fallback), tinted cyan like a projection. Each sprite has two frames that
// the CSS toggles for a tiny idle animation; every third row renders dimmer
// to fake holo scanlines without an overlay.
export type HologramKind = "bb8" | "tourist" | "shawarma";

const PX = 6;

const COLORS: Record<string, string> = {
  a: "#7ee7f7", // antennae / steam
  H: "#baf7ff", // rim highlight
  b: "#00cfe8", // body
  r: "#8af2ff", // detail lines
  s: "#0b7f9e", // shadow edge
  e: "#063845", // eyes / lens
};

// BB-8: frame B wobbles the head one pixel right, like it's looking around
const BB8_A = [
  "........a.........",
  "........a.a.......",
  "........a.a.......",
  "......HHHHHH......",
  ".....HbbbbbbH.....",
  "....Hbbeebbbbr....",
  "....sbbeebbbbbs...",
  ".....sbbbbbbbs....",
  "......sssssss.....",
  "....HHHHHHHHHH....",
  "...HbbrrrrrrbbH...",
  "..HbbrbbbbbbrbbH..",
  ".HbbrbbbbbbbbrbbH.",
  ".Hbbrbbb..bbbrbbH.",
  "Hbbrbbb.ss.bbbrbbH",
  "Hbbrbbb.ss.bbbrbbH",
  ".Hbbrbbb..bbbrbbH.",
  ".HbbrbbbbbbbbrbbH.",
  "..HbbrbbbbbbrbbH..",
  "...HbbrrrrrrbbH...",
  "....ssssssssss....",
  "......sssssss.....",
];
const BB8_B = [
  ".........a........",
  ".........a.a......",
  ".........a.a......",
  ".......HHHHHH.....",
  "......HbbbbbbH....",
  ".....Hbbeebbbbr...",
  ".....sbbeebbbbbs..",
  "......sbbbbbbbs...",
  ".......sssssss....",
  "....HHHHHHHHHH....",
  "...HbbrrrrrrbbH...",
  "..HbbrbbbbbbrbbH..",
  ".HbbrbbbbbbbbrbbH.",
  ".Hbbrbbb..bbbrbbH.",
  "Hbbrbbb.ss.bbbrbbH",
  "Hbbrbbb.ss.bbbrbbH",
  ".Hbbrbbb..bbbrbbH.",
  ".HbbrbbbbbbbbrbbH.",
  "..HbbrbbbbbbrbbH..",
  "...HbbrrrrrrbbH...",
  "....ssssssssss....",
  "......sssssss.....",
];

// Tourist: sun hat, backpack, camera in hand — two-pose walk cycle
const TOURIST_A = [
  "....HHHHH.....",
  "..HHHHHHHHH...",
  "....bbbbb.....",
  "....beebb.....",
  "....bbbbb.....",
  ".....bbb......",
  "...rrrrrrr....",
  "..srrrrrrrs...",
  ".ssrrrrrrrbb..",
  ".ssrrrrrrrbe..",
  ".ssrrrrrrr....",
  "...bbbbbbb....",
  "...bbb.bbb....",
  "...bb...bb....",
  "..bb.....bb...",
  "..bb.....bb...",
  ".ss.......ss..",
];
const TOURIST_B = [
  "....HHHHH.....",
  "..HHHHHHHHH...",
  "....bbbbb.....",
  "....beebb.....",
  "....bbbbb.....",
  ".....bbb......",
  "...rrrrrrr....",
  "..srrrrrrrs...",
  ".ssrrrrrrrb...",
  ".ssrrrrrrrbbe.",
  ".ssrrrrrrr....",
  "...bbbbbbb....",
  "...bbb.bbb....",
  "....bb.bb.....",
  "....bb.bb.....",
  "....bbbb......",
  "....ssss......",
];

// Shawarma: happy wrap with steam — frame B drifts the steam and squints
const SHAWARMA_A = [
  "...a....a.....",
  "..a....a......",
  "...a....a.....",
  "..............",
  "..HHHHHHHHHH..",
  ".HrrbrrbrrbbH.",
  ".HbbbbbbbbbbH.",
  "..bbbbbbbbbb..",
  "..beebbbbeeb..",
  "..bbbbbbbbbb..",
  "..bbs....sbb..",
  "...bbssssbb...",
  "...bbbbbbbb...",
  "...rbbbbbbr...",
  "....bbbbbb....",
  "....rbbbbr....",
  ".....bbbb.....",
  ".....ssss.....",
];
const SHAWARMA_B = [
  "..a....a......",
  "...a....a.....",
  "..a....a......",
  "..............",
  "..HHHHHHHHHH..",
  ".HrrbrrbrrbbH.",
  ".HbbbbbbbbbbH.",
  "..bbbbbbbbbb..",
  "..bssbbbbssb..",
  "..bbbbbbbbbb..",
  "..bbs....sbb..",
  "...bbssssbb...",
  "...bbbbbbbb...",
  "...rbbbbbbr...",
  "....bbbbbb....",
  "....rbbbbr....",
  ".....bbbb.....",
  ".....ssss.....",
];

function buildShadow(pixels: string[]) {
  const shadows: string[] = [];
  pixels.forEach((row, y) => {
    const dim = y % 3 === 2 ? "66" : "";
    [...row].forEach((c, x) => {
      const color = COLORS[c];
      if (color) shadows.push(`${x * PX}px ${y * PX}px 0 0 ${color}${dim}`);
    });
  });
  return shadows.join(",");
}

const SPRITES: Record<HologramKind, { shadows: [string, string]; cols: number; rows: number }> = {
  bb8: { shadows: [buildShadow(BB8_A), buildShadow(BB8_B)], cols: 18, rows: 22 },
  tourist: { shadows: [buildShadow(TOURIST_A), buildShadow(TOURIST_B)], cols: 14, rows: 17 },
  shawarma: { shadows: [buildShadow(SHAWARMA_A), buildShadow(SHAWARMA_B)], cols: 14, rows: 18 },
};

export function Hologram({ kind }: { kind: HologramKind }) {
  const { shadows, cols, rows } = SPRITES[kind];
  const frameStyle = {
    width: PX,
    height: PX,
    marginLeft: (-cols * PX) / 2,
  };
  return (
    <span
      className="holo"
      style={{ width: cols * PX + 24, height: rows * PX + 48 }}
      aria-hidden
    >
      <span className="holo-beam" />
      <span className="holo-base" />
      <span className="holo-frame holo-frame-a" style={{ ...frameStyle, boxShadow: shadows[0] }} />
      <span className="holo-frame holo-frame-b" style={{ ...frameStyle, boxShadow: shadows[1] }} />
    </span>
  );
}
