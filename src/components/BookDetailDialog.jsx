import { useEffect, useId, useRef } from "react";
import { bookStatusLabels } from "../data/polkaContent.js";

export default function BookDetailDialog({ book, onClose, onReserveBook }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const requestClose = () => onClose();

  useEffect(() => {
    if (!book) return undefined;

    const dialog = dialogRef.current;
    const scrollY = window.scrollY;
    const previousFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        requestClose();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusableElements = Array.from(
        dialog.querySelectorAll(focusableSelector)
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    closeButtonRef.current?.focus({ preventScroll: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousBodyStyles.overflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.width = previousBodyStyles.width;
      window.removeEventListener("keydown", onKeyDown);
      window.scrollTo(0, scrollY);
      previousFocusedElement?.focus({ preventScroll: true });
    };
  }, [book]);

  if (!book) return null;

  const statusLabel = bookStatusLabels[book.status] ?? book.status;
  const isAvailable = book.status === "available";

  return (
    <div className="modal-overlay book-detail-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="book-detail-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="modal-close"
          aria-label="Закрыть страницу книги"
          onClick={onClose}
        >
          ×
        </button>

        <div className="book-detail-layout">
          <aside className="book-detail-aside">
            <div className={`book-detail-cover generated-${book.color}`}>
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

            <div className="book-detail-facts">
              <div>
                <span>сейчас</span>
                <strong>{book.station}</strong>
              </div>

              <div>
                <span>издание</span>
                <strong>{book.publisher}</strong>
              </div>

              <div>
                <span>объём</span>
                <strong>
                  {book.year} · {book.pages}
                </strong>
              </div>
            </div>
          </aside>

          <section className="book-detail-main">
            <p className="eyebrow">страница книги</p>
            <h3 id={titleId}>{book.title}</h3>
            <p className="book-detail-author">{book.author}</p>

            <div className="book-detail-meta">
              <span className={`book-status status-${book.status}`}>{statusLabel}</span>
              <span>{book.condition}</span>
              <span>{book.genre}</span>
            </div>

            <div className="book-detail-copy" id={descriptionId}>
              <section>
                <span>Аннотация</span>
                <p>{book.annotation}</p>
              </section>

              <section>
                <span>Почему её берут</span>
                <p>{book.shelfNote}</p>
              </section>

              <section>
                <span>Читательский контекст</span>
                <p>{book.readerNote}</p>
              </section>
            </div>

            <div className="book-detail-route">
              <span>Маршрут книги</span>

              <div className="book-detail-route-list">
                {(book.route ?? []).map((point, index) => (
                  <div key={point} className="book-detail-route-stop">
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <strong>{point}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="book-detail-actions">
              <button
                type="button"
                className="primary-btn"
                disabled={!isAvailable}
                onClick={() => onReserveBook(book)}
              >
                {isAvailable ? "Забронировать книгу" : "Сейчас недоступна"}
              </button>

              <button type="button" className="ghost-btn" onClick={onClose}>
                Вернуться в каталог
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
