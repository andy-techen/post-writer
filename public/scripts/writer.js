const database = firebase.database();
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
            <label><input type="radio" value="🍼寶" name="item${itemCnt}-toggle" checked="checked" /><span>🍼</span></label>
            <label><input type="radio" value="👃🏻鼻" name="item${itemCnt}-toggle" /><span>👃🏻</span></label>
            <input type="range" name="item${itemCnt}-rating" min="1" max="5" step="0.25" />
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
function generatePost(postObj = {}) {
    // if empty, fill postObj with inputs and textareas from modal
    if (Object.keys(postObj).length === 0) {
        $("input").each((i, input) => {
            postObj[input.name] = input.value;
        });
        $("textarea").each((i, textarea) => {
            postObj[textarea.name] = textarea.value;
        })
    }

    const itemKeys = Object.keys(postObj)
        .filter((k) => k.startsWith("item"))
        .map(k => parseInt(k.match(/[0-9 ]/)));  // extract item index
    const itemCnt = Math.max(...itemKeys);

    let itemsContent = "";
    for (var i = 1; i <= itemCnt; i++) {
        postObj[`item${i}-toggle`] = $(`input[name="item${i}-toggle"]:checked`).val();
        let item_moons = '🌕'.repeat(Math.floor(postObj[`item${i}-rating`]));
        switch (postObj[`item${i}-rating`] % 1) {
            case 0:
                break;
            case 0.25:
                item_moons += '🌘';
                break;
            case 0.5:
                item_moons += '🌗';
                break;
            case 0.75:
                item_moons += '🌖'
                break;
        }
        item_moons += '🌑'.repeat((5 - Math.ceil(postObj[`item${i}-rating`])));

        itemsContent += `${postObj[`item${i}-name`]} $${postObj[`item${i}-price`]}<br>
        ${postObj[`item${i}-toggle`]}編請給分：${item_moons}<br>
        ${postObj[`item${i}-review`]}<br>
        -`.replace(/^ {4}/gm, '');
    }

    const postContent = `👣${postObj["area"]}<br>
    ｜${postObj["store"]}｜<br>
    ${itemsContent}<br>
    ${postObj["dialogue"]}<br>
    -<br>
    ${postObj["store"]}<br>
    📍地址：${postObj["address"]}<br>
    🚗交通：${postObj["transit"]}<br>
    ⏰營業時間：${postObj["hours"]}<br>
    💬低消/服務費/限時：${postObj["info"]}<br>
    -<br>
    🔎${postObj["search"]}<br>
    -<br>
    ${postObj["hashtags"]}
    `.replace(/^ {4}/gm, '');  // remove indention at start of line

    return [postObj, postContent];
}

// display content on preview page
function previewPost() {
    const postContent = generatePost()[1];
    $(".preview-content").html(postContent);
}

// get post from database
function getPost(targetPost) {
    return database.ref('/').child('posts')
        .once('value')
        .then((snap) => {
            const postObj = snap.val()[targetPost];
            console.log(postObj);
            return postObj;
        });
}

// copy to clipboard (fetch from database?)
function copyPost(postContent) {
    navigator.clipboard.writeText(postContent.replace(/\<br\>/g, ""))
        .then(() => {
            showAlert("COPIED TO CLIPBOARD");
        }, () => {
            showAlert("UNABLE TO COPY");
        });
}

// add new post to .posts div
function addPost(postObj) {
    // postCnt++;
    // postObj["post-id"] = `post${postCnt}`;
    const postId = database.ref('/').child('posts').push().key;

    const postDiv = `
    <div class="post-div" name="${postId}">
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

    let updates = {};
    updates['/posts/' + postId] = postObj;
    database.ref('/').update(updates);
}

// reset changes made to modal and itemCnt for new post
function resetPost() {
    $("input").val("");
    $("textarea").val("");
    $(".items-group").empty();
}

// delete post from .posts div and database
function delPost(e) {
    $(e.target).closest('.post-div').remove();
    confirm("🥺ARE YOU SURE🥺");
}

// show alert on top
function showAlert(message) {
    const alert = $('.alert');
    alert.text(message);
    alert.fadeIn(200).delay(1000).fadeOut(200);
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
    const [postObj, postContent] = generatePost();
    addPost(postObj);
    copyPost(postContent);
    $(".modal").fadeOut(200);
    resetPost();
});
$(".modal").on('click', '.copy-post', () => {
    const postContent = generatePost()[1];
    copyPost(postContent);
});
$(".posts").on('click', '.copy-post', (e) => {
    const targetPost = $(e.target).closest('.post-div').attr("name");
    console.log(targetPost);
    getPost(targetPost)
        .then((postObj) => {
            const postContent = generatePost(postObj)[1];
            copyPost(postContent);
        });
});
$(".posts").on('click', '.del-post', (e) => {
    delPost(e);
});

window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, (err) => {
                // registration failed
                console.log('ServiceWorker registration failed: ', err);
            });
    }
});
