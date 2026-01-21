const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const Buffer = require("safe-buffer").Buffer;
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (id) => {
  const sessionString = Buffer.from(
    JSON.stringify({
      passport: {
        user: id,
      },
    })
  ).toString("base64");

  const sig = keygrip.sign("session=" + sessionString);
  return {
    session: sessionString,
    sig,
  };
};
