import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Ved@nt11",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];
//it will pretend as if the server received an app.get to home route
app.get("/", async (req, res) => {//by redirecting here it will show all the changes done by user
  try{
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;//we set item arrays as what we get from above query
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });  
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => { 
  const item = req.body.newItem;
  try{
    await db.query("INSERT INTO items (title) VALUES ($1)",
    [item]);//it will add task(jo user enter karega) in the items table
    res.redirect("/");//also it will display the task entered
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try{
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [item,id]);//it will update the items table 
    res.redirect("/");//also it will display the task after editing it 
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {//we will use delete command
  const id = req.body.deleteItemId;
  try{
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");//it makes sure that the updated information is displayed to the user
  } catch(err) {
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
