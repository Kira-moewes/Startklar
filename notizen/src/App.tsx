import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './lib/AuthProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Login } from './routes/Login'
import { Signup } from './routes/Signup'
import { Ideen } from './routes/Ideen'
import { Inbox } from './routes/Inbox'
import { Graph } from './routes/Graph'
import { Agent } from './routes/Agent'
import { Settings } from './routes/Settings'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/ideen" replace />} />
            <Route
              path="/ideen"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Ideen />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Inbox />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/graph"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Graph />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/graph/:ideaId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Graph />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Agent />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/ideen" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
