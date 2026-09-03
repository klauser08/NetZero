const test = require("node:test");
const assert = require("node:assert/strict");
const { hashPassword, verifyPassword } = require("../services/passwordService");

test("hashPassword does not store the plaintext password", async () => {
    const password = "placement-ready-password";
    const passwordHash = await hashPassword(password);

    assert.notEqual(passwordHash, password);
    assert.match(passwordHash, /^\$2[aby]\$/);
});

test("verifyPassword accepts the correct password", async () => {
    const passwordHash = await hashPassword("correct-password");

    assert.equal(await verifyPassword("correct-password", passwordHash), true);
    assert.equal(await verifyPassword("wrong-password", passwordHash), false);
});
