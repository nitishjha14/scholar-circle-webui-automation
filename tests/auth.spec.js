import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import FeedPage from '../pages/FeedPage.js';
import Header from '../components/Header.js';
import { MESSAGES } from '../test-data/messages.js';
import SignupPage from '../pages/SignupPage.js';
import LandingPage from '../pages/LandingPage.js';

test.describe('Auth: login', () => {

  test('login with valid credentials', { tag: '@smoke' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const feedPage = new FeedPage(page);
    const header = new Header(page);

    await loginPage.gotoLogin();
    await loginPage.login(process.env.TEST_EMAIL, process.env.TEST_PASSWORD);

    await expect(page).toHaveURL('/');
    await expect(feedPage.heading).toBeVisible();
    await expect(header.logoutButton).toBeVisible();
    await expect(header.loginLink).toBeHidden();
    await expect(header.signupLink).toBeHidden();
  });

  test('login with wrong password shows the error', { tag: '@smoke' }, async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.gotoLogin();
    await loginPage.login(process.env.TEST_EMAIL, 'WrongPass123')

    await expect(loginPage.errorMessage(MESSAGES.invalidCredentials)).toBeVisible();
    await expect(page).toHaveURL('/login');
});
  
  test('login with unregistered email shows the error', { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
  
    await loginPage.gotoLogin();
    await loginPage.login(`example@example.com`, 'SomePass123');
  
    await expect(loginPage.errorMessage(MESSAGES.invalidCredentials)).toBeVisible();
    await expect(page).toHaveURL('/login');
});


});


test.describe('Auth: signup', () => {
  test('signup with valid data logs the user in', { tag: '@smoke' }, async ({ page }) => {
    const signupPage = new SignupPage(page);
    const feedPage = new FeedPage(page);
    const header = new Header(page);
    const email = `qa.${Date.now()}@example.com`;

    await signupPage.gotoSignup();
    await signupPage.signup('QA User', email, 'Signup@123');

    await expect(page).toHaveURL('/');
    await expect(feedPage.heading).toBeVisible();
    await expect(header.logoutButton).toBeVisible();
  });
});


test.describe('Auth: route protection', () => {

  test('guest opening /add-post is redirected to login', { tag: '@smoke' }, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/add-post');

    await expect(page).toHaveURL('/login', { timeout: 15000 });
    await expect(loginPage.signInButton).toBeVisible();
  });

  test('guest opening /your-posts is redirected to login', { tag: '@smoke' }, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/your-posts');

    await expect(page).toHaveURL('/login', { timeout: 15000 });
    await expect(loginPage.signInButton).toBeVisible();
  });

});


test.describe('Auth: logged-in user', () => {

  test('session persists after refresh', { tag: '@smoke' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const feedPage = new FeedPage(page);
    const header = new Header(page);

    await loginPage.gotoLogin();
    await loginPage.login(process.env.TEST_EMAIL, process.env.TEST_PASSWORD);
    await expect(feedPage.heading).toBeVisible();

    await page.reload();

    await expect(feedPage.heading).toBeVisible();
    await expect(header.logoutButton).toBeVisible();
  });

  test('logout switches the header to guest nav', { tag: '@smoke' }, async ({ page }) => {
     const loginPage = new LoginPage(page);
     const header = new Header(page);
     const landingPage = new LandingPage(page)
     const feedPage = new FeedPage(page);

     await loginPage.gotoLogin();
     await loginPage.login(process.env.LOGOUT_EMAIL, process.env.LOGOUT_PASSWORD);
     await expect(feedPage.heading).toBeVisible();

     await header.logout()

     await expect(header.loginLink).toBeVisible();
     await expect(header.signupLink).toBeVisible();
     await expect(header.logoutButton).toBeHidden()

     await page.reload();

     await expect(landingPage.heading).toBeVisible();
  });
});