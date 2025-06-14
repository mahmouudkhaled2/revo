import { Link } from "react-router-dom";
import CustomersReviewsSection from "../Components/CusromersReviews";
import Hero from "../Components/Hero";
import Posts from "../Components/Posts";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Revo | Home</title>
      </Helmet>

      <Hero />
      <div className="relative">
        <Posts />
        <div className="container mx-auto xl:max-w-[80%] px-5 text-center mt-8 mb-16">
          <Link
            to="/posts"
            className="inline-block bg-[#F27141] text-white px-8 py-3 rounded-full hover:bg-[#e05f35] transition-colors"
          >
            View All Posts
          </Link>
        </div>
      </div>
      <CustomersReviewsSection />
    </>
  );
}
