import React from 'react';
import { Button, Result } from 'antd';
import { history, useIntl } from '@umijs/max';

const NoFoundPage: React.FC = () => {
  const intl = useIntl();

  return (
    <Result
      status="404"
      title="404"
      subTitle={intl.formatMessage({ id: 'pages.404.subTitle' }, { defaultMessage: '抱歉，您访问的页面不存在。' })}
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          {intl.formatMessage({ id: 'pages.404.back' }, { defaultMessage: '返回首页' })}
        </Button>
      }
    />
  );
};

export default NoFoundPage;
