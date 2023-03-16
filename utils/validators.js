function validateInputAllFilled(data=[]) {
    return data.every(el => el.trim() !== "");
}

function numberValidation(value) {
    const isNaNTest = isNaN(value);
    const isNumber = typeof value === "number";

    return !(isNaNTest || !isNumber);
}

function validateSubmitLoanForm(formData) {
    const {username, borrowerIncome, requestedAmount, requestedTerm} = formData;
    
    const validateErrors = [];
    
    if (!username) {
        validateErrors.push("Invalid username");
    }

    if (!numberValidation(borrowerIncome) || borrowerIncome < 0 ) {
        validateErrors.push("Invalid income");
    } 

    if (!numberValidation(requestedAmount) || requestedAmount < 1000) {
        validateErrors.push("Invalid requested amount");
    }

    if (!numberValidation(requestedTerm) || requestedTerm < 6) {
        validateErrors.push("Invalid requested term");
    }

    const validateResult = {
        isValidForm: !validateErrors.length,
        errors: validateErrors,
    }

    return validateResult;
}