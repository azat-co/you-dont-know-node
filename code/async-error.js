try {
  setTimeout(function () {
      throw new Error("Fail!");
  }, Math.round(Math.random()*100));
} catch (e) {
  console.log('Custom Error: ' + e.message);
}
