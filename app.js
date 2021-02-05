import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// mongoose.connect();
// const productsSchema = {
//     name: String,
//     price: Number,
//     rating: Number,
//     description: String
// };
// const Product = mongoose.model("Product", productsSchema);

// const postSchema = {
//     store: String,
//     address: String,
//     time: String,
//     products: [productsSchema]
// }
// const Post = mongoose.model("List", postSchema);

app.listen(3000, function(){
    console.log("Server is running on port 3000.");
})
