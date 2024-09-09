"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mariadb_1 = __importDefault(require("mariadb"));
const cors_1 = __importDefault(require("cors"));
const pool = mariadb_1.default.createPool({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'todo',
    connectionLimit: 100000000
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// Route to get all the data from the database first
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "SELECT * from todocategory ORDER BY id";
    const connection = yield pool.getConnection();
    const result = yield connection.query(query);
    res.status(200).json(result);
}));
// Delete menu item
app.delete('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryid, value } = req.body;
    const query2 = 'DELETE FROM todocategory WHERE id = ?';
    const connection = yield pool.getConnection();
    if (value === 'menudelete') {
        const query1 = 'DELETE FROM todolist WHERE categoryid = ?';
        yield connection.query(query1, [categoryid]);
        yield connection.query(query2, [categoryid]);
    }
    else {
        const query1 = 'DELETE FROM todolist WHERE id = ?';
        yield connection.query(query1, [categoryid]);
    }
    res.json({ message: 'message deleted' });
}));
// Route for the menu table
app.post('/todocategory', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = req.body;
    if (!category || category.inputfield.trim() === '') {
        res.status(400).json({ message: 'item is empty' });
    }
    else {
        try {
            const query = "INSERT INTO todocategory (name) VALUE (?)";
            const connection = yield pool.getConnection();
            yield connection.query(query, [category.inputfield]);
            res.status(201).json({ message: category });
        }
        catch (error) {
            res.status(400).json({ message: 'item already exists' });
        }
    }
}));
app.get('/todolist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryid = req.query.categoryid;
    const query = "SELECT * from todolist where categoryid = ? ORDER BY id";
    const connection = yield pool.getConnection();
    const result = yield connection.query(query, [categoryid]);
    res.status(201).json(result);
}));
// Making the todo for the menu
app.post('/todolist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryid, item } = req.body;
    if (!item || item.trim() === '') {
        res.status(400).json({ message: 'item is empty' });
    }
    else {
        try {
            const query = "INSERT INTO todolist (categoryid, item) VALUE (?, ?)";
            const connection = yield pool.getConnection();
            yield connection.query(query, [categoryid, item]);
            res.status(201).json({ message: 'item added successfully' });
        }
        catch (error) {
            res.status(400).json({ message: error });
        }
    }
}));
app.listen(3000, () => {
    console.log("server is running");
});
