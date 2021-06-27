export class Cita {

    constructor(
        public id_cita: number,
        public microchip: string,
        public propietario: string,
        public fecha: Date,
        public fechaStr: string | null,
        public activa: string
    ) {}

}