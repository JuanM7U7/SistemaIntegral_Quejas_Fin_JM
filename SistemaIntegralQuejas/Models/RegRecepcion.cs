using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class RegRecepcion
{
    public int IdRegistro { get; set; }

    public string Nombre { get; set; }

    public string ApellidoPat { get; set; }

    public string ApellidoMat { get; set; }

    public string DocIdentificatorio { get; set; }

    public string Procedencia { get; set; }

    public byte[] FinguerPrint { get; set; }

    public byte[] FotoIdentificacion { get; set; }

    public virtual ICollection<Actac> Actacs { get; set; } = new List<Actac>();

    public virtual ICollection<ComplementoPeticionario> ComplementoPeticionarios { get; set; } = new List<ComplementoPeticionario>();

    public virtual ICollection<EnlaceFormatQueja> EnlaceFormatQuejas { get; set; } = new List<EnlaceFormatQueja>();

    public virtual ICollection<RecepcionIdentificacion> RecepcionIdentificacions { get; set; } = new List<RecepcionIdentificacion>();

    public virtual ICollection<RegistroAsistencium> RegistroAsistencia { get; set; } = new List<RegistroAsistencium>();

    public virtual ICollection<Turno> Turnos { get; set; } = new List<Turno>();
}
