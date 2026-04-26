import { useEffect, useMemo, useRef, useState } from "react";
import MoscowMap from "./components/MoscowMap.jsx";
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
const serviceActions = [
  {
    title: "Найти книгу рядом",
    text: "Открой карту книгоматов, выбери точку и посмотри, какие книги доступны сейчас.",
    button: "Открыть карту",
    target: "live-map",
  },
  {
    title: "Оставить свою книгу",
    text: "Подготовь книгу, выбери ближайший книгомат и передай её следующему читателю.",
    button: "Инструкция",
    target: "guide",
  },
  {
    title: "Стать автором",
    text: "Опубликуй рассказ, эссе или подборку — читатели смогут найти твой текст в приложении.",
    button: "Для авторов",
    target: "authors",
  },
  {
    title: "Подключить площадку",
    text: "Кафе, вуз, библиотека или коворкинг могут стать новой точкой книжного обмена.",
    button: "Партнёрам",
    target: "partners",
  },
];

const faq = [
  {
    q: "Книгу можно забрать бесплатно?",
    a: "Да. Логика сервиса — обмен и движение книг. Пользователь может взять книгу, прочитать и вернуть её в любой книгомат.",
  },
  {
    q: "Что делать с плохим состоянием книги?",
    a: "Перед передачей книга проходит базовую проверку: целые страницы, нет плесени, сильных загрязнений и повреждений.",
  },
  {
    q: "Можно ли отслеживать путь книги?",
    a: "Да. У книги появляется история перемещений: где её оставили, кто взял, где появился отзыв или подборка.",
  },
  {
    q: "Можно ли публиковать свои тексты?",
    a: "Да. В «Полке» есть авторский раздел: можно опубликовать рассказ, получить отзывы и попасть в печатную мини-подборку.",
  },
];

const resourceLinks = [
  {
    label: "Инструкция: как оставить книгу",
    href: "https://www.google.com/search?q=как+подготовить+книгу+к+буккроссингу",
  },
  {
    label: "Что такое буккроссинг",
    href: "https://ru.wikipedia.org/wiki/Буккроссинг",
  },
  {
    label: "Карта библиотек Москвы",
    href: "https://www.mos.ru/map/",
  },
  {
    label: "Написать команде",
    href: "mailto:hello@polka.example",
  },
];
const catalogBooks = [
  {
    id: 1,
    title: "Маленький принц",
    author: "Антуан де Сент-Экзюпери",
    genre: "Проза",
    station: "Курский вокзал",
    status: "available",
    condition: "хорошее",
    color: "gold",
  },
  {
    id: 2,
    title: "451 градус по Фаренгейту",
    author: "Рэй Брэдбери",
    genre: "Фантастика",
    station: "Павелецкая",
    status: "available",
    condition: "отличное",
    color: "red",
  },
  {
    id: 3,
    title: "Норвежский лес",
    author: "Харуки Мураками",
    genre: "Роман",
    station: "Арбатская",
    status: "reserved",
    condition: "хорошее",
    color: "green",
  },
  {
    id: 4,
    title: "Письма к молодому поэту",
    author: "Райнер Мария Рильке",
    genre: "Эссе",
    station: "Таганская",
    status: "available",
    condition: "новое",
    color: "blue",
  },
  {
    id: 5,
    title: "Солярис",
    author: "Станислав Лем",
    genre: "Фантастика",
    station: "ВДНХ",
    status: "moving",
    condition: "хорошее",
    color: "violet",
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
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const [modal, setModal] = useState(null);
  const [bookQuery, setBookQuery] = useState("");
const [bookFilter, setBookFilter] = useState("all");

const filteredBooks = catalogBooks.filter((book) => {
  const query = bookQuery.toLowerCase();

  const matchesQuery =
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query) ||
    book.station.toLowerCase().includes(query);

  const matchesFilter =
    bookFilter === "all" ||
    book.genre === bookFilter ||
    book.status === bookFilter;

  return matchesQuery && matchesFilter;
});

const reserveBook = (book) => {
  setModal({
    title: `Бронь: ${book.title}`,
    text: `Книга будет ждать тебя в книгомате «${book.station}». Код брони: POLKA-${book.id}42. В реальном приложении бронь действовала бы 30 минут.`,
    button: "Понятно",
  });
};

const openModal = (type) => {
  const content = {
    story: {
      title: "Фрагмент рассказа «Сосед»",
      text:
        "Он жил за стеной так тихо, будто боялся помешать чужим жизням. Но однажды на лестничной клетке появилась книга с запиской: «Если дочитаешь — оставь следующему».",
      button: "Закрыть",
    },
    findBook: {
      title: "Найти эту книгу",
      text:
        "В реальном приложении здесь открылся бы экран книги и ближайший книгомат. В прототипе можно перейти к карте и выбрать точку.",
      button: "Понятно",
    },
    leaveBook: {
      title: "Оставить свою книгу",
      text:
        "Проверь состояние книги, выбери ближайший книгомат, отсканируй QR-код и положи книгу в свободную ячейку.",
      button: "Хорошо",
    },
    appStore: {
      title: "App Store",
      text:
        "Здесь будет ссылка на приложение «Полка» в App Store. Пока это интерактивный прототип.",
      button: "Закрыть",
    },
    googlePlay: {
      title: "Google Play",
      text:
        "Здесь будет ссылка на приложение «Полка» в Google Play. Пока это интерактивный прототип.",
      button: "Закрыть",
    },
    authorSubmit: {
      title: "Подать текст",
      text:
        "Автор загружает рассказ, проходит модерацию и получает первые отзывы от читателей «Полки».",
      button: "Закрыть",
    },
    partner: {
      title: "Стать площадкой",
      text:
        "Кафе, вуз, библиотека или офис могут разместить книгомат и стать частью городской книжной сети.",
      button: "Закрыть",
    },
    presentation: {
      title: "Презентация проекта",
      text:
        "В реальном сервисе здесь скачивался бы PDF для партнёров: механика, аудитория, условия подключения и примеры точек.",
      button: "Закрыть",
    },
  };

  setModal(content[type]);
};

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      setScrollProgress(progress);
    };

    const onMove = (event) => {
      setCursor({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMove);

    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

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

      <div
        className="cursor-light"
        style={{
          "--x": `${cursor.x}%`,
          "--y": `${cursor.y}%`,
        }}
      />

      <div className="scroll-progress">
        <span style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="floating-book" />

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
    <MoscowMap />

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
                    <p>Рассказ Дмитрия прочитали 89 человек. 12 оставили отзывы.</p>
                    <button onClick={() => openModal("story")}>Читать фрагмент</button>
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
              Сейчас эта книга ждёт нового читателя в книгомате на Курском
              вокзале. А рядом — ещё сотни точек, где истории только начинаются.
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
              <button className="primary-btn" onClick={() => openModal("findBook")}>Найти эту книгу</button>
              <button className="ghost-btn" onClick={() => openModal("leaveBook")}>Оставить свою книгу</button>
            </div>
          </div>

          <MoscowMap />
        </section>
        <section id="catalog" className="section catalog-section">
  <div className="service-head">
    <p className="eyebrow">живой каталог</p>
    <h2>Книги, которые можно забрать сейчас</h2>
    <p>
      Это прототип каталога: пользователь ищет книгу, смотрит ближайший книгомат
      и бронирует экземпляр перед тем, как идти за ним.
    </p>
  </div>

  <div className="catalog-toolbar">
    <input
      value={bookQuery}
      onChange={(event) => setBookQuery(event.target.value)}
      placeholder="Поиск: книга, автор или станция"
    />

    <div className="catalog-filters">
      {["all", "Проза", "Фантастика", "Роман", "Эссе", "available"].map(
        (filter) => (
          <button
            key={filter}
            className={bookFilter === filter ? "active" : ""}
            onClick={() => setBookFilter(filter)}
          >
            {filter === "all"
              ? "Все"
              : filter === "available"
              ? "Доступные"
              : filter}
          </button>
        )
      )}
    </div>
  </div>

  <div className="book-catalog-grid">
    {filteredBooks.map((book) => (
      <article key={book.id} className="catalog-book-card">
        <div className={`catalog-cover cover-${book.color}`}>
          <span>{book.genre}</span>
          <strong>{book.title}</strong>
        </div>

        <div className="catalog-book-info">
          <div>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </div>

          <div className="book-meta">
            <span>{book.station}</span>
            <span>Состояние: {book.condition}</span>
          </div>

          <div className="book-status-row">
            <span className={`book-status status-${book.status}`}>
              {book.status === "available"
                ? "доступна"
                : book.status === "reserved"
                ? "забронирована"
                : "в пути"}
            </span>

            <button
              disabled={book.status !== "available"}
              onClick={() => reserveBook(book)}
            >
              {book.status === "available" ? "Забронировать" : "Недоступна"}
            </button>
          </div>
        </div>
      </article>
    ))}
  </div>
</section>
        <section id="guide" className="section service-section">
  <div className="service-head">
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
  <div className="info-panel">
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

  <div className="author-dashboard">
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
  <div className="service-head">
    <p className="eyebrow">для города и партнёров</p>
    <h2>Книгомат может стоять в библиотеке, вузе, кафе или офисе</h2>
    <p>
      «Полка» может работать как городская инфраструктура: точки обмена,
      статистика движения книг, читательские события и локальные подборки.
    </p>
  </div>

  <div className="partner-grid">
    <div>
      <strong>Библиотекам</strong>
      <p>Новые посетители, обменные полки, локальные подборки и события.</p>
    </div>

    <div>
      <strong>Вузам</strong>
      <p>Книжные точки в корпусах, клубы чтения и авторские публикации студентов.</p>
    </div>

    <div>
      <strong>Кафе</strong>
      <p>Тёплая городская механика, которая делает место живым и запоминающимся.</p>
    </div>

    <div>
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
  <div className="service-head">
    <p className="eyebrow">вопросы</p>
    <h2>Перед тем как взять или оставить книгу</h2>
  </div>

  <div className="faq-list">
    {faq.map((item) => (
      <details key={item.q} className="faq-item">
        <summary>{item.q}</summary>
        <p>{item.a}</p>
      </details>
    ))}
  </div>
</section>

<section className="section resources-section">
  <div className="resources-card">
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
          <div className="download-card">
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
          </div>
        </section>
        {modal && (
  <div className="modal-overlay" onClick={() => setModal(null)}>
    <div className="polka-modal" onClick={(event) => event.stopPropagation()}>
      <button className="modal-close" onClick={() => setModal(null)}>
        ×
      </button>

      <p className="eyebrow">действие</p>
      <h3>{modal.title}</h3>
      <p>{modal.text}</p>

      <button className="primary-btn" onClick={() => setModal(null)}>
        {modal.button}
      </button>
    </div>
  </div>
)}
      </main>
    </>
  );
}