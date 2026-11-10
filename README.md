# Sector Am2r // Dynamic Enterprise Diagnostics & Walkthrough Hub

An industry-standard personal gaming terminal and tactical walkthrough repository overhaul. Powered by a **dynamic PHP environment** backed by an extensible **XML database**, wrapped in a solid, matte-finish **Enterprise Dashboard aesthetic** with a deep navy and warm coral color palette, dynamic **AJAX single-page guide streaming**, synthetic **Web Audio API acoustic feedback**, and an **Interactive System Diagnostics suite (3-Game HTML5 Canvas Array)**.

---

## Solid Matte Enterprise Design System

* **Opaque Matte Finish**: Panels solidified to `background: rgba(15, 23, 42, 0.85)` (Deep Navy) with a tightened `backdrop-filter: blur(4px)` and a crisp `1px solid rgba(255, 106, 85, 0.15)` border.
* **Blurred Mesh Background & Parallax**: Deep cosmic navy (`#0f172a`) blended with glowing warm coral (`#501a1a` and `#ff6a55`). Attached to an active JS mouse-tracking script that smoothly lerps and shifts the gradient positions via `--parallax-x` and `--parallax-y`.
* **Crisp Typography & Accents**: Primary action buttons and badges in glowing warm coral (`#ff6a55`), secondary cues in slate (`#94a3b8`), and soft-white typography (`Inter` / geometric sans-serif).

---

##  Synthetic Web Audio API Acoustic Feedback

* **Zero external audio files**: All acoustic sound effects are computed and synthesized purely through JavaScript math and the Web Audio API.
* **Sine Wave Hover-Beeps**: Frequency sweep from 880Hz to 1046Hz over a 35ms envelope for a crisp, futuristic interface ping.
* **Square Wave Click-Thuds**: Low-frequency 160Hz-to-42Hz square wave routed through a resonant lowpass biquad filter for a solid tactile mechanical punch.
* **Audio Toggle Control**: Live mute/unmute button in the top header (`🔊 Acoustic Feedback: ON / OFF`) with persistent state in `localStorage` (`sector_am2r_audio_enabled`).
* **Game Sound Effects**: Synthetic laser chirps, data node ingestion pulses, and deep explosive rumbling thuds triggered during diagnostics.

---

##  Backend Architecture (PHP & XML) & AJAX Routing

* **Data Layer (`data/database.xml`)**: Structured XML database holding comprehensive records for:
  1. **Resident Evil Requiem** (`re-requiem`)
  2. **Project AM2R: Sub-Terra** (`am2r`)
  3. **The Witcher 3: Wild Hunt** (`witcher3`)
  * Includes detailed nodes for `<title>`, `<subtitle>`, `<summary>`, `<walkthrough>` (with steps and classified spoiler datapads), `<snapshots>`, `<map>` (with coordinates & hover tooltips), `<characters>`, `<calibration>` (hardware RTX 3050 & audio boAt Rockerz tables), and `<lore>`.
* **Dynamic Hub (`index.php`)**: Ingests `data/database.xml` using PHP's native `simplexml_load_file()` engine to dynamically render responsive 3-column game cards.
* **AJAX / Fetch API Interceptor (`js/app.js` & `get_game.php`)**:
  * Clicking any game card intercepts the request and dynamically streams `get_game.php?id=<id>` into `<div id="dynamic-content">` without a full page reload.
  * Displays an animated scanning skeleton while retrieving telemetry.
  * Smooth-scrolls to the guide component and provides a top and bottom collapse button (`Close Guide // Return to Hub`).
  * Manages browser history via `history.pushState` and handles `popstate` back/forward button traversal.
* **Direct Route Fallback (`game.php`)**: Also supports standalone URL access (`game.php?id=...`) for progressive enhancement.

---

##  Interactive System Diagnostics (3-Game Suite)

Located on `index.php` is a responsive 3-game grid (`grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`) rendering three simultaneous HTML5 `<canvas>` diagnostic tools:

### Game 1: Telemetry Calibration (Orbital Vector Sim)
* **Canvas**: `<canvas id="canvas-void-drift">`
* **Controls**: `W` (Thrust), `A` / `D` (Steer), `S` (Brake), `SPACE` (Pulse Laser).
* **Mechanics**: Screen wrapping, procedural polygonal space debris, progressive waves, 3 shields with damage shake, and automatic `localStorage` high-score tracking (`sector_am2r_asteroids_highscore`).

### Game 2: Cryptographic Decryption (4x4 Minimalist Geometric Matrix)
* **Canvas**: `<canvas id="canvas-cyber-match">`
* **Visuals**: **Zero Unicode emojis**. Rendered with clean, minimalist geometric vector shapes drawn entirely via Canvas API stroke/fill commands (hollow circle, solid triangle, ortho cross, rhomb diamond, concentric box, hexa prism, dual chevron, target array) using Coral (`#ff6a55`) and Slate (`#94a3b8`).
* **Controls**: Mouse click on solid cards to reveal and pair ciphers.
* **Mechanics**: 16 cards (8 pairs), speed/move scoring formula, and automatic `localStorage` high-score tracking (`sector_am2r_memory_highscore`).

### Game 3: Packet Routing (Network Data Bus Snake Clone)
* **Canvas**: `<canvas id="packetCanvas">`
* **Visuals**: The routing path represents a live network data bus drawn as connected, sharp navy/coral squares. Data nodes are drawn as pulsing coral square packets.
* **Controls**: Arrow keys (`↑`, `←`, `↓`, `→`).
* **Mechanics**: Edge-wall collision (triggers terminal fault game over reset), self-collision detection, scaling clock frequency throughput, and persistent `localStorage` high-score tracking under the key `sector_am2r_packet_hs`.

---

## 📁 File Structure

```
Sector Am2r/
├── index.php                    # Dynamic Main Hub with SimpleXML ingestion & 3-Game Diagnostic Grid
├── get_game.php                 # AJAX Endpoint for dynamic guide streaming
├── game.php                     # Standalone Dynamic Game Guide Template ($_GET['id'])
├── README.md                    # System documentation and execution manual
├── devlog.md                    # Detailed architectural devlog
├── qa_audit.js                  # Automated relative path and XML audit test
├── css/
│   └── style.css                # Solid Matte Enterprise Design System (Navy #0f172a, blur 4px)
├── js/
│   ├── app.js                   # Web Audio API engine, Mouse Parallax, AJAX router
│   └── arcade.js                # 3-Game Diagnostic Controllers (Telemetry, Decryption, Packet Routing)
├── data/
│   └── database.xml             # Central XML Database (RE Requiem, AM2R, Witcher 3)
└── assets/
    └── images/                  # Maps (SVG) & Tactical Banners
```

---

##  Running the Project

Ensure PHP (version 7.4+ or 8.x) is installed. 

1. **Launch PHP Built-in Server**:
   ```bash
   cd "d:/web tech/Sector Am2r"
   php -S localhost:8000
   ```
2. **Access in Web Browser**:
   * Open `http://localhost:8000/` or `http://localhost:8000/index.php`
   * Click any game card to dynamically stream the complete tactical walkthrough into `#dynamic-content` via AJAX without reloading the page.
   * Experience synthetic acoustic hover-beeps and click-thuds.
   * Test the **Interactive System Diagnostics** suite:
     - **Telemetry Calibration** (Vector flight simulation)
     - **Cryptographic Decryption** (Minimalist geometric cipher matching)
     - **Packet Routing** (Arrow key network bus data routing with edge-wall collisions)
