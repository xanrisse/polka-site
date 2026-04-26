import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const bookMachines = [
  {
    name: "Книгомат · Павелецкая",
    address: "Павелецкая площадь, Москва",
    status: "Книга добавлена",
    books: 42,
    position: [55.7298, 37.6375],
  },
  {
    name: "Книгомат · Курский вокзал",
    address: "ул. Земляной Вал, Москва",
    status: "Книга ждёт читателя",
    books: 36,
    position: [55.7586, 37.6602],
  },
  {
    name: "Книгомат · Таганская",
    address: "Таганская площадь, Москва",
    status: "12 книг в движении",
    books: 58,
    position: [55.7414, 37.6539],
  },
  {
    name: "Книгомат · Арбатская",
    address: "ул. Арбат, Москва",
    status: "Новая подборка",
    books: 27,
    position: [55.7522, 37.6007],
  },
  {
    name: "Книгомат · ВДНХ",
    address: "проспект Мира, Москва",
    status: "Авторская полка",
    books: 64,
    position: [55.821, 37.6411],
  },
  {
    name: "Книгомат · Белорусская",
    address: "площадь Тверская Застава, Москва",
    status: "Подборки у метро",
    books: 31,
    position: [55.7767, 37.5813],
  },
  {
    name: "Книгомат · Парк культуры",
    address: "Зубовский бульвар, Москва",
    status: "9 книг забронировали сегодня",
    books: 24,
    position: [55.7356, 37.5946],
  },
  {
    name: "Книгомат · Сокол",
    address: "Ленинградский проспект, Москва",
    status: "Новая полка нон-фикшна",
    books: 18,
    position: [55.8051, 37.5153],
  },
  {
    name: "Книгомат · Китай-город",
    address: "Славянская площадь, Москва",
    status: "Авторская подборка недели",
    books: 29,
    position: [55.7543, 37.6331],
  },
  {
    name: "Книгомат · Проспект Мира",
    address: "проспект Мира, 36, Москва",
    status: "Книга в пути",
    books: 22,
    position: [55.7812, 37.6339],
  },
  {
    name: "Книгомат · Бауманская",
    address: "Бауманская улица, Москва",
    status: "Студенческая полка",
    books: 33,
    position: [55.7724, 37.679],
  },
  {
    name: "Книгомат · Новослободская",
    address: "Новослободская улица, Москва",
    status: "5 свежих отзывов",
    books: 25,
    position: [55.7798, 37.6012],
  },
  {
    name: "Книгомат · Третьяковская",
    address: "Климентовский переулок, Москва",
    status: "Поэзия и эссе",
    books: 19,
    position: [55.7408, 37.6257],
  },
  {
    name: "Книгомат · Университет",
    address: "Ломоносовский проспект, Москва",
    status: "Кампусная точка",
    books: 21,
    position: [55.6924, 37.5333],
  },
  {
    name: "Книгомат · Авиапарк",
    address: "Ходынский бульвар, Москва",
    status: "Семейная подборка",
    books: 17,
    position: [55.7906, 37.531],
  },
];

const bookIcon = L.divIcon({
  className: "polka-map-marker",
  html: "<span>📚</span>",
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -38],
});

function CtrlWheelZoom() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const onWheel = (event) => {
      if (!event.ctrlKey) return;

      event.preventDefault();

      const delta = event.deltaY < 0 ? 1 : -1;
      const targetZoom = map.getZoom() + delta;
      const mousePoint = map.mouseEventToContainerPoint(event);

      map.setZoomAround(mousePoint, targetZoom, {
        animate: true,
      });
    };

    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, [map]);

  return null;
}

export default function MoscowMap() {
  return (
    <div className="moscow-map-shell">

      <MapContainer
        center={[55.7558, 37.6173]}
        zoom={10}
        minZoom={9}
        maxZoom={18}
        scrollWheelZoom={false}
        doubleClickZoom={true}
        dragging={true}
        className="moscow-map"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <CtrlWheelZoom />

        {bookMachines.map((point) => (
          <Marker key={point.name} position={point.position} icon={bookIcon}>
            <Popup className="polka-map-popup">
              <div className="map-popup">
                <small>точка сети 342 книгоматов</small>
                <strong>{point.name}</strong>
                <span>{point.address}</span>
                <p>{point.status}</p>
                <button
                  onClick={() =>
                    window.open(
                      `https://yandex.ru/maps/?text=${encodeURIComponent(
                        point.address
                      )}`,
                      "_blank"
                    )
                  }
                >
                  {point.books} книг доступно
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
