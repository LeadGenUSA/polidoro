import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

/**
 * Renders each page of a PDF to a JPEG image and returns the base64 payloads
 * (no data URL prefix), ready to be sent as inline email images.
 */
export async function pdfToImages(
  file: File,
  opts: { maxWidth?: number; quality?: number } = {}
): Promise<string[]> {
  const maxWidth = opts.maxWidth ?? 900;
  const quality = opts.quality ?? 0.72;

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const images: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const base = page.getViewport({ scale: 1 });
    const scale = Math.min(maxWidth / base.width, 2);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const context = canvas.getContext('2d');
    if (!context) continue;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvas, canvasContext: context, viewport }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    images.push(dataUrl.split(',')[1]);
  }

  await pdf.cleanup();
  return images;
}

export const fileToBase64 = async (file: File): Promise<string> => {
  const buffer = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < buffer.length; i += chunk) {
    binary += String.fromCharCode(...buffer.subarray(i, i + chunk));
  }
  return btoa(binary);
};
