

export default function StickerText() {
  return (
              <div className="flex flex-col gap-16 lg:flex-row container xl:max-w-[80%] mx-auto my-20">
                <div className="black-box relative w-full lg:w-1/2 flex justify-center items-center bg-black text-white py-14 px-5 font-Grotesk text-2xl md:text-3xl text-center">
                  <h2>{"Hungry? Rate favorites and find what’s trending."}</h2>
                </div>
                <div className="w-full lg:w-1/2 font-Grotesk text-xl md:text-2xl underline py-14 px-5 text-center lg:text-start">
                  <h2>{"Hungry for great food? Find and rate your favorite restaurants, and see what’s trending in the culinary world."}</h2>
                </div>
              </div>
  )
}
