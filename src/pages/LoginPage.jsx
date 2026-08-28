import React from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import SmallSpinner from '@/ui_components/SmallSpinner';
import InputErrors from '@/ui_components/InputErrors';
import GoogleAuth from '@/components/ui/oauth';
import { getUsername, signin } from '@/services/apiBlog';

function LoginPage({setIsAuthenticated,setUsername}) {
  const {register,handleSubmit,formState} = useForm()
  const {errors} = formState
  const location = useLocation()
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: (data) => signin(data),
    onSuccess: (response) => {
      localStorage.setItem("access",response.access)
      localStorage.setItem("refresh",response.refresh)
      setIsAuthenticated(true)
      getUsername().then(res => setUsername(res.username))
      toast.success('Signin successfully!!!')
      const from = location?.state?.from?.pathname || '/'
      navigate(from,{replace:true})
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })
  function onSubmit(data){
    
    mutation.mutate(data)
  } 
  return (
    <form
     onSubmit={handleSubmit(onSubmit)}
      className="md:px-16 px-8 py-6 flex flex-col mx-auto my-9 
    items-center gap-4 w-fit rounded-lg bg-[#FFFFFF] shadow-xl 
    dark:text-white dark:bg-[#141624]"
    >
      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        <h3 className="font-semibold text-2xl">Signin Form</h3>
        <p>Welcome back! Log in to continue.</p>
      </div>
      {/* google auth */}
      <div className="w-full flex flex-col items-center gap-2 mb-2">
        <GoogleAuth
          onSuccess={(data) => {
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);
            setIsAuthenticated(true);
            setUsername(data.user.username);
            toast.success('Signin successfully!!!');
            const from = location?.state?.from?.pathname || '/';
            navigate(from, { replace: true });
          }}
          onError={(err) => {
            const message = err?.response?.data?.detail || err?.response?.data?.error || err?.message || 'Google sign-in failed';
            toast.error(message);
            console.error('Google sign-in error:', err.response?.data || err);
          }}
        />
        <div className="flex items-center gap-2 w-full max-w-[300px]">
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
          <span className="text-xs text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-2">
        <Label htmlFor="username" className="dark:text-[97989F]">
          Username
        </Label>
        <Input
          type="text"
          id="username"
          disabled={mutation.isPending}
          placeholder="Enter username"
          {...register("username", { required: "Username is required" })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.username?.message && (
          <InputErrors error={errors.username.message} />
        )}
      </div>

      <div className="flex flex-col gap-2 mb-2">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          disabled={mutation.isPending}
          placeholder="Enter password"
          {...register("password", { required: "Password is required" })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px]  w-[300px]"
        />
        {errors?.password?.message && (
          <InputErrors error={errors.password.message} />
        )}
      </div>

      <div className="w-full flex items-center justify-center flex-col my-4">
        <button disabled={mutation.isPending} className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2">
          {mutation.isPending ? (<> <SmallSpinner /> <small className='text-[16px]'>Loging up...</small></>) : (<small className='text-[16px]'>Login</small>) }
        </button>
        <p className="text-[14px]">
          Don't have an account? <Link to="/signup">signup</Link>
        </p>
      </div>
    </form>
  )
}

export default LoginPage
