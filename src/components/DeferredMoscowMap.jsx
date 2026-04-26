import { Suspense, lazy } from "react";

const LazyMoscowMap = lazy(() => import("./MoscowMap.jsx"));

function MapFallback({ label }) {
  return (
    <div className="moscow-map-shell map-placeholder-shell">
      <div className="map-placeholder-grid" />
      <div className="map-placeholder-glow" />

      <div className="map-placeholder-card">
        <strong>Карта загружается</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default function DeferredMoscowMap({ label }) {
  return (
    <Suspense fallback={<MapFallback label={label} />}>
      <LazyMoscowMap />
    </Suspense>
  );
}
