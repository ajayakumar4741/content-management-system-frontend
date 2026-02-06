import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import Spinner from './Spinner'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}) {
    const [isAuthorized, setAuthorized] = useState(null)

    useEffect(function(){
      authorize().catch(() => setAuthorized(false))
    },[])

    async function refreshToken(){
      const refresh = localStorage.getItem('refresh')

      try{
        const response = await api.post('api/token/refresh/',{refresh})
        if (response.status === 200){
          localStorage.setItem('access',response.data.success)
          setAuthorized(true)
        }else{
          setAuthorized(false)
        }
      }
      catch(err){
        setAuthorized(false)
        console.log(err)
      }
    }
    
    async function authorize(){
        const token = localStorage.getItem("access")
        if (!token){
            setAuthorized(false)
            return
        }
        const decodedToken = jwtDecode(token)
        const expiry_date = decodedToken.exp
        const current_time = Date.now()/1000
        if(current_time > expiry_date){
          await refreshToken()
        }else{
          setAuthorized(true)
        }
    }
    if (isAuthorized === null){
      return <Spinner />
    }
  return (
    <>
      {isAuthorized ? children : <Navigate to='/login'/>}
    </>
  )
}

export default ProtectedRoute
