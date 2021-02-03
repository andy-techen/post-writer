import express from 'express';
// import mongoose from 'mongoose';
import bodyParser from 'body-parser';

app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
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
