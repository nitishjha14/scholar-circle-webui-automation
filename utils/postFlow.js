import { expect } from '@playwright/test';
import AddPostPage from '../pages/AddPostPage.js';
import PostDetailPage from '../pages/PostDetailPage.js';
import YourPostsPage from '../pages/YourPostsPage.js';
import { uniqueTitle } from './helpers.js';

const DEFAULT_CONTENT =
  'This article is created by an automated test and will be deleted.';

// Setup: creates a post with a unique title and confirms it exists.
// Ends on the post detail page. Returns the generated title.
export async function createPost(page, baseTitle = 'Automation Test Article') {
  const addPostPage = new AddPostPage(page);
  const postDetailPage = new PostDetailPage(page);
  const title = uniqueTitle(baseTitle);

  await addPostPage.gotoAddPost();
  await addPostPage.createPost({
    title,
    content: DEFAULT_CONTENT,
    imagePath: 'test-data/images.jpg',
  });

  await expect(page).toHaveURL(/\/post\/.+/, { timeout: 15000 });
  await expect(postDetailPage.articleTitle).toHaveText(title);
  return title;
}

// Check: the post with this title is no longer listed in Your Posts.
export async function expectPostGone(page, title) {
  const yourPostsPage = new YourPostsPage(page);

  await yourPostsPage.gotoYourPosts();
  await expect(yourPostsPage.heading).toBeVisible(); // wait for the page, else count 0 passes too early
  await expect(yourPostsPage.postCard(title)).toHaveCount(0);
}