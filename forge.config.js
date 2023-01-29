module.exports = {
  packagerConfig: {
    icon: './assets/icon',
    platform: 'all'
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
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
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
