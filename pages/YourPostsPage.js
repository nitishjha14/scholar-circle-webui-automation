class YourPostsPage {
    
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Your Posts' });
  }

  async gotoYourPosts() {
    await this.page.goto('/your-posts');
  }

  postCard(title) {
    return this.page.getByRole('link').filter({ hasText: title });
  }

  async openPost(title) {
    await this.postCard(title).click();
  }
}

export default YourPostsPage;