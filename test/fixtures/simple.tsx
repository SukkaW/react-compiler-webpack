export default function Example() {
  const value = [1, 2, 3, 4] as const;

  return (
    <div>
      {value.map(i => <p key={i}>{i}</p>)}
    </div>
  );
}

export const AnotherExmaple = () => {
  const value = [1, 2, 3, 4] as const;

  return (
    <div>
      {value.map(i => <p key={i}>{i}</p>)}
    </div>
  );
};
