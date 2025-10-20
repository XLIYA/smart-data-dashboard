// ------------------------------
// src/lib/utils.ts
// ------------------------------
export const cn = (...cls: (string | undefined | false)[]) => cls.filter(Boolean).join(' ')
