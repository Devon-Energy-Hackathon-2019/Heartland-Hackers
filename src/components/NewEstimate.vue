<template lang="html">
  <div id="hh-new-estimate">
    <!-- title bar -->
    <div
      id="hh-new-estimate-title-bar"
      :class="{ 'alt': loading }"
    >
      <b-container class="text-center">
        <router-link to="/">
          <Logo :fillColor="logoColor"/>
          <h1>Competitor Fee Estimator</h1>
        </router-link>
      </b-container>
    </div> <!-- END title bar -->
    <!-- load message -->
    <transition name="fade">
      <div id="hh-new-estimate-load-message" v-if="loading">
        <b-container class="text-center">
          <div id="hh-new-estimate-loading-icon">
            <img :src="loadingIcon">
          </div>
          <h1>Hang Tight</h1>
          <p>We’re analyzing the document you uploaded</p>
        </b-container>
      </div>
    </transition><!-- END load message -->
    <!-- form container -->
    <transition name="fade">
      <b-container v-if="!compared">
        <b-alert v-model="showError" variant="danger" dismissible>
          There was an error. Check the console for details.
        </b-alert>
        <h1 class="hh-new-estimate-main-title">New Estimate</h1>
        <p class="hh-new-estimate-main-desc">Please fill out the below form in its entirety</p>
        <!-- form -->
        <b-form id="hh-new-estimate-form" @submit="submitNewEst" class="text-center">
          <!-- select competitor -->
          <b-form-group id="sel-competitor-group" label="Competitor" label-for="sel-competitor">
            <b-form-select
              id="sel-competitor"
              v-model="formVals.competitor"
              :options="competitorOpts"
              required
            ></b-form-select>
          </b-form-group> <!-- END select competitor -->
          <!-- select industry -->
          <b-form-group id="sel-industry-group" label="Industry" label-for="sel-industry">
            <b-form-select
              id="sel-industry"
              v-model="formVals.industry"
              :options="industryOpts"
              required
            ></b-form-select>
          </b-form-group> <!-- END select industry -->
          <!-- file upload statement -->
          <b-form-group id="file-upload-statement" label="Upload Statement" label-for="file-upload-statement">
            <b-form-file
              v-model="formVals.statement"
              :state="null"
              placeholder="Choose a file or drop it here..."
              drop-placeholder="Drop file here..."
            ></b-form-file>
            <div class="mt-3">Selected file: {{ formVals.statement ? formVals.statement.name : '' }}</div>
          </b-form-group> <!-- END file upload statement -->
          <!-- form submit -->
          <b-button
            type="submit"
            variant="primary"
            class="btn-lg"
          >
            Submit
          </b-button> <!-- END form submit -->
        </b-form><!-- END form -->
      </b-container>
    </transition><!-- END form container -->
    <!-- results container -->
    <transition name="fade">
      <b-container v-if="compared">
        <h1 class="hh-new-estimate-main-title">
          Results for Merchant with
          {{
            formVals.competitor.charAt(0).toUpperCase() + formVals.competitor.substring(1)
          }}
        </h1>
        <!-- results table -->
        <b-table
          id="hh-new-estimate-results-table"
          borderless
          :items="compResults"
          :fields="resultsFields">
        </b-table> <!-- END results table -->
        <!-- happy matt -->
        <div
          id="hh-new-estimate-happy-matt"
          class="matt-comment"
          v-if="compResultsRaw.heartlandFee < compResultsRaw.feeTotal"
        >
          <div class="matt-avatar">
            <img :src="happyMatt" alt="">
          </div>
          <div class="matt-text">
            <div class="matt-title"><span><strike>Happy</strike> Contented Matt</span> says</div>
            <p class="matt-content">Heartland has the best price&mdash;I think. Whatever. Are we done here? Can I go now, please? I think my wife is having our baby now.</p>
          </div>
        </div> <!-- END happy matt -->
        <!-- angry matt -->
        <div
          id="hh-new-estimate-angry-matt"
          class="matt-comment"
          v-if="compResultsRaw.heartlandFee > compResultsRaw.feeTotal"
        >
          <div class="matt-avatar">
            <img :src="angryMatt" alt="">
          </div>
          <div class="matt-text">
            <div class="matt-title"><span>Angry Matt</span> says</div>
            <p class="matt-content">We cannot beat our competitor’s amazing rates! We have failed! We must do better!</p>
          </div>
        </div>
        <!-- END angry matt -->
        <!-- form start over -->
        <p id="hh-new-estimate-start-over">
          <b-button
            variant="primary"
            class="btn-lg"
            @click="resetNewEst"
          >
            Start Over
          </b-button> <!-- END form start over -->
        </p>
      </b-container>
    </transition> <!-- END results container -->
  </div>
</template>

<script>
import { EventBus } from '../notifiers/event-bus.js'
import DocumentSearch from '../services/DocumentSearch'
import Logo from './Logo'

export default {
  name: 'NewEstimate',
  components: {
    Logo
  },
  data () {
    return {
      showError: false,
      happyMatt: require('@/assets/happy-matt.jpg'),
      angryMatt: require('@/assets/angry-matt.png'),
      loadingIcon: require('@/assets/loading-icon.svg'),
      logoColor: '#1C9AAF',
      formVals: {
        industry: null,
        competitor: null,
        // competitor: 'firstData',
        statement: null
      },
      competitorOpts: [
        { text: 'Select One', value: null },
        { text: 'Elavon', value: 'elavon' },
        { text: 'FirstData', value: 'firstData' }
      ],
      industryOpts: [
        { text: 'Select One', value: null },
        'Automotive',
        'Entertainment',
        'Home Services',
        'Liquor',
        'Lodging',
        'Medical',
        'Pharmacy',
        'Restaurant',
        'Retail'
      ],
      loading: false,
      compared: false,
      // compared: true,
      compResultsRaw: {transactionCount: 0, transactionTotal: 0, feeTotal: 0, heartlandFee: 0},
      // compResultsRaw: {transactionCount: 35, transactionTotal: 15597.46, feeTotal: 900.96, heartlandFee: 891.04},
      compResults: null,
      resultsFields: [
        {
          key: 'servicer',
          label: 'Servicer',
          tdClass: 'servicer'
        },
        {
          key: 'transaxnCount',
          label: 'Transaxn. Count',
          thClass: 'align-right',
          tdClass: 'align-right',
        },
        {
          key: 'transaxnTotal',
          label: 'Transaxn. Total',
          thClass: 'align-right',
          tdClass: 'align-right',
          formatter: value => {
            if (!value) return null
            return '$' + this.formatPrice(value)
          }
        },
        {
          key: 'feeTotal',
          label: 'Fee Total',
          thClass: 'align-right',
          tdClass: value => {
            const smallest = Math.min(this.compResultsRaw.feeTotal, this.compResultsRaw.heartlandFee)
            if (smallest != value) return 'align-right'
            return 'winner align-right'
          },
          formatter: value => {
            return '$' + this.formatPrice(value)
          }
        }
      ],
      // compResults: [
      //   {
      //     servicer: 'FirstData',
      //     transaxnCount: 35,
      //     transaxnTotal: 15597.46,
      //     feeTotal: 900.96
      //   },
      //   {
      //     servicer: 'Heartland',
      //     // transaxnCount: false,
      //     // transaxnTotal: false,
      //     feeTotal: 891.04
      //   }
      // ]
    }
  },
  mounted () {
    // this.submitNewEst()
  },
  methods: {
    /**
     * creates a new document search
     * @param  {Event} e default event (which will be prevented)
     * @return {void}
     */
    async submitNewEst (e) {
      // prevent default event
      if (e) e.preventDefault()
      this.loading = true
      this.logoColor = '#21243A'
      // // create a new document search
      try {
        const docSearch = await DocumentSearch.analyzeDocuments(
          this.formVals.competitor, [ this.formVals.statement ]
        )
        console.log(docSearch)
        this.compared = true
        this.compResultsRaw = docSearch
        this.compResults = [
          {
            servicer: this.formVals.competitor.charAt(0).toUpperCase() + this.formVals.competitor.substring(1),
            transaxnCount: docSearch.transactionCount,
            transaxnTotal: docSearch.transactionTotal,
            feeTotal: docSearch.feeTotal
          },
          {
            servicer: 'Heartland',
            // transaxnCount: false,
            // transaxnTotal: false,
            feeTotal: docSearch.heartlandFee
          }
        ]
      } catch (e) {
        console.log(e)
        this.showError = true
      } finally {
        this.loading = false
        this.logoColor = '#1C9AAF'
      }
    },
    resetNewEst () {
      this.loading = false
      this.logoColor = '#1C9AAF'
      this.compared = false
      this.compResultsRaw = {transactionCount: 0, transactionTotal: 0, feeTotal: 0, heartlandFee: 0}
      this.formVals = {
        industry: null,
        competitor: null,
        statement: null
      }
    },
    formatPrice (value) {
      let val = (value/1).toFixed(2)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  }
}
</script>

<style lang="scss">
.fade-delay-enter-active, .fade-delay-leave-active {
  transition: opacity .5s;
  transition-delay: 1s;
}
#hh-new-estimate {
  min-height: 100vh;
  padding-top: 100px;
}
#hh-new-estimate-title-bar {
  width: 100%;
  background-color: $hh-indigo;
  padding: 2rem 0;
  color: $hh-white;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 3;
  transition: background-color 0.25s ease;
  &.alt {
    background-color: $hh-transparent;
  }
  .hh-logo {
    height: 3rem;
    margin-right: 1rem;
    display: inline-block;
    vertical-align: middle;
    margin-top: -12px;
  }
  h1 {
    display: inline-block;
    margin-bottom: 0;
    font-size: 1.5rem;
    color: $hh-white !important;
  }
}
.hh-new-estimate-main-title {
  text-align: center;
  margin-top: 1.5em;
  font-size: 3.5rem;
  color: $hh-blue;
  @media (max-width: 767px) {
    font-size: 2.5rem;
  }
}
.hh-new-estimate-main-desc {
  font-size: 1.5rem;
  font-weight: 300;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  @media (max-width: 767px) {
    font-size: 1.2rem;
  }
}
#hh-new-estimate-form {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  .btn-primary {
    margin-top: 20px;
    display: inline-block;
  }
}
label.d-block {
  text-align: left;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  @media (max-width: 767px) {
    font-size: 0.85rem;
  }
}
select {
  background-color: $hh-faint-grey !important;
  background-image: url('../assets/select-arrow.svg') !important;
  background-size: 20px 12px !important;
  font-size: 1.3rem !important;
  border: none !important;
  @media (max-width: 767px) {
    font-size: 1.05rem !important;
  }
}
.custom-file {
  min-height: 140px !important;
}
.custom-file-label {
  height: 140px !important;
  line-height: 138px !important;
  background: $hh-faint-grey !important;
  text-align: center;
  &::after {
    position: relative !important;
    display: inline-block !important;
    border-radius: 99999em !important;
    border: none !important;
    color: $hh-white !important;
    background-color: $hh-indigo !important;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
}
.mt-3 {
  display: none !important;
}
input[type=file] {
  display: none !important;
}
#hh-new-estimate-load-message {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(28,154,175);
  background: linear-gradient(90deg, rgba(28,154,175,1) 32%, rgba(9,117,142,1) 100%);
  color: $hh-white;
  padding-top: 100px;
  .container {
    @include vertical-center();
  }
  h1{
    text-align: center;
    font-size: 3.5rem;
    @media (max-width: 767px) {
      font-size: 2.5rem;
    }
  }
  p {
    font-size: 1.5rem;
    font-weight: 300;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    @media (max-width: 767px) {
      font-size: 1.2rem;
    }
  }
}
#hh-new-estimate-loading-icon {
  height: 300px;
  width: 300px;
  margin-left: auto;
  margin-right: auto;
  margin-top: -150px;
}
#hh-new-estimate-results-table {
  margin-top: 5rem;
  border-radius: 0.25rem !important;
  font-size: 1.4rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden !important;
  margin-bottom: 3rem;
  @media (max-width: 767px) {
    font-size: 1.1rem;
  }
  thead {
    border-top: none;
    // border-bottom: 2px solid $hh-white !important;
    background: rgb(28,154,175);
    background: linear-gradient(90deg, rgba(28,154,175,1) 32%, rgba(9,117,142,1) 100%);
    color: $hh-white;
    th {
      font-weight: 600 !important;
    }
  }
  th {
    text-transform: uppercase;
    letter-spacing: 0.1rem;
    font-size: 1rem;
    @media (max-width: 767px) {
      font-size: 0.9rem;
    }
  }
  tbody tr td {
    background-color: $hh-faint-grey;
  }
  td.servicer {
    background-color: darken($hh-faint-grey, 10%);
    font-weight: 600;
  }
  th.align-right, td.align-right {
    text-align: right;
  }
  td.align-right {
    font-weight: 600 !important;
    color: $hh-indigo;
    font-size: 1.8rem;
    @media (max-width: 767px) {
      font-size: 1.4rem;
    }
  }
  th, td {
    padding: 1.5rem 1rem;
    // border: 2px solid $hh-white !important;
  }
  td.winner {
    background-color: $hh-indigo;
    color: $hh-white;
    &::after {
      content: 'Winner';
      display: block;
      text-transform: uppercase;
      letter-spacing: 0.1rem;
      font-size: 0.85rem;
    }
  }
  thead tr {
    border-bottom: 2px solid $hh-white;
  }
  tbody tr:nth-of-type(1) {
    border-bottom: 2px solid $hh-white;
  }
  tr th:not(:first-of-type),
  tr td:not(:first-of-type) {
    border-left: 2px solid $hh-white;
  }
}
.matt-comment {
  background-color: #d1dfe2;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0.25rem;
  padding: 1rem;
  position: relative;
  min-height: calc(100px + 2rem);
  .matt-avatar {
    border-radius: 99999em;
    overflow: hidden;
    height: 100px;
    width: 100px;
    img {
      height: 100px;
      width: 100px;
    }
  }
  .matt-text {
    padding-left: calc(100px + 2rem);
  }
  .matt-avatar {
    position: absolute;
    top: 1rem;
    left: 1rem;
  }
  .matt-content {
    font-size: 1.25rem;
    margin-bottom: 0;
    @media (max-width: 767px) {
      font-size: 1.1rem;
    }
  }
  .matt-title {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: $hh-blue;
    font-size: 1.25rem;
    @media (max-width: 767px) {
      font-size: 1.1rem;
    }
    span {
      font-weight: 900;
    }
  }
}
#hh-new-estimate-start-over {
  margin-top: 5rem;
  text-align: center;
  margin-bottom: 2rem;
  .btn-primary {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
