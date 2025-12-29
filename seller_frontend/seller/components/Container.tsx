import { cn } from '@/lib/utils';
import React from 'react'
import HomeBanner from './HomeBanner';
import SellerLoginPanel from './LoginPanel';
import StartSellingSteps from './StartSellingSteps';

const Container = ({
    children, 
    className,
}: {
    children: React.ReactNode; 
    className?:string;
}) => {
  return (
    <div className={cn('max-w-screen-xl mx-auto px-4', className)}>
      <HomeBanner/>
      <StartSellingSteps/>
    </div>
  )
}

export default Container
