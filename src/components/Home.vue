<template lang="html">
  <div id="hh-home">
    <b-container class="text-center">
      <!-- logo -->
      <div id="hh-logo-container-main">
        <Logo :fill="'#1C9AAF'"/>
      </div> <!-- END logo -->
      <h1 id="hh-main-title">Competitor Fee Estimator</h1>
      <p id="hh-main-desc">Estimate the statement fees assessed by a competing payment processor, and compare them to Heartland's rates.</p>
      <p id="hh-main-cta">
        <router-link to="/new-est" class="btn btn-primary btn-lg">
          Get started
        </router-link>
      </p>
    </b-container>
  </div>
</template>

<script>
import { EventBus } from '../notifiers/event-bus.js'
import Logo from './Logo'

export default {
  name: 'Home',
  components: {
    Logo
  },
  data () {
    return {
      logoWhite: require('@/assets/logo-white.svg'),
    }
  },
  beforeRouteEnter (to, from, next) {
    EventBus.$emit('change-background', 'blue-gradient')
    next()
  }
}
</script>

<style lang="scss">
#hh-home {
  color: $hh-white;
  height: 100vh;
  background: $hh-indigo;
  position: relative;
  .container {
    @include vertical-center();
  }
}
#hh-logo-container-main {
  height: 100px;
  @media (max-width: 767px) {
    height: 70px;
  }
  img {
    max-height: 100%;
  }
}
#hh-main-title {
  margin-top: 0.5em;
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 0.5em;
  @media (max-width: 767px) {
    font-size: 2rem;
  }
}
#hh-main-desc {
  font-size: 1.5rem;
  font-weight: 300;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 767px) {
    font-size: 1.2rem;
  }
}
#hh-main-cta {
  margin-bottom: 0;
  .btn-primary {
    margin-top: 2em;
  }
}
</style>
