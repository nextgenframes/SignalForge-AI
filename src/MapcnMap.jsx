import React, { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const styles = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
};

function cityKey(place) {
  return `${place.city},${place.state || ''}`;
}

export function MapcnMap({
  theme = 'dark',
  locations = [],
  selectedCity = '',
  onSelect,
  className = '',
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());

  const styleUrl = theme === 'light' ? styles.light : styles.dark;

  const bounds = useMemo(() => {
    const points = locations.filter((l) => Number.isFinite(l.lng) && Number.isFinite(l.lat));
    if (!points.length) return null;
    const b = new maplibregl.LngLatBounds();
    points.forEach((p) => b.extend([p.lng, p.lat]));
    return b;
  }, [locations]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [-98.5, 39.6],
      zoom: 3,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(styleUrl);
  }, [styleUrl]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const nextKeys = new Set();
    locations.forEach((place) => {
      if (!Number.isFinite(place.lng) || !Number.isFinite(place.lat)) return;
      const key = cityKey(place);
      nextKeys.add(key);
      if (markersRef.current.has(key)) return;

      const el = document.createElement('button');
      el.type = 'button';
      el.className = `mapcn-marker ${String(place.severity || '').toLowerCase()}`;
      el.setAttribute('aria-label', `${place.city} marker`);
      el.innerText = String(place.open ?? '');
      el.addEventListener('click', (e) => {
        e.preventDefault();
        if (onSelect) onSelect(place);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([place.lng, place.lat])
        .addTo(map);

      markersRef.current.set(key, marker);
    });

    [...markersRef.current.keys()].forEach((key) => {
      if (!nextKeys.has(key)) {
        markersRef.current.get(key)?.remove();
        markersRef.current.delete(key);
      }
    });
  }, [locations, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((marker) => {
      const el = marker.getElement();
      el.classList.toggle('selected', Boolean(selectedCity) && el.getAttribute('aria-label')?.includes(selectedCity));
    });
  }, [selectedCity]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !bounds) return;
    try {
      map.fitBounds(bounds, { padding: 60, duration: 650, maxZoom: 6 });
    } catch {
      // ignore
    }
  }, [bounds]);

  return <div ref={containerRef} className={`mapcn-map ${className}`} />;
}

