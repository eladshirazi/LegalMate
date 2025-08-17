declare module "pdf-text-extract" {
    function extract(
      path: string,
      callback: (err: Error | null, pages: string[]) => void
    ): void;
  
    export = extract;
  }