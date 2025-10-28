import { ProductUpsertDto } from './products.model';

export function dtoToFormData(dto: ProductUpsertDto, files: File[]): FormData {
  const fd = new FormData();

  fd.append('idCategoria', String(dto.idCategoria));
  fd.append('idSubCategoria', String(dto.idSubCategoria));
  fd.append('idMarca', String(dto.idMarca));
  fd.append('nombre', String(dto.nombre));
  fd.append('precio', String(dto.precio));
  if (dto.descripcion != null)
    fd.append('descripcion', String(dto.descripcion));
  fd.append('iva', String(dto.iva));
  fd.append('stockMinimo', String(dto.stockMinimo));
  fd.append('stockMaximo', String(dto.stockMaximo));
  fd.append('stockActual', String(dto.stockActual));

  fd.append('propiedades', JSON.stringify(dto.propiedades ?? []));

  // Importante: si hay archivos, **no** mandamos fotos URL (el backend prioriza archivos)
  // Archivos (máx 3)
  (files || []).slice(0, 3).forEach((f) => fd.append('fotos', f, f.name));

  return fd;
}

export const toNumber = (v: any, def = 0) =>
  v == null || v === '' || Number.isNaN(Number(v)) ? def : Number(v);
