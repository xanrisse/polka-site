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
        zoom={11}
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
            <Popup>
              <div className="map-popup">
                <strong>{point.name}</strong>
                <span>{point.address}</span>
                <p>{point.status}</p>
                <button
  onClick={() =>
    window.open(
      `https://yandex.ru/maps/?text=${encodeURIComponent(point.address)}`,
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