<?php
/**
 * Sector Am2r: Dynamic Main Hub
 * Parses data/database.xml to generate glassmorphic game cards.
 * Features:
 * - Dynamic AJAX Game Guide Injection into #dynamic-content without page reload
 * - Synthetic Web Audio API Acoustic Feedback (Sine Beeps & Square Thuds)
 * - Mouse-Tracking Parallax Mesh Gradient
 * - Solid Matte Enterprise Diagnostics Suite:
 *   1. Telemetry Calibration (Orbital Vector Sim)
 *   2. Cryptographic Decryption (4x4 Geometric Matrix)
 *   3. Packet Routing (Network Data Bus Link)
 */

$xmlFile = __DIR__ . '/data/database.xml';
if (!file_exists($xmlFile)) {
    die("Database XML file not found at " . htmlspecialchars($xmlFile));
}

$xml = simplexml_load_file($xmlFile);
if ($xml === false) {
    die("Failed to parse database.xml.");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sector Am2r: Curated Game Walkthroughs &amp; Guides</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>

    <!-- Mouse-Tracking Mesh Parallax Background Layer -->
    <div class="mesh-parallax-bg" aria-hidden="true"></div>

    <!-- Solid Matte Enterprise Site Header -->
    <header class="site-header">
        <div class="container header-content">
            <div class="site-brand">
                <h1 class="site-title">
                    <span>Sector Am2r</span>
                    <span class="title-tag">PHP // XML CORE</span>
                </h1>
                <p class="site-subtitle">Underground tactical walkthrough hub &amp; hardware calibration repository</p>
            </div>
            <nav class="nav-links">
                <a href="index.php" class="nav-pill active">Main Hub</a>
                <a href="#diagnostics-section" class="nav-pill">System Diagnostics</a>
                <button id="audio-toggle-btn" class="nav-pill audio-active" type="button" aria-label="Toggle Acoustic Audio">
                    <span>🔊</span> Acoustic Feedback: ON
                </button>
            </nav>
        </div>
    </header>

    <!-- Main Container -->
    <main class="container">
        
        <!-- Hero Introduction -->
        <section class="hub-hero">
            <div class="hero-badge">
                <span class="pulse-dot"></span>
                <span>Enterprise Dashboard // Sector Active</span>
            </div>
            <h2>Curated Walkthroughs &amp; <span>Tactical Guides</span></h2>
            <p>Access decrypted campaign directives, hardware optimization logs, acoustic calibration curves, and interactive sector blueprints.</p>
        </section>

        <!-- Dynamic AJAX / Fetch Guide Container -->
        <!-- Populated via get_game.php when clicking any game card without page reload -->
        <div id="dynamic-content" class="dynamic-content-wrapper" style="display: none;"></div>

        <!-- Dynamic Game Cards Grid (Parsed via SimpleXML) -->
        <section>
            <div class="section-header">
                <h3>
                    <span>Tactical Field Archives</span>
                    <span class="title-tag"><?= count($xml->game) ?> Active Records</span>
                </h3>
                <span class="subtext">Dynamic XML Data Ingestion Active // Click to Stream Intel</span>
            </div>

            <div class="game-grid">
                <?php foreach ($xml->game as $game): ?>
                    <?php 
                        $id = (string)$game['id'];
                        $title = (string)$game->title;
                        $genre = (string)$game->genre;
                        $badge = (string)$game->badge;
                        $summary = (string)$game->summary;
                        $difficulty = (string)$game->difficulty;
                        $time = (string)$game->time;
                        $banner = (string)$game->banner;
                    ?>
                    <a href="game.php?id=<?= urlencode($id) ?>" class="game-card" data-game-id="<?= htmlspecialchars($id) ?>">
                        <div class="card-media-wrap">
                            <span class="card-badge"><?= htmlspecialchars($badge) ?></span>
                            <img src="<?= htmlspecialchars($banner) ?>" alt="<?= htmlspecialchars($title) ?> Tactical Banner" class="card-banner-img" loading="lazy">
                        </div>
                        <div class="card-content">
                            <h3 class="card-title"><?= htmlspecialchars($title) ?></h3>
                            <span class="card-genre"><?= htmlspecialchars($genre) ?></span>
                            <p class="card-summary"><?= htmlspecialchars($summary) ?></p>

                            <div class="card-meta-bar">
                                <div class="meta-col">
                                    <span class="meta-label">Difficulty</span>
                                    <span class="meta-value"><?= htmlspecialchars($difficulty) ?></span>
                                </div>
                                <div class="meta-col">
                                    <span class="meta-label">Est. Time</span>
                                    <span class="meta-value"><?= htmlspecialchars($time) ?></span>
                                </div>
                            </div>

                            <div class="card-btn">
                                <span>Inspect Guide &amp; Calibration</span>
                                <span>&rarr;</span>
                            </div>
                        </div>
                    </a>
                <?php endforeach; ?>
            </div>
        </section>

        <!-- Interactive System Diagnostics (Solid Matte 3-Game Grid) -->
        <section class="arcade-widget" id="diagnostics-section">
            <div id="arcade-section" style="position: absolute; margin-top: -80px;"></div>
            <div class="section-header" style="margin-bottom: 24px;">
                <div>
                    <span class="title-tag">ENTERPRISE DIAGNOSTIC SUITE</span>
                    <h3 style="margin-top: 6px;">Interactive System Diagnostics</h3>
                </div>
                <span class="subtext">Hardware-Accelerated Real-Time Telemetry &amp; Protocol Calibration</span>
            </div>

            <div class="arcade-grid">

                <!-- Game 1: Telemetry Calibration (formerly Void Drift) -->
                <div class="arcade-panel glass-panel" id="panel-void-drift">
                    <div class="arcade-panel-header">
                        <div class="arcade-title-group">
                            <span class="title-tag">ORBITAL VECTOR SIM</span>
                            <h4>Telemetry Calibration // Vector Stabilization</h4>
                        </div>
                        <button type="button" class="hud-action-btn" id="btn-restart-asteroids">Calibrate System</button>
                    </div>

                    <!-- Telemetry HUD -->
                    <div class="arcade-hud">
                        <div class="hud-stat-group">
                            <div class="hud-stat">
                                <span class="hud-label">Vector Align</span>
                                <span class="hud-value" id="asteroids-score">0</span>
                            </div>
                            <div class="hud-stat">
                                <span class="hud-label">Peak Metric</span>
                                <span class="hud-value" id="asteroids-highscore">0</span>
                            </div>
                            <div class="hud-stat">
                                <span class="hud-label">Integrity</span>
                                <span class="hud-value" id="asteroids-shields">♥♥♥</span>
                            </div>
                            <div class="hud-stat">
                                <span class="hud-label">Vector Phase</span>
                                <span class="hud-value" id="asteroids-wave">W-1</span>
                            </div>
                        </div>
                    </div>

                    <!-- Canvas Container -->
                    <div class="arcade-canvas-wrap">
                        <canvas id="canvas-void-drift" width="480" height="360" class="arcade-canvas" tabindex="0" aria-label="Telemetry Calibration Canvas"></canvas>
                    </div>

                    <!-- Controls Guide -->
                    <div class="arcade-controls-guide">
                        <div class="arcade-keys">
                            <kbd class="arcade-key">W</kbd> Thrust
                            <kbd class="arcade-key">A</kbd><kbd class="arcade-key">D</kbd> Turn
                            <kbd class="arcade-key">S</kbd> Brake
                            <kbd class="arcade-key">SPACE</kbd> Pulse Beam
                        </div>
                        <span class="controls-hint">Click canvas to calibrate</span>
                    </div>
                </div>

                <!-- Game 2: Cryptographic Decryption (formerly Cyber Match) -->
                <div class="arcade-panel glass-panel" id="panel-cyber-match">
                    <div class="arcade-panel-header">
                        <div class="arcade-title-group">
                            <span class="title-tag">4x4 CIPHER ARRAY</span>
                            <h4>Cryptographic Decryption // Key Matrix</h4>
                        </div>
                        <button type="button" class="hud-action-btn" id="btn-restart-memory">Re-Index Array</button>
                    </div>

                    <!-- Decryption HUD -->
                    <div class="arcade-hud">
                        <div class="hud-stat-group">
                            <div class="hud-stat">
                                <span class="hud-label">Cipher Score</span>
                                <span class="hud-value" id="memory-score">0</span>
                            </div>
                            <div class="hud-stat">
                                <span class="hud-label">Peak Record</span>
                                <span class="hud-value" id="memory-highscore">0</span>
                            </div>
                            <div class="hud-stat">
                                <span class="hud-label">Matched Keys</span>
                                <span class="hud-value" id="memory-matched">0 / 8</span>
                            </div>
                            <div class="hud-stat">
                                <span class="hud-label">Cycle Time</span>
                                <span class="hud-value" id="memory-time">00:00</span>
                            </div>
                        </div>
                    </div>

                    <!-- Canvas Container -->
                    <div class="arcade-canvas-wrap">
                        <canvas id="canvas-cyber-match" width="480" height="360" class="arcade-canvas" aria-label="Cryptographic Decryption 4x4 Canvas"></canvas>
                    </div>

                    <!-- Controls Guide -->
                    <div class="arcade-controls-guide">
                        <div class="arcade-keys">
                            <kbd class="arcade-key">MOUSE CLICK</kbd> Reveal &amp; Pair Minimalist Geometric Ciphers
                        </div>
                        <span class="controls-hint">Attempts: <strong id="memory-moves" style="color:#ffffff;">0</strong></span>
                    </div>
                </div>

                <!-- Game 3: Packet Routing (Professional Snake Clone) -->
                <div class="arcade-panel glass-panel" id="panel-packet-routing">
                    <div class="arcade-panel-header">
                        <div class="arcade-title-group">
                            <span class="title-tag">NETWORK BUFFER BUS</span>
                            <h4>Packet Routing // Stream Link</h4>
                        </div>
                        <button type="button" class="hud-action-btn" id="btn-restart-packet">Re-Route Packets</button>
                    </div>

                    <!-- Packet Routing HUD -->
                    <div class="arcade-hud">
                        <div class="hud-stat-group">
                            <div class="hud-stat">
                                <span class="hud-label">Packets Routed</span>
                                <span class="hud-value" id="packet-score">0</span>
                            </div>
                            <div class="hud-stat">
                                <span class="hud-label">Buffer Record</span>
                                <span class="hud-value" id="packet-highscore">0</span>
                            </div>
                            <div class="hud-stat">
                                <span class="hud-label">Bus Length</span>
                                <span class="hud-value" id="packet-length">4</span>
                            </div>
                            <div class="hud-stat">
                                <span class="hud-label">Throughput</span>
                                <span class="hud-value" id="packet-speed">100 MHz</span>
                            </div>
                        </div>
                    </div>

                    <!-- Canvas Container -->
                    <div class="arcade-canvas-wrap">
                        <canvas id="packetCanvas" width="480" height="360" class="arcade-canvas" tabindex="0" aria-label="Packet Routing Simulator Canvas"></canvas>
                    </div>

                    <!-- Controls Guide -->
                    <div class="arcade-controls-guide">
                        <div class="arcade-keys">
                            <kbd class="arcade-key">&uarr;</kbd><kbd class="arcade-key">&larr;</kbd><kbd class="arcade-key">&darr;</kbd><kbd class="arcade-key">&rarr;</kbd> Vector Steering
                        </div>
                        <span class="controls-hint">Edge-wall collision: Terminal Fault</span>
                    </div>
                </div>

            </div>
        </section>

    </main>

    <!-- Frosted Glass Footer -->
    <footer class="site-footer">
        <div class="container">
            <p>&copy; <?= date('Y') ?> Sector Am2r // Dynamic PHP &amp; XML Architecture. Enterprise Solid Matte Finish.</p>
        </div>
    </footer>

    <!-- Master Scripts -->
    <script src="js/app.js"></script>
    <script src="js/arcade.js"></script>
</body>
</html>
