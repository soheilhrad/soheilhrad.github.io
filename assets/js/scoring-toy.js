/* "Two ways of scoring" (_includes/scoring-toy.html), for the emergence note.
   Twelve made-up model sizes. Each one's chance of getting a single word of the answer right
   rises evenly from 60% to 99%. Pass-or-fail scoring needs every word right, so its score is
   that chance multiplied by itself once per word: p^n. Partial credit scores p.
   This illustrates the argument in Schaeffer et al. (2023); none of the numbers are theirs.
   Interface text comes from _data/i18n.yml (scoring_toy:) through the JSON in the include. */
(function () {
  'use strict';
  const fig = document.getElementById('scoring-toy');
  if (!fig) return;
  const T = JSON.parse(document.getElementById('st-data').textContent);
  const lang = document.documentElement.lang || 'en';
  const svg = document.getElementById('st-chart');
  const range = document.getElementById('st-len');
  const out = document.getElementById('st-len-out');
  const summary = document.getElementById('st-summary');
  const NS = 'http://www.w3.org/2000/svg';

  const N = 12;
  const P = Array.from({ length: N }, (_, i) => 0.60 + 0.39 * i / (N - 1));
  // On right-to-left pages the x axis runs right to left (smaller models on the right) and the
  // percentages sit on the right, so the chart reads in the same direction as the page and slider.
  const rtl = document.documentElement.dir === 'rtl';
  const W = 320, H = 170, AXIS = 38, EDGE = 8, PADT = 8, PADB = 10;
  const left = rtl ? EDGE : AXIS, right = rtl ? W - AXIS : W - EDGE;
  const x = i => (rtl ? right - (right - left) * i / (N - 1) : left + (right - left) * i / (N - 1));
  const y = v => PADT + (H - PADT - PADB) * (1 - v);

  const num = v => new Intl.NumberFormat(lang).format(v);
  const pct = v => new Intl.NumberFormat(lang, {
    style: 'percent', maximumFractionDigits: v > 0 && v < 0.01 ? 1 : 0
  }).format(v);
  const fill = (s, map) => s.replace(/%([a-z])/g, (m, k) => (k in map ? map[k] : m));

  function el(name, attrs, text) {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }

  function scores(mode, n) {
    return P.map(p => (mode === 'exact' ? Math.pow(p, n) : p));
  }

  function line(vals, cls) {
    const pts = vals.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1)).join(' ');
    return el('polyline', { points: pts, class: cls });
  }

  function draw() {
    const n = Number(range.value);
    const mode = fig.querySelector('input[name="st-mode"]:checked').value;
    const other = mode === 'exact' ? 'partial' : 'exact';
    const on = scores(mode, n), off = scores(other, n);

    out.textContent = fill(T.words, { n: num(n) });
    svg.replaceChildren();
    [0, 0.5, 1].forEach(v => {
      svg.append(el('line', { x1: left, x2: right, y1: y(v), y2: y(v), class: 'toy-grid' }));
      svg.append(el('text', { x: rtl ? right + 6 : left - 6, y: y(v) + 3.5, 'text-anchor': rtl ? 'start' : 'end', class: 'toy-tick' }, pct(v)));
    });
    svg.append(line(off, 'toy-line is-off'));
    svg.append(line(on, 'toy-line'));
    on.forEach((v, i) => svg.append(el('circle', { cx: x(i), cy: y(v), r: 2.6, class: 'toy-dot' })));

    const map = { n: num(n), a: pct(on[0]), b: pct(on[N - 1]) };
    if (mode === 'partial') {
      summary.textContent = fill(T.sum_partial, map);
    } else if (on[0] >= 0.1) {
      summary.textContent = fill(T.sum_steady, map);
    } else {
      map.m = num(on.findIndex(v => v >= 0.1) + 1);
      map.t = num(N);
      summary.textContent = fill(T.sum_jump, map);
    }
  }

  range.addEventListener('input', draw);
  fig.querySelectorAll('input[name="st-mode"]').forEach(r => r.addEventListener('change', draw));
  fig.hidden = false;
  draw();
})();
