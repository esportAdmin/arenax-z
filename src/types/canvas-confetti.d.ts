// src/types/canvas-confetti.d.ts
declare module "canvas-confetti" {
  export type Options = Record<string, unknown>;
  export type GlobalOptions = Record<string, unknown>;
  export type CreateTypes = Record<string, unknown>;

  type ConfettiFn = (options?: Options) => Promise<null> | null;

  interface ConfettiModule extends ConfettiFn {
    create: (canvas: HTMLCanvasElement, options?: CreateTypes) => ConfettiFn;
    reset: () => void;
  }

  const confetti: ConfettiModule;
  export default confetti;
}
