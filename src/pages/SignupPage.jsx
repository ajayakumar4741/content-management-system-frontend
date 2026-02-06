import React, { useEffect,useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerUser, updateProfile } from '@/services/apiBlog';
import { toast } from 'react-toastify';
import SmallSpinner from '@/ui_components/SmallSpinner';
import { Textarea } from '@/components/ui/textarea';
import InputErrors from '@/ui_components/InputErrors';
import axios from 'axios';


function SignupPage({updateForm,userInfo,toggleModal}) {
  const { register, handleSubmit, formState, reset, watch } = useForm({defaultValues: userInfo ? userInfo : {}});
  const { errors } = formState;
  const password = watch("password");
  const queryClient = useQueryClient()
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaKey, setCaptchaKey] = useState("");

  useEffect(()=>{
    loadCaptcha()
  },[])

  const loadCaptcha = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/get_captcha/");
      setCaptchaKey(res.data.key);
      setCaptchaImage("http://localhost:8000" + res.data.image_url);
    } catch (err) {
      toast.error("Failed to load captcha");
    }
  };


  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully !!!")
      toggleModal()
      queryClient.invalidateQueries({queryKey: ['users',userInfo?.username]})
    },
    onError: (err) => {
      toast.error(err)
    }
  })

  // const mutation = useMutation({
  //   mutationFn: (data) => registerUser(data),
  //   onSuccess: () => {
  //     toast.success("Account created successfully!");
  //     reset();
  //     loadCaptcha(); // refresh captcha after success
  //   },
  //   onError: (err) => {
  //     toast.error(err);
  //     loadCaptcha(); // refresh captcha after failure
  //   }
  // });

  const mutation = useMutation({
  mutationFn: registerUser,
  onSuccess: () => {
    toast.success("Account created successfully!");
    reset();
    loadCaptcha();
  },
  onError: (err) => {
    const msg =
      err?.response?.data?.captcha?.[0] ||
      "Invalid captcha. Please try again.";

    toast.error(msg);
    loadCaptcha();
  },
});



  function onSubmitData(data) {
    if(updateForm){
      const formData = new FormData()
      formData.append('username',data.username)
      formData.append('first_name',data.first_name)
      formData.append('last_name',data.last_name)
      formData.append('job_title',data.job_title)
      formData.append('bio',data.bio)
      if(data.profile_picture && data.profile_picture[0]){
        if(data.profile_picture[0] != '/'){
          formData.append('profile_picture',data.profile_picture[0])
        }
      }
      updateProfileMutation.mutate(formData)

    }
    else{
      mutation.mutate({
        ...data,
        captcha_0: captchaKey,
        captcha_1: data.captcha_value
      });
    }
    
  }

  return (
    <form
      className={`${updateForm && "h-[90%] overflow-auto" }  overflow-auto md:px-16 px-8 py-6 flex flex-col mx-auto my-9 items-center gap-4 w-fit rounded-lg bg-[#FFFFFF] shadow-xl dark:text-white dark:bg-[#141624]`}
      onSubmit={handleSubmit(onSubmitData)}
    >
      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        <h3 className="font-semibold text-2xl">{updateForm ? 'Update Profile' : 'Sign Up'}</h3>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {updateForm ? "You can tell us more" : 
          'Create your account to get started!'}
        </p>
      </div>
      
      
      <div className="flex flex-col gap-2 mb-2">
        <Label htmlFor="username" className="dark:text-[97989F]">Username</Label>
        <Input
          type="text"
          id="username"
          placeholder="Enter username"
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters long"
            }
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.username && <small className='text-red-700'>{errors.username.message}</small>}
      </div>
 
      <div className="flex flex-col gap-2 mb-2">
        <Label htmlFor="first_name">First Name</Label>
        <Input
          type="text"
          id="first_name"
          placeholder="Enter first name"
          {...register('first_name', {
            required: 'First name is required',
            minLength: {
              value: 3,
              message: "First name must be at least 3 characters long"
            }
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.first_name && <small className='text-red-700'>{errors.first_name.message}</small>}
      </div>

      
      <div className="flex flex-col gap-2 mb-2">
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          type="text"
          id="last_name"
          placeholder="Enter last name"
          {...register('last_name', {
            required: 'Last name is required',
            minLength: {
              value: 3,
              message: "Last name must be at least 3 characters long"
            }
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.last_name && <small className='text-red-700'>{errors.last_name.message}</small>}
      </div>

      

      {updateForm && <div className="flex flex-col gap-2 mb-2">
        <Label htmlFor="job_title" className="dark:text-[97989F]">
          Job Title
        </Label>
        <Input
          type="text"
          id="job_title"
          placeholder="Enter Job Title"
          {...register("job_title", {
            required: "Your job title is required",
            minLength: {
              value: 3,
              message: "Your job title must be at least 3 characters",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.job_title?.message && (
          <InputErrors error={errors.job_title.message} />
        )}
      </div>}

      {updateForm && <div className="flex flex-col gap-2 mb-2">
        <Label htmlFor="content">Bio</Label>
        <Textarea
          id="content"
          placeholder="Tell us more about you"
          {...register("bio", {
            required: "Your bio is required",
            minLength: {
              value: 10,
              message: "The content must be at least 10 characters",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[180px]  w-[300px] text-justify"
        />
        {errors?.bio?.message && (
          <InputErrors error={errors.bio.message} />
        )}
      </div>}

      {updateForm && <div className="flex flex-col gap-2 mb-2">
        <Label htmlFor="profile_picture">Profile Picture</Label>
        <Input
          type="file"
          id="picture"
          {...register("profile_picture", {
            required: false,
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-full max-sm:w-[300px] max-sm:text-[14px]"
        />

        
      </div>}

      {updateForm || 
      <div className="flex flex-col gap-2 mb-2">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          placeholder="Enter password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long"
            }
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.password && <small className='text-red-700'>{errors.password.message}</small>}
      </div>}

      {updateForm || 
      <div className="flex flex-col gap-2 mb-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
          id="confirmPassword"
          placeholder="Confirm password"
          {...register('confirmPassword', {
            required: 'Confirm password is required',
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long"
            },
            validate: (value) => value === password || 'Passwords do not match'
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.confirmPassword && <small className='text-red-700'>{errors.confirmPassword.message}</small>}
      </div>}

      {!updateForm && (
        <div className="flex flex-col gap-2 mb-2">
          <Label htmlFor="captcha">Captcha</Label>
          {captchaImage && (
            <img src={captchaImage} alt="captcha" className="border p-2 mb-2" />
          )}
          <Input
            type="text"
            id="captcha"
            placeholder="Enter captcha text"
            {...register('captcha_value', {
              required: 'Captcha is required'
            })}
            className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
          />
          {errors?.captcha_value && <small className='text-red-700'>{errors.captcha_value.message}</small>}
          <button type="button" onClick={loadCaptcha} className="text-blue-600 underline mt-1">
            Reload Captcha
          </button>
        </div>
      )}



      {/* Submit Button */}
      <div className="w-full flex items-center justify-center flex-col my-4">
        {updateForm ? 
        <button
          type="submit"
          className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2"
        >
          {updateProfileMutation.isPending ? (
            <>
              <SmallSpinner />
              <small className='text-[16px]'>Updating profile...</small>
            </>
          ) : (
            <small className='text-[16px]'>Update profile</small>
          )}
        </button> :
        <button
          type="submit"
          className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2"
        >
          {mutation.isPending ? (
            <>
              <SmallSpinner />
              <small className='text-[16px]'>Creating user...</small>
            </>
          ) : (
            <small className='text-[16px]'>Signup</small>
          )}
        </button>
        }
        {updateForm || 
        <p className="text-[14px] mt-2">
          Already have an account? <Link to="/login" className="text-blue-600 underline">Sign In</Link>
        </p>}
      </div>
    </form>
  );
}

export default SignupPage;