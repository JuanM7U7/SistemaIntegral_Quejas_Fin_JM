namespace SistemaIntegralQuejas.Models
{
    public class EscritoModificado
    {


        public int Id { get; set; }

        public string Peticionarios { get; set; }

        public string FechaHechos { get; set; }

        public string LugarHechos { get; set; }

        public string CircunstanciasHechos { get; set; }

        public string NombresFinales { get; set; }

        public string Autoridades { get; set; }



        public EscritoModificado() { }
        public EscritoModificado(
            int id, string peticionarios, string fechaHechos, string lugarHechos, string circunstanciasHechos, string nombresFinales, string autoridades)
        {
            Id = id;
            Peticionarios = peticionarios;
            FechaHechos = fechaHechos;
            LugarHechos = lugarHechos;
            CircunstanciasHechos = circunstanciasHechos;
            NombresFinales = nombresFinales;
            Autoridades = autoridades;

            if (fechaHechos.Contains("00:00:00"))
            {
                FechaHechos = fechaHechos.Substring(0, 10);
            }
        }
    }

    public class EscritoUpdate
    {

        public int Id { get; set; }

        public string Peticionarios { get; set; }

        public string FechaHechos { get; set; }
        public DateTime? Fechahd { get; set; }

        public int cvemun { get; set; }

        public string estado { get; set; }

        public string calle { get; set; }

        public string numero_ext { get; set; }
        public string numero_int { get; set; }

        public string CP { get; set; }

        public string colonia { get; set; }

        public string circuns_Hechos { get; set; }

        public string Nombre_persona { get; set; }
        public string cargo_persona { get; set; }
        public string Autoridad { get; set; }
        public int? idpersona { get; set; }
        public int? idcomlpe_persona { get; set; }
        public List<EnlaceArchivoadjuntoEscritoi> Rutaarchivo { get; set; }

    }
}
