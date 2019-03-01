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
              <v-img :src="movie.poster" :aspect-ratio="2/3" @click.prevent="selectMovie(movie.id)"></v-img>
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

      <v-alert
        v-model="isSearchError"
        type="error"
        outline
        >
          {{ errorMessage }}
      </v-alert>

      <v-flex xs12 v-for="result in searchResults" :key="result.id">
        <v-card color="secondary lighten-2" class="white--text ma-2 pa-1">
          <v-layout>
            <v-flex xs5>
              <v-img v-if="!(result.poster_path === null)"
                :src="getPosterURL(result.poster_path)"
                height="125px"
                contain
              ></v-img>
            </v-flex>
            <v-flex xs7>
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{result.title}}</div>
                  <div v-if="!(result.release_date === '')">({{ result.release_date.substring(0, 4) }})</div>
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
          <v-divider light></v-divider>
          <v-card-actions class="pa-2">
            <v-btn flat small @click.prevent="viewTmdbDetail(result.id)">
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
      <DetailsDialog @cancel="isDialogDisplayed = false" @delete="isDialogDisplayed = false" v-bind="this.selectedDetail"/>
    </v-dialog>
  </v-layout>
</template>

<script>
import DetailsDialog from '@/components/DetailsDialog'
import debounce from 'lodash/debounce'
import tmdbSearch from '@/tmdb/search'
import fs from 'fs'
import path from 'path'

export default {
  components: {
    DetailsDialog
  },
  data: () => ({
    isDialogDisplayed: false,
    isSearchError: false,
    selectedDetail: null,
    movies: [],
    searchResults: [],
    drawer: null,
    searchInput: '',
    searchInputTmdb: '',
    errorMessage: ''
  }),
  created () {
    const publicFolder = path.resolve('./public')
    fs.readFile(path.join(publicFolder, 'database.json'), 'utf8', (err, data) => {
      if (err) alert(err.message)
      this.movies = JSON.parse(data).filter(items => items.mediaType === 'movie')
    })
    this.debouncedSearchTMDB = debounce(this.searchTMDB, 1500)
  },
  computed: {
    filteredList () {
      return this.movies.filter(movie => {
        return movie.title.toLowerCase().includes(this.searchInput.toLowerCase())
      })
    }
  },
  watch: {
    searchInputTmdb: function (searchInput) {
      this.debouncedSearchTMDB()
    }
  },
  methods: {
    selectMovie (givenId) {
      this.selectedDetail = this.movies.filter(movie => movie.id === givenId)[0]
      this.isDialogDisplayed = true
    },
    viewTmdbDetail (givenId) {
      this.selectedDetail = this.searchResults.filter(results => results.id === givenId)[0]
      console.log(this.selectedDetail)
      this.isDialogDisplayed = true
    },
    searchTMDB () {
      this.errorMessage = ''
      this.isSearchError = false

      tmdbSearch.searchTMDB(this.searchInputTmdb, false, (errorMessage, searchResults) => {
        if (errorMessage) {
          this.errorMessage = errorMessage
          this.isSearchError = true
        }
        this.searchResults = searchResults.results
      })
    },
    addTmdbMovie (givenId) {
      // this.movies.push(this.searchResults.filter(results => results.id === givenId)[0])
      const movieToAdd = this.searchResults.filter(results => results.id === givenId)[0]
      let database = []
      const publicFolder = path.resolve('./public')
      fs.readFile(path.join(publicFolder, 'database.json'), 'utf8', (err, data) => {
        if (err) alert(err.message)
        data.push(JSON.stringify(mediaType, 'movie'))
        database = JSON.parse(data)
      },

      database.push(movieToAdd),

      fs.writeFileSync(path.join(publicFolder, 'database.json'), JSON.stringify(database), 'utf8').catch(err => alert(err.message)))
    },
    getPosterURL (posterPath) {
      return 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + posterPath
    }
  }
}
</script>

<style lang="sass">
.movie-img
 cursor: pointer
</style>
