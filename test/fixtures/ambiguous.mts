// `<T>` without a trailing comma is reserved in .mts, so this must not parse
export const identity = <T>(value: T): T => value;
