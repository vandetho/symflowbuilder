let _idCounter = 0;

export function uid(prefix: string = "id"): string {
    return `${prefix}-${Date.now()}-${++_idCounter}`;
}

export function uniqueName(base: string, existing: string[]): string {
    if (!existing.includes(base)) return base;
    let i = 1;
    while (existing.includes(`${base}_${i}`)) i++;
    return `${base}_${i}`;
}
