function addItem() {
    const item = $(".item-group")[0].outerHTML;
    $(".items-group").append(item);
}
function getPost() {
    const postObj = {};

    $("input").each((i, input) => {
        postObj[input.name] = input.value;
    });
    $("textarea").each((i, textarea) => {
        postObj[textarea.name] = textarea.value;
    })

    const postContent = `👣${postObj[area]}\n
    ｜${postObj[store]}｜\n
    ${postObj[item1Name]} ${postObj[item1Price]}\n
    🍼寶編請給分：${postObj[item1Rating]}\n
    ${postObj[item1Review]}
    -
    ${postObj[store]}\n
    📍地址：${postObj[address]}\n
    🚗交通：捷運中山站3號出口，步行約10分鐘\n
    ⏰營業時間：${postObj[hours]}\n
    💬低消/服務費/限時：${postObj[info]}\n
    -
    🔎${postObj[hashtags]}\n
    `

    return [postObj, postContent];
}
function copyPost() {
    document.execCommand('copy');  // save to clipboard
}
function addPost() {
    const postObj = getPost()[0];

    const postDiv = `
    <div class="post-div">
        <h3>👣${postObj[area]}</h3>
        <h2>${postObj[store]}</h2>
        <button class="copy-post">COPY</button>
        <button id="del-post"><i class="fa fa-trash" aria-hidden="true"></i></button>
    </div>
    `
}

$("#open-modal").click(() => {
    $(".modal").css({ display: "block" })
})
$("#close-modal").click(() => {
    $(".modal").css({ display: "none" })
})

$("#add-item").click(addItem);

$("#preview-post").click(() => {
    const postContent = getPost()[1];
    console.log(postContent);
})
$("#save-post").click(() => {
    getPost();
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
