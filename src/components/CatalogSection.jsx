import { startTransition, useDeferredValue, useState } from "react";
import BookDetailDialog from "./BookDetailDialog.jsx";
import {
  bookStatusLabels,
  catalogFilters,
} from "../data/polkaContent.js";

const catalogSortModes = [
  { value: "recommended", label: "Рекомендации" },
  { value: "available", label: "Сначала доступные" },
  { value: "title", label: "По названию" },
];

const catalogPreviewLimit = 4;

export default function CatalogSection({ books, onReserveBook }) {
  const [bookQuery, setBookQuery] = useState("");
  const [bookFilter, setBookFilter] = useState("all");
  const [sortMode, setSortMode] = useState("recommended");
  const [isCatalogExpanded, setIsCatalogExpanded] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const deferredBookQuery = useDeferredValue(bookQuery);
  const normalizedBookQuery = deferredBookQuery.trim().toLowerCase();
  const activeCatalogFilter =
    catalogFilters.find((filter) => filter.value === bookFilter)?.label ?? "Все";
  const availableBooksCount = books.filter(
    (book) => book.status === "available"
  ).length;
  const hasActiveCatalogFilters = Boolean(bookQuery.trim()) || bookFilter !== "all";
  const quickSearches = [
    "Фантастика",
    "Поэзия",
    "Нон-фикшн",
    "Павелецкая",
    "Парк культуры",
    "Курский вокзал",
  ];

  const filteredBooks = books.filter((book) => {
    const matchesQuery =
      book.title.toLowerCase().includes(normalizedBookQuery) ||
      book.author.toLowerCase().includes(normalizedBookQuery) ||
      book.station.toLowerCase().includes(normalizedBookQuery);

    const matchesFilter =
      bookFilter === "all" ||
      book.genre === bookFilter ||
      book.status === bookFilter;

    return matchesQuery && matchesFilter;
  });
  const sortedBooks = [...filteredBooks].sort((firstBook, secondBook) => {
    if (sortMode === "title") {
      return firstBook.title.localeCompare(secondBook.title, "ru");
    }

    const statusRank = {
      available: 0,
      reserved: 1,
      moving: 2,
    };

    if (sortMode === "available") {
      return (
        statusRank[firstBook.status] - statusRank[secondBook.status] ||
        firstBook.title.localeCompare(secondBook.title, "ru")
      );
    }

    const recommendationScore = (book) =>
      (book.status === "available" ? 30 : 0) +
      (book.condition === "новое" ? 15 : 0) +
      (book.condition === "отличное" ? 10 : 0) +
      (book.genre === "Фантастика" ? 4 : 0);

    return (
      recommendationScore(secondBook) - recommendationScore(firstBook) ||
      firstBook.title.localeCompare(secondBook.title, "ru")
    );
  });
  const visibleBooks = isCatalogExpanded
    ? sortedBooks
    : sortedBooks.slice(0, catalogPreviewLimit);
  const hiddenBooksCount = Math.max(sortedBooks.length - visibleBooks.length, 0);
  const canToggleCatalog = sortedBooks.length > catalogPreviewLimit;

  const resetCatalogFilters = () => {
    startTransition(() => {
      setBookQuery("");
      setBookFilter("all");
      setSortMode("recommended");
      setIsCatalogExpanded(false);
    });
  };

  const applyQuickSearch = (value) => {
    startTransition(() => {
      setIsCatalogExpanded(false);

      if (catalogFilters.some((filter) => filter.value === value)) {
        setBookFilter(value);
        return;
      }

      setBookQuery(value);
    });
  };

  const updateBookQuery = (value) => {
    startTransition(() => {
      setBookQuery(value);
      setIsCatalogExpanded(false);
    });
  };

  const updateBookFilter = (value) => {
    startTransition(() => {
      setBookFilter(value);
      setIsCatalogExpanded(false);
    });
  };

  const updateSortMode = (value) => {
    startTransition(() => {
      setSortMode(value);
      setIsCatalogExpanded(false);
    });
  };

  const toggleCatalogExpansion = () => {
    startTransition(() => setIsCatalogExpanded((current) => !current));
  };

  const openBookDetail = (book) => {
    startTransition(() => setSelectedBook(book));
  };

  const closeBookDetail = () => {
    startTransition(() => setSelectedBook(null));
  };

  const reserveFromDetail = (book) => {
    closeBookDetail();
    onReserveBook(book);
  };

  return (
    <>
      <section id="catalog" className="section catalog-section">
        <div className="service-head" data-reveal="up">
          <p className="eyebrow">живой каталог</p>
          <h2>Книги, которые можно забрать сейчас</h2>
          <p>
            Это прототип каталога: пользователь ищет книгу, открывает её
            полноценную страницу, смотрит аннотацию и только потом решает,
            бронировать ли экземпляр.
          </p>
        </div>

        <div className="catalog-discovery" data-reveal="up">
          <p>Быстрые входы</p>

          <div className="catalog-quick-picks">
            {quickSearches.map((value) => (
              <button
                key={value}
                type="button"
                className="catalog-quick-pick"
                onClick={() => applyQuickSearch(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-toolbar" data-reveal="up">
          <input
            value={bookQuery}
            onChange={(event) => updateBookQuery(event.target.value)}
            placeholder="Поиск: книга, автор или станция"
            aria-label="Поиск по каталогу книг"
          />

          <div className="catalog-filters">
            {catalogFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={bookFilter === filter.value ? "active" : ""}
                aria-pressed={bookFilter === filter.value}
                onClick={() => updateBookFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-sort-row" data-reveal="up">
          <span>Порядок показа</span>

          <div className="catalog-sort-pills">
            {catalogSortModes.map((mode) => (
              <button
                key={mode.value}
                type="button"
                className={sortMode === mode.value ? "active" : ""}
                aria-pressed={sortMode === mode.value}
                onClick={() => updateSortMode(mode.value)}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-summary" role="status" aria-live="polite">
          <div className="catalog-summary-card">
            <strong>{visibleBooks.length}</strong>
            <span>
              {hiddenBooksCount > 0
                ? "книги показаны сейчас"
                : sortedBooks.length === books.length
                  ? "книг в каталоге"
                  : "книг подходят под текущий запрос"}
            </span>
          </div>

          <div className="catalog-summary-card">
            <strong>{availableBooksCount}</strong>
            <span>можно забрать прямо сейчас</span>
          </div>

          {hiddenBooksCount > 0 && (
            <div className="catalog-summary-card catalog-summary-muted">
              <strong>+{hiddenBooksCount}</strong>
              <span>книг скрыто, чтобы каталог оставался компактным</span>
            </div>
          )}

          {hasActiveCatalogFilters && (
            <button
              type="button"
              className="catalog-reset"
              onClick={resetCatalogFilters}
            >
              Сбросить поиск
            </button>
          )}
        </div>

        {sortedBooks.length > 0 ? (
          <>
            <div className="book-catalog-grid">
              {visibleBooks.map((book, index) => (
                <article
                  key={book.id}
                  className="catalog-book-card"
                  style={{ "--reveal-delay": `${(index % 5) * 85}ms` }}
                >
                  <button
                    type="button"
                    className="catalog-book-surface"
                    onClick={() => openBookDetail(book)}
                    aria-label={`Открыть страницу книги ${book.title}`}
                  >
                    <div className={`generated-book-cover generated-${book.color}`}>
                      <div className="book-shine" />
                      <div className="book-spine-mini" />
                      <span className="book-genre">{book.genre}</span>
                      <strong>{book.title}</strong>
                      <small>{book.author}</small>
                      <div className="book-pattern">
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>

                    <div className="catalog-book-info">
                      <div>
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                      </div>

                      <div className="book-meta">
                        <span>{book.station}</span>
                        <span>Состояние: {book.condition}</span>
                        <span>
                          {book.year} · {book.pages}
                        </span>
                      </div>

                      <p className="catalog-book-blurb">{book.annotation}</p>
                    </div>
                  </button>

                  <div className="book-status-row">
                    <span className={`book-status status-${book.status}`}>
                      {bookStatusLabels[book.status] ?? book.status}
                    </span>

                    <div className="catalog-book-actions">
                      <button
                        type="button"
                        className="catalog-book-link"
                        onClick={() => openBookDetail(book)}
                      >
                        Открыть страницу
                      </button>

                      <button
                        type="button"
                        disabled={book.status !== "available"}
                        onClick={() => onReserveBook(book)}
                      >
                        {book.status === "available"
                          ? "Забронировать"
                          : "Недоступна"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {canToggleCatalog && (
              <div className="catalog-expand-panel">
                <p>
                  {isCatalogExpanded
                    ? "Каталог раскрыт полностью. Можно свернуть его обратно до четырёх главных книг."
                    : `Ещё ${hiddenBooksCount} книг скрыто, чтобы блок не занимал слишком много места.`}
                </p>

                <button
                  type="button"
                  className="catalog-expand-button"
                  onClick={toggleCatalogExpansion}
                  aria-expanded={isCatalogExpanded}
                >
                  {isCatalogExpanded
                    ? "Свернуть каталог"
                    : `Показать ещё ${hiddenBooksCount}`}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="catalog-empty" data-reveal="scale">
            <strong>Совпадений пока нет</strong>
            <p>
              {bookQuery.trim()
                ? `По запросу «${bookQuery.trim()}»`
                : "С текущими настройками"}
              {bookFilter !== "all" ? ` и фильтре «${activeCatalogFilter}»` : ""}{" "}
              не нашлось подходящих книг. Попробуй изменить поиск или показать весь
              каталог.
            </p>

            <button
              type="button"
              className="ghost-btn"
              onClick={resetCatalogFilters}
            >
              Показать все книги
            </button>
          </div>
        )}
      </section>

      <BookDetailDialog
        book={selectedBook}
        onClose={closeBookDetail}
        onReserveBook={reserveFromDetail}
      />
    </>
  );
}
