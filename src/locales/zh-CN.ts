import component from './zh-CN/component';
import menu from './zh-CN/menu';
import pages from './zh-CN/pages';

export default {
  'app.name': 'DDN 钱包',
  // 其他翻译...
  
  // 时间相关翻译
  'time.years': '{value}年',
  'time.months': '{value}月',
  'time.days': '{value}天',
  'time.hours': '{value}个小时',
  'blockchain.runtime': '区块链已运行 {time}',
  
  ...menu,
  ...component,
  ...pages,
};
