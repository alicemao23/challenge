 module.exports = class Todo {
    constructor(title='', id) {
        this.title = title;
        //Added completed field for filtering and deletion function
        this.completed = false;
        this.id = id; 
    }
}
