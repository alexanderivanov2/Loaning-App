class TimeSimulator {
    constructor(userManager) {
        this.userManager = userManager;
        this.simulatorId = null;
    }

    startTimeSimulator = () => {
        clearInterval(this.simulatorId);
        this.simulatorId = setInterval(this.simulateOneMonth, 30000);
    }

    simulateOneMonth = () => {
        console.log("new month => " + new Date().toLocaleTimeString());

        this.userManager.users.forEach(user => {
            user.ownedMoney += user.monthlyIncome;
        });

        const localStorageData = {
            "users": this.userManager.users,
        }

        if (this.userManager.logged) {
            localStorageData.logged = this.userManager.setReferenceUser(this.userManager.logged);
        }
        
        saveInLocalStorage(localStorageData);
    }
}