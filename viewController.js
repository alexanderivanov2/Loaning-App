class ViewController {

    constructor() {
        setUpLocalStorage();
        this.userManager = new UserManager(setUpUserManagerData());
        window.addEventListener("load", this.handleHashChange);
        window.addEventListener("hashchange", this.handleHashChange);
    }

    handleHashChange = () => {
        const pages = ["login", "register", "loan", "statistics"]
        
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

        console.log(hash);
    }
}

const viewController = new ViewController();