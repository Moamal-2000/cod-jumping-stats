import MapCard from "@/components/Pages/Maps/MapCard/MapCard";
import SpinnerLoader from "@/components/Shared/Loaders/SpinnerLoader/SpinnerLoader";
import EmptyState from "../../EmptyState/EmptyState";
import s from "./FavMaps.module.scss";

const FavMaps = ({ favMaps, allMaps, mapsLoading }) => {
  if (mapsLoading && favMaps.length === 0)
    {return (
      <SpinnerLoader
        title="Loading Maps"
        description="Fetching your favorite maps..."
      />
    );}

  if (!mapsLoading && favMaps.length === 0) {return <EmptyState type="maps" />;}

  return (
    <div className={s.maps}>
      {favMaps.map((map, index) => (
        <MapCard key={map.CpID} mapData={map} allMaps={allMaps} index={index} />
      ))}
    </div>
  );
};

export default FavMaps;
