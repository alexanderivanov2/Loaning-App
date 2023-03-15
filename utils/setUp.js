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

function setUpLocalStorage() {
    const keys = ["users", "admins", "logged"];

    keys.forEach(key => {
        let value = localStorage.getItem(key);
        value = value || JSON.parse(value);
        console.log(value);
        if (key !== "logged" && !value) {
            localStorage.setItem(key, JSON.stringify([]));
            console.log("hi");
        }

        if (key === "logged" && !value) {
            localStorage.setItem(key, null);
        }
    })
}