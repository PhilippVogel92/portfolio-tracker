import React from "react";
import {
  StockHolding,
  stringifyCurrencyValue,
  useStockHoldings,
} from "../../lib/backend";
import { Modal } from "../modal";
import { StockDetails } from "./stock-details";
import Search from "../search/index";
import { FiPlus } from "react-icons/fi";
import { Button } from "../button";
import { DonutChart, DonutChartSegment } from "./donut-chart";
import { useColorDistribution } from "./colors";

const STOCK_COLORS = ["#76FCFF", "#489CE8", "#A410FF", "#11F1A6", "#EA4FFF"];

/** Manages the ID of the currently selected holding. */
function useSelectedId(
  holdings?: StockHolding[]
): [number, (value: number) => void] {
  const [id, setId] = React.useState(0);

  const cappedId = React.useMemo(
    () => (holdings?.length ? Math.min(holdings.length - 1, id) : 0),
    [id, holdings]
  );

  React.useEffect(() => {
    if (id != cappedId) setId(cappedId);
  }, [id, cappedId]);

  return [cappedId, setId];
}

/**
 * Whenever `holdings` changes: Check whether a new holding
 * has been added and if so, select it.
 */
function useHoldingAddedEffect(
  holdings: StockHolding[] | undefined,
  setSelectedId: (id: number) => void
) {
  const prevHoldingsRef = React.useRef(holdings);

  React.useEffect(() => {
    if (!holdings) return;

    const prevHoldings = prevHoldingsRef.current;
    if (prevHoldings) {
      const newHolding = holdings.find(
        (holding) =>
          !prevHoldings.find(
            (prevHolding) => holding.stock.id == prevHolding.stock.id
          )
      );

      if (newHolding) setSelectedId(holdings.indexOf(newHolding));
    }

    prevHoldingsRef.current = holdings;
  }, [holdings, setSelectedId]);
}

const Portfolio = () => {
  const { data: holdings } = useStockHoldings();
  const [selectedId, setSelectedId] = useSelectedId(holdings);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const currentBalance = React.useMemo<number | null>(
    () =>
      holdings
        ?.map((holding) => holding.value)
        .reduce((prev, curr) => prev + curr, 0) ?? null,
    [holdings]
  );

  useHoldingAddedEffect(holdings, setSelectedId);

  const colors = useColorDistribution(holdings?.length || 0, STOCK_COLORS);

  const chartSegments = React.useMemo<DonutChartSegment[]>(
    () =>
      holdings?.length
        ? holdings.map((holding, i) => ({
            value: holding.value,
            label: holdings.length > 1 ? holding.stock.symbol : "",
            color: colors[i],
          }))
        : [{ value: 1, color: "#180A44", label: "" }],
    [holdings, colors]
  );

  if (!holdings) return <span>Loading...</span>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl xs:text-2xl font-light">Your balance</h2>
        <p className="font-semibold text-highlight1 text-3xl sm:text-4xl">
          {currentBalance != null ? (
            stringifyCurrencyValue(currentBalance)
          ) : (
            <>&nbsp;</>
          )}
        </p>
      </div>
      <div className="relative -mx-6 z-0 rounded-t-3xl p-6 bg-falloff-soft">
        <div
          onClick={() => setModalIsOpen(true)}
          className="absolute top-4 right-4 z-10 rounded-full border-2 border-highlight1 text-highlight1 border-solid w-8 h-8 flex justify-center items-center cursor-pointer"
        >
          <FiPlus />
        </div>
        <div className="xs:px-4 sm:px-6">
          <DonutChart
            segments={chartSegments}
            selectedId={selectedId}
            onClick={setSelectedId}
            disabled={!holdings.length}
          />
          <div>
            {holdings.length > 0 ? (
              <StockDetails
                holding={holdings[selectedId]}
                selectionColor={colors[selectedId]}
              />
            ) : (
              <p
                className="text-center text-2xl font-light mx-auto mb-12"
                style={{ maxWidth: "16rem" }}
              >
                Tap the plus button to add a new stock.
              </p>
            )}
            <Button href="/settings" look={1} className="mt-4">
              Personal settings
            </Button>
          </div>
        </div>
      </div>
      <Modal
        title="Add stocks"
        open={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false);
        }}
      >
        <Search />
      </Modal>
    </div>
  );
};

export default Portfolio;
