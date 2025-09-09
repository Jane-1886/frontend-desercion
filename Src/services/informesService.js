// src/services/informesService.js
import api from "../controlador/api";

export async function descargarReporteFicha(id) {
  const res = await api.get(`/api/informes/fichas/${id}/pdf`, {
    responseType: "blob", // 🔹 clave para PDF
  });
  return res.data; // Blob
}
