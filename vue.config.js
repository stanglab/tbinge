module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        mac: {
          target: 'zip',
          category: 'public.app-category.video',
          type: 'development'
        },
        win: {
          target: [
            {
              target: 'nsis',
              arch: ['x64']
            }
          ]
        },
        linux: {
          target: 'snap',
          category: 'video'
        }
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import '@/sass/globals.sass'`
      }
    }
  }
}
