<template>
  <v-card color="gray lighten-1">
    <v-card-title class="headline blue-grey darken-1" primary-title>
      <h1>{{title}}</h1>
      <p> {{rating}}% ({{voteCount}})</p>
    </v-card-title>

    <v-card-text>
      <p>{{description}}</p>
    </v-card-text>
    <youtube :video-id="trailer"></youtube>

  </v-card>
</template>

<script>
export default {
  props: [
    'title',
    'isWatched',
    'trailer',
    'rating',
    'voteCount',
    'description'
  ],
  data: () => ({
    dialog: false,
    notifications: false,
    sound: true,
    widgets: false
  }),
  methods: {

  }
}
</script>

<style lang="sass">

</style>
