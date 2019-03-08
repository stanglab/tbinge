# tbinge

Tbinge is a desktop application written in Electron/Node.js that serves as a local tracking library for Movies and TV Shows that the user is either interested in viewing or has viewed and on which they would like to keep a database.

## The features

- Searching [TMDB](https://www.themoviedb.org/) for movies and TV shows
- Rating a movie or TV show locally (contributes to TMDB rating system too)
- Adding a movie or TV show to local database
- Removing a movie or TV show from local database
- Operating in an offline setting (no TMDB searching)

## Designs and Documentation
https://drive.google.com/drive/folders/1LmqRI_F7p-dqeaX98teTnTx5na6GI2en?usp=sharing

## Project setup

```bash
yarn install
```

### Compiles and hot-reloads for development

```bash
yarn electron:serve
```

### Compiles and minifies for production (for the developers current Operating System)

```bash
yarn electron:build
```

### Compiles and minifies for production (Mac OS, Linux (snaps) and Windows 10 x64)

```bash
yarn electron:build-all
```

### Lints and fixes files

```bash
yarn run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
See [Styling Reference](https://vuetifyjs.com/en/).
See [Electron Reference](https://www.electron.build/).
