"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/shared/components/ui/spinner";

type ImageUploadProps = {
  value?: File | null;
  onChange: (file: File | null) => void;
};

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) return;

    setLoading(true);
    onChange(file);

    const url = URL.createObjectURL(file);

    setTimeout(() => {
      setPreview(url);
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Imagen
      </label>

      <div
        className="rounded border border-dashed px-4 py-6 text-center text-sm text-gray-600 hover:border-gray-400 cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
      >
        {!preview && !loading && (
          <>
            <p className="mb-2">
              Arrastra y suelta una imagen o haz clic para seleccionar
            </p>
            <label
              htmlFor="image-upload-input"
              className="underline cursor-pointer"
            >
              Seleccionar archivo
            </label>
          </>
        )}

        {loading && (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        )}

        {preview && !loading && (
          <div className="flex flex-col items-center gap-2">
            <img
              src={preview}
              alt="Previsualización"
              className="max-h-48 rounded-md object-contain"
            />
            <p className="text-xs text-gray-700">
              {value?.name}
            </p>
          </div>
        )}

        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
