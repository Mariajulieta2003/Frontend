import React, { createContext, useContext, useEffect, useState } from "react";

const PetsCtx = createContext(null);

const DEMO_PETS = [
  { id: "p1", name: "Luna",  photoUrl: "/pet-placeholder.png", category: "Perro", postedAt: Date.now() },
  { id: "p2", name: "Michi", photoUrl: "/pet-placeholder.png", category: "Gato",  postedAt: Date.now() - 86400000 },
  { id: "p3", name: "Toby",  photoUrl: "/pet-placeholder.png", category: "Perro", postedAt: Date.now() - 2*86400000 },
];

export function PetsProvider({ children }) {
  const [approvedPets, setApprovedPets] = useState([]);
  const [featuredPets, setFeaturedPets] = useState([]);

  useEffect(() => {
    // DEMO: sin backend
    setApprovedPets(DEMO_PETS);
    setFeaturedPets(DEMO_PETS.slice(0, 2));
  }, []);

  return (
    <PetsCtx.Provider value={{ approvedPets, featuredPets }}>
      {children}
    </PetsCtx.Provider>
  );
}

export function usePets() {
  return useContext(PetsCtx);
}
