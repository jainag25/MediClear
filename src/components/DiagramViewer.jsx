import { getDiagramUrl, isCloudinaryConfigured } from "../lib/cloudinary";
import { useMemo, useState } from "react";

function InlineDiagram({ type, accentColor }) {
  const stroke = accentColor || "#2E86AB";

  if (type === "spread") {
    return (
      <svg viewBox="0 0 200 160" className="h-40 w-full">
        <circle cx="100" cy="80" r="22" fill="#FEE2E2" stroke={stroke} strokeWidth="2" />
        <circle cx="35" cy="30" r="12" fill="#FEF3C7" stroke={stroke} strokeWidth="2" />
        <circle cx="165" cy="30" r="12" fill="#FEF3C7" stroke={stroke} strokeWidth="2" />
        <circle cx="35" cy="130" r="12" fill="#FEF3C7" stroke={stroke} strokeWidth="2" />
        <circle cx="165" cy="130" r="12" fill="#FEF3C7" stroke={stroke} strokeWidth="2" />
        <line x1="80" y1="65" x2="46" y2="38" stroke={stroke} strokeDasharray="4 4" />
        <line x1="120" y1="65" x2="154" y2="38" stroke={stroke} strokeDasharray="4 4" />
        <line x1="80" y1="95" x2="46" y2="122" stroke={stroke} strokeDasharray="4 4" />
        <line x1="120" y1="95" x2="154" y2="122" stroke={stroke} strokeDasharray="4 4" />
      </svg>
    );
  }

  if (type === "scan") {
    return (
      <svg viewBox="0 0 200 160" className="h-40 w-full">
        <ellipse cx="100" cy="80" rx="70" ry="48" fill="#EFF6FF" stroke={stroke} strokeWidth="2" />
        <ellipse cx="100" cy="80" rx="50" ry="34" fill="#DBEAFE" stroke={stroke} strokeWidth="1.5" />
        <ellipse cx="100" cy="80" rx="30" ry="20" fill="#BFDBFE" stroke={stroke} strokeWidth="1.5" />
      </svg>
    );
  }

  if (type === "treatment") {
    return (
      <svg viewBox="0 0 200 160" className="h-40 w-full">
        <rect x="70" y="20" width="60" height="70" rx="8" fill="#E0F2FE" stroke={stroke} strokeWidth="2" />
        <line x1="100" y1="90" x2="100" y2="120" stroke={stroke} strokeWidth="2" />
        <line x1="100" y1="120" x2="70" y2="140" stroke={stroke} strokeWidth="2" />
        <line x1="100" y1="120" x2="130" y2="140" stroke={stroke} strokeWidth="2" />
        <circle cx="100" cy="104" r="4" fill={stroke} />
      </svg>
    );
  }

  if (type === "cell") {
    return (
      <svg viewBox="0 0 200 160" className="h-40 w-full">
        <circle cx="100" cy="80" r="50" fill="#F3F4F6" stroke={stroke} strokeWidth="2" />
        <circle cx="100" cy="80" r="17" fill="#E5E7EB" stroke={stroke} strokeWidth="1.5" />
        <ellipse cx="80" cy="64" rx="6" ry="4" fill={stroke} opacity="0.55" />
        <ellipse cx="120" cy="72" rx="5" ry="3.5" fill={stroke} opacity="0.5" />
        <ellipse cx="90" cy="108" rx="4.5" ry="3.5" fill={stroke} opacity="0.45" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 160" className="h-40 w-full">
      <circle cx="100" cy="80" r="48" fill="#F3F4F6" stroke={stroke} strokeWidth="2" />
      <circle cx="100" cy="80" r="16" fill="#E5E7EB" stroke={stroke} strokeWidth="1.5" />
      <circle cx="75" cy="65" r="5" fill={stroke} opacity="0.7" />
      <circle cx="124" cy="71" r="4" fill={stroke} opacity="0.5" />
      <circle cx="89" cy="108" r="3" fill={stroke} opacity="0.5" />
      <circle cx="118" cy="104" r="3.5" fill={stroke} opacity="0.6" />
    </svg>
  );
}

export default function DiagramViewer({ diagramType, alt, accentColor }) {
  const hasCloudinary = isCloudinaryConfigured();
  const [imageFailed, setImageFailed] = useState(false);
  const normalizedType = useMemo(() => {
    const allowed = new Set([
      "cell",
      "spread",
      "treatment",
      "scan",
      "blood",
      "device",
      "generic",
    ]);
    const key = String(diagramType || "generic").toLowerCase().trim();
    return allowed.has(key) ? key : "generic";
  }, [diagramType]);
  const imageUrl = getDiagramUrl(normalizedType);
  const useImage = hasCloudinary && !imageFailed;

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
      {useImage ? (
        <img
          src={imageUrl}
          alt={alt || "medical diagram"}
          className="h-40 w-full rounded-xl object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <InlineDiagram type={normalizedType} accentColor={accentColor} />
      )}
      <p className="mt-2 text-center text-xs text-gray-500">
        Diagram type: {normalizedType}
      </p>
    </div>
  );
}
