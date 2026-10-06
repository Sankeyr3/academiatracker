// Formatea horas en castellano: 1 h, 1,5 h, 0,48 h
export const fmtHours = (h) =>
  `${Number(h || 0).toLocaleString('es-ES', { maximumFractionDigits: 2 })} h`

export const sumHours = (videos) => videos.reduce((s, v) => s + Number(v.hours || 0), 0)
