import mongoose from 'mongoose';

mongoose.connect();
const productsSchema = {
    name: String,
    price: Number,
    rating: Number,
    description: String
};
const Product = mongoose.model("Product", productsSchema);

const postSchema = {
    store: String,
    address: String,
    time: String,
    products: [productsSchema]
}
const Post = mongoose.model("List", postSchema);

$("#open-modal").click(() => {
    $("#modal").css({display: "block"})
})
$("#close-modal").click(() => {
    $("#modal").css({display: "none"})
})

$("#save-post").click(() => {
    console.log("Post Saved");
})
$("#reset-post").click(() => {
    console.log("Post Reset");
})