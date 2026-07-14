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

MIT License — Copyright (c) 2026 [ABsUP](https://github.com/ABsUPs)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
