

/** ---- API DTOs ---- */
export interface ApiProductoDto {
  idProducto: number;
  idCategoria: number;
  idSubCategoria: number;
  idMarca: number;
  nombre: string;
  precio: string | number;
  precioAnterior: string | number | null;
  descripcion: string;
  stock: number;
  fotos: string[];
  createdAt: string;
  updatedAt: string;
  categoria: { idCategoria: number; nombre: string };
  subcategoria: { idSubCategoria: number; nombre: string };
  marca: { idMarca: number; nombre: string };
  stockDetallado: { stockActual: number; estado: string };
  propiedades: ApiPropiedadDto[];
  comentarios: ApiComentarioDto[];
}

export interface ApiPropiedadDto {
  idPropiedad: number;
  idCaracteristica: number;
  valor: string;
  caracteristica: { idCaracteristica: number; descripcion: string };
}

export interface ApiComentarioDto {
  idComentario: number;
  puntuacion: number; // 1..5
  comentario: string;
  createdAt: string;
  usuario: { idUsuario: number; email: string };
}

export interface ApiProductoLiteDto {
  idProducto: number;
  fotos: string[];
  nombre: string;
  categoria: { idCategoria: number; nombre: string };
  precio: string | number;
  precioAnterior: string | number | null;
}

/** ---- App Models ---- */
export interface Product {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precioAnterior: number | null;
  fotos: string[];
  stock: number;
  stockEstado: string;
  categoria: { id: number; nombre: string };
  subcategoria: { id: number; nombre: string };
  marca: { id: number; nombre: string };
  propiedades: { id: number; label: string; value: string }[];
  comentarios: {
    id: number;
    rating: number;
    texto: string;
    fecha: string;
    usuarioEmail: string;
  }[];
  ratingPromedio: number;
  ratingCount: number;
}

export interface ProductCard {
  idProducto: number;
  nombre: string;
  categoria: string;
  foto: string | null;
  precio: number;
  precioAnterior: number | null;
}

/** ---- Adapters ---- */
export const ProductAdapter = {
  fromApi(p: ApiProductoDto): Product {
    const comentarios = (p.comentarios ?? []).map((c) => ({
      id: c.idComentario,
      rating: Number(c.puntuacion ?? 0),
      texto: c.comentario ?? '',
      fecha: c.createdAt,
      usuarioEmail: c.usuario?.email ?? '',
    }));
    const ratingCount = comentarios.length;
    const ratingPromedio =
      ratingCount > 0
        ? comentarios.reduce((a, b) => a + (b.rating || 0), 0) / ratingCount
        : 0;

    return {
      idProducto: p.idProducto,
      nombre: p.nombre ?? '',
      descripcion: p.descripcion ?? '',
      precio: Number(p.precio ?? 0),
      precioAnterior: p.precioAnterior != null ? Number(p.precioAnterior) : null,
      fotos: Array.isArray(p.fotos) ? p.fotos : [],
      stock: Number(p.stock ?? p.stockDetallado?.stockActual ?? 0),
      stockEstado: p.stockDetallado?.estado ?? '',
      categoria: { id: p.categoria?.idCategoria ?? p.idCategoria, nombre: p.categoria?.nombre ?? '' },
      subcategoria: { id: p.subcategoria?.idSubCategoria ?? p.idSubCategoria, nombre: p.subcategoria?.nombre ?? '' },
      marca: { id: p.marca?.idMarca ?? p.idMarca, nombre: p.marca?.nombre ?? '' },
      propiedades: (p.propiedades ?? []).map((pr) => ({
        id: pr.idPropiedad,
        label: pr.caracteristica?.descripcion ?? '',
        value: pr.valor ?? '',
      })),
      comentarios,
      ratingPromedio,
      ratingCount,
    };
  },

  liteFromApi(p: ApiProductoLiteDto): ProductCard {
    return {
      idProducto: p.idProducto,
      nombre: p.nombre ?? '',
      categoria: p.categoria?.nombre ?? '',
      foto: p.fotos?.[0] ?? null,
      precio: Number(p.precio ?? 0),
      precioAnterior: p.precioAnterior != null ? Number(p.precioAnterior) : null,
    };
  },
};
