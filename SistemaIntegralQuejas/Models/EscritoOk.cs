using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class EscritoOk
{
    public int Id { get; set; }

    public int? IdPeticionario { get; set; }

    public DateTime? FechaHechos { get; set; }

    public int? IdLugarHechos { get; set; }

    public string CircuntanciasHechos { get; set; }

    public string NombresFinales { get; set; }

    public int? IdQueja { get; set; }

    public int? Version { get; set; }

    public int? IdSecundario { get; set; }

    public int FkStatus { get; set; }

    public int? FkIdComplementoPet { get; set; }

    public string RutaDocumento { get; set; }

    public virtual ICollection<EnlaceFormatQueja> EnlaceFormatQuejas { get; set; } = new List<EnlaceFormatQueja>();
}
