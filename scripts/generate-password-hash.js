const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.log("Usage: node scripts/generate-password-hash.js <your-password>");
  process.exit(1);
}

try {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  console.log("\n==================================================");
  console.log("Your plaintext password:", password);
  console.log("Your hashed password (ADMIN_PASSWORD):");
  console.log(hash);
  console.log("==================================================\n");
} catch (err) {
  console.error("Error generating hash:", err);
}
