class AddPostPage {
  constructor(page) {
    this.page = page;
    this.titleInput = page.getByPlaceholder('Enter your blog title...');
    this.slugInput = page.getByPlaceholder('url-friendly-slug');
    this.editorFrame = page.frameLocator('iframe.tox-edit-area__iframe');
    this.editorBody = this.editorFrame.locator('body#tinymce');
    this.imageInput = page.locator('input[type="file"]');
    this.statusSelect = page.locator('select');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async gotoAddPost() {
    await this.page.goto('/add-post');
  }

  async fillTitle(title) {
    await this.titleInput.fill(title);
  }

  async fillContent(text) {
  await this.editorBody.click();
  await this.editorBody.pressSequentially(text);
}

  async uploadImage(filePath) {
    await this.imageInput.setInputFiles(filePath);
  }

  async selectStatus(status) {
    await this.statusSelect.selectOption(status);
  }

  async submit() {
    await this.submitButton.click();
  }

  async createPost({ title, content, imagePath, status }) {
    await this.fillTitle(title);
    await this.fillContent(content);
    if (imagePath) await this.uploadImage(imagePath);
    if (status) await this.selectStatus(status);
    await this.submit();
}
}

export default AddPostPage;