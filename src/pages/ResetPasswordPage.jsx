import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { confirmPasswordReset } from '@/services/apiBlog'
import SmallSpinner from '@/ui_components/SmallSpinner'
import InputErrors from '@/ui_components/InputErrors'

function ResetPasswordPage() {
  const { uid, token } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState } = useForm()
  const { errors } = formState
  const password = watch('new_password1')
  const mutation = useMutation({
    mutationFn: (data) => confirmPasswordReset(uid, token, data),
    onSuccess: (response) => {
      toast.success(response.detail)
      navigate('/login', { replace: true })
    },
    onError: (error) => {
      const detail = error.response?.data?.detail
      const validationErrors = error.response?.data?.errors
      toast.error(detail || validationErrors?.new_password?.[0] || 'Unable to reset your password.')
    },
  })

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="md:px-16 px-8 py-6 flex flex-col mx-auto my-9 items-center gap-4 w-fit rounded-lg bg-[#FFFFFF] shadow-xl dark:text-white dark:bg-[#141624]"
    >
      <div className="flex flex-col gap-2 justify-center items-center mb-2 text-center">
        <h3 className="font-semibold text-2xl">Choose a new password</h3>
        <p>Use a strong password you have not used before.</p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="new_password1">New password</Label>
        <Input
          type="password"
          id="new_password1"
          disabled={mutation.isPending}
          {...register('new_password1', { required: 'New password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors.new_password1?.message && <InputErrors error={errors.new_password1.message} />}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="new_password2">Confirm password</Label>
        <Input
          type="password"
          id="new_password2"
          disabled={mutation.isPending}
          {...register('new_password2', { required: 'Please confirm your password', validate: (value) => value === password || 'Passwords do not match' })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors.new_password2?.message && <InputErrors error={errors.new_password2.message} />}
      </div>
      <button disabled={mutation.isPending} className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2">
        {mutation.isPending ? <><SmallSpinner /><small className="text-[16px]">Resetting...</small></> : <small className="text-[16px]">Reset password</small>}
      </button>
      <Link to="/login" className="text-sm text-blue-600 underline">Back to login</Link>
    </form>
  )
}

export default ResetPasswordPage
