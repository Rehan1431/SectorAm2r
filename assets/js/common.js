/**
 * Sector Am2r - Common Subsystem
 * Shared CRT Shader, Theme Management, and Window Controls
 */

// Theme Management
const THEMES = ['green', 'crimson', 'amber', 'critical-alert'];

function getSavedTheme() {
    return localStorage.getItem('sector_am2r_theme') || 'green';
}

function applyTheme(themeName) {
    if (!THEMES.includes(themeName)) return false;
    document.body.classList.remove('theme-green', 'theme-crimson', 'theme-amber', 'theme-critical-alert');
    if (themeName !== 'green') {
        document.body.classList.add(`theme-${themeName}`);
    }
    localStorage.setItem('sector_am2r_theme', themeName);
    return true;
}

// Retro Window Header Controls
function initWindowControls() {
    const wrapper = document.querySelector('.terminal-wrapper');
    const minBtn = document.querySelector('.win-btn.minimize');
    const maxBtn = document.querySelector('.win-btn.maximize');
    const closeBtn = document.querySelector('.win-btn.close');

    if (minBtn && wrapper) {
        minBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.style.transition = 'all 0.3s ease';
            if (wrapper.style.transform === 'scale(0.85)') {
                wrapper.style.transform = 'scale(1)';
                wrapper.style.opacity = '1';
            } else {
                wrapper.style.transform = 'scale(0.85)';
                wrapper.style.opacity = '0.7';
            }
        });
    }

    if (maxBtn && wrapper) {
        maxBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.classList.toggle('maximized');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const confirmed = window.confirm("SECTOR AM2R: Disconnect terminal session?");
            if (confirmed) {
                // If in sub-page, return to home terminal. If on home, clear view or reset.
                if (window.location.pathname.includes('/pages/')) {
                    window.location.href = '../index.html';
                } else {
                    document.body.innerHTML = `
                        <div style="color:var(--neon-green);text-align:center;padding:100px;font-family:'Courier New',monospace;">
                            <h2 style="margin-bottom:20px;">[ SESSION TERMINATED // SIGNAL LOST ]</h2>
                            <p>Press any key or click to reconnect.</p>
                        </div>
                    `;
                    document.addEventListener('click', () => window.location.reload(), { once: true });
                    document.addEventListener('keydown', () => window.location.reload(), { once: true });
                }
            }
        });
    }
}

/**
 * Initializes the lightweight WebGL CRT shader overlay.
 */
function initWebGLCRT() {
    const canvas = document.getElementById('crt-shader');
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) {
        console.warn('WebGL not supported, falling back to CSS scanlines.');
        return;
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    const vsSource = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
            vUv = position * 0.5 + 0.5;
            vUv.y = 1.0 - vUv.y;
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fsSource = `
        precision mediump float;
        varying vec2 vUv;
        uniform vec2 u_resolution;
        uniform float u_time;

        vec2 crtCurve(vec2 uv) {
            uv = uv * 2.0 - 1.0;
            vec2 offset = abs(uv.yx) / vec2(6.0, 4.0);
            uv = uv + uv * offset * offset;
            uv = uv * 0.5 + 0.5;
            return uv;
        }

        void main() {
            vec2 crtUv = crtCurve(vUv);
            
            if (crtUv.x < 0.0 || crtUv.x > 1.0 || crtUv.y < 0.0 || crtUv.y > 1.0) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                return;
            }

            float scanline = sin(crtUv.y * u_resolution.y * 0.45) * 0.04;
            vec2 centerUv = crtUv * 2.0 - 1.0;
            float vignette = 1.0 - dot(centerUv, centerUv) * 0.28;
            float noise = fract(sin(dot(crtUv * u_time, vec2(12.9898,78.233))) * 43758.5453) * 0.035;

            float darkness = scanline + noise;
            float alpha = darkness + (1.0 - vignette);
            gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
        }
    `;

    function compileShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resLocation = gl.getUniformLocation(program, 'u_resolution');

    function render(time) {
        gl.uniform1f(timeLocation, time * 0.001);
        gl.uniform2f(resLocation, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

// Auto-initialize shared common features on DOM load
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getSavedTheme());
    initWindowControls();
    initWebGLCRT();
});
