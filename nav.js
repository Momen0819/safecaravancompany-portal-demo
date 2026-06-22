/* Safe Caravan demo — make every button respond like a real app (no visible chrome).
   - Navigation buttons (bottom-nav tabs, CTAs, login/logout) move between screens.
   - Action buttons (download / copy / OTP / contact / filters / currency …) give
     realistic app feedback (a small snackbar) so nothing is dead.
   - Accordions, password toggles, form submits and real links keep their own behaviour. */
(function () {
  if (window.self !== window.top) return; // inside the gallery iframes the gallery handles clicks

  /* snackbar */
  var css = '#scsnack{position:fixed;bottom:22px;left:50%;transform:translateX(-50%) translateY(12px);'
    + 'z-index:100000;background:#14233a;color:#fff;font-family:"Noto Sans Arabic",sans-serif;font-size:13.5px;'
    + 'font-weight:600;padding:12px 20px;border-radius:999px;box-shadow:0 10px 28px rgba(20,35,58,.38);'
    + 'opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;max-width:90vw;text-align:center}'
    + '#scsnack.show{opacity:1;transform:translateX(-50%) translateY(0)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var snack = document.createElement('div'); snack.id = 'scsnack'; document.body.appendChild(snack);
  var snackT;
  function toast(msg) {
    snack.textContent = msg; snack.classList.add('show');
    clearTimeout(snackT); snackT = setTimeout(function () { snack.classList.remove('show'); }, 1600);
  }

  // navigation: substring of label -> screen
  var NAV = [
    ['تسجيل الخروج', '01-login.html'],
    ['الرئيسية', '04-my-requests.html'],
    ['شحناتي', '04-my-requests.html'],
    ['المحفظة', '05-wallet-payments.html'],
    ['الإشعارات', '04-my-requests.html'],
    ['حسابي', '07-security.html'],
    ['تواصل مع الدعم', '08-faq.html'],
    ['الشروط', '08-faq.html'],
    ['الخصوصية', '08-faq.html'],
    ['إرسال التنبيه', '04-my-requests.html'],
    ['طلب جديد', '03-pre-alert.html'],
    ['كشف الحساب', '06-account-statement.html']
  ];

  function actionMsg(L) {
    if (/نسخ/.test(L)) return '✅ تم النسخ';
    if (/PDF|Excel|تحميل|تصدير|المرفق|الكشف|الإيصال|الفاتورة/.test(L)) return '📄 جارٍ تجهيز الملف للتنزيل…';
    if (/OTP|رمز التحقق|إرسال رمز|رمز/.test(L)) return '✅ تم إرسال رمز التحقق عبر واتساب';
    if (/تحديث كلمة المرور|حفظ التغييرات|إنشاء الحساب/.test(L)) return '✅ تم الحفظ بنجاح';
    if (/واتساب|محادثة|اتصال/.test(L)) return '💬 يتم تحويلك إلى واتساب…';
    if (/نسيت كلمة المرور/.test(L)) return '📩 تم إرسال رابط استعادة كلمة المرور';
    if (/عرض الشحنة|عرض المرفق|عرض/.test(L)) return '🚚 يتم فتح التفاصيل…';
    return '';
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('a,button');
    if (!el) return;
    if (el.hasAttribute('onclick')) return;                       // accordion / password toggle / wired back
    if (el.tagName === 'BUTTON' && el.type === 'submit') return;  // login/register form submit handles it
    if (el.tagName === 'A') {
      var href = el.getAttribute('href') || '';
      if (href && href !== '#' && href.indexOf('javascript:') !== 0) return; // real link -> let it work
    }

    var raw = (el.textContent || '').replace(/\s+/g, ' ').trim();
    var L = ((el.getAttribute('aria-label') || '') + ' ' + raw).trim();
    var hasArabic = /[؀-ۿ]/.test(raw);

    // icon-only buttons (no Arabic text)
    if (!hasArabic) {
      e.preventDefault();
      if (/arrow_back|arrow_forward|chevron/.test(raw)) { history.back(); return; }
      if (/\badd\b/.test(raw)) { location.href = '03-pre-alert.html'; return; }   // "+" new request
      if (/share/.test(raw)) { toast('✅ تمت المشاركة'); return; }
      if (/^USD$|^LYD$|^CNY$/.test(raw)) { toast('💱 تم تغيير العملة إلى ' + raw); return; }
      toast('✓'); return;
    }

    // navigation
    for (var n = 0; n < NAV.length; n++) {
      if (L.indexOf(NAV[n][0]) !== -1) { e.preventDefault(); location.href = NAV[n][1]; return; }
    }
    // realistic action feedback
    var msg = actionMsg(L);
    if (msg) { e.preventDefault(); toast(msg); return; }
    // filters / chips / anything else -> selection feedback (never dead)
    e.preventDefault();
    toast('✓ ' + (raw.length > 26 ? raw.slice(0, 26) + '…' : raw));
  }, false);
})();
