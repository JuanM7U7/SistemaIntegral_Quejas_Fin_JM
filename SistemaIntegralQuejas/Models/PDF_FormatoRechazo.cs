using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using System.Collections;
using System.Runtime.CompilerServices;
using System.Security.Policy;

namespace SistemaIntegralQuejas.Models
{
    public class PDF_Formato_Rechazo
    {
        public String NumeroExp { get; set; }

        public String PrimeraParte { get; set; }

        public String SegundaParte { get; set; }

        public String TerceraParte { get; set; }

        public String Firma_Parte { get; set; }

        public String Visitaduría { get; set; }
        public String Memorandum { get; set; }

        public List<listadoObservaciones> listado { get; set; }




        public PDF_Formato_Rechazo() { }    

        public PDF_Formato_Rechazo(string numeroExp, string primeraParte, string segundaParte, string terceraParte, string firma_Parte, string visitaduría, string memorandum, List<listadoObservaciones> listado)
        {
            NumeroExp = numeroExp;
            PrimeraParte = primeraParte;
            SegundaParte = segundaParte;
            TerceraParte = terceraParte;
            Firma_Parte = firma_Parte;
            Visitaduría = visitaduría;
            Memorandum = memorandum;
            this.listado = listado;
        }
    }


    public class listadoObservaciones
    {

        public string idExpediente { get; set; }
        public string justificacion { get; set;}

        public listadoObservaciones() { }   
        public listadoObservaciones(string idExpediente, string justificacion)
        {
            this.idExpediente = idExpediente;
            this.justificacion = justificacion;
        }
    }



}
