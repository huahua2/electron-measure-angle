module.exports = {
  packagerConfig: {
    icon: './assets/icon'
  },
  rebuildConfig: {},
  makers: [
    // {
    //   name: '@electron-forge/maker-squirrel',
    //   config: {},
    // },
    {
      name: '@electron-forge/maker-zip',
      // platforms: ['darwin']
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
