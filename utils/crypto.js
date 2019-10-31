const crypto = require("crypto");

// vector
module.exports.encrypt = (key, text) => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    process.env.ENCRYPTION_VECTOR
  );
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
};

module.exports.decrypt = (key, text) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    process.env.ENCRYPTION_VECTOR
  );
  let dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
};

module.exports.hash = key =>
  crypto
    .createHash("sha256")
    .update(key)
    .digest("hex");
