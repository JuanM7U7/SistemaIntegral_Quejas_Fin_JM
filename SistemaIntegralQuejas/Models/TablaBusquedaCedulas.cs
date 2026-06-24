using SistemaIntegralQuejas.Controllers;
using System;

namespace SistemaIntegralQuejas.Models
{
    public class TablaBusquedaCedulas
    {
        // Cédula
        public int Id_escrito { get; set; }
        public int? id_peticionario_principal { get; set; }
        public string Folio { get; set; }
        public string Lugar_hechos { get; set; }
        public DateTime? Fecha_recepcion { get; set; }
        public string Hora_recepcion { get; set; }
        public string? Autoridad { get; set; }
        public string? Numero_oficio { get; set; }
        public string? Institucion { get; set; }
        public string? Remitente { get; set; }
        public string Explicacion { get; set; }
        public string Archivo { get; set; }
        public string Tipo_Archivo { get; set; }
        public string Sede_registro { get; set; }
        public string Via_interposicion { get; set; }
        public string Abogado { get; set; }
        public string Peticionario { get; set; }
        public int Edad { get; set; }
        public string Genero { get; set; }
        public string Sexo { get; set; }
        public string Tipo_usuario { get; set; }
        public string Documento { get; set; }
        public string Id_personas { get; set; }
        public string tipo_cedula { get; set; }
        public int Estatus { get; set; }
        public int estatus_columna { get; set; }

        //aportacion
        public int id_tipo { get; set; }
        public string Expediente { get; set; }


        // Datos personales
        public string? DP_Nombre { get; set; }
        public string? DP_ApellidoPaterno { get; set; }
        public string? DP_ApellidoMaterno { get; set; }
        public string? DP_CURP { get; set; }
        public DateTime? DP_FechaRegistro { get; set; }
        public int? DP_Via_interposicion { get; set; }
        public string? DP_TipoUsuario { get; set; }
        public string? DP_Calle { get; set; }
        public string? DP_NumExterior { get; set; }
        public string? DP_NumInterior { get; set; }
        public string? DP_Colonia { get; set; }
        public string? DP_Ciudad { get; set; }
        public string? DP_Municipio { get; set; }
        public string? DP_Estado { get; set; }
        public string? DP_CodigoPostal { get; set; }
        public string? DP_Telefono { get; set; }
        public int? DP_Edad { get; set; }
        public string? DP_Email { get; set; }
        public int? DP_Sexo { get; set; }
        public int? DP_Escolaridad { get; set; }
        public int? DP_EstadoConyugal { get; set; }
        public int? DP_Ocupacion { get; set; }
        public string? DP_OtraOcupacion { get; set; }
        public string? DP_Nacionalidad { get; set; }
        public string? DP_SabeLeer { get; set; }
        public int? DP_Discapacidad { get; set; }
        public int? DP_GrupoSocial { get; set; }
        public string? DP_OtroGrupoSocial { get; set; }
        public string? DP_HablaLengua { get; set; }
        public string? DP_LenguaIndigena { get; set; }
        public DateTime? DP_FechaNacimiento { get; set; }
        public string? DP_OrigenMigrante { get; set; }
        public string? DP_DestinoMigrante { get; set; }
        public string? DP_PrimeraVezMexico { get; set; }
        public int? DP_ViolenciaVM { get; set; }
        public string? DP_Canalizacion { get; set; }
        public string? DP_Embarazada { get; set; }
        public int? DP_HijosVivos { get; set; }
        public int? DP_ModalidadViolencia { get; set; }
        public int? DP_TipoViolencia { get; set; }
        public int? DP_RelacionAgresor { get; set; }
        public string? DP_IngresosMensuales { get; set; }
        public string? DP_Genero { get; set; }
        public string? DP_OtroGenero { get; set; }
        public int? DP_idCompPetit { get; set; }
        public int? DP_status { get; set; }
        public int? DP_persona { get; set; }
        public int? E_ExpEstatus { get; set; }


    }

}
