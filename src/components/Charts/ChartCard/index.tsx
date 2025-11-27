import React, { ReactNode } from 'react';
import { Card, Spin } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

export interface ChartCardProps {
  title: ReactNode;
  action?: ReactNode;
  total?: ReactNode | (() => ReactNode);
  footer?: ReactNode;
  contentHeight?: number;
  avatar?: ReactNode;
  style?: React.CSSProperties;
  // 更新接口定义，使用 variant 替代 bordered
  variant?: 'outlined' | 'borderless';
  loading?: boolean;
  bordered?: boolean; // 保留以兼容旧代码
}

const ChartCard: React.FC<ChartCardProps> = (props) => {
  const {
    loading = false,
    bordered = false,
    variant,
    title,
    action,
    total,
    footer,
    contentHeight,
    avatar,
    style,
    children,
  } = props;

  const renderTotal = () => {
    if (!total) {
      return null;
    }
    return (
      <div className={styles.total}>
        {typeof total === 'function' ? total() : total}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.chartLoading}>
          <Spin />
        </div>
      );
    }
    return (
      <div className={styles.chartContent} style={{ height: contentHeight || 'auto' }}>
        <div className={classNames(styles.chartTop, { [styles.chartTopMargin]: !children })}>
          <div className={styles.avatar}>{avatar}</div>
          <div className={styles.metaWrap}>
            <div className={styles.meta}>
              <span className={styles.title}>{title}</span>
              <span className={styles.action}>{action}</span>
            </div>
            {renderTotal()}
          </div>
        </div>
        {children && <div className={styles.content}>{children}</div>}
        {footer && <div className={classNames(styles.footer)}>{footer}</div>}
      </div>
    );
  };

  // 根据 bordered 属性设置 variant
  // 如果提供了 variant，则优先使用 variant
  // 如果没有提供 variant 但提供了 bordered，则根据 bordered 设置 variant
  const cardVariant = variant || (bordered ? 'outlined' : 'borderless');

  return (
    <Card
      className={styles.chartCard}
      style={{ ...style, padding: '20px 24px 8px 24px' }}
      variant={cardVariant}
    >
      {renderContent()}
    </Card>
  );
};

export default ChartCard;
