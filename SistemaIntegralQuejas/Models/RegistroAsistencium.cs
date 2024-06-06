using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class RegistroAsistencium
{
    public int IdRegistroAsistencia { get; set; }

    public int FkIdDepartamento { get; set; }

    public int FkIdAsunto { get; set; }

    public DateTime? FechaVisita { get; set; }

    public int FkIdVisitante { get; set; }

    public DateTime? FechaHoraSalida { get; set; }

    public virtual CatAsuntovisitum FkIdAsuntoNavigation { get; set; }

    public virtual Area FkIdDepartamentoNavigation { get; set; }

    public virtual RegRecepcion FkIdVisitanteNavigation { get; set; }
}
