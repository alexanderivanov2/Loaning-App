class ViewController {

    constructor() {
        setUpLocalStorage();
        
        this.userManager = new UserManager(setUpUserManagerData());
        this.loanManger = new LoanManager(this.userManager, setUpLoanManagerData());
        this.timeSimulator = new TimeSimulator(this.userManager);
        
        this.loginController = new LoginController(this.userManager);
        this.registerController = new RegisterController(this.userManager);
        this.overviewController = new OverviewController(this.userManager, this.loanManger);
        this.loanController = new LoanController(this.userManager, this.loanManger, this.overviewController);

        window.addEventListener("load", this.timeSimulator.startTimeSimulator);
        window.addEventListener("load", this.handleHashChange);
        window.addEventListener("load", this.handleNavigation);
        window.addEventListener("hashchange", this.handleHashChange);
        window.addEventListener("hashchange", this.handleNavigation);
        
        this.logoutLink = document.querySelector("a.logout");
        this.logoutLink.addEventListener("click", this.handleLogout);
        this.guestNav = document.querySelector("navbar div.guest");
        this.loggedNav = document.querySelector("navbar div.logged");
        this.userNav = this.loggedNav.querySelector(".user");
        this.adminNav = this.loggedNav.querySelector(".admin");
    }

    handleHashChange = () => {
        const pages = ["login", "register", "loan", "overview", "statistics"];
        
        const defaultHash = {
            guest: "login",
            user: "loan",
            admin: "statistics",
        }

        const userTypeHash = {
            guest: ["login", "register"],
            user: ["loan", "overview", "logout"],
            admin: ["statistics", "logout"],
        }

        const userType = getUserType();
        
        let hash = location.hash.slice(1, ) || defaultHash[userType];

        if (userType === "guest" && !userTypeHash[userType].includes(hash)) {
            return
        }

        if (userType === "user" && !userTypeHash[userType].includes(hash)) {
            return
        }

        if (userType === "admin" && !userTypeHash[userType].includes(hash)) {
            return
        }

        pages.forEach(page => {
            const pageContent = document.querySelector(`.${page}`);
            if (page === hash) {
                pageContent.style.display = "block";
            } else {
                pageContent.style.display = "none";
            }
        });

        switch(hash) {
            case "login": 
                this.loginController.setUpLogin();
                break;
            case "register":
                this.registerController.setUpRegister();
                break;
            case "loan":
                this.loanController.setUpLoanPage();
                break;
            case "overview":
                this.overviewController.setUpOverviewPage();
                break;
            case "statistics":
                break;
        }
    }

    handleNavigation = () => {

        if (this.userManager.logged) {
            this.loggedNav.style.display = "flex";
            this.guestNav.style.display = "none";
            
            const userType = getUserType();

            if (userType === "admin") {
                this.adminNav.style.display = "flex";
                this.userNav.style.display = "none"
            } else {
                this.userNav.style.display = "flex";
                this.adminNav.style.display = "none";
            }

        } else {
            this.guestNav.style.display = "flex";            
            this.loggedNav.style.display = "none";
        }
    }

    handleLogout = (e) => {
        e.preventDefault();
        this.userManager.logout();

        location.hash = "login";
    }
}

const viewController = new ViewController();