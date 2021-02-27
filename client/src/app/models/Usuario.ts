export class Usuario {
    constructor(
        private dni: string,
        private nombre: string,
        private apellidos: string,
        private email: string,
        private pass: string,
        private rol: string,
        private telefono: string,
        private direccion: string,
        private foto: string
    ) {}
}