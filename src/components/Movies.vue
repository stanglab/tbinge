<template>
  <v-layout justify-center column>
    <v-flex class="pa-2">
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search Local Movies"
        v-model="searchInput"
      ></v-text-field>
    </v-flex>
    <v-flex>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex v-for="movie in filteredList" :key="movie.id" xs4 md2 lg1 d-flex class="movie-img">
            <v-card flat tile color="transparent">
              <v-img :src="movie.poster" :aspect-ratio="2/3" @click.prevent="viewMovie(movie.id)"></v-img>
              <v-card-actions>
                <p class="body-1 mb-0">{{ movie.title }}</p>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
    <v-btn
      color="primary"
      dark
      absolute
      bottom
      right
      fab
      class="mr-4 mb-5"
      @click.stop="drawer = !drawer"
    >
      <v-icon>add</v-icon>
    </v-btn>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      right
    >
      <v-list class="pa-1 my-1">
        <v-list-tile>
          <v-list-tile-content class="pa-1">
            <v-text-field
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="search"
              label="TMDB Movies"
              v-model="searchInputTmdb"
            ></v-text-field>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-flex xs12 v-for="result in filterTmdbList" :key="result.id">
        <v-card color="secondary lighten-2" class="white--text ma-2 pa-1">
          <v-layout>
            <v-flex xs5>
              <v-img
                :src="result.poster"
                height="125px"
                contain
              ></v-img>
            </v-flex>
            <v-flex xs7>
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{ result.title }}</div>
                  <div>({{ result.year }})</div>
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
          <v-divider light></v-divider>
          <v-card-actions class="pa-2">
            <v-btn flat small @click.prevent="getTmdbDetail(result.id)">
              Details
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn flat small color="primary lighten-2" @click.prevent="addTmdbMovie(result.id)">
              Add to Library
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-navigation-drawer>

    <v-dialog v-model="isDialogDisplayed" transition="dialog-bottom-transition" lazy>
      <DetailsDialog @cancel="isDialogDisplayed = false" @delete="isDialogDisplayed = false" v-bind="itemDetails"/>
    </v-dialog>
  </v-layout>
</template>

<script>
// TODO: REMOVE WHEN API IMPLEMENTED
import fs from 'fs'
// TODO: REMOVE WHEN API IMPLEMENTED
import path from 'path'
import DetailsDialog from '@/components/DetailsDialog'
import { mapGetters } from 'vuex'

export default {
  components: {
    DetailsDialog
  },
  data: () => ({
    devData: {
      'tmdbApiInitialSearch': [
        {
          'id': 6732,
          'year': '2011',
          'title': 'Green Lantern',
          'poster': 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/zUSEYp9G7Hk9GZIfbPoOiSHvwHV.jpg'
        },
        {
          'id': 45123,
          'year': '2010',
          'title': 'RED',
          'poster': 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/q2mwTRKrq1etP9S4SZVDIJq0wI2.jpg'
        }
      ],
      'tmdbApiDetail': [
        {
          'id': 6732,
          'mediaType': 'movie',
          'year': '2011',
          'title': 'Green Lantern',
          'voteAverage': 51,
          'voteCount': 6654,
          'trailer': 'tRplNRHOtS0',
          'poster': 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/zUSEYp9G7Hk9GZIfbPoOiSHvwHV.jpg',
          'description': 'For centuries, a small but powerful force of warriors called the Green Lantern Corps has sworn to keep intergalactic order. Each Green Lantern wears a ring that grants him superpowers. But when a new enemy called Parallax threatens to destroy the balance of power in the Universe, their fate and the fate of Earth lie in the hands of the first human ever recruited.'
        }
      ]
    },
    itemDetails: null,
    isDialogDisplayed: false,
    drawer: null,
    searchInput: '',
    searchInputTmdb: ''
  }),
  created () {
    // Retrieve list of local movies from the store
    this.$store.dispatch('loadDatabase')

    // TODO: REMOVE WHEN API IMPLEMENTED
    const publicFolder = path.resolve('./public')
    fs.readFile(path.join(publicFolder, 'devDB.json'), 'utf8', (err, data) => {
      if (err) alert(err.message)
      this.devData = JSON.parse(data)
    })
  },
  computed: {
    ...mapGetters([
      'getSelectedDetail',
      'getMovies',
      'filterById',
      'filterByTitle'
    ]),
    filteredList () {
      this.$store.dispatch('updateSearchInput', this.searchInput)
      // FIXME: Return filtered movie list
      return this.filterByTitle
    },
    filterTmdbList () {
      // TODO: Tie in API call
      return this.devData.tmdbApiInitialSearch.filter(movie => {
        return movie.title.toLowerCase().includes(this.searchInputTmdb.toLowerCase())
      })
    }
  },
  methods: {
    viewMovie (givenId) {
      this.$store.dispatch('updateDetailById', givenId)
      this.itemDetails = this.getSelectedDetail
      this.isDialogDisplayed = true
    },
    getTmdbDetail (givenId) {
      // TODO: Tie in API call via passed id and update store detail
      this.$store.state.selectedDetail = this.devData.tmdbApiDetail
      this.isDialogDisplayed = true
    },
    addTmdbMovie (givenId) {
      // TODO: Tie in API call to get full details
      // Set API return values to local movies DB
      let newMovie = this.devData.tmdbApiDetail
      this.$store.dispatch('pushToData', newMovie)
    }
  }
}
</script>

<style lang="sass">
.movie-img
 cursor: pointer
</style>
