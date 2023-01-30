module.exports = {
  packagerConfig: {
    icon: './assets/icon',
    platform: 'all',
    asar: true
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        title: '角度测量',
        iconUrl: 'http://192.168.0.148:8081/icon.ico',
        setupIcon: './assets/icon.ico'
      },
    },
    // {
    //   name: '@electron-forge/maker-zip',
    //   platforms: ['darwin']
    // },
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
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
