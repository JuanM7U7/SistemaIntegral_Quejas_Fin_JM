namespace SistemaIntegralQuejas.Models
{
    public class CedulaAntecedenteModel
    {
        public string IdEscrito { get; set; }
        public string Folio { get; set; }
        public string LugarRecepcion { get; set; }
        public DateTime FechaRecepcion { get; set; }
        public TimeSpan HoraRecepcion { get; set; }

        public List<PeticionarioModel> Peticionarios { get; set; } = new List<PeticionarioModel>();

        public string Autoridad { get; set; }
        public string Explicacion { get; set; }
        public string Abogado { get; set; }

        public DateTime FechaActual => DateTime.Now;
        public string MesActual => FechaActual.ToString(
            "MMMM",
            new System.Globalization.CultureInfo("es-ES")
        );
    }

    public class PeticionarioModel
    {
        public string TipoUsuario { get; set; }

        public string Nombre { get; set; }

        public string ApellidoPaterno { get; set; }

        public string ApellidoMaterno { get; set; }

        public string NombreCompleto
        {
            get
            {
                string prefijo = TipoUsuario switch
                {
                    "Peticionario" => "(Q) ",
                    "Agraviado" => "(A) ",
                    "Quejoso" => "(SIN TIPO) ",
                    _ => ""
                };

                return $"{prefijo}{Nombre} {ApellidoPaterno} {ApellidoMaterno}".Trim();
            }
        }
    }
}