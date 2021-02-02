// import express from 'express';
// import mongoose from 'mongoose';

// app = express();

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

$("#open-modal").click(() => {
    $("#modal").css({ display: "block" })
})
$("#close-modal").click(() => {
    $("#modal").css({ display: "none" })
})
$("#save-post").click(() => {
    console.log("Post Saved");
    document.execCommand('copy');  // save to clipboard
})

// app.listen(3000, function(){
//     console.log("Server is running on port 3000.");
// })

window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }
}