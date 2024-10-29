using SistemaIntegralQuejas.Controllers;
using System;

namespace SistemaIntegralQuejas.Models
{
    public class TablaBusquedaFormatos : EnlaceFormatQueja
    {
        public string Nombre_agraviado { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public string Status_Expediente { get; set; }
        public string VIA_INTERPOSICION { get; set; }
        public List<DatosEditPeticionario> AgravQuej { get; set; }
        public List<DatosEditPeticionario> AgravQuejactac { get; set; }
        public List<TblActac> ActaCa { get; set; }
        public List<TblEscritoi> Escritoia { get; set; }
        public List<ExpedienteTurnoModificado> ExpedienteTurno { get;set; }
 		public informacioncomplementaria informacioncomplementaria { get; set; }

    }

    public class DatosEditPeticionario
    {
        public int IdComplementoPeticionario { get; set; }
        public int FkRegRecepcion { get; set; }
        public string Nombre { get; set; }
        public string ApellidoPat { get; set; }
        public string ApellidoMat { get; set; }
        public string TipoUsuario { get; set; }

        public List<PdfDatosPeticionario> lPeticionario { get; set; }
    }
    public class TblActac
    {
        public int IdActac { get; set; }
        public string Nombre_petligado { get; set; }
        public string status { get; set; }
    }
    public class TblEscritoi
    {
        public int IdEscrito { get; set; }
        public string Nombre_petligadoei { get; set; }
        public string Idcomplementopetei { get; set; }
        public List<EscritoUpdate> lEscritoI { get; set; }
    }
}