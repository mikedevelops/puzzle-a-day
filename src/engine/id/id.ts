export function createId(): () => number {
  let id = 0;
  return () => {
    return id++;
  };
}
