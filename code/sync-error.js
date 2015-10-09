try {
  throw new Error('Fail!');
} catch (e) {
  console.log('Custom Error: ' + e.message);
}
