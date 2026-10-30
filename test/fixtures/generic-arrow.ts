// a .ts file needs no trailing comma in `<T,>`
import { useState } from 'react';

export const identity = <T>(value: T): T => value;

export function useDoubled(input: readonly number[]) {
  const [factor] = useState(2);
  const numbers = identity(input);

  return numbers.map((i) => i * factor);
}
