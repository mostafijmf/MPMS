async function waitPromise(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default waitPromise