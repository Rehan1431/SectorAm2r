<?php
/**
 * Sector Am2r: Dynamic Game Guide Template
 * Loads game node matching $_GET['id'] from data/database.xml.
 * Renders tactical walkthrough, interactive datapads, gameplay map, character dossiers, calibration tables, and lore.
 */

$xmlFile = __DIR__ . '/data/database.xml';
if (!file_exists($xmlFile)) {
    die("Database XML file not found at " . htmlspecialchars($xmlFile));
}

$xml = simplexml_load_file($xmlFile);
if ($xml === false) {
    die("Failed to parse database.xml.");
}

$gameId = isset($_GET['id']) ? trim($_GET['id']) : 're-requiem';
$game = null;

foreach ($xml->game as $g) {
    if ((string)$g['id'] === $gameId) {
        $game = $g;
        break;
    }
}

// Fallback to the first game if id not found
if (!$game) {
    $game = $xml->game[0];
    $gameId = (string)$game['id'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($game->title) ?> - Tactical Walkthrough &amp; Guide</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>

    <!-- Mouse-Tracking Mesh Parallax Background Layer -->
    <div class="mesh-parallax-bg" aria-hidden="true"></div>

    <!-- Frosted Glass Header -->
    <header class="site-header">
        <div class="container header-content">
            <div class="site-brand">
                <a href="index.php" class="site-title">
                    <span>Sector Am2r</span>
                    <span class="title-tag">ARCHIVE // <?= htmlspecialchars($game['id']) ?></span>
                </a>
                <p class="site-subtitle"><?= htmlspecialchars($game->subtitle) ?></p>
            </div>
            <nav class="nav-links">
                <a href="index.php" class="nav-pill">&larr; Return to Hub</a>
                <button id="audio-toggle-btn" class="nav-pill audio-active" type="button" aria-label="Toggle Acoustic Audio">
                    <span>🔊</span> Acoustic Feedback: ON
                </button>
            </nav>
        </div>
    </header>

    <main class="container">
        
        <!-- Breadcrumb / Back Bar -->
        <div class="page-nav">
            <a href="index.php" class="back-btn">&larr; Return to Main Terminal</a>
            <span class="title-tag"><?= htmlspecialchars($game->badge) ?></span>
        </div>

        <!-- Guide Hero Panel -->
        <section class="guide-hero">
            <h1><?= htmlspecialchars($game->title) ?></h1>
            <p style="color: var(--text-soft-white); font-size: 1.05rem; line-height: 1.6; max-width: 900px;">
                <?= htmlspecialchars($game->summary) ?>
            </p>
            <div class="guide-meta">
                <div class="guide-meta-item">Developer: <strong><?= htmlspecialchars($game->developer) ?></strong></div>
                <div class="guide-meta-item">Estimated Time: <span class="highlight"><?= htmlspecialchars($game->time) ?></span></div>
                <div class="guide-meta-item">Recommended Difficulty: <span class="highlight"><?= htmlspecialchars($game->difficulty) ?></span></div>
                <div class="guide-meta-item">Target Rig: <span class="highlight"><?= htmlspecialchars($game->target_hardware) ?></span></div>
                <div class="guide-meta-item">Acoustic Spec: <span class="highlight"><?= htmlspecialchars($game->audio_target) ?></span></div>
            </div>
        </section>

        <!-- Section 1: Walkthrough & Tactical Progression -->
        <section class="guide-section">
            <h2 class="section-heading">
                <span>1. Tactical Walkthrough &amp; Mission Directives</span>
                <span class="title-tag">Step-by-step Campaign</span>
            </h2>

            <ol class="walkthrough-list">
                <?php foreach ($game->walkthrough->step as $step): ?>
                    <li>
                        <span class="step-title"><?= htmlspecialchars($step->title) ?></span>
                        <p><?= htmlspecialchars($step->text) ?></p>

                        <?php if (isset($step->datapad)): ?>
                            <details class="datapad">
                                <summary class="datapad-summary">
                                    <span class="datapad-btn-text">
                                        <span class="datapad-arrow">&rarr;</span>
                                        [ <?= htmlspecialchars($step->datapad->datapad_title) ?> ]
                                    </span>
                                    <span class="spec-badge"><?= htmlspecialchars($step->datapad->datapad_badge) ?></span>
                                </summary>
                                <div class="datapad-body">
                                    <p><?= htmlspecialchars($step->datapad->datapad_text) ?></p>
                                    <div>Override Sequence: <span class="datapad-code"><?= htmlspecialchars($step->datapad->datapad_code) ?></span></div>
                                    <?php if (!empty($step->datapad->datapad_note)): ?>
                                        <p style="margin-top: 8px; font-size: 0.85rem; color: var(--text-muted);"><?= htmlspecialchars($step->datapad->datapad_note) ?></p>
                                    <?php endif; ?>
                                </div>
                            </details>
                        <?php endif; ?>
                    </li>
                <?php endforeach; ?>
            </ol>
        </section>

        <!-- Section 2: Gameplay, Snapshots & Interactive Map -->
        <section class="guide-section">
            <h2 class="section-heading">
                <span>2. Visual Intelligence &amp; Sector Radar</span>
                <span class="title-tag">Cartography</span>
            </h2>

            <!-- Snapshots Grid -->
            <div class="media-grid">
                <?php if (isset($game->snapshots->snapshot)): ?>
                    <?php foreach ($game->snapshots->snapshot as $snap): ?>
                        <div class="snapshot-box">
                            <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor" style="opacity: 0.7; margin-bottom: 8px;">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                            <strong><?= htmlspecialchars($snap->title) ?></strong>
                            <span><?= htmlspecialchars($snap->caption) ?></span>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>

                <!-- Video Mock Box -->
                <?php if (isset($game->snapshots->video_mock)): ?>
                    <div class="video-large-box">
                        <div class="video-mock-player">
                            <div class="video-play-icon">
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                            <strong><?= htmlspecialchars($game->snapshots->video_mock->title) ?></strong>
                            <span style="font-size: 0.85rem; color: var(--accent-coral); margin-top: 4px;"><?= htmlspecialchars($game->snapshots->video_mock->subtext) ?></span>
                        </div>
                        <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 680px;"><?= htmlspecialchars($game->snapshots->video_mock->caption_desc) ?></p>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Interactive CSS Hover Map -->
            <?php if (isset($game->map)): ?>
                <div style="margin-top: 32px;">
                    <h3 style="font-size: 1.15rem; color: #ffffff; margin-bottom: 6px;"><?= htmlspecialchars($game->map->title) ?></h3>
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 14px;"><?= htmlspecialchars($game->map->subtitle) ?></p>

                    <div class="map-container">
                        <?php if (!empty($game->map->svg_image)): ?>
                            <img src="<?= htmlspecialchars($game->map->svg_image) ?>" alt="Sector Map Background" class="map-bg-placeholder">
                        <?php endif; ?>

                        <div class="map-grid-overlay">
                            <span style="font-size: 0.82rem; color: var(--accent-coral); font-weight: 700;"><?= htmlspecialchars($game->map->radar_label) ?></span>
                            <span style="font-size: 0.75rem; color: var(--text-muted);"><?= htmlspecialchars($game->map->radar_coords) ?></span>
                        </div>

                        <?php if (isset($game->map->markers->marker)): ?>
                            <?php foreach ($game->map->markers->marker as $marker): ?>
                                <div class="map-marker" style="top: <?= htmlspecialchars($marker['top']) ?>; left: <?= htmlspecialchars($marker['left']) ?>;">
                                    <div class="marker-tooltip">
                                        <strong><?= htmlspecialchars($marker->title) ?></strong>
                                        <span><?= htmlspecialchars($marker->desc) ?></span>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>

                        <div class="map-legend">Pulsing Coral Markers: <span>Interactive Waypoints</span> (Hover to inspect)</div>
                    </div>
                </div>
            <?php endif; ?>
        </section>

        <!-- Section 3: Character Models & Faction Intel -->
        <?php if (isset($game->characters->character)): ?>
            <section class="guide-section">
                <h2 class="section-heading">
                    <span>3. Character Models &amp; Biometrics</span>
                    <span class="title-tag">Personnel Dossier</span>
                </h2>

                <div class="character-grid">
                    <?php foreach ($game->characters->character as $char): ?>
                        <div class="character-card">
                            <div class="character-placeholder">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                                <strong>3D Model View: <?= htmlspecialchars($char->name) ?></strong>
                                <span><?= htmlspecialchars($char['role']) ?></span>
                            </div>
                            <div class="character-details">
                                <div class="character-role"><?= htmlspecialchars($char['role']) ?></div>
                                <h3 class="character-name"><?= htmlspecialchars($char->name) ?></h3>
                                <p class="character-bio"><?= htmlspecialchars($char->bio) ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </section>
        <?php endif; ?>

        <!-- Section 4: System Calibration Logs (Hardware & Audio Tables) -->
        <?php if (isset($game->calibration)): ?>
            <section class="guide-section">
                <h2 class="section-heading">
                    <span>4. System Calibration Logs</span>
                    <span class="title-tag">RTX 3050 &amp; Acoustic Optimization</span>
                </h2>

                <!-- Hardware Calibration Table -->
                <?php if (isset($game->calibration->hardware)): ?>
                    <?php $hw = $game->calibration->hardware; ?>
                    <div class="calibration-card">
                        <h3>
                            <span><?= htmlspecialchars($hw->title) ?></span>
                            <span class="spec-badge"><?= htmlspecialchars($hw->target) ?></span>
                        </h3>
                        <p class="calibration-subtitle"><?= htmlspecialchars($hw->subtitle) ?></p>

                        <table class="calibration-table">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Optimal Setting</th>
                                    <th>Performance Justification &amp; Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($hw->row as $r): ?>
                                    <tr>
                                        <td class="table-label"><?= htmlspecialchars($r->param) ?></td>
                                        <td class="table-val"><?= htmlspecialchars($r->value) ?></td>
                                        <td class="table-note"><?= htmlspecialchars($r->impact) ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>

                <!-- Audio Calibration Table -->
                <?php if (isset($game->calibration->audio)): ?>
                    <?php $au = $game->calibration->audio; ?>
                    <div class="calibration-card">
                        <h3>
                            <span><?= htmlspecialchars($au->title) ?></span>
                            <span class="spec-badge"><?= htmlspecialchars($au->target) ?></span>
                        </h3>
                        <p class="calibration-subtitle"><?= htmlspecialchars($au->subtitle) ?></p>

                        <table class="calibration-table">
                            <thead>
                                <tr>
                                    <th>Frequency Band</th>
                                    <th>Gain Offset</th>
                                    <th>Acoustic Role &amp; Clarity Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($au->row as $r): ?>
                                    <tr>
                                        <td class="table-label"><?= htmlspecialchars($r->band) ?></td>
                                        <td class="table-val"><?= htmlspecialchars($r->gain) ?></td>
                                        <td class="table-note"><?= htmlspecialchars($r->role) ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </section>
        <?php endif; ?>

        <!-- Section 5: Lore & Development Trivia -->
        <?php if (isset($game->lore->item)): ?>
            <section class="guide-section">
                <h2 class="section-heading">
                    <span>5. Historical Lore &amp; Development Trivia</span>
                    <span class="title-tag">Production Records</span>
                </h2>

                <ul class="trivia-list">
                    <?php foreach ($game->lore->item as $item): ?>
                        <li>
                            <strong><?= htmlspecialchars($item->title) ?>:</strong>
                            <?= htmlspecialchars($item->fact) ?>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </section>
        <?php endif; ?>

    </main>

    <!-- Frosted Glass Footer -->
    <footer class="site-footer">
        <div class="container">
            <p>&copy; <?= date('Y') ?> Sector Am2r // Dynamic PHP &amp; XML Architecture. <a href="index.php">Return to Main Hub</a></p>
        </div>
    </footer>

    <!-- Master Scripts -->
    <script src="js/app.js"></script>
</body>
</html>
