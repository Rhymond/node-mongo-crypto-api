const crypto = require("./crypto");

describe("Cryptographic", () => {
  it("should encode and decode given string", () => {
    const key = crypto.hash("1234");
    const text = "hello world!";

    const crypted = crypto.encrypt(key, text);
    const decrypted = crypto.decrypt(key, crypted);
    expect(decrypted).toEqual(text);
  });
});
