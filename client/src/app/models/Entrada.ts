export class Entrada {

  constructor(
    public id_entrada: number,
    public id_historial: number,
    public fecha_modificacion: Date,
    public modificacionStr: string,
    public fecha_creacion: Date,
    public creacionStr: string,
    public dni_modificacion: string | null,
    public dni_creacion: string | null,
    public descripcion: string
  ) { }

}
