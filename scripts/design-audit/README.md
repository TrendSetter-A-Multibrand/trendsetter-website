# Сверка сайта с макетом Figma (текст, шрифты, координаты)

Для каждой страницы и ширины (1440 и 375) сравнивает то, что нарисовано в Figma, с тем, что реально рисует сайт:
размер и жирность шрифта, положение по X, скачки по вертикали. Совпадающие тексты ищутся по содержанию, поэтому
данные из Storyblok, которых нет в макете, в сверку не попадают.

Нужны: `FIGMA_TOKEN` (из `.env.local`), Chrome и `playwright-core` (`npm i --no-save playwright-core`).
Сверять лучше с production-сборкой (`next build && next start -p 3101`): у dev-сервера бывают свои ошибки в консоли.

    python scripts/design-audit/fetch_figma.py "$FIGMA_TOKEN" figma_texts.json
    AUDIT_BASE=http://localhost:3101/ru_ru node scripts/design-audit/collect.mjs "" dom_all.json
    python scripts/design-audit/compare.py <папка с обоими файлами>      # пишет report.txt

В отчёте «шрифт» и «X» — реальные расхождения, а «скачки Y» чаще всего вызваны другим содержимым страницы
(в макете один набор новостей, на сайте другой). Ключи страниц и адреса — в начале `fetch_figma.py` и `collect.mjs`.
