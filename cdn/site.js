(function () {
    var runtimeStyle = document.getElementById('mega3-runtime-css');
    var css =
      '\
.mega3-nav-pill[aria-expanded="true"]{border-bottom-color:#f18000;}\
.mega3-nav-dd-chevron{color:var(--mega3-chevron,#f6f3ec) !important;}\
.mega3-nav-pill--has-dd .mega3-nav-dd-chevron{transition:transform 200ms cubic-bezier(.2,.7,.3,1),color 200ms ease;color:var(--mega3-chevron,#f6f3ec) !important;}\
.mega3-nav-pill[aria-expanded="true"] .mega3-nav-dd-chevron{transform:rotate(180deg);color:var(--mega3-chevron,#f6f3ec) !important;}\
.mega3-dd-backdrop{transition:opacity 220ms ease,visibility 0s linear 220ms;}\
.mega3-dd-backdrop[data-open="true"]{opacity:1;pointer-events:auto;visibility:visible;transition:opacity 220ms ease,visibility 0s linear 0s;}\
.mega3-dd-panel{transition:opacity 220ms cubic-bezier(.2,.7,.3,1),transform 220ms cubic-bezier(.2,.7,.3,1),visibility 0s linear 220ms;}\
.mega3-dd-panel[data-open="true"]{opacity:1;pointer-events:auto;visibility:visible;transform:translate(0,0);transition:opacity 220ms cubic-bezier(.2,.7,.3,1),transform 220ms cubic-bezier(.2,.7,.3,1),visibility 0s linear 0s;}\
.mega3-mobile{transition:opacity 240ms ease,visibility 0s linear 240ms;}\
.mega3-mobile[data-open="true"]{opacity:1;pointer-events:auto;visibility:visible;transition:opacity 240ms ease,visibility 0s linear 0s;}\
.mega3-mobile-acc[open] .mega3-mobile-acc-head svg{transform:rotate(180deg);}\
.mega3-mobile-acc-head svg{transition:transform 200ms ease;}\
.mega3-nav-hamburger[aria-expanded="true"] .mega3-hamburger-line:nth-child(1){transform:translateY(7px) rotate(45deg);}\
.mega3-nav-hamburger[aria-expanded="true"] .mega3-hamburger-line:nth-child(2){opacity:0;}\
.mega3-nav-hamburger[aria-expanded="true"] .mega3-hamburger-line:nth-child(3){transform:translateY(-7px) rotate(-45deg);}\
.mega3-hamburger-line{transition:transform 220ms cubic-bezier(.2,.7,.3,1),opacity 160ms ease;}\
.mega3-nav-pill{transition:border-bottom-color 180ms ease;}\
.mega3-nav-pill:hover{border-bottom-color:#f18000;}\
.mega3-nav-gradient{transition:opacity 240ms ease,background-color 240ms ease,background-image 0s linear 240ms;}\
.nav-wrapper[data-mega3-open="true"] .mega3-nav-gradient{background-image:none;background-color:var(--mega3-solid,#0a0a0b) !important;transition:opacity 240ms ease,background-color 240ms ease,background-image 0s linear 0s;}\
.nav-wrapper[data-mega3-open="true"]{background-color:var(--mega3-solid,#0a0a0b) !important;transition:background-color 240ms ease;}\
.nav-wrapper{transition:background-color 240ms ease,border-bottom-color 240ms ease;border-bottom:1px solid var(--_colors--tokens---border--subtle, var(--mega3-border-subtle, rgba(246,243,236,0.16))) !important;}\
.mega3-dd-backdrop{top:var(--mega3-nav-h,0px) !important;}\
';
    if (!runtimeStyle) {
      runtimeStyle = document.createElement('style');
      runtimeStyle.id = 'mega3-runtime-css';
      document.head.appendChild(runtimeStyle);
    }
    runtimeStyle.textContent = css;

    function init() {
      var wrapper = document.querySelector('.nav-wrapper');
      if (!wrapper) return;
      if (wrapper.hasAttribute('data-mega3-init')) return;
      wrapper.setAttribute('data-mega3-init', '1');

      var triggers = wrapper.querySelectorAll('[data-mega3-trigger]');
      var panels = wrapper.querySelectorAll('[data-mega3-panel]');
      var backdrop = wrapper.querySelector('[data-mega3-backdrop]');
      var hamburger = wrapper.querySelector('.mega3-nav-hamburger');
      var mobile = wrapper.querySelector('[data-mega3-mobile]');

      var active = null; // currently open dropdown id

      function refreshSolidColor() {
        var rootStyle = getComputedStyle(document.documentElement);
        var tokenNames = ['--_colors--tokens---background--true-black', '--background-true-black'];
        var fromToken = '';
        for (var i = 0; i < tokenNames.length; i++) {
          var v = (rootStyle.getPropertyValue(tokenNames[i]) || '').trim();
          if (v) {
            fromToken = v;
            break;
          }
        }

        var solid = fromToken;
        if (!solid) {
          var cs = getComputedStyle(wrapper).backgroundColor || '';
          var m = cs.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
          if (m) {
            solid = 'rgb(' + m[1] + ',' + m[2] + ',' + m[3] + ')';
          } else {
            solid = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? '#ffffff' : '#000000';
          }
        }
        wrapper.style.setProperty('--mega3-solid', solid);
      }

      function refreshChevronColor() {
        var rootStyle = getComputedStyle(document.documentElement);
        var wrapperStyle = getComputedStyle(wrapper);
        var tokenCandidates = ['--color--text-primary', '--color--text-on-dark', '--color--cream', '--theme--text', '--text-primary'];

        var fromPillText = '';
        var samplePillText = wrapper.querySelector('.mega3-nav-pill-text');
        if (samplePillText) {
          fromPillText = (getComputedStyle(samplePillText).color || '').trim();
        }

        var fromToken = '';
        for (var i = 0; i < tokenCandidates.length; i++) {
          var v = (wrapperStyle.getPropertyValue(tokenCandidates[i]) || '').trim();
          if (!v) v = (rootStyle.getPropertyValue(tokenCandidates[i]) || '').trim();
          if (v) {
            fromToken = v;
            break;
          }
        }

        var finalChevron = fromPillText || fromToken || '#f6f3ec';
        wrapper.style.setProperty('--mega3-chevron', finalChevron);

        // Direct inline color prevents Webflow cascade edge-cases overriding the icon.
        wrapper.querySelectorAll('.mega3-nav-dd-chevron').forEach(function (svg) {
          svg.style.color = finalChevron;
        });
      }

      var _syncing = false;
      function runSync() {
        if (_syncing) return;
        _syncing = true;
        try {
          refreshSolidColor();
          refreshChevronColor();
          if (typeof refreshBorderSubtle === 'function') refreshBorderSubtle();
          if (typeof swapInlineColorsForTheme === 'function') swapInlineColorsForTheme();
        } finally {
          // Release after the current task so DOM writes don't immediately re-trigger observers.
          setTimeout(function () {
            _syncing = false;
          }, 0);
        }
      }

      refreshSolidColor();
      refreshChevronColor();

      if (window.matchMedia) {
        try {
          window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', runSync);
        } catch (e) {
          /* older Safari */
        }
      }

      var themeHost = document.querySelector('[data-theme]') || document.documentElement;
      if (themeHost && window.MutationObserver) {
        try {
          new MutationObserver(runSync).observe(themeHost, {
            attributes: true,
            attributeFilter: ['data-theme'],
          });
        } catch (e) {}
      }

      document.addEventListener('click', function (e) {
        var t = e.target && e.target.closest && e.target.closest('[data-theme-toggle], .theme-toggle');
        if (!t) return;
        setTimeout(runSync, 0);
        setTimeout(runSync, 80);
        setTimeout(runSync, 280);
        setTimeout(runSync, 600);
      });

      // ── Measure nav height so backdrop starts right under the nav (not behind it) ──
      function refreshNavHeight() {
        var h = wrapper.getBoundingClientRect().height || wrapper.offsetHeight || 0;
        wrapper.style.setProperty('--mega3-nav-h', Math.round(h) + 'px');
      }
      refreshNavHeight();
      window.addEventListener('resize', function () {
        refreshNavHeight();
        refreshChevronColor();
      });
      if (window.ResizeObserver) {
        try {
          new ResizeObserver(function () {
            refreshNavHeight();
            refreshChevronColor();
          }).observe(wrapper);
        } catch (e) {}
      }

      if (window.MutationObserver) {
        try {
          new MutationObserver(runSync).observe(wrapper, {
            attributes: true,
            attributeFilter: ['class', 'data-theme'],
          });
        } catch (e) {}
      }

      var CREAM = '246, 243, 236';
      var BLACK = '10, 10, 11';

      function refreshBorderSubtle() {
        var light = (function () {
          var t = (document.documentElement.getAttribute('data-theme') || '').toLowerCase();
          if (t === 'light') return true;
          if (t === 'dark') return false;
          return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
        })();
        wrapper.style.setProperty('--mega3-border-subtle', light ? 'rgba(10,10,11,0.16)' : 'rgba(246,243,236,0.16)');
      }
      refreshBorderSubtle();

      function isLightTheme() {
        var t = (document.documentElement.getAttribute('data-theme') || '').toLowerCase();
        if (t === 'light') return true;
        if (t === 'dark') return false;
        return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
      }

      function buildSwapRegex(triplet) {
        return new RegExp('rgba?\\(\\s*' + triplet.replace(/, /g, ',\\s*') + '\\s*(?:,\\s*([0-9.]+))?\\s*\\)', 'g');
      }

      function swapValue(value, from, to) {
        if (!value) return value;
        return value.replace(buildSwapRegex(from), function (_m, a) {
          return a !== undefined ? 'rgba(' + to + ', ' + a + ')' : 'rgb(' + to + ')';
        });
      }

      function swapInlineColorsForTheme() {
        var light = isLightTheme();
        // In light mode flip dark→cream; in dark mode flip cream→dark.
        var from = light ? BLACK : CREAM;
        var to = light ? CREAM : BLACK;

        function tryProp(el, p) {
          var current = el.style.getPropertyValue(p);
          if (!current) return;

          if (/^border(-(top|right|bottom|left))?$/.test(p)) {
            if (/(^|\s)0(px)?(\s|$)/.test(current) || /\bnone\b/.test(current) || /rgba?\([^)]*,\s*0(\.0+)?\s*\)/.test(current)) {
              el.style.removeProperty(p);
              return;
            }
          }
          if (/^border(-(top|right|bottom|left))?-color$/.test(p)) {
            if (/rgba?\([^)]*,\s*0(\.0+)?\s*\)/.test(current)) {
              el.style.removeProperty(p);
              return;
            }
          }
          var next = swapValue(current, from, to);
          if (next !== current) {
            el.style.setProperty(p, next, el.style.getPropertyPriority(p) || '');
          }
        }

        var props = ['background-color', 'background-image', 'background', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'color', 'box-shadow', 'outline-color'];

        // Wrapper itself.
        for (var i = 0; i < props.length; i++) tryProp(wrapper, props[i]);

        var children = wrapper.querySelectorAll('.mega3-nav-gradient, .mega3-nav-bar, .mega3-nav-container');
        children.forEach(function (el) {
          for (var i = 0; i < props.length; i++) tryProp(el, props[i]);
        });
      }

      swapInlineColorsForTheme();
      if (window.MutationObserver) {
        try {
          var bridging = false;
          var bridgeObs = new MutationObserver(function () {
            if (bridging) return;
            bridging = true;
            try {
              swapInlineColorsForTheme();
            } finally {
              setTimeout(function () {
                bridging = false;
              }, 0);
            }
          });
          bridgeObs.observe(wrapper, { attributes: true, attributeFilter: ['style'] });
          wrapper.querySelectorAll('.mega3-nav-gradient, .mega3-nav-bar, .mega3-nav-container').forEach(function (el) {
            bridgeObs.observe(el, { attributes: true, attributeFilter: ['style'] });
          });
        } catch (e) {}
      }

      function syncOpenState() {
        var anyOpen = !!active || (mobile && mobile.getAttribute('data-open') === 'true');
        wrapper.setAttribute('data-mega3-open', anyOpen ? 'true' : 'false');
      }

      function openDD(id) {
        if (active === id) return;
        if (active) closeDD();
        var panel = wrapper.querySelector('[data-mega3-panel="' + id + '"]');
        var trig = wrapper.querySelector('[data-mega3-trigger="' + id + '"]');
        if (!panel || !trig) return;
        refreshNavHeight();
        panel.setAttribute('data-open', 'true');
        panel.setAttribute('aria-hidden', 'false');
        trig.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.setAttribute('data-open', 'true');
        active = id;
        syncOpenState();
      }

      function closeDD() {
        if (!active) return;
        var panel = wrapper.querySelector('[data-mega3-panel="' + active + '"]');
        var trig = wrapper.querySelector('[data-mega3-trigger="' + active + '"]');
        if (panel) {
          panel.setAttribute('data-open', 'false');
          panel.setAttribute('aria-hidden', 'true');
        }
        if (trig) trig.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.setAttribute('data-open', 'false');
        active = null;
        syncOpenState();
      }

      function toggleDD(id) {
        if (active === id) closeDD();
        else openDD(id);
      }

      triggers.forEach(function (t) {
        t.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleDD(t.getAttribute('data-mega3-trigger'));
        });
        t.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDD(t.getAttribute('data-mega3-trigger'));
          }
        });
      });

      // Stop clicks inside an open panel from bubbling to document
      panels.forEach(function (p) {
        p.addEventListener('click', function (e) {
          e.stopPropagation();
        });
      });

      // Outside click closes
      document.addEventListener('click', function () {
        closeDD();
      });
      if (backdrop)
        backdrop.addEventListener('click', function () {
          closeDD();
        });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          closeDD();
          if (mobile && mobile.getAttribute('data-open') === 'true') toggleMobile(false);
        }
      });

      function toggleMobile(open) {
        if (!mobile || !hamburger) return;
        var isOpen = mobile.getAttribute('data-open') === 'true';
        var next = typeof open === 'boolean' ? open : !isOpen;
        mobile.setAttribute('data-open', next ? 'true' : 'false');
        mobile.setAttribute('aria-hidden', next ? 'false' : 'true');
        hamburger.setAttribute('aria-expanded', next ? 'true' : 'false');
        hamburger.setAttribute('aria-label', next ? 'Close navigation' : 'Open navigation');
        document.body.style.overflow = next ? 'hidden' : '';
        syncOpenState();
      }
      if (hamburger) {
        hamburger.addEventListener('click', function (e) {
          e.stopPropagation();
          toggleMobile();
        });
      }
      if (mobile) {
        mobile.querySelectorAll('a').forEach(function (a) {
          a.addEventListener('click', function () {
            toggleMobile(false);
          });
        });
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
    // Webflow async render fallback
    setTimeout(init, 60);
    setTimeout(init, 250);
    setTimeout(init, 800);
  })();



  (function () {
    function readColorFrom(el) {
      if (!el) return '';
      var c = (getComputedStyle(el).color || '').trim();
      // Skip transparent values that mean "inherit nothing useful".
      if (!c || c === 'rgba(0, 0, 0, 0)' || c === 'transparent') return '';
      return c;
    }

    function syncChevronColor() {
      var nav = document.querySelector('.nav-wrapper');
      if (!nav) return;

      // Try every chevron individually so each one mirrors its own pill text.
      var chevrons = nav.querySelectorAll('.mega3-nav-dd-chevron');
      if (!chevrons.length) return;

      // Resolve a global fallback from the first visible pill text in the nav.
      var fallback = readColorFrom(nav.querySelector('.nav-pill-item-text')) || readColorFrom(nav.querySelector('.mega3-nav-pill-text')) || readColorFrom(nav.querySelector('.mega3-nav-pill')) || '#f6f3ec';

      chevrons.forEach(function (svg) {
        var pill = svg.closest('.mega3-nav-pill');
        var localColor = (pill && readColorFrom(pill.querySelector('.nav-pill-item-text'))) || (pill && readColorFrom(pill.querySelector('.mega3-nav-pill-text'))) || (pill && readColorFrom(pill)) || fallback;

        svg.style.setProperty('color', localColor, 'important');
        // Apply to inner <path> too in case stroke="currentColor" is overridden somewhere.
        svg.querySelectorAll('path').forEach(function (p) {
          p.setAttribute('stroke', 'currentColor');
          p.style.setProperty('stroke', localColor, 'important');
        });
      });
    }

    function initChevronSync() {
      syncChevronColor();

      // Re-sync after Webflow async render/theme switches.
      setTimeout(syncChevronColor, 80);
      setTimeout(syncChevronColor, 260);
      setTimeout(syncChevronColor, 900);

      window.addEventListener('resize', syncChevronColor);

      if (window.matchMedia) {
        try {
          window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', syncChevronColor);
        } catch (e) {}
      }

      if (window.MutationObserver) {
        try {
          var nav = document.querySelector('.nav-wrapper') || document.body;
          var obs = new MutationObserver(syncChevronColor);
          obs.observe(nav, {
            subtree: true,
            attributes: true,
            childList: true,
            attributeFilter: ['class', 'style', 'data-theme'],
          });
          // Theme toggle usually flips an attribute/class on <html> or <body>.
          obs.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'style', 'data-theme', 'data-wf-theme'],
          });
          obs.observe(document.body, {
            attributes: true,
            attributeFilter: ['class', 'style', 'data-theme', 'data-wf-theme'],
          });
        } catch (e) {}
      }

      // Direct hook on the theme toggle button — runs after the site's own handler.
      document.addEventListener('click', function (e) {
        var t = e.target && e.target.closest && e.target.closest('[data-theme-toggle], .theme-toggle');
        if (!t) return;
        // Run a few times to catch CSS-variable transitions.
        setTimeout(syncChevronColor, 0);
        setTimeout(syncChevronColor, 60);
        setTimeout(syncChevronColor, 250);
        setTimeout(syncChevronColor, 600);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initChevronSync);
    } else {
      initChevronSync();
    }
  })();



(function () {
  "use strict";

  // ── Konfigurace jazyků (endonymy). prefix "" = výchozí EN na rootu ──
  // cc = ISO country kód pro flagcdn.com
  var LOCALES = [
    { code:"en", prefix:"",   name:"English",  cc:"gb" },
    { code:"de", prefix:"de", name:"Deutsch",  cc:"de" },
    { code:"es", prefix:"es", name:"Espa\u00f1ol",  cc:"es" },
    { code:"fr", prefix:"fr", name:"Fran\u00e7ais", cc:"fr" },
    { code:"it", prefix:"it", name:"Italiano", cc:"it" },
    { code:"pl", prefix:"pl", name:"Polski",   cc:"pl" }
  ];
  var PREFIXES = LOCALES.map(function (l) { return l.prefix; }).filter(Boolean);

  function flagImg(cc) {
    return '<picture class="lsw-flag">' +
      '<source type="image/webp" srcset="https://flagcdn.com/h20/' + cc + '.webp, https://flagcdn.com/h40/' + cc + '.webp 2x, https://flagcdn.com/h60/' + cc + '.webp 3x">' +
      '<source type="image/png" srcset="https://flagcdn.com/h20/' + cc + '.png, https://flagcdn.com/h40/' + cc + '.png 2x, https://flagcdn.com/h60/' + cc + '.png 3x">' +
      '<img src="https://flagcdn.com/h20/' + cc + '.png" height="20" alt="" aria-hidden="true" loading="lazy">' +
    '</picture>';
  }

  // ── URL logika ──
  function currentPrefix() {
    var seg = location.pathname.split("/").filter(Boolean)[0] || "";
    return PREFIXES.indexOf(seg) > -1 ? seg : "";
  }
  function urlFor(prefix) {
    var segs = location.pathname.split("/").filter(Boolean);
    if (PREFIXES.indexOf(segs[0]) > -1) segs.shift();
    var parts = prefix ? [prefix].concat(segs) : segs;
    var p = "/" + parts.join("/");
    if (p !== "/") p = p.replace(/\/+$/, "");
    return p + location.search + location.hash;
  }
  function localeByPrefix(pfx) {
    for (var i = 0; i < LOCALES.length; i++) if (LOCALES[i].prefix === pfx) return LOCALES[i];
    return LOCALES[0];
  }

  var CHECK = '<svg class="lsw-check" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function enhance(pill) {
    if (pill.__lswReady) return;
    pill.__lswReady = true;

    var active = localeByPrefix(currentPrefix());

    // Text = aktuální jazyk. Píšeme přímo do vnitřního <p class="nav-pill-item-text">,
    // aby zůstal zachován stylovaný element a přepsal se jak default "English",
    // tak text přeložený Linguanou. Reassert kryje pozdější zásah Linguany.
    function setActiveName() {
      var el = pill.querySelector(".nav-pill-item-text") || pill.querySelector(".mega3-nav-pill-text");
      if (el && el.textContent !== active.name) el.textContent = active.name;
    }
    setActiveName();
    setTimeout(setActiveName, 300);
    setTimeout(setActiveName, 1000);

    pill.setAttribute("role", "button");
    pill.setAttribute("tabindex", "0");
    pill.setAttribute("aria-haspopup", "true");
    pill.setAttribute("aria-expanded", "false");
    pill.setAttribute("aria-label", "Select language – current: " + active.name);

    // ── Menu (na <body>) ──
    var menu = document.createElement("ul");
    menu.className = "lsw-menu";
    menu.setAttribute("role", "menu");
    LOCALES.forEach(function (loc) {
      var li = document.createElement("li");
      li.setAttribute("role", "none");
      var a = document.createElement("a");
      a.className = "lsw-item";
      a.setAttribute("role", "menuitem");
      a.setAttribute("hreflang", loc.code);
      a.setAttribute("lang", loc.code);
      a.href = urlFor(loc.prefix);
      if (loc.prefix === active.prefix) a.setAttribute("aria-current", "true");
      a.innerHTML = flagImg(loc.cc) +
        '<span class="lsw-name">' + loc.name + '</span>' + CHECK;
      li.appendChild(a);
      menu.appendChild(li);
    });
    document.body.appendChild(menu);

    var items = Array.prototype.slice.call(menu.querySelectorAll(".lsw-item"));

    function position() {
      var r = pill.getBoundingClientRect();
      menu.style.visibility = "hidden";           // změřit šířku
      var mw = menu.offsetWidth;
      var left = Math.max(8, Math.min(r.right - mw, window.innerWidth - mw - 8));
      menu.style.left = left + "px";
      menu.style.top = (r.bottom + 8) + "px";
      menu.style.visibility = "";
    }
    function open() {
      items.forEach(function (a, i) { a.href = urlFor(LOCALES[i].prefix); });
      position();
      menu.classList.add("lsw-open");
      pill.setAttribute("aria-expanded", "true");
      document.addEventListener("click", onDocClick, true);
      document.addEventListener("keydown", onKey, true);
      window.addEventListener("resize", position);
      window.addEventListener("scroll", position, true);
      var cur = menu.querySelector('[aria-current="true"]') || items[0];
      if (cur) cur.focus();
    }
    function close(focusBack) {
      menu.classList.remove("lsw-open");
      pill.setAttribute("aria-expanded", "false");
      document.removeEventListener("click", onDocClick, true);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
      if (focusBack) pill.focus();
    }
    function isOpen() { return menu.classList.contains("lsw-open"); }
    function toggle() { isOpen() ? close(false) : open(); }

    function onDocClick(e) {
      if (!pill.contains(e.target) && !menu.contains(e.target)) close(false);
    }
    function onKey(e) {
      var idx = items.indexOf(document.activeElement);
      switch (e.key) {
        case "Escape":    e.preventDefault(); close(true); break;
        case "ArrowDown": e.preventDefault(); (items[idx + 1] || items[0]).focus(); break;
        case "ArrowUp":   e.preventDefault(); (items[idx - 1] || items[items.length - 1]).focus(); break;
        case "Home":      e.preventDefault(); items[0].focus(); break;
        case "End":       e.preventDefault(); items[items.length - 1].focus(); break;
        case "Tab":       close(false); break;
      }
    }

    pill.addEventListener("click", function (e) {
      e.preventDefault();
      toggle();
    });
    pill.addEventListener("keydown", function (e) {
      if (e.target !== pill) return;
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); open(); }
    });
  }

  // ── Mobilní přepínač: přidá seznam jazyků do .mega3-mobile-inner ──
  function buildMobile() {
    var inner = document.querySelector("[data-mega3-mobile] .mega3-mobile-inner") || document.querySelector(".mega3-mobile-inner");
    if (!inner || inner.__lswMobile) return;
    inner.__lswMobile = true;

    var active = localeByPrefix(currentPrefix());

    var wrap = document.createElement("div");
    wrap.className = "lsw-mobile";

    var list = document.createElement("div");
    list.className = "lsw-mobile-list";
    list.setAttribute("role", "menu");
    list.setAttribute("aria-label", "Select language");

    LOCALES.forEach(function (loc) {
      var a = document.createElement("a");
      a.className = "lsw-mobile-item";
      a.setAttribute("role", "menuitem");
      a.setAttribute("hreflang", loc.code);
      a.setAttribute("lang", loc.code);
      a.href = urlFor(loc.prefix);
      if (loc.prefix === active.prefix) a.setAttribute("aria-current", "true");
      a.innerHTML = flagImg(loc.cc) + '<span class="lsw-name">' + loc.name + "</span>";
      list.appendChild(a);
    });

    wrap.appendChild(list);
    inner.appendChild(wrap);
  }

  function init() {
    document.querySelectorAll(".mega3-nav-pill--lang").forEach(enhance);
    buildMobile();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  // Mobilní sekce může být Webflow vyrenderována asynchronně – dožeň to.
  setTimeout(buildMobile, 250);
  setTimeout(buildMobile, 800);
})();
