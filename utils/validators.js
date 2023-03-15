function validateInputAllFilled(data=[]) {
    return data.every(el => el.trim() !== "");
}