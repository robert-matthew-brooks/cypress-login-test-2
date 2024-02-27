class LoginPage {
  elements = {
    loginForm: () => cy.get('form'),
    usernameInput: () => cy.getByTestId('username'),
    passwordInput: () => cy.getByTestId('password'),
    submitBtn: () => cy.getByTestId('login-button'),
    errorTxt: () => cy.getByTestId('error'),
  };

  typeUsername(username) {
    this.elements.usernameInput().clear().type(username);
  }

  typePassword(password) {
    this.elements.passwordInput().clear().type(password);
  }

  clickSubmit() {
    this.elements.submitBtn().click();
  }

  login(username, password) {
    this.typeUsername(username);
    this.typePassword(password);
    this.clickSubmit();
  }

  confirmErrMsg(msg) {
    cy.fixture('constants').then((constants) => {
      this.elements
        .errorTxt()
        .parent()
        .should('have.class', constants.ERROR_CLASS);
    });
    this.elements.errorTxt().should('contain.text', msg);
  }
}

export default new LoginPage();
