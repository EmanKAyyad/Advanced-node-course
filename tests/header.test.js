const puppeteer = require("puppeteer");
const buildPage = require("./utils/login");
let browser, page;

beforeEach(async () => {
  // browser = await puppeteer.launch({
  //   headless: false,
  // });
  // page = await browser.newPage();
  // await page.goto("localhost:3000");
});

afterEach(() => {
  // browser.close();
});

test("Login using OAuth", async () => {
  await page.click(".right a");
  const url = await page.url();

  expect(url).toMatch("/accounts.google.com/");
});

test.only("Logout button exists after user is logged in", async () => {
  const loginPage = await buildPage();
  await loginPage.login();
  const button = await loginPage.$eval(
    "ul.right li:last-of-type a",
    (el) => el.textContent
  );
  expect(button).toBe("Logout");
});
