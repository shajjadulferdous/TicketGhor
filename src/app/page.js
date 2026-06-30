import AdvertisementSection from "@/components/AdvertisementSection";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import LatestTicketsSection from "@/components/LatestTicketsSection";
import Image from "next/image";

export default function Home() {
  return (
     <div>
         <HeroBanner/>
         <AdvertisementSection/>
         <LatestTicketsSection/>
         <Footer/>
     </div>
  );
}
