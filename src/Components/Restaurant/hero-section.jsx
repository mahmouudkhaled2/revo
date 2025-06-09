export const HeroSection = () => {

  return (
    <div className="relative h-[400px] md:h-[480px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/assets/hero-bg.jpg"
          alt="Hagogah Restaurant"
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text visibility */}
        <div className="absolute z-10 inset-0 bg-black/50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold font-Inria mb-8">From hagogah</h1>
        
        {/* Slider Dots */}
        <div className="flex items-center gap-7 mb-10">
        <span className={`relative block size-5 rounded-full transition-all border-2 border-white before:content-[''] before:absolute before:h-[2px] before:w-[100px] before:bg-white before:right-full before:top-1/2 before:translate-y-[-50%] before:z-50`}/>

        <span className={`relative block size-5 rounded-full transition-all border-2 border-white before:content-[''] before:absolute before:h-[2px] before:w-[100px] before:bg-white before:left-full before:top-1/2 before:translate-y-[-50%] before:z-50`}/>
        </div>
        
        <div className="max-w-2xl text-center">
          <p className="text-lg md:text-xl font-Inria">
            Enjoy homemade and rural cuisine in the atmosphere of Ramadan.
          </p>
        </div>
      </div>
    </div>
  );
};