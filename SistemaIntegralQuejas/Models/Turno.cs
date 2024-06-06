using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Turno
{
    public int IdTurno { get; set; }

    public int? NumTurno { get; set; }

    public int? IdAbogadoAtendio { get; set; }

    public DateTime? FechaHoraAtención { get; set; }

    public DateTime? FechaHoraTerminaAtencion { get; set; }

    public int? Estado { get; set; }

    public int? IdRegistro { get; set; }

    public int? FkIdModulo { get; set; }

    public DateTime? FechaHoraTomaAtn { get; set; }

    public string Username { get; set; }

    public string Typemsg { get; set; }

    public string Grupo { get; set; }

    public int? IdAsistencia { get; set; }

    public virtual CatEstadoturno EstadoNavigation { get; set; }

    public virtual Moduloatenciondqot FkIdModuloNavigation { get; set; }

    public virtual Usuario IdAbogadoAtendioNavigation { get; set; }

    public virtual RegRecepcion IdRegistroNavigation { get; set; }
}
