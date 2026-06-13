/* ============================================================
   GlassPro — лендинг: вся интерактивность на ванильном JS
   ============================================================ */
(function () {
    "use strict";

    /* ---------- Прелоадер ---------- */
    const preloader = document.getElementById("preloader");
    if (preloader) {
        const hidePreloader = () => {
            preloader.classList.add("is-done");
            setTimeout(() => preloader.remove(), 700);
        };
        if (document.readyState === "complete") {
            setTimeout(hidePreloader, 1400);
        } else {
            window.addEventListener("load", () => setTimeout(hidePreloader, 1400));
            // Страховка: убрать прелоадер максимум через 5с, даже если что-то грузится
            setTimeout(hidePreloader, 5000);
        }
    }

    /* ---------- Шапка: фон при скролле ---------- */
    const header = document.getElementById("header");
    const onScrollHeader = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScrollHeader, { passive: true });
    onScrollHeader();

    /* ---------- Бургер-меню ---------- */
    const burger = document.getElementById("burger");
    const nav = document.getElementById("nav");
    const navOverlay = document.getElementById("navOverlay");

    const setMenu = (open) => {
        nav.classList.toggle("is-open", open);
        burger.classList.toggle("is-open", open);
        navOverlay.classList.toggle("is-open", open);
        burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
        document.body.style.overflow = open ? "hidden" : "";
    };

    burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
    navOverlay.addEventListener("click", () => setMenu(false));

    nav.querySelectorAll(".nav__link").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    /* ---------- Появление блоков при скролле ---------- */
    const animated = document.querySelectorAll("[data-animate]");
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const delay = parseInt(el.dataset.delay || "0", 10);
                setTimeout(() => el.classList.add("is-visible"), delay);
                revealObserver.unobserve(el);
            });
        },
        { threshold: 0.12 }
    );
    animated.forEach((el) => revealObserver.observe(el));

    /* ---------- Плавный счётчик цифр ---------- */
    const counters = document.querySelectorAll("[data-counter]");
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.counter, 10);
                const duration = 1400;
                const start = performance.now();

                const tick = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(target * eased).toLocaleString("ru-RU");
                    if (progress < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
                counterObserver.unobserve(el);
            });
        },
        { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));

    /* ---------- Лёгкий параллакс свечений в hero ---------- */
    const glows = document.querySelectorAll(".hero__glow");
    if (glows.length && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener(
            "scroll",
            () => {
                const y = window.scrollY;
                if (y > 800) return;
                glows.forEach((glow, i) => {
                    glow.style.transform = `translateY(${y * (i ? -0.06 : 0.1)}px)`;
                });
            },
            { passive: true }
        );
    }

    /* ---------- Слайдеры сравнения «до/после» ---------- */
    document.querySelectorAll("[data-compare]").forEach((box) => {
        const range = box.querySelector(".compare__range");
        const update = () => box.style.setProperty("--pos", range.value + "%");
        range.addEventListener("input", update);
        update();
    });

    /* ---------- Табы цен ---------- */
    const tabButtons = document.querySelectorAll(".tabs__btn");
    tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            tabButtons.forEach((b) => b.classList.remove("is-active"));
            btn.classList.add("is-active");
            document.querySelectorAll(".tabs__panel").forEach((panel) => {
                panel.classList.toggle("is-active", panel.dataset.panel === btn.dataset.tab);
            });
        });
    });

    /* ---------- Карусель отзывов ---------- */
    const track = document.getElementById("reviewsTrack");
    const prevBtn = document.getElementById("reviewsPrev");
    const nextBtn = document.getElementById("reviewsNext");
    const dotsBox = document.getElementById("reviewsDots");
    const slides = track.children;
    let index = 0;

    const perView = () => {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    };
    const maxIndex = () => Math.max(0, slides.length - perView());

    const renderDots = () => {
        dotsBox.innerHTML = "";
        for (let i = 0; i <= maxIndex(); i++) {
            const dot = document.createElement("button");
            dot.className = "slider__dot" + (i === index ? " is-active" : "");
            dot.setAttribute("aria-label", "Отзыв " + (i + 1));
            dot.addEventListener("click", () => goTo(i));
            dotsBox.appendChild(dot);
        }
    };

    const goTo = (i) => {
        index = Math.max(0, Math.min(i, maxIndex()));
        const gap = 24;
        const slideWidth = slides[0].getBoundingClientRect().width + gap;
        track.style.transform = `translateX(-${index * slideWidth}px)`;
        renderDots();
    };

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));
    window.addEventListener("resize", () => goTo(index));

    // Свайп на мобильном
    let touchX = null;
    track.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
    track.addEventListener(
        "touchend",
        (e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
            touchX = null;
        },
        { passive: true }
    );

    renderDots();

    /* ---------- Маска телефона ---------- */
    const phoneInput = document.getElementById("phone");

    const formatPhone = (digits) => {
        // нормализуем: 8 → 7, добавляем 7 если начали с 9
        if (digits.startsWith("8")) digits = "7" + digits.slice(1);
        if (digits.startsWith("9")) digits = "7" + digits;
        digits = digits.slice(0, 11);

        let out = "+7";
        if (digits.length > 1) out += " (" + digits.slice(1, 4);
        if (digits.length >= 4) out += ") " + digits.slice(4, 7);
        if (digits.length >= 7) out += "-" + digits.slice(7, 9);
        if (digits.length >= 9) out += "-" + digits.slice(9, 11);
        return out;
    };

    phoneInput.addEventListener("input", () => {
        const digits = phoneInput.value.replace(/\D/g, "");
        phoneInput.value = digits ? formatPhone(digits) : "";
    });

    /* ---------- Валидация и отправка формы ---------- */
    const form = document.getElementById("orderForm");
    const nameInput = document.getElementById("name");
    const agreeInput = document.getElementById("agree");
    const successMsg = document.getElementById("orderSuccess");

    const showError = (key, show) => {
        const error = form.parentElement.querySelector(`[data-error="${key}"]`) ||
            form.querySelector(`[data-error="${key}"]`);
        if (error) error.classList.toggle("is-shown", show);
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;

        const nameOk = nameInput.value.trim().length >= 2;
        nameInput.classList.toggle("is-invalid", !nameOk);
        showError("name", !nameOk);
        if (!nameOk) valid = false;

        const phoneOk = phoneInput.value.replace(/\D/g, "").length === 11;
        phoneInput.classList.toggle("is-invalid", !phoneOk);
        showError("phone", !phoneOk);
        if (!phoneOk) valid = false;

        showError("agree", !agreeInput.checked);
        if (!agreeInput.checked) valid = false;

        if (!valid) return;

        // ИНТЕГРАЦИЯ: здесь отправка заявки на бэкенд / в Telegram-бот
        // fetch('/api/order', { method: 'POST', body: new FormData(form) })
        form.reset();
        successMsg.hidden = false;
        setTimeout(() => (successMsg.hidden = true), 6000);
    });

    [nameInput, phoneInput].forEach((input) => {
        input.addEventListener("input", () => {
            input.classList.remove("is-invalid");
            showError(input.id, false);
        });
    });
    agreeInput.addEventListener("change", () => showError("agree", false));

    /* ---------- Кнопка «Наверх» ---------- */
    const toTop = document.getElementById("toTop");
    window.addEventListener(
        "scroll",
        () => toTop.classList.toggle("is-visible", window.scrollY > 600),
        { passive: true }
    );
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();
