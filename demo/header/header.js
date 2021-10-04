const template = `
  <header :style="{ 'background-color': bgColor }">
    {{ text }}
  </header>
`

export default {
  template,

  props: {
    bgColor: {
      type: String,
      default: '#dde1f3'
    }
  },

  data () {
    return {
      text: 'Quran Verse Detection Demo' 
    }
  },
}
