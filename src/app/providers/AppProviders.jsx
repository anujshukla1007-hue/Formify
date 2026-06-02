import { ThemeProvider } from '../theme/ThemeProvider.jsx'

export function AppProviders({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

