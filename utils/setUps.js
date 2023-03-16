function setUpUserManagerData() {
    const keys = ["users", "admins", "logged"];
    const data = {};

    keys.forEach(key => {
        let value = localStorage.getItem(key);
        value = JSON.parse(value);

        data[key] = value;
    });

    return data;
}

function setUpLoanManagerData() {
    const keys = ["loans", "lenders"];
    const data = {};

    keys.forEach(key => {
        let value = localStorage.getItem(key);
        value = JSON.parse(value);

        data[key] = value;
    });

    return data;
}

function setUpLocalStorage() {
    const keys = ["users", "admins", "logged", "lenders", "loans"];

    keys.forEach(key => {
        let value = localStorage.getItem(key);
        value = value || JSON.parse(value);

        if (key !== "logged" && !value) {
            let value = []
            switch(key) {
                case "admins":
                    value.push(new Admin("admin", "admin123"))
                    break;
                case "users":
                    value.push(new User("test", "123456"), new User("test2", "123456"));
                    break;
                case "lenders":
                    value.push(
                        new Lender("Lender 1", 7, 50000),
                        new Lender("Lender 2", 9, 100000),
                        new Lender("Lender 3", 11, 150000),
                    )
                    break;
            } 

                localStorage.setItem(key, JSON.stringify(value));
        }

        if (key === "logged" && !value) {
            localStorage.setItem(key, null);
        }
    })
}