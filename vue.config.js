module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/_palette.scss";@import "@/styles/_mixins.scss";`
      }
    }
  }
}
