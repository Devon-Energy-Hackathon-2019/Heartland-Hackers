<template lang="html">
  <div id="hh-new-estimate">
    <!-- jumbotron -->
    <b-jumbotron>
      <b-container>
        <h1>New Estimate</h1>
      </b-container>
    </b-jumbotron><!-- END jumbotron -->
    <div id="main-container">
      <b-container>
        <template v-if="!compared">
          <!-- form -->
          <b-form @submit="submitNewEst">
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
                :state="Boolean(formVals.statement)"
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
          </b-form> <!-- END form -->
        </template>
        <template v-if="compared">
          <b-container>
            <b-row>
              <b-col>
                <div class="comp-name">
                  {{
                    formVals.competitor.charAt(0).toUpperCase() + formVals.competitor.substring(1)
                  }}
                </div>
              </b-col>
              <b-col>
                <dd>Transaction Count</dd>
                <dt>{{ compResults.transactionCount }}</dt>
              </b-col>
              <b-col>
                <dd>Transaction Total</dd>
                <dt>${{ formatPrice(compResults.transactionTotal) }}</dt>
              </b-col>
              <b-col>
                <dd
                  :class="{
                    'highlight': compResults.heartlandFee > compResults.feeTotal
                  }"
                >
                  Transaction Fees
                </dd>
                <dt
                  :class="{
                    'highlight': compResults.heartlandFee > compResults.feeTotal
                  }"
                >
                  ${{ formatPrice(compResults.feeTotal) }}
                </dt>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div class="comp-name">
                  Heartland
                </div>
              </b-col>
              <b-col>
              </b-col>
              <b-col>
              </b-col>
              <b-col>
                <dd
                  :class="{
                    'highlight': compResults.heartlandFee < compResults.feeTotal
                  }"
                >
                  Heartland Est. Fees
                </dd>
                <dt
                  :class="{
                    'highlight': compResults.heartlandFee < compResults.feeTotal
                  }"
                >
                  ${{ formatPrice(compResults.heartlandFee) }}
                </dt>
              </b-col>
            </b-row>
          </b-container>
        </template>
        <!-- temporary loader -->
        <div id="hh-temp-loader-container" v-if="loading">
          <img :src="loader"/>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
import { EventBus } from '../notifiers/event-bus.js'
import DocumentSearch from '../services/DocumentSearch'

export default {
  name: 'NewEstimate',
  data () {
    return {
      formVals: {
        industry: null,
        competitor: 'firstData',
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
      loader: require('@/assets/loader.gif'),
      loading: false,
      // compared: false,
      compared: true,
      compResults: {transactionCount: 35, transactionTotal: 15597.46, feeTotal: 900.96, heartlandFee: 891.04}
      // compResults: null,
    }
  },
  beforeRouteEnter (to, from, next) {
    EventBus.$emit('change-background', 'white')
    next()
  },
  methods: {
    /**
     * creates a new document search
     * @param  {Event} e default event (which will be prevented)
     * @return {void}
     */
    async submitNewEst (e) {
      // prevent default event
      e.preventDefault()
      this.loading = true
      // create a new document search
      try {
        const docSearch = await DocumentSearch.analyzeDocuments(
          this.formVals.competitor, [ this.formVals.statement ]
        )
        console.log(docSearch)
        this.compared = true
        this.compResults = docSearch
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
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
#hh-new-estimate {
  min-height: 100vh;
  .jumbotron {
    background-color: $hh-transparent;
  }
  h1 {
    text-align: center;
    font-weight: 900;
    color: $hh-white;
  }
  form {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
  .btn-primary {
    background: $hh-lavender;
    font-size: 1.3rem;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
  #main-container {
    background-color: $hh-white;
    padding: 40px 0;
    position: relative;
    & > * {
      position: relative;
      z-index: 2 !important;
    }
    &::after {
      position: fixed;
      top: 50%;
      height: 100vh;
      background-color: $hh-white;
      left: 0;
      bottom: 0;
      content: '';
      width: 100%;
      z-index: 1;
    }
  }
  label {
    font-weight: 700;
  }
  select {
    // padding-left: 0 !important;
    // padding-right: 0 !important;
    border: none !important;
    background-color: $hh-transparent !important;
    outline: none !important;
    // border-radius: 0 !important;
    background-color: $hh-faint-grey !important;
    font-size: 1.35rem !important;
  }
  .b-form-file {
    height: 100px;
  }
  .mt-3 {
    display: none !important;
  }
  .custom-file-label {
    height: 100px;
    background-color: $hh-faint-grey;
    border: none !important;
    &::after {
      display: none;
    }
  }
  dd, dt {
    background-color: $hh-faint-grey;
    padding: 0.5rem;
    &.highlight {
      background-color: $hh-lavender !important;
      color: $hh-white !important;
    }
  }
  dd {
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    margin-bottom: 0;
    padding-bottom: 0;
    font-weight: 700;
  }
  dt {
    padding-top: 0;
    font-size: 2.25rem;
    color: $hh-lavender;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    margin-bottom: 1rem;
  }
}
</style>
