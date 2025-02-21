export function areAddressListsEqual(
  list1: string[],
  list2: string[]
): boolean {
  if (list1.length !== list2.length) return false;

  const normalizedList1 = [...list1].map((addr) => addr.toLowerCase()).sort();
  const normalizedList2 = [...list2].map((addr) => addr.toLowerCase()).sort();

  return normalizedList1.every(
    (addr, index) => addr === normalizedList2[index]
  );
}
