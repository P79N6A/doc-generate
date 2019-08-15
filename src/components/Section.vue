<template>
  <div class="section">
    <h2 v-if="content.subTitle" class="subTitle">{{content.subTitle}}</h2>
    <pre class="sub-sketch">{{content.subSketch}}</pre>

    <DocDemo :displayVmodel="content.displayVmodel" v-if="content.needDemo">
      <template v-slot:display v-if="content.displayVmodel">
        <div>{{content.displayText}}{{vmodelResult}}</div>
      </template>
      <template v-slot:default>
        <slot></slot>
      </template>
    </DocDemo>
    <DocCollapse :needCollapse="content.needCollapse && content.needDemo">
      <div style="padding:9px 0"></div>
      <div v-if="discriptionLength">
        <template v-for="(segment,index) in content.discription">
          <!--text><-->
          <pre class="text" v-if="segment.text">{{segment.text}}</pre>
          <!--#text#><-->

          <!--code><-->
          <div class="block" v-if="segment.code">
            <prism :language="segment.code.language">{{tryStr2Json(segment.code.content)}}</prism>
          </div>
          <!--#code#><-->

          <!--table><-->
          <template v-if="segment.table">
            <pre class="textForTable" v-if="segment.table.text">{{segment.table.text}}</pre>
            <div class="table">
              <Table :data="content.discription[index].table.data" border stripe>
                <template v-for="(value,key) in content.discription[index].table.head">
                  <TableColumn :prop="value" :label="value"></TableColumn>
                </template>
              </Table>
            </div>
          </template>
          <!--#table#><-->
        </template>
      </div>
    </DocCollapse>
  </div>
</template>

<script>
import ElCol from "@360es/esui-components";
import Vue from "vue";
import { _cloneDeep } from "lodash";
//import bus from "../eventBus";
import DocDemo from "../components/Deemo.vue";
import DocCollapse from "../components/Collapse.vue";

import Prism from "prismjs";
import "prismjs/themes/prism-coy.css";
import "prismjs/components/prism-json";
import "prismjs/plugins/highlight-keywords/prism-highlight-keywords.min";
import "prismjs/plugins/toolbar/prism-toolbar.min";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min";
import "prismjs/plugins/show-language/prism-show-language.min";
import "prismjs/plugins/unescaped-markup/prism-unescaped-markup.min";
import "prismjs/plugins/unescaped-markup/prism-unescaped-markup.css";
import prism from "vue-prism-component";

export default {
  components: {
    ElCol,
    DocDemo,
    DocCollapse,
    prism
  },
  data() {
    return {};
  },
  props: {
    content: {
      subTitle: String,
      subSketch: String,
      discription: Object /*[{'text': string, 'code': {'content':string, 'language':string}, 'table':[]] */,
      displayText: String,
      id: 1,
      displayVmodel: Boolean,
      needDemo: Boolean,
      needCollapse: Boolean
    },
    vmodelResult: String
  },
  methods: {
    tryStr2Json(str) {
      try {
        str = JSON.parse(str);
      } catch (e) {
        try {
          str = eval("(" + str + ")");
        } finally {
          return str;
        }
      }
      return str;
    }
  },
  computed: {
    discriptionLength: function() {
      let length = 0;
      for (let key in this.content.discription) {
        length++;
      }
      return length;
    }
  },
  mounted() {
    debugger;
    Prism.highlightAll();
  }
};
</script>
