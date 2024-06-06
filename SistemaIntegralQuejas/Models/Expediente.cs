using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Expediente
{
    public int IdExpediente { get; set; }

    public string Expediente1 { get; set; }

    public string Folio { get; set; }

    public DateTime? FechaRegistrro { get; set; }

    public int? IdViaInterposicion { get; set; }

    public int? IdPrograma { get; set; }

    public int? IdTema { get; set; }

    public int? IdAbogadoRecibe { get; set; }

    public string LugarHechos { get; set; }

    public int? IdMateria { get; set; }

    public string Hechos { get; set; }

    public DateTime? FechaCalificacion { get; set; }

    public int? IdTipoQueja { get; set; }

    public int? IdEspecializado { get; set; }

    public int? IdTrasOpPub { get; set; }

    public int? IdNivRiesgo { get; set; }

    public DateTime? Fechatev { get; set; }

    public DateTime? Fecharfv { get; set; }

    public DateTime? Fechata { get; set; }

    public int? IdAbogadoTurna { get; set; }

    public string Observaciones { get; set; }

    public int? FkStatus { get; set; }

    public string MotivoEliminado { get; set; }

    public int? IdSede { get; set; }

    public virtual ICollection<EnlaceFormatQueja> EnlaceFormatQuejas { get; set; } = new List<EnlaceFormatQueja>();

    public virtual StatusExpediente FkStatusNavigation { get; set; }

    public virtual Usuario IdAbogadoRecibeNavigation { get; set; }

    public virtual CatNivRiesgo IdNivRiesgoNavigation { get; set; }

    public virtual CatPrograma IdProgramaNavigation { get; set; }

    public virtual CatTema IdTemaNavigation { get; set; }

    public virtual CatTipoqueja IdTipoQuejaNavigation { get; set; }

    public virtual CatInterpo IdViaInterposicionNavigation { get; set; }
}
