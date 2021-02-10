const loc = {
    '台北': 'taipei', '新北': 'taipei', '新竹': 'hsinchu',
    '台中': 'taichung', '台南': 'tainan', '高雄': 'kaoshiung', '宜蘭': 'yilan'
}

// update currentSnapshot on value change in firebase db
var currentSnap = null;
database.ref(`/posts/`)
    .on('value', (snap) => {
        currentSnap = snap;
    });

// custom functions-----------------------------------------------------------------------------
// add new item to post
var itemCnt = 1;
function addItem(items = 1) {
    for (var i = itemCnt; i < itemCnt + items; i++) {
        const item = `
        <div class="item-group" name="item${i}-group">
            <form class="input-group">
                <label>品項</label>
                <input name="item${i}-name" />
            </form>
            <form class="input-group">
                <label>價格</label>
                <input type="number" name="item${i}-price" />
            </form>
            <form class="input-group">
                <label>評分</label>
                <label><input type="radio" value="🍼寶" name="item${i}-toggle" checked="checked" /><span>🍼</span></label>
                <label><input type="radio" value="👃🏻鼻" name="item${i}-toggle" /><span>👃🏻</span></label>
                <div class="input-range">
                    <input type="range" name="item${i}-rating" min="1" max="5" step="0.25"
                    list="ticks" oninput="this.nextElementSibling.value = this.value" />
                    <output>3</output>
                </div>                 
            </form>
            <form class="input-group">
                <label>評語</label>
                <textarea name="item${i}-review"></textarea>
            </form>
        </div>
        `
        $(".items-group").append(item);
    }
}

// get location dynamically via Google Direction API
// function getLocation(destination) {
//     const key = process.env.DIRECTIONS_API_KEY;
//     const origin = process.env.ORIGIN;
//     const URL = `https://maps.googleapis.com/maps/api/directions/json?key=${key}&
//     origin=${origin}&destination=${destination}&
//     mode=transit&transit_mode=subway&transit_routing_preference=less_walking`

//     $.get(URL, (data) => {
//         console.log(data['routes']);
//     }, 'jsonp');
// }

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
    const items = Math.max(...itemKeys);

    let itemsContent = "";
    for (var i = 1; i <= items; i++) {
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

        itemsContent += `${postObj[`item${i}-name`]} $${postObj[`item${i}-price`]}
        ${postObj[`item${i}-toggle`]}編請給分：${item_moons}
        ${postObj[`item${i}-review`]}
        -
        `.replace(/^ {4}/gm, '');
    }

    const postContent = `👣${postObj["area"]}
    ｜${postObj["store"]}｜
    ${itemsContent}${postObj["dialogue"]}
    -
    ${postObj["store-full"]}
    📍地址：${postObj["address"]}
    🚗交通：${postObj["transit"]}
    ⏰營業時間：${postObj["hours"]}
    💬低消/服務費/限時：${postObj["info"]}
    -
    🔎${postObj["labels"]}
    -
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
function getPost(postId) {
    const postObjs = currentSnap.val();
    return postObjs[postId];
}

// copy to clipboard (fetch from database?)
function copyPost(postContent) {
    navigator.clipboard.writeText(postContent)
        .then(() => {
            showAlert("COPIED TO CLIPBOARD");
        }, () => {
            showAlert("UNABLE TO COPY");
        });
}

// add new post to .posts div
function addPost(postObj, postId = "") {
    if (postId === "") {
        postId = database.ref('/').child('posts').push().key;
        let updates = {};
        updates['/posts/' + postId] = postObj;
        database.ref('/').update(updates);
    }

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
}

// reset changes made to modal and itemCnt for new post
function resetPost() {
    itemCnt = 1;
    $('input, textarea').each((i, form) => form.value = form.defaultValue);
    $(".items-group").empty();
}

// load in post content when clicked
function loadPost(postId) {
    const postObj = getPost(postId);
    const itemKeys = Object.keys(postObj)
        .filter((k) => k.startsWith("item"))
        .map(k => parseInt(k.match(/[0-9 ]/)));  // extract item index

    const items = Math.max(...itemKeys);
    addItem(items);
    itemCnt = items + 1;

    $.each(postObj, (k, v) => {
        if (k.includes("toggle")) {
            $(`[name=${k}][value=${v}]`).prop('checked', true);
        } else {
            $(`[name=${k}]`).val(v);
        }
    });
}

// delete post from .posts div and database
function delPost(target) {
    const postId = target.attr("name");
    let del = confirm("🥺ARE YOU SURE🥺");
    if (del) {
        target.remove();
        database.ref(`/posts/${postId}`).remove();
    }
}

// show alert on top
function showAlert(message) {
    const alert = $('.alert');
    alert.text(message);
    alert.fadeIn(200).delay(1000).fadeOut(200);
}

// event listeners------------------------------------------------------------------------------
// modal page
$("#open-modal").click(() => {
    $(".modal").fadeIn(200);
    $('input[name="area"]').focus();
});

$("#close-modal").click(() => {
    let close = true;
    const formVals = [...$('input'), ...$('textarea')].map(form => form.value);
    // check if forms are empty
    if (formVals.some(val => val !== "")) {
        close = confirm("😨CHANGES WILL NOT BE SAVED😨");
    }
    if (close) {
        resetPost();
        $(".modal").fadeOut(200);
        $(".modal-preview").fadeOut(200);
        $("#previous-page").fadeOut(200);
    }
});

$("#previous-page").click(() => {
    $(".modal-preview").fadeOut(200);
    $("#previous-page").fadeOut(200);
});

$("#add-item").click(() => {
    addItem();
    itemCnt++;
});

$("#preview-post").click(() => {
    $(".modal-preview").fadeIn(200);
    $("#previous-page").fadeIn(200);
    previewPost();
});

$("#save-post").click(() => {
    const [postObj, postContent] = generatePost();
    addPost(postObj);
    copyPost(postContent);
    $(".modal").fadeOut(200);
    resetPost();
});

$(".copy-post").click(() => {
    const postContent = generatePost()[1];
    copyPost(postContent);
});

// input listeners
// update store-name related inputs
$('input[name="store"]').change((e) => {
    const store = $(e.target).val();
    let storeCond = store;
    if (store !== "") {
        storeCond = store.replace(/\s+/g, '');
    }
    $('input[name="store-full"]').val(store);
    $('input[name="labels"]').val((i, val) => {
        return val + `#寶鼻吃${storeCond}#${storeCond}`;
    });
});

$('input[name="area"]').change((e) => {
    const inputVal = $(e.target).val();
    if (!inputVal.includes(" x ")) {
        $(e.target).val(" x ");
    }
    const inputArr = inputVal.split(" x ");
    const area = inputArr[0];
    const station = inputArr[1];
    if (area !== (undefined || "") && station !== (undefined || "")) {
        $('input[name="labels"]').val((i, val) => {
            return `#寶鼻吃${area}#寶鼻吃${station}` + val;
        });
        $('textarea[name="hashtags"]').val(() => {
            return (
                `#${area}美食#${station}美食` +
                `#${loc[area]}food#${loc[area]}eats#${loc[area]}foodie` +
                $('textarea[name="hashtags"]').prop("defaultValue")
            );
        });
        if (area === "台北") {
            $('input[name="transit"]').val(`捷運${station}號出口，步行約分鐘`);
        }
    }
})

// posts page (event delegation)
$(".posts").on('click', '.post-div', (e) => {
    const target = $(e.target).closest('.post-div');
    if (!$(e.target).is('.copy-post, .del-post, i')) {
        $(".modal").fadeIn(200);
        $('input[name="area"]').focus();
        const postId = target.attr("name");
        loadPost(postId);
        $("#save-post").click(() => {   // when saved, remove original record from database and create new record
            database.ref(`/posts/${postId}`).remove();
            target.remove();
        })
    }
});

$(".posts").on('click', '.copy-post', (e) => {
    const postId = $(e.target).closest('.post-div').attr("name");
    const postObj = getPost(postId);

    const postContent = generatePost(postObj)[1];
    copyPost(postContent);
});

$(".posts").on('click', '.del-post', (e) => {
    const target = $(e.target).closest('.post-div');
    delPost(target);
});

// on window load
$(window).on('load', () => {
    database.ref(`/posts/`)
        .once('value')
        .then((snap) => {
            currentSnap = snap;
            return currentSnap.val();
        })
        .then((postObjs) => {
            console.log(postObjs);
            $.each(postObjs, (i, postObj) => {
                addPost(postObj, i);
            });
        });
});

if ('serviceWorker' in navigator) {
    $(window).on('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, (err) => {
                // registration failed
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
