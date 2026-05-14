// HAULIT — info.js

document.querySelectorAll('.faq__question').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq__item').forEach(function (el) {
      el.classList.remove('open');
      el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});