<template>
  <div>
    <quill-editor
      v-if="canRender"
      ref="myQuillEditor"
      class="ql_editor"
      :class="disabled ? 'un-edit' : ''"
      :content="content"
      @change="onEditorChange($event)"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      :options="editorOption"
      :disabled="disabled"
    />
    <!--使用upload-to-ali组件作为图片上传，返回url-->
    <upload-to-ali ref="uploadToAli" @fail="fail" v-bind="upload" @loaded="uploadFileSuccess">
      <span></span>
    </upload-to-ali>
  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
import UploadToAli from "../upload-to-ali/src/index.ts";
export default {
  components: {
    "upload-to-ali": UploadToAli,
    quillEditor
  },
  props: {
    /**
     * upload-to-ali的参数;
     * 文档参看upload-to-ali;
     */
    upload: {
      type: Object,
      default: () => ({
        size: 1024 * 3,
        multiple: true,
        accept: "image/png,image/jpg,image/jpeg"
      })
    },
    fail: {
      type: Function,
      default: msg => {
        console.warn(msg);
      }
    },
    /**
     * 编辑的内容，返回一段HTML
     */
    content: {
      type: String
    },
    /**
     * editor默认配置，参看vue-quill-editor demo配置https://surmon-china.github.io/vue-quill-editor/;
     * 完整配置 https://quilljs.com/docs/configuration/;
     */
    editorOption: {
      type: Object,
      default: () => {
        return {
          placeholder: "请输入",
          modules: {
            toolbar: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ["clean"],
              ["link", "image"]
            ]
          }
        };
      }
    },
    /**
     * 编辑器是否可编辑
     */
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  data() {
    return {
      canRender: false,
      uploadType: "", // image|video
      addRange: {} // 光标位置，为null，表示光标不在输入区域
    };
  },
  methods: {
    onEditorBlur(editor) {
      this.$emit("on-editor-blur", editor);
    },
    onEditorFocus(editor) {
      this.$emit("on-editor-focus", editor);
    },
    onEditorReady(editor) {
      this.$emit("on-editor-ready", editor);
    },
    onEditorChange(event) {
      this.$emit("on-editor-change", event);
      this.$emit("update:content", event.html);
      event.quill.deleteText(10000, 1);
    },
    imgHandler(state) {
      if (this.disabled) return;
      this.addRange = this.editor.getSelection(); // 判断光标位置
      if (state) {
        this.$refs.uploadToAli.selectFiles(); // 选择文件上传
      }
      this.uploadType = "image";
    },
    uploadFileSuccess(url) {

      try {
        // 将文件上传后的URL地址插入到编辑器文本中
        if (url) {
          let urls = [];
          if (typeof url === "string") {
            urls.push(url);
          } else {
            urls = url;
          }

          // 获取光标位置对象，range.index，即当前光标之前的内容长度，
          this.addRange = this.editor.getSelection();
          let index = (this.addRange && this.addRange.index) || 0;
          // 利用 insertEmbed(length, 'image', imageUrl)，插入图片。
          urls.forEach(img => {
            this.editor.insertEmbed(index, this.uploadType, img);
            index++;
          });
          // 设置光标在插入图片之后
          this.editor.setSelection(index + urls.length);
        } else {
          console.warn(`${this.uploadType}插入失败`);
        }
      } catch (e) {
        console.warn(e);
      }
    }
  },

  mounted() {
    this.canRender = true;
    // no-srr组件是在mounted时候渲染，
    this.$nextTick(() => {
      // 为图片ICON绑定事件  getModule 为编辑器的内部属性
      this.editor.getModule("toolbar").addHandler("image", this.imgHandler);
    });
  }
};
</script>

<style>
.ql-editor {
  min-height: 200px;
}
.un-edit {
  background-color: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
