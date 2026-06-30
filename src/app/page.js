import AdvertisementSection from "@/components/AdvertisementSection";
import FeaturesSection from "@/components/FeaturesSection";
import HeroBanner from "@/components/HeroBanner";
import LatestTicketsSection from "@/components/LatestTicketsSection";
import PopularDestinations from "@/components/PopularDestinations";
import Image from "next/image";

export default function Home() {
  return (
     <div>
         <HeroBanner/>
         <AdvertisementSection/>
         <LatestTicketsSection/>
         <PopularDestinations/>
         <FeaturesSection/>
     </div>
  );
}
