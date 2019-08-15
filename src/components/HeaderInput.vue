<template>
  <div class="formBorder">
    <Row :gutter="20" class="inputSheet" type="flex" align="middle">
      <Col :span="10">
        <Input id="title" v-model="content.title" placeholder="标题" />
      </Col>
      <Col :span="1">
        <span>by</span>
      </Col>
      <Col :span="5">
        <Input id="coder" v-model="content.coder" placeholder="作者(选填)" />
      </Col>
      <Col :span="8" v-if="content.coder">
        <Input id="coder url" v-model="content.coderUrl" placeholder="作者主页连接(选填)">
          <template #prepend>https://</template>
        </Input>
      </Col>
    </Row>
    <Textarea class="inputSheet" v-model="content.sketch" placeholder="概述(选填)" />

    <div v-if="content.buttons.length" class="inputSheet">
      <template v-for="(infoButton,index) in content.buttons">
        <Row class="inputSheetChild">
          <Col :span="8">
            <Input id="button url" v-model="infoButton.url" placeholder="链接">
              <template #prepend>https://</template>
            </Input>
          </Col>
          <Col :span="8" :offset="1">
            <Input id="button name" v-model="infoButton.name" placeholder="填充文字" />
          </Col>
          <Col :span="3" :offset="4">
            <Button type="danger" @click="deleteInfoButton(infoButton)">删除</Button>
          </Col>
        </Row>
      </template>
    </div>
    <Button @click="addButton()" class="inputSheet">添加扩展信息按钮</Button>
  </div>
</template>

<script>
import { Input, Textarea } from "@360es/esui-components";
import Vue from "vue";
//import _cloneDeep from "lodash";
export default {
  model: {
    prop: "content",
    event: "change"
  },
  data() {
    return {};
  },
  methods: {
    addButton() {
      Vue.set(this.content.buttons, this.content.buttons.length, {
        url: "",
        name: ""
      });
      //this.content.buttons.push({ url: "", name: "" });
    },
    deleteInfoButton(infoButton) {
      for (let btn in this.content.buttons) {
        this.content.buttons.splice(
          this.content.buttons.findIndex(item => item === infoButton),
          1
        );
        break;
      }
    }
  },
  props: {
    content: {
      title: String,
      sketch: String,
      coder: String,
      coderUrl: String,
      buttons: Array
    }
  }
};
</script>

<style>
.el-input-group__prepend {
  color: #909399 !important;
}
</style>
