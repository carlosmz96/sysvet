export class Usuario {

    private dni: string;
    private nombre: string;
    private apellidos: string;
    private email: string;
    private pass: string;
    private rol: string;
    private telefono: string;
    private direccion: string;
    private foto: string;

    constructor(dni: string, nombre: string, apellidos: string, email: string, pass: string, rol: string, telefono: string, direccion: string, foto: string) {
        this.dni = dni;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.pass = pass;
        this.rol = rol;
        this.telefono = telefono;
        this.direccion = direccion;
        this.foto = foto;
    }

    public getDni(): string {
        return this.dni;
    }

    public setDni(dni: string): void {
        this.dni = dni;
    }

    public getNombre(): string {
        return this.nombre;
    }

    public setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    public getApellidos(): string {
        return this.apellidos;
    }

    public setApellidos(apellidos: string): void {
        this.apellidos = apellidos;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getPass(): string {
        return this.pass;
    }

    public setPass(pass: string): void {
        this.pass = pass;
    }

    public getRol(): string {
        return this.rol;
    }

    public setRol(rol: string): void {
        this.rol = rol;
    }

    public getTelefono(): string {
        return this.telefono;
    }

    public setTelefono(telefono: string): void {
        this.telefono = telefono;
    }

    public getDireccion(): string {
        return this.direccion;
    }

    public setDireccion(direccion: string): void {
        this.direccion = direccion;
    }

    public getFoto(): string {
        return this.foto;
    }

    public setFoto(foto: string): void {
        this.foto = foto;
    }

}