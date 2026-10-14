class LandingPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('.responsive-heading', { hasText: 'Share Your Learnings' });
  }
}

export default LandingPage;