# ABxSPEED

Browser-based network speed test — measure download, upload, and ping with zero dependencies.

**Live:** [abspeed.pages.dev](https://abspeed.pages.dev)  
**Author:** [ABsUP](https://github.com/ABsUPs)

---

## Features

- **Download Speed Test** — Adaptive 1MB–100MB streaming from Cloudflare CDN
- **Upload Speed Test** — Adaptive 1MB–10MB via httpbin.org
- **Ping Test** — 10-iteration HTTP ping with min/avg/jitter stats
- **Live Speedometer** — Animated SVG gauge with 6 speed tiers
- **Scoring System** — Score out of 100 for each metric + overall
- **Connection Detection** — WiFi / Mobile Data auto-detection
- **Mobile Data Warning** — Data usage consent popup
- **Test History** — localStorage persistence, export to JSON
- **Dark/Light Theme** — Cyberpunk dark default with toggle
- **Responsive** — Works on desktop, tablet, and mobile
- **Share Results** — Copy to clipboard, Twitter, WhatsApp
- **Zero Dependencies** — Single HTML file, vanilla JS only

## Usage

Open `index.html` in any modern browser. No server or build step required.

## Tech Stack

- HTML5 + CSS3 + Vanilla JavaScript (ES2023+)
- Fetch API + Streams API for accurate measurements
- SVG gauge with requestAnimationFrame animation
- localStorage for history persistence

## License

MIT
