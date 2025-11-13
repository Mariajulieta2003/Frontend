import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit3, Pause, Play, Trash2 } from "lucide-react";
import "./styles/MyPets.css";
import { usePets } from "../../shared/context/PetsContext.jsx";

const STATUS_LABEL = {
  published: "Activas",
  paused: "Pendientes",
  finished: "Finalizadas",
  draft: "Borradores",
};

export default function MyPetsPage() {
  const navigate = useNavigate();
  const { approvedPets = [] } = usePets();

  // Mantengo copia local para UI optimista
  const [myPets, setMyPets] = useState(approvedPets);
  const [tab, setTab] = useState("all"); // all | published | paused | finished | draft

  useEffect(() => setMyPets(approvedPets), [approvedPets]);

  const counts = useMemo(() => {
    const c = { all: myPets.length, published: 0, paused: 0, finished: 0, draft: 0 };
    myPets.forEach(p => { c[p.status] = (c[p.status] || 0) + 1; });
    return c;
  }, [myPets]);

  const filtered = useMemo(() => {
    if (tab === "all") return myPets;
    return myPets.filter(p => p.status === tab);
  }, [myPets, tab]);

  // -------- Handlers (cambiá las URLs a tu backend) --------
  const handleEdit = (pet) => {
    // Ej: /pets/edit/:id o /publish?edit=id
    navigate(`/publish?edit=${pet.id}`);
  };

  const handlePublish = async (pet) => {
    const prev = [...myPets];
    // UI optimista: si NO está publicada -> publicar; si está, pausar
    const nextStatus = pet.status === "published" ? "paused" : "published";
    setMyPets(list => list.map(p => p.id === pet.id ? { ...p, status: nextStatus } : p));
    try {
      // PATCH ejemplo
      const res = await fetch(`/api/pets/${pet.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("status update failed");
    } catch (e) {
      // revertir si falla
      setMyPets(prev);
      alert("No se pudo actualizar el estado. Intentá nuevamente.");
    }
  };

  const handleDelete = async (pet) => {
    if (!confirm(`¿Eliminar a "${pet.name}"? Esta acción no se puede deshacer.`)) return;
    const prev = [...myPets];
    // UI optimista
    setMyPets(list => list.filter(p => p.id !== pet.id));
    try {
      const res = await fetch(`/api/pets/${pet.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
    } catch (e) {
      setMyPets(prev);
      alert("No se pudo eliminar la publicación.");
    }
  };
  // ---------------------------------------------------------

  return (
    <div className="petsContainer pagePadTop">
      {/* Header único */}
      <div className="sectionHeader">
        <div>
          <h1 className="pageTitle">Mis mascotas publicadas</h1>
          <p className="pageSubtitle">Gestioná tus publicaciones de forma simple y clara.</p>
        </div>
        <Link to="/publish" className="mlBtnPrimary">+ Publicar mascota</Link>
      </div>

      {/* Filtros (estados) */}
      <div className="toolbarRow">
        <div className="tabs">
          <button className={`tabBtn ${tab==="all"?"active":""}`} onClick={() => setTab("all")}>
            Todas <span className="pill">{counts.all}</span>
          </button>
          <button className={`tabBtn ${tab==="published"?"active":""}`} onClick={() => setTab("published")}>
            Activas <span className="pill green">{counts.published || 0}</span>
          </button>
          <button className={`tabBtn ${tab==="paused"?"active":""}`} onClick={() => setTab("paused")}>
            Pendientes <span className="pill yellow">{counts.paused || 0}</span>
          </button>
          <button className={`tabBtn ${tab==="finished"?"active":""}`} onClick={() => setTab("finished")}>
            Finalizadas <span className="pill gray">{counts.finished || 0}</span>
          </button>
          <button className={`tabBtn ${tab==="draft"?"active":""}`} onClick={() => setTab("draft")}>
            Borradores <span className="pill gray">{counts.draft || 0}</span>
          </button>
        </div>
      </div>

      {/* Empty state */}
      {!filtered.length && (
        <div className="emptyState">
          <h2>No hay publicaciones en “{tab === "all" ? "todas" : STATUS_LABEL[tab]}”.</h2>
          <p>Podés cambiar el filtro o crear una nueva publicación.</p>
          <Link className="mlBtnPrimary" to="/publish">Publicar mascota</Link>
        </div>
      )}

      {/* Grid de cards */}
      <div className="petsGrid">
        {filtered.map((pet) => (
          <article key={pet.id} className="petCard">
            <div className="petImgWrapper">
              {pet.image ? (
                <img src={pet.image} alt={pet.name} />
              ) : (
                <div className="imgSkeleton">Sin foto</div>
              )}
              {/* Ribbon opcional con estado */}
              {pet.status && (
                <div className={`ribbon ${
                  pet.status === "published" ? "published" :
                  pet.status === "paused" ? "paused" :
                  pet.status === "draft" ? "draft" : ""
                }`}>
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
                <button className="btn ghost info" onClick={() => handleEdit(pet)}>
                  <Edit3 size={17}/> Editar
                </button>

                {pet.status === "published" ? (
                  <button className="btn ghost warn" onClick={() => handlePublish(pet)}>
                    <Pause size={17}/> Pausar
                  </button>
                ) : (
                  <button className="btn ghost success" onClick={() => handlePublish(pet)}>
                    <Play size={17}/> Publicar
                  </button>
                )}

                <button className="btn ghost danger" onClick={() => handleDelete(pet)}>
                  <Trash2 size={17}/> Eliminar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
