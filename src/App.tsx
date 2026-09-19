import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LifePage from './pages/LifePage'
import GrowthPage from './pages/GrowthPage'
import ExperimentPage from './pages/ExperimentPage'
import ProfilePage from './pages/ProfilePage'
import ChatPage from './pages/ChatPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="life" element={<LifePage />} />
        <Route path="growth" element={<GrowthPage />} />
        <Route path="experiment" element={<ExperimentPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
