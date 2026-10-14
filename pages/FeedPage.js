class FeedPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('.responsive-heading', { hasText: 'Community Feed' });
    this.firstPost = page.locator('a > div > img').first();
    this.firstCardTitle = page.locator('a > div > h3').first();
  }

  async getFirstArticleTitle() {
    return (await this.firstCardTitle.textContent()).trim();
  }

  async openFirstArticle() {
    await this.firstPost.click();
  }
}

export default FeedPage;