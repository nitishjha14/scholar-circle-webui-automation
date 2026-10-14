import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import FeedPage from '../pages/FeedPage.js';
import AddPostPage from '../pages/AddPostPage.js';
import PostDetailPage from '../pages/PostDetailPage.js';
import { uniqueTitle } from '../utils/helpers.js';


const POST_TITLE = 'How AI Is Changing the Way We Program';

const POST_CONTENT = [
  'Artificial intelligence is reshaping programming faster than any tool in recent memory. Code assistants now suggest whole functions, explain unfamiliar errors, and generate tests in seconds. Tasks that once took an afternoon, such as writing boilerplate or converting data formats, now take minutes.',
  'The biggest change is where developers spend their time. Typing code is becoming less important, while understanding problems, designing systems, and reviewing results matters more. AI can produce working code, but it can also produce confident mistakes, so developers must read, test, and question what it gives them.',
  'Learning has changed too. Beginners can ask for explanations at any hour and see examples tailored to their own code. The risk is leaning on answers without building real understanding. Strong fundamentals, such as logic, data structures, and debugging, are what let a programmer tell good output from bad.',
  'Testing and quality assurance are changing as well. AI helps write test cases, find edge cases, and summarize failures, yet human judgment still decides what is worth testing.',
  'AI will not replace programmers who think clearly. It rewards those who combine curiosity, careful review, and strong basics, turning the tool into a skilled assistant instead of a shortcut.',
].join(' ');

test.describe('Create post', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const feedPage = new FeedPage(page);

    await loginPage.gotoLogin();
    await loginPage.login(process.env.TEST_EMAIL, process.env.TEST_PASSWORD);
    await expect(feedPage.heading).toBeVisible();
  });

  test('post one article', { tag: '@smoke' }, async ({ page }) => {
    const addPostPage = new AddPostPage(page);
    const postDetailPage = new PostDetailPage(page);

    const title = uniqueTitle('How AI Is Changing the Way We Program');

    await addPostPage.gotoAddPost();
    await addPostPage.createPost({
      title,
      content: POST_CONTENT,
      imagePath: 'test-data/images.jpg',
    });

    await expect(page).toHaveURL(/\/post\/.+/, { timeout: 15000 });
    await expect(postDetailPage.articleTitle).toContainText(POST_TITLE);
    await expect(page.getByText('Artificial intelligence is reshaping programming')).toBeVisible();
  });
});