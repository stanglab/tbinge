/*
*  This module serves as the primary handler for all TMDb API
*  calls and has the project API key set as a constant variable
*  based on the API key set in the "key.json" file.
*  Author: Kyle McCain
*  Date: 19 February 2019
*/
const fs = require('fs')
const request = require('request')
const path = require('path')

// Declare and initialize TMDb API variables
const tmdbFolder = path.resolve('./public')
const authentication = JSON.parse(fs.readFileSync(path.join(tmdbFolder, 'authentication.json'), 'utf8', (err, data) => {
  if (err) alert(err.message)
  else return data
}))
const baseURL = 'https://api.themoviedb.org/3/'

// Declare and initialize new error to throw if required parameter is not input
const isRequired = () => { throw new Error('Parameter is required!') }

// Function that calls TMDb API with the input options
let tmbdCall = (options, callback) => {
  // Adds the API key to 'options' prior to calling API
  options.qs.api_key = authentication.api_key

  // Adds the guest session id to 'options' if conducting a POST request
  if (options.method === 'POST') {
    options.qs.guest_session_id = authentication.guest_session_id
  };

  // Send request and return the 'body' of response or error message if unsuccessful
  request(options, (error, response, body) => {
    // Return error message since no return JSON exists to parse error message
    if (error) {
      callback('Unable to connect to TMDb!') // eslint-disable-line
      // Return error message for status code 401 and 404 from returned JSON
    } else if (response.statusCode === 401 || response.statusCode === 404) {
      callback(JSON.parse(body).status_message)
      // Return object of 'body' or 'response' if no error in transaction
    } else {
      // Return 'body' if API call is a GET request
      if (options.method === 'GET') {
        callback(undefined, JSON.parse(body))
        // Return 'response' body if API call is a POST request
      } else if (options.method === 'POST') {
        callback(undefined, response.body)
      }
    };
  })
}

// Creates a guest session with TMDb
let createGuestSession = (callback) => {
  // Define options prior to passing it to the tmdbCall function
  let options = { method: 'GET',
    url: `${baseURL}authentication/guest_session/new`,
    qs: {},
    body: '{}'
  }

  // Call tmdb API and return object to callback function with the
  // 'errorMessage' as the indicator of whether a search was succesfful
  tmbdCall(options, (errorMessage, body) => {
    if (errorMessage) {
      callback(errorMessage)
    } else {
      callback(undefined, body)
    }
  })
}

// Function that returns the correct string to concatenate with the base
// URL depending on whether the user is searching for a TV show or a movie
let getSearchURL = (isTV = isRequired()) => {
  if (isTV) {
    return `${baseURL}search/tv`
  } else {
    return `${baseURL}search/movie`
  };
}

// Function that returns the correct string to concatenate with the base URL depending
// on whether the user is doing a detailed search for a TV show or a movie
let getDetailedSearchURL = (isTV = isRequired()) => {
  if (isTV) {
    return `${baseURL}tv/`
  } else {
    return `${baseURL}movie/`
  };
}

// Function that returns the correct string to concatenate with the base URL depending
// on whether the user is posting a rating for a TV show or a movie
let getRatingURL = (id = isRequired(), isTV = isRequired()) => {
  if (isTV) {
    return `${baseURL}tv/${id}/rating`
  } else {
    return `${baseURL}movie/${id}/rating`
  };
}

// Export functions for use outside of module
module.exports = {
  tmbdCall,
  createGuestSession,
  getSearchURL,
  getDetailedSearchURL,
  getRatingURL
}
