export class Cita {

    constructor(
        public id_cita: string,
        public mascota: string,
        public propietario: string,
        public fecha: Date,
        public fechaStr: string | null,
        public motivo: string,
        public activa: string
    ) {}

}
