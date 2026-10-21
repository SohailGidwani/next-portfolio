// The pen plotter's drawings (see PenPlotter.tsx), in the order it draws them.
// Each is SVG path data in a 400 x 300 box; every "M" starts a new stroke,
// where the plotter lifts the pen and travels without ink.

export type Drawing = { id: string; caption: string; d: string }

const circle = (cx: number, cy: number, r: number) =>
  `M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy}`

export const DRAWINGS: Drawing[] = [
  {
    id: "brain",
    caption: "MEMOIR-VLM · brain MRI research",
    d: [
      // Outline: brain stem up, round the cerebellum and the back, over the top, down the front, under the temporal lobe.
      "M 236 292 C 234 276 234 262 236 248",
      "C 254 262 290 262 304 244 C 324 240 338 218 328 198",
      "C 350 176 346 128 314 112 C 304 82 264 66 234 76",
      "C 214 56 172 58 158 78 C 128 66 94 80 90 106",
      "C 64 114 56 150 70 170 C 58 194 76 218 102 218",
      "C 112 236 142 242 160 230 C 172 248 204 252 220 240 C 226 244 232 246 236 248",
      // The fissure along the side and the central fold from the top.
      "M 128 200 C 160 188 198 186 230 196",
      "M 196 190 C 206 176 216 168 232 164",
      "M 222 80 C 212 102 228 122 216 142 C 208 158 218 170 214 184",
      // Smaller folds.
      "M 112 106 C 126 118 146 114 152 100",
      "M 86 144 C 102 140 116 150 114 166",
      "M 132 154 C 144 142 162 144 168 160 C 174 146 190 144 198 156",
      "M 248 104 C 256 122 272 128 288 120",
      "M 248 150 C 264 140 284 146 292 162",
      "M 304 182 C 290 188 284 202 292 214",
      "M 152 218 C 172 212 194 214 208 224",
      // Cerebellum.
      "M 252 250 C 268 254 286 252 298 244 M 256 240 C 272 242 288 240 300 232",
    ].join(" "),
  },
  {
    id: "coffee",
    caption: "Coffee",
    d: [
      "M 120 140 C 140 128 260 128 280 140 C 260 152 140 152 120 140",
      "C 122 200 150 240 200 240 C 250 240 278 200 280 140",
      "M 279 160 C 314 156 320 198 268 208",
      "M 84 250 C 120 236 280 236 316 250 C 280 266 120 266 84 250",
      "M 172 118 C 160 98 186 88 174 64 M 206 116 C 194 94 222 84 210 52 M 240 118 C 228 98 254 88 242 66",
    ].join(" "),
  },
  {
    id: "glasses",
    caption: "Footnote · smart glasses",
    d: [
      "M 16 126 L 62 118",
      "C 62 106 70 102 84 102 L 156 102 C 172 102 180 108 180 122 L 178 162 C 176 184 160 194 140 194 L 104 194 C 78 194 64 182 62 160 L 62 118",
      "M 180 126 C 190 112 210 112 220 126",
      "M 220 122 C 220 108 228 102 244 102 L 316 102 C 330 102 338 106 338 118 L 336 160 C 334 182 320 194 296 194 L 260 194 C 240 194 224 184 222 162 L 220 122",
      "M 338 118 L 384 126",
      // The display, with a line of text on it.
      "M 258 134 L 316 134 L 316 160 L 258 160 Z",
      "M 266 147 C 274 140 280 154 288 147 C 296 140 302 154 308 147",
      "M 90 122 L 104 112 M 96 132 L 116 118",
    ].join(" "),
  },
  {
    id: "pier",
    caption: "Santa Monica Pier",
    d: (() => {
      const cx = 200, cy = 128, r = 96, parts = [circle(cx, cy, r), circle(cx, cy, 10)]
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        parts.push(`M ${cx + Math.cos(a) * 10} ${cy + Math.sin(a) * 10} L ${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}`)
      }
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r
        parts.push(`M ${x - 7} ${y} L ${x - 7} ${y + 12} L ${x + 7} ${y + 12} L ${x + 7} ${y}`)
      }
      parts.push("M 196 138 L 150 252 M 204 138 L 250 252")
      parts.push("M 30 252 L 370 252 M 30 262 L 370 262")
      for (let x = 50; x <= 350; x += 50) parts.push(`M ${x} 262 L ${x} 290`)
      parts.push("M 20 290 C 60 282 100 298 140 290 C 180 282 220 298 260 290 C 300 282 340 298 380 290")
      return parts.join(" ")
    })(),
  },
  {
    id: "notes",
    caption: "Knowledge Hub · searching my notes",
    d: [
      "M 132 74 L 132 60 L 292 60 L 292 238 L 278 238",
      "M 116 88 L 116 74 L 278 74 L 278 252 L 262 252",
      "M 100 88 L 232 88 L 262 118 L 262 268 L 100 268 Z",
      "M 232 88 L 232 118 L 262 118",
      "M 120 140 L 240 140 M 120 162 L 240 162 M 120 184 L 206 184 M 120 206 L 228 206 M 120 228 L 186 228",
      circle(262, 214, 34),
      "M 286 238 L 318 272",
    ].join(" "),
  },
  {
    id: "controller",
    caption: "Games",
    d: [
      "M 120 112 C 160 100 240 100 280 112 C 322 120 346 168 354 222 C 360 262 330 272 312 250 C 300 234 290 216 270 210 L 130 210 C 110 216 100 234 88 250 C 70 272 40 262 46 222 C 54 168 78 120 120 112 Z",
      "M 108 150 L 120 150 L 120 138 L 134 138 L 134 150 L 146 150 L 146 164 L 134 164 L 134 176 L 120 176 L 120 164 L 108 164 Z",
      circle(272, 138, 7), circle(288, 156, 7), circle(272, 174, 7), circle(256, 156, 7),
      circle(166, 186, 14), circle(234, 186, 14),
      "M 186 136 L 196 136 M 204 136 L 214 136",
    ].join(" "),
  },
  {
    id: "swim",
    caption: "Swimming",
    d: [
      // Front crawl, side on: head turned to breathe, the near arm in recovery with the elbow high.
      "M 14 204 C 44 190 74 190 104 204 C 118 211 132 213 146 210",
      "M 196 212 C 214 216 230 216 244 212",
      "M 282 206 C 314 192 344 192 386 204",
      circle(170, 202, 22),
      "M 150 194 C 160 187 176 187 188 194",
      "M 184 192 C 190 188 198 190 198 196 C 196 202 188 202 184 198",
      // The arm: up to the elbow, forearm hanging down to the hand entering the water.
      "M 198 206 C 212 186 230 164 246 146 C 252 140 260 140 264 146 C 276 164 288 182 296 198",
      "M 208 212 C 222 194 238 174 252 160 C 262 176 272 190 280 206",
      "M 296 198 C 300 204 304 208 300 212 C 294 214 286 210 280 206",
      "M 306 196 L 316 186 M 286 216 L 280 228 M 318 208 L 330 204",
      "M 40 240 C 80 228 120 228 160 240 C 200 252 240 252 280 240 C 312 232 342 232 368 238",
    ].join(" "),
  },
  {
    id: "palms",
    caption: "Los Angeles",
    d: [
      "M 130 214 A 74 74 0 0 1 278 214",
      "M 24 214 L 376 214",
      "M 70 234 L 180 234 M 220 234 L 340 234 M 120 254 L 290 254",
      "M 300 214 C 306 160 298 110 274 66",
      "M 274 66 C 252 52 222 56 204 76 M 274 66 C 256 42 234 34 214 36 M 274 66 C 282 38 304 30 324 36 M 274 66 C 298 56 324 64 340 84 M 274 66 C 268 82 254 98 250 118",
      "M 102 214 C 98 176 104 146 122 116",
      "M 122 116 C 106 104 84 106 70 120 M 122 116 C 110 96 92 90 76 92 M 122 116 C 130 96 146 90 162 94 M 122 116 C 140 110 158 118 166 134",
    ].join(" "),
  },
]
