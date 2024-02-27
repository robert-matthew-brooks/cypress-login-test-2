class InventoryPage {
  elements = {
    menuBurgerBtn: () => cy.get('button[id="react-burger-menu-btn"]'),
    menuLogoutLink: () => cy.get('a[id="logout_sidebar_link"]'),
  };

  logout() {
    this.elements.menuBurgerBtn().click();
    this.elements.menuLogoutLink().click();
  }
}

export default new InventoryPage();
