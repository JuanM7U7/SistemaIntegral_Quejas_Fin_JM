using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Actac
{
    public int Id { get; set; }

    public int? Lugar { get; set; }

    public int? DiaFecha { get; set; }

    public int? Mes { get; set; }

    public int? Anio { get; set; }

    public int? IdAbogado { get; set; }

    public DateTime? HoraInicio { get; set; }

    public string Ubicacion { get; set; }

    public int? IdPet { get; set; }

    public int? Consentimiento { get; set; }

    public string OrigenPet { get; set; }

    public int? IdentificacionPet { get; set; }

    public int? IdEscrito { get; set; }

    public string HoraHechos { get; set; }

    public string Hechos { get; set; }

    public string UbiHechos { get; set; }

    public DateTime? HoraTermino { get; set; }

    public int? OrigenPetExt { get; set; }

    public string OrigenPetExtComp { get; set; }

    public int FkStatus { get; set; }

    public virtual ICollection<EnlaceFormatQueja> EnlaceFormatQuejas { get; set; } = new List<EnlaceFormatQueja>();

    public virtual Usuario IdAbogadoNavigation { get; set; }

    public virtual Escrito IdEscritoNavigation { get; set; }

    public virtual RegRecepcion IdPetNavigation { get; set; }

    public virtual CatIdentificacion IdentificacionPetNavigation { get; set; }

    public virtual Municipio LugarNavigation { get; set; }
}
