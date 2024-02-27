import LoginPage from '../page-objects/LoginPage';
import InventoryPage from '../page-objects/InventoryPage';

describe('login page', () => {
  let credentials, routes, errors, constants;
  before(() => {
    cy.clock();
    cy.fixture('credentials').then((fixture) => (credentials = fixture));
    cy.fixture('routes').then((fixture) => (routes = fixture));
    cy.fixture('errors').then((fixture) => (errors = fixture));
    cy.fixture('constants').then((fixture) => (constants = fixture));
  });

  beforeEach(() => {
    cy.visit(routes.LOGIN);
  });

  it('should contain all essential form elements', () => {
    LoginPage.elements.loginForm().should('exist');
    LoginPage.elements.usernameInput().should('exist');
    LoginPage.elements.passwordInput().should('exist');
    LoginPage.elements.submitBtn().should('exist');
  });

  it('should not allow user to access restricted pages before login', () => {
    cy.visit(routes.INVENTORY, { failOnStatusCode: false });
    cy.url().should('not.eq', Cypress.config().baseUrl + routes.INVENTORY);
    LoginPage.confirmErrMsg(
      errors.NOT_LOGGED_IN.replace('$LOCATION', routes.INVENTORY)
    );
  });

  describe('successful login', () => {
    beforeEach(() => {
      cy.session('login', () => {
        cy.visit(routes.LOGIN);
        LoginPage.login(credentials.VALID_USERNAME, credentials.VALID_PASSWORD);

        // check redirect to inventory page
        cy.url().should('eq', Cypress.config().baseUrl + routes.INVENTORY);
      });
    });

    it('should allow user to access restricted pages after login', () => {
      /*
      disable fail on status code,
      typing url /inventory.html will *always* return 404 and redirect,
      even when logged in...
      */
      cy.visit(routes.INVENTORY, { failOnStatusCode: false });
      cy.url().should('eq', Cypress.config().baseUrl + routes.INVENTORY);
    });

    it('should create a session cookie', () => {
      cy.getCookie(constants.SESSION_USERNAME)
        .its('value')
        .should('eq', credentials.VALID_USERNAME);
    });

    describe('stay logged in', () => {
      afterEach(() => {
        cy.visit(routes.INVENTORY, { failOnStatusCode: false });
        cy.url().should('eq', Cypress.config().baseUrl + routes.INVENTORY);
      });

      it('should stay logged in if user clicks back', () => {
        cy.go('back');
      });

      it('should stay logged in if user enters a different url', () => {
        cy.visit(routes.LOGIN);
      });

      it('should stay logged in if user reloads browser', () => {
        cy.reload();
      });
    });
  });

  describe('failed login', () => {
    afterEach(() => {
      cy.url().should('eq', Cypress.config().baseUrl + routes.LOGIN);
      LoginPage.elements.errorTxt().parent().should('have.class', 'error');
      LoginPage.elements.usernameInput().should('have.class', 'error');
      LoginPage.elements.passwordInput().should('have.class', 'error');
    });

    it('should not log in with invalid username', () => {
      LoginPage.login('invalid_username', credentials.VALID_PASSWORD);
      LoginPage.confirmErrMsg(errors.INVALID_USERNAME);
    });

    it('should not log in with blank username', () => {
      LoginPage.typePassword(credentials.VALID_PASSWORD);
      LoginPage.clickSubmit();
      LoginPage.confirmErrMsg(errors.NO_USERNAME);
    });

    it('should not log in with invalid password', () => {
      LoginPage.login(credentials.VALID_USERNAME, 'invalid_password');
      LoginPage.confirmErrMsg(errors.INVALID_PASSWORD);
    });

    it('should not log in with blank password', () => {
      LoginPage.typeUsername(credentials.VALID_USERNAME);
      LoginPage.clickSubmit();
      LoginPage.confirmErrMsg(errors.NO_PASSWORD);
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      cy.session('logout', () => {
        cy.visit(routes.LOGIN);
        LoginPage.login(credentials.VALID_USERNAME, credentials.VALID_PASSWORD);
        InventoryPage.logout();
      });
    });

    it('should remove session cookie', () => {
      cy.getCookie(constants.SESSION_USERNAME).should('not.exist');
    });

    it('should not allow user to access restricted pages', () => {
      cy.visit(routes.INVENTORY, { failOnStatusCode: false });
      cy.url().should('not.eq', Cypress.config().baseUrl + routes.INVENTORY);
      LoginPage.confirmErrMsg(
        errors.NOT_LOGGED_IN.replace('$LOCATION', routes.INVENTORY)
      );
    });
  });

  describe('security', () => {
    it('should use password type input to hide chars on screen', () => {
      LoginPage.elements
        .passwordInput()
        .invoke('attr', 'type')
        .should('eq', 'password');
    });

    it.skip('should not send api requests with unencrypted passwords', () => {
      /*
      skip
      no api call is made by the client to intercept here,
      all user credentials are stored and checked client-side, in
      saucedemo.com/static/js/utils/Constants.js
      */
      cy.intercept('POST', '**/back/end/authentication/endpoint', ({ req }) => {
        const transmittedPassword = req.body.password_that_should_be_encrypted;
        expect(transmittedPassword).not.to.eq(credentials.VALID_PASSWORD);
      });
      LoginPage.login(credentials.VALID_USERNAME, credentials.VALID_PASSWORD);
    });

    it('should assign an expiry date to the session cookie', () => {
      LoginPage.login(credentials.VALID_USERNAME, credentials.VALID_PASSWORD);
      cy.getCookie(constants.SESSION_USERNAME).its('expiry').should('exist');
    });

    it.skip('should have timed out the session after 1 hour of inactivity', () => {
      /*
      skip
      the session doesn't time out
      */
      LoginPage.login(credentials.VALID_USERNAME, credentials.VALID_PASSWORD);
      cy.url().should('eq', Cypress.config().baseUrl + routes.INVENTORY);
      cy.tick(1 * 60 * 60 * 1000).wait(0);
      cy.url().should('not.eq', Cypress.config().baseUrl + routes.INVENTORY);
    });

    it.skip('should limit successive failed form submissions', () => {
      /*
      skip
      failed attempts don't lock user account
      to have same properties as "locked_out_user"
      */
      for (let i = 0; i < 20; i++) {
        LoginPage.elements.usernameInput().then((el) => el.val(i));
        LoginPage.elements.passwordInput().then((el) => el.val(i));
        LoginPage.elements.loginForm().submit();
      }
      LoginPage.confirmErrMsg(errors.LOCKED_OUT);
    });
  });

  describe('accessibility', () => {
    it('should have alt tags for images or hide them from screen readers', () => {
      LoginPage.login('invalid_username', 'invalid_password'); // get error svg images on DOM tree

      cy.get('img, svg').each((el) => {
        cy.wrap(el).shouldHaveAtLeastOneAttr(['alt', 'aria-hidden']);
      });
    });

    it.skip('should provide a <label> or aria-label for each input', () => {
      /*
      skip
      inputs do not not have accessibility labels, only placeholders
      */
      LoginPage.elements
        .usernameInput()
        .shouldHaveAtLeastOneAttr(['for', 'aria-label']);
      LoginPage.elements
        .passwordInput()
        .shouldHaveAtLeastOneAttr(['for', 'aria-label']);
    });

    describe('keyboard input', () => {
      it('should allow user to tab between form elements', () => {
        LoginPage.elements.usernameInput().focus().tab();
        LoginPage.elements.passwordInput().should('have.focus');
        LoginPage.elements.passwordInput().focus().tab();
        LoginPage.elements.submitBtn().should('have.focus');
      });

      it('should allow user to use {enter} key to submit login form', () => {
        LoginPage.typeUsername(credentials.VALID_USERNAME);
        LoginPage.typePassword(`${credentials.VALID_PASSWORD}{enter}`);
        cy.url().should('eq', Cypress.config().baseUrl + routes.INVENTORY);
      });
    });
  });
});
