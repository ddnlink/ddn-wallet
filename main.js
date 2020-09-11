const electron = require('electron');
const { app, Menu, shell, BrowserWindow, session } = electron;

const path = require('path');
const url = require('url');

let mainWindow;

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require

    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

    // TODO: Use async interation statement.
    //       Waiting on https://github.com/tc39/proposal-async-iteration
    //       Promises will fail silently, which isn't what we want in development
    return Promise.all(
      extensions.map(name => installer.default(installer[name], forceDownload))
    ).catch(console.log);
  }
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 760,
    // fullscreen: true, // 窗口是否可以全屏.
    // skipTaskbar: true, // 是否在任务栏中显示窗口.
    show: false, // 窗口创建的时候是否显示.
    backgroundColor: '#2e2c29',
  });
  // mainWindow.openDevTools(); // 打开开发者模式(调试).
  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000'
      : `file://${__dirname}/dist/index.html`
  );
  mainWindow.on('closed', () => (mainWindow = null));

  // mainWindow.setFullScreen(true); // 设置窗口是否应处于全屏模式.
  mainWindow.maximize(); // 最大化窗口。如果窗口尚未显示, 这也将会显示 (但不会聚焦).

  /*
     * 使用ready-to-show事件.
     * 在加载页面时，渲染进程第一次完成绘制时，会发出 ready-to-show 事件。 在此事件后显示窗口将没有视觉闪烁:
     * new BrowserWindow({show: false})
     */
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  /*
     * 设置 backgroundColor.
     * 对于一个复杂的应用，ready-to-show 可能发出的太晚，会让应用感觉缓慢。 在这种情况下，建议立刻显示窗口，并使用接近应用程序背景的 backgroundColor
     * new BrowserWindow({backgroundColor: '#2e2c29'})
     * 请注意，即使是使用 ready-to-show 事件的应用程序，仍建议使用设置 backgroundColor 使应用程序感觉更原生。
     */
}

app.on('ready', function() {
  //安装react，redux调试工具，第一次运行时打开，需要vpn
  // if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  //     await installExtensions();
  // }
  createWindow();
  // mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// ---------------------  创建Menu --------------------------

class MenuBuilder {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      this.setupDevelopmentEnvironment();
    }

    let template;

    if (process.platform === 'darwin') {
      template = this.buildDarwinTemplate();
    } else {
      template = this.buildDefaultTemplate();
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }
  setmenu(item) {
    let curlocale = app.getLocale();
    if (curlocale !== 'zh-CN' && curlocale !== 'en') {
      curlocale = 'en';
    }
    return menuData[curlocale][item];
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.inspectElement(x, y);
          },
        },
      ]).popup(this.mainWindow);
    });
  }

  buildDarwinTemplate() {
    console.log('buildDarwinTemplate');
    console.log(this.setmenu('About DDN Wallet'));
    console.log(this.setmenu('About DDN Wallet'), this.setmenu('Quit'));

    const subMenuAbout = {
      label: 'DDNWallet',
      submenu: [
        { label: this.setmenu('About DDN Wallet'), selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        { label: this.setmenu('Services'), submenu: [] },
        { type: 'separator' },
        { label: this.setmenu('Hide DDN Wallet'), accelerator: 'Command+H', selector: 'hide:' },
        {
          label: this.setmenu('Hide Others'),
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: this.setmenu('Show All'), selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: this.setmenu('Quit'),
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit = {
      label: this.setmenu('Edit'),
      submenu: [
        { label: this.setmenu('Undo'), accelerator: 'Command+Z', selector: 'undo:' },
        { label: this.setmenu('Redo'), accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: this.setmenu('Cut'), accelerator: 'Command+X', selector: 'cut:' },
        { label: this.setmenu('Copy'), accelerator: 'Command+C', selector: 'copy:' },
        { label: this.setmenu('Paste'), accelerator: 'Command+V', selector: 'paste:' },
        { label: this.setmenu('Select All'), accelerator: 'Command+A', selector: 'selectAll:' },
      ],
    };
    const subMenuViewDev = {
      label: this.setmenu('View'),
      submenu: [
        {
          label: this.setmenu('Reload'),
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: this.setmenu('Toggle Full Screen'),
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: this.setmenu('Toggle Developer Tools'),
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd = {
      label: this.setmenu('View'),
      submenu: [
        {
          label: this.setmenu('Toggle Full Screen'),
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow = {
      label: this.setmenu('Window'),
      submenu: [
        {
          label: this.setmenu('Minimize'),
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: this.setmenu('Close'), accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: this.setmenu('Bring All to Front'), selector: 'arrangeInFront:' },
      ],
    };

    const subMenuHelp = {
      label: this.setmenu('Help'),
      submenu: [
        {
          label: this.setmenu('About DDN'),
          click() {
            shell.openExternal('http://ddn.link');
          },
        },
        {
          label: this.setmenu('Github Resource'),
          click() {
            shell.openExternal('https://github.com/ddnlink');
          },
        },
        {
          label: this.setmenu('Community'),
          click() {
            shell.openExternal('http://ddn.link/community');
          },
        },
        {
          label: this.setmenu('Blockchain Browser'),
          click() {
            shell.openExternal('http://mainnet.ddn.link/');
          },
        },
      ],
    };

    const subMenuView = process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd;
    console.log('buildDarwinTemplate end');
    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: this.setmenu('File'),
        submenu: [
          {
            label: this.setmenu('Open'),
            accelerator: 'Ctrl+O',
          },
          {
            label: this.setmenu('Close'),
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: this.setmenu('View'),
        submenu:
          process.env.NODE_ENV === 'development'
            ? [
                {
                  label: this.setmenu('Reload'),
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: this.setmenu('Toggle Full Screen'),
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                  },
                },
                {
                  label: this.setmenu('Toggle Developer Tools'),
                  accelerator: 'Alt+Ctrl+I',
                  click: (item, focusedWindow) => {
                    if (focusedWindow) {
                      focusedWindow.toggleDevTools();
                    }
                  },
                },
              ]
            : [
                {
                  label: this.setmenu('Toggle Full Screen'),
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                  },
                },
              ],
      },
      {
        label: this.setmenu('Help'),
        submenu: [
          {
            label: this.setmenu('About DDN'),
            click() {
              shell.openExternal('http://ddn.link');
            },
          },
          {
            label: this.setmenu('Github Resource'),
            click() {
              shell.openExternal('https://github.com/ddnlink');
            },
          },
          {
            label: this.setmenu('Community'),
            click() {
              shell.openExternal('http://ddn.link/community');
            },
          },
          {
            label: this.setmenu('Blockchain Browser'),
            click() {
              shell.openExternal('http://mainnet.ddn.link/');
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}

const menuData = {
  'zh-CN': {
    File: '文件',
    Open: '打开',
    Close: '关闭',
    'About DDN Wallet': '关于 DDN Wallet',
    Services: '服务',
    'Hide DDN Wallet': '隐藏 DDN Wallet',
    'Hide Others': '隐藏其他',
    'Show All': '显示全部',
    Quit: '退出',
    Edit: '编辑',
    Undo: '返回',
    Redo: '重做',
    Cut: '剪切',
    Copy: '复制',
    Paste: '粘贴',
    'Select All': '选择全部',
    View: '视图',
    Reload: '重新加载',
    'Toggle Developer Tools': '切换 开发工具',
    'Toggle Full Screen': '切换 全屏',
    Window: '窗口',
    Minimize: '最小化',
    'Bring All to Front': '前置全部窗口',
    Help: '帮助',
    'About DDN': '关于DDN',
    'Github Resource': 'Github 资源',
    Community: '微社区',
    'Blockchain Browser': '区块链浏览器',
  },
  en: {
    File: 'File',
    Open: 'Open',
    Close: 'Close',
    View: 'View',
    'About DDN Wallet': 'About DDN Wallet',
    Services: 'Services',
    'Hide DDN Wallet': 'Hide DDN Wallet',
    'Hide Others': 'Hide Others',
    'Show All': 'Show All',
    Quit: 'Quit',
    Edit: 'Edit',
    Undo: 'Undo',
    Redo: 'Redo',
    Cut: 'Cut',
    Copy: 'Copy',
    Paste: 'Paste',
    'Select All': 'Select All',
    View: 'View',
    Reload: 'Reload',
    'Toggle Developer Tools': 'Toggle Developer Tools',
    'Toggle Full Screen': 'Toggle Full Screen',
    Window: 'Window',
    Minimize: 'Minimize',
    'Bring All to Front': 'Bring All to Front',
    Help: 'Help',
    'About DDN': 'About DDN',
    'Github Resource': 'Github Resource',
    Community: 'Community',
    'Blockchain Browser': 'Blockchain Browser',
  },
};
