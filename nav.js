/* Safe Caravan demo — natural in-app navigation wiring (no visible UI).
   Makes the prototype flow like a real app: login enters, logout exits,
   bottom-nav tabs and CTAs move between the available screens, back goes back.
   Elements that already have their own behaviour (accordion, password toggle,
   wired links, form submits) are left untouched. */
(function () {
  if (window.self !== window.top) return; // inside the gallery iframes the gallery handles clicks

  // exact bottom-nav / tab labels -> screen
  var EXACT = {
    'الرئيسية': '04-my-requests.html',
    'شحناتي': '04-my-requests.html',
    'المحفظة': '05-wallet-payments.html',
    'الإشعارات': '04-my-requests.html',
    'حسابي': '07-security.html'
  };
  // CTA phrases (substring of label/aria) -> screen
  var CONTAINS = [
    ['إرسال التنبيه', '04-my-requests.html'],
    ['تسجيل الخروج', '01-login.html'],
    ['تواصل مع الدعم', '08-faq.html'],
    ['الدعم', '08-faq.html'],
    ['طلب جديد', '03-pre-alert.html'],
    ['تنبيه بشحنة', '03-pre-alert.html'],
    ['كشف الحساب', '06-account-statement.html'],
    ['المحفظة', '05-wallet-payments.html'],
    ['مدفوعات', '05-wallet-payments.html']
  ];

  document.addEventListener('click', function (e) {
    var el = e.target.closest('a,button');
    if (!el) return;
    if (el.hasAttribute('onclick')) return;                       // accordion / password toggle / wired
    if (el.tagName === 'BUTTON' && el.type === 'submit') return;  // login/register form submit handles it

    if (el.tagName === 'A') {
      var href = el.getAttribute('href') || '';
      if (href && href !== '#' && href.indexOf('javascript:') !== 0) return; // real link -> let it work
    }

    var label = ((el.getAttribute('aria-label') || '') + ' ' + (el.textContent || '')).replace(/\s+/g, ' ').trim();

    // back buttons
    if (/رجوع|back/i.test(label) || el.querySelector('[data-icon="arrow_back"]')) {
      e.preventDefault(); history.back(); return;
    }
    // exact tab label
    var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (EXACT[t]) { e.preventDefault(); location.href = EXACT[t]; return; }
    // CTA phrases
    for (var r = 0; r < CONTAINS.length; r++) {
      if (label.indexOf(CONTAINS[r][0]) !== -1) { e.preventDefault(); location.href = CONTAINS[r][1]; return; }
    }
    // dead anchors (href="#") -> just don't jump to top
    if (el.tagName === 'A' && (el.getAttribute('href') || '') === '#') e.preventDefault();
  }, false);
})();
