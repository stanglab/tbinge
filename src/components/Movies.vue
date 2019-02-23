<template>
  <v-app id="inspire">
    <v-layout justify-center>
      <v-flex xs12 md6 lg6>
        <v-text-field
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="search"
          label="Search Local Movies"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex v-for="movie in localMovies" :key="movie.movieId" xs4 md2 lg1 d-flex class="movie-img">
          <v-card flat tile color="transparent">
            <v-img :src="movie.poster" :aspect-ratio="2/3" @click.prevent="selectMovie(movie.movieId)"></v-img>
            <v-card-actions>
              <p class="body-1 mb-0">{{ movie.title }}</p>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="isDialogDisplayed" transition="dialog-bottom-transition">
      <DetailsDialog @cancel="isDialogDisplayed = false" @delete="isDialogDisplayed = false" v-bind="this.$store.state.selectedDetail"/>
    </v-dialog>
  </v-app>
</template>

<script>
import DetailsDialog from '@/components/DetailsDialog'

export default {
  components: {
    DetailsDialog
  },
  data: () => ({
    isDialogDisplayed: false,
    localMovies: []
  }),
  created () {
    // Retrieve list of local movies from the store
    this.localMovies = this.$store.state.localData.movies
  },
  methods: {
    selectMovie (id) {
      // Fetch selected movie
      this.populateStore(id)
      // Open dialog display
      this.isDialogDisplayed = true
    },
    populateStore (id) {
      this.$store.state.selectedDetail = this.localMovies.filter(movie => movie.movieId === id)[0]
    }
  }
}
</script>

<style lang="sass">
.movie-img
 cursor: pointer
</style>
