using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class Direccion
{
    public int IdDireccion { get; set; }

    public string Calle { get; set; }

    public string NumExterior { get; set; }

    public string NumInterior { get; set; }

    public string Colonia { get; set; }

    public string Municipio { get; set; }

    public string Estado { get; set; }

    public string CodigoPostal { get; set; }

    public string Telefono { get; set; }

    public DateTime FechaNacimiento { get; set; }

    public string Edad { get; set; }

    public string SabeLeer { get; set; }

    public string Nacionalidad { get; set; }

    public string GrupoVulnerable { get; set; }

    public string Discapacidad { get; set; }

    public string Identificacion { get; set; }

    public string Ocupacion { get; set; }

    public string Ciudad { get; set; }

    public int StatusDir { get; set; }

    public int? IdUltimoUserMod { get; set; }

    public int FkSexo { get; set; }

    public int FkEstadoCivil { get; set; }

    public int FkEscolaridad { get; set; }

    public int FkRegRecepcion { get; set; }

    public virtual Escolaridad FkEscolaridadNavigation { get; set; }

    public virtual EstadoCivil FkEstadoCivilNavigation { get; set; }

    public virtual RegRecepcion FkRegRecepcionNavigation { get; set; }

    public virtual Sexo FkSexoNavigation { get; set; }
}
