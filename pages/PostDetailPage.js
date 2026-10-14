class PostDetailPage {
  constructor(page) {
    this.page = page;
    this.articleTitle = page.locator('article h1');
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
  }

  async deletePost() {
    this.page.once('dialog', dialog => dialog.accept());
    await this.deleteButton.click();
  }
}

export default PostDetailPage;