import { COD2_COLORS, COD2_HEX_COLORS } from "@/data/staticData";

export function getColoredName(name = "Unknown Player") {
  const colorParts = name.split(/\^(?=\d)/);
  const colorNumbers = colorParts.slice(1).map((part) => part.charAt(0));

  return colorParts.map((part, index) => {
    if (index === 0 || !colorNumbers[index - 1]) return part;

    const colorNumber = colorNumbers[index - 1];
    const text = part.slice(1);
    const color = COD2_COLORS[colorNumber];

    return (
      <span className={color} key={index}>
        {text}
      </span>
    );
  });
}

export function getColoredNameForOG(name = "Unknown Player") {
  const colorParts = name.split(/\^(?=\d)/);
  const colorNumbers = colorParts.slice(1).map((part) => part.charAt(0));

  return colorParts.map((part, index) => {
    if (index === 0 || !colorNumbers[index - 1]) return part;

    const colorNumber = colorNumbers[index - 1];
    const text = part.slice(1);
    const colorName = COD2_COLORS[colorNumber];
    const color = COD2_HEX_COLORS[colorName];

    return (
      <span style={{ color }} key={index}>
        {text}
      </span>
    );
  });
}
