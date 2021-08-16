export class Cita {

    constructor(
        public id_cita: string,
        public mascota: string,
        public nombreMascota: string,
        public propietario: string,
        public fecha: Date,
        public fechaStr: string | null,
        public servicio: number,
        public veterinario: string,
        public motivo: string,
        public activa: string
    ) {}

}
