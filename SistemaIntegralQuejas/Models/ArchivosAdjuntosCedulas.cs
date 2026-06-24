using SistemaIntegralQuejas.Controllers;
using System;

namespace SistemaIntegralQuejas.Models
{
    public class ArchivosAdjuntosCedulas
    {
        public int Id_Archivo_Cedulas { get; set; }
        public string Expediente_Aportacion { get; set; }
        public int Id_Expediente { get; set; }
        public string Nombre_Archivo { get; set; }
        public string Tipo_Archivo { get; set; }
        public int Estatus { get; set; }
        public string Tipo_Cedula { get; set; }

    }
}
