import DdnJS from '@ddn/js-sdk';

// const { config } = window.DdnJS;
// process.env.DDN_ENV = 'mainnet';

const setup = DdnJS.setup({
  net: 'mainnet',
});

console.log('config', setup.config);
console.log('constants', setup.constants);

export default { config: setup.config, constants: setup.constants, jsSdk: DdnJS };
