import express from "express";
import scrapper from "./scrapper.js";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;


// @route   POST api/book
// @desc    Reserve a spot
// @access  Public
app.post("/api/book", async (req, res) => {
   let response = await scrapper(req.body);
    res.json(response);
});


app.listen(port, () => console.log(`Server is started on port: ${port}`));

