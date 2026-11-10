/**
 * Sector Am2r: Professional Interactive System Diagnostics Suite
 * 1. Telemetry Calibration (Orbital Vector Sim) - canvas id="canvas-void-drift"
 * 2. Cryptographic Decryption (4x4 Minimalist Geometric Matrix) - canvas id="canvas-cyber-match"
 * 3. Packet Routing (Network Data Bus Snake Clone) - canvas id="packetCanvas"
 * 
 * Features persistent localStorage High-Score tracking and synthetic Web Audio API integration.
 */

(function () {
    'use strict';

    const STORAGE_KEYS = {
        ASTEROIDS_HS: 'sector_am2r_asteroids_highscore',
        MEMORY_HS: 'sector_am2r_memory_highscore',
        PACKET_HS: 'sector_am2r_packet_hs' // Exact key as requested
    };

    const PALETTE = {
        bg: '#080d18',
        navy: '#0f172a',
        navyDark: '#0a0f1d',
        coral: '#ff6a55',
        coralGlow: 'rgba(255, 106, 85, 0.45)',
        coralBright: '#ff8573',
        slate: '#94a3b8',
        slateDark: '#64748b',
        border: 'rgba(255, 106, 85, 0.15)',
        white: '#ffffff',
        muted: 'rgba(255, 255, 255, 0.65)',
        gold: '#ffd166'
    };

    /* ==========================================================================
       GAME 1: TELEMETRY CALIBRATION (ORBITAL VECTOR SIMULATOR)
       ========================================================================== */

    class TelemetryCalibrationGame {
        constructor() {
            this.canvas = document.getElementById('canvas-void-drift');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');

            // HUD Elements
            this.hudScore = document.getElementById('asteroids-score');
            this.hudHighScore = document.getElementById('asteroids-highscore');
            this.hudShields = document.getElementById('asteroids-shields');
            this.hudWave = document.getElementById('asteroids-wave');
            this.btnRestart = document.getElementById('btn-restart-asteroids');

            // Game State
            this.ship = null;
            this.lasers = [];
            this.asteroids = [];
            this.particles = [];
            this.score = 0;
            this.lives = 3;
            this.wave = 1;
            this.gameOver = false;
            this.screenShake = 0;
            this.shootCooldown = 0;

            this.keys = {
                w: false,
                a: false,
                s: false,
                d: false,
                space: false
            };

            this.initEvents();
            this.init();
            this.startLoop();
        }

        getHighScore() {
            return parseInt(localStorage.getItem(STORAGE_KEYS.ASTEROIDS_HS) || '0', 10);
        }

        setHighScore(val) {
            localStorage.setItem(STORAGE_KEYS.ASTEROIDS_HS, val.toString());
        }

        init() {
            this.score = 0;
            this.lives = 3;
            this.wave = 1;
            this.gameOver = false;
            this.lasers = [];
            this.asteroids = [];
            this.particles = [];
            this.shootCooldown = 0;
            this.screenShake = 0;

            this.resetShip();
            this.spawnAsteroids(4);
            this.updateHUD();
        }

        resetShip() {
            this.ship = {
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                radius: 11,
                angle: -Math.PI / 2,
                rotationSpeed: 0.08,
                vx: 0,
                vy: 0,
                thrust: 0.16,
                friction: 0.985,
                invulnerable: 90
            };
        }

        spawnAsteroids(count) {
            for (let i = 0; i < count; i++) {
                let x, y, dist;
                do {
                    x = Math.random() * this.canvas.width;
                    y = Math.random() * this.canvas.height;
                    const dx = x - (this.ship ? this.ship.x : this.canvas.width / 2);
                    const dy = y - (this.ship ? this.ship.y : this.canvas.height / 2);
                    dist = Math.sqrt(dx * dx + dy * dy);
                } while (dist < 100);

                this.asteroids.push(this.createAsteroid(x, y, 28, 1));
            }
        }

        createAsteroid(x, y, radius, level) {
            const numVerts = 8 + Math.floor(Math.random() * 4);
            const offsets = [];
            for (let i = 0; i < numVerts; i++) {
                offsets.push(0.75 + Math.random() * 0.5);
            }
            const speed = 0.8 + Math.random() * 1.1 + (level * 0.3);
            const heading = Math.random() * Math.PI * 2;

            return {
                x, y,
                radius,
                level,
                vx: Math.cos(heading) * speed,
                vy: Math.sin(heading) * speed,
                angle: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.04,
                numVerts,
                offsets
            };
        }

        createExplosion(x, y, color, count = 12) {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.2 + Math.random() * 3.5;
                this.particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color,
                    size: 1.5 + Math.random() * 2,
                    life: 22 + Math.random() * 18,
                    maxLife: 40
                });
            }
        }

        initEvents() {
            if (this.btnRestart) {
                this.btnRestart.addEventListener('click', () => {
                    if (window.SectorAudio) window.SectorAudio.playClickThud();
                    this.init();
                });
            }

            window.addEventListener('keydown', (e) => {
                const key = e.key.toLowerCase();
                if (['w', 'arrowup'].includes(key)) { this.keys.w = true; }
                if (['a', 'arrowleft'].includes(key)) { this.keys.a = true; }
                if (['s', 'arrowdown'].includes(key)) { this.keys.s = true; }
                if (['d', 'arrowright'].includes(key)) { this.keys.d = true; }
                if (e.code === 'Space' || key === ' ') {
                    this.keys.space = true;
                    if (this.gameOver) {
                        this.init();
                    }
                    if (document.activeElement === this.canvas || e.target.closest('#panel-void-drift')) {
                        e.preventDefault();
                    }
                }
            });

            window.addEventListener('keyup', (e) => {
                const key = e.key.toLowerCase();
                if (['w', 'arrowup'].includes(key)) this.keys.w = false;
                if (['a', 'arrowleft'].includes(key)) this.keys.a = false;
                if (['s', 'arrowdown'].includes(key)) this.keys.s = false;
                if (['d', 'arrowright'].includes(key)) this.keys.d = false;
                if (e.code === 'Space' || key === ' ') this.keys.space = false;
            });

            this.canvas.addEventListener('click', () => {
                this.canvas.focus();
                if (this.gameOver) {
                    this.init();
                }
            });
        }

        updateHUD() {
            if (this.hudScore) this.hudScore.textContent = this.score;
            if (this.hudHighScore) {
                const hs = Math.max(this.score, this.getHighScore());
                this.hudHighScore.textContent = hs;
            }
            if (this.hudShields) {
                let s = '';
                for (let i = 0; i < this.lives; i++) s += '♥ ';
                this.hudShields.textContent = s.trim() || 'BREACHED';
                this.hudShields.style.color = this.lives <= 1 ? '#ff4d4d' : PALETTE.coral;
            }
            if (this.hudWave) {
                this.hudWave.textContent = `W-${this.wave}`;
            }
        }

        update() {
            if (this.screenShake > 0) this.screenShake--;
            if (this.shootCooldown > 0) this.shootCooldown--;

            if (this.gameOver) return;

            if (this.ship.invulnerable > 0) this.ship.invulnerable--;

            if (this.keys.a) this.ship.angle -= this.ship.rotationSpeed;
            if (this.keys.d) this.ship.angle += this.ship.rotationSpeed;

            if (this.keys.w) {
                this.ship.vx += Math.cos(this.ship.angle) * this.ship.thrust;
                this.ship.vy += Math.sin(this.ship.angle) * this.ship.thrust;

                if (Math.random() < 0.6) {
                    const rearAngle = this.ship.angle + Math.PI + (Math.random() - 0.5) * 0.5;
                    const rSpeed = 1.4 + Math.random() * 2;
                    this.particles.push({
                        x: this.ship.x - Math.cos(this.ship.angle) * (this.ship.radius + 2),
                        y: this.ship.y - Math.sin(this.ship.angle) * (this.ship.radius + 2),
                        vx: Math.cos(rearAngle) * rSpeed,
                        vy: Math.sin(rearAngle) * rSpeed,
                        color: Math.random() < 0.5 ? PALETTE.coral : PALETTE.slate,
                        size: 1.5 + Math.random() * 1.5,
                        life: 12,
                        maxLife: 12
                    });
                }
            }

            if (this.keys.s) {
                this.ship.vx *= 0.94;
                this.ship.vy *= 0.94;
            }

            this.ship.vx *= this.ship.friction;
            this.ship.vy *= this.ship.friction;
            this.ship.x += this.ship.vx;
            this.ship.y += this.ship.vy;

            if (this.ship.x < 0) this.ship.x = this.canvas.width;
            if (this.ship.x > this.canvas.width) this.ship.x = 0;
            if (this.ship.y < 0) this.ship.y = this.canvas.height;
            if (this.ship.y > this.canvas.height) this.ship.y = 0;

            if (this.keys.space && this.shootCooldown <= 0) {
                const laserSpeed = 8.5;
                const noseX = this.ship.x + Math.cos(this.ship.angle) * (this.ship.radius + 4);
                const noseY = this.ship.y + Math.sin(this.ship.angle) * (this.ship.radius + 4);

                this.lasers.push({
                    x: noseX,
                    y: noseY,
                    vx: Math.cos(this.ship.angle) * laserSpeed + this.ship.vx * 0.3,
                    vy: Math.sin(this.ship.angle) * laserSpeed + this.ship.vy * 0.3,
                    life: 44
                });

                this.shootCooldown = 11;
                if (window.SectorAudio && typeof window.SectorAudio.playLaserChirp === 'function') {
                    window.SectorAudio.playLaserChirp();
                }
            }

            for (let i = this.lasers.length - 1; i >= 0; i--) {
                const l = this.lasers[i];
                l.x += l.vx;
                l.y += l.vy;
                l.life--;

                if (l.x < 0) l.x = this.canvas.width;
                if (l.x > this.canvas.width) l.x = 0;
                if (l.y < 0) l.y = this.canvas.height;
                if (l.y > this.canvas.height) l.y = 0;

                if (l.life <= 0) {
                    this.lasers.splice(i, 1);
                }
            }

            for (let a of this.asteroids) {
                a.x += a.vx;
                a.y += a.vy;
                a.angle += a.rotSpeed;

                if (a.x < -a.radius) a.x = this.canvas.width + a.radius;
                if (a.x > this.canvas.width + a.radius) a.x = -a.radius;
                if (a.y < -a.radius) a.y = this.canvas.height + a.radius;
                if (a.y > this.canvas.height + a.radius) a.y = -a.radius;
            }

            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }

            for (let i = this.asteroids.length - 1; i >= 0; i--) {
                const a = this.asteroids[i];
                for (let j = this.lasers.length - 1; j >= 0; j--) {
                    const l = this.lasers[j];
                    const dx = a.x - l.x;
                    const dy = a.y - l.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < a.radius) {
                        this.createExplosion(a.x, a.y, PALETTE.coral, 10);
                        if (window.SectorAudio && typeof window.SectorAudio.playClickThud === 'function') {
                            window.SectorAudio.playClickThud();
                        }

                        const pts = a.level === 1 ? 25 : a.level === 2 ? 50 : 100;
                        this.score += pts;

                        if (a.level < 3) {
                            const newRadius = a.radius * 0.58;
                            this.asteroids.push(this.createAsteroid(a.x, a.y, newRadius, a.level + 1));
                            this.asteroids.push(this.createAsteroid(a.x, a.y, newRadius, a.level + 1));
                        }

                        this.asteroids.splice(i, 1);
                        this.lasers.splice(j, 1);
                        this.updateHUD();
                        break;
                    }
                }
            }

            if (this.ship.invulnerable <= 0) {
                for (let i = 0; i < this.asteroids.length; i++) {
                    const a = this.asteroids[i];
                    const dx = a.x - this.ship.x;
                    const dy = a.y - this.ship.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < a.radius + this.ship.radius - 2) {
                        this.lives--;
                        this.screenShake = 14;
                        this.createExplosion(this.ship.x, this.ship.y, '#ff4d4d', 22);

                        if (window.SectorAudio && typeof window.SectorAudio.playBlastThud === 'function') {
                            window.SectorAudio.playBlastThud();
                        }

                        if (this.lives <= 0) {
                            this.gameOver = true;
                            if (this.score > this.getHighScore()) {
                                this.setHighScore(this.score);
                            }
                        } else {
                            this.resetShip();
                        }
                        this.updateHUD();
                        break;
                    }
                }
            }

            if (this.asteroids.length === 0) {
                this.wave++;
                this.spawnAsteroids(3 + this.wave);
                this.updateHUD();
            }
        }

        draw() {
            this.ctx.save();

            if (this.screenShake > 0) {
                const ox = (Math.random() - 0.5) * this.screenShake;
                const oy = (Math.random() - 0.5) * this.screenShake;
                this.ctx.translate(ox, oy);
            }

            this.ctx.fillStyle = PALETTE.bg;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Enterprise Precision Radar Grid
            this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
            this.ctx.lineWidth = 1;
            const gridSize = 24;
            for (let x = 0; x < this.canvas.width; x += gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }
            for (let y = 0; y < this.canvas.height; y += gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }

            // Draw Asteroids (Polygonal Debris)
            for (let a of this.asteroids) {
                this.ctx.save();
                this.ctx.translate(a.x, a.y);
                this.ctx.rotate(a.angle);
                this.ctx.beginPath();

                for (let v = 0; v < a.numVerts; v++) {
                    const ang = (v / a.numVerts) * Math.PI * 2;
                    const r = a.radius * a.offsets[v];
                    const px = Math.cos(ang) * r;
                    const py = Math.sin(ang) * r;
                    if (v === 0) this.ctx.moveTo(px, py);
                    else this.ctx.lineTo(px, py);
                }
                this.ctx.closePath();

                this.ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
                this.ctx.fill();
                this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
                this.ctx.lineWidth = 1.5;
                this.ctx.stroke();
                this.ctx.restore();
            }

            // Draw Lasers
            for (let l of this.lasers) {
                this.ctx.save();
                this.ctx.fillStyle = PALETTE.coral;
                this.ctx.beginPath();
                this.ctx.arc(l.x, l.y, 2.5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }

            // Draw Particles
            for (let p of this.particles) {
                this.ctx.save();
                const alpha = p.life / p.maxLife;
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = alpha;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }

            // Draw Ship
            if (!this.gameOver) {
                if (this.ship.invulnerable % 8 < 4) {
                    this.ctx.save();
                    this.ctx.translate(this.ship.x, this.ship.y);
                    this.ctx.rotate(this.ship.angle);

                    if (this.ship.invulnerable > 0) {
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, this.ship.radius + 5, 0, Math.PI * 2);
                        this.ctx.strokeStyle = 'rgba(255, 106, 85, 0.4)';
                        this.ctx.lineWidth = 1;
                        this.ctx.setLineDash([3, 3]);
                        this.ctx.stroke();
                        this.ctx.setLineDash([]);
                    }

                    this.ctx.beginPath();
                    this.ctx.moveTo(this.ship.radius + 3, 0);
                    this.ctx.lineTo(-this.ship.radius + 2, -this.ship.radius + 3);
                    this.ctx.lineTo(-this.ship.radius + 5, 0);
                    this.ctx.lineTo(-this.ship.radius + 2, this.ship.radius - 3);
                    this.ctx.closePath();

                    this.ctx.fillStyle = PALETTE.navy;
                    this.ctx.fill();
                    this.ctx.strokeStyle = PALETTE.coral;
                    this.ctx.lineWidth = 1.8;
                    this.ctx.stroke();

                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
                    this.ctx.fillStyle = PALETTE.slate;
                    this.ctx.fill();

                    this.ctx.restore();
                }
            }

            // Game Over Banner
            if (this.gameOver) {
                this.ctx.save();
                this.ctx.fillStyle = 'rgba(8, 12, 22, 0.9)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                this.ctx.textAlign = 'center';
                this.ctx.fillStyle = PALETTE.coral;
                this.ctx.font = '700 20px "Inter", sans-serif';
                this.ctx.fillText('TELEMETRY FAULT // SIGNAL LOSS', this.canvas.width / 2, this.canvas.height / 2 - 24);

                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '600 14px "Inter", sans-serif';
                this.ctx.fillText(`Vector Alignment Metric: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 6);

                const hs = this.getHighScore();
                if (this.score >= hs && this.score > 0) {
                    this.ctx.fillStyle = PALETTE.gold;
                    this.ctx.font = '700 12px "Inter", sans-serif';
                    this.ctx.fillText('★ PEAK TELEMETRY BENCHMARK ACHIEVED ★', this.canvas.width / 2, this.canvas.height / 2 + 30);
                }

                this.ctx.fillStyle = PALETTE.slate;
                this.ctx.font = '500 12px "Inter", sans-serif';
                this.ctx.fillText('Press SPACE or Click CALIBRATE to Re-Engage', this.canvas.width / 2, this.canvas.height / 2 + 58);

                this.ctx.restore();
            }

            this.ctx.restore();
        }

        startLoop() {
            const loop = () => {
                this.update();
                this.draw();
                requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        }
    }

    /* ==========================================================================
       GAME 2: CRYPTOGRAPHIC DECRYPTION (MINIMALIST GEOMETRIC 4x4 MATRIX)
       Pure Canvas API vector shapes in Coral (#ff6a55) & Slate (#94a3b8) - Zero Emojis!
       ========================================================================== */

    class CryptographicDecryptionGame {
        constructor() {
            this.canvas = document.getElementById('canvas-cyber-match');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');

            // HUD Elements
            this.hudScore = document.getElementById('memory-score');
            this.hudHighScore = document.getElementById('memory-highscore');
            this.hudMatched = document.getElementById('memory-matched');
            this.hudTime = document.getElementById('memory-time');
            this.hudMoves = document.getElementById('memory-moves');
            this.btnRestart = document.getElementById('btn-restart-memory');

            // 8 Minimalist Geometric Shapes (16 Cards = 4x4 Array)
            this.GLYPHS = [
                { id: 'circle', shapeType: 'hollow-circle', label: 'HOLLOW CIRCLE', code: 'SEC-01' },
                { id: 'triangle', shapeType: 'solid-triangle', label: 'SOLID TRIANGLE', code: 'SEC-02' },
                { id: 'cross', shapeType: 'ortho-cross', label: 'ORTHO CROSS', code: 'SEC-03' },
                { id: 'diamond', shapeType: 'rhomb-diamond', label: 'RHOMB DIAMOND', code: 'SEC-04' },
                { id: 'concentric', shapeType: 'concentric-square', label: 'CONCENTRIC BOX', code: 'SEC-05' },
                { id: 'hexagon', shapeType: 'hexa-prism', label: 'HEXA MATRIX', code: 'SEC-06' },
                { id: 'chevron', shapeType: 'double-chevron', label: 'DUAL CHEVRON', code: 'SEC-07' },
                { id: 'target', shapeType: 'target-ring', label: 'TARGET ARRAY', code: 'SEC-08' }
            ];

            this.cards = [];
            this.flippedCards = [];
            this.matchedPairs = 0;
            this.moves = 0;
            this.score = 0;
            this.startTime = null;
            this.elapsedSeconds = 0;
            this.timerInterval = null;
            this.isLocked = false;
            this.gameWon = false;

            this.initEvents();
            this.init();
            this.startLoop();
        }

        getHighScore() {
            return parseInt(localStorage.getItem(STORAGE_KEYS.MEMORY_HS) || '0', 10);
        }

        setHighScore(val) {
            localStorage.setItem(STORAGE_KEYS.MEMORY_HS, val.toString());
        }

        init() {
            this.matchedPairs = 0;
            this.moves = 0;
            this.score = 0;
            this.elapsedSeconds = 0;
            this.startTime = null;
            this.flippedCards = [];
            this.isLocked = false;
            this.gameWon = false;

            if (this.timerInterval) clearInterval(this.timerInterval);
            this.timerInterval = null;

            let deck = [];
            this.GLYPHS.forEach(g => {
                deck.push({ ...g, uid: Math.random() });
                deck.push({ ...g, uid: Math.random() });
            });

            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }

            const cols = 4;
            const rows = 4;
            const cardW = 98;
            const cardH = 70;
            const gapX = 14;
            const gapY = 12;
            const totalW = cols * cardW + (cols - 1) * gapX;
            const totalH = rows * cardH + (rows - 1) * gapY;
            const startX = (this.canvas.width - totalW) / 2;
            const startY = (this.canvas.height - totalH) / 2;

            this.cards = deck.map((item, idx) => {
                const c = idx % cols;
                const r = Math.floor(idx / cols);
                return {
                    ...item,
                    x: startX + c * (cardW + gapX),
                    y: startY + r * (cardH + gapY),
                    w: cardW,
                    h: cardH,
                    isFlipped: false,
                    isMatched: false
                };
            });

            this.updateHUD();
        }

        startTimer() {
            if (!this.startTime) {
                this.startTime = Date.now();
                this.timerInterval = setInterval(() => {
                    if (!this.gameWon) {
                        this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
                        this.updateHUD();
                    }
                }, 1000);
            }
        }

        initEvents() {
            if (this.btnRestart) {
                this.btnRestart.addEventListener('click', () => {
                    if (window.SectorAudio) window.SectorAudio.playClickThud();
                    this.init();
                });
            }

            this.canvas.addEventListener('click', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;
                const mouseX = (e.clientX - rect.left) * scaleX;
                const mouseY = (e.clientY - rect.top) * scaleY;

                if (this.gameWon) {
                    this.init();
                    return;
                }

                this.handleCardClick(mouseX, mouseY);
            });
        }

        handleCardClick(mouseX, mouseY) {
            if (this.isLocked || this.gameWon) return;

            for (let card of this.cards) {
                if (!card.isFlipped && !card.isMatched) {
                    if (mouseX >= card.x && mouseX <= card.x + card.w &&
                        mouseY >= card.y && mouseY <= card.y + card.h) {

                        this.startTimer();
                        this.flipCard(card);
                        break;
                    }
                }
            }
        }

        flipCard(card) {
            card.isFlipped = true;
            this.flippedCards.push(card);

            if (window.SectorAudio) window.SectorAudio.playHoverBeep();

            if (this.flippedCards.length === 2) {
                this.moves++;
                this.isLocked = true;
                const [c1, c2] = this.flippedCards;

                if (c1.id === c2.id) {
                    setTimeout(() => {
                        c1.isMatched = true;
                        c2.isMatched = true;
                        this.matchedPairs++;
                        this.score += 250;
                        this.flippedCards = [];
                        this.isLocked = false;

                        if (window.SectorAudio) window.SectorAudio.playLaserChirp();

                        if (this.matchedPairs === this.GLYPHS.length) {
                            this.handleVictory();
                        }
                        this.updateHUD();
                    }, 350);
                } else {
                    setTimeout(() => {
                        c1.isFlipped = false;
                        c2.isFlipped = false;
                        this.flippedCards = [];
                        this.isLocked = false;
                        this.updateHUD();
                    }, 750);
                }
            }
            this.updateHUD();
        }

        handleVictory() {
            this.gameWon = true;
            if (this.timerInterval) clearInterval(this.timerInterval);

            const timeBonus = Math.max(0, 500 - this.elapsedSeconds * 5);
            const moveBonus = Math.max(0, 300 - this.moves * 10);
            this.score += timeBonus + moveBonus;

            if (this.score > this.getHighScore()) {
                this.setHighScore(this.score);
            }

            if (window.SectorAudio && typeof window.SectorAudio.playBlastThud === 'function') {
                window.SectorAudio.playBlastThud();
            }

            this.updateHUD();
        }

        updateHUD() {
            if (this.hudScore) this.hudScore.textContent = this.score;
            if (this.hudHighScore) {
                const hs = Math.max(this.score, this.getHighScore());
                this.hudHighScore.textContent = hs;
            }
            if (this.hudMatched) {
                this.hudMatched.textContent = `${this.matchedPairs} / ${this.GLYPHS.length}`;
            }
            if (this.hudMoves) {
                this.hudMoves.textContent = this.moves;
            }
            if (this.hudTime) {
                const mins = Math.floor(this.elapsedSeconds / 60);
                const secs = this.elapsedSeconds % 60;
                this.hudTime.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }
        }

        draw() {
            this.ctx.fillStyle = PALETTE.bg;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Precision Circuit Grid Lines
            this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.04)';
            this.ctx.lineWidth = 1;
            for (let x = 0; x < this.canvas.width; x += 20) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }

            for (let card of this.cards) {
                this.drawCard(card);
            }

            if (this.gameWon) {
                this.ctx.save();
                this.ctx.fillStyle = 'rgba(8, 12, 22, 0.9)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                this.ctx.textAlign = 'center';
                this.ctx.fillStyle = PALETTE.coral;
                this.ctx.font = '700 20px "Inter", sans-serif';
                this.ctx.fillText('CIPHER ARRAY SYNCHRONIZED', this.canvas.width / 2, this.canvas.height / 2 - 24);

                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '600 14px "Inter", sans-serif';
                this.ctx.fillText(`Decryption Score: ${this.score}  |  Cycles: ${this.moves}`, this.canvas.width / 2, this.canvas.height / 2 + 6);

                const hs = this.getHighScore();
                if (this.score >= hs && this.score > 0) {
                    this.ctx.fillStyle = PALETTE.gold;
                    this.ctx.font = '700 12px "Inter", sans-serif';
                    this.ctx.fillText('★ PEAK DECRYPTION BENCHMARK REGISTERED ★', this.canvas.width / 2, this.canvas.height / 2 + 30);
                }

                this.ctx.fillStyle = PALETTE.slate;
                this.ctx.font = '500 12px "Inter", sans-serif';
                this.ctx.fillText('Click anywhere to Reset Cipher Matrix', this.canvas.width / 2, this.canvas.height / 2 + 58);

                this.ctx.restore();
            }
        }

        drawCard(card) {
            this.ctx.save();

            if (card.isMatched) {
                this.ctx.fillStyle = 'rgba(255, 106, 85, 0.12)';
                this.ctx.strokeStyle = PALETTE.coral;
                this.ctx.lineWidth = 1.5;
            } else if (card.isFlipped) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
                this.ctx.strokeStyle = PALETTE.slate;
                this.ctx.lineWidth = 1.5;
            } else {
                this.ctx.fillStyle = PALETTE.navy;
                this.ctx.strokeStyle = PALETTE.border;
                this.ctx.lineWidth = 1;
            }

            this.roundRect(this.ctx, card.x, card.y, card.w, card.h, 6);
            this.ctx.fill();
            this.ctx.stroke();

            const cx = card.x + card.w / 2;
            const cy = card.y + card.h / 2;

            if (card.isFlipped || card.isMatched) {
                // Vector Geometric Rendering (No Emojis!)
                this.drawGeometricShape(this.ctx, card.shapeType, cx, cy - 8, card.isMatched);

                this.ctx.textAlign = 'center';
                this.ctx.font = '700 8.5px "Inter", sans-serif';
                this.ctx.fillStyle = card.isMatched ? PALETTE.coral : '#ffffff';
                this.ctx.fillText(card.label, cx, cy + 16);

                this.ctx.font = '600 7.5px "Inter", monospace';
                this.ctx.fillStyle = PALETTE.slate;
                this.ctx.fillText(card.code, cx, cy + 26);

            } else {
                // Minimalist Enterprise Cipher Back
                this.ctx.beginPath();
                this.ctx.moveTo(cx, cy - 8);
                this.ctx.lineTo(cx + 8, cy);
                this.ctx.lineTo(cx, cy + 8);
                this.ctx.lineTo(cx - 8, cy);
                this.ctx.closePath();
                this.ctx.strokeStyle = 'rgba(255, 106, 85, 0.35)';
                this.ctx.lineWidth = 1.2;
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(cx, cy, 2, 0, Math.PI * 2);
                this.ctx.fillStyle = PALETTE.slate;
                this.ctx.fill();

                this.ctx.textAlign = 'center';
                this.ctx.font = '700 7px "Inter", monospace';
                this.ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
                this.ctx.fillText('CIPHER BLOCK', cx, cy + 18);
            }

            this.ctx.restore();
        }

        drawGeometricShape(ctx, type, cx, cy, isMatched) {
            ctx.save();
            const primary = PALETTE.coral;
            const secondary = isMatched ? '#ffffff' : PALETTE.slate;

            switch (type) {
                case 'hollow-circle':
                    ctx.beginPath();
                    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
                    ctx.strokeStyle = primary;
                    ctx.lineWidth = 2.5;
                    ctx.stroke();
                    break;

                case 'solid-triangle':
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - 13);
                    ctx.lineTo(cx + 12, cy + 9);
                    ctx.lineTo(cx - 12, cy + 9);
                    ctx.closePath();
                    ctx.fillStyle = primary;
                    ctx.fill();
                    break;

                case 'ortho-cross':
                    ctx.beginPath();
                    ctx.moveTo(cx - 12, cy);
                    ctx.lineTo(cx + 12, cy);
                    ctx.moveTo(cx, cy - 12);
                    ctx.lineTo(cx, cy + 12);
                    ctx.strokeStyle = secondary;
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'square';
                    ctx.stroke();
                    break;

                case 'rhomb-diamond':
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - 13);
                    ctx.lineTo(cx + 12, cy);
                    ctx.lineTo(cx, cy + 13);
                    ctx.lineTo(cx - 12, cy);
                    ctx.closePath();
                    ctx.fillStyle = 'rgba(255, 106, 85, 0.25)';
                    ctx.fill();
                    ctx.strokeStyle = primary;
                    ctx.lineWidth = 2.2;
                    ctx.stroke();
                    break;

                case 'concentric-square':
                    ctx.strokeStyle = secondary;
                    ctx.lineWidth = 2;
                    ctx.strokeRect(cx - 12, cy - 12, 24, 24);
                    ctx.fillStyle = primary;
                    ctx.fillRect(cx - 5, cy - 5, 10, 10);
                    break;

                case 'hexa-prism':
                    ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const ang = (i * Math.PI) / 3;
                        const px = cx + 12 * Math.cos(ang);
                        const py = cy + 12 * Math.sin(ang);
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.strokeStyle = primary;
                    ctx.lineWidth = 2.2;
                    ctx.stroke();
                    break;

                case 'double-chevron':
                    ctx.beginPath();
                    ctx.moveTo(cx - 10, cy - 3);
                    ctx.lineTo(cx, cy - 12);
                    ctx.lineTo(cx + 10, cy - 3);
                    ctx.moveTo(cx - 10, cy + 6);
                    ctx.lineTo(cx, cy - 3);
                    ctx.lineTo(cx + 10, cy + 6);
                    ctx.strokeStyle = secondary;
                    ctx.lineWidth = 2.2;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.stroke();
                    break;

                case 'target-ring':
                    ctx.beginPath();
                    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
                    ctx.strokeStyle = secondary;
                    ctx.lineWidth = 1.8;
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
                    ctx.fillStyle = primary;
                    ctx.fill();
                    break;
            }
            ctx.restore();
        }

        roundRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }

        startLoop() {
            const loop = () => {
                this.draw();
                requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        }
    }

    /* ==========================================================================
       GAME 3: PACKET ROUTING (NETWORK DATA BUS STREAM - SNAKE CLONE)
       ========================================================================== */

    class PacketRoutingGame {
        constructor() {
            this.canvas = document.getElementById('packetCanvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');

            // HUD Elements
            this.hudScore = document.getElementById('packet-score');
            this.hudHighScore = document.getElementById('packet-highscore');
            this.hudLength = document.getElementById('packet-length');
            this.hudSpeed = document.getElementById('packet-speed');
            this.btnRestart = document.getElementById('btn-restart-packet');

            // Grid Specifications (480 x 360 canvas -> 32 cols x 24 rows @ 15px cells)
            this.cellSize = 15;
            this.cols = Math.floor(this.canvas.width / this.cellSize);
            this.rows = Math.floor(this.canvas.height / this.cellSize);

            // Game State
            this.snake = [];
            this.food = { x: 0, y: 0 };
            this.dirX = 1;
            this.dirY = 0;
            this.nextDirX = 1;
            this.nextDirY = 0;
            this.score = 0;
            this.gameOver = false;
            this.lastTickTime = 0;
            this.tickRate = 105; // ms per step (scales with progress)
            this.particles = [];

            this.initEvents();
            this.init();
            this.startLoop();
        }

        getHighScore() {
            return parseInt(localStorage.getItem(STORAGE_KEYS.PACKET_HS) || '0', 10);
        }

        setHighScore(val) {
            localStorage.setItem(STORAGE_KEYS.PACKET_HS, val.toString());
        }

        init() {
            this.score = 0;
            this.gameOver = false;
            this.dirX = 1;
            this.dirY = 0;
            this.nextDirX = 1;
            this.nextDirY = 0;
            this.tickRate = 105;
            this.particles = [];

            // Initialize snake in middle, length 4 heading right
            const midX = Math.floor(this.cols / 2);
            const midY = Math.floor(this.rows / 2);
            this.snake = [
                { x: midX, y: midY },
                { x: midX - 1, y: midY },
                { x: midX - 2, y: midY },
                { x: midX - 3, y: midY }
            ];

            this.spawnFood();
            this.updateHUD();
        }

        spawnFood() {
            let valid = false;
            let attempts = 0;
            while (!valid && attempts < 100) {
                attempts++;
                const rx = Math.floor(Math.random() * this.cols);
                const ry = Math.floor(Math.random() * this.rows);
                const onSnake = this.snake.some(seg => seg.x === rx && seg.y === ry);
                if (!onSnake) {
                    this.food = { x: rx, y: ry };
                    valid = true;
                }
            }
        }

        createSparks(x, y, count = 10) {
            const px = x * this.cellSize + this.cellSize / 2;
            const py = y * this.cellSize + this.cellSize / 2;
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.2 + Math.random() * 2.8;
                this.particles.push({
                    x: px,
                    y: py,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: Math.random() < 0.5 ? PALETTE.coral : PALETTE.slate,
                    life: 14 + Math.random() * 10,
                    maxLife: 24
                });
            }
        }

        initEvents() {
            if (this.btnRestart) {
                this.btnRestart.addEventListener('click', () => {
                    if (window.SectorAudio) window.SectorAudio.playClickThud();
                    this.init();
                });
            }

            // Keyboard binding for Arrow Keys
            window.addEventListener('keydown', (e) => {
                const key = e.key;

                // Handle Direction Changes with 180° Reversal Prevention
                if (key === 'ArrowUp') {
                    if (this.dirY !== 1) { this.nextDirX = 0; this.nextDirY = -1; }
                    this.preventScrollIfTargeted(e);
                } else if (key === 'ArrowDown') {
                    if (this.dirY !== -1) { this.nextDirX = 0; this.nextDirY = 1; }
                    this.preventScrollIfTargeted(e);
                } else if (key === 'ArrowLeft') {
                    if (this.dirX !== 1) { this.nextDirX = -1; this.nextDirY = 0; }
                    this.preventScrollIfTargeted(e);
                } else if (key === 'ArrowRight') {
                    if (this.dirX !== -1) { this.nextDirX = 1; this.nextDirY = 0; }
                    this.preventScrollIfTargeted(e);
                }

                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                    if (this.gameOver) {
                        this.init();
                    }
                }
            });

            this.canvas.addEventListener('click', () => {
                this.canvas.focus();
                if (this.gameOver) {
                    this.init();
                }
            });
        }

        preventScrollIfTargeted(e) {
            if (document.activeElement === this.canvas || e.target.closest('#panel-packet-routing') || e.target.closest('#diagnostics-section')) {
                e.preventDefault();
            }
        }

        updateHUD() {
            if (this.hudScore) this.hudScore.textContent = this.score;
            if (this.hudHighScore) {
                const hs = Math.max(this.score, this.getHighScore());
                this.hudHighScore.textContent = hs;
            }
            if (this.hudLength) {
                this.hudLength.textContent = this.snake.length;
            }
            if (this.hudSpeed) {
                // Rate converted to simulated clock frequency (MHz)
                const freq = Math.round((115 - this.tickRate) * 2.8 + 100);
                this.hudSpeed.textContent = `${freq} MHz`;
            }
        }

        step() {
            if (this.gameOver) return;

            // Commit next direction
            this.dirX = this.nextDirX;
            this.dirY = this.nextDirY;

            const head = this.snake[0];
            const nextX = head.x + this.dirX;
            const nextY = head.y + this.dirY;

            // Edge-Wall Collision (Terminal Error Reset)
            if (nextX < 0 || nextX >= this.cols || nextY < 0 || nextY >= this.rows) {
                this.handleCollision();
                return;
            }

            // Self-Collision Detection
            for (let i = 0; i < this.snake.length; i++) {
                if (this.snake[i].x === nextX && this.snake[i].y === nextY) {
                    this.handleCollision();
                    return;
                }
            }

            // Move Snake
            const newHead = { x: nextX, y: nextY };
            this.snake.unshift(newHead);

            // Check if Data Node / Food Reached
            if (nextX === this.food.x && nextY === this.food.y) {
                this.score += 10;
                this.createSparks(this.food.x, this.food.y, 8);

                if (window.SectorAudio && typeof window.SectorAudio.playHoverBeep === 'function') {
                    window.SectorAudio.playHoverBeep();
                }

                // Increase throughput slightly as length grows
                if (this.tickRate > 55) {
                    this.tickRate -= 1.5;
                }

                this.spawnFood();
                this.updateHUD();
            } else {
                // Remove tail segment if no food consumed
                this.snake.pop();
            }
        }

        handleCollision() {
            this.gameOver = true;
            this.createSparks(this.snake[0].x, this.snake[0].y, 22);

            if (this.score > this.getHighScore()) {
                this.setHighScore(this.score);
            }

            if (window.SectorAudio && typeof window.SectorAudio.playBlastThud === 'function') {
                window.SectorAudio.playBlastThud();
            }

            this.updateHUD();
        }

        update() {
            // Update spark particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }

        draw() {
            this.ctx.fillStyle = PALETTE.bg;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Data Bus Matrix Circuit Grid
            this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
            this.ctx.lineWidth = 1;
            for (let x = 0; x <= this.canvas.width; x += this.cellSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }
            for (let y = 0; y <= this.canvas.height; y += this.cellSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }

            // Draw Data Routing Path Conduit Line
            if (this.snake.length > 1) {
                this.ctx.save();
                this.ctx.beginPath();
                for (let i = 0; i < this.snake.length; i++) {
                    const cx = this.snake[i].x * this.cellSize + this.cellSize / 2;
                    const cy = this.snake[i].y * this.cellSize + this.cellSize / 2;
                    if (i === 0) this.ctx.moveTo(cx, cy);
                    else this.ctx.lineTo(cx, cy);
                }
                this.ctx.strokeStyle = 'rgba(255, 106, 85, 0.4)';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.restore();
            }

            // Draw Food (Pulsing Coral Square Data Node)
            const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 130);
            const fx = this.food.x * this.cellSize;
            const fy = this.food.y * this.cellSize;

            // Pulsing Aura
            this.ctx.fillStyle = `rgba(255, 106, 85, ${0.25 * pulse})`;
            this.ctx.fillRect(fx - 2, fy - 2, this.cellSize + 4, this.cellSize + 4);

            // Sharp Coral Core Square
            this.ctx.fillStyle = PALETTE.coral;
            this.ctx.fillRect(fx + 1, fy + 1, this.cellSize - 2, this.cellSize - 2);

            // Inner Signal Pip
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(fx + 4, fy + 4, this.cellSize - 8, this.cellSize - 8);

            // Draw Snake Segments (Connected Sharp Navy / Coral Squares)
            for (let i = 0; i < this.snake.length; i++) {
                const seg = this.snake[i];
                const sx = seg.x * this.cellSize;
                const sy = seg.y * this.cellSize;

                if (i === 0) {
                    // Head: Sharp Coral Leader
                    this.ctx.fillStyle = PALETTE.coral;
                    this.ctx.fillRect(sx, sy, this.cellSize, this.cellSize);

                    // Head Center Focus
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.fillRect(sx + 4, sy + 4, this.cellSize - 8, this.cellSize - 8);
                } else {
                    // Body: Sharp Navy Block with Coral Edge
                    this.ctx.fillStyle = PALETTE.navy;
                    this.ctx.fillRect(sx + 1, sy + 1, this.cellSize - 2, this.cellSize - 2);

                    this.ctx.strokeStyle = PALETTE.coral;
                    this.ctx.lineWidth = 1.2;
                    this.ctx.strokeRect(sx + 1, sy + 1, this.cellSize - 2, this.cellSize - 2);

                    // Center Slate Data Node Pip
                    this.ctx.fillStyle = PALETTE.slate;
                    this.ctx.fillRect(sx + 5, sy + 5, this.cellSize - 10, this.cellSize - 10);
                }
            }

            // Draw Particles
            for (let p of this.particles) {
                this.ctx.save();
                const alpha = p.life / p.maxLife;
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = alpha;
                this.ctx.fillRect(p.x - 1, p.y - 1, 3, 3);
                this.ctx.restore();
            }

            // Game Over Overlay
            if (this.gameOver) {
                this.ctx.save();
                this.ctx.fillStyle = 'rgba(8, 12, 22, 0.9)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                this.ctx.textAlign = 'center';
                this.ctx.fillStyle = PALETTE.coral;
                this.ctx.font = '700 20px "Inter", sans-serif';
                this.ctx.fillText('ROUTING COLLISION // BUFFER FAULT', this.canvas.width / 2, this.canvas.height / 2 - 24);

                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '600 14px "Inter", sans-serif';
                this.ctx.fillText(`Packets Routed: ${this.score}  |  Bus Segments: ${this.snake.length}`, this.canvas.width / 2, this.canvas.height / 2 + 6);

                const hs = this.getHighScore();
                if (this.score >= hs && this.score > 0) {
                    this.ctx.fillStyle = PALETTE.gold;
                    this.ctx.font = '700 12px "Inter", sans-serif';
                    this.ctx.fillText('★ PEAK NETWORK BUFFER BENCHMARK ACHIEVED ★', this.canvas.width / 2, this.canvas.height / 2 + 30);
                }

                this.ctx.fillStyle = PALETTE.slate;
                this.ctx.font = '500 12px "Inter", sans-serif';
                this.ctx.fillText('Press ANY ARROW KEY or Click RE-ROUTE to Restore Stream', this.canvas.width / 2, this.canvas.height / 2 + 58);

                this.ctx.restore();
            }
        }

        startLoop() {
            const loop = (currentTime) => {
                if (currentTime - this.lastTickTime >= this.tickRate) {
                    this.step();
                    this.lastTickTime = currentTime;
                }
                this.update();
                this.draw();
                requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        }
    }

    /* ==========================================================================
       Master Initialization on DOM Ready (All 3 Diagnostic Games)
       ========================================================================== */

    document.addEventListener('DOMContentLoaded', () => {
        window.TelemetryInstance = new TelemetryCalibrationGame();
        window.DecryptionInstance = new CryptographicDecryptionGame();
        window.PacketInstance = new PacketRoutingGame();
    });

})();
