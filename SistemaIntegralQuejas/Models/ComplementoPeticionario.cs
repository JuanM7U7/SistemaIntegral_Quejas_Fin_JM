using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class ComplementoPeticionario
{
    public int IdComplementoPeticionario { get; set; }

    public string TipoUsuario { get; set; }

    public string Calle { get; set; }

    public string NumExterior { get; set; }

    public string NumInterior { get; set; }

    public string Colonia { get; set; }

    public string Ciudad { get; set; }

    public string Municipio { get; set; }

    public string Estado { get; set; }

    public string CodigoPostal { get; set; }

    public string Telefono { get; set; }

    public string Edad { get; set; }

    public string Email { get; set; }

    public int? FkSexo { get; set; }

    public int? FkEscolaridad { get; set; }

    public int? FkEstadoConyugal { get; set; }

    public int? FkOcupacion { get; set; }

    public string OtraOcupacion { get; set; }

    public string Nacionalidad { get; set; }

    public string SabeLeer { get; set; }

    public int? FkDiscapacidad { get; set; }

    public int? FkGrupoSocial { get; set; }

    public string OtroGsocial { get; set; }

    public string HablaLenguai { get; set; }

    public string LenguaIndigena { get; set; }

    public DateTime? FechaNacimiento { get; set; }

    public string OrigenMigrante { get; set; }

    public string DestinoMigrante { get; set; }

    public string PrimeravmexMigrante { get; set; }

    public int? ViolenciaVm { get; set; }

    public string CanalizacionVm { get; set; }

    public string EmbarazadaVm { get; set; }

    public int? FkHijosVivos { get; set; }

    public int? FkModalidadViolencia { get; set; }

    public int? FkTipoViolencia { get; set; }

    public int? FkRelacionAgresor { get; set; }

    public string IngresosMensuales { get; set; }

    public int? StatusComplementoPeticionario { get; set; }

    public int? IdUltimoUserMod { get; set; }

    public int? FkRegRecepcion { get; set; }

    public string Genero { get; set; }

    public string OtroGenero { get; set; }

    public int? IdExpediente { get; set; }

    public int? Status { get; set; }

    public virtual ICollection<EnlaceFormatQueja> EnlaceFormatQuejas { get; set; } = new List<EnlaceFormatQueja>();

    public virtual Discapacidad FkDiscapacidadNavigation { get; set; }

    public virtual Escolaridad FkEscolaridadNavigation { get; set; }

    public virtual EstadoConyugal FkEstadoConyugalNavigation { get; set; }

    public virtual GrupoSocial FkGrupoSocialNavigation { get; set; }

    public virtual HijosVivo FkHijosVivosNavigation { get; set; }

    public virtual ModalidadViolencium FkModalidadViolenciaNavigation { get; set; }

    public virtual Ocupacion FkOcupacionNavigation { get; set; }

    public virtual RegRecepcion FkRegRecepcionNavigation { get; set; }

    public virtual RelacionAgresor FkRelacionAgresorNavigation { get; set; }

    public virtual Sexo FkSexoNavigation { get; set; }

    public virtual TipoViolencium FkTipoViolenciaNavigation { get; set; }
}
