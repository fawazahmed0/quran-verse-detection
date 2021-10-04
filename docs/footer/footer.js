const template = `
  <footer>

    <div class="left">
      <slot>
      </slot>
    </div>

    <div class="middle">
    </div>

    <div class="right">
      {{ now }}
    </div>

  </footer>
`

export default {
  template,

  computed: {
    now () {
      return new Date().toDateString()
    }
  },
}
