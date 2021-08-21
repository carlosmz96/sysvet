export class Publicacion {

  constructor(
    public id_publicacion: number,
    public fecha_modificacion: Date,
    public modificacionStr: string,
    public fecha_creacion: Date,
    public creacionStr: string,
    public dni_modificacion: string | null,
    public editor: string,
    public dni_creacion: string | null,
    public autor: string,
    public titulo: string,
    public descripcion: string
  ) { }

}
