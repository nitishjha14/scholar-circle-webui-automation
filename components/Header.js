class Header {
  constructor(page) {
    this.page = page;
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.signupLink = page.getByRole('link', { name: 'Signup' });
  }

  async logout() {
    await this.logoutButton.click();
  }
}

export default Header;