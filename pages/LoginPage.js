class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Enter your email');
    this.passwordInput = page.getByPlaceholder('Enter your password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
  }

async gotoLogin() {
  await this.page.goto('/login', {
    waitUntil: 'domcontentloaded',
  });

  await this.emailInput.waitFor({
    state: 'visible',
    timeout: 60000,
  });
}

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  errorMessage(text) {
    return this.page.getByText(text);
  }
}

export default LoginPage;