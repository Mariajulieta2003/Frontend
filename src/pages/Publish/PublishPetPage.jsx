// src/pages/PublishPet/PublishPetPage.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Upload,
  X,
  Save,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import "./styles/PublishPet.css";

const MAX_PHOTOS = 5;
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const CATEGORIES = ["Perro", "Gato", "Otro"];
const SIZES = ["Pequeño", "Mediano", "Grande"];
const SEXES = ["Macho", "Hembra"];
const TEMPERAMENTS = [
  "Sociable",
  "Con niños",
  "Con perros",
  "Con gatos",
  "Tranquilo",
  "Activo",
];

const phoneFormat = (raw) => raw.replace(/[^\d+]/g, "").replace(/^0+/, "");
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

// Convierte un archivo a base64
function fileToBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = (err) => rej(err);
    reader.readAsDataURL(file);
  });
}


function PublishPetPage() {
  const [search] = useSearchParams();
  const editId = search.get("edit"); // ?edit=3 => modo edición
  const navigate = useNavigate();

  // estado principal del form
  const [form, setForm] = useState({
    name: "",
    category: "Perro",
    age: "",
    size: "",
    sex: "",
    description: "",
    locationCity: "",
    locationProvince: "",
    phone: "",
    vaccinated: false,
    castrated: false,
    dewormed: false,
    temperaments: [],
  });

  const [step, setStep] = useState(1); // 1..4
  const [descCount, setDescCount] = useState(0);

  // fotos
  const [files, setFiles] = useState([]); // File[]
  const [previews, setPreviews] = useState([]); // {id,url}[]
  const fileInputRef = useRef(null);

  // estado de envío
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ==============================
  // 🔹 CARGAR MASCOTA AL EDITAR
  // ==============================
  useEffect(() => {
    if (!editId) return; // si no es edición, nada

    const loadPet = async () => {
      try {
        const res = await fetch(`${API_BASE}/pets/${editId}`);
        const data = await res.json();
        if (!res.ok) {
          console.error("No se pudo cargar la mascota:", data);
          return;
        }

        console.log("🐾 Mascota cargada para edición:", data);

        // separar ciudad y provincia
        let city = "";
        let province = "";
        if (data.city) {
          const parts = data.city.split(",");
          city = parts[0]?.trim() || "";
          province = parts[1]?.trim() || "";
        }

        setForm({
          name: data.name || "",
          category: data.category || "Perro",
          age: "", // tu backend devuelve age como string "X años Y meses"
          size: data.size || "",
          sex: data.sex || "",
          description: data.description || "",
          locationCity: city,
          locationProvince: province,
          phone: "", // no lo guardamos en la tabla todavía
          vaccinated: data.vaccinated || false,
          castrated: data.neutered || false,
          dewormed: false,
          temperaments: [
            ...(data.goodWithKids ? ["Con niños"] : []),
            ...(data.goodWithPets ? ["Con perros"] : []),
          ],
        });
        setDescCount((data.description || "").length);

        // preview de imagen existente
        if (data.photoURL) {
          setPreviews([{ id: "existing", url: data.photoURL }]);
        }
      } catch (err) {
        console.error("Error cargando mascota para edición:", err);
      }
    };

    loadPet();
  }, [editId]);

  // ==============================
  // 🔹 VALIDACIONES
  // ==============================
  const errors = useMemo(() => {
    const e = {};

    // paso 1
    if (step >= 1) {
      if (!form.name.trim()) e.name = "Requerido";
      if (!form.description.trim() || form.description.length < 10)
        e.description = "Al menos 10 caracteres";
      if (!form.category) e.category = "Elegí una categoría";
    }
    // paso 2
    if (step >= 2) {
      if (previews.length === 0) e.photos = "Agregá al menos una foto";
    }
    // paso 4
    if (step >= 4) {
      if (!form.phone.trim()) e.phone = "Requerido";
    }
    return e;
  }, [form, step, previews.length]);

  // ==============================
  // 🔹 HANDLERS FORM
  // ==============================
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "phone") {
      setForm((f) => ({ ...f, phone: phoneFormat(value) }));
      return;
    }
    if (name === "description") setDescCount(value.length);
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleTemperament = (t) =>
    setForm((f) => ({
      ...f,
      temperaments: f.temperaments.includes(t)
        ? f.temperaments.filter((x) => x !== t)
        : [...f.temperaments, t],
    }));

  // ==============================
  // 🔹 IMÁGENES
  // ==============================
  const handleFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    const allowed = Math.min(MAX_PHOTOS - files.length, incoming.length);
    if (!allowed) return;
    const slice = incoming.slice(0, allowed);

    setFiles((fs) => [...fs, ...slice]);
    setPreviews((p) => [
      ...p,
      ...slice.map((f) => ({
        id: `${f.name}-${f.lastModified}-${Math.random()
          .toString(36)
          .slice(2)}`,
        url: URL.createObjectURL(f),
      })),
    ]);
  };

  const removeImage = (id) => {
    setPreviews((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx !== -1) {
        URL.revokeObjectURL(prev[idx].url);
        setFiles((fs) => fs.filter((_, i) => i !== idx));
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  // ==============================
  // 🔹 WIZARD NAV
  // ==============================
  const next = () => {
    if (
      step === 1 &&
      (errors.name || errors.description || errors.category)
    ) {
      return window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (step === 2 && errors.photos)
      return window.scrollTo({ top: 0, behavior: "smooth" });
    if (step === 4 && errors.phone)
      return window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => clamp(s + 1, 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prev = () => {
    setStep((s) => clamp(s - 1, 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Convierte un archivo a base64
function fileToBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = (err) => rej(err);
    reader.readAsDataURL(file);
  });
}

const submit = async (publishNow) => {
  // Validaciones por pasos
  if (publishNow) {
    if (
      !form.name.trim() ||
      !form.category ||
      form.description.trim().length < 10
    ) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (previews.length === 0) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!form.phone.trim()) {
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  }

  const token = localStorage.getItem("ph_token");
  if (!token) {
    alert("Necesitás iniciar sesión para publicar.");
    navigate("/login");
    return;
  }

  // Convertir fotos nuevas a base64
  let photosBase64 = [];

  if (files.length > 0) {
    for (const f of files) {
      const b64 = await fileToBase64(f);
      photosBase64.push(b64);
    }
  } else if (previews.length > 0 && previews[0].url.startsWith("data:")) {
    // Caso: estamos editando y ya teníamos una base64 previa
    photosBase64 = [previews[0].url];
  }

  // enums a minúsculas para DB
  const species = form.category?.toLowerCase() || "perro";
  const size = form.size ? form.size.toLowerCase() : null;
  const sex = form.sex ? form.sex.toLowerCase() : null;

  // payload final
  const payload = {
    name: form.name.trim(),
    category: form.category,
    species,
    sex,
    size,
    age_years: form.age ? Number(form.age) || 0 : 0,
    age_months: 0,
    description: form.description.trim(),
    location: [form.locationCity, form.locationProvince]
      .filter(Boolean)
      .join(", "),

    // ⭐ GUARDAMOS BASE64 - se envía al backend
    photos: photosBase64,

    good_with_kids: form.temperaments.includes("Con niños"),
    good_with_pets:
      form.temperaments.includes("Con perros") ||
      form.temperaments.includes("Con gatos"),
    is_vaccinated: form.vaccinated,
    is_neutered: form.castrated,
  };

  if (publishNow) {
    payload.status = "en_adopcion";
  }

  // Si editamos → PUT. Si creamos → POST.
  const url = editId
    ? `${API_BASE}/pets/${editId}`
    : `${API_BASE}/pets`;

  const method = editId ? "PUT" : "POST";

  try {
    setSaving(true);
    setSubmitError("");

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Error al guardar la mascota");
    }

    alert(
      publishNow
        ? editId
          ? "¡Mascota actualizada y publicada!"
          : "¡Mascota publicada con éxito!"
        : editId
        ? "Cambios guardados"
        : "Mascota guardada"
    );

    navigate("/my-pets");
  } catch (err) {
    console.error("Error al publicar/editar mascota:", err);
    setSubmitError(err.message || "Error al guardar la mascota");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    setSaving(false);
  }
};


  const progress = ((step - 1) / 3) * 100;

  // ==============================
  // 🔹 RENDER
  // ==============================
  return (
    <div className="wizardContainer pagePadTop">
      {/* Hero superior */}
      <div className="publishHero">
        <h2>{editId ? "Editar mascota 🐾" : "🐾 ¡Encontrale un nuevo hogar!"}</h2>
        <p>
          {editId
            ? "Modificá los datos de tu mascota."
            : "Completá los pasos para ayudar a que más personas la conozcan."}
        </p>

        {/* Botón VOLVER */}
        <button
          type="button"
          className="btn ghost backBtn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} /> Volver
        </button>
      </div>

      {/* Mensaje de error de envío */}
      {submitError && <div className="alert error">{submitError}</div>}

      {/* barra de progreso */}
      <div className="wizardProgress">
        <div className="bar" style={{ width: `${progress}%` }} />
        <div className="marks">
          <span className={step >= 1 ? "hit" : ""}>Datos</span>
          <span className={step >= 2 ? "hit" : ""}>Fotos</span>
          <span className={step >= 3 ? "hit" : ""}>Salud</span>
          <span className={step >= 4 ? "hit" : ""}>Contacto</span>
        </div>
      </div>

      {/* header */}
      <div className="wizardHeader">
        <div>
          <h1 className="pageTitle">
            {editId ? "Editar mascota" : "Publicar mascota"}
          </h1>
          <p className="pageSubtitle">
            {editId
              ? "Actualizá la información de tu publicación."
              : "Completá los pasos. Podés publicar o guardar."}
          </p>
        </div>
        <div className="actionsHeader">
          <button
            className="btn ghost"
            onClick={() => submit(false)}
            disabled={saving}
          >
            <Save size={18} /> {saving ? "Guardando..." : "Guardar"}
          </button>
          <button
            className="btn primary"
            onClick={() => submit(true)}
            disabled={saving}
          >
            <CheckCircle2 size={18} />{" "}
            {saving ? "Publicando..." : editId ? "Actualizar" : "Publicar"}
          </button>
        </div>
      </div>

      {/* PASO 1: Datos */}
      {step === 1 && (
        <section className="cardWide">
          <h3 className="cardTitle">1. Datos principales</h3>

          <div className="formRow">
            <label>
              Nombre <span className="req">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Ej: Luna"
              className={errors.name ? "invalid" : ""}
            />
            {errors.name && <small className="error">{errors.name}</small>}
          </div>

          <div className="formGrid2">
            <div className="formRow">
              <label>
                Categoría <span className="req">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={onChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="formRow">
              <label>Edad (años)</label>
              <input
                name="age"
                value={form.age}
                onChange={onChange}
                placeholder="Ej: 2"
              />
            </div>
          </div>

          <div className="formGrid2">
            <div className="formRow">
              <label>Tamaño</label>
              <select name="size" value={form.size} onChange={onChange}>
                <option value="">—</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="formRow">
              <label>Sexo</label>
              <select name="sex" value={form.sex} onChange={onChange}>
                <option value="">—</option>
                {SEXES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="formRow">
            <label>
              Descripción <span className="req">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              placeholder="Contanos sobre su carácter, cuidados, etc."
              className={errors.description ? "invalid" : ""}
            />
            <div className="counter">{descCount} / 600</div>
            {errors.description && (
              <small className="error">{errors.description}</small>
            )}
          </div>
        </section>
      )}

      {/* PASO 2: Fotos */}
      {step === 2 && (
        <section className="cardWide">
          <h3 className="cardTitle">
            2. Fotos (hasta {MAX_PHOTOS})
          </h3>

          <div
            className={`dropzone big ${errors.photos ? "invalid" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload />
            <p>
              Arrastrá las fotos aquí o{" "}
              <span className="link">buscá en tu equipo</span>
            </p>
            <div className="dzMeta">
              <span>
                {previews.length} / {MAX_PHOTOS} fotos
              </span>
              <span>•</span>
              <span>JPG/PNG, hasta 5MB</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
          {errors.photos && (
            <small className="error">{errors.photos}</small>
          )}

          {!!previews.length && (
            <div className="thumbs big">
              {previews.map((p) => (
                <div key={p.id} className="thumb">
                  <img src={p.url} alt="preview" />
                  <button
                    className="thumbRemove"
                    onClick={() => removeImage(p.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* PASO 3: Salud */}
      {step === 3 && (
        <section className="cardWide">
          <h3 className="cardTitle">3. Salud y comportamiento</h3>

          <div className="checksRow">
            <label className="check">
              <input
                type="checkbox"
                name="vaccinated"
                checked={form.vaccinated}
                onChange={onChange}
              />
              Vacunado
            </label>
            <label className="check">
              <input
                type="checkbox"
                name="castrated"
                checked={form.castrated}
                onChange={onChange}
              />
              Castrado
            </label>
            <label className="check">
              <input
                type="checkbox"
                name="dewormed"
                checked={form.dewormed}
                onChange={onChange}
              />
              Desparasitado
            </label>
          </div>

          <div className="formRow">
            <label>Temperamento</label>
            <div className="chips">
              {TEMPERAMENTS.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`chip ${
                    form.temperaments.includes(t) ? "active" : ""
                  }`}
                  onClick={() => toggleTemperament(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PASO 4: Contacto */}
      {step === 4 && (
        <section className="cardWide">
          <h3 className="cardTitle">4. Ubicación y contacto</h3>

          <div className="formGrid2">
            <div className="formRow">
              <label>Ciudad</label>
              <input
                name="locationCity"
                value={form.locationCity}
                onChange={onChange}
                placeholder="Ej: Rosario"
              />
            </div>
            <div className="formRow">
              <label>Provincia</label>
              <input
                name="locationProvince"
                value={form.locationProvince}
                onChange={onChange}
                placeholder="Ej: Santa Fe"
              />
            </div>
          </div>

          <div className="formRow">
            <label>
              Teléfono <span className="req">*</span>
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="Ej: +54 9 341 ..."
              className={errors.phone ? "invalid" : ""}
            />
            {errors.phone && (
              <small className="error">{errors.phone}</small>
            )}
          </div>
        </section>
      )}

      {/* Navegación de pasos */}
      <div className="wizardNav">
        <Link to="/my-pets" className="btn ghost">
          Cancelar
        </Link>

        <div className="spacer" />

        <button
          className="btn ghost"
          disabled={step === 1 || saving}
          onClick={prev}
        >
          <ArrowLeft size={18} /> Anterior
        </button>

        {step < 4 ? (
          <button
            className="btn primary"
            onClick={next}
            disabled={saving}
          >
            Siguiente <ArrowRight size={18} />
          </button>
        ) : (
          <>
            <button
              className="btn ghost"
              onClick={() => submit(false)}
              disabled={saving}
            >
              <Save size={18} /> {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              className="btn primary"
              onClick={() => submit(true)}
              disabled={saving}
            >
              <CheckCircle2 size={18} />{" "}
              {saving ? "Publicando..." : editId ? "Actualizar" : "Publicar"}
            </button>
          </>
        )}
      </div>

      <div className="wizardHint">
        <AlertTriangle size={16} /> Podés publicar ahora o guardar
        y editarla más adelante.
      </div>
    </div>
  );
}

export default PublishPetPage;
