import TravelDate from "@/components/home/search/travel-date";
import TravelPassenger from "@/components/home/search/travel-passenger";
import TravelType from "@/components/home/search/travel-type";

const ReservationModify = () => {
  return (
    <div className="max-w-6xl mx-auto max-md:p-5">
      <span className="font-semibold ml-1">Modify your reservation:</span>
      <div className="grid grid-cols-3 max-md:grid-cols-3 gap-5 mt-2.5 max-md:gap-2">
        <TravelType edit={true} />
        <TravelDate edit={true} />
        <TravelPassenger edit={true} />
      </div>
    </div>
  )
}

export default ReservationModify