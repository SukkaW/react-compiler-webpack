export default function Example() {
  const value = [1, 2, 3, 4];

  return (
    <div>
      {value.map(i => <p key={i}>{i}</p>)}
    </div>
  );
}
