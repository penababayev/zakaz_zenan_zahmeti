import React from 'react'
import Container from './Container'
import Footer_top from './Footer_top'
import Logo from './Logo'
import { SubText, SubTitle } from './ui/text'
import { categoriesData, quickLinksData } from '@/constants/data'
import Link from 'next/link'
import { Input } from './ui/input'
import { Button } from './ui/button'

const Footer = () => {
  return (
    <footer className='bg-white border-t'>
      <Container>
        <Footer_top/>
        <div className='py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          <div className='space-y-4'>
            <Logo/>
            <SubText>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis sed eligendi distinctio illum? </SubText>
          </div>
          <div>
            <SubTitle>Peýdaly</SubTitle>
            <ul className='space-y-1 mt-2'>
              {quickLinksData?.map((item)=>(
                <li key={item?.title}>
                  <Link href={item?.href} className='hover:text-shop_dark_green hover:Effect font-medium'>{item?.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubTitle>Kategoriýalar</SubTitle>
            <ul className='space-y-1 mt-2'>
              {categoriesData?.map((item)=>(
                <li key={item?.title}>
                  <Link href={`/category/${item?.href}`} className='hover:text-shop_dark_green hover:Effect font-medium'>{item?.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className='space-y-4'>
            <SubTitle>Mahabat</SubTitle>
            <SubText>
              Mahabat goşmak üçin biz bilen habarlaş
            </SubText>
            <form className='space-y-3'>
              <Input placeholder='Enter your mail' type='email' required/>
              <Button className='w-full'>Habarlaş</Button>
            </form>
          </div>
        </div>
        <div className='py-6 border-t text-center text-sm text-gray-600 flex items-center justify-center gap-1'>
          <span>© {new Date().getFullYear()}</span>
          <Logo className='text-sm' />
          <span>Ähli hukuklar goragly</span>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
