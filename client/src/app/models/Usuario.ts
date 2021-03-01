export class Usuario {

    constructor(
        public dni: string,
        public nombre: string,
        public apellidos: string,
        public email: string,
        public pass: string,
        public rol: string,
        public telefono: string,
        public direccion: string,
        public foto: string
    ) { }

}