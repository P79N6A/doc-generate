<template>
  <div>
    <DocHeader :content="hdContent" v-if="freshDocHeader"></DocHeader>

    <Tooltip class="item" effect="dark" content="Header Edit Tool Bar" placement="left">
      <Button
        style="width:35px;height:35px"
        class="suspendHeaderBtn"
        @click="showHeaderEdit"
        type="primary"
        circle
        :icon="hdIcon"
      ></Button>
    </Tooltip>

    <CollapseTransition>
      <div v-show="headerEdit" style="margin:10px">
        <Row>
          <Col :span="16" :offset="4">
            <HeaderInput v-model="hdContent"></HeaderInput>
          </Col>
        </Row>
      </div>
    </CollapseTransition>

    <DocContent v-if="freshDocContent">
      <template v-for="section in sections">
        <div :id="section.id">
          <DocSectionDisplay :content="section"></DocSectionDisplay>
        </div>
      </template>
    </DocContent>

    <Tooltip class="item" effect="dark" content="Content Edit Tool Bar" placement="left">
      <Button
        class="suspendContentBtn"
        style="width:35px;height:35px"
        @click="showContentEdit"
        type="primary"
        circle
        :icon="conIcon"
      ></Button>
    </Tooltip>

    <CollapseTransition>
      <div v-show="contentEdit" style="margin:10px">
        <Row>
          <Col :span="16" :offset="4">
            <div class="formBorder">
              <template v-for="(section,index) in sections">
                <ContentInput v-model="sections[index]">
                  <template #deleteBtn>
                    <Button type="danger" icon="el-icon-delete" @click="deleteSection(index)"></Button>
                  </template>
                </ContentInput>
              </template>
              <Row class="inputSheet">
                <Button @click="addSection" style="padding-top:10px">添加子块</Button>
                <Button @click="generateFile" style="padding-top:10px" type="warning">生成文档</Button>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </CollapseTransition>
  </div>
</template>

<script>
import Vue from "vue";
//import bus from "../eventBus";
import cloneDeep from "lodash";
import HeaderInput from "@/components/HeaderInput";
import ContentInput from "@/components/ContentInput.vue";
import DocSectionDisplay from "@/components/Section4Display.vue";
export default {
  components: {
    HeaderInput,
    ContentInput,
    DocSectionDisplay
  },
  data() {
    return {
      hdContent: {
        title: "",
        sketch: "",
        coder: "",
        coderUrl: "",
        buttons: []
      },
      sections: {},
      sectionCount: 0,
      freshDocContent: true,
      freshDocHeader: true,
      hdIcon: "el-icon-close",
      conIcon: "el-icon-close",
      headerEdit: true,
      contentEdit: true,
      compName: ""
    };
  },
  watch: {
    "hdContent.buttons": {
      handler: function() {
        this.freshDocHeader = false;
        this.$nextTick(function() {
          this.freshDocHeader = true;
        });
      },
      deep: true
    }
  },
  methods: {
    addSection() {
      Vue.set(this.sections, this.sectionCount.toString(), {
        id: this.sectionCount,
        subTitle: "",
        subSketch: "",
        props: {},
        comps: [],
        discription: {},
        displayText: "",
        displayVmodel: false,
        command: "",
        needDemo: true
      });
      this.sectionCount++;
    },
    deleteSection(index) {
      Vue.delete(this.sections, index);
      this.freshDocContent = false;
      this.$nextTick(function() {
        this.freshDocContent = true;
      });
      for (let key in this.sections) {
        //console.log(this.sections);
        //console.log(key);
        //debugger;
        bus.$emit("mountDIY", this.sections[key].id);
      }
    },
    showHeaderEdit() {
      if (this.headerEdit) {
        this.hdIcon = "el-icon-plus";
      } else {
        this.hdIcon = "el-icon-close";
      }
      this.headerEdit = !this.headerEdit;
    },
    showContentEdit() {
      if (this.contentEdit) {
        this.conIcon = "el-icon-plus";
      } else {
        this.conIcon = "el-icon-close";
      }
      this.contentEdit = !this.contentEdit;
    },
    generateFile() {
      let aTag = document.createElement("a");
      let content = this.exportVueFile();
      let blob = new Blob([content]);
      aTag.download = `${this.hdContent.title}.vue`;
      aTag.href = URL.createObjectURL(blob);
      aTag.click();
      URL.revokeObjectURL(blob);
      document.body.removeChild(aTag);
    },
    exportVueFile() {
      let text = "";

      //template part
      text += "<template>\n";
      text += "\t<div>\n";
      //add header
      text += '\t\t<DocHeader :content="hdContent"></DocHeader>\n';
      //add content
      text += "\t\t<DocContent>\n";
      //add sections
      let count = 0;
      for (let key in this.sections) {
        let id = "section" + count.toString();
        let vmodel = "";
        if (this.sections[key].displayVmodel)
          vmodel = `:vmodelResult="vmodelResults.${id}"`;
        text += `\t\t\t<DocSection id="${id}" :content="${id}" ${vmodel}>\n\t\t\t\t<!--enter the demo code there><-->\n\t\t\t<\/DocSection>\n`;
        count++;
        //console.log(text);
        //debugger;
      }
      text += "\t\t</DocContent>\n";
      text += "\t</div>\n";
      text += "</template>\n\n";

      //script part
      text += "<script>\n";
      text += "export default {\n";
      text += "\tcomponents: {},\n"; //component
      text += "\tdata() {\n";
      text += "\t\treturn {\n";
      //data
      //hdContent data
      text += `hdContent: ${JSON.stringify(this.hdContent, null, 2)},\n`;
      //sections data
      let content = _.cloneDeep(this.sections);
      let vmodelResults = {};
      count = 0;
      for (let key in content) {
        let id = "section" + count.toString();
        delete content[key].props;
        delete content[key].comps;
        content[key].id = count;
        text += `${id}:${JSON.stringify(content[key], null, 2)},\n`;

        //judge v-model
        if (content[key].displayVmodel === true) {
          vmodelResults[id] = "";
        }
        count++;
      }
      //v-model result data
      text += `vmodelResults: ${JSON.stringify(vmodelResults, null, 2)}\n`;

      debugger;

      text += "\t\t};\n";
      text += "\t}\n";
      text += "};\n";
      text += "</" + "script>";

      return text;
    }
  }
};
</script>

<style lang="less">
.suspendHeaderBtn {
  position: fixed;
  top: 46%;
  right: 2%;
  z-index: 500;
}

.suspendContentBtn {
  position: fixed;
  top: 50%;
  right: 2%;
  z-index: 500;
}
</style>
