import React, { PureComponent } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Avatar, Badge, Rate, Row, Col, Card, Pagination } from 'antd';
import TagSelect from '@/components/TagSelect';

@connect(({ dapp, user, loading }) => ({
  dapps: dapp.dapps,
  catagories: dapp.catagories,
  currentAccount: user.currentAccount,
  loading: loading.models.dapp,
}))
class DappList extends PureComponent {
  state = {
    curCategory: null,
    current: 1,
  };

  componentDidMount() {
    this.getCatagries();
    this.getDapps({ pagesize: 10, pageindex: 1 });
  }

  getCatagries = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dapp/fetchCatagories',
    });
  };

  getDapps = (payload = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dapp/fetchDapps',
      payload: { install: 'false', ...payload },
    });
  };

  getCatagryName = type => {
    const { catagories } = this.props;
    const keys = Object.keys(catagories);
    let cName = '';
    keys.forEach(key => {
      if (catagories[key] === Number(type)) {
        cName = key;
      }
    });
    return cName;
  };

  lokkDetail = item => {
    router.push(`/dapp/dapp-detail?dappid=${item.transaction_id}`);
  };

  handleOnTagChange = value => {
    const { catagories } = this.props;
    let payload = {};
    const category = [];
    value.map(item => (catagories[item] ? category.push(catagories[item]) : null));
    payload = { category };
    this.setState({
      curCategory: value,
    });
    this.getDapps(payload);
  };

  onchangePage = page => {
    this.setState({
      current: page,
    });
    this.getDapps({ pagesize: 10, pageindex: page });
  };

  render() {
    const { dapps, catagories } = this.props;
    const { curCategory, current } = this.state;
    const catagoryNames = Object.keys(catagories);
    return (
      <div>
        <div style={{ display: 'flex', lineHeight: '30px', margin: '10px' }}>
          <h1 style={{ marginRight: 10, minWidth: '60px' }}>类型</h1>
          <TagSelect expandable onChange={this.handleOnTagChange} value={curCategory}>
            {catagoryNames.length > 0 &&
              catagoryNames.map(category => (
                <TagSelect.Option value={category}>{category}</TagSelect.Option>
              ))}
          </TagSelect>
        </div>
        <Row gutter={24}>
          {dapps &&
            dapps.list.length > 0 &&
            dapps.list.map(item => (
              <Col span={6} style={{ margin: '10px 0' }}>
                <Card bordered={false}>
                  <div
                    style={{
                      minHeight: '120px',
                      backgroundColor: '#f5f5f5',
                      padding: '10px',
                      textAlign: 'center',
                    }}
                  >
                    <div>
                      <Avatar size={48} src={`${item.icon ? item.icon : item.name.slice(0, 1)}`} />
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: '24px' }}>
                      <div>{item.name}</div>
                      <div>
                        <Rate allowHalf disabled defaultValue={2.5} style={{ fontSize: '10px' }} />
                        （234）
                      </div>
                      <div>{this.getCatagryName(item.category)}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <div style={{ textAlign: 'center' }}>
                      <Badge
                        color={item.status === 'installed' ? 'green' : 'gray'}
                        text={item.status === 'installed' ? '已安装' : '未安装'}
                      />
                    </div>
                    <div style={{ padding: '10px 20px' }}>
                      <Button
                        block
                        type="primary"
                        shape="round"
                        onClick={() => this.lokkDetail(item)}
                      >
                        详情
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
        {dapps.pagination.total > 0 ? (
          <Pagination
            style={{ textAlign: 'center' }}
            current={current}
            onChange={this.onchangePage}
            defaultCurrent={1}
            total={dapps.pagination.total}
          />
        ) : null}
      </div>
    );
  }
}

export default DappList;
