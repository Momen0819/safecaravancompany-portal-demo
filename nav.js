/* Safe Caravan prototype navigator — links the demo screens together.
   Only shows when a screen is opened standalone (hidden inside the gallery iframes). */
(function () {
  if (window.self !== window.top) return;

  var S = [
    ['01-login.html', 'تسجيل الدخول'],
    ['02-register.html', 'إنشاء حساب جديد'],
    ['03-pre-alert.html', 'تنبيه بشحنة قادمة'],
    ['04-my-requests.html', 'طلباتي وتنبيهاتي'],
    ['05-wallet-payments.html', 'مدفوعاتي وإيصالاتي'],
    ['06-account-statement.html', 'كشف الحساب الشامل'],
    ['07-security.html', 'الأمان وكلمة المرور'],
    ['08-faq.html', 'الأسئلة الشائعة']
  ];
  var cur = (location.pathname.split('/').pop() || '').toLowerCase();
  var i = -1;
  for (var k = 0; k < S.length; k++) { if (S[k][0] === cur) { i = k; break; } }
  if (i < 0) i = 0;
  var prev = S[(i - 1 + S.length) % S.length][0];
  var next = S[(i + 1) % S.length][0];

  var css = ''
    + '#scnv *{box-sizing:border-box;font-family:"Noto Sans Arabic",sans-serif}'
    + '.scnv-bar{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);z-index:99999;'
    + 'display:flex;align-items:center;gap:4px;background:rgba(13,27,46,.92);backdrop-filter:blur(6px);'
    + 'border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:5px;'
    + 'box-shadow:0 10px 30px -8px rgba(13,27,46,.6)}'
    + '.scnv-b{appearance:none;border:0;background:transparent;color:#fff;cursor:pointer;'
    + 'font-size:14px;font-weight:700;height:38px;padding:0 12px;border-radius:999px;'
    + 'display:flex;align-items:center;justify-content:center;text-decoration:none;line-height:1}'
    + '.scnv-b:hover{background:rgba(255,255,255,.14)}'
    + '.scnv-arrow{width:38px;padding:0;font-size:22px}'
    + '.scnv-menu{background:#1f5aa8}'
    + '.scnv-sheet{position:fixed;inset:0;z-index:99998;background:rgba(13,27,46,.5);'
    + 'display:none;align-items:flex-end;justify-content:center}'
    + '.scnv-sheet.open{display:flex}'
    + '.scnv-panel{background:#fff;width:100%;max-width:440px;border-radius:20px 20px 0 0;'
    + 'padding:10px 12px calc(14px + env(safe-area-inset-bottom));max-height:80vh;overflow:auto;'
    + 'box-shadow:0 -10px 40px rgba(13,27,46,.3)}'
    + '.scnv-head{display:flex;align-items:center;justify-content:space-between;'
    + 'font-weight:800;color:#14233a;font-size:16px;padding:8px 8px 12px}'
    + '.scnv-x{appearance:none;border:0;background:#f1f5f9;color:#14233a;width:30px;height:30px;'
    + 'border-radius:50%;font-size:15px;cursor:pointer}'
    + '.scnv-item{display:flex;align-items:center;gap:10px;padding:13px 12px;border-radius:12px;'
    + 'color:#14233a;text-decoration:none;font-size:15px;font-weight:600}'
    + '.scnv-item:hover{background:#f1f6fc}'
    + '.scnv-active{background:#e8f1fb;color:#1f5aa8}'
    + '.scnv-home{background:#1f5aa8;color:#fff;justify-content:center;margin-bottom:6px}'
    + '.scnv-home:hover{background:#16447f}'
    + '.scnv-n{width:26px;height:26px;border-radius:50%;background:#e8f1fb;color:#1f5aa8;'
    + 'display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex:0 0 auto}'
    + '.scnv-active .scnv-n{background:#1f5aa8;color:#fff}'
    + '.scnv-cur{margin-inline-start:auto;font-size:11px;background:#1f5aa8;color:#fff;'
    + 'padding:2px 8px;border-radius:999px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var items = '';
  for (var j = 0; j < S.length; j++) {
    items += '<a href="' + S[j][0] + '" class="scnv-item' + (j === i ? ' scnv-active' : '') + '">'
      + '<span class="scnv-n">' + (j + 1) + '</span><span>' + S[j][1] + '</span>'
      + (j === i ? '<span class="scnv-cur">الحالية</span>' : '') + '</a>';
  }

  var wrap = document.createElement('div'); wrap.id = 'scnv';
  wrap.innerHTML =
    '<div class="scnv-bar">'
    + '<a class="scnv-b scnv-arrow" href="' + prev + '" title="السابق">›</a>'
    + '<button class="scnv-b scnv-menu" id="scnvToggle">☰ الشاشات</button>'
    + '<a class="scnv-b scnv-arrow" href="' + next + '" title="التالي">‹</a>'
    + '</div>'
    + '<div class="scnv-sheet" id="scnvSheet"><div class="scnv-panel">'
    + '<div class="scnv-head"><span>شاشات النموذج (' + (i + 1) + '/' + S.length + ')</span>'
    + '<button class="scnv-x" id="scnvClose">✕</button></div>'
    + '<a href="../index.html" class="scnv-item scnv-home">🏠 المعرض الرئيسي</a>'
    + items + '</div></div>';
  document.body.appendChild(wrap);

  var sheet = document.getElementById('scnvSheet');
  document.getElementById('scnvToggle').addEventListener('click', function () { sheet.classList.add('open'); });
  document.getElementById('scnvClose').addEventListener('click', function () { sheet.classList.remove('open'); });
  sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.classList.remove('open'); });
})();
