import CustomLabeledCheckbox from "@/components/Shared/Checkboxes/CustomLabeledCheckbox/CustomLabeledCheckbox";
import s from "./PlayerStatusFilters.module.scss";

const PlayerStatusFilters = () => {
  return (
    <div className={s.filters}>
      {PLAYERS_STATUS_FILTERS_DATA.map(({ name, labelText, queryName, id }) => (
        <CustomLabeledCheckbox
          key={id}
          name={name}
          labelText={labelText}
          queryName={queryName}
        />
      ))}
    </div>
  );
};

export default PlayerStatusFilters;

const PLAYERS_STATUS_FILTERS_DATA = [
  {
    name: "detailed-stats-checkbox",
    labelText: "Show Detailed Stats",
    queryName: "detailed-stats",
    id: 1,
  },
];
