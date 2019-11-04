<template>
  <div class="upload_to_oss"
       title="粘贴或拖拽即可上传图片"
       :class="{'upload_to_oss_highlight': isHighlight}">
    <!--图片的展示区域-->
    <template v-if="!$slots.default">
      <div v-for="(imgUrl, index) in uploadList"
           :key="index"
           class="upload_item"
           :class="{'is_preview': preview}"
           :style="{'width': width+'px', 'height':height+'px'}">
        <i title="删除图片"
           v-if="!disabled"
           class="upload_del_icon"
           @click.stop.prevent="onDelete(imgUrl, index)"></i>
        <img :src="imgUrl"
             v-if="isImg"
             class="upload_img"
             @click="onClick(imgUrl)" />
        <video v-if="preview && !isImg"
               class="upload_img"
               controls
               :src="imgUrl" />
      </div>
    </template>

    <!--上传区域-->
    <div class="upload_area"
         :class="{disabled: disabled}"
         v-if="canUpload"
         @click="selectFiles"
         @paste="paste"
         @dragover="onDragover"
         @dragleave="removeHighlight"
         @drop="onDrop">
      <!--@slot 自定义上传区域-->
      <slot>
        <div class="upload_box"
             :style="{'width': width+'px', 'height':height+'px'}">
          <!--@slot 自定义loading内容 -->
          <slot name="spinner"
                v-if="uploading">
            <div class="upload_loading">
              <svg class="circular"
                   viewBox="25 25 50 50">
                <circle class="path"
                        cx="50"
                        cy="50"
                        r="20"
                        fill="none" />
              </svg>
            </div>
          </slot>
          <!--@slot 自定义placeholder内容 -->
          <slot name="placeholder"
                v-else>
            <div class="upload_placeholder" />
          </slot>
        </div>
      </slot>
    </div>

    <!-- 自定义提示文字 -->
    <div v-if="tip"
         class="upload_tip">
      {{ tip }}
    </div>

    <input class="upload_input"
           type="file"
           ref="uploadInputRef"
           hidden
           :disabled="uploading"
           :accept="accept"
           :multiple="multiple"
           @change="upload">
    <img-preview v-if="preview && isImg"
                 v-model="previewUrl" />
    <!-- 图片剪切 -->
    <el-dialog title="剪裁图片"
               @close="colseDialog"
               :visible.sync="cropperModel">
      <div class="cropper_content">
        <div class="cropper"
             style="text-align:center">
          <vueCropper ref="cropperRef"
                      :img="imgUrl"
                      v-bind="cropperOptions" />
        </div>
      </div>
      <div slot="footer"
           class="dialog_footer">
        <el-button @click="cropperModel = false">取 消</el-button>
        <el-button type="primary"
                   @click="cropperFinish">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import AliOSS from "ali-oss";
import { VueCropper } from "vue-cropper";
import ImgPreview from "@femessage/img-preview";
import ImageCompressor from "image-compressor.js";
const imageCompressor = new ImageCompressor();

let doubleSlash = `${location.protocol}//`;
let oneKB = 1024;
const image = "image";
const clipboardData = "clipboardData";
const dataTransfer = "dataTransfer";
const target = "target";
const filenameMaxLength = 220;

const mimeTypeFullRegex = /[\w]*\/[\\*\w]/;
const mimeTypeHalfRegex = /[\w]*/;

export default {
  name: "UploadToAli",
  components: {
    ImgPreview,
    VueCropper
  },
  props: {
    /**
     * 目录名, 一定要/结尾
     */
    dir: {
      type: String,
      default: process.env.OSS_DIR || ""
    },
    filenameMaxLength: {
      type: Number,
      default: filenameMaxLength
    },
    getOssConfig: {
      type: Function
    },
    /**
     * 自定义域名, 该字段有值时, 返回的文件url拼接规则为: customDomain + / + dir + filename
     * 域名无协议时, url默认以 // 开头
     * 域名不需要/结尾
     */
    customDomain: {
      type: String,
      default: process.env.OSS_CUSTOM_DOMAIN
    },
    /**
     * 图片地址, 支持v-model
     */
    value: [String, Array],
    /**
     * 是否多选
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * 上传文件大小限制, 单位为KB, 默认值为1024, 参考GitHub上传头像设置
     */
    size: {
      type: Number,
      default: oneKB
    },
    /**
     * 接受上传的文件类型, 多个值逗号分隔, 默认只接受图片
     * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept
     */
    accept: {
      type: String,
      default: "image/*"
    },
    /**
     * 暂不支持此props。超时时间, 单位毫秒, 大于0才生效
     */
    timeout: {
      type: Number,
      default: 0
    },
    /**
     * 是否禁用。若为true，则不能上传
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 允许上传的最大数量
     */
    max: {
      type: Number,
      default: 9,
      validator: val => {
        return val > 0;
      }
    },
    /**
     * 图片压缩参数，请参考：https://www.npmjs.com/package/image-compressor.js#options
     */
    compressOptions: {
      type: Object,
      default: () => ({
        maxWidth: 750
      })
    },
    /**
     * 上传参数，请参考：https://help.aliyun.com/document_detail/64047.html?spm=a2c4g.11186623.2.25.40d279f8OV4hwk#h2-url-2
     */
    uploadOptions: {
      type: Object,
      default: () => ({
        partSize: 100 * oneKB
      })
    },
    /**
     * 是否开启预览功能，需要全局注册img-preview组件
     */
    preview: {
      type: Boolean,
      default: true
    },
    /**
     * 图片或者视频等
     */
    isImg: {
      type: Boolean,
      default: true
    },
    /**
     * 自定义上传提示内容
     */
    tip: {
      type: String
    },
    /**
     * 点击事件, 返回参数为当前点击的url
     */
    onClick: {
      type: Function,
      default(url) {
        this.previewUrl = url;
      }
    },
    /**
     * 容器宽度
     */
    width: {
      type: Number,
      default: 80
    },
    /**
     * 容器高度
     */
    height: {
      type: Number,
      default: 80
    },
    /**
     * 是否需要剪切
     */
    cropper: {
      type: Boolean,
      default: false
    },
    /**
     * 图片剪切框比例
     */
    fixedNumber: {
      type: Array,
      default: () => {
        return [2, 1];
      }
    }
  },
  data() {
    return {
      client: {},
      previewUrl: "",
      uploading: false,
      isHighlight: false,
      cropperModel: false,
      imgUrl: "",
      ossConfig: {}, // oss 配置
      uploadInfo: {}, // 图片上传信息
      cropperOptions: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 300, // 默认生成截图框宽度
        // autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [2, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      }
    };
  },
  computed: {
    uploadList() {
      return [].concat(this.value).filter(v => !!v);
    },
    canUpload() {
      const maxLen = this.multiple ? this.max : 1;
      return this.uploadList.length < maxLen;
    }
  },
  methods: {
    /**
     * @description 获取oss 配置
     */
    async setOssConfig() {
      if (!this.getOssConfig) {
        console.warn("没有getOssConfig方法");
        return;
      }
      try {
        const {
          data: { accessKeyId, accessKeySecret, endpoint, securityToken }
        } = await this.getOssConfig();
        const region = endpoint.split("//")[1].split(".")[0];
        this.ossConfig = {
          region,
          accessKeyId,
          accessKeySecret,
          stsToken: securityToken,
          bucket: process.env.VUE_APP_OSS_BUCKET
        };
      } catch (e) {
        console.log(e);
      }
    },
    colseDialog() {
      // 剪切框关闭
      this.imgUrl = "";
    },
    newClient() {
      if (!this.getOssConfig) return;
      try {
        // https://help.aliyun.com/document_detail/32069.html?spm=a2c4g.11186623.6.801.LllSVA
        this.client = new AliOSS(this.ossConfig);
      } catch (e) {
        console.log(e);
      }
    },
    onDelete(url, index) {
      const result = this.multiple ? this.uploadList.filter(v => v !== url) : "";
      this.$emit("input", result);
      /**
       * 删除图片事件
       * 返回参数(被删除的文件, 下标)
       * @event delete
       */
      this.$emit("delete", url, index);
    },
    selectFiles() {
      if (!this.canUpload) {
        this.$message.error("已达到上传的最大数量");
        return;
      }
      this.$refs.uploadInputRef.click();
    },
    async uploadPreCheck(file) {
      let filename = doubleSlash;
      const name = file.name;
      let key = "";
      if (encodeURIComponent(name).length > this.filenameMaxLength) {
        alert("文件名称过长");
        return;
      }
      this.$emit("loading", name);

      if (file.type.indexOf(image) > -1) {
        file = await imageCompressor.compress(file, this.compressOptions);
      }

      // 文件名-时间戳 作为上传文件key
      let pos = name.lastIndexOf(".");
      let suffix = "";
      if (pos > -1) {
        suffix = name.substring(pos);
      }
      key = `${name.substring(0, pos)}-${Date.now()}${suffix}`;

      return Promise.resolve([filename, key]);
    },
    uploadSuffix(res, filename) {
      res.name = encodeURIComponent(res.name);
      if (this.customDomain) {
        if (this.customDomain.indexOf(doubleSlash) > -1) {
          filename = `${this.customDomain}/${res.name}`;
        } else filename += `${this.customDomain}/${res.name}`;
      } else {
        filename += `${this.ossConfig.bucket}.${this.ossConfig.region}.aliyuncs.com/${res.name}`;
      }
      this.$emit("input", this.multiple ? this.uploadList.concat(filename) : filename);
      process.env.NODE_ENV === "development" && console.log(filename);
    },
    async uploadAli(file, data) {
      // 上传到阿里云
      let fixedNumber = "";
      let key = "";
      await this.uploadPreCheck(files[i]).then(res => ([filename, key] = res));
      if (!filename) return;

      await this.client
        .multipartUpload(this.dir + key, data, this.uploadOptions)
        .then(res => {
          this.uploadSuffix(res, filename);
          this.cropperModel = false;
        })
        .catch(err => {
          this.uploading = false;
          // 捕获超时异常
          if (err.code === "ConnectionTimeoutError") {
            this.$emit("timeout");
          }
          if (this.client.isCancel()) {
            this.$emit("cancel");
          } else {
            this.$emit("fail");
          }
        });
    },
    async upload(e, type = target) {
      // 防止loading过程重复上传
      if (this.loading) return;

      let files = Array.from(e[type].files);
      let currentUploads = [];

      if (!files.length) return;
      if (files.some(i => i.size > this.size * oneKB)) {
        this.$message.error(`请选择${parseInt(this.size / 1024)}M内的文件！`);
        return;
      }

      if (
        this.accept &&
        (this.accept.indexOf("/*") > -1
          ? files.some(i => i.type.indexOf(this.accept.match(mimeTypeHalfRegex)) === -1)
          : files.some(i => this.accept.indexOf(i.type) === -1))
      ) {
        alert("文件格式有误！");
        return;
      }

      const reset = () => (e.target.value = "");
      this.uploading = true;
      const max = this.multiple ? this.max : 1;
      for (let i = 0; i < files.length; i++) {
        if (this.uploadList.length === max) break;
        let filename = "";
        let key = "";
        await this.uploadPreCheck(files[i]).then(res => ([filename, key] = res));
        if (!filename) break;

        await this.client
          .multipartUpload(this.dir + key, files[i], this.uploadOptions)
          .then(res => {
            this.uploadSuffix(res, filename);
            currentUploads.push(filename);
            if (this.cropper && files.length === 1) {
              this.cropperModel = true;
              this.uploadInfo = files[0];
              this.imgUrl = filename;
            }
          })
          .catch(err => {
            reset();
            this.uploading = false;
            // 捕获超时异常
            if (err.code === "ConnectionTimeoutError") {
              this.$emit("timeout");
            }
            if (this.client.isCancel()) {
              this.$emit("cancel");
            } else {
              this.$emit("fail");
            }
          });

        this.newClient();
      }

      reset();
      this.uploading = false;
      // 没有一张上传成功的，不触发load事件
      if (currentUploads.length < 1) return;
      /**
       * 上传完成后触发的事件,返回url
       * 上传单张 返回 String,
       * 上传多张 返回 此次成功上传的文件url数组
       * @event loaded
       */
      if (this.multiple) {
        this.$emit("loaded", currentUploads);
      } else {
        this.$emit("loaded", currentUploads[0]);
      }
    },
    paste(e) {
      let files = e.clipboardData && e.clipboardData.files;
      if (files && files.length) this.upload(e, clipboardData);
    },

    /**
     * 拖拽事件
     */
    onDragover(e) {
      e.preventDefault();
      this.addHighlight();
    },
    onDrop(e) {
      e.preventDefault();
      this.removeHighlight();

      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) this.upload(e, dataTransfer);
    },
    addHighlight() {
      this.isHighlight = true;
    },
    removeHighlight() {
      this.isHighlight = false;
    },
    cropperFinish() {
      // 图片剪切完成
      this.$refs.cropperRef.getCropBlob(data => {
        this.uploadAli(this.uploadInfo, data);
        //上传阿里云服务器
      });
    }
  },
  async mounted() {
    await this.setOssConfig();
    if (this.ossConfig && Object.values(this.ossConfig).some(v => !v)) {
      console.error("必要参数不能为空: region bucket accessKeyId accessKeySecret");
      return;
    }
    if (this.accept && !mimeTypeFullRegex.test(this.accept)) {
      console.warn(
        "请设置正确的`accept`属性, 可参考:",
        "https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types"
      );
    }
    this.newClient();
  }
};
</script>
<style lang="scss">
$border-color: #cad1e8;
$active-color: #5d81f9;

.upload_to_oss {
  display: inline-block;

  .disabled {
    pointer-events: none;
  }

  .upload_item,
  .upload_box {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    border-radius: 3px;
    border: 1px solid $border-color;

    &:hover {
      border-color: $active-color;
      background-color: #5d81f914;
    }
  }

  .is_preview {
    &:hover {
      cursor: zoom-in;
    }
  }

  .upload_item {
    position: relative;
    margin: 0 8px 0 0;
  }

  .upload_placeholder,
  .upload_loading {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .upload_placeholder {
    &:before {
      width: 2px;
      height: 20px;
      background-color: $border-color;
    }

    &:after {
      width: 20px;
      height: 2px;
      background-color: $border-color;
    }
  }

  .upload_placeholder:before,
  .upload_placeholder:after,
  .upload_del_icon:before,
  .upload_del_icon:after,
  .upload_loading:before {
    content: "";
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .upload_loading {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 3px;
    transition: opacity 0.3s;

    @keyframes is-loading {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes loading-dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }

      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -40px;
      }

      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -120px;
      }
    }

    .circular {
      position: absolute;
      left: 50%;
      top: 50%;
      height: 35px;
      width: 35px;
      margin-left: -18px;
      margin-top: -18px;
      -webkit-animation: is-loading 2s linear infinite;
      animation: is-loading 2s linear infinite;
    }

    .path {
      -webkit-animation: loading-dash 1.5s ease-in-out infinite;
      animation: loading-dash 1.5s ease-in-out infinite;
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      stroke-width: 2;
      stroke: #5d81f9;
      stroke-linecap: round;
    }
  }

  .upload_del_icon {
    position: absolute;
    right: -8px;
    top: -8px;
    width: 16px;
    height: 16px;
    background-color: $border-color;
    border-radius: 50%;
    line-height: 16px;
    transform: rotate(45deg);
    z-index: 1;
    cursor: pointer;

    &:before {
      width: 1px;
      height: 8px;
      background: #fff;
    }

    &:after {
      width: 8px;
      height: 1px;
      background: #fff;
    }
  }

  .upload_img {
    position: absolute;
    width: 100%;
    max-height: 100%;
    display: block;
    top: 50%;
    transform: translate(0, -50%);
  }

  .upload_input {
    display: none;
  }

  .upload_area {
    cursor: pointer;
    display: inline-block;
  }

  .upload_tip {
    margin-top: 8px;
    color: #606266;
    font-size: 12px;
  }
}

.upload_to_oss_highlight {
  .upload_box {
    border-color: $active-color;
    background-color: #5d81f914;
  }
}
.cropper_content {
  .cropper {
    width: auto;
    height: 300px;
  }
}
</style>
