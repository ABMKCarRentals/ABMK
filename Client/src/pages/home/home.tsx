import BrandSection from "@/components/home/brands";
import FeaturedVehicles from "@/components/home/featuredcars";
import FindUs from "@/components/home/findus";
import Footer from "@/components/home/footer";
import Hero from "@/components/home/hero";
import Navbar from "@/components/home/navbar";
import Testimonials from "@/components/home/reviews";
import ListYourCar from "@/components/home/service";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <BrandSection />
      <FeaturedVehicles />
      <ListYourCar />
      <Testimonials />
      <FindUs />
      <Footer />
    </>
  );
}

export default Home;
