export interface Profile {
  nroCliente: string;
  nombre: string;
  email: string;
  telefono: string;
  tipoDoc: string;
  dni: string;
}

export interface ProfileUpsertDto {
  nombre: string;
  email: string;
  telefono: string;
  tipoDoc: string;
  dni: string;
}

export class ProfileModel implements Profile {
  constructor(
    public nroCliente: string,
    public nombre: string,
    public email: string,
    public telefono: string,
    public tipoDoc: string,
    public dni: string
  ) {}

  static adapt(item: any): ProfileModel {
    if (!item) throw new Error('Invalid profile data');
    return new ProfileModel(
      item.nroCliente ?? '',
      item.nombre ?? '',
      item.email ?? '',
      item.telefono ?? '',
      item.tipoDoc ?? '',
      item.dni ?? ''
    );
  }
}
