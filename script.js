/**
 * Sector Am2r - Main Terminal Controller
 * Real-time CLI Parser, Live Archive Search, and Data Binding
 */

let gamesDatabase = [];

document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('game-search');
    const cursor = document.getElementById('cursor');
    const terminalWrapper = document.querySelector('.terminal-wrapper');
    const terminalOutput = document.getElementById('terminal-output');
    const resultsGrid = document.getElementById('search-results-grid');
    const matchCount = document.getElementById('grid-match-count');

    // Focus input when clicking anywhere inside the terminal wrapper (unless selecting text or clicking links)
    terminalWrapper.addEventListener('click', (e) => {
        if (!e.target.closest('a') && !e.target.closest('button')) {
            searchInput.focus();
        }
    });

    // Cursor typing effect
    searchInput.addEventListener('input', () => {
        cursor.style.animation = 'none';
        cursor.style.opacity = '1';
        clearTimeout(window.cursorTimeout);
        window.cursorTimeout = setTimeout(() => {
            cursor.style.animation = 'blink 1s step-end infinite';
        }, 400);

        // Real-time live search filter
        handleSearchInput(searchInput.value.trim());
    });

    // Handle Enter key for CLI commands
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawCommand = searchInput.value.trim();
            if (rawCommand) {
                executeCommand(rawCommand);
            }
        }
    });

    // =========================================================================
    // THE KONAMI CODE EASTER EGG (ArrowUp, ArrowUp, ArrowDown, ArrowDown, ...)
    // =========================================================================
    const KONAMI_SEQUENCE = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let konamiCurrentIndex = 0;

    window.addEventListener('keydown', (e) => {
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        const expectedKey = KONAMI_SEQUENCE[konamiCurrentIndex].toLowerCase();

        if (key === expectedKey) {
            konamiCurrentIndex++;
            if (konamiCurrentIndex === KONAMI_SEQUENCE.length) {
                e.preventDefault();
                konamiCurrentIndex = 0;
                triggerKonamiEasterEgg();
            }
        } else {
            // Reset sequence or check if this key starts the sequence afresh
            konamiCurrentIndex = (key === KONAMI_SEQUENCE[0].toLowerCase()) ? 1 : 0;
        }
    });

    function triggerKonamiEasterEgg() {
        // 1. Clear terminal output screen and input
        terminalOutput.innerHTML = '';
        searchInput.value = '';

        // 2. Forcefully override CSS variables to exclusive flashing Critical Alert Crimson theme
        applyTheme('critical-alert');

        // 3. Play biohazard alarm audio
        try {
            const alarmAudio = new Audio('assets/audio/biohazard_alert.wav');
            alarmAudio.volume = 0.7;
            alarmAudio.play().catch(() => {});
        } catch (err) {
            // Audio autoplay policy fallback
        }

        // 4. Update status badges
        if (matchCount) {
            matchCount.textContent = '[ALERT: SYSTEM OVERRIDE ACTIVE // TITAN-REQUIEM]';
        }

        // 5. Print classified ASCII art skull and alert message
        const skullContainer = document.createElement('pre');
        skullContainer.className = 'terminal-line cmd-error';
        skullContainer.style.fontSize = '0.82rem';
        skullContainer.style.lineHeight = '1.25';
        skullContainer.style.margin = '10px 0';
        skullContainer.textContent = `
========================================================================================
[!] CRITICAL ALERT // ROOT SYSTEM BREACH DETECTED // PROTOCOL 66 OVERRIDE [!]
========================================================================================

                 .ed"""" """$$$$be.
               -"           ^""**$$$e.
             ."                   '$$$c
            /                      "4$$b
           d  3                      $$$$
           $  *                   .$$$$$$
          .$  ^c           $$$$$e$$$$$$$$.
          d$L  4.         4$$$$$$$$$$$$$$b
          $$$$b ^ceeeee.  4$$ECL.O$*$$$$$
  e$""=. $$$$$$d$$$$$$$d$ecW$$"$"$$$$$$$
 M$"    "$$$$$P"  "'''*$$$P"  "''''*$$$$"
 '$*__   '"$P" --.     "$$         "$P"
  $"  ^'''ec   '   /    $'.        .d"
  ".     $  $     ;     $  ^"*-*"" "
   ^$e..'""  $\\"  .x    "  .-"
     ^"$        '""     /*"
        ^$e.   ;  .   _z*"
           ^""'''   ''"

========================================================================================
[CLASSIFIED BIOHAZARD ARCHIVE OVERRIDE]
SECURITY LEVEL : COMPROMISED // TITAN PROTOCOL ENGAGED
THREAT STATUS  : HOSTILE BIOLOGICAL CODE ACTIVATED
ALERT MODE     : FLASHING CRITICAL ALERT CRIMSON (FORCE-OVERRIDE)
========================================================================================
Type 'theme green', 'theme amber', or 'theme crimson' to restore standard monitoring.
`;
        terminalOutput.appendChild(skullContainer);
        terminalOutput.scrollTop = 0;
        searchInput.focus();
    }

    // Load games database
    try {
        const response = await fetch('data/games.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        gamesDatabase = await response.json();
        renderGameGrid(gamesDatabase);
        printTerminalLine(`[SYSTEM] DATA SUBSYSTEM INITIALIZED. ${gamesDatabase.length} ARCHIVE ENTRIES LOADED.`, 'cmd-success');
    } catch (err) {
        console.error('Failed to load games.json:', err);
        printTerminalLine(`[SYSTEM ERROR] FAILED TO LOAD ARCHIVE DATA: ${err.message}`, 'cmd-error');
    }

    /**
     * Executes recognized terminal commands or displays fallback message
     */
    function executeCommand(inputStr) {
        // Echo input command to terminal history
        printTerminalLine(`C:\\AM2R> ${inputStr}`, 'cmd-echo');

        const parts = inputStr.split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (command) {
            case 'help':
                printHelp();
                break;

            case 'list':
                printGameListTable();
                break;

            case 'open':
                if (args.length === 0) {
                    printTerminalLine(`[SYNTAX ERROR] Usage: open <game_id> (e.g. open re-requiem)`, 'cmd-error');
                } else {
                    const targetId = args[0].toLowerCase();
                    const targetGame = gamesDatabase.find(g => g.id.toLowerCase() === targetId);
                    if (targetGame) {
                        printTerminalLine(`[ACCESS GRANTED] Decrypting guide for: ${targetGame.title}...`, 'cmd-success');
                        setTimeout(() => {
                            window.location.href = targetGame.walkthroughUrl;
                        }, 500);
                    } else {
                        printTerminalLine(`[ERROR] Archive record '${targetId}' not found. Type 'list' to see valid game IDs.`, 'cmd-error');
                    }
                }
                break;

            case 'theme':
                if (args.length === 0) {
                    printTerminalLine(`[SYNTAX ERROR] Usage: theme <green|crimson|amber>`, 'cmd-error');
                } else {
                    const themeName = args[0].toLowerCase();
                    if (['green', 'crimson', 'amber'].includes(themeName)) {
                        applyTheme(themeName);
                        printTerminalLine(`[SYSTEM] Visual profile updated to: ${themeName.toUpperCase()}`, 'cmd-success');
                    } else {
                        printTerminalLine(`[ERROR] Unknown visual theme '${themeName}'. Valid options: green, crimson, amber`, 'cmd-error');
                    }
                }
                break;

            case 'clear':
                terminalOutput.innerHTML = '';
                break;

            default:
                // Check if the input is a direct search query that matched a game
                const searchMatches = filterGames(inputStr);
                if (searchMatches.length === 1) {
                    printTerminalLine(`[AUTO-MATCH] Direct query match '${searchMatches[0].title}'. Opening tactical guide...`, 'cmd-success');
                    setTimeout(() => {
                        window.location.href = searchMatches[0].walkthroughUrl;
                    }, 500);
                } else {
                    printTerminalLine(`[COMMAND NOT RECOGNIZED] '${command}'. Type 'help' for system commands or search by name.`, 'cmd-error');
                }
                break;
        }

        // Scroll terminal view into position
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    /**
     * Appends a message line to the terminal output area
     */
    function printTerminalLine(text, className = 'cmd-response') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        terminalOutput.appendChild(line);
    }

    /**
     * Displays system command manual
     */
    function printHelp() {
        const helpBlock = document.createElement('div');
        helpBlock.className = 'terminal-line cmd-response';
        helpBlock.innerHTML = `
========================= SECTOR AM2R COMMAND MANUAL =========================
  help                     : Display this system operational manual.
  list                     : Output ASCII-styled table of all archived games.
  open &lt;game_id&gt;          : Launch tactical walkthrough for the specified ID.
  theme &lt;green|crimson|amber&gt; : Dynamically toggle CRT glow & terminal palette.
  clear                    : Flush command history buffer.
-----------------------------------------------------------------------------
* Real-time search: Type any title or keyword (e.g. 'Resident', 'Requiem') 
  in the prompt to instantly filter visual cards below.
=============================================================================`;
        terminalOutput.appendChild(helpBlock);
    }

    /**
     * Prints an ASCII-styled catalog table of all archived games
     */
    function printGameListTable() {
        if (!gamesDatabase || gamesDatabase.length === 0) {
            printTerminalLine('[ERROR] No database records loaded.', 'cmd-error');
            return;
        }

        let ascii = `
+----------------+-------------------------------+----------------------+----------------------+
| GAME ID        | TITLE                         | GENRE                | STATUS               |
+----------------+-------------------------------+----------------------+----------------------+
`;
        gamesDatabase.forEach(g => {
            const id = g.id.padEnd(14, ' ').slice(0, 14);
            const title = g.title.padEnd(29, ' ').slice(0, 29);
            const genre = g.genre.padEnd(20, ' ').slice(0, 20);
            const status = g.status.padEnd(20, ' ').slice(0, 20);
            ascii += `| ${id} | ${title} | ${genre} | ${status} |\n`;
        });
        ascii += `+----------------+-------------------------------+----------------------+----------------------+
Type 'open <game_id>' to launch guide (e.g. open re-requiem)`;

        const pre = document.createElement('pre');
        pre.className = 'ascii-table';
        pre.textContent = ascii;
        terminalOutput.appendChild(pre);
    }

    /**
     * Filters games based on search query
     */
    function filterGames(query) {
        if (!query) return gamesDatabase;
        const q = query.toLowerCase();
        return gamesDatabase.filter(g => 
            g.title.toLowerCase().includes(q) ||
            g.id.toLowerCase().includes(q) ||
            g.genre.toLowerCase().includes(q) ||
            g.summary.toLowerCase().includes(q)
        );
    }

    /**
     * Handles typing in search input
     */
    function handleSearchInput(query) {
        // Don't treat exact command prefixes as a search query if user is typing a command
        const firstWord = query.split(' ')[0].toLowerCase();
        if (['help', 'list', 'clear', 'theme', 'open'].includes(firstWord) && query.length < 8) {
            matchCount.textContent = `[COMMAND MODE: ${firstWord.toUpperCase()}]`;
            return;
        }

        const filtered = filterGames(query);
        renderGameGrid(filtered);
    }

    /**
     * Renders visual grid of matching game cards using semantic <a> tags
     */
    function renderGameGrid(games) {
        resultsGrid.innerHTML = '';
        if (games.length === 0) {
            resultsGrid.innerHTML = `
                <div class="no-results">
                    &gt;&gt; NO ARCHIVE RECORDS MATCH SEARCH CRITERIA &lt;&lt;
                    <br><br>
                    <span style="font-size:0.85rem;color:var(--text-muted)">Try searching "Resident", "Requiem", "AM2R", or "Silent"</span>
                </div>
            `;
            matchCount.textContent = `0 MATCHES`;
            return;
        }

        matchCount.textContent = `${games.length} RECORD(S) AVAILABLE`;

        games.forEach(game => {
            // Semantic <a> tag as card container
            const card = document.createElement('a');
            card.href = game.walkthroughUrl;
            card.className = 'game-card';
            card.setAttribute('aria-label', `Open tactical guide for ${game.title}`);

            card.innerHTML = `
                <div class="card-banner-wrapper">
                    <img src="${game.bannerImage}" alt="${game.title} Tactical Banner" class="card-banner-img" loading="lazy">
                    <div class="card-status-badge">${game.status}</div>
                </div>
                <div class="card-body">
                    <div class="card-title rgb-shift">${game.title}</div>
                    <div class="card-genre">${game.genre} // ID: ${game.id}</div>
                    <p class="card-summary">${game.summary}</p>
                    
                    <div class="card-stats">
                        <div class="stat-item">
                            <span class="stat-label">Difficulty</span>
                            <span class="stat-value">${game.quickStats.difficulty}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Est. Time</span>
                            <span class="stat-value">${game.quickStats.completionTime}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Access</span>
                            <span class="stat-value" style="color:var(--neon-green)">CLEARED</span>
                        </div>
                    </div>

                    <div class="card-actions">
                        <span class="btn-terminal">TACTICAL GUIDE &gt;</span>
                        <a href="${game.dossierUrl}" class="btn-terminal secondary" onclick="event.stopPropagation();">DOSSIER &gt;</a>
                    </div>
                </div>
            `;

            resultsGrid.appendChild(card);
        });
    }
});
