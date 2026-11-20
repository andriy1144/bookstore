import { memo } from 'react';

// Кольорова гама обкладинки залежить від жанру книги.
const genrePalette = {
  'Програмування': ['#1d4e89', '#3a7bd5'],
  'Антиутопія': ['#3b3b3b', '#7a1f1f'],
  'Наукпоп': ['#0f5e5c', '#36a39f'],
  'Українська класика': ['#7a4b00', '#d19a2a'],
  'Фентезі': ['#2f5d34', '#7bab4f'],
  'Саморозвиток': ['#6a2c70', '#b83b5e'],
};

const fallbackPalette = ['#44546a', '#8497b0'];

// Згенерована обкладинка: замінює фотографії, на використання яких
// потрібні права видавця, і не потребує завантаження зображень.
function BookCover({ book, size = 'md' }) {
  const [from, to] = genrePalette[book.genre] ?? fallbackPalette;

  return (
    <div
      className={`book-cover book-cover--${size}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      role="img"
      aria-label={`Обкладинка книги «${book.title}»`}
    >
      <span className="book-cover__genre">{book.genre}</span>
      <span className="book-cover__title">{book.title}</span>
      <span className="book-cover__author">{book.author}</span>
    </div>
  );
}

export default memo(BookCover);
