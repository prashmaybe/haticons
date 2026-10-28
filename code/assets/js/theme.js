/**
 * Haticons Theme Switcher & System Adaptiveness
 * Handles 'light', 'dark', and 'system' modes, synchronizes local storage,
 * and reacts to prefers-color-scheme changes.
 */

(function () {
    const THEME_KEY = 'haticons_theme_preference';

    function getSystemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function getSavedTheme() {
        return localStorage.getItem(THEME_KEY) || 'system';
    }

    function applyTheme(theme) {
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
        document.documentElement.setAttribute('data-theme', resolvedTheme);
        document.documentElement.setAttribute('data-boodoo-theme', resolvedTheme);
        document.documentElement.setAttribute('data-theme-setting', theme);

        // Update theme toggle buttons UI
        const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
        toggleBtns.forEach(btn => {
            const icon = btn.querySelector('.theme-toggle-icon');
            const text = btn.querySelector('.theme-toggle-text');
            if (icon) {
                if (resolvedTheme === 'dark') {
                    icon.className = 'hi-bulb theme-toggle-icon fs-5 text-warning';
                    btn.setAttribute('title', 'Dark mode active (Setting: ' + theme + ') - Click to switch theme');
                    btn.setAttribute('aria-label', 'Dark mode active - Click to toggle');
                } else {
                    icon.className = 'hi-sun theme-toggle-icon fs-5';
                    btn.setAttribute('title', 'Light mode active (Setting: ' + theme + ') - Click to switch theme');
                    btn.setAttribute('aria-label', 'Light mode active - Click to toggle');
                }
            }
            if (text) {
                text.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
            }
        });

        // Update active checkmarks in dropdown if present
        document.querySelectorAll('[data-set-theme]').forEach(el => {
            const target = el.getAttribute('data-set-theme');
            if (target === theme) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    // Set theme cycle: light -> dark -> light
    function cycleTheme() {
        const current = getSavedTheme();
        const resolved = current === 'system' ? getSystemTheme() : current;
        const next = resolved === 'dark' ? 'light' : 'dark';

        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    }

    window.setHaticonsTheme = function (theme) {
        localStorage.setItem(THEME_KEY, theme);
        applyTheme(theme);
    };

    window.cycleHaticonsTheme = cycleTheme;

    // Listen for system changes when in system mode
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (getSavedTheme() === 'system') {
                applyTheme('system');
            }
        });
    }

    // Initialize as soon as DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyTheme(getSavedTheme());
        });
    } else {
        applyTheme(getSavedTheme());
    }

    // Delegate click for theme toggle buttons and dropdown items
    document.addEventListener('click', function (e) {
        const toggleBtn = e.target.closest('.theme-toggle-btn');
        if (toggleBtn) {
            e.preventDefault();
            cycleTheme();
            return;
        }

        const selectItem = e.target.closest('[data-set-theme]');
        if (selectItem) {
            e.preventDefault();
            const choice = selectItem.getAttribute('data-set-theme');
            window.setHaticonsTheme(choice);
        }
    });
})();
