import { useEffect, useId, useRef } from "react";

export default function ModalDialog({ modal, onClose }) {
  const modalRef = useRef(null);
  const closeModalButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const modalTitleId = useId();
  const modalDescriptionId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!modal) return undefined;

    const dialog = modalRef.current;
    const previousFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousBodyOverflow = document.body.style.overflow;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current();
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

    // avoid changing body position/top to prevent scroll jumps
    document.body.style.overflow = "hidden";
    closeModalButtonRef.current?.focus({ preventScroll: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", onKeyDown);
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
