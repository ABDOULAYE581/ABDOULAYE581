/* Progressive enhancement: content stays visible if motion is unsupported. */
(function () {
  'use strict';
  if (!window.matchMedia || !('IntersectionObserver' in window)) return;
  var preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  var observer = null;
  var targets = document.querySelectorAll('.sec-head, .svc, .rb, .step, .info, .contact, .assurances span');

  function stop() {
    if (observer) observer.disconnect();
    observer = null;
    targets.forEach(function (element) {
      element.classList.remove('reveal-pending');
      element.style.removeProperty('--reveal-delay');
    });
  }

  function start() {
    stop();
    if (preference.matches) return;
    try {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
      targets.forEach(function (element) {
        // Never conceal keyboard focus or replay elements already seen.
        if (element.dataset.motionSeen) return;
        element.dataset.motionSeen = 'true';
        var siblings = element.parentElement.children;
        var index = Array.prototype.indexOf.call(siblings, element);
        element.style.setProperty('--reveal-delay', Math.min(index % 3 * 65, 130) + 'ms');
        element.classList.add('reveal-pending');
        observer.observe(element);
      });
    } catch (error) {
      stop();
    }
  }

  document.addEventListener('focusin', function (event) {
    var target = event.target.closest('.reveal-pending');
    if (target) {
      target.classList.remove('reveal-pending');
      if (observer) observer.unobserve(target);
    }
  });
  if (preference.addEventListener) preference.addEventListener('change', start);
  else if (preference.addListener) preference.addListener(start);
  start();
})();
