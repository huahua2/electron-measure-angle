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
    // {
      // name: '@electron-forge/maker-zip',
      // platforms: ['darwin']
    // },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './assets/icon.icns',
        overwrite: true,
        additionalDMGOptions: {
          window: {
             size: {
               width: 600,
               height: 600
             }
          }
        },
        format: 'ULFO',
        iconSize: 60
      }
    }
  ],
};
