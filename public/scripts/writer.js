const inputs;
const textareas;

function addItem() {
    const item = $(".item-group")[0].outerHTML;
    $(".items-group").append(item);
}
function getPost() {
    const postContent = {};
    inputs = $("input");
    textareas = $("textarea");

    inputs.each(input => {
        postContent[input.name] = input.value;
    });
    textareas.each(textarea => {
        postContent[textarea.name] = textarea.value;
    })

    return postContent;
}
function copyPost() {
    document.execCommand('copy');  // save to clipboard
}

$("#open-modal").click(() => {
    $("#modal").css({ display: "block" })
})
$("#close-modal").click(() => {
    $("#modal").css({ display: "none" })
})

$("#add-item").click(addItem);
$("#save-post").click(() => {
    const postContent = getPost();
    console.log(postContent);
    copyPost();
})

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('./sw.js')
//             .then((registration) => {
//                 // Registration was successful
//                 console.log('ServiceWorker registration successful with scope: ', registration.scope);
//             }, (err) => {
//                 // registration failed :(
//                 console.log('ServiceWorker registration failed: ', err);
//             });
//     });
// }
