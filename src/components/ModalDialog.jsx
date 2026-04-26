import { useEffect, useEffectEvent, useId, useRef } from "react";

export default function ModalDialog({ modal, onClose }) {
  const modalRef = useRef(null);
  const closeModalButtonRef = useRef(null);
  const modalTitleId = useId();
  const modalDescriptionId = useId();
  const requestClose = useEffectEvent(() => onClose());

  useEffect(() => {
    if (!modal) return undefined;

    const dialog = modalRef.current;
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
    closeModalButtonRef.current?.focus({ preventScroll: true });
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
  }, [modal]);

  if (!modal) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="polka-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        aria-describedby={modalDescriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeModalButtonRef}
          type="button"
          className="modal-close"
          aria-label="Закрыть окно"
          onClick={onClose}
        >
          ×
        </button>

        <p className="eyebrow">действие</p>
        <h3 id={modalTitleId}>{modal.title}</h3>
        <p id={modalDescriptionId}>{modal.text}</p>

        <button type="button" className="primary-btn" onClick={onClose}>
          {modal.button}
        </button>
      </div>
    </div>
  );
}
