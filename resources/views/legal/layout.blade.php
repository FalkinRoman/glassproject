<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') — РемСкол</title>
    <meta name="robots" content="noindex, follow">
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>

<header class="header is-scrolled">
    <div class="container header__inner">
        <a href="/" class="logo">
            <span class="logo__icon">◈</span>
            <span class="logo__text">Рем<b>Скол</b></span>
        </a>
        <div class="header__actions">
            <a href="tel:+79160125160" class="header__phone">+7 (916) 012-51-60</a>
        </div>
    </div>
</header>

<main class="legal">
    <a href="/" class="legal__back">← На главную</a>
    @yield('content')
</main>

<footer class="footer">
    <div class="container">
        <p class="footer__copy">© 2026 РемСкол — ремонт сколов, трещин и полировка автостёкол</p>
    </div>
</footer>

</body>
</html>
