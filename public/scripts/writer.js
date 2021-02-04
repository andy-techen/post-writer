function addItem() {
    const item = $(".item-group")[0].outerHTML;
    $(".items-group").append(item);
}
function savePost() {
    const postObj = {};

    $("input").each((i, input) => {
        postObj[input.name] = input.value;
    });
    $("textarea").each((i, textarea) => {
        postObj[textarea.name] = textarea.value;
    })

    const postContent = `👣${postObj["area"]}\n
    ｜${postObj["store"]}｜\n
    ${postObj["item1-name"]} ${postObj["item1-price"]}\n
    🍼寶編請給分：${postObj["item1-rating"]}\n
    ${postObj["item1-review"]}
    -
    ${postObj["store"]}\n
    📍地址：${postObj["address"]}\n
    🚗交通：${postObj["transportation"]}\n
    ⏰營業時間：${postObj["hours"]}\n
    💬低消/服務費/限時：${postObj["info"]}\n
    -
    🔎${postObj["hashtags"]}\n
    `

    return [postObj, postContent];
}
function copyPost(postContent) {
    navigator.clipboard.writeText(postContent)
        .then(() => {
           console.log("copied to clipboard");
        }, () => {
            console.log("unable to copy to clipboard");
        });
}
function addPost() {
    const postObj = getPost()[0];

    const postDiv = `
    <div class="post-div">
        <div>
            <h4>👣${postObj["area"]}</h4>
            <h3>${postObj["store"]}</h3>
        </div>
        <div>
            <button class="copy-post">COPY</button>
            <button id="del-post"><i class="fa fa-trash" aria-hidden="true"></i></button>
        </div>
    </div>
    `

    $(".posts").append(postDiv);
}

$("#open-modal").click(() => {
    $(".modal").css({ display: "block" })
})
$("#close-modal").click(() => {
    $(".modal").css({ display: "none" })
})

$("#add-item").click(addItem);

$("#preview-post").click(() => {
    const postContent = savePost()[1];
    console.log(postContent);
})
$("#save-post").click(() => {
    const post = savePost()[1];
    addPost();
    copyPost(post);
})

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('./sw.js')
//             .then((registration) => {
//                 // Registration was successful
//                 console.log('ServiceWorker registration successful with scope: ', registration.scope);
//             }, (err) => {
//                 // registration failed
//                 console.log('ServiceWorker registration failed: ', err);
//             });
//     });
// }
