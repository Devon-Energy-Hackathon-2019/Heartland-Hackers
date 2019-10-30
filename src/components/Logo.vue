<template lang="html">
  <svg class="hh-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60.74 58.86">
    <g>
      <path
        :fill="fillColor"
        class="cls-1" d="M40.13,18.73V0H0V58.86H60.74V18.73ZM58.06,56.19H2.68V2.68H37.46V18.73H30.51a9.63,9.63,0,1,0,9.62,9.62v-7H58.06ZM37.46,21.4v7a7,7,0,1,1-6.95-7Z"/>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    fillColor: String
  }
}
</script>

<style lang="scss" scoped>
.hh-logo {
  max-height: 100%;
  max-width: 100%;
  path {
    transition: fill 0.25s ease;
  }
}
</style>
