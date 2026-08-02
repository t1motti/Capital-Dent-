document.addEventListener('DOMContentLoaded', () => {

  const header = document.querySelector('.header')
  const headerHeight = header.clientHeight
  const burgerBtn = document.getElementById('burgerBtn')
  const mobileMenuEl = document.querySelector('.header__nav')

  const heroPaddingTop = () => {
    const element = document.querySelector('.pt')
    if (element) element.style.paddingTop = `${headerHeight}px`
  }
  heroPaddingTop()

  const specialistsSwiper = new Swiper('.specialists-slider .swiper', {
    slidesPerView: 3,
    spaceBetween: 32,
    navigation: {
      nextEl: '.specialists-slider .swiper-button-next',
      prevEl: '.specialists-slider .swiper-button-prev'
    },
    breakpoints: {
      360: { slidesPerView: 1.3, spaceBetween: 20 },
      576: { slidesPerView: 1.5, spaceBetween: 32 },
      768: { slidesPerView: 2, spaceBetween: 32 },
      992: { slidesPerView: 2.5, spaceBetween: 32 },
      1200: { slidesPerView: 3, spaceBetween: 32 }
    }
  })

  const reviewstsSwiper = new Swiper('.reviews-slider .swiper', {
    slidesPerView: 3,
    spaceBetween: 32,
    navigation: {
      nextEl: '.reviews-slider .swiper-button-next',
      prevEl: '.reviews-slider .swiper-button-prev'
    },
    breakpoints: {
      360: { slidesPerView: 1, spaceBetween: 16 },
      576: { slidesPerView: 1.5, spaceBetween: 22 },
      768: { slidesPerView: 2, spaceBetween: 22 },
      992: { slidesPerView: 2.5, spaceBetween: 22 },
      1200: { slidesPerView: 3, spaceBetween: 32 }
    }
  })

  const reviewCard = {
    parents: document.querySelectorAll('.review-card'),

    init() {
      this.parents.forEach(parent => {

        const content = parent.querySelector('.review-card__content')
        const text = parent.querySelector('.review-card__text')
        const btn = parent.querySelector('.review-card__more')

        let flag = false

        const stars = [...parent.querySelectorAll('.stars__item')]
        const value = parent.dataset.rating

        stars.slice(value).forEach(star => star.classList.add('grayscale'))

        if (content.clientHeight > 80) {
          content.classList.add('collapsed')
        }

        btn.addEventListener('click', () => {
          flag = !flag
          text.classList.toggle('active')
          btn.classList.toggle('active')
          btn.textContent = flag ? 'скрыть' : '...еще'
        })

      })
    }
  }

  reviewCard.init()

  const heightEqualizer = selector => {

    const elements = document.querySelectorAll(selector)
    let maxHeight = 0

    elements.forEach(element => {
      if (maxHeight <= element.clientHeight) maxHeight = element.clientHeight
    })

    elements.forEach(element => {
      element.style.minHeight = `${maxHeight}px`
    })

  }

  heightEqualizer('.specialist-card')
  heightEqualizer('.review-card')

  const sideOverlay = () => {

    const elements = document.querySelectorAll('.side-overlay')
    const container = document.querySelector('.container')

    elements.forEach(element => {
      element.style.width = `${(window.innerWidth - (container.offsetWidth + 20)) / 2}px`
    })

  }

  sideOverlay()

  const swiperBanners = new Swiper('.banners__slider .swiper', {
    spaceBetween: 24,
    pagination: {
      el: '.banners__slider .swiper-pagination'
    }
  })

  // --- Форма обратной связи (Ajax) ---
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
  /* ---------------- БУРГЕР МЕНЮ ---------------- */


function openMobileMenu() {
  mobileMenu.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  burgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  burgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

burgerBtn.addEventListener('click', () => {
  if (mobileMenu.classList.contains('is-open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

  /* ------ SLIDER ------*/
      (function() {
        // ----- ЭЛЕМЕНТЫ -----
        const track = document.getElementById('sliderTrack');
        const prevBtn = document.querySelector('.arrow-left');
        const nextBtn = document.querySelector('.arrow-right');
        const dotsContainer = document.getElementById('sliderDots');
        const counterSpan = document.getElementById('sliderCounter');

        // Получаем все карточки (слайды)
        let slides = Array.from(document.querySelectorAll('.gallery_card'));
        const totalSlides = slides.length;

        // Параметры видимости (сколько карточек показываем в зависимости от ширины)
        let slidesPerView = getSlidesPerView();
        let currentIndex = 0;          // индекс первого видимого слайда
        let maxIndex = 0;               // максимальный индекс первого элемента (обновляется динамически)

        // Функция определения сколько карточек показывать (на основе медиа-запросов CSS)
        function getSlidesPerView() {
            const width = window.innerWidth;
            if (width >= 901) return 3;        // 3 карточки
            if (width >= 641 && width <= 900) return 2;  // 2 карточки
            return 1;                           // 1 карточка
        }

        // Обновление максимального индекса (сколько может быть первых элементов)
        function updateMaxIndex() {
            maxIndex = Math.max(0, totalSlides - slidesPerView);
            // корректируем currentIndex, если он вышел за пределы
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            if (currentIndex < 0) currentIndex = 0;
        }

        // Перемещение слайдера (сдвиг track)
        function moveSlider() {
            if (!track) return;
            // Ширина одного слайда + gap (24px)
            // Получаем реальную ширину первого слайда, чтобы точно рассчитать смещение в px
            if (slides.length === 0) return;
            const slideWidth = slides[0].offsetWidth;
            const gap = 24; // соответствует CSS gap
            const offset = currentIndex * (slideWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;
            updateDotsAndCounter();
        }

        // Обновить активные точки и счётчик
        function updateDotsAndCounter() {
            // Обновляем точки
            const dots = document.querySelectorAll('.dot');
            if (dots.length) {
                // активная точка соответствует номеру "страницы" (первый видимый слайд)
                // обычно каждая точка соответствует индексу начала слайда
                dots.forEach((dot, idx) => {
                    if (idx === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
            // обновляем счётчик: показываем текущий "экран" и общее количество "экранов"
            const totalPages = maxIndex + 1;
            const currentPage = currentIndex + 1;
            if (counterSpan) {
                counterSpan.innerText = `${currentPage} / ${totalPages}`;
            }
        }

        // Построить точки пагинации (кнопки)
        function buildDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const pagesCount = maxIndex + 1;
            for (let i = 0; i < pagesCount; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.setAttribute('data-index', i);
                dot.addEventListener('click', (e) => {
                    const targetIdx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                    if (!isNaN(targetIdx) && targetIdx !== currentIndex && targetIdx <= maxIndex && targetIdx >= 0) {
                        currentIndex = targetIdx;
                        moveSlider();
                    }
                });
                dotsContainer.appendChild(dot);
            }
        }

        // Полное обновление слайдера при изменении размеров окна или загрузке
        function refreshSlider() {
            const newSlidesPerView = getSlidesPerView();
            const wasDifferent = (slidesPerView !== newSlidesPerView);
            slidesPerView = newSlidesPerView;
            updateMaxIndex();

            // пересоздаём точки, т.к. изменилось количество страниц
            buildDots();
            // убеждаемся, что currentIndex корректен
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;
            moveSlider();   // пересчитывает смещение и обновляет точки/счётчик
            if (wasDifferent) {
                // если изменилось кол-во видимых карточек, нужно пересчитать смещение еще раз после рефлоу
                setTimeout(() => {
                    moveSlider();
                }, 50);
            }
        }

        // Обработчики стрелок
        function onPrev() {
            if (currentIndex > 0) {
                currentIndex--;
                moveSlider();
            } else {
                // опционально: зациклить? нет, просто анимация фидбека
                if (prevBtn) {
                    prevBtn.style.transform = 'translateY(-50%) scale(0.92)';
                    setTimeout(() => { if(prevBtn) prevBtn.style.transform = ''; }, 150);
                }
            }
        }

        function onNext() {
            if (currentIndex < maxIndex) {
                currentIndex++;
                moveSlider();
            } else {
                if (nextBtn) {
                    nextBtn.style.transform = 'translateY(-50%) scale(0.92)';
                    setTimeout(() => { if(nextBtn) nextBtn.style.transform = ''; }, 150);
                }
            }
        }

        // обработчик ресайза с debounce
        let resizeTimer;
        function handleResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                refreshSlider();
            }, 150);
        }

        // Инициализация, а также контроль за динамическим изменением DOM (гарантия)
        function initSlider() {
            slides = Array.from(document.querySelectorAll('.gallery_card')); // обновляем коллекцию
            if (slides.length === 0) return;
            slidesPerView = getSlidesPerView();
            updateMaxIndex();
            buildDots();
            moveSlider();

            // добавим события
            prevBtn.addEventListener('click', onPrev);
            nextBtn.addEventListener('click', onNext);
            window.addEventListener('resize', handleResize);
        }

        // наблюдатель на случай, если картинки (или что-то) меняют размеры, но у нас всё статично, но перестраховка
        // также после полной загрузки изображений (но у нас их нет, однако следим за layout)
        window.addEventListener('load', () => {
            initSlider();
            // дополнительно после полной загрузки ещё раз синхронизируем (на случай шрифтов)
            setTimeout(() => {
                if (track) moveSlider();
            }, 80);
        });

        // если DOM уже загружен, запускаем (для надёжности)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSlider);
        } else {
            initSlider();
        }
    })();

    (function() {
    // ----- Данные лицензий с реальными изображениями -----
    const licensesData2 = [
        { title: "Лицензия №1", description: "Медицинская деятельность", imgPath: "assets/images/doc_capital_dent_1.jpg" },
        { title: "Лицензия №2", description: "Образовательная лицензия", imgPath: "assets/images/doc_capital_dent_2.jpg" },
        { title: "Лицензия №3", description: "Строительная экспертиза", imgPath: "assets/images/doc_capital_dent_3.jpg" },
        { title: "Лицензия №4", description: "Фармацевтическая лицензия", imgPath: "assets/images/doc_capital_dent_4.jpg" },
        { title: "Лицензия №5", description: "Транспортная перевозка", imgPath: "assets/images/doc_capital_dent_5.jpg" },
        { title: "Лицензия №6", description: "Охранная деятельность", imgPath: "assets/images/doc_capital_dent_6.jpg" },
        { title: "Лицензия №7", description: "Аудиторское заключение", imgPath: "assets/images/doc_capital_dent_7.jpg" },
        { title: "Лицензия №8", description: "Лицензия Ростехнадзор", imgPath: "assets/images/doc_capital_dent_8.jpg" }
    ];

    // Функция для создания HTML изображения
    function getLicenseImageHTML(imgPath, title) {
        return `<img src="${imgPath}" alt="${title}" class="license-image-2" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 64 64\'%3E%3Crect width=\'64\' height=\'64\' fill=\'%23eef2f5\'/%3E%3Ctext x=\'32\' y=\'32\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%238fabb9\' font-size=\'12\'%3EИзображение%3C/text%3E%3C/svg%3E'">`;
    }

    // создание карточки-заглушки (минималистичный дизайн)
    function createLicenseCard2(license, index) {
        const card = document.createElement('div');
        card.className = 'license-card-2';
        card.setAttribute('data-index-2', index);
        
        card.innerHTML = `
            <div class="license-img-2">
                ${getLicenseImageHTML(license.imgPath, license.title)}
            </div>
            <div class="license-info-2">
                <h4>${escapeHtml2(license.title)}</h4>
                <p>${escapeHtml2(license.description)}</p>
            </div>
        `;
        
        // клик по карточке: открыть модальное окно
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal2(license);
        });
        return card;
    }

    // простая защита от XSS
    function escapeHtml2(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // Модальное окно (увеличенная версия, с эффектом затемнения)
    const modalOverlay2 = document.getElementById('modalOverlay-2');
    const modalImgContainer2 = document.getElementById('modalImgContainer-2');
    const modalTitleElem2 = document.getElementById('modalTitle-2');
    const modalDescElem2 = document.getElementById('modalDesc-2');
    const closeModalBtn2 = document.getElementById('closeModalBtn-2');

    function openModal2(license) {
        // наполняем модалку увеличенным изображением
        modalImgContainer2.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                <img src="${license.imgPath}" alt="${license.title}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 64 64\'%3E%3Crect width=\'64\' height=\'64\' fill=\'%23eef2f5\'/%3E%3Ctext x=\'32\' y=\'32\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%238fabb9\' font-size=\'12\'%3EИзображение%3C/text%3E%3C/svg%3E'">
            </div>
        `;
        modalTitleElem2.textContent = license.title;
        modalDescElem2.textContent = license.description;
        modalOverlay2.classList.add('active-2');
        document.body.style.overflow = 'hidden';
    }

    function closeModal2() {
        modalOverlay2.classList.remove('active-2');
        document.body.style.overflow = '';
    }

    modalOverlay2.addEventListener('click', (e) => {
        if (e.target === modalOverlay2) closeModal2();
    });
    closeModalBtn2.addEventListener('click', closeModal2);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay2.classList.contains('active-2')) closeModal2();
    });

    // ----- ЛОГИКА СЛАЙДЕРА (карусель) -----
    const track2 = document.getElementById('sliderTrack-2');
    const prevButton2 = document.getElementById('prevBtn-2');
    const nextButton2 = document.getElementById('nextBtn-2');
    const dotsContainer2 = document.getElementById('dotsContainer-2');

    let currentIndex2 = 0;
    let cardWidth2 = 0;
    let visibleCards2 = 3;
    let totalCards2 = licensesData2.length;

    // заполняем слайдер карточками
    function buildSlider2() {
        track2.innerHTML = '';
        licensesData2.forEach((lic, idx) => {
            const card = createLicenseCard2(lic, idx);
            track2.appendChild(card);
        });
        updateDots2();
        updateSliderParams2();
        updateTrackPosition2(false);
    }

    function updateSliderParams2() {
        if (!track2.children.length) return;
        const containerWidth = track2.parentElement.clientWidth;
        const firstCard = track2.children[0];
        const computedCardWidth = firstCard.getBoundingClientRect().width;
        const computedGap = parseFloat(getComputedStyle(track2).gap) || 24;
        const totalItemWidth = computedCardWidth + computedGap;
        let possibleVisible = Math.floor(containerWidth / totalItemWidth);
        if (possibleVisible < 1) possibleVisible = 1;
        // на основе ширины контейнера задаем visibleCards2 с учётом брейкпоинтов
        if (window.innerWidth <= 640) visibleCards2 = 1;
        else if (window.innerWidth <= 960) visibleCards2 = 2;
        else visibleCards2 = 3;
        cardWidth2 = computedCardWidth;
        const maxIndex = Math.max(0, totalCards2 - visibleCards2);
        if (currentIndex2 > maxIndex) currentIndex2 = maxIndex;
        updateDotsActive2();
    }

    function updateTrackPosition2(animate = true) {
        if (!track2.children.length) return;
        const gap = parseFloat(getComputedStyle(track2).gap) || 0;
        const cardRealWidth = track2.children[0].getBoundingClientRect().width;
        const shift = currentIndex2 * (cardRealWidth + gap);
        track2.style.transform = `translateX(-${shift}px)`;
        updateDotsActive2();
    }

    function updateDots2() {
        dotsContainer2.innerHTML = '';
        const dotsCount = totalCards2;
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot-2');
            if (i === currentIndex2) dot.classList.add('active-2');
            dot.addEventListener('click', () => {
                currentIndex2 = i;
                clampIndex2();
                updateTrackPosition2(true);
                updateDotsActive2();
            });
            dotsContainer2.appendChild(dot);
        }
    }

    function updateDotsActive2() {
        const dots = document.querySelectorAll('.dot-2');
        dots.forEach((dot, idx) => {
            if (idx === currentIndex2) dot.classList.add('active-2');
            else dot.classList.remove('active-2');
        });
    }

    function clampIndex2() {
        let max = Math.max(0, totalCards2 - visibleCards2);
        if (currentIndex2 > max) currentIndex2 = max;
        if (currentIndex2 < 0) currentIndex2 = 0;
    }

    function nextSlide2() {
        if (totalCards2 <= visibleCards2) return;
        const maxIndex = Math.max(0, totalCards2 - visibleCards2);
        if (currentIndex2 < maxIndex) {
            currentIndex2++;
            updateTrackPosition2(true);
            updateDotsActive2();
        }
    }

    function prevSlide2() {
        if (currentIndex2 > 0) {
            currentIndex2--;
            updateTrackPosition2(true);
            updateDotsActive2();
        }
    }

    // обработчики
    prevButton2.addEventListener('click', prevSlide2);
    nextButton2.addEventListener('click', nextSlide2);
    window.addEventListener('resize', () => {
        updateSliderParams2();
        updateTrackPosition2(false);
    });

    // инициализация после загрузки DOM
    buildSlider2();
    setTimeout(() => {
        updateSliderParams2();
        updateTrackPosition2(false);
    }, 50);
    window.addEventListener('load', () => {
        updateSliderParams2();
        updateTrackPosition2(false);
    });
})();
    

  /* ---------------- MODAL ---------------- */

  class Modal {

    isOpen = false
    #overlayEl = null
    #buttonCloseEls = null
    #triggerEls = null
    #activeModal = null

    constructor(overlaySelector, modalSelector, buttonCloseSelector, triggerSelector, transitionTime) {

      this.overlaySelector = overlaySelector
      this.modalSelector = modalSelector
      this.buttonCloseSelector = buttonCloseSelector
      this.triggerSelector = triggerSelector
      this.transitionTime = transitionTime

      this.#init()

    }

    #init() {

      this.#overlayEl = document.querySelector(this.overlaySelector)
      this.#triggerEls = document.querySelectorAll(this.triggerSelector)
      this.#buttonCloseEls = document.querySelectorAll(this.buttonCloseSelector)

      this.#triggerEls.forEach(triggerEl => {

        triggerEl.addEventListener('click', () => {
          this.open(triggerEl.dataset.modal)
        })

      })

      this.#buttonCloseEls.forEach(buttonCloseEl => {

        buttonCloseEl.addEventListener('click', () => {
          this.close()
        })

      })

      this.#overlayEl.addEventListener('click', () => {
        this.close()
      })

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && this.isOpen) this.close()
      })

    }

    open(id, callback) {

      if (this.isOpen) return

      const modalElement = document.getElementById(id)
      if (!modalElement) return

      this.#activeModal = modalElement
      this.#activeModal.style.transition = `${this.transitionTime}ms`

      this.isOpen = true

      if (document.body.offsetHeight > window.innerHeight) {
        document.body.style.overflow = 'hidden'
        document.documentElement.style.scrollbarGutter = 'stable'
      }

      this.#overlayEl.classList.add('active')
      this.#activeModal.classList.add('active')

      requestAnimationFrame(() => {
        this.#activeModal.classList.add('fade')
      })

      if (typeof callback === 'function') {
        callback(this.#activeModal)
      }

    }

    close() {

      this.isOpen = false
      const activeModal = this.#activeModal

      this.#activeModal.classList.remove('fade')

      setTimeout(() => {

        document.body.style.overflow = ''
        document.documentElement.style.scrollbarGutter = ''

        this.#overlayEl.classList.remove('active')
        activeModal.classList.remove('active')

        this.#activeModal = null

      }, this.transitionTime)

    }

  }

  window.modal = new Modal(
    '.modal-overlay',
    '.modal',
    '.modal__button-close',
    '.modal-trigger',
    200
  )

})

const ua = navigator.userAgent;

let width = window.innerWidth;

if (/mobile/i.test(ua)) {
    console.log("Пользователь зашел с телефона 📱");
} else if (/tablet/i.test(ua)) {
    console.log("Пользователь зашел с планшета 📲");
} else {
    console.log("Пользователь зашел с компьютера 🖥️");
}

let resizeTimer;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    location.reload();
  }, 300);
});
