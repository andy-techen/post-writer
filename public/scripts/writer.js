// custom functions-----------------------------------------------------------------------------
// add new item to post
function addItem() {
    const item = $(".item-group")[0].outerHTML;
    $(".items-group").append(item);
}

// get location dynamically via Google Direction API
function getLocation() {

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

    const postContent = `👣${postObj["area"]}<br>
    ｜${postObj["store"]}｜<br>
    ${postObj["item1-name"]} ${postObj["item1-price"]}<br>
    🍼寶編請給分：${postObj["item1-rating"]}<br>
    ${postObj["item1-review"]}<br>
    -<br>
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
    navigator.clipboard.writeText(postContent)
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

// delete post from .posts div and database
function delPost(e) {
    $(e.target).closest('.post-div').remove();
}

// event listeners------------------------------------------------------------------------------
$("#open-modal").click(() => {
    $(".modal").fadeIn(400);
});
$("#close-modal").click(() => {
    $(".modal").fadeOut(400);
    $(".modal-preview").fadeOut(400);
    $("#previous-page").fadeOut(400);
});

$("#add-item").click(addItem);

$("#preview-post").click(() => {
    $(".modal-preview").fadeIn(400);
    $("#previous-page").fadeIn(400);
    previewPost();
});
$("#previous-page").click(() => {
    $(".modal-preview").fadeOut(400);
    $("#previous-page").fadeOut(400);
})

$("#save-post").click(() => {
    addPost();
    const postContent = generatePost()[1];
    copyPost(postContent);
    $(".modal").fadeOut(400);
});
$("body").on('click', '.copy-post', () => {
    const postContent = generatePost()[1];
    copyPost(postContent);
});
$(".posts").on('click', '.del-post', (e) => {
    delPost(e);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, (err) => {
                // registration failed
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
