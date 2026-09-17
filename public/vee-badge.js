/* vee-badge.js — the Veered mark on a game page.
 *
 *   <script src="https://veered.org/vee-badge.js" defer></script>
 *
 * That one line is the whole integration, and it is what every future game
 * should get. It adds the favicon links and a small corner emblem that links
 * back to the menu. Served from veered.org, so re-cutting the artwork updates
 * every game at once without touching any of them.
 *
 * The games own the keyboard and the pointer, so the badge has to be somewhere
 * the game is not: it is a link, and a click meant for the game that lands on
 * it navigates out mid-play. Bottom-left is the default because that is free in
 * most of them; a game whose own UI is there names a different corner:
 *
 *   <script src="https://veered.org/vee-badge.js" data-corner="top-right" defer></script>
 *
 * data-corner takes top-left, top-right, bottom-left or bottom-right. Check the
 * corner against the running game before picking it — Maroon Isles Quest, for
 * one, has its command input across the whole bottom edge.
 *
 * It never takes focus in the tab order.
 */
(function () {
  var HOME = 'https://veered.org/';
  var here = location.hostname;

  var me = document.currentScript;
  var CORNERS = {
    'top-left':     'top:12px;left:12px',
    'top-right':    'top:12px;right:12px',
    'bottom-left':  'bottom:12px;left:12px',
    'bottom-right': 'bottom:12px;right:12px'
  };
  var corner = (me && me.dataset.corner) || 'bottom-left';
  if (!CORNERS[corner]) corner = 'bottom-left';

  /* Favicons, unless the page already named its own. */
  if (!document.querySelector('link[rel~="icon"]')) {
    [['icon', HOME + 'favicon.ico', null],
     ['icon', HOME + 'icon-192.png', '192x192'],
     ['apple-touch-icon', HOME + 'apple-touch-icon.png', null]
    ].forEach(function (l) {
      var el = document.createElement('link');
      el.rel = l[0];
      el.href = l[1];
      if (l[2]) el.sizes = l[2];
      document.head.appendChild(el);
    });
  }

  /* On veered.org itself the badge would just link to the page you are on. */
  if (here === 'veered.org' || here === 'www.veered.org') return;

  function add() {
    if (document.getElementById('vee-badge')) return;

    var css = document.createElement('style');
    css.textContent =
      /* The mark is dark olive and deep red on transparent, and every game
         here is on a near-black background, so a faded badge disappears
         entirely. It sits high instead, with a soft red glow to lift it off
         the black. */
      '#vee-badge{position:fixed;' + CORNERS[corner] + ';z-index:2147483000;' +
      'width:64px;opacity:.8;transition:opacity .2s linear;line-height:0;' +
      'filter:drop-shadow(0 0 7px rgba(255,70,70,.4))}' +
      '#vee-badge:hover,#vee-badge:focus-visible{opacity:1}' +
      '#vee-badge img{width:100%;height:auto;display:block}' +
      '@media (max-width:600px){#vee-badge{width:44px}}' +
      '@media (prefers-reduced-motion:reduce){#vee-badge{transition:none}}';
    document.head.appendChild(css);

    var a = document.createElement('a');
    a.id = 'vee-badge';
    a.href = HOME;
    a.title = 'Veered — more games';
    a.setAttribute('aria-label', 'Veered — more games');
    a.tabIndex = -1;                    /* never steal Tab from the game */
    /* Not loading="lazy": the badge is always in the viewport, and a tab that
       is in the background when the page loads never fires the intersection
       that would start the fetch, so the mark stays blank until you look. */
    a.innerHTML = '<img src="' + HOME + 'logo.webp" alt="Veered" ' +
                  'width="512" height="353" decoding="async">';
    document.body.appendChild(a);
  }

  if (document.body) add();
  else addEventListener('DOMContentLoaded', add);
})();
