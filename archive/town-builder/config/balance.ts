import { Resource } from "../economy/economy";
import { ConstructionType } from "../construction/construction";

export type PurchaseOrder = { type: Resource; amount: number }[];

const PURCHASE_ORDERS: Map<ConstructionType, PurchaseOrder> = new Map([
  [ConstructionType.Farm, [{ type: Resource.Gold, amount: 5 }]],
  [ConstructionType.House, [{ type: Resource.Food, amount: 5 }]],
  [ConstructionType.Sawmill, [{ type: Resource.Gold, amount: 5 }]],
  [ConstructionType.Path, [{ type: Resource.Gold, amount: 1 }]],
]);

export function getPurchaseOrder(type: ConstructionType): PurchaseOrder {
  if (!PURCHASE_ORDERS.has(type)) {
    throw new Error(`No purchase order defined for type ${type}`);
  }

  return PURCHASE_ORDERS.get(type)!;
}
