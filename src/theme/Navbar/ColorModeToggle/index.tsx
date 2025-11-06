import { useColorMode, useThemeConfig } from '@docusaurus/theme-common'
import { Icon } from '@iconify/react'
import type { Props } from '@theme/Navbar/ColorModeToggle'
import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'

type ColorModeOption = 'light' | 'dark' | 'auto'

export default function NavbarColorModeToggle({ className }: Props): React.JSX.Element | null {
  const disabled = useThemeConfig().colorMode.disableSwitch
  const { colorMode, setColorMode } = useColorMode()
  const [selectedMode, setSelectedMode] = useState<ColorModeOption>('auto')

  // 初始化：从 localStorage 读取用户选择
  useEffect(() => {
    const stored = localStorage.getItem('theme-mode-choice') as ColorModeOption | null
    if (stored && ['light', 'dark', 'auto'].includes(stored)) {
      setSelectedMode(stored)
    }
  }, [])

  // 监听系统主题变化（仅在 auto 模式下）
  useEffect(() => {
    if (selectedMode !== 'auto')
      return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setColorMode(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [selectedMode, setColorMode])

  if (disabled) {
    return null
  }

  // 循环切换：浅色 → 深色 → 跟随系统 → 浅色
  const handleToggle = () => {
    let nextMode: ColorModeOption
    if (selectedMode === 'light') {
      nextMode = 'dark'
    }
    else if (selectedMode === 'dark') {
      nextMode = 'auto'
    }
    else {
      nextMode = 'light'
    }

    setSelectedMode(nextMode)
    localStorage.setItem('theme-mode-choice', nextMode)

    if (nextMode === 'auto') {
      // 跟随系统
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setColorMode(isDark ? 'dark' : 'light')
    }
    else {
      setColorMode(nextMode)
    }
  }

  const getModeIcon = (mode: ColorModeOption): string => {
    switch (mode) {
      case 'light':
        return 'ph:sun-fill'
      case 'dark':
        return 'ph:moon-fill'
      case 'auto':
        return 'ph:circle-half'
      default:
        return 'ph:circle-half'
    }
  }

  const getModeLabel = (mode: ColorModeOption): string => {
    switch (mode) {
      case 'light':
        return '浅色模式'
      case 'dark':
        return '深色模式'
      case 'auto':
        return '跟随系统'
      default:
        return '跟随系统'
    }
  }

  return (
    <button
      className={`${styles.toggleButton} ${className || ''}`}
      onClick={handleToggle}
      aria-label={`当前: ${getModeLabel(selectedMode)}，点击切换`}
      title={getModeLabel(selectedMode)}
      type="button"
    >
      <Icon icon={getModeIcon(selectedMode)} width="20" height="20" />
    </button>
  )
}
