import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Crosshair } from 'lucide-react';

interface UniversityLocation {
  name: string;
  city: string;
  country: string;
  description: string;
  coordinates: [number, number];
}

const LOCATIONS: UniversityLocation[] = [
  { name: 'University of Toronto', city: 'Торонто', country: 'Канада', description: 'Сильные программы в технологиях, бизнесе и естественных науках.', coordinates: [-79.3957, 43.6629] },
  { name: 'MIT', city: 'Кембридж', country: 'США', description: 'Инженерия, computer science, предпринимательство и исследования.', coordinates: [-71.0942, 42.3601] },
  { name: 'Tecnologico de Monterrey', city: 'Монтеррей', country: 'Мексика', description: 'Технологии, дизайн, бизнес и предпринимательские программы.', coordinates: [-100.29, 25.65] },
  { name: 'University of Sao Paulo', city: 'Сан-Паулу', country: 'Бразилия', description: 'Крупный исследовательский университет с сильными STEM-направлениями.', coordinates: [-46.7305, -23.5614] },
  { name: 'University of Oxford', city: 'Оксфорд', country: 'Великобритания', description: 'Гуманитарные, социальные и исследовательские направления.', coordinates: [-1.2544, 51.7548] },
  { name: 'TU Munich', city: 'Мюнхен', country: 'Германия', description: 'Инженерия, робототехника и прикладные технологии.', coordinates: [11.5674, 48.1508] },
  { name: 'Bocconi University', city: 'Милан', country: 'Италия', description: 'Экономика, финансы и предпринимательство.', coordinates: [9.1899, 45.4505] },
  { name: 'ETH Zurich', city: 'Цюрих', country: 'Швейцария', description: 'Математика, инженерия, computer science и естественные науки.', coordinates: [8.548, 47.3769] },
  { name: 'American University of Beirut', city: 'Бейрут', country: 'Ливан', description: 'Международные программы в бизнесе, инженерии и социальных науках.', coordinates: [35.4832, 33.9007] },
  { name: 'University of Cape Town', city: 'Кейптаун', country: 'ЮАР', description: 'Исследования, инженерия, бизнес и природные науки.', coordinates: [18.4613, -33.9573] },
  { name: 'IIT Bombay', city: 'Мумбаи', country: 'Индия', description: 'Инженерия, программирование, дизайн и технологические исследования.', coordinates: [72.9156, 19.1334] },
  { name: 'National University of Singapore', city: 'Сингапур', country: 'Сингапур', description: 'Компьютерные науки, бизнес, дизайн и междисциплинарные программы.', coordinates: [103.7764, 1.2966] },
  { name: 'University of Tokyo', city: 'Токио', country: 'Япония', description: 'Передовые исследования в технологиях, медицине и инженерии.', coordinates: [139.7624, 35.7126] },
  { name: 'KAIST', city: 'Тэджон', country: 'Южная Корея', description: 'Программирование, робототехника и исследования.', coordinates: [127.366, 36.372] },
  { name: 'University of Melbourne', city: 'Мельбурн', country: 'Австралия', description: 'Бизнес, биомедицина, дизайн и исследования.', coordinates: [144.9631, -37.7963] },
];

const GEO_URL = `${import.meta.env.BASE_URL}world-countries-110m.json`;

export const UniversityMap: React.FC = () => {
  const [activeLocation, setActiveLocation] = useState<UniversityLocation | null>(LOCATIONS[1]);

  return (
    <section className="map-section border-t border-slate-200 bg-[#f6f8f7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12" aria-labelledby="map-title">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500"><Crosshair className="h-4 w-4 text-[var(--atlas-accent)]" aria-hidden="true" /> География возможностей / 02</p>
          <h2 id="map-title" className="mt-3 font-brand text-3xl font-semibold text-slate-950 sm:text-5xl">Университеты на карте</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">Выберите университет на карте, чтобы увидеть его город, страну и основные направления.</p>
        </div>

        <div className="map-panel relative mt-10 overflow-hidden border border-slate-300 bg-[#b9d8dc] shadow-sm">
          <div className="map-panel__grid" aria-hidden="true" />
          <p className="map-panel__coordinates" aria-hidden="true">15 ТОЧЕК · ГЛОБАЛЬНЫЙ ПОИСК</p>
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ scale: 152, center: [10, 12] }}
            width={980}
            height={500}
            className="block h-auto w-full"
            role="img"
            aria-label="Карта мира с университетами"
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) => geographies.map((geography) => (
                <Geography
                  key={geography.rsmKey}
                  geography={geography}
                  fill="#d9dfd5"
                  stroke="#aab8af"
                  strokeWidth={0.55}
                  style={{ outline: 'none' }}
                />
              ))}
            </Geographies>
            {LOCATIONS.map((location) => {
              const selected = activeLocation?.name === location.name;
              return (
                <Marker key={location.name} coordinates={location.coordinates}>
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`${location.name}, ${location.city}`}
                    aria-pressed={selected}
                    onClick={() => setActiveLocation(location)}
                    onMouseEnter={() => setActiveLocation(location)}
                    onFocus={() => setActiveLocation(location)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setActiveLocation(location);
                      }
                    }}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  >
                    {selected && <circle className="map-marker-pulse" r="18" fill="none" stroke="#d6552e" strokeWidth="1.5" />}
                    <circle r={selected ? 12 : 9} fill={selected ? '#d6552e' : '#1f2420'} stroke="#fffaf2" strokeWidth="3" />
                    <circle r="3" fill="#ffffff" />
                  </g>
                </Marker>
              );
            })}
          </ComposableMap>

          {activeLocation && (
            <div className="map-location-card absolute bottom-4 left-4 max-w-[calc(100%-2rem)] border border-slate-200 bg-white p-4 shadow-xl sm:bottom-6 sm:left-6 sm:max-w-sm sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-rose-600">{activeLocation.city}, {activeLocation.country}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{activeLocation.name}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{activeLocation.description}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
