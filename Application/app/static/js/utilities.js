function minus(arrA, arrB) {
  // returns arrA - arrB
  return arrA.filter((x) => !arrB.includes(x));
}
