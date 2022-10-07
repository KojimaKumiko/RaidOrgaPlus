import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import "@fontsource/roboto";

import App from './App.vue';
import store from './store';
import router from './router';

Vue.config.productionTip = false;
Vue.config.performance = true;

const opts = {
	theme: {
		options: {
			customProperties: true
		},
		dark: true,
		themes: {
			dark: {
				background: '#121212',
				color: '#1E1E1E',
				textColor: '#FFFFFF',
				playerCard: '#222222',
				dialogBox: '#444444',
				menuColor: '#444444',
				tabHeader: 'CACACA'
			},
			light: {
				background: '#FFFFFF',
				color: '#FFFFFF',
				textColor: '#121212',
				playerCard: '#F5F5F5',
				dialogBox: '#F5F5F5',
				menuColor: '#CCCCCC',
				tabHeader: '#313131'
			}
		}
	},
};

Vue.use(Vuetify);
Vue.use(VueRouter);

new Vue({
  vuetify: new Vuetify(opts),
  store,
  router,
  render: h => h(App)
}).$mount('#app');
