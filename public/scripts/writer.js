function addItem() {
    const item = $("input-group").outerHTML();
    console.log(item);
}

$("#open-modal").click(() => {
    $("#modal").css({ display: "block" })
})
$("#close-modal").click(() => {
    $("#modal").css({ display: "none" })
})

$("#add-item").click(addItem);
$("#save-post").click(() => {
    console.log("Post Saved");
    document.execCommand('copy');  // save to clipboard
})

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js', { scope: '/' })
//             .then((registration) => {
//                 // Registration was successful
//                 console.log('ServiceWorker registration successful with scope: ', registration.scope);
//             }, (err) => {
//                 // registration failed :(
//                 console.log('ServiceWorker registration failed: ', err);
//             });
//     });
// }