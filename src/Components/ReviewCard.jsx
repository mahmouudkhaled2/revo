/* eslint-disable react/no-unescaped-entities */
import CustomerAvatar from './../assets/images/customer-avatar.png'


export default function ReviewCard() {
  return (
    <>
        <div className="border-2 border-[#111111] p-4 shadow-md bg-white">
            <div className="flex items-center mb-5">
                <ul className='flex items-center gap-1'>
                    <li> <i className="fa-solid fa-star  text-[#EE9F00]"></i></li>
                    <li> <i className="fa-solid fa-star  text-[#EE9F00]"></i></li>
                    <li> <i className="fa-solid fa-star  text-[#EE9F00]"></i></li>
                    <li> <i className="fa-solid fa-star  text-[#EE9F00]"></i></li>
                    <li> <i className="fa-solid fa-star  text-[#EE9F00]"></i></li>
                </ul>
            </div>

            <p className="text-[#111111CC] font-normal mb-14 font-DM">
                "The food was absolutely delicious, and the service was top-notch!
                I'll definitely come back."
            </p>

            <div className="flex items-center gap-3">
                <img
                src={CustomerAvatar}
                alt="Avatar"
                className="w-11 h-11 rounded-full"
                />

                <div>

                <h4 className="text-[#111111] font-semibold font-Grotesk">Leslie Alexander</h4>
                <p className="text-gray-400 text-sm font-Inter">customer</p>
                </div>

            </div>
        </div>
    </>
  )
}
