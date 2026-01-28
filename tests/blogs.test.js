const TestingPage = require("./utils/login");
let page;

beforeEach(async () => {
  page = await TestingPage.buildPage();
  await page.login();
});

afterEach(async () => {
  await page.close();
});

//TODO: describe for not adding inputs and click submit to test error message.

describe("When logged in", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3000/blogs", {
      waitUntil: "networkidle0",
    });
    await page.click(".fixed-action-btn a");
    const now = Date.now();
    await page.type(".title input", `Blog ${now}`);
    await page.type(
      ".content input",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum\.",
    );
    await page.click('button[type="submit"]');
  });

  test("After click Submit user is navigated to review page", async () => {
    const reviewLabel = await page.$eval("h5", (el) => el.textContent);
    expect(reviewLabel).toBe("Please confirm your entries");
  });

  test("Post is successfully created and redirected to blogs page", async () => {
    await page.click("button.green.btn-flat.right.white-text");
    const url = await page.url();

    expect(url).toMatch("http://localhost:3000/blogs");
  });
});

// TODO: add test to call apis without logging in.
