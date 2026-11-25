/* ============================================================
   Гульнара Пегашева — персональный стилист
   Vanilla JS: меню, аккордеон, фильтры, лайтбокс,
   анимации появления, форма с переходом в Telegram
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Фиксированная шапка: тень при скролле ---------- */
  const header = document.getElementById('header');

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

 /* ---------- 2. Мобильное меню (самодостаточное) ---------- */
const burger = document.getElementById('burger');

// Стили панели добавляем отдельным <style> в <head> —
// они гарантированно применятся независимо от style.css
const menuStyles = document.createElement('style');
menuStyles.textContent = `
  .mobile-menu {
    position: fixed;
    top: 72px; left: 0; right: 0; bottom: 0;
    z-index: 90;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    padding: 40px 24px;
    background: #FAF8F5;
  }
  .mobile-menu.is-open {
    display: flex;
    animation: menuFade 0.25s ease;
  }
  @keyframes menuFade {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mobile-menu__link {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 30px;
    font-weight: 500;
    color: #1C1C1C;
    padding: 14px 0;
  }
  .mobile-menu__link:active { color: #7A1F2E; }
  .mobile-menu .btn { margin-top: 28px; }
`;
document.head.appendChild(menuStyles);

// Сама панель: создаём программно, в HTML ничего добавлять не нужно
const mobileMenu = document.createElement('nav');
mobileMenu.className = 'mobile-menu';
mobileMenu.setAttribute('aria-label', 'Мобильное меню');
mobileMenu.innerHTML = `
  <a href="#about" class="mobile-menu__link">Обо мне</a>
  <a href="#services" class="mobile-menu__link">Услуги и цены</a>
  <a href="#portfolio" class="mobile-menu__link">Портфолио</a>
  <a href="#contacts" class="mobile-menu__link">Контакты</a>
  <a href="#contacts" class="btn btn--accent">Записаться</a>
`;
document.body.appendChild(mobileMenu);

const closeMenu = () => {
  mobileMenu.classList.remove('is-open');
  burger.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open');
  burger.classList.toggle('is-open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Тап по ссылке закрывает меню и проматывает к секции
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// При расширении окна до десктопа меню закрывается
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) closeMenu();
});

    

  /* ---------- 3. Аккордеон услуг ---------- */
  const services = document.querySelectorAll('.service');

  services.forEach(service => {
    const head = service.querySelector('.service__head');

    head.addEventListener('click', () => {
      const isOpen = service.classList.contains('is-open');

      // Закрываем все остальные (классический «одно открытое» аккордеон)
      services.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.service__head').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        service.classList.add('is-open');
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- 4. Кнопка «Выбрать услугу» ---------- */
  const serviceSelect = document.getElementById('serviceSelect');

  document.querySelectorAll('.choose-service').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      serviceSelect.value = name;
      serviceSelect.classList.remove('has-error');
      hideError(serviceSelect);

      // Плавно прокручиваем к форме
      document.getElementById('contacts').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- 5. Фильтры портфолио ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- 6. Лайтбокс ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  const openLightbox = (src) => {
    lightboxImg.src = src;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // сбрасываем src, чтобы лайтбокс не показывал старое фото при открытии
    setTimeout(() => { lightboxImg.src = ''; }, 350);
  };

  portfolioItems.forEach(item => {
    const open = () => openLightbox(item.querySelector('img').dataset.full);

    item.addEventListener('click', open);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });

  /* ---------- 7. Анимация появления при скролле ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- 8. Форма заявки → Telegram ---------- */

  // МЕСТО ДЛЯ НАСТРОЙКИ: username вашего Telegram без @
  const TELEGRAM_USERNAME = 'pegashevagulya';

  const form = document.getElementById('bookingForm');
  const nameInput = document.getElementById('clientName');
  const contactInput = document.getElementById('clientContact');
  const toast = document.getElementById('toast');

  const showError = (input) => {
    const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
    input.classList.add('has-error');
    if (errorEl) errorEl.hidden = false;
  };

  const hideError = (input) => {
    const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
    input.classList.remove('has-error');
    if (errorEl) errorEl.hidden = true;
  };

  // Сброс ошибки при начале ввода
  [nameInput, contactInput, serviceSelect].forEach(input => {
    input.addEventListener('input', () => hideError(input));
    input.addEventListener('change', () => hideError(input));
  });

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 5000);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    // имя
    if (nameInput.value.trim().length < 2) {
      showError(nameInput);
      valid = false;
    }

    // Контакт: либо @ник Telegram, либо телефон (цифры, не меньше 7)
    const contact = contactInput.value.trim();
    const isTelegramNick = /^@[a-zA-Z0-9_]{3,}$/.test(contact);
    const isPhone = /^\+?[\d\s()-]{7,}$/.test(contact);
    if (!isTelegramNick && !isPhone) {
      showError(contactInput);
      valid = false;
    }

    // Услуга: выбрана из списка
    if (!serviceSelect.value) {
      showError(serviceSelect);
      valid = false;
    }
  const consent = document.getElementById('consentCheck');
  if (!consent.checked) {
    valid = false;
    showToast('Пожалуйста, дайте согласие на обработку персональных данных.');
    consent.closest('.field').scrollIntoView({ behavior: 'smooth', block: 'center' });
}


    if (!valid) return;

    // Собираем текст сообщения для Telegram
    const message = [
      'Здравствуйте, Гульнара!',
      `Меня зовут ${nameInput.value.trim()}.`,
      `Хочу записаться на услугу: «${serviceSelect.value}».`,
      `Связаться со мной можно здесь или по контакту: ${contact}.`
    ].join('\n');

    // Открываем чат с готовым текстом (encodeURIComponent — обязательен,
    // иначе переносы строк и кавычки сломают ссылку)
    const telegramUrl = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;

    showToast('Заявка собрана! Открываем Telegram…');
    form.reset();

    window.open(telegramUrl, '_blank', 'noopener');
  });

});

