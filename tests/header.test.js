const puppeteer = require("puppeteer");
const TestingPage = require("./utils/login");
let page;

beforeEach(async () => {
  page = await TestingPage.buildPage();
  await page.login();
});

afterEach(async () => {
  await page.close();
});

test("Login using OAuth", async () => {
  await page.click(".right a");
  const url = await page.url();

  expect(url).toMatch("/accounts.google.com/");
});

test.only("Logout button exists after user is logged in", async () => {
  const button = await page.$eval(
    "ul.right li:last-of-type a",
    (el) => el.textContent,
  );
  expect(button).toBe("Logout");
});
