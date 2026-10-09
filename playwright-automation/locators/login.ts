const login = {
    loginButton: '[data-qa="login-button"]',
    emailidInput: '[data-qa="login-email"]',
    passwordInput: '[data-qa="login-password"]',
    pageTitle: '.login-form h2',
    searchBox: '#search',
    logoutButton: '[href="/logout"]',
    loginLink: '[href="/login"]',
    loggedInAs: '.navbar-nav',
  } as const;

export default login;
