const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const DIAGRAM_MAP = {
  cell: "mediclear/cell-structure",
  spread: "mediclear/metastasis-spread",
  treatment: "mediclear/treatment-infusion",
  scan: "mediclear/pet-scan-view",
  blood: "mediclear/blood-cells",
  device: "mediclear/port-a-cath",
  generic: "mediclear/generic-medical",
};

export function isCloudinaryConfigured() {
  return Boolean(CLOUD_NAME);
}

export function getDiagramUrl(diagramType = "generic", options = {}) {
  const { width = 600, quality = "auto", format = "auto" } = options;

  if (!CLOUD_NAME) {
    const fallbackMap = {
      spread: "metastasis",
      treatment: "chemotherapy",
      generic: "generic",
      cell: "default",
    };
    const fallback = fallbackMap[diagramType] ?? "default";
    return `/diagrams/${fallback}.svg`;
  }

  const publicId = DIAGRAM_MAP[diagramType] ?? DIAGRAM_MAP.generic;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_${format},q_${quality},w_${width}/${publicId}`;
}
