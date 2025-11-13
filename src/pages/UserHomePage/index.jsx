import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/PetsPage.css";

/* -------- helpers fuera del componente (reutilizables) -------- */
const boolOf = (obj, keys) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (typeof v === "boolean") return v;
    if (typeof v === "string") {
      const s = v.toLowerCase();
      if (["si", "sí", "true", "1"].includes(s)) return true;
      if (["no", "false", "0"].includes(s)) return false;
    }
    if (typeof v === "number") return v > 0;
  }
  return false;
};

const kmBetween = (a, b) => {
  if (!a || !b) return Infinity;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

const fmtFecha = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

/* -------- Tarjeta separada -------- */
function PetCard({ pet }) {
  const [imgError, setImgError] = useState(false);

  const petUrl = `/pets/${pet.id || pet._id}`;
  const img =
    pet.image_url ||
    pet.images?.[0]?.url ||
    pet.images?.[0] ||
    pet.photoURL ||
    "https://placehold.co/320x240?text=Mascota";
  const fallbackImg = "https://placehold.co/600x450?text=Mascota";

  const zonaTxt =
    pet.location ||
    [pet.city, pet.state, pet.province].filter(Boolean).join(", ");

  const tags = [
    pet.sex ? (pet.sex.toLowerCase().startsWith("h") ? "Hembra" : "Macho") : null,
    pet.size ? pet.size.charAt(0).toUpperCase() + pet.size.slice(1) : null,
    boolOf(pet, ["is_vaccinated", "vaccinated", "isVaccinated"]) ? "Vacunada/o" : null,
    boolOf(pet, ["is_neutered", "neutered", "castrated", "isNeutered"])
      ? "Castrada/o"
      : null,
  ].filter(Boolean);

  const desc =
    pet.description && String(pet.description).length > 180
      ? `${String(pet.description).slice(0, 180)}…`
      : String(pet.description || "");

  const created = pet.createdAt || pet.created_at;

  return (
    <article className="ml-card">
      <Link to={petUrl} className="ml-thumb">
        <img
          src={imgError ? fallbackImg : img}
          alt={pet.name || "Mascota en adopción"}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      </Link>

      <div className="ml-info">
        <div className="ml-row">
          <Link to={petUrl} className="ml-title">
            {pet.name || "Mascota en adopción"}
          </Link>
        </div>

        <div className="ml-badges">
          <span className="ml-badge ml-free">En adopción</span>
          {tags.map((t) => (
            <span key={t} className="ml-badge">
              {t}
            </span>
          ))}
        </div>

        {!!desc && <p className="ml-desc">{desc}</p>}

        <div className="ml-meta">
          <span className="ml-loc">
            {zonaTxt || "Ubicación no especificada"}
          </span>
          {created && (
            <span className="ml-date">
              Publicado el {fmtFecha(created)}
            </span>
          )}
        </div>

        <div className="ml-cta">
          <Link to={petUrl} className="ml-btn">
            Ver publicación
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ========================== Página ========================== */
export default function PetHomePage() {
  // mascotas desde el backend
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ubicación / radio
  const [userPos, setUserPos] = useState(null);
  const [locQuery, setLocQuery] = useState("");
  const [radiusKm, setRadiusKm] = useState(25);
  const [geoLoading, setGeoLoading] = useState(false);

  // filtros
  const [category, setCategory] = useState("Todas");
  const [order, setOrder] = useState("recientes");
  const [q, setQ] = useState("");

  const [withOtherPets, setWithOtherPets] = useState(false);
  const [withKids, setWithKids] = useState(false);
  const [vaccinated, setVaccinated] = useState(false);
  const [neutered, setNeutered] = useState(false);

  /* ---------- Carga de mascotas desde la API ---------- */
  useEffect(() => {
    async function loadPets() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("http://localhost:3001/api/pets");
        const data = await res.json().catch(() => []);
        if (!res.ok) {
          throw new Error(data?.message || "Error al cargar mascotas");
        }
        setPets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar mascotas");
      } finally {
        setLoading(false);
      }
    }

    loadPets();
  }, []);

  /* ---------- Categorías a partir de species/category ---------- */
  const categories = useMemo(() => {
    const set = new Set(
      pets.map((p) => p.category || p.species || "Otro")
    );
    return ["Todas", ...Array.from(set)];
  }, [pets]);

  /* ---------- Filtrado principal ---------- */
  const filtered = useMemo(() => {
    let arr = pets.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const textOK = q.trim()
        ? name.includes(q.toLowerCase()) || desc.includes(q.toLowerCase())
        : true;

      const petCategory = p.category || p.species || "Otro";
      const catOK =
        category === "Todas" ? true : petCategory === category;

      const gDogs = boolOf(p, [
        "good_with_pets",
        "goodWithDogs",
        "withDogs",
        "dogs",
      ]);
      const gCats = boolOf(p, [
        "good_with_pets",
        "goodWithCats",
        "withCats",
        "cats",
      ]);
      const gKids = boolOf(p, [
        "good_with_kids",
        "goodWithKids",
        "withKids",
        "kids",
        "children",
      ]);
      const isVaccinated = boolOf(p, [
        "is_vaccinated",
        "vaccinated",
        "isVaccinated",
      ]);
      const isNeutered = boolOf(p, [
        "is_neutered",
        "neutered",
        "castrated",
        "isNeutered",
      ]);

      const otherPetsOK = !withOtherPets ? true : gDogs || gCats;
      const kidsOK = !withKids ? true : gKids;
      const vacOK = !vaccinated ? true : isVaccinated;
      const neuOK = !neutered ? true : isNeutered;

      // ubicación
      const petPos = (() => {
        const lat =
          p.lat ?? p.latitude ?? p.location?.lat ?? p.coords?.lat ?? null;
        const lng =
          p.lng ?? p.longitude ?? p.location?.lng ?? p.coords?.lng ?? null;
        if (typeof lat === "number" && typeof lng === "number") return { lat, lng };
        return null;
      })();

      let locationOK = true;
      if (userPos && petPos) {
        const d = kmBetween(userPos, petPos);
        locationOK = d <= radiusKm;
      } else if (locQuery.trim()) {
        const place = locQuery.toLowerCase();
        const zonaTxt = (
          p.location ||
          [p.city, p.state, p.province, p.locationName]
            .filter(Boolean)
            .join(" ")
        )
          .toString()
          .toLowerCase();
        locationOK = zonaTxt.includes(place);
      }

      return (
        textOK &&
        catOK &&
        otherPetsOK &&
        kidsOK &&
        vacOK &&
        neuOK &&
        locationOK
      );
    });

    switch (order) {
      case "nombre_asc":
        arr = [...arr].sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
        break;
      case "nombre_desc":
        arr = [...arr].sort((a, b) =>
          (b.name || "").localeCompare(a.name || "")
        );
        break;
      default:
        arr = [...arr].sort((a, b) => {
          const ad = new Date(a.createdAt || a.created_at || 0).getTime();
          const bd = new Date(b.createdAt || b.created_at || 0).getTime();
          return bd - ad;
        });
    }
    return arr;
  }, [
    pets,
    q,
    category,
    order,
    withOtherPets,
    withKids,
    vaccinated,
    neutered,
    userPos,
    locQuery,
    radiusKm,
  ]);

  const clearAll = () => {
    setCategory("Todas");
    setOrder("recientes");
    setWithOtherPets(false);
    setWithKids(false);
    setVaccinated(false);
    setNeutered(false);
    setQ("");
    setLocQuery("");
    setUserPos(null);
    setRadiusKm(25);
  };

  // Geolocalización
  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = { lat: latitude, lng: longitude };
        setUserPos(coords);
        setGeoLoading(false);

        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
          const res = await fetch(url, {
            headers: { Accept: "application/json" },
          });
          const data = await res.json();
          const a = data.address || {};
          const city = a.city || a.town || a.village || a.hamlet || "";
          const state = a.state || a.region || a.province || "";
          const pretty = [city, state].filter(Boolean).join(", ");
          if (pretty) setLocQuery(pretty);
        } catch {
          /* ignorar */
        }
      },
      () => {
        setUserPos(null);
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  /* -------- render -------- */
  if (loading) {
    return (
      <div className="ml-container">
        <section className="ml-hero">
          <h1 className="ml-hero-title">Tu nuevo mejor amigo está acá 🐾</h1>
          <p className="ml-hero-sub">Cargando mascotas...</p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-container">
        <section className="ml-hero">
          <h1 className="ml-hero-title">Tu nuevo mejor amigo está acá 🐾</h1>
          <p className="ml-hero-sub" style={{ color: "red" }}>
            {error}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="ml-container">
      {/* HERO */}
      <section className="ml-hero">
        <h1 className="ml-hero-title">Tu nuevo mejor amigo está acá 🐾</h1>
        <p className="ml-hero-sub">
          Encontrá mascotas en adopción cerca tuyo. Elegí una ubicación o activá tu
          localización.
        </p>

        <div className="ml-hero-controls">
          <input
            className="ml-hero-input"
            type="text"
            placeholder="Ej: Rosario, Santa Fe"
            value={locQuery}
            onChange={(e) => {
              setLocQuery(e.target.value);
              setUserPos(null);
            }}
          />
          <select
            className="ml-hero-select"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
          >
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
          </select>
          <button
            className="ml-hero-btn"
            onClick={useMyLocation}
            disabled={geoLoading}
          >
            {geoLoading ? "Localizando..." : "Usar mi ubicación"}
          </button>
        </div>

        {userPos && (
          <div className="ml-hero-hint">
            Filtrando por radio de {radiusKm} km desde tu ubicación actual.
          </div>
        )}
      </section>

      {/* Topbar */}
      <div className="ml-topbar">
        <div className="ml-breadcrumb">
          <span>Adopción</span>
          <span className="ml-bullet">›</span>
          <span>Mascotas</span>
        </div>
        <div className="ml-actions">
          <span className="ml-results">
            {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="ml-filters">
        <div className="ml-field">
          <label>Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-facets">
          <label className="ml-facets-title">Filtros</label>
          <div className="ml-facets-grid">
            <label className="ml-checkbox">
              <input
                type="checkbox"
                checked={withOtherPets}
                onChange={(e) => setWithOtherPets(e.target.checked)}
              />
              <span>Apta con otras mascotas</span>
            </label>
            <label className="ml-checkbox">
              <input
                type="checkbox"
                checked={withKids}
                onChange={(e) => setWithKids(e.target.checked)}
              />
              <span>Con niños</span>
            </label>
            <label className="ml-checkbox">
              <input
                type="checkbox"
                checked={vaccinated}
                onChange={(e) => setVaccinated(e.target.checked)}
              />
              <span>Vacunada</span>
            </label>
            <label className="ml-checkbox">
              <input
                type="checkbox"
                checked={neutered}
                onChange={(e) => setNeutered(e.target.checked)}
              />
              <span>Castrada</span>
            </label>
          </div>
        </div>

        <button className="ml-clear" onClick={clearAll}>
          Limpiar filtros
        </button>
      </div>

      {/* Búsqueda */}
      <div className="ml-searchband">
        <div className="ml-field w-full">
          <label>Búsqueda</label>
          <input
            type="text"
            placeholder="Nombre, características (ej. 'tranquila', 'mediana')"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Listado */}
      <div className="ml-list">
        {filtered.map((p) => (
          <PetCard key={p.id || p._id} pet={p} />
        ))}

        {filtered.length === 0 && (
          <div className="ml-empty">
            <h3>No encontramos resultados</h3>
            <p>Probá cambiar la ubicación, el radio o limpiar filtros.</p>
            <button className="ml-btn" onClick={clearAll}>
              Restablecer filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
