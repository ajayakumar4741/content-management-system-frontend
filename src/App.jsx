import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './ui_components/AppLayout'
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import ProfilePage from './pages/ProfilePage'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import SignupPage from './pages/SignupPage'
import CreatePostPage from './pages/CreatePostPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './ui_components/ProtectedRoute'
import { getUsername } from './services/apiBlog'
import NotFoundPage from './pages/NotFoundPage'
import ErrorBoundary from './pages/ErrorBoundary'
import FallbackUI from './ui_components/FallBackUi'


function App() {
  const [username,setUsername] = useState(null)
  const [isAuthenticated,setIsAuthenticated] = useState(false)
  
  const {data} = useQuery({
    queryKey:['username'],
    queryFn: getUsername
  })
  useEffect(function (){
    if (data){
      setUsername(data.username)
      setIsAuthenticated(true)
    }
  },[data])
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} username={username} setUsername={setUsername} />}>
      <Route index element={<HomePage />} />
      <Route path='*' element={<NotFoundPage />}/>
      <Route path='profile/:username' element={<ProfilePage authUsername={username} />} />
      <Route path="blogs/:slug" element={<DetailPage username={username} isAuthenticated={isAuthenticated} />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/create_post' element={<ProtectedRoute><CreatePostPage isAuthenticated={isAuthenticated} /></ProtectedRoute>} />
      <Route path='/login' element={<ErrorBoundary> <LoginPage setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} /></ErrorBoundary>} />
      
    </Route>

      </Routes>
    </BrowserRouter>
  
  )
}

export default App
