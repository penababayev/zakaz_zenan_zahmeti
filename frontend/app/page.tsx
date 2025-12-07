import { Button } from '@/components/ui/button'
import Container from '@/components/Container'
import React from 'react'
import HomeBanner from '@/components/HomeBanner'
import ProductGrid from '@/components/ProductGrid'

const Home = () => {
  return (
    <Container className='p-4'>
      <HomeBanner/>
      <div className='py-10'>
        <ProductGrid/>
      </div>
    </Container>
  )
}

export default Home
