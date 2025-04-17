/**
 * 全局状态管理
 */
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { APP_NAME, NETWORKS, DEFAULT_SETTINGS, STORAGE_KEYS } from '@/constants';
import { getSettings, setSettings } from '@/utils/authority';

export default () => {
  // 应用名称
  const [name] = useState<string>(APP_NAME);

  // 网络类型
  const [network, setNetwork] = useState<string>(() => {
    const settings = getSettings();
    return settings?.network || DEFAULT_SETTINGS.network;
  });

  // 语言
  const [language, setLanguage] = useState<string>(() => {
    const settings = getSettings();
    return settings?.language || DEFAULT_SETTINGS.language;
  });

  // 主题
  const [theme, setTheme] = useState<string>(() => {
    const settings = getSettings();
    return settings?.theme || DEFAULT_SETTINGS.theme;
  });

  // 更新网络类型
  const updateNetwork = useCallback((newNetwork: string) => {
    if (newNetwork !== network) {
      setNetwork(newNetwork);
      const settings = getSettings() || DEFAULT_SETTINGS;
      const newSettings = { ...settings, network: newNetwork };
      setSettings(newSettings);
      message.success(`切换到${newNetwork === NETWORKS.MAINNET ? '主网' : '测试网'}成功`);
    }
  }, [network]);

  // 更新语言
  const updateLanguage = useCallback((newLanguage: string) => {
    if (newLanguage !== language) {
      setLanguage(newLanguage);
      const settings = getSettings() || DEFAULT_SETTINGS;
      const newSettings = { ...settings, language: newLanguage };
      setSettings(newSettings);
    }
  }, [language]);

  // 更新主题
  const updateTheme = useCallback((newTheme: string) => {
    if (newTheme !== theme) {
      setTheme(newTheme);
      const settings = getSettings() || DEFAULT_SETTINGS;
      const newSettings = { ...settings, theme: newTheme };
      setSettings(newSettings);
    }
  }, [theme]);

  return {
    name,
    network,
    language,
    theme,
    updateNetwork,
    updateLanguage,
    updateTheme,
  };
};
