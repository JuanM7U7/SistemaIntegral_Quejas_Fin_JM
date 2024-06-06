using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Usuario
{
    public int IdUsuario { get; set; }

    public string Nombre { get; set; }

    public string Ap { get; set; }

    public string Am { get; set; }

    public string Usuario1 { get; set; }

    public string Password { get; set; }

    public bool? Activo { get; set; }

    public int? Ocupado { get; set; }

    public string Rol { get; set; }

    public string Grupo { get; set; }

    public string IdArea { get; set; }

    public int FkIdArea { get; set; }

    public string Correo { get; set; }

    public string Telefono { get; set; }

    public bool? Logueo { get; set; }

    public int? Cargo { get; set; }

    public string GradoAcademico { get; set; }

    public string CargoDocumentos { get; set; }

    public virtual ICollection<Actac> Actacs { get; set; } = new List<Actac>();

    public virtual CatCargoab CargoNavigation { get; set; }

    public virtual ICollection<Expediente> Expedientes { get; set; } = new List<Expediente>();

    public virtual ICollection<Turno> Turnos { get; set; } = new List<Turno>();
}
