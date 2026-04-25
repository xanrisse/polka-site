import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const journey = [
  {
    id: "forgotten",
    step: "01",
    label: "Забытая",
    kicker: "Этап 1",
    title: "Забытая на полке",
    subtitle:
      "Эту книгу купили три года назад. Прочитали один раз. И она осталась пылиться между «Войной и миром» и забытым детективом.",
    text:
      "Таких книг в Москве — тысячи. Они ждут, когда их заметят. «Полка» даёт им второй шанс.",
    stat: "67%",
    statText: "книг в домашних библиотеках не перечитываются и не передаются дальше",
    visualTitle: "Эта книга ждала 3 года",
    tone: "warm",
  },
  {
    id: "bookbox",
    step: "02",
    label: "Книгомат",
    kicker: "Этап 2",
    title: "Первый шаг — книгомат",
    subtitle:
      "Хозяин книги решил: пусть путешествует. Он отнёс её в книгомат на Павелецкой.",
    text:
      "Через 5 минут книга появляется в приложении, а через час приходит уведомление: «Кто-то её уже рассматривает».",
    stat: "342",
    statText: "книгомата по Москве — книга всегда рядом",
    visualTitle: "Павелецкая · активная точка",
    tone: "green",
  },
  {
    id: "review",
    step: "03",
    label: "Отзыв",
    kicker: "Этап 3",
    title: "Первый читатель. Первый отзыв",
    subtitle:
      "Аня нашла книгу в книгомате на Павелецкой. Она давно искала это издание.",
    text:
      "Прочитала за два вечера и оставила отзыв. Книга продолжила путь, а у Ани появилась новая любимая история.",
    stat: "4 500+",
    statText: "отзывов оставлено пользователями «Полки»",
    visualTitle: "Карточка книги · отзыв Ани",
    tone: "blue",
  },
  {
    id: "collection",
    step: "04",
    label: "Подборка",
    kicker: "Этап 4",
    title: "Книга в подборке. Новое знакомство",
    subtitle:
      "Книга попала в подборку Ани «Что меня тронуло в этом месяце». Её увидели 47 человек.",
    text:
      "Двое написали Ане спасибо. Подборки в «Полке» — это не просто списки, а повод найти человека, который понимает тебя.",
    stat: "15 000",
    statText: "активных пользователей в читательском сообществе",
    visualTitle: "Подборка месяца",
    tone: "violet",
  },
  {
    id: "author",
    step: "05",
    label: "Автор",
    kicker: "Этап 5",
    title: "Книга вдохновляет автора",
    subtitle:
      "Дмитрий прочитал книгу по совету из подборки Ани. Через неделю он опубликовал на «Полке» свой рассказ.",
    text:
      "Рассказ уже прочитали 89 человек. Книга не просто путешествует — она меняет людей.",
    stat: "89",
    statText: "авторов уже нашли своих читателей",
    visualTitle: "Рассказ «Сосед»",
    tone: "orange",
  },
];

const bookPoints = [
  { name: "Павелецкая", x: 64, y: 58, status: "Книга добавлена" },
  { name: "Курский вокзал", x: 72, y: 42, status: "Книга ждёт читателя" },
  { name: "Таганская", x: 55, y: 48, status: "12 книг в движении" },
  { name: "Арбатская", x: 42, y: 38, status: "Новая подборка" },
  { name: "ВДНХ", x: 61, y: 22, status: "Авторская полка" },
];

const collections = [
  "Что меня тронуло в этом месяце",
  "Книги, после которых хочется идти пешком",
  "Истории для дождливого вечера",
  "Маленькие книги с большим послевкусием",
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

        let start = 0;
        const duration = 1100;
        const startedAt = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          start = Math.floor(eased * numericValue);
          setCount(start);

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

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function App() {
  const ids = useMemo(() => journey.map((item) => item.id), []);
  const activeSection = useActiveSection(ids);
  const [collectionIndex, setCollectionIndex] = useState(0);
  const activeJourney = journey.find((item) => item.id === activeSection) ?? journey[0];

  return (
    <main className="site-shell">
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

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">городская экосистема для книг</p>
            <h1>
              У каждой книги есть судьба. <span>У этой она будет особенной</span>
            </h1>
            <p className="hero-lead">
              Проследи путь одной книги — и ты узнаешь, как работает «Полка»:
              книгоматы, буккроссинг, читательские подборки и авторские публикации
              в одном приложении.
            </p>

            <div className="hero-actions">
              <button onClick={() => scrollToId("forgotten")} className="primary-btn">
                Начать путешествие
              </button>
              <button onClick={() => scrollToId("live-map")} className="ghost-btn">
                К карте книгоматов
              </button>
            </div>

            <div className="trust-row">
              <div>
                <strong>342</strong>
                <span>книгомата</span>
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

          <div className="hero-card">
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
                  className={activeSection === item.id ? "route-point active" : "route-point"}
                >
                  <span>{index + 1}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="intro-strip">
        <p>
          «Полка» не придумывает истории — она собирает реальные движения книг,
          отзывы читателей и новые авторские тексты.
        </p>
      </section>

      {journey.map((item, index) => (
        <section
          id={item.id}
          key={item.id}
          className={`journey-section section tone-${item.tone}`}
        >
          <div className="section-number">{item.step}</div>

          <div className="journey-copy">
            <p className="eyebrow">{item.kicker}</p>
            <h2>{item.title}</h2>
            <p className="section-subtitle">{item.subtitle}</p>
            <p className="section-text">{item.text}</p>

            <div className="stat-card">
              <strong>{item.stat}</strong>
              <span>{item.statText}</span>
            </div>
          </div>

          <div className="visual-stage">
            {index === 0 && (
              <div className="forgotten-visual">
                <div className="dust-light" />
                <div className="book-stack">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="hover-note">{item.visualTitle}</div>
              </div>
            )}

            {index === 1 && (
              <div className="kiosk-visual">
                <div className="city-map">
                  {bookPoints.slice(0, 3).map((point) => (
                    <button
                      key={point.name}
                      className="map-pin"
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    >
                      <span>{point.name}</span>
                    </button>
                  ))}
                </div>
                <div className="kiosk-card">
                  <span className="scan-line" />
                  <strong>Книгомат</strong>
                  <p>Книга добавлена в приложение</p>
                  <small>00:05 после загрузки</small>
                </div>
              </div>
            )}

            {index === 2 && (
              <div className="app-visual">
                <div className="phone-card">
                  <div className="phone-header" />
                  <div className="book-row">
                    <div className="tiny-cover" />
                    <div>
                      <strong>Найденная книга</strong>
                      <span>Павелецкая → Курский вокзал</span>
                    </div>
                  </div>
                  <div className="review-bubble">
                    «Давно искала это издание. Оставляю книгу дальше — пусть едет».
                  </div>
                  <div className="profile-chip">
                    <span>А</span>
                    <div>
                      <strong>Аня</strong>
                      <small>17 отзывов · 4 подборки</small>
                    </div>
                  </div>
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
                    onClick={() =>
                      setCollectionIndex((prev) =>
                        prev === 0 ? collections.length - 1 : prev - 1
                      )
                    }
                  >
                    ←
                  </button>
                  <button
                    onClick={() =>
                      setCollectionIndex((prev) =>
                        prev === collections.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    →
                  </button>
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
                  <button>Читать фрагмент</button>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      <section id="live-map" className="section map-section">
        <div className="map-copy">
          <p className="eyebrow">книга продолжает путь</p>
          <h2>Ты можешь стать следующим читателем</h2>
          <p>
            Сейчас эта книга ждёт нового читателя в книгомате на Курском вокзале.
            А рядом — ещё сотни точек, где истории только начинаются.
          </p>

          <div className="big-metrics">
            <div>
              <strong>
                <Counter value="342" />
              </strong>
              <span>книгомата</span>
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

          <div className="hero-actions">
            <button className="primary-btn">Найти эту книгу</button>
            <button className="ghost-btn">Оставить свою книгу</button>
          </div>
        </div>

        <div className="large-map">
          <div className="map-river" />
          {bookPoints.map((point) => (
            <button
              key={point.name}
              className={`large-pin ${point.name === "Курский вокзал" ? "selected" : ""}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              <span>
                <strong>{point.name}</strong>
                <small>{point.status}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section id="download" className="download-section section">
        <div className="download-card">
          <p className="eyebrow">начни свою историю</p>
          <h2>алия лох,</h2>
          <p>
            Неважно, будет вас в групе двое или троя, или задали вам четверым, все равно все придется делать рание...
          </p>

          <div className="download-grid">
            <button className="store-btn">
              <span>Скачать в</span>
              App Store
            </button>
            <button className="store-btn">
              <span>Скачать в</span>
              Google Play
            </button>

            <div className="qr-card">
              <div className="qr-grid">
                {Array.from({ length: 49 }).map((_, i) => (
                  <span key={i} className={i % 3 === 0 || i % 7 === 0 ? "filled" : ""} />
                ))}
              </div>
              <small>QR для быстрой установки</small>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}