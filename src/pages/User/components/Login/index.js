import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Tabs } from 'antd';
import classNames from 'classnames';
import LoginSubmit from './LoginSubmit';
import styles from './index.less';

class Login extends Component {
  formRef = React.createRef();

  static propTypes = {
    className: PropTypes.string,
    defaultActiveKey: PropTypes.string,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      tabs: [],
      active: {},
    };
  }

  handleSubmit = async values => {
    const { onSubmit } = this.props;
      try {
        const result = await this.formRef.current.validateFields();
        onSubmit(null, result);
      } catch (err) {
        onSubmit(err);
      }
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  render() {
    const { className, children } = this.props;
    const { type, tabs } = this.state;
    return (
      <div className={classNames(className, styles.login)}>
        <Form ref={this.formRef} name='login' onFinish={this.handleSubmit} onFinishFailed={this.onFinishFailed}>
          {[...children]}
        </Form>
      </div>
    );
  }
}

Login.Submit = LoginSubmit;

export default Login;
