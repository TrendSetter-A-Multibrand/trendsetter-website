/**
 * A showcase article that uses every block an article can hold, so the editor
 * can open it, see what each block looks like on the page and copy the one she
 * wants. It is published, so the designer can look at it on the site too; pass
 * --draft to take it off the site again and leave it in the editor only.
 *
 * npm run storyblok:seed-article-demo
 */
import { api, block, folder, putStory } from "./mapi.mjs";

const P = (n: string) => ({ filename: `/images/home/${n}` });
const ALL = ["journal/1.jpg", "journal/2.jpg", "news/1.jpg", "news/2.jpg", "news/3.jpg", "news/4.jpg"];
const many = (count: number) => Array.from({ length: count }, (_, i) => P(ALL[i % ALL.length]));

const TEXT =
  "Это пример текста, чтобы было видно, как блок выглядит на странице. Замените его своим. Блоки можно ставить в любом порядке и повторять сколько нужно.\n\nПустая строка между абзацами делает новый абзац.";

const parent = await folder("journal", "Журнал");

const body = [
  block("article_lead", { body: "Крупный абзац для вступления: он заметно больше обычного текста и задаёт тон статьи." }),
  block("article_text", { subtitle: "Обычный текст", body: TEXT }),
  block("article_text_columns", { subtitle: "Текст в две колонки", body: `${TEXT}\n\n${TEXT}\n\n${TEXT}` }),
  block("article_list", { subtitle: "Список с точками", ordered: false, items: "Первый пункт\nВторой пункт\nТретий пункт" }),
  block("article_list", { subtitle: "Нумерованный список", ordered: true, items: "Сначала это\nПотом это\nВ конце вот это" }),
  block("article_divider", { style: "line" }),
  block("article_text_image", { subtitle: "Текст и фото: фото справа, половина ширины", body: TEXT, image: P("news/1.jpg"), caption: "Подпись под фото", image_side: "right", image_width: "half", image_ratio: "square" }),
  block("article_text_image", { subtitle: "Текст и фото: фото слева", body: TEXT, image: P("news/2.jpg"), caption: "Подпись под фото", image_side: "left", image_width: "half", image_ratio: "landscape" }),
  block("article_text_image", { subtitle: "Маленькое фото справа: треть ширины", body: TEXT, image: P("news/3.jpg"), image_side: "right", image_width: "third", image_ratio: "portrait" }),
  block("article_text_image", { subtitle: "Маленькое фото слева: треть ширины", body: TEXT, image: P("news/4.jpg"), caption: "Подпись", image_side: "left", image_width: "third", image_ratio: "square" }),
  block("article_text_image", { subtitle: "Фото как в оригинале", body: TEXT, image: P("journal/1.jpg"), image_side: "right", image_width: "half", image_ratio: "auto" }),
  block("article_text_photos", { subtitle: "Текст и несколько фото: колонка слева", body: TEXT, images: many(3), side: "left", ratio: "landscape" }),
  block("article_text_photos", { subtitle: "Текст и несколько фото: колонка справа", body: TEXT, images: many(2), side: "right", ratio: "square" }),
  block("article_divider", { style: "dots" }),
  block("article_photo", { image: P("journal/1.jpg"), caption: "Фото на всю ширину экрана", size: "full", align: "center", ratio: "panorama" }),
  block("article_photo", { image: P("journal/2.jpg"), caption: "Фото во всю ширину статьи, как в оригинале", size: "wide", align: "center", ratio: "auto" }),
  block("article_photo", { image: P("news/4.jpg"), caption: "Среднее фото по центру", size: "medium", align: "center", ratio: "landscape" }),
  block("article_photo", { image: P("news/1.jpg"), caption: "Мини-фото слева", size: "small", align: "left", ratio: "square" }),
  block("article_photo", { image: P("news/2.jpg"), caption: "Мини-фото справа", size: "small", align: "right", ratio: "square" }),
  block("article_images", { images: many(2), ratio: "square", caption: "Ряд из двух" }),
  block("article_images", { images: many(3), ratio: "portrait", caption: "Ряд из трёх вертикальных" }),
  block("article_images", { images: many(4), ratio: "square" }),
  block("article_images", { images: many(1), ratio: "landscape", caption: "Ряд из одной фотографии" }),
  block("article_images", { images: many(6), ratio: "landscape", caption: "Шесть фото: переносятся на второй ряд" }),
  block("article_photo", { image: P("news/3.jpg"), caption: "Одно фото: во всю ширину статьи, вертикальное", size: "wide", align: "center", ratio: "portrait" }),
  block("article_photo", { image: P("journal/2.jpg"), caption: "Среднее фото справа, квадрат", size: "medium", align: "right", ratio: "square" }),
  block("article_photo", { image: P("news/4.jpg"), caption: "Среднее фото слева, панорама", size: "medium", align: "left", ratio: "panorama" }),
  block("article_photo", { image: P("news/1.jpg"), caption: "Мини-фото по центру", size: "small", align: "center", ratio: "portrait" }),
  block("article_photo_row", { ratio: "landscape", items: many(3).map((image, i) => block("article_photo_item", { image, caption: `Своя подпись ${i + 1}` })) }),
  block("article_photo_row", { ratio: "portrait", items: many(4).map((image, i) => block("article_photo_item", { image, caption: `Подпись ${i + 1}` })) }),
  block("article_photo_row", { ratio: "square", items: many(2).map((image, i) => block("article_photo_item", { image, caption: `Две подписи: ${i + 1}` })) }),
  block("article_gallery_scroll", { images: many(6), ratio: "landscape", size: "medium", caption: "Лента с прокруткой: средние фото, листайте вбок" }),
  block("article_gallery_scroll", { images: many(6), ratio: "square", size: "small", caption: "Лента с прокруткой: маленькие квадраты" }),
  block("article_gallery_scroll", { images: many(5), ratio: "portrait", size: "large", caption: "Лента с прокруткой: большие вертикальные" }),
  block("article_gallery_mosaic", { images: many(5), layout: "feature-left", caption: "Мозаика: большая слева" }),
  block("article_gallery_mosaic", { images: many(3), layout: "feature-right" }),
  block("article_gallery_mosaic", { images: many(6), layout: "grid", caption: "Ровная сетка" }),
  block("article_pullquote", { text: "Короткая фраза крупно, с красной линией слева.", author: "Кто-то важный" }),
  block("article_pullquote", { text: "Выноска без подписи автора." }),
  block("article_quote", { subtitle: "Цитата на красной полосе", body: "Она идёт на всю ширину экрана и подходит для самой главной мысли статьи." }),
  block("article_video", { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", caption: "Видео с YouTube или RuTube" }),
  block("article_spacer", { size: "l" }),
  block("article_text", { subtitle: "Конец", body: "Это последний блок примера." }),
];

const done = await putStory(
  "primer-blokov",
  "Пример: все блоки статьи",
  {
    component: "article",
    section: "journal",
    title: "Пример: все блоки статьи",
    tags: ["Стиль"],
    hero: P("journal/1.jpg"),
    author: "Trendsetter",
    published_at: "2026-10-07 10:00",
    reading_minutes: "5",
    views: "0",
    excerpt: "Каждый блок статьи, который можно собрать в Storyblok.",
    body,
  },
  parent,
  "journal/primer-blokov"
);
console.log(`${done}  journal/primer-blokov  (блоков ${body.length})`);

if (process.argv.includes("--draft")) {
  const { stories } = await api("/stories?with_slug=journal/primer-blokov");
  await api(`/stories/${stories[0].id}/unpublish`);
  console.log("снята с публикации - видна только в редакторе");
}
