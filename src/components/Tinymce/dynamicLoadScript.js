// 存储编辑器的初始化函数
// 页面只有一个编辑器  script标签第一次加载
// 页面只有一个编辑器  script标签非第一次加载,此时脚本肯定以及加载完成
// 页面有多个编辑器  script标签第一次加载 dynamicLoadScript 会多次调用，但是只有一次会创建script标签，然后将所有的初始化函数推入callbacks，在异步回调中调用所有初始化函数
const callbacks = []
const src = "https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js"
function loadedTinymce() {
    return window.tinymce
}

export default function dynamicLoadScript(callback) {
    const hasScript = document.getElementById('vue-cyf-xxxxx-aaaa')
    if(!hasScript) {
        const script = document.createElement("script");
        script.src = src;
        script.id = 'vue-cyf-xxxxx-aaaa'
        document.body.appendChild(script);
        callbacks.push(callback)
        script.onload = () => {
            for (const cb of callbacks) {
                cb()
            }
            callbacks.length = 0
        },
        script.onerror = function () {
            console.log("load tinymce failed");
        };
    } else {
        if(loadedTinymce()) {
            callback()
        }else {
            callbacks.push(callback)
        }
    }
}