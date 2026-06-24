using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using System.Collections;
using System.Runtime.CompilerServices;
using System.Security.Policy;

namespace SistemaIntegralQuejas.Models
{
    public class PDF_Formato_Rechazo
    {
        public string NumeroExp { get; set; }

        public string PrimeraParte { get; set; }

        public string SegundaParte { get; set; }

        public string TerceraParte { get; set; }

        public string Visitaduría { get; set; }

        public string Memorandum { get; set; }

        public Usuario DirectQuejas { get; set; }

        public Usuario Visitador { get; set; }


        public List<listadoObservaciones> listado { get; set; }

        public PDF_Formato_Rechazo()
        {
            listado = new List<listadoObservaciones>();
        }
    }

    public class listadoObservaciones
    {
        public string idExpediente { get; set; }

        public string justificacion { get; set; }

        public listadoObservaciones() { }

        public listadoObservaciones(string idExpediente, string justificacion)
        {
            this.idExpediente = idExpediente;
            this.justificacion = justificacion;
        }
    }
}
