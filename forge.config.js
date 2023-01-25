module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    // {
    //   name: '@electron-forge/maker-squirrel',
    //   config: {},
    // },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        // background: './assets/logo.png',
        // format: 'ULFO',
        icon: '/assets/logo.png',
      }
    },
    // {
    //   name: '@electron-forge/maker-dmg',
    //   config: {
    //     background: './assets/logo.png',
    //     format: 'ULFO',
    //     // icon: '/path/to/icon.icns',
    //   }
    // }
  ],
};
