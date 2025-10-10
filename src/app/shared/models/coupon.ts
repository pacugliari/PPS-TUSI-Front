export class Coupon {
  constructor(public code: string, public percent: number) {}

  static adapt(item: any): Coupon {
    const missing: string[] = [];
    if (!item) missing.push('item');
    if (!item?.code) missing.push('code');
    if (item?.percent == null) missing.push('percent');
    if (missing.length) {
      throw new Error(`Invalid coupon: missing ${missing.join(', ')}`);
    }

    const p = Number(item.percent);
    return new Coupon(String(item.code).trim(), isNaN(p) ? 0 : p);
  }
}
