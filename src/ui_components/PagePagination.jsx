import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

function PagePagination({numOfBlog,handleSetPage,page,increasePage,decreasePage}) {
    const numbers = Array.from({length:numOfBlog}, (_, i) => i+1 )
    const firstNumber = numbers[0]
    const lastNumber = numbers[numbers.length -1]

  return (
    <div>
      <Pagination className='my-6 dark:text-white'>
      <PaginationContent>

        { page === firstNumber || (<PaginationItem onClick={increasePage}>
          <PaginationPrevious href="#" />
        </PaginationItem>)}

          {numbers.map((num) => (<PaginationItem key={num} onClick={() => handleSetPage(num)}>
            {num === page ? (<PaginationLink href="#" isActive>{num}</PaginationLink>) : (<PaginationLink href="#">{num}</PaginationLink>)}
          
        </PaginationItem>))}
        

        
        

        
     {page === lastNumber || (<PaginationItem onClick={decreasePage}>
          <PaginationNext href="#" />
        </PaginationItem>)}
       

      </PaginationContent>
    </Pagination>
    </div>
  )
}

export default PagePagination
