import AdvertisementSection from "@/components/AdvertisementSection";
import LatestTicketsSection from "@/components/LatestTicketsSection";
import Image from "next/image";

export default function Home() {
  return (
     <div>
         <AdvertisementSection/>
         <LatestTicketsSection/>
     </div>
  );
}
