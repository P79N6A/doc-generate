<template>
  <Row>
    <Col :md="{offset:4, span:6}" :sm="{offset:3, span:18}">
      <h1>
        {{content.title}}
        <span
          v-if="content.coder && !content.coderUrl"
          style="font-size:15px"
          class="sub"
        >by {{content.coder}}</span>

        <span v-else-if="content.coder && content.coderUrl" style="font-size:15px" class="sub">
          by
          <a :href="coderUrl" target="_blank">{{content.coder}}</a>
        </span>
      </h1>
      <p class="sub">{{content.sketch}}</p>
    </Col>
    <Col :md="{push:6-btnCount>0?6-btnCount:0, span:3+btnCount}" :sm="{offset:3, span:18}">
      <template v-for="btn in buttons">
        <span style="padding:0 8px"></span>
        <a :href="btn.url" target="_blank" v-if="completeBtn(btn)">
          <Button type="primary" style="margin-top: 25px">{{btn.name}}</Button>
        </a>
      </template>
    </Col>
  </Row>
</template>

<script>
export default {
  data() {
    return { btnCount: 0 };
  },
  props: {
    content: {
      title: String,
      buttons: Array,
      sketch: String,
      coder: String,
      coderUrl: String
    }
  },
  created() {},
  computed: {
    coderUrl: function() {
      if (
        this.content.coderUrl.indexOf("https://") !== 0 ||
        this.content.coderUrl.indexOf("http://") !== 0
      ) {
        var result = "https://" + this.content.coderUrl;
      }
      return result || this.content.coderUrl;
    },
    buttons: function() {
      //debugger;
      let result = [];
      for (let btn in this.content.buttons) {
        if (
          this.content.buttons[btn].url &&
          (this.content.buttons[btn].url.indexOf("https://") !== 0 &&
            this.content.buttons[btn].url.indexOf("http://") !== 0)
        ) {
          var url = "https://" + this.content.buttons[btn].url;
        }

        result.push({
          url: url || this.content.buttons[btn].url,
          name: this.content.buttons[btn].name
        });
      }
      return result;
    }
  },
  mounted() {
    if (this.content.buttons) this.btnCount = this.content.buttons.length;
    else this.btnCount = 0;
  },
  methods: {
    completeBtn(btn) {
      if (btn.url && btn.name) return true;
      return false;
    }
  }
};
</script>

<style>
a:link {
  text-decoration: none;
  color: #858585;
}
a:active {
  text-decoration: blink;
  color: #858585;
}
a:hover {
  text-decoration: underline;
  color: #858585;
}
a:visited {
  text-decoration: none;
  color: #858585;
}
</style>
