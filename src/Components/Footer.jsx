import { Link } from 'react-router-dom'
import Logo from './../assets/images/revo-white-logo.svg'

export default function Footer() {
  return (
    <footer className="bg-black relative z-10">
        <div className='container xl:max-w-[80%] mx-auto'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-10 md:gap-0 py-16 px-6'>
                <img src={Logo} alt="Logo" className='max-w-[160px]' />

                <div className='flex flex-col sm:flex-row items-center gap-16'>
                    <ul className='flex items-center gap-6'>
                        <li>
                            <Link to={'/ '} className="text-white text-sm">Home</Link>
                        </li>

                        <li>
                            <Link to={'/posts'} className="text-white text-sm">Posts</Link>
                        </li>

                        <li>
                            <Link to={'/for-restaurants'} className="text-white text-sm">Restaurants</Link>
                        </li>

                        <li>
                            <Link to={'/contact'} className="text-white text-sm">Contacts</Link>
                        </li>
                    </ul>


                    <ul className='flex items-center gap-4'>
                    
                        <li>
                            <Link to={'/'} className="text-white text-sm"><i className="fa-brands fa-twitter"></i></Link>
                        </li>

                        <li>
                            <Link to={'/'} className="text-white text-sm"><i className="fa-brands fa-facebook-f"></i></Link>
                        </li>

                        <li>
                            <Link to={'/'} className="text-white text-sm"><i className="fa-brands fa-instagram"></i></Link>
                        </li>

                        <li>
                            <Link to={'/'} className="text-white text-sm"><i className="fa-brands fa-github"></i></Link>
                        </li>
                    
                    </ul>
                </div>
            </div>
        </div>

        <div  className='flex justify-around items-center py-8 border-t-[1px] border-white '>
                <p className='text-white text-sm'>© revo 2024, All Rights Reserved</p>
                <ul className='flex items-center gap-4'>

                    <li><Link to={''} className='text-white text-sm'>Privacy Policy</Link></li>
                    <li><Link to={''} className='text-white text-sm'>Terms & Conditions</Link></li>
                </ul>
        </div>
    </footer>
  )
}
