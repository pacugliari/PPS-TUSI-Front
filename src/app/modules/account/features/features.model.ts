export class Feature {
  constructor(
    public idCaracteristica: number,
    public descripcion: string,
    public createdAt: string,
    public updatedAt: string
  ) {}

  static adapt(item: any): Feature {
    if (!item || item.idCaracteristica == null || !item.descripcion) {
      throw new Error('Invalid feature data');
    }
    return new Feature(
      Number(item.idCaracteristica),
      String(item.descripcion ?? '').trim(),
      new Date(item.createdAt ?? Date.now()).toISOString(),
      new Date(item.updatedAt ?? Date.now()).toISOString()
    );
  }

  static adaptList(list?: any[]): Feature[] {
    return Array.isArray(list) ? list.map(Feature.adapt) : [];
  }
}

export interface FeatureUpsertDto {
  descripcion: string;
}
