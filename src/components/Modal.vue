<template>
  <div>
    <!-- 登录 -->
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{ 'md-show':mdShow }">
      <!-- class="md-show" -->
      <div class="md-modal-inner">
        <div class="md-top">
          
          <button class="md-close" @click="Closes">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <!-- <div class="error-wrap">
                            <span class="error error-show" v-show="errorTip"></span>
            </div>-->
            <!-- 插槽信息提示 -->
            <slot name="message"></slot>
          </div>
          <div class="btn-wrap">
            <slot name="btnGroup"></slot>
          </div>
        </div>
      </div>
      <!-- 遮罩层 -->
    </div>
    <div class="md-overlay" v-if="mdShow"></div>
  </div>
</template>

<script>
export default {
  props: ["mdShow"], //接受父组件传过来的值,子组件没办法修改父组件,但可以通过手段来修改
  methods: {
    Closes() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
</style>