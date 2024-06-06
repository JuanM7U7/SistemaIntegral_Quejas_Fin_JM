namespace SistemaIntegralQuejas.Models
{
    public class TurnoModificado : Turno
    {
            public int ID_TURNO { get; set; }
            public int NUM_TURNO { get; set; }
            public DateTime FECHA_INICIO { get; set; }
            public DateTime FECHA_FIN { get; set; }
            public int ID_ABOGADO { get; set; }
            public string USER { get; set; }
            public string NOMBRE_ABG_ATENDIENDO { get; set; }
            public List<Usuarios> NOM_ABOGADOS { get; set; }
            public int ID_MODULO { get; set; }
            public String NOMBRE_MODULO { get; set; }
            public String STATUS_TURNO_TXT { get; set; }
            public int ID_REGISTRO { get; set; }
            public int FK_ID_MODULO { get; set; }
            public DateTime FECHA_HORA_TOMA_ATN { get; set; }
            public DateTime FECHA_HORA_RECEPCION { get; set; }

    }
}
