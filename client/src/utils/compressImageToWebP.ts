export type CompressImageToWebPOptions = {
  /** Max width in CSS pixels after resize (keeps aspect ratio). Default 1920. */
  maxWidth?: number;
  /** Max height in CSS pixels after resize. Default 1920. */
  maxHeight?: number;
  /** WebP quality 0–1. Default 0.82. */
  quality?: number;
};

const DEFAULT_MAX = 1920;
const DEFAULT_QUALITY = 0.82;

/**
 * Raster images → WebP + downscale. SVG unchanged (avoid rasterizing vectors).
 * If WebP encode fails (e.g. toBlob null) or decode fails, returns the original file.
 */
export async function compressImageToWebP(
  file: File,
  options: CompressImageToWebPOptions = {},
): Promise<File> {
  const maxWidth = options.maxWidth ?? DEFAULT_MAX;
  const maxHeight = options.maxHeight ?? DEFAULT_MAX;
  const quality = options.quality ?? DEFAULT_QUALITY;

  if (!file.type.startsWith("image/")) {
    return file;
  }
  if (file.type === "image/svg+xml") {
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    const { width, height } = bitmap;
    if (width < 1 || height < 1) {
      return file;
    }

    const scale = Math.min(1, maxWidth / width, maxHeight / height);
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/webp", quality);
    });

    if (!blob) {
      return file;
    }

    const base = file.name.replace(/\.[^.]+$/i, "") || "image";
    return new File([blob], `${base}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close();
  }
}
