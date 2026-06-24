using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models
{
    public class Orientacion
    {
        public string Input_ID { get; set; }
        public string Input_folio { get; set; }
        public string Input_LugarHechos { get; set; }
        public string Input_FechaRecepcion { get; set; }
        public string Input_HoraRecepcion { get; set; }
        public string Input_autoridadresp { get; set; }
        public string Input_institucion { get; set; }
        public string ExplicacionOrientacion { get; set; }
        public string sedeRegistro { get; set; }
        public string id_via_interpos { get; set; }
        public string idAbogado { get; set; }
        public string id_peticionario { get; set; }
    }
}
