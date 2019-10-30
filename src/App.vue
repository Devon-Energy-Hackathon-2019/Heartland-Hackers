<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import {updateGradient} from './assets/updateGradient.js'

export default {
  name: 'app',
  data () {
    return {
      bgColor: null
    }
  },
  mounted () {

  },
  methods: {
    changeBackground (bgColor) {
      this.bgColor = bgColor
    }
  }
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s !important;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0 !important;
}
#app {
  transition: background 0.25s ease;
  min-height: 100vh;
  font-family: 'Averta Std', sans-serif;
  position: relative;
}
#vue-router {
  z-index: 1;
}
h1 {
  font-weight: 900 !important;
}
.btn {
  border-radius: 9999em !important;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  padding: 0.7em 2.5em !important;
  transition: color 0.25s ease, box-shadow 0.25s ease, border 0.25s ease;
  font-weight: 400 !important;
  overflow: none;
  position: relative;
  -webkit-box-shadow: inset 0px 0px 0px 0px $hh-blue;
  -moz-box-shadow:    inset 0px 0px 0px 0px $hh-blue;
  box-shadow:         inset 0px 0px 0px 0px $hh-blue;
  border: none !important;
  &.btn-primary {
    background: rgb(28,154,175);
    background: linear-gradient(90deg, rgba(28,154,175,1) 32%, rgba(9,117,142,1) 100%);
    color: $hh-white !important;
    border-color: $hh-blue-dark;
    &:hover {
      -webkit-box-shadow: inset 0px -5rem 0px 0px $hh-blue-dark;
      -moz-box-shadow:    inset 0px -5rem 0px 0px $hh-blue-dark;
      box-shadow:         inset 0px -5rem 0px 0px $hh-blue-dark;
    }
  }
  &.btn-full-size {
    display: block !important;
    margin: 0 auto;
  }
  &.btn-lg {
    font-size: 1.3rem;
    @media (max-width: 767px) {
      font-size: 1rem;
    }
  }
  &:hover {
    -webkit-box-shadow: inset 0px -5rem 0px 0px $hh-blue;
    -moz-box-shadow:    inset 0px -5rem 0px 0px $hh-blue;
    box-shadow:         inset 0px -5rem 0px 0px $hh-blue;
    // border: 2px solid $hh-white !important;
  }
}
</style>
