/* Injects the prototype navigator into every screen + wires obvious cross-links. Idempotent. */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'screens');
const NAV_TAG = '<script src="../nav.js"></script>';

// file-specific link wiring (safe no-op if a string isn't present)
const edits = {
  '01-login.html': [
    ['onsubmit="return false;"', 'onsubmit="location.href=\'04-my-requests.html\';return false;"'],
    ['href="#">سجّل الآن</a>', 'href="02-register.html">سجّل الآن</a>'],
  ],
  '02-register.html': [
    ['<form class="flex flex-col gap-5">', '<form class="flex flex-col gap-5" onsubmit="location.href=\'04-my-requests.html\';return false;">'],
    ['href="#">تسجيل الدخول</a>', 'href="01-login.html">تسجيل الدخول</a>'],
  ],
  '03-pre-alert.html': [
    ['onsubmit="return false;"', 'onsubmit="location.href=\'04-my-requests.html\';return false;"'],
  ],
};

let report = [];
fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort().forEach(f => {
  const p = path.join(dir, f);
  let html = fs.readFileSync(p, 'utf8');
  const before = html;
  let notes = [];

  // 1) inject navigator before the last </body>
  if (html.indexOf('nav.js') === -1) {
    const idx = html.lastIndexOf('</body>');
    if (idx !== -1) {
      html = html.slice(0, idx) + '\n' + NAV_TAG + '\n' + html.slice(idx);
      notes.push('nav');
    }
  }

  // 2) wire every back button to history.back()
  if (html.indexOf('aria-label="رجوع"') !== -1 && html.indexOf('aria-label="رجوع" onclick') === -1) {
    html = html.split('aria-label="رجوع" class=').join('aria-label="رجوع" onclick="history.back()" class=');
    notes.push('back');
  }

  // 3) file-specific link wiring
  (edits[f] || []).forEach(([from, to]) => {
    if (html.indexOf(from) !== -1) { html = html.split(from).join(to); notes.push('link'); }
  });

  if (html !== before) { fs.writeFileSync(p, html, 'utf8'); }
  report.push(f + ' -> ' + (notes.length ? notes.join(',') : 'no change'));
});
console.log(report.join('\n'));
