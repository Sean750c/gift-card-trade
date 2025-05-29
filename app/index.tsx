import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 定义默认导出的 Index 组件
export default function Index() {
  // 定义加载状态
  const [isLoading, setIsLoading] = useState(true);
  // 定义用户认证状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 组件挂载时检查认证状态
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 异步检查认证状态的函数
  const checkAuthStatus = async () => {
    try {
      // 从 AsyncStorage 中获取 authToken
      const token = await AsyncStorage.getItem('authToken');
      // 根据 token 是否存在更新认证状态
      setIsAuthenticated(!!token);
    } catch (error) {
      // 捕获并打印错误信息
      console.error('Error checking auth status:', error);
    } finally {
      // 无论结果如何，都将加载状态设置为 false
      setIsLoading(false);
    }
  };

  // 加载时显示启动屏
  if (isLoading) {
    return null; 
  }

  // 已认证用户重定向到 (tabs) 页面
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    // 未认证用户重定向到 onboarding 页面
    return <Redirect href="/onboarding" />;
  }
}