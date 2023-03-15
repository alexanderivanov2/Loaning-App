function generateRandomIncome() {
    const income = Math.ceil(Math.random() * 10000);

    return income;
}

function getLocalStorageValue(key) {
    return JSON.parse(localStorage.getItem(key));
}

function getUserType() {
    let isLoggedIn =  getLocalStorageValue("logged");

    if (!isLoggedIn) {
        return "guest";
    }
    
    const userType = isLoggedIn.isAdmin ? "admin" : "user";
    
    return userType;
}
