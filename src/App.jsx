import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import CatalogSection from "./components/CatalogSection.jsx";
import DeferredMoscowMap from "./components/DeferredMoscowMap.jsx";
import ModalDialog from "./components/ModalDialog.jsx";
import {
  catalogBooks,
  collections,
  coreValues,
  faq,
  journey,
  missionStatement,
  modalContent,
  resourceLinks,
  serviceActions,
} from "./data/polkaContent.js";
import "./App.css";

const heroSignals = [
  "Маршруты книг по городу",
  "Читательские подборки",
  "Первые публикации авторов",
];

const mapCapabilities = [
  {
    title: "Найти книгу",
    text: "Сразу увидеть ближайший книгомат и статус нужного экземпляра.",
  },
  {
    title: "Оставить свою",
    text: "Выбрать точку, открыть инструкцию и передать книгу дальше без лишних шагов.",
  },
  {
    title: "Понять маршрут",
    text: "Отследить, где книга была раньше и как движется по городу сейчас.",
  },
];

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.45 }
      );

      observer.observe(el);
      return observer;
    });

    return () => observers.forEach((observer) => observer?.disconnect());
  }, [ids]);

  return active;
}

function Counter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const numericValue = Number(String(value).replace(/\D/g, ""));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const duration = 1100;
        const startedAt = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          setCount(Math.floor(eased * numericValue));

          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [numericValue]);

  return (
    <span ref={ref}>
      {count.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);

    return () => media.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function App() {
  const ids = useMemo(() => journey.map((item) => item.id), []);
  const activeSection = useActiveSection(ids);
  const prefersReducedMotion = usePrefersReducedMotion();
  const coreValueByKey = useMemo(
    () => Object.fromEntries(coreValues.map((value) => [value.key, value])),
    []
  );
  const activeJourneyItem =
    journey.find((item) => item.id === activeSection) ?? journey[0];
  const activeCoreValue =
    coreValueByKey[activeJourneyItem.valueKey] ?? coreValues[0];
  const activeThemeClass = `theme-${activeJourneyItem.tone}`;

  const [collectionIndex, setCollectionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const [modal, setModal] = useState(null);

  const shiftCollection = (direction) => {
    startTransition(() => {
      setCollectionIndex((prev) => {
        if (direction < 0) {
          return prev === 0 ? collections.length - 1 : prev - 1;
        }

        return prev === collections.length - 1 ? 0 : prev + 1;
      });
    });
  };

  const reserveBook = (book) => {
    setModal({
      title: `Бронь: ${book.title}`,
      text: `Книга будет ждать тебя в книгомате «${book.station}». Код брони: POLKA-${book.id}42. В реальном приложении бронь действовала бы 30 минут.`,
      button: "Понятно",
    });
  };

  const closeModal = () => setModal(null);

  const openModal = (type) => {
    setModal(modalContent[type]);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));

    if (revealNodes.length === 0) return undefined;

    if (prefersReducedMotion) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealNodes.forEach((node, index) => {
      node.style.setProperty("--reveal-delay", `${(index % 6) * 90}ms`);
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || activeSection !== "collection") return undefined;

    const timer = window.setInterval(() => {
      shiftCollection(1);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [activeSection, prefersReducedMotion]);

  useEffect(() => {
    let frameId = null;
    const supportsPointerTracking = window.matchMedia("(pointer: fine)").matches;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      setScrollProgress(progress);
    };

    const onMove = (event) => {
      if (prefersReducedMotion || !supportsPointerTracking || frameId) return;

      const nextCursor = {
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      };

      frameId = requestAnimationFrame(() => {
        setCursor(nextCursor);
        frameId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    if (!prefersReducedMotion && supportsPointerTracking) {
      window.addEventListener("mousemove", onMove);
    }

    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (!prefersReducedMotion && supportsPointerTracking) {
        window.removeEventListener("mousemove", onMove);
      }
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [prefersReducedMotion]);

  return (
    <>
      {loading && (
        <div className="preloader">
          <div className="preloader-book">
            <span />
            <span />
            <span />
          </div>
          <p>Полка открывает историю</p>
        </div>
      )}

      {!prefersReducedMotion && (
        <div className="book-snow" aria-hidden="true">
          {Array.from({ length: 42 }).map((_, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            const bookWidth = 24 + (index % 7) * 4;
            const bookHeight = 36 + ((index * 5) % 8) * 4;
            const driftSize = 46 + (index % 8) * 15;
            const signedDrift = direction * driftSize;
            const scale = 0.68 + (index % 8) * 0.075;
            const spin = 18 + (index % 7) * 9;
            const duration = 32 + (index % 12) * 3.4;
            const depth = 0.18 + (index % 6) * 0.1;
            const thickness = 4 + (index % 4);
            const fallRotate = direction * (12 + (index % 9) * 5);

            return (
              <span
                key={index}
                className="snow-book-fall"
                style={{
                  "--x": `${(index * 23 + 11) % 100}%`,
                  "--delay": `${(index % 21) * -1.85}s`,
                  "--duration": `${duration}s`,
                  "--drift-duration": `${duration * 0.72}s`,
                  "--spin-duration": `${duration * 0.58}s`,
                  "--fall-mid-x": `${signedDrift * 0.35}px`,
                  "--fall-late-x": `${signedDrift * -0.22}px`,
                  "--fall-end-x": `${signedDrift}px`,
                  "--fall-rotate": `${fallRotate}deg`,
                  "--fall-rotate-soft": `${fallRotate * 0.42}deg`,
                  "--fall-rotate-back": `${fallRotate * -0.18}deg`,
                }}
              >
                <i
                  className={`snow-book snow-book-${index % 8}`}
                  style={{
                    "--drift-start": `${signedDrift * -0.6}px`,
                    "--drift-first": `${signedDrift * 0.36}px`,
                    "--drift-second": `${signedDrift * 0.82}px`,
                    "--drift-third": `${signedDrift * -0.18}px`,
                    "--book-width": `${bookWidth}px`,
                    "--book-height": `${bookHeight}px`,
                    "--thickness": `${thickness}px`,
                    "--negative-thickness": `${-thickness}px`,
                    "--scale": `${scale}`,
                    "--depth": `${depth}`,
                    "--book-blur": `${Math.max(0, (0.9 - depth) * 0.72)}px`,
                    "--tilt": `${-30 + (index % 11) * 6}deg`,
                    "--spin": `${spin}deg`,
                    "--spin-back": `${-spin * 0.7}deg`,
                    "--spin-soft": `${spin * 0.42}deg`,
                  }}
                >
                  <i className="book-front" />
                  <i className="book-cover-mark" />
                  <i className="book-pages" />
                  <i className="book-spine-snow" />
                  <i className="book-ridge" />
                  <b />
                </i>
              </span>
            );
          })}
        </div>
      )}

      <main className={`site-shell ${activeThemeClass}`}>
        {!prefersReducedMotion && (
          <div
            className="cursor-light"
            style={{
              "--x": `${cursor.x}%`,
              "--y": `${cursor.y}%`,
            }}
          />
        )}

        <div className="scroll-progress">
          <span style={{ width: `${scrollProgress}%` }} />
        </div>

        <div className="floating-book" />
        <div className="site-noise" aria-hidden="true" />

        <nav className="floating-nav">
          <button onClick={() => scrollToId("hero")} className="brand-mark">
            Полка
          </button>

          <div className="nav-timeline">
            {journey.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToId(item.id)}
                className={`nav-dot ${activeSection === item.id ? "active" : ""}`}
                aria-label={item.title}
                data-label={item.label}
              >
                <span>{item.step}</span>
              </button>
            ))}
          </div>

          <button onClick={() => scrollToId("download")} className="nav-cta">
            Скачать
          </button>
        </nav>

        <section id="hero" className="hero section">
          <div className="hero-bg-orbit orbit-one" />
          <div className="hero-bg-orbit orbit-two" />
          <div className="hero-bg-orbit orbit-three" />

          <div className="hero-grid">
            <div className="hero-copy" data-reveal="up">
              <div className="hero-status-line">
                <span className="hero-status-dot" />
                <p>История в движении</p>
                <strong>
                  {activeJourneyItem.kicker} · {activeJourneyItem.label}
                </strong>
              </div>

              <p className="eyebrow">городская экосистема для книг</p>

              <h1>
                У каждой книги есть судьба.{" "}
                <span>У этой она будет особенной</span>
              </h1>

              <p className="hero-lead">
                Проследи путь одной книги — и ты узнаешь, как работает «Полка»:
                книгоматы, буккроссинг, читательские подборки и авторские
                публикации в одном приложении.
              </p>

              <div className="hero-actions">
                <button
                  onClick={() => scrollToId("forgotten")}
                  className="primary-btn"
                >
                  Начать путешествие
                </button>

                <button onClick={() => scrollToId("live-map")} className="ghost-btn">
                  К карте книгоматов
                </button>
                <button onClick={() => scrollToId("catalog")} className="ghost-btn">
                  Смотреть книги
                </button>
              </div>

              <div className="hero-signal-row">
                {heroSignals.map((signal) => (
                  <span key={signal} className="hero-signal-pill">
                    {signal}
                  </span>
                ))}
              </div>

              <div className="hero-editorial-card" data-reveal="up">
                <span>Ценность маршрута сейчас</span>
                <strong>{activeCoreValue.title}</strong>
                <p>{activeCoreValue.text}</p>
              </div>

              <div className="trust-row">
                <div>
                  <strong>10</strong>
                  <span>книгоматов</span>
                </div>

                <div>
                  <strong>12 347</strong>
                  <span>книг в движении</span>
                </div>

                <div>
                  <strong>4 500+</strong>
                  <span>живых отзывов</span>
                </div>
              </div>
            </div>

            <div className="hero-card" data-reveal="scale">
              <div className="hero-story-pulse">
                <span>Сейчас на сцене</span>
                <strong>{activeJourneyItem.title}</strong>
                <p>{activeJourneyItem.visualTitle}</p>
              </div>

              <div className="book-cover">
                <span className="book-spine" />

                <div>
                  <p>история №042</p>
                  <h2>Книга, которая снова стала нужной</h2>
                </div>
              </div>

              <div className="mini-route">
                {journey.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToId(item.id)}
                    className={
                      activeSection === item.id ? "route-point active" : "route-point"
                    }
                  >
                    <span>{index + 1}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="intro-strip" data-reveal="fade">
          <p>
            «Полка» не придумывает истории — она собирает реальные движения книг,
            отзывы читателей и новые авторские тексты.
          </p>
        </section>

        <section id="mission" className="section manifesto-section">
          <div className="manifesto-shell">
            <div className="manifesto-copy" data-reveal="left">
              <p className="eyebrow">миссия и ценности</p>
              <h2>«Полка» делает литературу живой частью городского ритма</h2>
              <p className="manifesto-lead">{missionStatement}</p>

              <div className="manifesto-note">
                <span>Почему это важно</span>
                <p>
                  Для нас книга — не объект хранения, а повод для движения,
                  разговора, доверия и личного культурного роста.
                </p>
              </div>
            </div>

            <div className="manifesto-values">
              {coreValues.map((value, index) => (
                <article
                  key={value.title}
                  className={`manifesto-value-card ${
                    value.key === activeCoreValue.key ? "is-linked" : ""
                  }`}
                  data-reveal="up"
                  style={{
                    "--reveal-delay": `${index * 90}ms`,
                    "--value-rgb": value.accentRgb,
                  }}
                >
                  <span className="manifesto-value-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {journey.map((item, index) => {
          const journeyValue = coreValueByKey[item.valueKey];

          return (
            <section
              id={item.id}
              key={item.id}
              className={`journey-section section tone-${item.tone}`}
            >
              <div className="section-rail" data-reveal="fade">
                <span className="section-rail-step">{item.step}</span>
                <span className="section-rail-line" aria-hidden="true" />
                <span className="section-rail-label">{item.chapterLabel}</span>
              </div>

              <div className="journey-copy" data-reveal="left">
                <p className="eyebrow">{item.kicker}</p>

                <div className="journey-meta-row">
                  <span className="journey-chip journey-chip-accent">
                    {journeyValue?.title ?? "Ценность"}
                  </span>
                  <span className="journey-chip">{item.chapterLabel}</span>
                </div>

                <h2>{item.title}</h2>
                <p className="section-subtitle">{item.subtitle}</p>
                <p className="section-text">{item.text}</p>

                <div className="stat-card">
                  <strong>{item.stat}</strong>
                  <span>{item.statText}</span>
                </div>

                <div className="journey-footnote">
                  <span>Редакционная заметка</span>
                  <p>{item.footnote}</p>
                </div>
              </div>

              <div
                className={`visual-stage visual-stage-${item.id}`}
                data-reveal="right"
              >
                {index === 0 && (
                  <div className="forgotten-visual">
                    <div className="dust-light" />

                    <div className="forgotten-shelf-line" aria-hidden="true" />

                    <div className="forgotten-books">
                      <article className="forgotten-book forgotten-book-one">
                        <strong>Роман</strong>
                        <span>3 года на полке</span>
                      </article>

                      <article className="forgotten-book forgotten-book-two">
                        <strong>Эссе</strong>
                        <span>без движения</span>
                      </article>

                      <article className="forgotten-book forgotten-book-three">
                        <strong>История</strong>
                        <span>ждёт читателя</span>
                      </article>
                    </div>

                    <div className="forgotten-note-card">
                      <span>домашняя библиотека</span>
                      <p>
                        Книга всё ещё здесь, но уже готова выйти из режима
                        хранения и снова стать частью города.
                      </p>
                    </div>

                    <div className="hover-note">{item.visualTitle}</div>
                  </div>
                )}

                {index === 1 && (
                  <div className="kiosk-visual">
                    <div className="kiosk-machine">
                      <div className="kiosk-head">
                        <span className="kiosk-head-dot" />
                        <p>книгомат · павелецкая</p>
                        <strong>точка активирована</strong>
                      </div>

                      <div className="kiosk-body-shell">
                        <div className="kiosk-slot">
                          <span className="scan-line" />
                          <div className="kiosk-book">
                            <i className="kiosk-book-spine" />
                            <strong>Полка</strong>
                            <small>роман · принят</small>
                          </div>
                        </div>

                        <div className="kiosk-side-panel">
                          <span className="kiosk-status-pill">ячейка свободна</span>

                          <div className="kiosk-upload-card">
                            <strong>Книга принята в систему</strong>
                            <p>
                              После загрузки она появляется на общей карте и
                              становится видимой следующему читателю.
                            </p>
                          </div>

                          <div className="kiosk-step-list">
                            <span>01 · открыть ячейку</span>
                            <span>02 · отсканировать QR</span>
                            <span>03 · передать книгу маршруту</span>
                          </div>
                        </div>
                      </div>

                      <div className="kiosk-floor-glow" />
                    </div>
                  </div>
                )}

                {index === 2 && (
                  <div className="app-visual">
                    <div className="app-stage-tag app-stage-tag-left">
                      <span>живой отклик</span>
                      <strong>Отзыв появился сразу после чтения</strong>
                    </div>

                    <div className="phone-card phone-card-expanded">
                      <div className="phone-header" />

                      <div className="book-row">
                        <div className="tiny-cover" />
                        <div>
                          <strong>Найденная книга</strong>
                          <span>Павелецкая → Курский вокзал</span>
                        </div>
                      </div>

                      <div className="review-bubble">
                        «Давно искала это издание. Оставляю книгу дальше — пусть
                        едет».
                      </div>

                      <div className="profile-chip">
                        <span>А</span>
                        <div>
                          <strong>Аня</strong>
                          <small>17 отзывов · 4 подборки</small>
                        </div>
                      </div>
                    </div>

                    <div className="app-stage-tag app-stage-tag-right">
                      <span>маршрут книги</span>
                      <strong>Павелецкая → Курский вокзал</strong>
                    </div>
                  </div>
                )}

                {index === 3 && (
                  <div className="collection-visual">
                    <div className="collection-card">
                      <p>подборка</p>
                      <h3>{collections[collectionIndex]}</h3>

                      <div className="collection-books">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="comment-stream">
                      <span>Спасибо, я тоже её прочитал</span>
                      <span>Добавил себе в список</span>
                      <span>У нас похожий вкус</span>
                    </div>

                    <div className="carousel-controls">
                      <button
                        type="button"
                        aria-label="Предыдущая подборка"
                        onClick={() => shiftCollection(-1)}
                      >
                        ←
                      </button>

                      <button
                        type="button"
                        aria-label="Следующая подборка"
                        onClick={() => shiftCollection(1)}
                      >
                        →
                      </button>
                    </div>

                    <div className="collection-progress" aria-hidden="true">
                      <span
                        style={{
                          width: `${((collectionIndex + 1) / collections.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {index === 4 && (
                  <div className="author-visual">
                    <div className="quote-panel">
                      <p>«Третья страница — это я сама год назад. Спасибо»</p>
                      <span>отзыв читательницы</span>
                    </div>

                    <div className="story-panel">
                      <small>авторская публикация</small>
                      <h3>Сосед</h3>
                      <p>
                        Рассказ Дмитрия прочитали 89 человек. 12 оставили отзывы.
                      </p>
                      <button onClick={() => openModal("story")}>
                        Читать фрагмент
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}

        <section id="live-map" className="section map-section">
          <div className="map-copy" data-reveal="left">
            <p className="eyebrow">единая карта книгоматов</p>
            <h2>Одна карта для поиска, передачи и маршрута книги</h2>

            <p>
              Здесь собрана вся городская логика «Полки»: можно найти нужную
              книгу, выбрать ближайший книгомат, оставить свой экземпляр и
              понять, как история движется по Москве.
            </p>

            <div className="big-metrics">
              <div>
                <strong>
                  <Counter value="10" />
                </strong>
                <span>книгоматов</span>
              </div>

              <div>
                <strong>
                  <Counter value="12347" />
                </strong>
                <span>книг в движении</span>
              </div>

              <div>
                <strong>
                  <Counter value="89" />
                </strong>
                <span>авторов</span>
              </div>
            </div>

            <div className="map-capability-grid">
              {mapCapabilities.map((item) => (
                <article key={item.title} className="map-capability-card">
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>

            <div className="hero-actions">
              <button className="primary-btn" onClick={() => openModal("findBook")}>
                Найти эту книгу
              </button>
              <button className="ghost-btn" onClick={() => openModal("leaveBook")}>
                Оставить свою книгу
              </button>
            </div>
          </div>

          <div className="map-visual-shell">
            <DeferredMoscowMap label="Единая карта книгоматов по Москве" />
          </div>
        </section>
        <CatalogSection books={catalogBooks} onReserveBook={reserveBook} />
        <section id="guide" className="section service-section">
  <div className="service-head" data-reveal="up">
    <p className="eyebrow">сервис, а не просто история</p>
    <h2>Что можно сделать в «Полке»</h2>
    <p>
      Лендинг ведёт не только по истории одной книги. Он показывает реальные
      сценарии: найти книгу, оставить свою, опубликоваться или подключить новую
      городскую точку.
    </p>
  </div>

  <div className="action-grid">
    {serviceActions.map((action) => (
      <button
        key={action.title}
        className="action-card"
        data-reveal="up"
        onClick={() => scrollToId(action.target)}
      >
        <span>{action.title}</span>
        <p>{action.text}</p>
        <strong>{action.button} →</strong>
      </button>
    ))}
  </div>
</section>

<section id="authors" className="section split-info-section">
  <div className="info-panel" data-reveal="left">
    <p className="eyebrow">для авторов</p>
    <h2>Публикуй тексты и находи первых читателей</h2>
    <p>
      Авторский раздел нужен тем, кто пишет «в стол». Текст можно выложить в
      приложении, собрать первые отзывы, попасть в подборки и даже в печатный
      мини-тираж для книгоматов.
    </p>

    <div className="step-list">
      <span>01 · загрузить текст</span>
      <span>02 · пройти модерацию</span>
      <span>03 · получить отзывы</span>
      <span>04 · попасть в подборку</span>
    </div>

    <button className="primary-btn" onClick={() => openModal("authorSubmit")}>
  Подать текст
</button>
  </div>

  <div className="author-dashboard" data-reveal="right">
    <div className="dash-top">
      <strong>Авторский кабинет</strong>
      <span>online</span>
    </div>

    <div className="dash-row">
      <span>Рассказ «Сосед»</span>
      <strong>89 прочтений</strong>
    </div>

    <div className="dash-row">
      <span>Отзывы</span>
      <strong>12</strong>
    </div>

    <div className="dash-row">
      <span>Заявка в мини-тираж</span>
      <strong>на проверке</strong>
    </div>

    <div className="dash-note">
      «Третья страница — это я сама год назад. Спасибо»
    </div>
  </div>
</section>

<section id="partners" className="section partners-section">
  <div className="service-head" data-reveal="up">
    <p className="eyebrow">для города и партнёров</p>
    <h2>Книгомат может стоять в библиотеке, вузе, кафе или офисе</h2>
    <p>
      «Полка» может работать как городская инфраструктура: точки обмена,
      статистика движения книг, читательские события и локальные подборки.
    </p>
  </div>

  <div className="partner-grid">
    <div data-reveal="up">
      <strong>Библиотекам</strong>
      <p>Новые посетители, обменные полки, локальные подборки и события.</p>
    </div>

    <div data-reveal="up">
      <strong>Вузам</strong>
      <p>Книжные точки в корпусах, клубы чтения и авторские публикации студентов.</p>
    </div>

    <div data-reveal="up">
      <strong>Кафе</strong>
      <p>Тёплая городская механика, которая делает место живым и запоминающимся.</p>
    </div>

    <div data-reveal="up">
      <strong>Бизнесу</strong>
      <p>ESG-механика: книги не выбрасываются, а продолжают движение.</p>
    </div>
  </div>

  <div className="partner-cta">
    <button className="primary-btn" onClick={() => openModal("partner")}>
  Стать площадкой
</button>
    <button className="ghost-btn" onClick={() => openModal("presentation")}>
  Скачать презентацию
</button>
  </div>
</section>

<section className="section faq-section">
  <div className="service-head" data-reveal="up">
    <p className="eyebrow">вопросы</p>
    <h2>Перед тем как взять или оставить книгу</h2>
  </div>

  <div className="faq-list">
    {faq.map((item) => (
      <details key={item.q} className="faq-item" data-reveal="up">
        <summary>{item.q}</summary>
        <p>{item.a}</p>
      </details>
    ))}
  </div>
</section>

<section className="section resources-section">
  <div className="resources-card" data-reveal="scale">
    <p className="eyebrow">полезные ссылки</p>
    <h2>Ресурсы, инструкции и контакты</h2>

    <div className="resource-links">
      {resourceLinks.map((link) => (
        <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
          {link.label}
          <span>↗</span>
        </a>
      ))}
    </div>
  </div>
</section>

        <section id="download" className="download-section section">
          <div className="download-card" data-reveal="scale">
            <p className="eyebrow">начни свою историю</p>
            <h2>Ты можешь быть Аней, Димой или кем-то ещё</h2>

            <p>
              Неважно, будешь ты читателем, автором или просто тем, кто передаёт
              книгу дальше. «Полка» ждёт тебя.
            </p>

            <div className="download-grid">
              <button className="store-btn" onClick={() => openModal("appStore")}> <span>Скачать в</span> App Store</button>

              <button className="store-btn" onClick={() => openModal("googlePlay")}><span>Скачать в</span>Google Play</button>

              <div className="qr-card">
                <div className="qr-grid">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <span
                      key={i}
                      className={i % 3 === 0 || i % 7 === 0 ? "filled" : ""}
                    />
                  ))}
                </div>

                <small>QR для быстрой установки</small>
              </div>
            </div>

            <div className="download-prototype-cta">
              <a
                className="prototype-app-link"
                href="https://www.figma.com/proto/poI5QJI0uVlL6MNTjfxkbY/Untitled?node-id=26-18&starting-point-node-id=26%3A18&t=mteX7ZfVZXeJSiVH-1"
                target="_blank"
                rel="noreferrer"
              >
                <span>мобильный прототип</span>
                Открыть приложение в Figma
              </a>

              <p>
                Если хочешь посмотреть мобильный сценарий отдельно, открой
                интерактивный прототип приложения.
              </p>
            </div>
          </div>
        </section>
        <ModalDialog modal={modal} onClose={closeModal} />
      </main>
    </>
  );
}
