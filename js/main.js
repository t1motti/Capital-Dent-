/**
 * Capital Dent — лендинг
 * Hero-карусель, фиксированный хедер, бургер-меню, модалка записи, формы (Ajax + honeypot), карусели
 */

(function () {
  'use strict';

  var FEEDBACK_URL = '';
  var BOOKING_URL = '';

  var header = document.getElementById('header');
  var burgerBtn = document.getElementById('burgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var modalBooking = document.getElementById('modalBooking');
  var feedbackForm = document.getElementById('feedbackForm');
  var feedbackSuccess = document.getElementById('feedbackSuccess');
  var bookingForm = document.getElementById('bookingForm');
  var bookingSuccess = document.getElementById('bookingSuccess');

  function updateHeaderScroll() {
    if (window.scrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }
  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (burgerBtn) {
    burgerBtn.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) closeMobileMenu();
      else openMobileMenu();
    });
  }
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  function openModal(el) {
    if (!el) return;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var firstInput = el.querySelector('input:not([type="hidden"]):not(.form__hp), textarea');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 100);
  }
  function closeModal(el) {
    if (!el) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-open-modal="booking"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(modalBooking);
      if (bookingSuccess) bookingSuccess.hidden = true;
      if (bookingForm) bookingForm.hidden = false;
    });
  });
  if (modalBooking) {
    modalBooking.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () { closeModal(modalBooking); });
    });
    modalBooking.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal(modalBooking);
    });
  }

  function isHoneypotFilled(form) {
    var hp = form.querySelector('.form__hp, input[name="website"]');
    return hp && hp.value.trim() !== '';
  }

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isHoneypotFilled(feedbackForm)) return;
      var submitBtn = feedbackForm.querySelector('button[type="submit"]');
      feedbackForm.classList.add('is-loading');
      if (submitBtn) submitBtn.disabled = true;

      var formData = new FormData(feedbackForm);
      var data = {};
      formData.forEach(function (v, k) {
        if (k !== 'website') data[k] = v;
      });

      function showSuccess() {
        feedbackForm.classList.remove('is-loading');
        if (submitBtn) submitBtn.disabled = false;
        feedbackForm.hidden = true;
        if (feedbackSuccess) feedbackSuccess.hidden = false;
      }

      if (FEEDBACK_URL) {
        fetch(FEEDBACK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify(data)
        })
          .then(function (res) {
            if (res.ok) showSuccess();
            else throw new Error('Ошибка отправки');
          })
          .catch(function () {
            feedbackForm.classList.remove('is-loading');
            if (submitBtn) submitBtn.disabled = false;
            alert('Не удалось отправить сообщение. Попробуйте позже или позвоните нам.');
          });
      } else {
        setTimeout(showSuccess, 500);
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isHoneypotFilled(bookingForm)) return;
      var submitBtn = bookingForm.querySelector('button[type="submit"]');
      bookingForm.classList.add('is-loading');
      if (submitBtn) submitBtn.disabled = true;

      var formData = new FormData(bookingForm);
      var data = {};
      formData.forEach(function (v, k) {
        if (k !== 'website') data[k] = v;
      });

      function showSuccess() {
        bookingForm.classList.remove('is-loading');
        if (submitBtn) submitBtn.disabled = false;
        bookingForm.hidden = true;
        if (bookingSuccess) bookingSuccess.hidden = false;
      }

      if (BOOKING_URL) {
        fetch(BOOKING_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify(data)
        })
          .then(function (res) {
            if (res.ok) showSuccess();
            else throw new Error('Ошибка отправки');
          })
          .catch(function () {
            bookingForm.classList.remove('is-loading');
            if (submitBtn) submitBtn.disabled = false;
            alert('Не удалось отправить заявку. Позвоните нам: +7 (495) 000-00-00');
          });
      } else {
        setTimeout(showSuccess, 500);
      }
    });
  }
  

  // ===== СЛАЙДЕР СПЕЦИАЛИСТОВ – ИСПРАВЛЕН (НЕ УПРАВЛЯЕТ ШИРИНОЙ) =====
  (function() {
    const slider = document.getElementById('specialistsSlider');
    if (!slider) return;
    
    const slides = Array.from(slider.children);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    
    let currentIndex = 0;
    let slidesToShow = getSlidesToShow();
    let totalSlides = slides.length;
    let maxIndex = Math.max(0, totalSlides - slidesToShow);
    
    function getSlidesToShow() {
      if (window.innerWidth < 992) return 1;
      return 4; // 4 карточки в ряд (уменьшено на 25%)
    }
    
    function updateSlidesPerView() {
      const newSlidesToShow = getSlidesToShow();
      if (newSlidesToShow !== slidesToShow) {
        slidesToShow = newSlidesToShow;
        maxIndex = Math.max(0, totalSlides - slidesToShow);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updateSliderPosition(false);
        updateDots();
      }
    }
    
    function updateSliderPosition(animate = true) {
      if (!slider) return;
      const containerWidth = slider.parentElement.clientWidth;
      if (containerWidth === 0) return;
      
      // БОЛЬШЕ НЕ ЗАДАЁМ ШИРИНУ КАРТОЧКАМ – ТОЛЬКО СДВИГ
      let offset;
      const gap = 16; // отступ между карточками в пикселях
      
      if (slidesToShow === 4) {
        // Получаем реальную ширину первой карточки (управляется CSS)
        const cardWidth = slides[0] ? slides[0].offsetWidth : 0;
        const slideStep = cardWidth + gap;
        offset = -(currentIndex * slideStep);
      } else {
        offset = -(currentIndex * containerWidth);
      }
      
      slider.style.transition = animate ? 'transform 0.3s ease' : 'none';
      slider.style.transform = `translateX(${offset}px)`;
      
      if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
      if (nextBtn) nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    }
    
    function updateDots() {
      if (!dotsContainer) return;
      const dotsCount = maxIndex + 1;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateSliderPosition(true);
          updateDots();
        });
        dotsContainer.appendChild(dot);
      }
    }
    
    function goNext() {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSliderPosition(true);
        updateDots();
      }
    }
    
    function goPrev() {
      if (currentIndex > 0) {
        currentIndex--;
        updateSliderPosition(true);
        updateDots();
      }
    }
    
    let touchStartX = 0, touchEndX = 0;
    function handleTouchStart(e) { touchStartX = e.touches[0].clientX; }
    function handleTouchMove(e) { touchEndX = e.touches[0].clientX; }
    function handleTouchEnd() {
      if (!touchStartX || !touchEndX) return;
      const deltaX = touchEndX - touchStartX;
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) goPrev(); else goNext();
      }
      touchStartX = 0; touchEndX = 0;
    }
    
    function initEvents() {
      if (prevBtn) prevBtn.addEventListener('click', goPrev);
      if (nextBtn) nextBtn.addEventListener('click', goNext);
      if (slider) {
        slider.addEventListener('touchstart', handleTouchStart, { passive: true });
        slider.addEventListener('touchmove', handleTouchMove, { passive: false });
        slider.addEventListener('touchend', handleTouchEnd);
      }
      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          updateSlidesPerView();
          updateSliderPosition(false);
          updateDots();
        }, 150);
      });
    }
    
    function init() {
      updateSlidesPerView();
      updateSliderPosition(false);
      updateDots();
      initEvents();
    }
    
    init();
  })();

  // ----- МОДАЛЬНОЕ ОКНО ДЛЯ УСЛУГ -----
  document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('serviceModal-4');
    const modalTitle = document.getElementById('modalTitle-4');
    const modalText = document.getElementById('modalText-4');
    const closeBtn = document.querySelector('.modal__close-4');
    
    const commonContent = `
      <p><strong>Цены на услуги:</strong></p>
      <table class="price-table-4">
        <tr><td>Профилактика и гигиена</td><td>7 000 ₽</td></tr>
        <tr><td>Хирургия</td><td>4 000 ₽</td></tr>
        <tr><td>Терапия</td><td>1 000 ₽</td></tr>
        <tr><td>Ортопедия</td><td>75 000 ₽</td></tr>
        <tr><td>Эндодонтия</td><td>4 000 ₽</td></tr>
        <tr><td>Эндодонтия под микроскопом</td><td>44 000 ₽</td></tr>
       </table>
    `;
    
    function openModal(serviceTitle) {
      modalText.innerHTML = commonContent;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
    
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      const titleElement = card.querySelector('.service-card__title');
      if (titleElement) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
          if (e.target.closest('.modal-4')) return;
          openModal();
        });
      }
    });
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });
  });

  // ----- СЛАЙДЕР АКЦИЙ (promo-3) -----
  (function() {
    const slidesData = [
        { title: "Летняя распродажа", description: "Скидка до 30% на все услуги", imgPath: "img/акция-1.jpg" },
        { title: "Новинки сезона", description: "Подарочный сертификат при заказе", imgPath: "img/акция-2.jpg" },
        { title: "Акция для двоих", description: "Второй участник в подарок", imgPath: "img/акция-3.jpg" },
        { title: "Кешбек 20%", description: "Возврат бонусами на карту", imgPath: "img/акция-4.jpg" }
    ];

    function getPromoImageHTML(imgPath, title) {
        return `<img src="${imgPath}" alt="${title}" class="promo__image-3" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 64 64\'%3E%3Crect width=\'64\' height=\'64\' fill=\'%23eef3f8\'/%3E%3Ctext x=\'32\' y=\'32\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%2392adc2\' font-size=\'12\'%3EОшибка%3C/text%3E%3C/svg%3E'">`;
    }

    function createPromoSlide(slide, idx) {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'promo__slide-3';
        slideDiv.setAttribute('data-slide-idx-3', idx);
        slideDiv.innerHTML = `<div class="promo__img-3">${getPromoImageHTML(slide.imgPath, slide.title)}</div>`;
        return slideDiv;
    }

    const track = document.getElementById('promoTrack-3');
    const prevBtn = document.getElementById('promoPrev-3');
    const nextBtn = document.getElementById('promoNext-3');
    const dotsContainer = document.getElementById('promoDots-3');

    let currentIdx = 0;
    const totalSlides = slidesData.length;

    function buildPromoSlider() {
        track.innerHTML = '';
        slidesData.forEach((slide, i) => track.appendChild(createPromoSlide(slide, i)));
        updateDotsUI();
        updateTrackTransform();
    }

    function updateTrackTransform() {
        if (!track.children.length) return;
        const slideWidth = track.children[0].getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const shift = currentIdx * (slideWidth + gap);
        track.style.transform = `translateX(-${shift}px)`;
        updateDotsActive();
    }

    function updateDotsUI() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('promo__dot-3');
            if (i === currentIdx) dot.classList.add('active-3');
            dot.addEventListener('click', () => {
                currentIdx = i;
                updateTrackTransform();
                updateDotsActive();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDotsActive() {
        const dots = document.querySelectorAll('.promo__dot-3');
        dots.forEach((dot, idx) => {
            if (idx === currentIdx) dot.classList.add('active-3');
            else dot.classList.remove('active-3');
        });
    }

    function nextSlide() { if (currentIdx < totalSlides - 1) { currentIdx++; updateTrackTransform(); updateDotsActive(); } }
    function prevSlide() { if (currentIdx > 0) { currentIdx--; updateTrackTransform(); updateDotsActive(); } }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    window.addEventListener('resize', () => updateTrackTransform());
    buildPromoSlider();
    setTimeout(() => updateTrackTransform(), 60);
    window.addEventListener('load', () => updateTrackTransform());
  })();

  // ----- Слайдер отзывов -----
  var revTrack = document.getElementById('revTrack');
  var revPrev = document.getElementById('revPrev');
  var revNext = document.getElementById('revNext');
  var revPrevNav = document.getElementById('revPrevNav');
  var revNextNav = document.getElementById('revNextNav');
  if (revTrack && revPrev && revNext) {
    var revCards = revTrack.querySelectorAll('.review-card');
    var revTotal = revCards.length;
    var revIndex = 0;
    var revGap = 24;

    function getRevStep() {
      var wrap = revTrack.closest('.reviews__track-wrap');
      if (!wrap || !revCards[0]) return { step: 0, visibleCount: 1, maxIndex: 0 };
      var cardWidth = revCards[0].offsetWidth;
      var visibleCount = Math.max(1, Math.floor((wrap.offsetWidth + revGap) / (cardWidth + revGap)));
      var step = visibleCount * (cardWidth + revGap);
      var maxIndex = Math.max(0, Math.ceil(revTotal / visibleCount) - 1);
      return { step: step, visibleCount: visibleCount, maxIndex: maxIndex };
    }

    function updateRevSlider() {
      var wrap = revTrack.closest('.reviews__track-wrap');
      if (!wrap) return;
      var r = getRevStep();
      revTrack.style.transform = 'translateX(-' + revIndex * r.step + 'px)';
      revPrev.disabled = revIndex <= 0;
      revNext.disabled = revIndex >= r.maxIndex;
      if (revPrevNav) revPrevNav.disabled = revIndex <= 0;
      if (revNextNav) revNextNav.disabled = revIndex >= r.maxIndex;
    }

    function revGo(dir) {
      var r = getRevStep();
      if (dir < 0 && revIndex > 0) { revIndex--; updateRevSlider(); }
      if (dir > 0 && revIndex < r.maxIndex) { revIndex++; updateRevSlider(); }
    }

    revPrev.addEventListener('click', function () { revGo(-1); });
    revNext.addEventListener('click', function () { revGo(1); });
    if (revPrevNav) revPrevNav.addEventListener('click', function () { revGo(-1); });
    if (revNextNav) revNextNav.addEventListener('click', function () { revGo(1); });
    window.addEventListener('resize', updateRevSlider);
    updateRevSlider();
  }

  // ----- Слайдер акций (старая версия, если есть) -----
  var promoTrack = document.getElementById('promoTrack');
  var promoPrev = document.getElementById('promoPrev');
  var promoNext = document.getElementById('promoNext');
  var promoDots = document.getElementById('promoDots');
  if (promoTrack && promoPrev && promoNext && promoDots) {
    var promoSlides = promoTrack.querySelectorAll('.promo__slide');
    var promoTotal = promoSlides.length;
    var promoIndex = 0;

    function updatePromoSlider() {
      promoTrack.style.transform = 'translateX(-' + promoIndex * 100 + '%)';
      promoPrev.disabled = promoIndex <= 0;
      promoNext.disabled = promoIndex >= promoTotal - 1;
      var dots = promoDots.querySelectorAll('span');
      for (var d = 0; d < dots.length; d++) dots[d].classList.toggle('is-active', d === promoIndex);
    }

    for (var i = 0; i < promoTotal; i++) {
      var dot = document.createElement('span');
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', 'Акция ' + (i + 1));
      (function (idx) {
        dot.addEventListener('click', function () { promoIndex = idx; updatePromoSlider(); });
      })(i);
      promoDots.appendChild(dot);
    }

    promoPrev.addEventListener('click', function () { if (promoIndex > 0) { promoIndex--; updatePromoSlider(); } });
    promoNext.addEventListener('click', function () { if (promoIndex < promoTotal - 1) { promoIndex++; updatePromoSlider(); } });
    updatePromoSlider();
  }
})();