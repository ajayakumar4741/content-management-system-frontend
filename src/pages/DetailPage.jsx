import React, { useState } from 'react'
import Badge from "@/ui_components/Badge";
import BlogWriter from "@/ui_components/BlogWriter";

import { HiPencilAlt } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '@/ui_components/Spinner';
import { deleteBlog, getBlog } from '@/services/apiBlog';
import { BASE_URL } from '@/api';
import Modal from '@/ui_components/Modal';
import CreatePostPage from './CreatePostPage';
import { toast } from 'react-toastify';



function DetailPage({username,isAuthenticated}) {
  const [showModal,setShowModal] = useState(false)
  const navigate = useNavigate()
  function toggleModal(){
    setShowModal(curr => !curr)
  }
  const {slug} = useParams()
  const {isPending,isError,error,data:blog} = useQuery({
    queryKey: ['blogs',slug],
    queryFn:() => getBlog(slug), 
  })
  console.log(blog)

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBlog(id),
    onSuccess: () => {
      toast.success("Your blog has been deleted successfully !!!")
      navigate("/")
    },
    onError: (err) => {
      console.log(err)
      toast.error(err.message)
    }
  })
  const blogID = blog?.id
  function handleDeleteBlog(){
    const popUp = window.confirm("Are you sure you want to delete this post?")
    if(!popUp){
      return
    }else{
      deleteMutation.mutate(blogID)
    }
  }
  if(isPending){
    return <Spinner/>
  }
  return (
    <>
      <div className="padding-dx max-container py-9">
        <Badge blog={blog} />

        <div className="flex justify-between items-center gap-4">
          <h2 className="py-6 leading-normal text-2xl md:text-3xl text-[#181A2A] tracking-wide font-semibold dark:text-[#FFFFFF]">
            {blog.title}
          </h2>

            {isAuthenticated && username === blog.author.username && <span className="flex justify-between items-center gap-2">
              <HiPencilAlt onClick={toggleModal}  className="dark:text-white text-3xl cursor-pointer" />

              <MdDelete onClick={handleDeleteBlog} className="dark:text-white text-3xl cursor-pointer" />
            </span>}
          
        </div>

        <BlogWriter blog={blog} />
              <br />
        <div className="w-full aspect-video">
  <img
    className="w-full h-full object-fill rounded-sm"
    src={`${BASE_URL}${blog.featured_image}`}
  />
</div>
<br />
        <p className="text-[16px] leading-[2rem] text-justify text-[#3B3C4A] dark:text-[#BABABF]">
          {blog.content}
        </p>
      </div>

     {showModal && <Modal>
      <CreatePostPage blog={blog} />
     </Modal>}
    </>
  )
}

export default DetailPage
