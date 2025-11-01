export class Coupon {
  constructor(
    public idCupon: number,
    public code: string,
    public percent: number
  ) {}

  static adapt(item: any): Coupon {
    const missing: string[] = [];
    if (!item) missing.push('item');
    if (!item?.idCupon) missing.push('idCupon');
    if (!item?.code) missing.push('code');
    if (item?.percent == null) missing.push('percent');
    if (missing.length) {
      throw new Error(`Invalid coupon: missing ${missing.join(', ')}`);
    }

    const p = Number(item.percent);
    return new Coupon(
      Number(item.idCupon),
      String(item.code).trim(),
      isNaN(p) ? 0 : p
    );
  }
}
