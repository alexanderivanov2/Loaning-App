// CALCULATIONS

function generateRandomIncome() {
    const income = Math.ceil(Math.random() * 10000);

    return income;
}


// LOCAL STORAGE

function getLocalStorageValue(key) {
    return JSON.parse(localStorage.getItem(key));
}

function saveInLocalStorage(data={}) {

    Object
        .entries(data)
        .forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value))
        })
}

function getUserType() {
    let isLoggedIn = getLocalStorageValue("logged");

    if (!isLoggedIn) {
        return "guest";
    }
    
    const userType = isLoggedIn.isAdmin ? "admin" : "user";
    
    return userType;
}

function getLoginFormValuesInArray(data={}) {
    const {username, password} = data;

    return [username, password]
}

function formatLoanFormData(formData) {
    formData.borrowerIncome = Number(formData.borrowerIncome);
    formData.requestedAmount = Number(formData.requestedAmount);
    formData.requestedTerm = parseInt(formData.requestedTerm);
}

// CREATE

function createElement(tagName, attributes = {}) {
    const el = document.createElement(tagName);

    Object.entries(attributes).forEach(([key, value]) => {
        el[key] = value;
    });

    return el;
}