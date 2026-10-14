import {test, expect} from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import FeedPage from "../pages/FeedPage";
import PostDetailPage from "../pages/PostDetailPage";

test.describe("Test cases for validating articles on feed", () => {
    test.beforeEach( async({page}) => {

        const loginPage = new LoginPage(page);
        const feedPage = new FeedPage(page);

        await loginPage.gotoLogin();
        await loginPage.login(process.env.TEST_EMAIL, process.env.TEST_PASSWORD);
        await expect(feedPage.heading).toBeVisible();

    });

    test("Validating the first article on Community Feed Page", async({page}) => {
        const feedPage = new FeedPage(page);
        const postDetailsPage = new PostDetailPage(page);

        const feedTitle = await feedPage.getFirstArticleTitle();
        await feedPage.openFirstArticle();
        await expect(postDetailsPage.articleTitle).toHaveText(feedTitle);

    })

});