const posts = [];

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