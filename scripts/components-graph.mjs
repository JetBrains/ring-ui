/* eslint-disable no-console, max-lines */
import fs from 'node:fs';
import {execSync} from 'node:child_process';

const OUTPUT_DIR = 'components-graph';
const INPUT = `${OUTPUT_DIR}/components-graph.json`;
const OUTPUT = `${OUTPUT_DIR}/components-graph.html`;
const MIGRATED_INPUT = 'migrated-components.json';

// eslint-disable-next-line no-magic-numbers
const MAX_BUFFER_SIZE = 10 * 1024 * 1024; // 10 MB
const PERCENTAGE_MULTIPLIER = 100;
const DECIMAL_PRECISION = 10;
const PROGRESS_BAR_WIDTH = 40;
const SEPARATOR_WIDTH = 70;

// Create output directory
fs.mkdirSync(OUTPUT_DIR, {recursive: true});

// Run dependency-cruiser
console.log('Running dependency-cruiser...');
try {
  const output = execSync('depcruise src --config dependency-cruiser.config.js --output-type json', {
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER_SIZE,
  });
  fs.writeFileSync(INPUT, output, 'utf8');
} catch (error) {
  if (error.stdout) {
    fs.writeFileSync(INPUT, error.stdout, 'utf8');
  } else {
    console.error('Failed to run dependency-cruiser:', error.message);
    process.exit(1);
  }
}

// Params for repo structure
const BASE = 'src';
const IGNORE_DIRS = ['hooks', 'utils', 'theme', 'icons', 'assets'];
const IGNORE_FILE_REGEX = /\.(test|stories)\.(ts|tsx)$/;

// Extra files classification for the side panel
const STYLE_REGEX = /\.(css|scss|sass|less|styl)$/i;
const STORIES_REGEX = /\.stories\.(ts|tsx|js|jsx)$/i;
const TESTFILE_REGEX = /\.(test|spec)\.(ts|tsx|js|jsx)$/i;
const MD_REGEX = /\.(md|mdx)$/i;
const ASSET_REGEX = /\.(svg|png|jpe?g|gif|webp|ico)$/i;
const JSON_FILE_REGEX = /\.json$/i;

function classifyExtra(p) {
  if (STYLE_REGEX.test(p)) return 'styles';
  if (STORIES_REGEX.test(p)) return 'stories';
  if (TESTFILE_REGEX.test(p)) return 'tests';
  if (MD_REGEX.test(p)) return 'docs';
  if (ASSET_REGEX.test(p)) return 'assets';
  if (JSON_FILE_REGEX.test(p)) return 'json';
  return 'other';
}

function relToComponent(p, comp) {
  const pref = `${BASE}/${comp}/`;
  if (p.startsWith(pref)) return p.slice(pref.length);
  if (p.startsWith(`${BASE}/`)) return p.slice(BASE.length + 1);
  return p;
}

// Filter files
function isSourceFile(p) {
  if (!p || typeof p !== 'string') return false;
  if (!p.startsWith(`${BASE}/`)) return false;
  if (!/\.(ts|tsx|js|jsx)$/.test(p)) return false;
  if (IGNORE_FILE_REGEX.test(p)) return false;
  if (/\.(css|scss|svg|png|jpe?g|gif|json|md)$/.test(p)) return false;
  const rel = p.slice(BASE.length + 1);
  const top = rel.split('/')[0];
  if (IGNORE_DIRS.includes(top)) return false;
  return true;
}

// node = component name by top folder: src/Button/X.tsx -> "Button"
function fileToComponentId(p) {
  if (!p?.startsWith(`${BASE}/`)) return null;
  const rel = p.slice(BASE.length + 1);
  const [first] = rel.split('/');
  if (!first) return null;
  if (IGNORE_DIRS.includes(first)) return null;
  return first;
}

// check graph
let g;
try {
  g = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
} catch (e) {
  console.error(`❌ Can't read ${INPUT}:`, e.message);
  process.exit(1);
}
if (!g || !Array.isArray(g.modules)) {
  console.error(`❌ ${INPUT} dependency-cruiser: no "modules" field (array).`);
  process.exit(1);
}

// build components graph
const files = g.modules.map(m => m.source).filter(isSourceFile);
const components = new Set(files.map(fileToComponentId).filter(Boolean));

let migrated = new Set();
try {
  const raw = fs.readFileSync(MIGRATED_INPUT, 'utf8');
  const arr = JSON.parse(raw);
  if (Array.isArray(arr)) {
    migrated = new Set(arr.filter(name => components.has(name)));
  }
} catch (e) {
  console.log(`ℹ️ No "${MIGRATED_INPUT}" found or invalid JSON — skipping migrated styling`);
}

// extras: files in component folder (css, stories, tests, md, assets, json, ...)
const extrasByComp = new Map(
  Array.from(components, c => [
    c,
    {
      styles: new Set(),
      stories: new Set(),
      tests: new Set(),
      docs: new Set(),
      assets: new Set(),
      json: new Set(),
      other: new Set(),
    },
  ]),
);

for (const m of g.modules) {
  const file = m.source;
  const comp = fileToComponentId(file);
  if (!comp || !components.has(comp)) continue;
  if (isSourceFile(file)) continue;
  const cat = classifyExtra(file);
  extrasByComp.get(comp)[cat].add(relToComponent(file, comp));
}

const extrasPlain = new Map();
for (const [c, obj] of extrasByComp) {
  const conv = {};
  let total = 0;
  for (const k of Object.keys(obj)) {
    const arr = Array.from(obj[k]).sort();
    conv[k] = arr;
    total += arr.length;
  }
  // eslint-disable-next-line no-underscore-dangle
  conv._total = total;
  extrasPlain.set(c, conv);
}

// edges: A -> B (A import something from B)
const edges = new Map(Array.from(components, c => [c, new Set()]));
for (const m of g.modules) {
  const fromFile = m.source;
  if (!isSourceFile(fromFile)) continue;
  const fromComp = fileToComponentId(fromFile);
  if (!fromComp) continue;

  for (const d of m.dependencies || []) {
    const toFile = d.resolved;
    if (!isSourceFile(toFile)) continue;
    const toComp = fileToComponentId(toFile);
    if (!toComp || toComp === fromComp) continue;
    edges.get(fromComp).add(toComp);
  }
}

// input/output score
const indeg = new Map(Array.from(components, c => [c, 0]));
const outdeg = new Map(Array.from(components, c => [c, edges.get(c)?.size || 0]));
for (const [_a, tos] of edges) for (const b of tos) indeg.set(b, (indeg.get(b) || 0) + 1);

// build components for Cytoscape
const cyNodes = Array.from(components).map(c => ({
  data: {
    id: c,
    label: c,
    indeg: indeg.get(c) || 0,
    outdeg: outdeg.get(c) || 0,
    isMigrated: migrated.has(c),
    extras: extrasPlain.get(c) || {
      _total: 0,
      styles: [],
      stories: [],
      tests: [],
      docs: [],
      assets: [],
      json: [],
      other: [],
    },
  },
}));

const cyEdges = [];
for (const [a, tos] of edges) {
  for (const b of tos) {
    // edge id
    const id = `${a}->${b}`;
    cyEdges.push({data: {id, source: a, target: b}});
  }
}
const elements = [...cyNodes, ...cyEdges];
const edgeCount = cyEdges.length;

// refactor progress
const totalComponents = cyNodes.length;
const migratedCount = cyNodes.filter(n => n.data.isMigrated).length;
const migratedPctRaw = totalComponents ? (migratedCount / totalComponents) * PERCENTAGE_MULTIPLIER : 0;
const migratedPct = (Math.round(migratedPctRaw * DECIMAL_PRECISION) / DECIMAL_PRECISION).toFixed(1);

const elementsJSON = JSON.stringify(elements).replace(/</g, '\\u003c').replace(/-->/g, '--\\>');

const nodeOptions = Array.from(components)
  .sort()
  .map(c => `<option value="${c}"></option>`)
  .join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Dependency Graph (interactive)</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html, body { height: 100%; margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; }
  #app { display: grid; grid-template-rows: auto 1fr; height: 100%; }
  #controls {
    display: flex; gap: 12px; align-items: center; padding: 10px 12px; border-bottom: 1px solid #eee; background: #fafafa; flex-wrap: wrap;
  }
  #cy {
    width: 100%;
    min-height: 0;
    overflow: hidden;
  }
  .stat { color: #666; font-size: 12px; margin-left: auto; }
  input[type="text"] { padding: 6px 8px; min-width: 260px; }
  button { padding: 6px 10px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer; }
  button:hover { background: #f5f5f5; }
  label { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; color: #333; }
  .legend { display: inline-flex; gap: 12px; align-items: center; font-size: 12px; color: #555; }
  .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; vertical-align: middle; }
  .c-in { background: #1f77b4; }
  .c-out { background: #d62728; }
  .c-self { background: #f90; }

  #panel {
    position: fixed; right: 12px; top: 60px;
    width: 320px; max-height: calc(100vh - 80px); overflow: auto;
    background: #fff; border: 1px solid #e5e7eb; border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,.08); padding: 12px; display:none;
  }
  #panel h3 { margin: 0 0 8px; font-size: 14px; }
  #panel .meta { color:#555; font-size:12px; margin-bottom:8px; }
  #panel .count { font-weight:600; }
  #panel ul { margin: 6px 0 12px; padding-left: 16px; }
  #panel .close { float:right; cursor:pointer; border:none; background:transparent; font-size:16px; line-height:1; }
  .badge {
    display: inline-block;
    padding: 2px 6px;
    font-size: 11px;
    line-height: 1;
    border-radius: 6px;
    vertical-align: middle;
    margin-left: 6px;
    border: 1px solid transparent;
  }
  .badge.refactored {
    background: #28a745;
    color: #fff;
    border-color: #28a745;
  }
  .metrics { margin-left: auto; display: inline-flex; align-items: center; gap: 10px; }
  .progress { width: 100px; height: 8px; background: #e6f4ea; border-radius: 999px; overflow: hidden; border: 1px solid #cde8d4; }
  .progress .fill { height: 100%; background: #28a745; width: 0; transition: width .2s ease; }
  .progress-text { font-size: 12px; color: #333; white-space: nowrap; }
  @media (max-width: 800px) {
    .progress { width: 120px; }
    .progress-text { font-size: 11px; }
  }
</style>
</head>
<body>
<div id="app">
  <div id="controls">
    <input id="search" type="text" placeholder="Find component…" list="nodes" />
    <datalist id="nodes">
      ${nodeOptions}
    </datalist>
    <label><input type="checkbox" id="transitive" /> transitive (upstream & downstream)</label>
    <button id="btn-reset">Reset view</button>
    <span class="legend">
      <span><span class="dot c-self"></span> selected</span>
      <span><span class="dot c-in"></span> incoming</span>
      <span><span class="dot c-out"></span> outgoing</span>
    </span>

    <div id="metrics" class="metrics" title="Refactoring progress from migrated-components.json">
      <div id="ref-progress" class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${migratedPct}">
        <div class="fill" style="width:${migratedPct}%;"></div>
      </div>
      <span id="ref-progress-text" class="progress-text">${migratedPct}% (${migratedCount}/${totalComponents} components refactored)</span>
      <span class="stat">${edgeCount} edges</span>
    </div>
  </div>
  <div id="cy"></div>
  <div id="panel"></div>
</div>

<script src="https://unpkg.com/cytoscape@3/dist/cytoscape.min.js"></script>

<script>
  // graph data
  const elements = ${elementsJSON};

  // graph styles
  const style = [
    { selector: 'node', style: {
      'label': 'data(label)',
      'font-size': 10,
      'text-wrap': 'wrap',
      'text-max-width': '180px',
      'text-background-color': '#fff',
      'text-background-opacity': 0.85,
      'text-background-shape': 'roundrectangle',
      'text-background-padding': '2px',
      'background-color': '#e8eef7',
      'border-width': 1,
      'border-color': '#c7d3e5'
    }},
    { selector: 'node[?isMigrated]', style: {
      'border-color': '#28a745',
      'border-width': 3
    }},
    { selector: 'edge', style: {
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'width': 1,
        'line-color': '#bbb',
        'target-arrow-color': '#bbb'
    }},
    { selector: '.faded', style: { 'opacity': 0.15 } },
    { selector: '.highlight', style: {
        'background-color': '#f90',
        'border-color': '#f90',
        'line-color': '#f90',
        'target-arrow-color': '#f90',
        'z-index': 1000
    }},
    { selector: 'node[?isMigrated].highlight', style: {
      'border-color': '#28a745',
      'border-width': 3
    }},
    { selector: '.incoming', style: {
        'background-color': '#1f77b4',
        'line-color': '#1f77b4',
        'target-arrow-color': '#1f77b4'
    }},
    { selector: '.outgoing', style: {
        'background-color': '#d62728',
        'line-color': '#d62728',
        'target-arrow-color': '#d62728'
    }}
  ];

  const cy = cytoscape({
    container: document.getElementById('cy'),
    elements,
    style,
    layout: { name: 'preset', fit: true, padding: 50, animate: false },
    wheelSensitivity: 0.25,
    minZoom: 0.05,
    maxZoom: 3
  });

  applyIOGrid();


function applyIOGrid() {
  const PADX = 60, PADY = 60;             // outside fields
  const CELL_MIN_X = 70, CELL_MIN_Y = 56;

  const outsSet = new Set(), insSet = new Set();
  cy.nodes().forEach(n => { outsSet.add(n.data('outdeg')|0); insSet.add(n.data('indeg')|0); });
  const outs = Array.from(outsSet).sort((a,b)=>a-b);
  const ins  = Array.from(insSet).sort((a,b)=>a-b);

  function softenIdx(v, arr) {
    if (arr.length <= 1) return 0;
    const r = arr.indexOf(v)/(arr.length-1);              // 0..1
    const s = Math.log1p(3*r)/Math.log1p(3);
    return Math.round(s*(arr.length-1));
  }

  // group nodes (iIdx:oIdx)
  const bins = new Map();
  cy.nodes().forEach(n => {
    const oIdx = softenIdx(n.data('outdeg')|0, outs);
    const iIdx = softenIdx(n.data('indeg')|0, ins);
    const key = iIdx + ':' + oIdx;
    if (!bins.has(key)) bins.set(key, []);
    bins.get(key).push(n);
  });

  // container size
  const W = cy.width(), H = cy.height();
  const cols = Math.max(1, outs.length);
  const rows = Math.max(1, ins.length);
  const cellX = Math.max(CELL_MIN_X, (W - PADX) / cols);
  const cellY = Math.max(CELL_MIN_Y, (H - PADY) / rows);

  cy.batch(() => {
    bins.forEach((arr, key) => {
      const parts = key.split(':');
      const iIdx = +parts[0]; // Y
      const oIdx = +parts[1]; // X

      const baseX = (PADX/2) + oIdx * cellX;
      const baseY = (PADY/2) + iIdx * cellY;

      // === INTRA-cluster spacing ===
      let maxLabelChars = 0;
      for (const node of arr) {
        const lbl = (node.data('label') || '').toString();
        if (lbl.length > maxLabelChars) maxLabelChars = lbl.length;
      }

      const baseGapX = 28;       // minimum horizontal clearance
      const baseGapY = 22;       // minimum vertical clearance
      const perCharX = 0.6;      // px increase per character for X
      const perCharY = 0.35;     // px per character increase for Y
      const densityK = 1 + Math.log1p(arr.length) * 0.45; // the more nodes in the cluster, the larger the step

      // final steps, limited by the cell boundaries
      const gapX = Math.max(baseGapX, Math.min(cellX * 0.85, (baseGapX + perCharX * maxLabelChars) * densityK));
      const gapY = Math.max(baseGapY, Math.min(cellY * 0.85, (baseGapY + perCharY * maxLabelChars) * densityK));

      // calculate the size of the "brick" grid
      const colsInCell = Math.max(1, Math.ceil(Math.sqrt(arr.length)));
      const rowsInCell = Math.max(1, Math.ceil(arr.length / colsInCell));

      const totalW = (colsInCell - 1) * gapX;
      const totalH = (rowsInCell - 1) * gapY;

      const originX = baseX - totalW / 2;
      const originY = baseY - totalH / 2;

      arr.forEach((node, idx) => {
        const r = Math.floor(idx / colsInCell);
        const c = idx % colsInCell;
        const offset = (r % 2) ? gapX * 0.5 : 0;
        const x = originX + c * gapX + offset;
        const y = originY + r * gapY;
        node.position({ x, y });
      });
    });
  });

  cy.layout({ name: 'preset', fit: true, padding: 50 }).run();
}


function renderPanelForNode(n, transitive) {
  var incSet = new Set();
  var outSet = new Set();

  var incEles = transitive ? n.predecessors().nodes() : n.incomers().nodes();
  var outEles = transitive ? n.successors().nodes()   : n.outgoers().nodes();

  incEles.forEach(function (e) { if (e.isNode() && e.id() !== n.id()) incSet.add(e.data('label') || e.id()); });
  outEles.forEach(function (e) { if (e.isNode() && e.id() !== n.id()) outSet.add(e.data('label') || e.id()); });

  var inc = Array.from(incSet).sort();
  var out = Array.from(outSet).sort();

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function renderList(title, items) {
    if (!items || !items.length) return '';
    var s = '<div style="margin:6px 0;"><div class="meta" style="margin-bottom:2px;">' + title +
            ' (' + items.length + ')</div><ul>';
    s += items.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('');
    s += '</ul></div>';
    return s;
  }

  var extras = n.data('extras') || {};
  var totalExtras = extras._total || 0;

  var html = '';
  html += '<button class="close" aria-label="Close">×</button>';
  var badge = n.data('isMigrated') ? '<span class="badge refactored">refactored</span>' : '';
  html += '<h3>' + esc(n.data('label') || n.id()) + ' ' + badge + '</h3>';
  html += '<div class="meta">' + (transitive ? 'Transitive neighborhood' : 'Direct neighbors') + '</div>';

  html += '<div><span class="count">' + inc.length + '</span> incoming</div>';
  if (inc.length) html += '<ul>' + inc.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
  else html += '<div style="color:#777;font-size:12px;">No incoming</div>';

  html += '<div><span class="count">' + out.length + '</span> outgoing</div>';
  if (out.length) html += '<ul>' + out.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
  else html += '<div style="color:#777;font-size:12px;">No outgoing</div>';

  html += '<hr style="margin:8px 0;border:none;border-top:1px solid #eee;">';
  html += '<div style="font-weight:600;margin-bottom:6px;">Attached files (' + totalExtras + ')</div>';
  if (!totalExtras) {
    html += '<div style="color:#777;font-size:12px;">No attached files found</div>';
  } else {
    html += renderList('Styles',  extras.styles);
    html += renderList('Stories', extras.stories);
    html += renderList('Tests',   extras.tests);
    html += renderList('Docs',    extras.docs);
    html += renderList('Assets',  extras.assets);
    html += renderList('JSON',    extras.json);
    html += renderList('Other',   extras.other);
  }

  var panel = document.getElementById('panel');
  panel.innerHTML = html;
  panel.style.display = 'block';

  var btn = panel.querySelector('.close');
  if (btn) btn.addEventListener('click', function () { panel.style.display = 'none'; });
}


  function hidePanel() {
    if ($panel) $panel.style.display = 'none';
  }


  // highlite helpers
  function clearStyles() {
    cy.elements().removeClass('faded incoming outgoing highlight');
  }
  function highlightNode(n, transitive=false) {
    clearStyles();
    const inc = transitive ? n.predecessors() : n.incomers();
    const out = transitive ? n.successors()   : n.outgoers();
    const set = n.union(inc).union(out);
    cy.elements().difference(set).addClass('faded');
    inc.addClass('incoming');
    out.addClass('outgoing');
    n.addClass('highlight');
    cy.animate({ center: { eles: n }, duration: 200 });
  }
  function highlightEdge(e, transitive=false) {
    clearStyles();
    const s = e.source();
    const t = e.target();
    const inc = transitive ? s.predecessors().union(t.predecessors()) : s.incomers().union(t.incomers());
    const out = transitive ? s.successors().union(t.successors())     : s.outgoers().union(t.outgoers());
    const set = s.union(t).union(e).union(inc).union(out);
    cy.elements().difference(set).addClass('faded');
    inc.addClass('incoming');
    out.addClass('outgoing');
    s.add(t).addClass('highlight');
    cy.animate({ fit: { eles: s.union(t), padding: 60 }, duration: 200 });
  }

  cy.on('tap', 'node', (evt) => {
    const trans = document.getElementById('transitive')?.checked;
    highlightNode(evt.target, !!trans);
    renderPanelForNode(evt.target, !!trans);
  });

  cy.on('tap', 'edge', (evt) => {
    const trans = document.getElementById('transitive')?.checked;
    highlightEdge(evt.target, !!trans);
    hidePanel();
  });

  cy.on('tap', (evt) => { if (evt.target === cy) { clearStyles(); hidePanel(); } });

  const $search = document.getElementById('search');
  if ($search) {
    $search.addEventListener('change', () => {
      const q = $search.value.trim();
      if (!q) return clearStyles();
      const node = cy.$('node[id = "' + q.replace(/"/g, '\\"') + '"]');
      if (node.nonempty()) highlightNode(node[0], document.getElementById('transitive')?.checked);
    });
  }

  const $reset = document.getElementById('btn-reset');

  const $panel = document.getElementById('panel');

  if ($reset) $reset.addEventListener('click', () => {
    clearStyles();
    cy.reset();
    cy.fit();
    applyIOGrid();
  });
</script>
</body>
</html>
`;

fs.writeFileSync(OUTPUT, html, 'utf8');

// Display refactoring progress
const filledWidth = Math.round((migratedCount / totalComponents) * PROGRESS_BAR_WIDTH);
const emptyWidth = PROGRESS_BAR_WIDTH - filledWidth;
const progressBar = '█'.repeat(filledWidth) + '░'.repeat(emptyWidth);

console.log('·'.repeat(SEPARATOR_WIDTH));
console.log('  Refactoring Progress');
console.log(`  ${progressBar} ${migratedPct}%`);
console.log(`  ${migratedCount} of ${totalComponents} components refactored`);
console.log('');
console.log(`  📈 Graph available at: \x1b[1m\x1b[36m${OUTPUT}\x1b[0m`);
console.log('·'.repeat(SEPARATOR_WIDTH));
