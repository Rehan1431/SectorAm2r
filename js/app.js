/**
 * Sector Am2r: Master Application Controller
 * Features:
 * 1. Web Audio API Acoustic Feedback Engine (Synthetic Sine Beeps & Square Thuds)
 * 2. Mouse-Tracking Mesh Gradient Parallax Shift
 * 3. Dynamic AJAX / Fetch API Game Guide Routing & Injection (#dynamic-content)
 */

(function () {
    'use strict';

    /* ==========================================================================
       1. SYNTHETIC WEB AUDIO API ACOUSTIC FEEDBACK
       Zero external audio files; all tones synthesized purely via JS math.
       ========================================================================== */

    class AcousticEngine {
        constructor() {
            this.ctx = null;
            // Default to enabled unless user previously disabled
            const stored = localStorage.getItem('sector_am2r_audio_enabled');
            this.enabled = stored !== null ? stored === 'true' : true;
            this.isInitialized = false;
        }

        init() {
            if (this.isInitialized && this.ctx) return;
            try {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) return;
                this.ctx = new AudioContextClass();
                this.isInitialized = true;
            } catch (e) {
                console.warn('[Sector Am2r Audio] Web Audio API initialization blocked:', e);
            }
        }

        resume() {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        toggle() {
            this.enabled = !this.enabled;
            localStorage.setItem('sector_am2r_audio_enabled', this.enabled ? 'true' : 'false');
            if (this.enabled) {
                this.init();
                this.resume();
                this.playHoverBeep();
            }
            return this.enabled;
        }

        /**
         * Synthetic Sine wave hover-beep
         * Frequency: 880Hz (A5) -> 1046Hz (C6) fast sweep
         * Envelope: 35ms linear ramp and exponential decay
         */
        playHoverBeep() {
            if (!this.enabled) return;
            try {
                this.init();
                this.resume();
                if (!this.ctx) return;

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.035);

                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.linearRampToValueAtTime(0.03, now + 0.005);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.045);
            } catch (err) {}
        }

        /**
         * Synthetic Square wave click-thud
         * Frequency: 160Hz -> 42Hz low-frequency drop
         * Filtered through a lowpass biquad to give a solid mechanical tactile thud
         */
        playClickThud() {
            if (!this.enabled) return;
            try {
                this.init();
                this.resume();
                if (!this.ctx) return;

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();

                // Mechanical Square wave generator
                osc.type = 'square';
                osc.frequency.setValueAtTime(160, now);
                osc.frequency.exponentialRampToValueAtTime(42, now + 0.075);

                // Low-pass filter to soften edge into a resonant thud
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(650, now);
                filter.frequency.exponentialRampToValueAtTime(180, now + 0.075);
                filter.Q.setValueAtTime(1.8, now);

                // Punchy gain envelope
                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.linearRampToValueAtTime(0.075, now + 0.005);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.085);
            } catch (err) {}
        }

        /**
         * Laser burst chime for arcade interactions
         */
        playLaserChirp() {
            if (!this.enabled) return;
            try {
                this.init();
                this.resume();
                if (!this.ctx) return;

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(950, now);
                osc.frequency.exponentialRampToValueAtTime(220, now + 0.07);

                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.linearRampToValueAtTime(0.045, now + 0.004);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.08);
            } catch (e) {}
        }

        /**
         * Deep blast thud for asteroid destruction or game over
         */
        playBlastThud() {
            if (!this.enabled) return;
            try {
                this.init();
                this.resume();
                if (!this.ctx) return;

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(110, now);
                osc.frequency.exponentialRampToValueAtTime(28, now + 0.22);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.09, now + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.26);
            } catch (e) {}
        }
    }

    // Expose instance globally for arcade game hooks
    window.SectorAudio = new AcousticEngine();

    /* ==========================================================================
       2. MOUSE-TRACKING MESH GRADIENT PARALLAX
       Smooth linear interpolation shifting Deep Navy & Coral radial gradients.
       ========================================================================== */

    function initMouseParallax() {
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let targetX = 0, targetY = 0;
        let rafId = null;

        window.addEventListener('mousemove', (e) => {
            const normX = (e.clientX / window.innerWidth) - 0.5; // -0.5 to 0.5
            const normY = (e.clientY / window.innerHeight) - 0.5;
            targetX = normX * 40; // -20px to +20px
            targetY = normY * 40;

            if (!rafId) {
                rafId = requestAnimationFrame(updateParallax);
            }
        }, { passive: true });

        function updateParallax() {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;

            document.documentElement.style.setProperty('--parallax-x', `${currentX.toFixed(2)}px`);
            document.documentElement.style.setProperty('--parallax-y', `${currentY.toFixed(2)}px`);

            if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
                rafId = requestAnimationFrame(updateParallax);
            } else {
                rafId = null;
            }
        }
    }

    /* ==========================================================================
       3. INTERACTIVE AUDIO LISTENERS ATTACHMENT
       ========================================================================== */

    function attachAcousticsToElements(container = document) {
        const hoverSelector = 'a, button, .game-card, .nav-pill, .hud-action-btn, .map-marker, summary.datapad-summary, .character-card';
        const elements = container.querySelectorAll(hoverSelector);

        elements.forEach(el => {
            if (el.dataset.audioBound) return;
            el.dataset.audioBound = 'true';

            el.addEventListener('mouseenter', () => {
                window.SectorAudio.playHoverBeep();
            }, { passive: true });

            el.addEventListener('click', () => {
                window.SectorAudio.playClickThud();
            });
        });
    }

    /* ==========================================================================
       4. DYNAMIC AJAX / FETCH API ROUTING & INJECTION
       Loads get_game.php into #dynamic-content without page reload.
       ========================================================================== */

    class DynamicRouter {
        constructor() {
            this.container = document.getElementById('dynamic-content');
            this.activeGameId = null;
            this.isLoading = false;
        }

        init() {
            if (!this.container) return;

            // Intercept clicks on Game Cards
            document.addEventListener('click', (e) => {
                const card = e.target.closest('.game-card');
                if (card) {
                    e.preventDefault();
                    let gameId = card.dataset.gameId;
                    if (!gameId) {
                        const href = card.getAttribute('href') || '';
                        const match = href.match(/[?&]id=([^&#]+)/);
                        gameId = match ? match[1] : null;
                    }

                    if (gameId) {
                        this.loadGame(gameId);
                    }
                }
            });

            // Handle browser popstate navigation (Back / Forward)
            window.addEventListener('popstate', (e) => {
                if (e.state && e.state.gameId) {
                    this.loadGame(e.state.gameId, false);
                } else {
                    const params = new URLSearchParams(window.location.search);
                    const idFromUrl = params.get('id');
                    if (idFromUrl) {
                        this.loadGame(idFromUrl, false);
                    } else {
                        this.collapseGuide();
                    }
                }
            });

            // Check if page loaded with ?id= query param
            const initialParams = new URLSearchParams(window.location.search);
            const initialGameId = initialParams.get('id');
            if (initialGameId) {
                this.loadGame(initialGameId, false);
            }
        }

        async loadGame(gameId, pushHistory = true) {
            if (this.isLoading) return;
            this.isLoading = true;
            this.activeGameId = gameId;

            // Highlight active game card
            document.querySelectorAll('.game-card').forEach(c => {
                const cId = c.dataset.gameId || (c.getAttribute('href') || '').split('id=')[1];
                if (cId === gameId) {
                    c.classList.add('active-selected');
                } else {
                    c.classList.remove('active-selected');
                }
            });

            // Show container and render loading skeleton
            this.container.style.display = 'block';
            this.container.innerHTML = `
                <div class="dynamic-loading-panel">
                    <div class="loading-scanner-bar"></div>
                    <div class="loading-content-msg">
                        <span class="loading-spinner"></span>
                        <div class="loading-text-group">
                            <h4>ACCESSING SECTOR ARCHIVE // [ ${gameId.toUpperCase()} ]</h4>
                            <p>Streaming XML node telemetry &amp; decrypting classified data layers...</p>
                        </div>
                    </div>
                </div>
            `;

            // Smooth scroll to container
            this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });

            try {
                const response = await fetch(`get_game.php?id=${encodeURIComponent(gameId)}&ajax=1`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                });

                if (!response.ok) {
                    throw new Error(`Server returned HTTP ${response.status}`);
                }

                const html = await response.text();
                this.container.innerHTML = html;

                // Update browser history
                if (pushHistory) {
                    const newUrl = `${window.location.pathname}?id=${encodeURIComponent(gameId)}`;
                    window.history.pushState({ gameId }, '', newUrl);
                }

                // Bind close button listeners
                this.bindGuideEvents();

                // Bind acoustic feedback to new elements inside guide
                attachAcousticsToElements(this.container);

            } catch (err) {
                console.error('[Sector Am2r Router] Failed to load tactical telemetry:', err);
                this.container.innerHTML = `
                    <div class="glass-panel dynamic-error-box">
                        <h3>Telemetry Stream Interrupted</h3>
                        <p>Failed to retrieve sector intel node [ ${gameId} ]. Verify XML database connectivity.</p>
                        <button type="button" class="back-btn close-guide-btn-bottom">Return to Catalog</button>
                    </div>
                `;
                this.bindGuideEvents();
            } finally {
                this.isLoading = false;
            }
        }

        bindGuideEvents() {
            const closeBtns = this.container.querySelectorAll('#close-dynamic-guide, .close-guide-btn-bottom');
            closeBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.collapseGuide();
                });
            });
        }

        collapseGuide() {
            window.SectorAudio.playClickThud();
            this.container.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            this.container.style.opacity = '0';
            this.container.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                this.container.style.display = 'none';
                this.container.innerHTML = '';
                this.container.style.opacity = '1';
                this.container.style.transform = 'none';
                this.activeGameId = null;

                // Clear card active rings
                document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active-selected'));

                // Clean URL query
                window.history.pushState({}, '', window.location.pathname);

                // Scroll back to game cards grid
                const grid = document.querySelector('.game-grid');
                if (grid) {
                    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 250);
        }
    }

    /* ==========================================================================
       5. INITIALIZATION ON DOM READY
       ========================================================================== */

    document.addEventListener('DOMContentLoaded', () => {
        // Init Mouse Parallax
        initMouseParallax();

        // Init Acoustic Elements
        attachAcousticsToElements();

        // Init Dynamic Routing
        const router = new DynamicRouter();
        router.init();

        // Audio Toggle Button in Header
        const audioBtn = document.getElementById('audio-toggle-btn');
        if (audioBtn) {
            const updateAudioBtnUI = () => {
                if (window.SectorAudio.enabled) {
                    audioBtn.innerHTML = '<span>🔊</span> Acoustic Feedback: ON';
                    audioBtn.classList.add('audio-active');
                } else {
                    audioBtn.innerHTML = '<span>🔇</span> Acoustic Feedback: OFF';
                    audioBtn.classList.remove('audio-active');
                }
            };

            updateAudioBtnUI();

            audioBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.SectorAudio.toggle();
                updateAudioBtnUI();
            });
        }

        // Global first-gesture AudioContext unblock
        const unblockAudio = () => {
            window.SectorAudio.init();
            window.SectorAudio.resume();
            window.removeEventListener('pointerdown', unblockAudio);
            window.removeEventListener('keydown', unblockAudio);
        };
        window.addEventListener('pointerdown', unblockAudio, { once: true });
        window.addEventListener('keydown', unblockAudio, { once: true });
    });

})();
