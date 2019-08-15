<template>
  <div class="section" v-if="fresh">
    <h2 v-if="content.subTitle" class="subTitle">{{content.subTitle}}</h2>
    <pre class="sub-sketch">{{content.subSketch}}</pre>

    <DocDemo :displayVmodel="content.displayVmodel" v-if="content.needDemo">
      <template v-slot:display v-if="content.displayVmodel">
        <div>{{content.displayText}}{{result}}</div>
      </template>
      <template v-slot:default>
        <div :id="demoId"></div>
      </template>
    </DocDemo>

    <DocCollapse :needCollapse="content.needCollapse && content.needDemo">
      <div style="padding:9px 0"></div>
      <div v-if="discriptionLength">
        <template v-for="(segment,index) in content.discription">
          <!-- text><-->
          <pre class="text" v-if="segment.text">{{segment.text}}</pre>
          <!--#text#><-->

          <!--code><-->
          <div v-if="isCompleteCode(segment.code)">
            <div class="block" v-if="segment.code">
              <prism :language="segment.code.language">{{str2json(segment.code.content)}}</prism>
            </div>
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
          <!--table><-->
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

import "prismjs";
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
    return {
      apps: [],
      show: false,
      needvmodel: false,
      result: "",
      fresh: true,
      demoId: ""
    };
  },
  props: {
    content: {
      subTitle: String,
      subSketch: String,
      props: Object /*{prop-name: value,...} */,
      discription: Object /*[{'text': string, 'code': {'content':string, 'language':string}] */,
      comps: Array /*[{'app':string, 'path':string}]*/,
      displayText: String,
      displayVmodel: Boolean,
      id: Number,
      needDemo: Boolean,
      needCollapse: Boolean
      //command: String
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
  created() {
    /*this.mountDIY(this.content.id);
    bus.$on("mountDIY", id => {
      this.mountDIY(id);
    });*/
  },
  methods: {
    isCompleteCode(code) {
      //debugger;
      //console.log(this.content.discription);
      let language = ["json", "javascript", "html"];
      if (code && code.language && code.content)
        if (language.indexOf(code.language) !== -1)
          //console.log("is");
          return true;
      return false;
    },
    str2json(str) {
      //debugger;
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
    },
    /*mountDIY(id) {
      if (id === this.content.id) {
        if (this.demoId === "") {
          this.demoId = "demo" + this.content.id.toString();
        }
        let demoId = this.demoId;
        try {
          let src = this.content.comps[0].path;
          var compName = this.content.comps[0].app;
        } catch (e) {
          console.log("when finding component:" + e.discription);
          return;
        }

        var comp;
        import(`../packages/${this.content.comps[0].path}/src/index`).then(
          modules => {
            let moduleLength = 0;
            let count = 0;
            for (let key in modules) {
              moduleLength++;
            }
            for (var key in modules) {
              if (
                key === this.content.comps[0].app ||
                (key === "default" && moduleLength === 1)
              ) {
                comp = modules[key];
                break;
              } else {
                count++;
                if (count === moduleLength) {
                  console.log("can't find the model");
                  return;
                }
              }
            }

            if (this.content.displayVmodel) {
              var vmodelProp = comp.model.prop;
              var vmodelEvent = comp.model.event;
            }
            let demoComponent = Vue.extend(comp);
            let props = this.content.props;
            let _this = this;
            var demo = new demoComponent({
              props: {},
              created() {
              

                for (key in props)
                  if (key in this.$props) {
                    if (props[key] === "TrueOrFalse") {
                      //is a word command
                      this.$props[key] = !this.$props[key];
                    } else {
                      let jsonArr = new RegExp(
                        /^\s*\[\s*\{.*\},]*\{.*\}\s*\]\s*$/
                      );
                      let trick = new RegExp(/^\s*\[\s*\{\s*|.*\}\s*\]/);
                      if (jsonArr.test(props[key]) || trick.test(props[key]))
                        this.$props[key] = _this.str2json(props[key]);
                      else this.$props[key] = props[key];
                    }
                  } else {
                    console.log(
                      "can't find the prop: " + key + " in the diy component"
                    );
                  }
            

               
                if (_this.content.displayVmodel) {
                  this.$props[vmodelProp] = _this.result;
                  this.$on(vmodelEvent, e => (_this.result = e));
                }
              }
            });
            demo.$mount();
            let mountNode = document.getElementById(demoId);
            while (mountNode.hasChildNodes()) {
              mountNode.removeChild(mountNode.firstChild);
            }
            mountNode.appendChild(demo.$el);
            return demo;
          },
          function(err) {
            console.log("when finding component: " + err.discription);
            return;
          }
        );
      }
    },*/
    beforeDestroy() {
      //bus.$off("mountDIY", id);
    }
  }
};
</script>

<style>
</style>
