<template>
  <div class="shadow">
    <template v-if="displayVmodel">
      <Row type="flex" justify="space-between">
        <Col :span="10">
          <slot></slot>
        </Col>
        <Col :span="10" :offset="2">
          <slot name="display"></slot>
        </Col>
      </Row>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    displayVmodel: Boolean
  }
};
</script>

<style>
</style>
