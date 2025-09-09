// src/services/fichasService.js
import api from "../controlador/api";

export async function getFichas() {
  const res = await api.get("/api/fichas");
  return res.data; // array de fichas
}

export async function getFicha(id) {
  const res = await api.get(`/api/fichas/${id}`);
  return res.data;
}
