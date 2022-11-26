import React from "react";
import {
  PieChart as PieChartBase,
  pieChartDefaultProps,
} from "react-minimal-pie-chart";
import { StockHolding } from "../../lib/backend";

export type PieChartProps = {
  items: StockHolding[];
  selected?: number;
  onClick?: (id: number) => void;
};

type PieChartItem = {
  value: number;
  color: string;
};

const colors = ["#4666A2", "#547ECD", "#90AFE5", "#ACBEDE", "#C5D5EE"];
const selectedSegmentOffset = 5;

export const PieChart = ({ items, selected, onClick }: PieChartProps) => {
  const pieChartItems = React.useMemo<PieChartItem[]>(
    () =>
      items.map((item, i) => ({
        value: item.amount,
        color: colors[i % colors.length],
      })),
    [items]
  );

  return (
    <div className="relative pt-full text-base">
      <div className="absolute inset-0">
        <PieChartBase
          startAngle={-90}
          animate
          lineWidth={35}
          radius={pieChartDefaultProps.radius - selectedSegmentOffset}
          data={pieChartItems}
          segmentsShift={(i) => (i === selected ? selectedSegmentOffset : 0)}
          segmentsStyle={{
            cursor: "pointer",
          }}
          onClick={onClick && ((_, i) => onClick(i))}
        />
      </div>
    </div>
  );
};
