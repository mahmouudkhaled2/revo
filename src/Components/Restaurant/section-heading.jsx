/* eslint-disable react/prop-types */
export default function SectionHeading({title, classes}) {
  return (
    <div className={`w-fit mx-auto flex justify-center items-center gap-5 ${classes}`} >
      <span className="relative block w-4 h-4 rounded-full border border-black before:content-[''] before:absolute before:top-1/2 before:translate-y-[-50%] before:end-full before:w-10 before:h-[0.5px] before:bg-black"></span>

      <h2 className="text-2xl text-[#C31C1C] font-Grotesk font-medium">{title}</h2>

      <span className="relative block w-4 h-4 rounded-full border border-black before:content-[''] before:absolute before:top-1/2 before:translate-y-[-50%] before:start-full before:w-10 before:h-[0.5px] before:bg-black"></span>
    </div>
  );
}
