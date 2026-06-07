import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function openPdf(pdfUrl: string) {
  if (!pdfUrl) return;
  if (pdfUrl.startsWith('data:')) {
    try {
      const parts = pdfUrl.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
      const b64Data = parts[1];
      const sliceSize = 512;
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; byteCharacters.length > offset; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; slice.length > i; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch (err) {
      console.error('Error opening base64 PDF:', err);
      // fallback download trigger to make sure the user gets their file
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'portfolio.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } else {
    window.open(pdfUrl, '_blank');
  }
}
