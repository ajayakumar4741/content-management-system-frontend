import React from 'react'

function Modal({children,toggleModal}) {
  function handleToggleModal(e){
    if(e.target.id === 'modal'){
      toggleModal()
    }
  }
  return (
    <div id='modal' onClick={handleToggleModal} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50">
      {children}
    </div>
  )
}

export default Modal
