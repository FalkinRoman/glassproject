# glassproject

Лендинг студии ремонта автостёкол **РемСкол** — ремонт сколов, трещин, полировка и шлифовка лобовых стёкол в Зеленограде.

## Демо (GitHub Pages)

https://falkinroman.github.io/glassproject/

### Включить Pages

1. Repo → **Settings** → **Pages**
2. **Build and deployment** → Source: **Deploy from a branch**
3. Branch: **main**, folder: **/docs**
4. Save — через 1–2 минуты сайт будет доступен по ссылке выше

### Пересобрать статику после правок

```bash
./scripts/build-github-pages.sh
git add docs/
git commit -m "Rebuild GitHub Pages"
git push
```

## Локально (Laravel)

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```

Откроется на http://127.0.0.1:8000
