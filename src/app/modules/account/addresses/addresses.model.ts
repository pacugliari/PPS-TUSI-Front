export class Direccion {
  constructor(
    public idDireccion: number,
    public calle: string,
    public numero: string,
    public adicionales: string,
    public codigoPostal: string,
    public ciudad: string,
    public provincia: string,
    public alias: string,
    public principal: boolean
  ) {}

  static adapt(item: any): Direccion {
    if (
      !item ||
      !item.idDireccion ||
      !item.calle ||
      !item.numero ||
      !item.adicionales ||
      !item.codigoPostal ||
      !item.ciudad ||
      !item.provincia ||
      !item.alias ||
      item.principal === undefined ||
      item.principal === null
    ) {
      throw new Error('Invalid address data');
    }

    const trim = (v: any) => (typeof v === 'string' ? v.trim() : v);

    return new Direccion(
      Number(item.idDireccion),
      trim(item.calle),
      trim(item.numero),
      trim(item.adicionales),
      trim(item.codigoPostal),
      trim(item.ciudad),
      trim(item.provincia),
      trim(item.alias),
      Boolean(item.principal)
    );
  }
}

export type DireccionUpsertDto = Omit<Direccion, 'idDireccion' | 'principal'>;
