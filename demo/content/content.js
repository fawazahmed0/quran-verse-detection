const template = `
  <section>
      <div class="demo-input">
        <input v-model="text1" class="" type="text" placeholder="Enter quran verse here" />
      </div>



      <div class="demo-button">
        <button @click="detect()" >Send ➜</button>
      </div>

      <div v-if="loading">
        <p>Loading...</p>
      </div>

      <label v-if="!loading && result" class="demo-output">
        <p><strong>Results:</strong></p>
        <table>
          <tr>
            <th>Chapter</th>
            <th>Verse number</th>
          </tr>
          <tr>
            <td>{{ result.text1.chapter }}</td>
            <td>{{ result.text1.verse_number }}</td>
          </tr>
        </table>
      </label>

  </section>
`;

const MODEL_URL =
  'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-verse-detection@master/model/model.json';

export default {
  template,

  data() {
    return {
      loading: false,
      text1: '',
      text2: '',
      result: null,
    };
  },

  methods: {
    async detect() {
      if (this.text1 === '') {
        return;
      }

      this.loading = true;
      await this.quranVerseDetection();
    },
    async quranVerseDetection() {
      const model1 = tf.loadLayersModel(MODEL_URL);
      const model2 = use.load();

      const quranmodel = await model1;
      const usemodel = await model2;

      const embed = await usemodel.embed([this.text1, this.text2]);
      const predictions = quranmodel.predict(embed).softmax();

      const arr = predictions.argMax(1).arraySync();

      const chaplength = [
        7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
        112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53,
        89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12,
        12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26,
        30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
      ];

      const mappings = [];

      for (let i = 1; i <= 114; i++) {
        for (let j = 1; j <= chaplength[i - 1]; j++) {
          mappings.push([i, j]);
        }
      }

      this.result = {
        prediction: predictions.max(1).arraySync(),
        text1: {
          chapter: mappings[arr[0]][0],
          verse_number: mappings[arr[0]][1],
        },
      };

      this.loading = false;
    },
  },
};
