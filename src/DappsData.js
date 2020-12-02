const Catagories = {
  Common: 1,
  Business: 2,
  Social: 3,
  Education: 4,
  Entertainment: 5,
  News: 6,
  Life: 7,
  Utilities: 8,
  Games: 9,
};
const DappsList = [
  {
    transaction_id:
      '4efbd41f9afce5132e87a0ff6c2e6a42adb72dc5bc1028a37f5e159251350688ca996e796dbb8d90ac20d1039020ea33020f542cf2623805a71acc529270c69e',
    transaction_type: 5,
    timestamp: 84403639,
    name: '应用1',
    description: 'A dapp that should not be added',
    tags: 'handy dizzy pear airplane alike wonder nifty curve young probable tart concentrate',
    link: 'https://github.com/ddnlink/ddn-dapp-demo/archive/v0.1.0.zip',
    type: 0,
    category: 1,
    icon: 'http://ddn.link/static/media/logo.5e78d8c2.png',
    delegates:
      '1e18845d5fbbdf0a6820610e042dcb9a250205964b8075a395453b4a1d1ed10c,c33a9b7a6e51a3fe650fc33d954a56032f722f084442d7aa788cb30ee8fcce5a,dbc795a7359cd301dade11d218e0e2ab4171bde0978e902261f9ffc4d729df04,035b5cdffa3d844108ac1bb1da24b0417ec7803905fda3c19290c03fe6376c48,d07967b16f5af45453dab2c6b832dcc7b9120d88da9b032c96d4680c580002e9',
    unlock_delegates: 3,
    status: 'uninstalled',
  },
  {
    transaction_id:
      '5efbd41f9afce5132e87a0ff6c2e6a42adb72dc5bc1028a37f5e159251350688ca996e796dbb8d90ac20d1039020ea33020f542cf2623805a71acc529270c69e',
    transaction_type: 5,
    timestamp: 84403639,
    name: '应用2',
    description: 'A dapp that should not be added',
    tags: 'handy dizzy pear airplane alike wonder nifty curve young probable tart concentrate',
    link: 'https://github.com/ddnlink/ddn-dapp-demo/archive/v0.1.0.zip',
    type: 0,
    category: 2,
    icon: 'http://ddn.link/static/media/logo.5e78d8c2.png',
    delegates:
      '1e18845d5fbbdf0a6820610e042dcb9a250205964b8075a395453b4a1d1ed10c,c33a9b7a6e51a3fe650fc33d954a56032f722f084442d7aa788cb30ee8fcce5a,dbc795a7359cd301dade11d218e0e2ab4171bde0978e902261f9ffc4d729df04,035b5cdffa3d844108ac1bb1da24b0417ec7803905fda3c19290c03fe6376c48,d07967b16f5af45453dab2c6b832dcc7b9120d88da9b032c96d4680c580002e9',
    unlock_delegates: 3,
    status: 'installed',
  },
  {
    transaction_id:
      '6efbd41f9afce5132e87a0ff6c2e6a42adb72dc5bc1028a37f5e159251350688ca996e796dbb8d90ac20d1039020ea33020f542cf2623805a71acc529270c69e',
    transaction_type: 5,
    timestamp: 84403639,
    name: '应用3',
    description: 'A dapp that should not be added',
    tags: 'handy dizzy pear airplane alike wonder nifty curve young probable tart concentrate',
    link: 'https://github.com/ddnlink/ddn-dapp-demo/archive/v0.1.0.zip',
    type: 0,
    category: 1,
    icon: 'http://ddn.link/static/media/logo.5e78d8c2.png',
    delegates:
      '1e18845d5fbbdf0a6820610e042dcb9a250205964b8075a395453b4a1d1ed10c,c33a9b7a6e51a3fe650fc33d954a56032f722f084442d7aa788cb30ee8fcce5a,dbc795a7359cd301dade11d218e0e2ab4171bde0978e902261f9ffc4d729df04,035b5cdffa3d844108ac1bb1da24b0417ec7803905fda3c19290c03fe6376c48,d07967b16f5af45453dab2c6b832dcc7b9120d88da9b032c96d4680c580002e9',
    unlock_delegates: 3,
    status: 'installed',
  },
  {
    transaction_id:
      '7efbd41f9afce5132e87a0ff6c2e6a42adb72dc5bc1028a37f5e159251350688ca996e796dbb8d90ac20d1039020ea33020f542cf2623805a71acc529270c69e',
    transaction_type: 5,
    timestamp: 84403639,
    name: '应用4',
    description: 'A dapp that should not be added',
    tags: 'handy dizzy pear airplane alike wonder nifty curve young probable tart concentrate',
    link: 'https://github.com/ddnlink/ddn-dapp-demo/archive/v0.1.0.zip',
    type: 0,
    category: 2,
    icon: 'http://ddn.link/static/media/logo.5e78d8c2.png',
    delegates:
      '1e18845d5fbbdf0a6820610e042dcb9a250205964b8075a395453b4a1d1ed10c,c33a9b7a6e51a3fe650fc33d954a56032f722f084442d7aa788cb30ee8fcce5a,dbc795a7359cd301dade11d218e0e2ab4171bde0978e902261f9ffc4d729df04,035b5cdffa3d844108ac1bb1da24b0417ec7803905fda3c19290c03fe6376c48,d07967b16f5af45453dab2c6b832dcc7b9120d88da9b032c96d4680c580002e9',
    unlock_delegates: 3,
    status: 'installed',
  },
  {
    transaction_id:
      '8efbd41f9afce5132e87a0ff6c2e6a42adb72dc5bc1028a37f5e159251350688ca996e796dbb8d90ac20d1039020ea33020f542cf2623805a71acc529270c69e',
    transaction_type: 5,
    timestamp: 84403639,
    name: '应用5',
    description: 'A dapp that should not be added',
    tags: 'handy dizzy pear airplane alike wonder nifty curve young probable tart concentrate',
    link: 'https://github.com/ddnlink/ddn-dapp-demo/archive/v0.1.0.zip',
    type: 0,
    category: 3,
    icon: 'http://ddn.link/static/media/logo.5e78d8c2.png',
    delegates:
      '1e18845d5fbbdf0a6820610e042dcb9a250205964b8075a395453b4a1d1ed10c,c33a9b7a6e51a3fe650fc33d954a56032f722f084442d7aa788cb30ee8fcce5a,dbc795a7359cd301dade11d218e0e2ab4171bde0978e902261f9ffc4d729df04,035b5cdffa3d844108ac1bb1da24b0417ec7803905fda3c19290c03fe6376c48,d07967b16f5af45453dab2c6b832dcc7b9120d88da9b032c96d4680c580002e9',
    unlock_delegates: 3,
    status: 'installed',
  },
];

const DappDetail = {
  transaction_id:
    '6efbd41f9afce5132e87a0ff6c2e6a42adb72dc5bc1028a37f5e159251350688ca996e796dbb8d90ac20d1039020ea33020f542cf2623805a71acc529270c69e',
  transaction_type: 5,
  timestamp: 84403639,
  name: '应用5',
  description: 'A dapp that should not be added',
  tags: 'handy dizzy pear airplane alike wonder nifty curve young probable tart concentrate',
  link: 'https://github.com/ddnlink/ddn-dapp-demo/archive/v0.1.0.zip',
  type: 0,
  category: 3,
  icon: 'http://ddn.link/static/media/logo.5e78d8c2.png',
  delegates:
    '1e18845d5fbbdf0a6820610e042dcb9a250205964b8075a395453b4a1d1ed10c,c33a9b7a6e51a3fe650fc33d954a56032f722f084442d7aa788cb30ee8fcce5a,dbc795a7359cd301dade11d218e0e2ab4171bde0978e902261f9ffc4d729df04,035b5cdffa3d844108ac1bb1da24b0417ec7803905fda3c19290c03fe6376c48,d07967b16f5af45453dab2c6b832dcc7b9120d88da9b032c96d4680c580002e9',
  unlock_delegates: 3,
  status: 'installed',
};

const InstalledDapp = [
  {
    transaction_id:
      '7efbd41f9afce5132e87a0ff6c2e6a42adb72dc5bc1028a37f5e159251350688ca996e796dbb8d90ac20d1039020ea33020f542cf2623805a71acc529270c69e',
    transaction_type: 5,
    timestamp: 84403639,
    name: '应用4',
    description: 'A dapp that should not be added',
    tags: 'handy dizzy pear airplane alike wonder nifty curve young probable tart concentrate',
    link: 'https://github.com/ddnlink/ddn-dapp-demo/archive/v0.1.0.zip',
    type: 0,
    category: 2,
    icon: 'http://ddn.link/static/media/logo.5e78d8c2.png',
    delegates:
      '1e18845d5fbbdf0a6820610e042dcb9a250205964b8075a395453b4a1d1ed10c,c33a9b7a6e51a3fe650fc33d954a56032f722f084442d7aa788cb30ee8fcce5a,dbc795a7359cd301dade11d218e0e2ab4171bde0978e902261f9ffc4d729df04,035b5cdffa3d844108ac1bb1da24b0417ec7803905fda3c19290c03fe6376c48,d07967b16f5af45453dab2c6b832dcc7b9120d88da9b032c96d4680c580002e9',
    unlock_delegates: 3,
    status: 'installed',
  },
  {
    transaction_id:
      '8efbd41f9afce5132e87a0ff6c2e6a42adb72dc5bc1028a37f5e159251350688ca996e796dbb8d90ac20d1039020ea33020f542cf2623805a71acc529270c69e',
    transaction_type: 5,
    timestamp: 84403639,
    name: '应用5',
    description: 'A dapp that should not be added',
    tags: 'handy dizzy pear airplane alike wonder nifty curve young probable tart concentrate',
    link: 'https://github.com/ddnlink/ddn-dapp-demo/archive/v0.1.0.zip',
    type: 0,
    category: 3,
    icon: 'http://ddn.link/static/media/logo.5e78d8c2.png',
    delegates:
      '1e18845d5fbbdf0a6820610e042dcb9a250205964b8075a395453b4a1d1ed10c,c33a9b7a6e51a3fe650fc33d954a56032f722f084442d7aa788cb30ee8fcce5a,dbc795a7359cd301dade11d218e0e2ab4171bde0978e902261f9ffc4d729df04,035b5cdffa3d844108ac1bb1da24b0417ec7803905fda3c19290c03fe6376c48,d07967b16f5af45453dab2c6b832dcc7b9120d88da9b032c96d4680c580002e9',
    unlock_delegates: 3,
    status: 'installed',
  },
];

const InstalledDappIds = [
  '7efbd41f9afce5132e87a0ff6c2e6a42adb72dc5bc1028a37f5e159251350688ca996e796dbb8d90ac20d1039020ea33020f542cf2623805a71acc529270c69e',
  '8efbd41f9afce5132e87a0ff6c2e6a42adb72dc5bc1028a37f5e159251350688ca996e796dbb8d90ac20d1039020ea33020f542cf2623805a71acc529270c69e',
];

const DappData = {
  catagories: Catagories,
  dapplist: DappsList,
  dappDetail: DappDetail,
  installedDapp: InstalledDapp,
  installedDappIds: InstalledDappIds,
};

export default DappData;
