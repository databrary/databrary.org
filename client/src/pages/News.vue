<template>
  <q-page padding class="max-page-width">
    <h4 class="text-weight-light no-margin q-py-md text-center">News</h4>
    <div class="row">
      <div class="col-9">
        <div
          class="row"
          v-for="(article, index) in news"
          :key="index"
        >
          <div class="full-width">
            <div class="text-h5 text-primary text-weight-normal q-pt-md">{{article.title}}</div>
            <p v-html="article.subject" />
            <q-separator inset />
          </div>
        </div>
        <q-pagination
          class="justify-content-center q-pt-lg"
          v-model="currentPage"
          :max="5"
          :input="true"
        >
        </q-pagination>
      </div>
      <div class="col-3">
        <q-card flat bordered class="text-center">
          <q-card-section>
            <div class="text-h5 text-weight-light">Upcoming Events</div>
          </q-card-section>
            <q-separator inset />
          <q-card-section>
            There are no scheduled events.
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      currentPage: 1,
      news: [
        {
          title: 'New Feature: Demographics Upload',
          subject: 'No more manual data entry - now you can upload your participant demographics from a .csv file directly into your Databrary spreadsheet. This feature will be expanded in the near future to permit more flexibility, but for now, be sure to follow the directions on the Participant tab.'
        },
        {
          title: 'ISSBD 2018 in Gold Coast, Australia',
          subject: 'Databrary was pleased to bring our data sharing and coding services Down Under in July, 2018.'
        },
        {
          title: 'XXI ICIS 2018 Philadelphia Invited Program',
          subject: '<p>Most of the invited program from the XXI International Congress on Infant Studies, held in Philadelphia, PA from June 30-July 3, 2018 is now publicly available on Databrary.</p><p>You may stream or download the talks from the <a href="https://nyu.databrary.org/volume/709">XXI ICIS 2018 Philadelphia Invited Program</a> volume. </p>'
        },
        {
          title: 'New Default Sharing Option: Volume Overview',
          subject: 'More options for sharing are now available! You can now choose to share just an overview of your project, for example, if you\'re finishing up your data collection or if you want funders and reviewers to see what you\'re working on, but you aren\'t ready (or able ...'
        },
        {
          title: 'Take the Databrary User Survey',
          subject: '<p>We need to hear from you! Help us understand how your lab works so that we can improve our tools, service, and support. Tell us how you use Databrary and Datavyu, so that we can fix issues and add new features. The <a href="https://docs.google.com/forms/d/e/1FAIpQLSfVHhJRLshGDxm1ttlrM31CfvFkEOKJY1BPuvbo3bsMY7VJgw/viewform">Databrary User Survey</a> should take you less than ...</p>'
        }
      ]
    }
  }
}
</script>

<style>

</style>
