class IdGenerator {
    constructor(id = 1) {
        this.id = id;
    }

    getId() {
        const id = this.id++
        localStorage.setItem("freeId", this.id);
        return id
    }
}