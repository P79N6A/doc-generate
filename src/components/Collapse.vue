<template>
  <div>
    <div v-if="needCollapse">
      <CollapseTransition>
        <div v-show="show" class="contentShadow">
          <slot></slot>
        </div>
      </CollapseTransition>
      <Button type="plain" @click="transfer()" class="controllShadow">{{content}}</Button>
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import CollapseTransition from "@360es/esui-components";
export default {
  data() {
    return {
      show: false,
      content: ""
    };
  },
  props: {
    contentFolding: {
      default: function() {
        return "显示代码";
      }
    },
    contentUnfolding: {
      default: function() {
        return "隐藏代码";
      }
    },
    needCollapse: Boolean
  },
  methods: {
    transfer() {
      this.show = !this.show;
      if (this.content === this.contentFolding)
        this.content = this.contentUnfolding;
      else this.content = this.contentFolding;
    }
  },
  created() {
    this.content = this.contentFolding;
  }
};
</script>

<style>
</style>
