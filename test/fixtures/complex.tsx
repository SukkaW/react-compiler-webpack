import { useState, useRef, useCallback } from 'react';

export default function Sukka() {
  const [count, setCount] = useState(0);

  const singletonRef = useRef<AbortController | null>(null);

  if (!singletonRef.current) {
    singletonRef.current = new AbortController();
  }

  const handleButtonClick = useCallback(() => setCount(count => count + 1), []);

  if (count > 10) return null;

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleButtonClick}>Increment</button>

      {count > 10 && (
        <p>Count is higher than 10</p>
      )}
      <button disabled={count > 0} onClick={() => setCount(0)}>Reset Count</button>
    </div>
  );
}
