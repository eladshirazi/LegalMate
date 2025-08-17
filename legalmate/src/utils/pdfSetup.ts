/* eslint-disable @typescript-eslint/no-explicit-any */
// Prevent pdfjs from requiring 'canvas' when we're only extracting text
(globalThis as any).DOMMatrix = class {};