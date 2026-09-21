import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { requestPasswordReset } from '@/services/apiBlog'
import SmallSpinner from '@/ui_components/SmallSpinner'
import InputErrors from '@/ui_components/InputErrors'

function ForgotPasswordPage() {
  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState
  const mutation = useMutation({
    mutationFn: ({ email }) => requestPasswordReset(email),
    onSuccess: (response) => toast.success(response.detail),
    onError: () => toast.error('Unable to send the reset email. Please try again.'),
  })

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="md:px-16 px-8 py-6 flex flex-col mx-auto my-9 items-center gap-4 w-fit rounded-lg bg-[#FFFFFF] shadow-xl dark:text-white dark:bg-[#141624]"
    >
      <div className="flex flex-col gap-2 justify-center items-center mb-2 text-center">
        <h3 className="font-semibold text-2xl">Reset your password</h3>
        <p>Enter your email and we will send you a reset link.</p>
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          disabled={mutation.isPending}
          placeholder="Enter your email"
          {...register('email', { required: 'Email is required' })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors.email?.message && <InputErrors error={errors.email.message} />}
      </div>
      <button disabled={mutation.isPending} className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2">
        {mutation.isPending ? <><SmallSpinner /><small className="text-[16px]">Sending...</small></> : <small className="text-[16px]">Send reset link</small>}
      </button>
      <Link to="/login" className="text-sm text-blue-600 underline">Back to login</Link>
    </form>
  )
}

export default ForgotPasswordPage
