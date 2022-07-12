import Header from './header/header.js';
import Content from './content/content.js';
import Footer from './footer/footer.js';

const { createApp } = Vue;

window.model1 =  tf.loadLayersModel('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-verse-detection@master/model/model.json')
window.model2 =  use.load()



const app = createApp({
  components: {
    'app-header': Header,
    'app-content': Content,
    'app-footer': Footer,
  },
  data() {
    return {
      title: 'Quran Verse Detection',
      message: 'Vue 3.x + Tailwind 2.x',
      books: [
        { title: 'The Secret', author: 'Rhonda', isFav: true },
        { title: 'The Power of Now', author: 'Eckhart', isFav: false },
      ],
    };
  },
  mounted() {
    console.log('Application mounted.');
  },
});

window.addEventListener('load', () => {
  app.mount('#app');
});
