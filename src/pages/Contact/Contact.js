import React, { Fragment } from 'react';
import { Card, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const pageTitle = (
  <div style={{ display: 'flex' }}>
    <div style={{ flex: '1' }}>
      <Icon type="phone" />
      <span style={{ marginLeft: '20px' }}>{formatMessage({ id: 'menu.contactUs' })}</span>
    </div>
  </div>
);

class ContractUs extends React.PureComponent {
  render() {
    return (
      <PageHeaderWrapper title={pageTitle}>
        <Fragment>
          <Card>
            <div>
              {/* <h1>{formatMessage({ id: 'app.contact.introdction' })}</h1> */}
              <div style={{ flex: '1' }}>
                <Icon type="book" />
                <span style={{ marginLeft: '20px' }}>
                  {formatMessage({ id: 'app.contact.info' })}
                </span>
              </div>
              <div style={{ flex: '1' }}>
                <Icon type="mail" />
                <span style={{ marginLeft: '20px' }}>
                  {formatMessage({ id: 'app.contact.emai' })}
                </span>
              </div>
              <div style={{ flex: '1' }}>
                <Icon type="phone" />
                <span style={{ marginLeft: '20px' }}>
                  {formatMessage({ id: 'app.contact.phone' })}
                </span>
              </div>
            </div>
          </Card>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default ContractUs;
