import PlayerRouteCompletion from "@/Components/Pages/PlayerProfile/PlayerRouteCompletion/PlayerRouteCompletion";
import s from "@/Components/Pages/PlayerProfile/RoutesTab.module.scss";

const RoutesTab = () => {
  return (
    <div className={s.routeCompletionTab}>
      <PlayerRouteCompletion />
    </div>
  );
};

export default RoutesTab;
