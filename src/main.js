// The Vue build version to load with the `import` command 使用“import”命令加载的Vue构建版本
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.(仅运行时或独立运行时)在webpack.base.conf中设置了一个别名。
import Vue from "vue";
import App from "./App";
import router from "./router";
/*引入下面三行*/
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
