import { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import {
  StockHolding,
  usePortfolioData,
  useStockHoldingAmountMut,
} from "../../lib/backend";
import { Button } from "../button";

const CounterButton = ({
  hidden,
  disabled,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { hidden?: boolean }) => (
  <button
    {...props}
    disabled={disabled || hidden}
    className={cn(
      "rounded-md bg-highlight1 text-back font-semibold w-8 select-none transition",
      hidden ? "opacity-0" : disabled ? "opacity-50" : null
    )}
  />
);

function CounterInput({
  value,
  onDecrement,
  onIncrement,
  min,
  disabled,
}: {
  value: number;
  onDecrement?: () => void;
  onIncrement?: () => void;
  min?: number;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center">
      <CounterButton
        onClick={() => onDecrement?.()}
        hidden={min != undefined && min >= value}
        disabled={disabled}
      >
        -
      </CounterButton>
      <div className="w-20 text-center">{value}</div>
      <CounterButton onClick={() => onIncrement?.()} disabled={disabled}>
        +
      </CounterButton>
    </div>
  );
}

export function HoldingAmountCounterMutation({
  holding,
}: {
  holding: StockHolding;
}) {
  const { mutate: mutateHoldingAmount } = useStockHoldingAmountMut();

  const [tempAmount, setTempAmount] = useState(holding.amount);
  useEffect(() => setTempAmount(holding.amount), [holding]);

  const createAmountMutFn = useCallback(
    (amountOffset: number) => () => {
      setTempAmount(tempAmount + amountOffset);
      mutateHoldingAmount({
        stockId: holding.stock.id,
        pricePerShare: holding.stock.price,
        date: new Date(),
        amountOffset,
        stock: holding.stock,
      });
    },
    [tempAmount, holding, mutateHoldingAmount]
  );

  return (
    <CounterInput
      value={tempAmount}
      onIncrement={createAmountMutFn(1)}
      onDecrement={createAmountMutFn(-1)}
      min={1}
    />
  );
}

export function RemoveHoldingButton({ holding }: { holding: StockHolding }) {
  const { mutate: mutateHoldingAmount } = useStockHoldingAmountMut();

  const removeHolding = useCallback(() => {
    // Set the number of shares of the current holding to 0
    mutateHoldingAmount({
      stockId: holding.stock.id,
      pricePerShare: holding.value / holding.amount,
      date: new Date(),
      amountOffset: -holding.amount,
      stock: holding.stock,
    });
  }, [holding, mutateHoldingAmount]);

  return <Button onClick={removeHolding}>Remove stock</Button>;
}
