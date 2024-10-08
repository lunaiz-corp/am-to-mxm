function applySystemTheme(
  setTheme: (theme: 'system_light' | 'system_dark' | 'light' | 'dark') => void,
) {
  const themeMedia: MediaQueryList = window.matchMedia(
    '(prefers-color-scheme: dark)',
  );

  setTheme(themeMedia.matches ? 'system_dark' : 'system_light');

  themeMedia.addEventListener('change', (e) => {
    setTheme(e.matches ? 'system_dark' : 'system_light');
  });
}

// 테마 변수 초기화
export function initTheme(
  theme: '' | 'system_light' | 'system_dark' | 'light' | 'dark',
  setTheme: (theme: 'system_light' | 'system_dark' | 'light' | 'dark') => void,
) {
  const storedTheme = window.localStorage.getItem('theme');
  if (storedTheme === null || theme.startsWith('system')) {
    // 시스템모드일 경우
    applySystemTheme(setTheme);
  } else {
    // 사용자 설정이 있을 경우
    setTheme(storedTheme === 'dark' || theme === 'dark' ? 'dark' : 'light');
  }
}

export function toggleTheme(
  theme: '' | 'system_light' | 'system_dark' | 'light' | 'dark',
  setTheme: (theme: 'system_light' | 'system_dark' | 'light' | 'dark') => void,
) {
  if (theme === 'dark') {
    // 다크모드 였을 경우 -> 시스템으로 전환
    applySystemTheme(setTheme);
  } else {
    // 라이트모드 였을 경우 -> 다크모드로 전환
    // 시스템모드 였을 경우 -> 라이트모드로 전환
    setTheme(theme === 'light' ? 'dark' : 'light');
  }
}
