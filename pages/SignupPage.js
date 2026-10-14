class SignupPage {
  constructor(page) {
    this.page = page;
    this.fullNameInput = page.getByLabel('Full Name');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });

  }

  async gotoSignup() {
    await this.page.goto('/signup');
  }

  async signup(fullName, email, password) {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.createAccountButton.click();
  }
}

export default SignupPage;