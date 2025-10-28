import { toNumber } from './products.util';

export type SimpleIdName = { id: number; nombre: string };
export type Categoria = { idCategoria: number; nombre: string };
export type Subcategoria = {
  idSubCategoria: number;
  idCategoria: number;
  nombre: string;
};
export type Marca = { idMarca: number; nombre: string };
export type Caracteristica = { idCaracteristica: number; descripcion: string };

export interface ProductProp {
  idCaracteristica: number;
  valor: string;
}

export class Product {
  constructor(
    public idProducto: number,
    public idCategoria: number,
    public idSubCategoria: number,
    public idMarca: number,
    public nombre: string,
    public precio: number,
    public precioAnterior: number | null,
    public descripcion: string | null,
    public fotos: string[], // máx. 3
    public iva: number, // %
    public stockMinimo: number,
    public stockMaximo: number,
    public stockActual: number,
    public reservado: number,
    public comprometido: number,
    public disponibilidad: number,
    public estado: 'disponible' | 'agotado',
    public propiedades: ProductProp[],
    public categoriaNombre?: string,
    public subcategoriaNombre?: string,
    public marcaNombre?: string
  ) {}

  static adapt(i: any): Product {
    return new Product(
      toNumber(i.idProducto),
      toNumber(i.idCategoria),
      toNumber(i.idSubCategoria),
      toNumber(i.idMarca),
      String(i.nombre ?? '').trim(),
      toNumber(i.precio),
      i.precioAnterior != null ? toNumber(i.precioAnterior) : null,
      i.descripcion != null ? String(i.descripcion) : null,
      Array.isArray(i.fotos) ? i.fotos.map(String).slice(0, 3) : [],
      toNumber(i.iva, 21),
      toNumber(i.stockMinimo),
      toNumber(i.stockMaximo),
      toNumber(i.stockActual),
      toNumber(i.reservado),
      toNumber(i.comprometido),
      toNumber(i.disponibilidad),
      (i.estado as any) === 'agotado' ? 'agotado' : 'disponible',
      Array.isArray(i.propiedades)
        ? i.propiedades
            .map((p: any) => ({
              idCaracteristica: toNumber(p.idCaracteristica),
              valor: String(p.valor ?? '').trim(),
            }))
            .slice(0, 5)
        : [],
      i.categoriaNombre ?? undefined,
      i.subcategoriaNombre ?? undefined,
      i.marcaNombre ?? undefined
    );
  }

  static adaptList(list?: any[]): Product[] {
    return Array.isArray(list) ? list.map(Product.adapt) : [];
  }
}

export interface ProductUpsertDto {
  idCategoria: number;
  idSubCategoria: number;
  idMarca: number;
  nombre: string;
  precio: number;
  descripcion?: string | null;
  fotos: string[]; // máx 3
  iva: number; // %
  stockMinimo: number;
  stockMaximo: number;
  stockActual: number;
  propiedades: ProductProp[];
}

export class ProductOptions {
  constructor(
    public categorias: Categoria[],
    public subcategorias: Subcategoria[],
    public marcas: Marca[],
    public caracteristicas: Caracteristica[]
  ) {}

  static adapt(p: any): ProductOptions {
    const cat = Array.isArray(p?.categorias)
      ? p.categorias.map((c: any) => ({
          idCategoria: toNumber(c.idCategoria),
          nombre: String(c.nombre),
        }))
      : [];
    const sub = Array.isArray(p?.subcategorias)
      ? p.subcategorias.map((s: any) => ({
          idSubCategoria: toNumber(s.idSubCategoria),
          idCategoria: toNumber(s.idCategoria),
          nombre: String(s.nombre),
        }))
      : [];
    const mar = Array.isArray(p?.marcas)
      ? p.marcas.map((m: any) => ({
          idMarca: toNumber(m.idMarca),
          nombre: String(m.nombre),
        }))
      : [];
    const car = Array.isArray(p?.caracteristicas)
      ? p.caracteristicas.map((c: any) => ({
          idCaracteristica: toNumber(c.idCaracteristica),
          descripcion: String(c.descripcion),
        }))
      : [];
    return new ProductOptions(cat, sub, mar, car);
  }
}
