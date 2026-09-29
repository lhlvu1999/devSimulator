import type { Company } from "../content/companies";
import { LEVEL_PAY, type Level } from "./ladder";
import { stockForCompany, type StockId } from "./market";

export type PayPackage = {
  cash: number;
  /** Value paid as the company's own shares. */
  stock: number;
  total: number;
  ticker: StockId | null;
};

/** Every payday pays salary in cash plus a share of it in company stock, if the company is listed. */
export function payPackage(company: Company | null, level: Level): PayPackage {
  if (!company) return { cash: 0, stock: 0, total: 0, ticker: null };
  const cash = Math.round(company.salary * LEVEL_PAY[level]);
  const listed = stockForCompany(company.id);
  const stock = listed ? Math.round(cash * company.stockPercent) : 0;
  return { cash, stock, total: cash + stock, ticker: listed?.id ?? null };
}
