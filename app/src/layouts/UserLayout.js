import React, { Fragment } from 'react';
import { Icon, Card } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
// import logo from '../assets/logo.svg';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 Powered by DDN team
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <Card style={{width:"62.5%", minWidth:"1080px", margin:"0px auto", marginTop:"120px",padding:'0', borderRadius: '20px'}}>
          <div className={styles.content}>
            <div className={styles.left}>
              <div className={styles.leftimg} />
            </div>
            <div className={styles.right}>
              {children}
            </div>
          </div>
        </Card>
        <GlobalFooter copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
