<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import {updateGradient} from './assets/updateGradient.js'
import JQuery from 'jquery'
let $ = JQuery

export default {
  name: 'app',
  data () {
    return {
      bgColor: null
    }
  },
  mounted () {
    this.startGradientAnim()
  },
  methods: {
    changeBackground (bgColor) {
      this.bgColor = bgColor
    },
    startGradientAnim () {

      var colors = new Array(
        [62,35,255],
        [60,255,60],
        [255,35,98],
        [45,175,230],
        [255,0,255],
        [255,128,0]);

      var step = 0;
      //color table indices for:
      // current color left
      // next color left
      // current color right
      // next color right
      var colorIndices = [0,1,2,3];

      //transition speed
      var gradientSpeed = 0.002;

      const updateGradient = function () {

        if ( $===undefined ) return;

      var c0_0 = colors[colorIndices[0]];
      var c0_1 = colors[colorIndices[1]];
      var c1_0 = colors[colorIndices[2]];
      var c1_1 = colors[colorIndices[3]];

      var istep = 1 - step;
      var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
      var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
      var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
      var color1 = "rgb("+r1+","+g1+","+b1+")";

      var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
      var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
      var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
      var color2 = "rgb("+r2+","+g2+","+b2+")";

       $('#app').css({
         background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
          background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});

        step += gradientSpeed;
        if ( step >= 1 )
        {
          step %= 1;
          colorIndices[0] = colorIndices[1];
          colorIndices[2] = colorIndices[3];

          //pick two new target color indices
          //do not pick the same as the current one
          colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
          colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;

        }
      }
      setInterval(updateGradient,10);
    }
  }
}
</script>

<style lang="scss">
.fade-enter-to, .fade-leave-to {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
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
.btn {
  border-radius: 9999em !important;
  // text-transform: uppercase;
  // letter-spacing: 0.15em;
  padding: 0.4em 3em !important;
  border: none !important;
  transition: background-color 0.25s ease, color 0.25s ease;
  font-weight: 700 !important;
  &.btn-full-size {
    display: block !important;
    margin: 0 auto;
  }
  &.btn-lg {
    font-size: 1.5rem;
    @media (max-width: 767px) {
      font-size: 1.2rem;
    }
  }
}
</style>
