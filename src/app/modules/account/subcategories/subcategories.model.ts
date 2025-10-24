export type SimpleCategory = { idCategoria: number; nombre: string };

export class SubCategory {
  constructor(
    public idSubCategoria: number,
    public idCategoria: number,
    public nombre: string,
    public descripcion: string,
    public createdAt: string,
    public updatedAt: string,
    public categoriaNombre?: string
  ) {}

  static adapt(item: any): SubCategory {
    if (
      !item ||
      item.idSubCategoria == null ||
      item.idCategoria == null ||
      !item.nombre
    ) {
      throw new Error('Invalid subcategory data');
    }
    return new SubCategory(
      Number(item.idSubCategoria),
      Number(item.idCategoria),
      String(item.nombre ?? '').trim(),
      String(item.descripcion ?? '').trim(),
      new Date(item.createdAt ?? Date.now()).toISOString(),
      new Date(item.updatedAt ?? Date.now()).toISOString(),
      item.categoria?.nombre
        ? String(item.categoria.nombre)
        : item.categoriaNombre
        ? String(item.categoriaNombre)
        : undefined
    );
  }

  static adaptList(list?: any[]): SubCategory[] {
    return Array.isArray(list) ? list.map(SubCategory.adapt) : [];
  }
}

export interface SubCategoryUpsertDto {
  idCategoria: number;
  nombre: string;
  descripcion: string;
}

export class SubCategoryOptions {
  constructor(public categorias: SimpleCategory[]) {}
  static adapt(payload: any): SubCategoryOptions {
    const categorias = Array.isArray(payload?.categorias)
      ? payload.categorias.map((c: any) => ({
          idCategoria: Number(c.idCategoria),
          nombre: String(c.nombre),
        }))
      : [];
    return new SubCategoryOptions(categorias);
  }
}
