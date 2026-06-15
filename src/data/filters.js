export const LEADERBOARDS_FILTERS_DATA = [
  {
    title: "Server Type",
    queryName: "source",
    defaultUrlQuery: "jh",
    filtersData: [
      { text: "Jumpers Heaven", queryValue: "jh", id: 1 },
      { text: "Jump 4 Life", queryValue: "j4l", id: 2 },
    ],
    id: 0,
  },
  {
    title: "Leaderboard Type",
    queryName: "leaderboard",
    defaultUrlQuery: "speedrun",
    filtersData: [
      { text: "Speedrun", id: 1 },
      { text: "Raw Skill", queryValue: "skilled", id: 2 },
      { text: "Defrag", id: 3 },
      { text: "Surf", id: 4 },
      { text: "Route Completion", queryValue: "routescompleted", id: 5 },
    ],
    id: 1,
  },
  {
    title: "FPS Status",
    queryName: "fps",
    defaultUrlQuery: "125",
    filtersData: [
      { text: "43", id: 1 },
      { text: "76", id: 2 },
      { text: "125", id: 3 },
      { text: "250", id: 4 },
      { text: "333", id: 5 },
      { text: "mix", id: 6 },
    ],
    id: 2,
  },
  {
    title: "Players Region",
    queryName: "Region",
    defaultUrlQuery: "global",
    filtersData: [
      { text: "Global", queryValue: "Global", id: 1 },
      {
        text: "NA",
        queryValue: "North America",
        toolTip: "North America",
        id: 2,
      },
      { text: "EU", queryValue: "Europe", toolTip: "Europe", id: 3 },
      { text: "AS", queryValue: "Asia", toolTip: "Asia", id: 4 },
      { text: "OC", queryValue: "Oceania", toolTip: "Oceania", id: 5 },
      {
        text: "SA",
        queryValue: "South America",
        toolTip: "South America",
        id: 6,
      },
      { text: "AF", queryValue: "Africa", toolTip: "Africa", id: 7 },
    ],
    id: 3,
  },
  {
    title: "Last Seen",
    queryName: "last-seen",
    defaultUrlQuery: "All time",
    filtersData: [
      { text: "Today", id: 1 },
      { text: "This Week", id: 2 },
      { text: "This Month", id: 3 },
      { text: "Long Time", id: 4 },
      { text: "All time", id: 5 },
    ],
    id: 4,
  },
];

export const MAPS_FILTERS_DATA = [
  {
    label: "Map Type",
    queryName: "type",
    defaultUrlQuery: "all",
    groupType: "select",
    filtersData: [
      { text: "All", queryValue: "all", id: 1 },
      { text: "Jump", queryValue: "jump", id: 2 },
      { text: "Defrag", queryValue: "defrag", id: 3 },
      { text: "Surf", queryValue: "surf", id: 4 },
    ],
    tooltipText: "Select a map type to narrow down results",
    id: 1,
  },
  {
    label: "Filter Maps By",
    queryName: "filter-by",
    defaultUrlQuery: "all",
    groupType: "select",
    filtersData: [
      { text: "All", queryValue: "all", id: 1 },
      { text: "Has videos", queryValue: "has-videos", id: 2 },
      { text: "No videos", queryValue: "no-videos", id: 3 },
    ],
    tooltipText: "Select a filter to narrow down results",
    id: 2,
  },
  {
    label: "Hide Maps Info",
    queryName: "hide",
    defaultUrlQuery: "",
    groupType: "checkbox",
    filtersData: [
      { text: "Map Image", queryValue: "map-image", id: 1 },
      { text: "Difficulties", queryValue: "difficulties", id: 2 },
      { text: "Completion Rate", queryValue: "completion-rate", id: 3 },
      {
        text: "Author and Release Date",
        queryValue: "author-release-date",
        id: 4,
      },
    ],
    tooltipText: "Enable/Disable maps information",
    id: 2,
  },
];

export const PLAYERS_FILTERS_DATA = [
  {
    label: "Sort By",
    queryName: "sort",
    defaultUrlQuery: "last-seen",
    groupType: "select",
    filtersData: [
      { text: "Last Seen", queryValue: "last-seen", id: 1 },
      { text: "Admin Level", queryValue: "admin", id: 2 },
      { text: "Visit Count", queryValue: "visits", id: 3 },
    ],
    id: 1,
  },
  {
    label: "Player Colors",
    queryName: "colorstatus",
    defaultUrlQuery: "all",
    groupType: "select",
    filtersData: [
      { text: "All", queryValue: "all", id: 1 },
      { text: "Colored", queryValue: "colored", id: 2 },
      { text: "Non-Colored", queryValue: "non-colored", id: 3 },
    ],
    id: 1,
  },
];
