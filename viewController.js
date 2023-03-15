class ViewController {

   

    constructor() {
        setUpLocalStorage();
        // window.addEventListener("load", setUpLocalStorage);
        this.userManager = new UserManager(setUpUserManagerData());
    }
}

const viewController = new ViewController();