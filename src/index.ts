import express, { Request, Response } from "express";
import mariadb, { PoolConnection } from "mariadb";
import cors from 'cors';

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'todo',
    connectionLimit: 100000000
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Route to get all the data from the database first
app.get('/', async (req: Request, res: Response) => {
    const query = "SELECT * from todocategory ORDER BY id";
    const connection: PoolConnection = await pool.getConnection();
    const result = await connection.query(query);
    res.status(200).json(result);
});

// Delete menu item
app.delete('/delete', async (req: Request, res: Response) => {
    const { categoryid, value } = req.body;
    const query2 = 'DELETE FROM todocategory WHERE id = ?';
    const connection: PoolConnection = await pool.getConnection();
    if (value === 'menudelete') {
        const query1 = 'DELETE FROM todolist WHERE categoryid = ?';
        await connection.query(query1, [categoryid]);
        await connection.query(query2, [categoryid]);
    } else {
        const query1 = 'DELETE FROM todolist WHERE id = ?';
        await connection.query(query1, [categoryid]);
    }
    res.json({ message: 'message deleted' });
});

// Route for the menu table
app.post('/todocategory', async (req: Request, res: Response) => {
    const category = req.body;
    if (!category || category.inputfield.trim() === '') {
        res.status(400).json({ message: 'item is empty' });
    } else {
        try {
            const query = "INSERT INTO todocategory (name) VALUE (?)";
            const connection: PoolConnection = await pool.getConnection();
            await connection.query(query, [category.inputfield]);
            res.status(201).json({ message: category });
        } catch (error) {
            res.status(400).json({ message: 'item already exists' });
        }
    }
});

app.get('/todolist', async (req: Request, res: Response) => {
    const categoryid = req.query.categoryid;
    const query = "SELECT * from todolist where categoryid = ? ORDER BY id";
    const connection: PoolConnection = await pool.getConnection();
    const result = await connection.query(query, [categoryid]);
    res.status(201).json(result);
});

// Making the todo for the menu
app.post('/todolist', async (req: Request, res: Response) => {
    const { categoryid, item } = req.body;
    if (!item || item.trim() === '') {
        res.status(400).json({ message: 'item is empty' });
    } else {
        try {
            const query = "INSERT INTO todolist (categoryid, item) VALUE (?, ?)";
            const connection: PoolConnection = await pool.getConnection();
            await connection.query(query, [categoryid, item]);
            res.status(201).json({ message: 'item added successfully' });
        } catch (error) {
            res.status(400).json({ message: error });
        }
    }
});

app.listen(3000, () => {
    console.log("server is running");
});