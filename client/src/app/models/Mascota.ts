export class Mascota {

    constructor(
        public identificador: string,
        public nombre: string,
        public especie: string,
        public raza: string,
        public sexo: string,
        public color: string,
        public edad: string,
        public altura: number,
        public peso: number,
        public esterilizado: string,
        public imagen: string,
        public propietario: string | null,
        public veterinario: string | null,
        public dni_modificacion: string | null,
        public dni_creacion: string | null
    ) {}

}
