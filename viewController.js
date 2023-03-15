class ViewController {

    constructor() {
        setUpLocalStorage();
        this.userManager = new UserManager(setUpUserManagerData());
        // window.addEventListener("load", setUpLocalStorage);
    }
}

const viewController = new ViewController();