/* Safe Caravan — POC interaction layer.
   Loaded on every screen. Makes the prototype behave like a live app:
   - every button does something (navigate / SweetAlert2 feedback / confirm),
   - login enters the app, logout asks then exits,
   - accordions, password toggles, real links and form submits keep working. */
(function () {
  if (window.self !== window.top) return; // inside the gallery iframes the gallery handles clicks

  // SweetAlert2
  if (!document.getElementById('sw2lib')) {
    var s = document.createElement('script');
    s.id = 'sw2lib'; s.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(s);
    var sc = document.createElement('style');
    sc.textContent = '.swal2-popup{direction:rtl;font-family:"Noto Sans Arabic",sans-serif}'
      + '.swal2-title,.swal2-html-container{font-family:"Noto Sans Arabic",sans-serif}';
    document.head.appendChild(sc);
  }
  function SW() { return window.Swal; }

  // tiny fallback toast (only if Swal not ready yet)
  var ft;
  function ftoast(msg) {
    var d = document.getElementById('scft');
    if (!d) {
      d = document.createElement('div'); d.id = 'scft';
      d.style.cssText = 'position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:100000;'
        + 'background:#14233a;color:#fff;font-family:"Noto Sans Arabic",sans-serif;font-size:13.5px;font-weight:600;'
        + 'padding:11px 18px;border-radius:999px;box-shadow:0 8px 24px rgba(20,35,58,.35);opacity:0;transition:opacity .2s';
      document.body.appendChild(d);
    }
    d.textContent = msg; d.style.opacity = '1';
    clearTimeout(ft); ft = setTimeout(function () { d.style.opacity = '0'; }, 1600);
  }
  function toast(icon, title) {
    if (SW()) SW().fire({ toast: true, position: 'top', icon: icon, title: title, showConfirmButton: false, timer: 1800, timerProgressBar: true });
    else ftoast(title);
  }
  function go(u) { location.href = u; }
  function loadingThen(title, url) {
    if (SW()) SW().fire({ title: title, timer: 1000, timerProgressBar: true, allowOutsideClick: false, showConfirmButton: false, didOpen: function () { SW().showLoading(); } }).then(function () { go(url); });
    else { ftoast(title); setTimeout(function () { go(url); }, 500); }
  }

  var NAV = [
    ['الرئيسية', '09-dashboard.html'], ['شحناتي', '10-shipments.html'],
    ['المحفظة', '13-wallet.html'], ['الإشعارات', '04-my-requests.html'],
    ['حسابي', '17-profile.html'], ['تواصل مع الدعم', '18-contact.html'],
    ['الشروط', '08-faq.html'], ['الخصوصية', '08-faq.html'],
    ['طلب جديد', '03-pre-alert.html'], ['كشف الحساب', '06-account-statement.html'],
    ['عنوان مخزن الصين', '12-china-address.html'], ['عرض الشحنة', '11-shipment-detail.html'],
    ['المصروفات', '16-charges.html']
  ];

  function block(e) { e.preventDefault(); e.stopPropagation(); }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('a,button');
    if (!el) return;
    if (el.closest('.swal2-container')) return;          // SweetAlert2 buttons
    if (el.hasAttribute('onclick')) return;              // accordion / password toggle / native back
    if (el.tagName === 'A') {
      var h = el.getAttribute('href') || '';
      if (h && h !== '#' && h.indexOf('javascript:') !== 0) return; // real link
    }

    var raw = (el.textContent || '').replace(/\s+/g, ' ').trim();
    var L = ((el.getAttribute('aria-label') || '') + ' ' + raw).trim();
    var ar = /[؀-ۿ]/.test(raw);

    // icon-only buttons
    if (!ar) {
      block(e);
      if (/arrow_back|arrow_forward|chevron/.test(raw)) { history.back(); return; }
      if (/\badd\b/.test(raw)) { go('03-pre-alert.html'); return; }
      if (/share/.test(raw)) { toast('success', 'تمت المشاركة'); return; }
      if (/^USD$|^LYD$|^CNY$/.test(raw)) { toast('success', 'تم تغيير العملة إلى ' + raw); return; }
      toast('success', 'تم'); return;
    }

    // logout -> confirm
    if (/تسجيل الخروج/.test(L)) {
      block(e);
      if (SW()) SW().fire({ title: 'تسجيل الخروج؟', text: 'سيتم إنهاء جلستك الحالية.', icon: 'question', showCancelButton: true, confirmButtonText: 'تسجيل الخروج', cancelButtonText: 'إلغاء', confirmButtonColor: '#d64550', cancelButtonColor: '#5b6b80' }).then(function (r) { if (r.isConfirmed) go('01-login.html'); });
      else if (confirm('تسجيل الخروج؟')) go('01-login.html');
      return;
    }
    // login -> enter app
    if (/(^|\s)دخول(\s|$)/.test(raw) && !/تسجيل الدخول/.test(raw)) { block(e); loadingThen('جاري تسجيل الدخول…', '09-dashboard.html'); return; }
    // register -> create account (needs terms)
    if (/إنشاء الحساب/.test(L)) {
      block(e);
      var terms = document.getElementById('terms');
      if (terms && !terms.checked) { toast('warning', 'يجب الموافقة على الشروط أولاً'); return; }
      loadingThen('جاري إنشاء الحساب…', '09-dashboard.html'); return;
    }
    // pre-alert -> success then go to requests
    if (/إرسال التنبيه/.test(L)) {
      block(e);
      if (SW()) SW().fire({ icon: 'success', title: 'تم إرسال التنبيه', text: 'سنخطرك فور وصول شحنتك إلى مخزن الصين.', confirmButtonText: 'حسناً', confirmButtonColor: '#1f5aa8' }).then(function () { go('04-my-requests.html'); });
      else go('04-my-requests.html');
      return;
    }

    // navigation tabs / CTAs
    for (var n = 0; n < NAV.length; n++) { if (L.indexOf(NAV[n][0]) !== -1) { block(e); go(NAV[n][1]); return; } }

    // realistic action feedback
    block(e);
    if (/نسخ/.test(L)) { toast('success', 'تم النسخ'); return; }
    if (/PDF|Excel|تحميل|تصدير|المرفق|الكشف|الإيصال|الفاتورة/.test(L)) { toast('success', 'جارٍ تجهيز الملف للتنزيل…'); return; }
    if (/OTP|رمز التحقق|إرسال رمز|رمز/.test(L)) { toast('success', 'تم إرسال رمز التحقق عبر واتساب'); return; }
    if (/تحديث كلمة المرور|حفظ التغييرات|حفظ/.test(L)) { toast('success', 'تم الحفظ بنجاح'); return; }
    if (/واتساب|محادثة|اتصال/.test(L)) { toast('info', 'يتم تحويلك إلى واتساب…'); return; }
    if (/نسيت كلمة المرور/.test(L)) { toast('success', 'تم إرسال رابط استعادة كلمة المرور'); return; }
    if (/عرض الشحنة|عرض المرفق|عرض/.test(L)) { toast('info', 'يتم فتح التفاصيل…'); return; }
    // filters / chips / anything else -> selection feedback
    toast('success', raw.length > 26 ? raw.slice(0, 26) + '…' : raw);
  }, true); // capture phase: runs before inline handlers so it can override them
})();
