<template>
  <div class="formBorder" style="border-style:dashed">
    <div>
      <div class="inputSheet">section{{this.content.id}}:</div>
      <!--subtitle and subsketch><-->
      <Input id="subTitle" class="inputSheet" v-model="content.subTitle" placeholder="副标题" />
      <Input id="subSketch" class="inputSheet" v-model="content.subSketch" placeholder="副概述" />
      <!--#subtitle and subsketch#><-->

      <!--need demo and collapse><-->
      <Checkbox class="inputSheet" v-model="content.needDemo" checked>展示组件</Checkbox>
      <Checkbox
        checked
        class="inputSheet"
        v-if="content.needDemo"
        v-model="content.needCollapse"
      >折叠具体信息</Checkbox>
      <div v-if="content.needDemo" class="inputSheet">
        <!--package><-->
        <div v-if="content.comps" class="inputSheet">
          <template v-for="(comp,index) in content.comps">
            <div class="inputSheetChild">
              <Row :gutter="20" type="flex" align="middle">
                <Col :span="4">import</Col>
                <Col :span="8">
                  <Input
                    id="import component"
                    v-model="content.comps[index].app"
                    placeholder="component"
                    @input="mountDIY"
                  />
                </Col>
                <Col :span="4">from</Col>
                <Col :span="8">
                  <Input
                    id="import package"
                    v-model="content.comps[index].path"
                    placeholder="package"
                    @input="mountDIY"
                  />
                </Col>
              </Row>
            </div>
          </template>
        </div>

        <!--command><-->
        <Input
          id="command"
          class="inputSheet"
          v-model="content.command"
          placeholder="command(选填)"
          @input="mountDIY"
        />

        <!--v-model><-->
        <Row class="inputSheet">
          <Col :span="6">
            <Checkbox v-model="content.displayVmodel" @change="mountDIY">绑定v-model</Checkbox>
          </Col>
          <Col :span="18">
            <template v-if="content.displayVmodel">
              <Input id="display info" v-model="content.displayText" placeholder="v-model的描述文字" />
            </template>
          </Col>
        </Row>

        <!--props><-->
        <div v-if="content.props" class="inputSheet">
          <template v-for="(item, index) in content.props">
            <div class="inputSheetChild" v-show="propsInput[index]">
              <div>{{valueName[index]}}:</div>
              <Textarea :id="index" v-model="content.props[index]" @input="watchProp(index,item)"></Textarea>
            </div>
          </template>
        </div>
      </div>
      <!--#need demo and collapse#><-->

      <!--discriptions><-->
      <template v-for="(segment,index) in content.discription">
        <!-- a segment><-->
        <div class="inputSheet formBorder" style="border-style:dotted">
          <!--text><-->
          <Textarea
            class="inputSheetChild"
            v-model="content.discription[index].text"
            placeholder="文本"
          />
          <!--#text><-->

          <!--code><-->
          <Textarea
            class="inputSheetChild"
            v-if="content.discription[index].code"
            v-model="content.discription[index].code.content"
            placeholder="代码"
          />
          <!--#code#><-->

          <!--language><-->
          <Select
            v-model="content.discription[index].code.language"
            v-if="content.discription[index].code"
            class="inputSheetChild"
            placeholder="语言"
          >
            <Option
              v-for="item in languageOptions"
              :key="item.key||item"
              :value="item.value||item"
              :label="item.label||item"
            ></Option>
          </Select>
          <!--#language#><-->

          <!--table><-->
          <template v-if="content.discription[index].table && freshTable" class="inputSheet">
            <Textarea
              class="inputSheetChild"
              v-model="content.discription[index].table.text"
              placeholder="表格说明"
            />
            <Table
              :data="content.discription[index].table.data"
              v-if="content.discription[index].table.head.length!==0"
              border
              stripe
              class="inputSheetChild"
            >
              <template v-for="(value,key) in content.discription[index].table.head">
                <TableColumn :prop="value" :label="value">
                  <template #header="scope">
                    <div style="width:100%">
                      <Input
                        v-model="scope.column.label"
                        class="tableHeadInput"
                        style="padding:0; max-width:70%"
                        @change="handleColumnEdit(scope,scope.column,index)"
                      />
                      <div style="padding:0;float:right">
                        <Button
                          size="medium"
                          v-if="scope.column.lable!=='操作'"
                          icon="el-icon-delete"
                          type="danger"
                          @click="handleColumnDelete(scope.column, index)"
                        ></Button>
                      </div>
                    </div>
                  </template>
                  <template #default="scope">
                    <Input
                      v-model="scope.row[value]"
                      @change="handleLineEdit(scope.$index,scope.row, index)"
                    />
                  </template>
                </TableColumn>
              </template>
              <TableColumn label="操作">
                <template #default="scope">
                  <Button
                    size="small"
                    type="danger"
                    @click="handleLineDelete(scope.$index, scope.row, index)"
                  >删除</Button>
                </template>
              </TableColumn>
            </Table>

            <!-- button for table><-->
            <Row :gutter="10" class="inputSheetChild">
              <Col :span="6">
                <Input size="small" v-model="newColumn[index]" placeholder="新增列名" />
              </Col>
              <Col :span="18">
                <Button size="small" @click="addColumn(content.discription[index].table, index)">加列</Button>
                <Button size="small" @click="addLine(content.discription[index].table)">加行</Button>
              </Col>
            </Row>
            <!-- #button for table#><-->
          </template>
          <!--#table#><-->

          <!--buttons in a segment><-->
          <Row class="inputSheetChild">
            <Button
              :type="btnState[index].code.state"
              size="small"
              @click="alterCode(content.discription[index],index)"
            >{{ btnState[index].code.text }}</Button>
            <Button
              size="small"
              :type="btnState[index].table.state"
              @click="alterTable(content.discription[index],index)"
            >{{ btnState[index].table.text }}</Button>
            <Button
              size="small"
              icon="el-icon-delete"
              type="danger"
              style="float:right"
              @click="deleteSegment(index)"
            ></Button>
          </Row>
          <!--#buttons in a segment#><-->
        </div>
        <!--#a segment#><-->
      </template>
      <!--#discription#><-->

      <!--buttons for a section><-->
      <Row class="inputSheet">
        <Button v-if="content.needDemo" @click="addComp()">添加component</Button>
        <Button @click="addSegment()">添加段落</Button>
        <div style="float:right">
          <slot name="deleteBtn"></slot>
        </div>
      </Row>
      <!--#buttons for a section#><-->
    </div>
  </div>
</template>

<script>
import { Input, Textarea, Checkbox } from "@360es/esui-components";
import Vue from "vue";
import compact from "lodash";
//import bus from "../eventBus";
export default {
  model: {
    prop: "content",
    event: "change"
  },
  props: {
    content: {
      subTitle: String,
      subSketch: String,
      props: Object /*{prop-name: value,...} */,
      comps: Array /*[{'app':string, 'path':string}]*/,
      discription: Object /*[{'text': string, 'code': {'content':string, 'language':string}}]*/,
      displayText: String,
      displayVmodel: Boolean,
      id: Number,
      command: String,
      needDemo: Boolean,
      needCollapse: Boolean
    }
  },
  data() {
    return {
      discriptionCount: 0,
      valueName: {},
      propsInput: {},
      newColumn: {},
      freshTable: true,
      hasVmodel: false,
      btnState: {},
      languageOptions: [
        "json",
        "javascript",
        { label: "html (VUE文件选择此项)", value: "html", key: "html" }
      ]
    };
  },

  created() {},
  methods: {
    commandDecode(command) {
      let reg = /<.+>.*/; //the html format
      let vbind = new RegExp(/^:.+|^v-bind:.+/);
      let unprefixedCmd = new RegExp(/^\w+$/);
      let von = new RegExp(/^@.+|^v-on:.+/);
      let vmodel = new RegExp(/^v-model/);
      //let bind = new RegExp(/^[a-zA-Z\_][a-zA-Z\-\_]+$/);

      if (!reg.test(command)) {
        return {};
      }

      command = _.compact(command.split(/(<[^<>]+>)/))[0]; //find <...>
      command = command.substr(1, command.length - 2); //get string in <...>
      let msg = command.split(" "); // split by space
      msg = _.compact(msg); // remove the empty element
      let props = {};

      for (let x = 1; x < msg.length; x++) {
        let left = msg[x].split("=")[0];
        let right = msg[x].split("=")[1];

        if (unprefixedCmd.test(left)) {
          if (right) {
            let name = left;
            let prop = right;
            try {
              if (prop.indexOf('"') != -1) prop = prop.split('"')[1];
              else prop = prop.split("'")[1];
              props[name] = prop;
              Vue.set(this.valueName, name, name);
            } catch (e) {
              console.log("when decoding simple field:" + e.discription);
            }
          } else {
            props[msg[x]] = "TrueOrFalse";
            Vue.set(this.valueName, msg[x], msg[x]);
          }
        } else if (vbind.test(left)) {
          //v-bind
          let name = left.split(":")[1];
          let prop = right;
          try {
            if (prop.indexOf('"') != -1) prop = prop.split('"')[1];
            else prop = prop.split("'")[1];
            if (prop === "true" || prop === "false") {
              props[name] = prop;
              Vue.set(this.valueName, name, name);
            } else {
              props[name] = "";
              Vue.set(this.valueName, name, prop);
            }
          } catch (e) {
            console.log("when decoding v-bind field:" + e.discription);
          }
        } else if (von.test(left)) {
          //v-on
          console.log("detect a v-on field");
        } else if (vmodel.test(left)) {
          //v-model
          this.hasVmodel = true;
        } else if (bind.test(left)) {
        } else {
          console.log("can't solve the field:" + msg[x]);
        }
      }
      return props;
    },
    addComp() {
      //debugger;
      Vue.set(this.content.comps, this.content.comps.length, {
        app: "",
        path: ""
      });
    },
    addSegment() {
      //debugger;
      //add discription block
      Vue.set(this.content.discription, this.discriptionCount.toString(), {
        text: ""
      });
      //add the new column new
      Vue.set(this.newColumn, this.discriptionCount.toString(), "");
      //add the button state
      Vue.set(this.btnState, this.discriptionCount.toString(), {
        code: { state: "primary", text: "添加代码块" },
        table: { state: "primary", text: "添加表格" }
      });
      this.discriptionCount++;
    },
    alterTable(segment, index) {
      //debugger;
      let table = "";
      if (segment.table) {
        Vue.delete(this.content.discription[index], "table");
        table = { state: "primary", text: "添加表格" };
      } else {
        Vue.set(segment, "table", {
          data: [],
          head: ["name"],
          text: ""
        });
        table = { state: "danger", text: "删除表格" };
      }
      Vue.set(this.btnState[index], "table", table);
    },
    alterCode(segment, index) {
      let code = "";
      if (segment.code) {
        Vue.delete(this.content.discription[index], "code");
        code = { state: "primary", text: "添加代码块" };
      } else {
        Vue.set(segment, "code", { language: "", content: "" });
        code = { state: "danger", text: "删除代码块" };
      }
      Vue.set(this.btnState[index], "code", code);
    },
    deleteSegment(index) {
      Vue.delete(this.content.discription, index);
    },
    deleteTable(segment) {
      Vue.delete(this.content.discription, "table");
    },
    deleteCode(segment) {
      Vue.delete(this.content.discription, "code");
    },
    addColumn(table, index) {
      debugger;
      let newName = this.newColumn[index];
      if (table.head.indexOf(newName) !== -1) {
        console.log("repeated");
        return;
      }
      Vue.set(table.head, table.head.length, newName);
      for (let line in table.data) {
        table.data[line][newName] = "";
      }
      this.freshTable = false;
      this.$nextTick(function() {
        this.freshTable = true;
      });
    },
    addLine(table) {
      let data = {};
      for (let prop in table.head) {
        data[table.head[prop]] = "";
      }
      Vue.set(table.data, table.data.length, data);

      this.freshTable = false;
      this.$nextTick(function() {
        this.freshTable = true;
      });
    },
    handleColumnEdit(scope, column, discriptionIndex) {
      debugger;
      let col;
      for (let id in scope.store.states.columns) {
        if (scope.store.states.columns[id].id === column.id) {
          col = id;
          break;
        }
      }
      //let col = parseInt(column.id.slice(column.id.indexOf("column_") + 7)) - 1;
      let originHeader = this.content.discription[discriptionIndex].table.head[
        col
      ];
      Vue.set(
        this.content.discription[discriptionIndex].table.head,
        col,
        column.label
      );
      for (let line in this.content.discription[discriptionIndex].table.data) {
        //this.content.discription[discriptionIndex].table.data[line];
        this.content.discription[discriptionIndex].table.data[
          line
        ] = JSON.parse(
          JSON.stringify(
            this.content.discription[discriptionIndex].table.data[line]
          ).replace(originHeader, column.label)
        );
      }

      this.freshTable = false;
      this.$nextTick(function() {
        this.freshTable = true;
      });
    },
    handleColumnDelete(column, discriptionIndex) {
      debugger;
      let propName = column.property;
      for (let line in this.content.discription[discriptionIndex].table.data) {
        Vue.delete(line, propName);
      }
      let header = this.content.discription[discriptionIndex].table.head;
      Vue.delete(header, header.indexOf(propName));

      this.freshTable = false;
      this.$nextTick(function() {
        this.freshTable = true;
      });
    },
    handleLineEdit(index, row, discriptionIndex) {
      Vue.set(
        this.content.discription[discriptionIndex].table.data,
        index,
        row
      );
    },
    handleLineDelete(index, row, discriptionIndex) {
      /*console.log("handdl delete action");
      console.log(index, row, discriptionIndex);*/
      debugger;
      let temp = this.content.discription[discriptionIndex].table.data;
      temp = temp.splice(index, 1);
      this.freshTable = false;
      this.$nextTick(function() {
        this.freshTable = true;
      });
    },
    generate() {
      this.$emit("generateContent");
    },
    watchProp(index, item) {
      this.mountDIY();
    },
    mountDIY() {
      bus.$emit("mountDIY", this.content.id);
    }
  },
  watch: {
    "content.command": function(newCmd, oldCmd) {
      //console.log("command changed");
      let props = this.commandDecode(newCmd);
      for (var key in props) {
        if (!(key in this.content.props)) {
          Vue.set(this.content.props, key, props[key]);
          if (!props[key]) this.propsInput[key] = true;
          else this.propsInput[key] = false;
          //Vue.set(this.props, key, "");
        }
      }
      for (var key in this.content.props) {
        if (!(key in props)) {
          console.log("delete prop:" + key);
          Vue.delete(this.content.props, key);
          //Vue.delete(this.props, key);
        }
      }
    }
  }
};
</script>

<style>
</style>
