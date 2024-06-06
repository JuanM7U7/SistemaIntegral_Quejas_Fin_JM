namespace SistemaIntegralQuejas.Models
{
    public class PdfDatosPeticionario : ComplementoPeticionario
    {
        public string Nombre { get; set; }
        public string CURP { get; set; }

        public string ApellidoPat { get; set; }

        public string ApellidoMat { get; set; }

        public string DocIdentificatorio { get; set; }
        public string nombreEscolaridad { get; set; }
        public string nombreOcupacion { get; set; }

    }
}
