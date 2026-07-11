// Shared tetromino rain simulation: pieces fall and stack until the grid is
// completely covered. Used by the full-page transition and the form build-in.

export const TETRIS_COLORS = ["#00ff9f", "#00e5ff", "#ff2975", "#ffe14d"];

const SHAPES: [number, number][][] = [
  [[0, 0], [1, 0], [2, 0], [3, 0]], // I
  [[0, 0], [0, 1], [0, 2], [0, 3]], // I vertical
  [[0, 0], [1, 0], [0, 1], [1, 1]], // O
  [[0, 0], [1, 0], [2, 0], [1, 1]], // T
  [[1, 0], [0, 1], [1, 1], [2, 1]], // T down
  [[0, 0], [0, 1], [0, 2], [1, 2]], // L
  [[1, 0], [1, 1], [1, 2], [0, 2]], // J
  [[1, 0], [2, 0], [0, 1], [1, 1]], // S
  [[0, 0], [1, 0], [1, 1], [2, 1]], // Z
];

type Piece = {
  cells: [number, number][];
  col: number;
  y: number;
  v: number;
  color: string;
  dead?: boolean;
};

function drawCell(
  ctx: CanvasRenderingContext2D,
  c: number,
  r: number,
  cell: number,
  color: string,
) {
  const x = c * cell;
  const y = r * cell;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, cell, cell);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(x + 3, y + 3, cell - 6, 3);
  ctx.strokeStyle = "#020403";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, cell - 2, cell - 2);
}

export function createTetrisSim(cols: number, rows: number, speed = 1) {
  const settled: (string | null)[][] = Array.from({ length: rows }, () =>
    new Array<string | null>(cols).fill(null),
  );
  // per column: how many rows are covered, counted from the bottom edge
  const heights = new Array<number>(cols).fill(0);
  let pieces: Piece[] = [];

  const spawn = () => {
    const cells = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const width = Math.max(...cells.map(([dx]) => dx)) + 1;
    pieces.push({
      cells,
      col: Math.floor(Math.random() * (cols - width + 1)),
      y: -5 - Math.random() * 8,
      v: (26 + Math.random() * 22) * speed,
      color: TETRIS_COLORS[Math.floor(Math.random() * TETRIS_COLORS.length)],
    });
  };

  return {
    update(dt: number) {
      for (let i = 0; i < 3 && pieces.length < 16; i++) spawn();

      for (const p of pieces) {
        p.y += p.v * dt;
        // lowest cell of the piece per occupied column
        const bottoms = new Map<number, number>();
        for (const [dx, dy] of p.cells) {
          bottoms.set(dx, Math.max(bottoms.get(dx) ?? -1, dy));
        }
        let landY = Infinity;
        for (const [dx, bottomDy] of bottoms) {
          const stackTop = rows - heights[p.col + dx];
          landY = Math.min(landY, stackTop - 1 - bottomDy);
        }
        if (p.y >= landY) {
          for (const [dx, dy] of p.cells) {
            const r = landY + dy;
            const c = p.col + dx;
            if (r >= 0 && r < rows) {
              settled[r][c] = p.color;
              heights[c] = Math.max(heights[c], rows - r);
            }
          }
          p.dead = true;
        }
      }
      pieces = pieces.filter((p) => !p.dead);
    },

    filled: () => heights.every((h) => h >= rows),

    plugHoles() {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!settled[r][c]) settled[r][c] = TETRIS_COLORS[(r + c) % TETRIS_COLORS.length];
        }
      }
      heights.fill(rows);
      pieces = [];
    },

    draw(ctx: CanvasRenderingContext2D, cell: number) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const color = settled[r][c];
          if (color) drawCell(ctx, c, r, cell, color);
        }
      }
      for (const p of pieces) {
        const baseRow = Math.floor(p.y);
        for (const [dx, dy] of p.cells) drawCell(ctx, p.col + dx, baseRow + dy, cell, p.color);
      }
    },
  };
}
