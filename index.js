const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "rohit123",
    database: "my_first_db"
});

const express= require("express");
const port =3001;
const app =express();
app.use(express.json());

// ========================
// GET
// ========================

app.get('/books',async(req,res)=>{
    const [rows]= await pool.query('select * from books');
    res.json(rows);
});
// ========================
// Start the Express server and listen for requests on this port.
// ========================

// ========================
// GET BY ID
// ========================

app.get('/books/:id',async(req,res)=>{
    const id = parseInt(req.params.id);
    const[rows]=await pool.query('select *from books where id =?',[id]);
    if(rows.length === 0){
        return res.status(404).json({msg:'book not found'});
    }
    res.json(rows)
});

// ========================
// POST
// ========================

app.post('/books',async(req,res)=>{
    const {title,author,genre,price,published_year}=req.body;
    const[result]= await pool.query(
        'INSERT INTO books(title ,author,genre,price,published_year) VALUES (?,?,?,?,?)',[title ,author,genre,price,published_year]
    );
    res.status(201).json({
        id: result.insertId,
        title,
        author,
        genre,
        price,
        published_year

    });
});

// ========================
// PUT USES ID 
// ========================

app.put('/books/:id',async(req,res)=>{
    const id = parseInt(req.params.id);
    const {title,author,genre,price,published_year}=req.body;
    const [result] = await pool.query('UPDATE books SET title = ?,author=? ,genre =?, price = ? ,published_year= ? where id = ?',[title,author,genre,price,published_year,id]);
    if(result.affectedRows === 0){
        return res.status(404).json({msg:'book not found'});
    }
    res.json({
        id,
        title,
        author,
        genre,
        price,
        published_year
    });
});

// ========================
// PATCH USES ID 
// ========================

app.patch('/books/:id',async(req,res)=>{
    const id = parseInt(req.params.id);
    const updates = req.body;
    if(Object.keys(updates).length === 0){
        return res.status(400).json({
            msg :"none of the field is updated"
        });
    }
    const fields =Object.keys(updates).map(key=> `${key} = ?`).join(', ');
    const values=Object.values(updates);
    values.push(id);
    
    const [result]= await pool.query(
        `UPDATE books SET ${fields} WHERE id = ?`,values
    );
    if(result.affectedRows === 0){
        return res.status(404).json({
            message:"books not found"
        });
    }
    const [rows] = await pool.query('SELECT *FROM books WHERE  id = ?', [id]);
    res.json(rows[0]);
});
 
app.listen(port,()=>{
console.log(`server is running on port ${port}`);
console.log('Books API ready - connected to MySQL!');
});