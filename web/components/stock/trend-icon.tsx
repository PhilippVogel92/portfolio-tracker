import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiArrowDown,
  FiArrowRight,
  FiArrowUp,
} from "react-icons/fi";

export type TrendIconProps = {
  trend: number;
};

const TrendArrow = ({ trend }: { trend: number }) => {
  const abs = Math.abs(trend);

  if (abs > 2) {
    return trend < 0 ? <FiArrowDown /> : <FiArrowUp />;
  } else if (abs > 0.5) {
    return trend < 0 ? <FiArrowDownRight /> : <FiArrowUpRight />;
  }

  return <FiArrowRight />;
};

export const TrendIcon = ({ trend }: { trend?: number }) => (
  <div className="w-8 h-8 p-2 border border-front text-front rounded-full flex items-center justify-center">
    {trend != undefined && <TrendArrow trend={trend} />}
  </div>
);
