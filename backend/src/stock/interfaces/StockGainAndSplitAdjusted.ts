import { Stock, StockHistory } from '@prisma/client';

export interface StockGainAndSplitAdjusted extends Stock {
  amountAfterSplit: number;
  price: number;
  trend: number;
  moneyInvestedInStock: number;
  gainAbsolute: number;
  gainPercentage: number;
  histories: StockHistory[];
}
