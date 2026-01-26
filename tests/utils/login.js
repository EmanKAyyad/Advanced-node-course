const puppeteer = require("puppeteer");
const userFactory = require("../factories/user.factory");
const sessionFactory = require("../factories/session.factory");

class TestingPage {
  static async buildPage() {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    const testPage = new TestingPage();

    const testingPage = new Proxy(testPage, {
      get: function (target, property) {
        return target[property] || browser[property] || page[property];
      },
    });

    return testingPage;
  }
  async login() {
    const user = await userFactory();
    console.log(user);
    const { session, sig } = sessionFactory(user._id.toString());

    await this.setCookie({
      name: "session",
      value: session,
      url: "http://localhost:3000",
    });
    await this.setCookie({
      name: "session.sig",
      value: sig,
      url: "http://localhost:3000",
    });
    await this.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    await this.waitForSelector("ul.right li:last-of-type a");
    console.log("done");
  }
}

module.exports = TestingPage;
