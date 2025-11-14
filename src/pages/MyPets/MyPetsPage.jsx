// src/pages/MyPets/MyPetsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit3, Pause, Play, Trash2 } from "lucide-react";
import "./styles/MyPets.css";
import {
  apiGetMyPets,
  apiUpdatePetStatus,
  apiDeletePet,
} from "../../api/pets.js";

const STATUS_LABEL = {
  published: "Activas",
  paused: "Pendientes",
  finished: "Finalizadas",
  draft: "Borradores",
};

const mapStatus = (s) => {
  if (!s) return "published";
  const v = String(s).toLowerCase();
  if (["en_adopcion", "activa", "publicada"].includes(v)) return "published";
  if (["pausada", "pendiente"].includes(v)) return "paused";
  if (["finalizada", "adoptada"].includes(v)) return "finished";
  if (["borrador"].includes(v)) return "draft";
  return "published";
};

export default function MyPetsPage() {
  const navigate = useNavigate();

  const [myPets, setMyPets] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar MIS mascotas desde backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apiGetMyPets(1); // owner_id = 1 por ahora
        const normalized = (data || []).map((p) => ({
          ...p,
          status: mapStatus(p.status),
          image: p.photoURL || p.image_url || p.image || null,
        }));
        setMyPets(normalized);
      } catch (err) {
        console.error(err);
        setError("No pudimos cargar tus mascotas publicadas.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const counts = useMemo(() => {
    const c = {
      all: myPets.length,
      published: 0,
      paused: 0,
      finished: 0,
      draft: 0,
    };
    myPets.forEach((p) => {
      const key = p.status || "published";
      c[key] = (c[key] || 0) + 1;
    });
    return c;
  }, [myPets]);

  const filtered = useMemo(() => {
    if (tab === "all") return myPets;
    return myPets.filter((p) => p.status === tab);
  }, [myPets, tab]);

  // 👉 Editar: por ahora solo redirige al formulario con el id
    const handleEdit = (pet) => {
      navigate(`/publish?edit=${pet.id}`);
    };


  // 👉 Publicar / Pausar
  const handlePublish = async (pet) => {
    const prev = [...myPets];
    const nextStatus = pet.status === "published" ? "paused" : "published";

    // UI optimista
    setMyPets((list) =>
      list.map((p) => (p.id === pet.id ? { ...p, status: nextStatus } : p))
    );

    try {
      await apiUpdatePetStatus(pet.id, nextStatus);
    } catch (e) {
      console.error(e);
      setMyPets(prev);
      alert("No se pudo actualizar el estado. Intentá nuevamente.");
    }
  };

  // 👉 Eliminar publicación
  const handleDelete = async (pet) => {
    if (!confirm(`¿Eliminar a "${pet.name}"? Esta acción no se puede deshacer.`))
      return;

    const prev = [...myPets];
    setMyPets((list) => list.filter((p) => p.id !== pet.id));

    try {
      await apiDeletePet(pet.id);
    } catch (e) {
      console.error(e);
      setMyPets(prev);
      alert("No se pudo eliminar la publicación.");
    }
  };

  return (
    <div className="petsContainer pagePadTop">
      <div className="sectionHeader">
        <div>
          <h1 className="pageTitle">Mis mascotas publicadas</h1>
          <p className="pageSubtitle">
            Gestioná tus publicaciones de forma simple y clara.
          </p>
        </div>
        <Link to="/publish" className="mlBtnPrimary">
          + Publicar mascota
        </Link>
      </div>

      {loading && <p>Cargando tus mascotas...</p>}
      {error && <p className="errorText">{error}</p>}

      <div className="toolbarRow">
        <div className="tabs">
          <button
            className={`tabBtn ${tab === "all" ? "active" : ""}`}
            onClick={() => setTab("all")}
          >
            Todas <span className="pill">{counts.all}</span>
          </button>
          <button
            className={`tabBtn ${tab === "published" ? "active" : ""}`}
            onClick={() => setTab("published")}
          >
            Activas <span className="pill green">{counts.published || 0}</span>
          </button>
          <button
            className={`tabBtn ${tab === "paused" ? "active" : ""}`}
            onClick={() => setTab("paused")}
          >
            Pendientes <span className="pill yellow">{counts.paused || 0}</span>
          </button>
          <button
            className={`tabBtn ${tab === "finished" ? "active" : ""}`}
            onClick={() => setTab("finished")}
          >
            Finalizadas{" "}
            <span className="pill gray">{counts.finished || 0}</span>
          </button>
          <button
            className={`tabBtn ${tab === "draft" ? "active" : ""}`}
            onClick={() => setTab("draft")}
          >
            Borradores <span className="pill gray">{counts.draft || 0}</span>
          </button>
        </div>
      </div>

      {!loading && !filtered.length && (
        <div className="emptyState">
          <h2>
            No hay publicaciones en “
            {tab === "all" ? "todas" : STATUS_LABEL[tab]}”.
          </h2>
          <p>Podés cambiar el filtro o crear una nueva publicación.</p>
          <Link className="mlBtnPrimary" to="/publish">
            Publicar mascota
          </Link>
        </div>
      )}

      <div className="petsGrid">
        {filtered.map((pet) => (
          <article key={pet.id} className="petCard">
            <div className="petImgWrapper">
              {pet.image ? (
                <img src={pet.image} alt={pet.name} />
              ) : (
                <div className="imgSkeleton">Sin foto</div>
              )}
              {pet.status && (
                <div
                  className={`ribbon ${
                    pet.status === "published"
                      ? "published"
                      : pet.status === "paused"
                      ? "paused"
                      : pet.status === "draft"
                      ? "draft"
                      : ""
                  }`}
                >
                  {pet.status === "published" && "Publicado"}
                  {pet.status === "paused" && "Pendiente"}
                  {pet.status === "finished" && "Finalizado"}
                  {pet.status === "draft" && "Borrador"}
                </div>
              )}
            </div>

            <div className="petInfo">
              <h3 className="petName">{pet.name}</h3>
              <p className="petDesc">{pet.description || "Sin descripción"}</p>

              <div className="actionsRow">
                <button
                  className="btn ghost info"
                  onClick={() => handleEdit(pet)}
                >
                  <Edit3 size={17} /> Editar
                </button>

                {pet.status === "published" ? (
                  <button
                    className="btn ghost warn"
                    onClick={() => handlePublish(pet)}
                  >
                    <Pause size={17} /> Pausar
                  </button>
                ) : (
                  <button
                    className="btn ghost success"
                    onClick={() => handlePublish(pet)}
                  >
                    <Play size={17} /> Publicar
                  </button>
                )}

                <button
                  className="btn ghost danger"
                  onClick={() => handleDelete(pet)}
                >
                  <Trash2 size={17} /> Eliminar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
