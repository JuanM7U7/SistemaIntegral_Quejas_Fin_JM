using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Usuarios
{
    public int IdUsuario { get; set; }

    public string? Nombre { get; set; }

    public string? Ap { get; set; }

    public string? Am { get; set; }

    public string Usuario1 { get; set; }

    public string? Password { get; set; }

    public bool? Activo { get; set; }

    public int? Ocupado { get; set; }

    public string? Rol { get; set; }

    public string? Grupo { get; set; }

    public string? IdArea { get; set; }

    public int FkIdArea { get; set; }

    public string Correo { get; set; }

    public string Telefono { get; set; }

    public bool? Logueo { get; set; }

    public string area { get; set; }

    public string cargo { get; set; }

    public virtual ICollection<Turno> Turnos { get; set; } = new List<Turno>();
}
