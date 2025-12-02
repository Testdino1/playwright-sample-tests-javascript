import LoginPage from "./LoginPage";
import InventoryPage from "./InventoryPage";
import SignupPage from "./SignupPage";
import HomePage from "./HomePage";
import AllProductsPage from "./AllProductsPage";
import ProductDetailsPage from "./ProductDetailsPage";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckoutPage";
import OrderPage from "./OrderPage"; // Import OrderPage
import UserPage from "./UserPage"; // Import UserPage
import OrderDetailsPage from "./OrderDetailsPage";
import ContactUsPage from "./ContactUsPage";

class AllPages {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.inventoryPage = new InventoryPage(page);
        this.signupPage = new SignupPage(page);
        this.homePage = new HomePage(page);
        this.allProductsPage = new AllProductsPage(page);
        this.productDetailsPage = new ProductDetailsPage(page);
        this.cartPage = new CartPage(page);
        this.checkoutPage = new CheckoutPage(page);
        this.orderPage = new OrderPage(page); // Instantiate OrderPage
        this.userPage = new UserPage(page); // Instantiate UserPage
        this.orderDetailsPage = new OrderDetailsPage(page);
        this.contactUsPage = new ContactUsPage(page); 

    }
}

export default AllPages;