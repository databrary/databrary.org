<template>
  <div class="q-pr-md">
    <h4 class="text-weight-light no-margin q-py-md text-center">Our Team</h4>
    <div class="text-h5 text-primary text-weight-normal q-py-md">
      Principal Investigators
    </div>
    <div class="row">
      <div
        v-for="(person, index) in principalInvestigators"
        :key="index"
        class="col-md-4  col-sm-6 col-xs-12 col-md-4 text-center"
      >
      <div class="full-width">
        <q-avatar size="200px" square>
          <img :src="person.avatar">
        </q-avatar>
      </div>
      <div class="text-h6 text-weight-normal">
        {{ person.name }}
      </div>
        {{ person.postion }}<br />
        {{ person.role }} <br />
        {{ person.email }}
        <div
          v-for="(link, l) in person.links"
          :key="l"
          >
          <a :href="link.url">
            {{link.title}}
          </a>
        </div>
      </div>
    </div>
    <div class="text-h5 text-primary text-weight-normal q-pt-md">
      Staff
    </div>
    <div class="text-subtext1 q-mb-md">
      All staff can be reached at 'firstname.lastname'@databrary.org
    </div>
    <div class="row">
      <div
        v-for="(person, p) in staff"
        :key="p"
        class="col-6"
      >
        <div class="text-h6 reset-linehight">{{ person.name }}</div>
        <div class="text-subtitle1 q-mb-sm">{{ person.role }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      principalInvestigators: [
        {
          name: 'Karen Adolph',
          avatar: './statics/karen.jpg',
          postion: 'Director',
          role: 'Professor of Psychology and Neural Science',
          email: 'karen.adolph@nyu.edu',
          links: [
            {
              title: 'New York University',
              url: 'http://www.nyu.edu/',
            },
            {
              title: 'NYU Action Lab',
              url: 'http://psych.nyu.edu/adolph',
            },
          ],
        },
        {
          name: 'Rick O. Gilmore',
          avatar: './statics/rick.jpg',
          postion: 'Associate Director',
          role: 'Associate Professor of Psychology',
          email: 'rogilmore@psu.edu',
          links: [
            {
              title: 'Penn State University',
              url: 'http://personal.psu.edu/rog1',
            },
          ],
        },
        {
          name: 'David Millman',
          avatar: './statics/david.jpg',
          postion: 'Co-Investigator',
          role: 'Director of Digital Library Technology Services',
          email: 'dsm@nyu.edu',
          links: [
            {
              title: 'New York University',
              url: 'http://dlib.nyu.edu/dlts/',
            },
          ],
        },
      ],
      staff: [
        {
          name: 'Ahmad Arshad',
          role: 'Managing Director',
        },
        {
          name: 'Dr. Joy Kennedy Lorenzo',
          role: 'Scientific Support Specialist',
        },
        {
          name: 'Kanishka Azimi',
          role: 'Back End Developer',
        },
        {
          name: 'Minyong Cho',
          role: 'Front End Developer',
        },
        {
          name: 'Dr. Nezzar Reda',
          role: 'Software Engineer',
        },
        {
          name: 'Shohan Hasan',
          role: 'Datavyu Support Specialist',
        },
        {
          name: 'Jesse Lingeman',
          role: 'Application Developer',
        },
        {
          name: 'Andrea Seisler',
          role: 'Authorizations Specialist',
        },
        {
          name: 'Dr. Florian Raudies',
          role: 'Datavyu Developer',
        },
        {
          name: 'Dr. Kasey Soska',
          role: 'Research Support Specialist',
        },
      ],
    };
  },
};
</script>

<style>
.reset-linehight {
  line-height: 15px;
}
</style>
