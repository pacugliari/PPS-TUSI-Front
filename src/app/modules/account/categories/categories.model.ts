export class Category {
  constructor(
    public idCategoria: number,
    public nombre: string,
    public descripcion: string,
    public createdAt: string,
    public updatedAt: string
  ) {}

  static adapt(item: any): Category {
    if (!item || item.idCategoria == null || !item.nombre) {
      throw new Error('Invalid category data');
    }
    return new Category(
      Number(item.idCategoria),
      String(item.nombre ?? '').trim(),
      String(item.descripcion ?? '').trim(),
      new Date(item.createdAt ?? Date.now()).toISOString(),
      new Date(item.updatedAt ?? Date.now()).toISOString()
    );
  }

  static adaptList(list?: any[]): Category[] {
    return Array.isArray(list) ? list.map(Category.adapt) : [];
  }
}

export interface CategoryUpsertDto {
  nombre: string;
  descripcion: string;
}
