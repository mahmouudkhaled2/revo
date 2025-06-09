import ReviewCard from "./ReviewCard";

export default function CustomersReviewsSection () {
  return (
    <section className="bg-[#FFF1E8] py-14 px-4">

        <div className="container mx-auto xl:max-w-[80%]">
            <div className="flex flex-col lg:flex-row justify-between items-center text-center mb-14">
                <h2 className="text-[38px] font-bold underline font-Grotesk">
                ”Honest Reviews from Our Customers”
                </h2>
                <button className="mt-4 px-5 py-2 bg-lime-300 text-[15px] border-2 border-[#111111] text-black font-medium hover:bg-lime-400 font-Grotesk">
                Join For Free
                </button>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <ReviewCard/>
                <ReviewCard/>
                <ReviewCard/>
                <ReviewCard/>
                <ReviewCard/>
                <ReviewCard/>
            </div>
        </div>
      
    </section>
  );
};

