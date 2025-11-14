import React, { useEffect, useMemo, useState } from "react";
import "./FiltersBar.css";

const DEFAULT_FILTERS = {
  q: "",
  city: "",
  province: "",
  radiusKm: 10,
  useMyLocation: false,
  lat: null,
  lng: null,

  type: "",          // perro | gato | otro
  size: "",          // chico | mediano | grande
  age: "",           // cachorro | joven | adulto | senior
  sex: "",           // macho | hembra

  withDogs: "",      // si | no | ind
  withCats: "",      // si | no | ind
  withKids: "",      // si | no | ind

  vaccinated: "",    // si | no | ind
  castrated: "",     // si | no | ind

  energy: "",        // baja | media | alta
};

function chipLabel(k, v) {
  const map = {
    type: { perro: "Perro", gato: "Gato", otro: "Otro" },
    size: { chico: "Chico", mediano: "Mediano", grande: "Grande" },
    age: { cachorro: "Cachorro", joven: "Joven", adulto: "Adulto", senior: "Senior" },
    sex: { macho: "Macho", hembra: "Hembra" },
    withDogs: { si: "Convive con perros", no: "Sin perros" },
    withCats: { si: "Convive con gatos", no: "Sin gatos" },
    withKids: { si: "Apta niños", no: "No apta niños" },
    vaccinated: { si: "Vacunada", no: "Sin vacunas" },
    castrated: { si: "Castrada", no: "No castrada" },
    energy: { baja: "Energía baja", media: "Energía media", alta: "Energía alta" },
  };
  if (k === "q" && v) return `“${v}”`;
  if (k === "city" && v) return `${v}${v ? "" : ""}`;
  if (k === "province" && v) return v;
  if (k === "radiusKm" && v) return `≤ ${v} km`;
  return map[k]?.[v] || null;
}

export default function FiltersBar({ value, onChange }) {
  const [f, setF] = useState(() => ({ ...DEFAULT_FILTERS, ...(value || {}) }));

  useEffect(() => { onChange?.(f); /* emite cambios */ }, [f]);

  const setField = (k) => (eOrVal) => {
    const v = typeof eOrVal === "object" && eOrVal?.target ? eOrVal.target.value : eOrVal;
    setF((s) => ({ ...s, [k]: v }));
  };

  const toggleUseMyLocation = async () => {
    const next = !f.useMyLocation;
    if (next && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setF((s) => ({
            ...s,
            useMyLocation: true,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }));
        },
        () => setF((s) => ({ ...s, useMyLocation: false }))
      );
    } else {
      setF((s) => ({ ...s, useMyLocation: false, lat: null, lng: null }));
    }
  };

  const clearAll = () => setF({ ...DEFAULT_FILTERS });

  const activeChips = useMemo(() => {
    const keys = Object.keys(f);
    const ignore = new Set(["lat", "lng", "useMyLocation"]);
    const chips = [];
    for (const k of keys) {
      if (ignore.has(k)) continue;
      const v = f[k];
      const isOn =
        (typeof v === "string" && v && !["ind"].includes(v)) ||
        (typeof v === "number" && k === "radiusKm" && v !== DEFAULT_FILTERS.radiusKm);
      if (!isOn) continue;

      const label = chipLabel(k, v);
      if (label) chips.push({ k, label });
    }
    if (f.useMyLocation) chips.push({ k: "useMyLocation", label: "Mi ubicación" });
    return chips;
  }, [f]);

  const removeChip = (k) => {
    if (k === "useMyLocation") {
      setF((s) => ({ ...s, useMyLocation: false, lat: null, lng: null }));
    } else if (k === "radiusKm") {
      setF((s) => ({ ...s, radiusKm: DEFAULT_FILTERS.radiusKm }));
    } else {
      setF((s) => ({ ...s, [k]: "" }));
    }
  };

  return (
    <div className="filtersWrap">
      {/* FILA 1: ubicación + texto */}
      <div className="filtersRow">
        <div className="field">
          <label>Ciudad</label>
          <input
            className="input"
            placeholder="Ej. Rosario"
            value={f.city}
            onChange={setField("city")}
            disabled={!!f.useMyLocation}
          />
        </div>
        <div className="field">
          <label>Provincia</label>
          <input
            className="input"
            placeholder="Ej. Santa Fe"
            value={f.province}
            onChange={setField("province")}
            disabled={!!f.useMyLocation}
          />
        </div>
        <div className="field">
          <label>Radio</label>
          <select className="select" value={f.radiusKm} onChange={setField("radiusKm")}>
            {[5, 10, 25, 50, 100].map((km) => (
              <option key={km} value={km}>{km} km</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>&nbsp;</label>
          <button type="button" className={`btn ${f.useMyLocation ? "btnActive" : ""}`} onClick={toggleUseMyLocation}>
            {f.useMyLocation ? "Usando mi ubicación" : "Usar mi ubicación"}
          </button>
        </div>
        <div className="field grow">
          <label>Búsqueda</label>
          <input
            className="input"
            placeholder="Nombre, características (ej. 'tranquila', 'mediana')"
            value={f.q}
            onChange={setField("q")}
          />
        </div>
      </div>

      {/* FILA 2: filtros rápidos */}
      <div className="filtersRow">
        <div className="field">
          <label>Tipo</label>
          <select className="select" value={f.type} onChange={setField("type")}>
            <option value="">Cualquiera</option>
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div className="field">
          <label>Tamaño</label>
          <select className="select" value={f.size} onChange={setField("size")}>
            <option value="">Cualquiera</option>
            <option value="chico">Chico</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
          </select>
        </div>
        <div className="field">
          <label>Edad</label>
          <select className="select" value={f.age} onChange={setField("age")}>
            <option value="">Cualquiera</option>
            <option value="cachorro">Cachorro</option>
            <option value="joven">Joven</option>
            <option value="adulto">Adulto</option>
            <option value="senior">Senior</option>
          </select>
        </div>
        <div className="field">
          <label>Sexo</label>
          <select className="select" value={f.sex} onChange={setField("sex")}>
            <option value="">Cualquiera</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>
        </div>

        <div className="field">
          <label>Con perros</label>
          <select className="select" value={f.withDogs} onChange={setField("withDogs")}>
            <option value="">Indistinto</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="field">
          <label>Con gatos</label>
          <select className="select" value={f.withCats} onChange={setField("withCats")}>
            <option value="">Indistinto</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="field">
          <label>Con niños</label>
          <select className="select" value={f.withKids} onChange={setField("withKids")}>
            <option value="">Indistinto</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="field">
          <label>Vacunación</label>
          <select className="select" value={f.vaccinated} onChange={setField("vaccinated")}>
            <option value="">Indistinto</option>
            <option value="si">Vacunada</option>
            <option value="no">Sin vacunas</option>
          </select>
        </div>
        <div className="field">
          <label>Castración</label>
          <select className="select" value={f.castrated} onChange={setField("castrated")}>
            <option value="">Indistinto</option>
            <option value="si">Castrada</option>
            <option value="no">No castrada</option>
          </select>
        </div>

        <div className="field">
          <label>Energía</label>
          <select className="select" value={f.energy} onChange={setField("energy")}>
            <option value="">Cualquiera</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div className="field end">
          <label>&nbsp;</label>
          <button type="button" className="btn btnClear" onClick={clearAll}>Limpiar</button>
        </div>
      </div>

      {/* Chips activos */}
      {activeChips.length > 0 && (
        <div className="chipsRow">
          {activeChips.map((c) => (
            <span key={c.k} className="chip" onClick={() => removeChip(c.k)}>
              {c.label} <b>×</b>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
