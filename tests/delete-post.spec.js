import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import FeedPage from '../pages/FeedPage.js';
import PostDetailPage from '../pages/PostDetailPage.js';
import YourPostsPage from '../pages/YourPostsPage.js';
import { createPost, expectPostGone } from '../utils/postFlow.js';

test.describe('Delete post', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const feedPage = new FeedPage(page);

    await loginPage.gotoLogin();
    await loginPage.login(process.env.TEST_EMAIL, process.env.TEST_PASSWORD);
    await expect(feedPage.heading).toBeVisible();
  });

  // Path 1: delete straight from the post page shown right after Submit
  test('delete a post right after creating it', { tag: '@smoke' }, async ({ page }) => {
    const postDetailPage = new PostDetailPage(page);
    const feedPage = new FeedPage(page);

    const title = await createPost(page, 'Delete Test Article');

    await postDetailPage.deletePost();

    await expect(page).toHaveURL('/');
    await expect(feedPage.heading).toBeVisible();
    await expectPostGone(page, title);
  });

  // Path 2: open the post from Your Posts, then delete
  test('delete a post from the Your Posts page', { tag: '@smoke' }, async ({ page }) => {
    const yourPostsPage = new YourPostsPage(page);
    const postDetailPage = new PostDetailPage(page);
    const feedPage = new FeedPage(page);

    const title = await createPost(page, 'Delete Test Article');

    await yourPostsPage.gotoYourPosts();
    await expect(yourPostsPage.postCard(title)).toBeVisible();
    await yourPostsPage.openPost(title);

    await expect(page).toHaveURL(/\/post\/.+/, { timeout: 15000 });
    await expect(postDetailPage.articleTitle).toHaveText(title, { timeout: 15000 });
    await postDetailPage.deletePost();

    await expect(page).toHaveURL('/');
    await expect(feedPage.heading).toBeVisible();
    await expectPostGone(page, title);
  });
});