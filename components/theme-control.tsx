'use client'

import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'medicalsathi-theme'

function applyTheme(preference: ThemePreference) {
  const isDark = preference === 'dark' || (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.dataset.theme = preference
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#101a24' : '#ffffff')
}

export function ThemeControl() {
  const [preference, setPreference] = useState<ThemePreference>('system')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') setPreference(stored)

    function syncPreference(event: Event) {
      const nextPreference = (event as CustomEvent<ThemePreference>).detail
      if (nextPreference === 'light' || nextPreference === 'dark' || nextPreference === 'system') setPreference(nextPreference)
    }

    window.addEventListener('medicalsathi-theme-change', syncPreference)
    return () => window.removeEventListener('medicalsathi-theme-change', syncPreference)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => { if (preference === 'system') applyTheme('system') }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [preference])

  function changeTheme(value: string) {
    if (value !== 'light' && value !== 'dark' && value !== 'system') return
    setPreference(value)
    window.localStorage.setItem(STORAGE_KEY, value)
    window.dispatchEvent(new CustomEvent<ThemePreference>('medicalsathi-theme-change', { detail: value }))
    applyTheme(value)
  }

  const Icon = preference === 'light' ? Sun : preference === 'dark' ? Moon : Monitor

  return (
    <label className="theme-control">
      <Icon aria-hidden="true" />
      <span className="sr-only">Color theme</span>
      <select aria-label="Color theme" value={preference} onChange={(event) => changeTheme(event.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </label>
  )
}
