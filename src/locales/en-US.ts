import component from './en-US/component';
import menu from './en-US/menu';
import pages from './en-US/pages';

export default {
  'app.name': 'DDN Wallet',
  // 其他翻译...
  
  // 时间相关翻译
  'time.years': '{value} years ',
  'time.months': '{value} months ',
  'time.days': '{value} days ',
  'time.hours': '{value} hours',
  'blockchain.runtime': 'Blockchain has been running for {time}',
  
  ...menu,
  ...component,
  ...pages,
};
