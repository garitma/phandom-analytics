function generateRandomCode() {
  const length = 8;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  console.log(code);
  return code;
}

generateRandomCode()
