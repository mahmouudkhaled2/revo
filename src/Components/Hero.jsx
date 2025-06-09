/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

import HeroImage1 from './../assets/images/african-american-man-with-round-eyeglasses-denim-shirt-removebg-preview 1.png'
import HeroImage2 from './../assets/images/hero-man-with-colorful-bg.png'
import LeftLights from'./../assets/images/left-lights.png'

export default function Hero() {
  return (
    <>
        <header className=" bg-[#FFF1E8] relative">
            <img src={LeftLights} className='absolute z-[-1]' alt="Left background" />
            <div className=" mx-auto">
                <div className="flex justify-between">
                    <div className="hero-txt w-full md:w-1/2 lg:w-2/5 py-32 px-10 md:px-0 text-center md:text-start md:py-16">
                        <h1 className=" relative md:max-w-[80%] ms-auto text-[40px] xl:text-[52px] font-Grotesk font-bold">"Share your experience and explore top restaurants."</h1>
                    </div>
                    <div className="hero-img-box md:w-1/2 lg:w-2/5">
                        <img src={HeroImage2} className='hidden md:block ' alt="Hero Image For Header" />
                    </div>
                </div>
            </div>
        </header>
    </>
  )
}
