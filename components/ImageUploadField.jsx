"use client";

import { useRef, useState } from "react";

const maxFileSize = 1024 * 1024;

export default function ImageUploadField({ label, value, onChange, previewClassName = "mt-3 h-36 w-full rounded-md object-cover", hint = "PNG, JPG, WEBP under 1MB" }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      return;
    }

    if (file.size > maxFileSize) {
      setError("Image must be under 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setError("");
      onChange(reader.result);
    };
    reader.onerror = () => setError("Could not read this image.");
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFile} />
      <button
        type="button"
        className="flex w-full flex-col items-center justify-center rounded-md border-2 border-dashed border-indigo-200 bg-slate-50 px-4 py-6 text-center text-sm font-bold text-[#6366F1] transition hover:border-[#6366F1] hover:bg-indigo-50"
        onClick={() => inputRef.current?.click()}
      >
        <span>{value ? "Change image" : "Click to upload image"}</span>
        <span className="mt-2 text-xs font-medium text-slate-500">{hint}</span>
      </button>
      {error ? <p className="mt-2 text-sm font-semibold text-rose-600">{error}</p> : null}
      {value ? (
        <div>
          <img src={value} alt={`${label} preview`} className={previewClassName} />
          <button type="button" className="mt-2 text-xs font-bold text-rose-600" onClick={() => onChange("")}>
            Remove image
          </button>
        </div>
      ) : null}
    </div>
  );
}
