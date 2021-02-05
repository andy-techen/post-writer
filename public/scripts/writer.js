// custom functions-----------------------------------------------------------------------------
// add new item to post
var itemCnt = 0;
function addItem() {
    itemCnt++;
    const item = `
    <div class="item-group" name="item${itemCnt}-group">
        <form class="input-group">
            <label>品項</label>
            <input name="item${itemCnt}-name" />
        </form>
        <form class="input-group">
            <label>價格</label>
            <input name="item${itemCnt}-price" />
        </form>
        <form class="input-group">
            <label>評分</label>
            <button class="rating-bao">🍼</button>
            <button class="rating-bee">👃🏻</button>
            <input type="range" name="item${itemCnt}-rating" min="1" max="5" step="0.25"/>
        </form>
        <form class="input-group">
            <label>評語</label>
            <textarea name="item${itemCnt}-review"></textarea>
        </form>
    </div>
    `
    $(".items-group").append(item);
}

// get location dynamically via Google Direction API
function getLocation() {
    console.log(process.env.GOOGLE_API_KEY);
}

// format post
function generatePost() {
    const postObj = {};

    $("input").each((i, input) => {
        postObj[input.name] = input.value;
    });
    $("textarea").each((i, textarea) => {
        postObj[textarea.name] = textarea.value;
    })
    console.log(postObj);
    
    let itemsContent = "";
    for (var i = 1; i <= itemCnt; i++) {
        itemsContent += `
        ${postObj[`item${i}-name`]} $${postObj[`item${i}-price`]}<br>
        🍼寶編請給分：${postObj[`item${i}-rating`]}<br>
        ${postObj[`item${i}-review`]}<br>
        -<br>
        `
    }

    const postContent = `👣${postObj["area"]}<br>
    ｜${postObj["store"]}｜<br>
    ${itemsContent}
    ${postObj["dialogue"]}<br>
    -<br>
    ${postObj["store"]}<br>
    📍地址：${postObj["address"]}<br>
    🚗交通：${postObj["transportation"]}<br>
    ⏰營業時間：${postObj["hours"]}<br>
    💬低消/服務費/限時：${postObj["info"]}<br>
    -<br>
    🔎${postObj["hashtags"]}<br>
    `

    return [postObj, postContent];
}

// display content on preview page
function previewPost() {
    const postContent = generatePost()[1];
    $(".preview-content").html(postContent);
}

// get post from database
function getPost() {

}

// copy to clipboard (fetch from database?)
function copyPost(postContent) {
    navigator.clipboard.writeText(postContent.replace(/\<br\>/g, ""))
        .then(() => {
            console.log("copied to clipboard");
        }, () => {
            console.log("unable to copy to clipboard");
        });
}

// add new post to .posts div
function addPost() {
    const postObj = generatePost()[0];

    const postDiv = `
    <div class="post-div">
        <div>
            <h4>👣${postObj["area"]}</h4>
            <h3>${postObj["store"]}</h3>
        </div>
        <div>
            <button class="copy-post">COPY</button>
            <button class="del-post"><i class="fa fa-trash" aria-hidden="true"></i></button>
        </div>
    </div>
    `

    $(".posts").append(postDiv);
}

// reset changes made to modal and itemCnt for new post
function resetPost() {
    itemCnt = 0;
    $("input").val("");
    $("textarea").val("");
    $(".items-group").empty();
}

// delete post from .posts div and database
function delPost(e) {
    $(e.target).closest('.post-div').remove();
}

// event listeners------------------------------------------------------------------------------
$("#open-modal").click(() => {
    $(".modal").fadeIn(200);
});
$("#close-modal").click(() => {
    $(".modal").fadeOut(200);
    $(".modal-preview").fadeOut(200);
    $("#previous-page").fadeOut(200);
});

$("#add-item").click(addItem);

$("#preview-post").click(() => {
    $(".modal-preview").fadeIn(200);
    $("#previous-page").fadeIn(200);
    previewPost();
});
$("#previous-page").click(() => {
    $(".modal-preview").fadeOut(200);
    $("#previous-page").fadeOut(200);
})

$("#save-post").click(() => {
    addPost();
    const postContent = generatePost()[1];
    copyPost(postContent);
    $(".modal").fadeOut(200);
    resetPost();
});
$("body").on('click', '.copy-post', () => {
    const postContent = generatePost()[1];
    copyPost(postContent);
});
$(".posts").on('click', '.del-post', (e) => {
    delPost(e);
});

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
