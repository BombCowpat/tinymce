<template>
  <div :style="{ width: containerWidth }">
    <textarea :id="tinymceId"></textarea>
  </div>
</template>

<script>
import load from './dynamicLoadScript'
import plugins from "./plugins";
import toolbar from "./toolbar";
export default {
  name: "Tinymce",
  props: {
    id: {
      type: String,
      default: function () {
        return (
          "vue-tinymce-" +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + "")
        );
      },
    },
    value: {
      type: String,
      default: "",
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    menubar: {
      type: String,
      default: "file edit insert view format table",
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360,
    },
    width: {
      type: [Number, String],
      required: false,
      default: "auto",
    },
  },
  data() {
    return {
        tinymceId: this.id, 
        editFlag: false   
    };
  },
  computed: {
    containerWidth() {
      const width = this.width;
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`;
      }
      return width;
    },
  },
  mounted() {
      load(this.initTinymce)
  },
  destroyed() {
    this.destroyTinymce();
  },
  watch: {
    // 当传入的value被修改时，动态更新文本框内容。后果：会导致光标重置，原因：输入内容时会更新外部绑定的value，同时watch会触发，从而重新设置内容重置光标。解决方案：
    // 在 watch的回调中判断当前更改是否是因为编辑，如果是编辑，便不更新内容，只有在传入的value更改时才更新
    value(val) {
        if(!this.editFlag){
            window.tinymce.get(this.tinymceId).setContent(val);
        // 此处修改 editFlag 会在编辑一次后，外部更新绑定的值在第一次修改时无法更新内容，第二次才可以更新，无法分析原因 
        }
        this.editFlag = false 
    }
  },
  methods: {
    /** 动态加载 script 标签，下载编辑器
     * @param src CDN 地址
     */
    dynamicLoadScript(src) {
        const hasScript = Boolean(document.getElementById('vue-cyf-xxxxx-aaaa'))
        // console.log(hasScript);
        if(!hasScript) {
            const script = document.createElement("script");
            script.src = src;
            script.id = 'vue-cyf-xxxxx-aaaa'
            document.body.appendChild(script);
            script.onload = () => {
                // console.log(window.tinymce);
                this.initTinymce();
            },
            script.onerror = function () {
                console.log("load tinymce failed");
            };
        } else {
            // 此时虽已创建script标签，但脚本并未下载完成
            // console.log(window.tinymce);
            // this.initTinymce()
        }
    },
    /** 初始化编辑器 */
    initTinymce() {
    //   console.log(window.tinymce)
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        height: this.height,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        init_instance_callback: (editor) => {
          // 初始化时将 value 填入编辑器
          editor.setContent(this.value);

          // 绑定编辑器内容修改时的回调
          editor.on(
            "NodeChange Change KeyUp SetContent undo redo input",
            () => {
              // console.log(editor.getContent())
              // this.value = editor.getContent()
              this.editFlag = true  
              this.$emit("input", editor.getContent())
              // input 回调 watch回调 .... setTimeout回调
              // 直接修改无效 $emit 是异步执行的，外部内容修改时已经为editFlag已经修改为 false 还是会重置光标，所以需要在回调队列最后紧跟一个回调去修改状态为false
            //   setTimeout(() => {
            //    this.editFlag = false    
            //   });
            }
          );
        },
      });
    },
    /** 销毁编辑器 */
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId);
      if (tinymce) {
        tinymce.destroy();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>