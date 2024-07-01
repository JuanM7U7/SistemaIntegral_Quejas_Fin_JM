using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaIntegralQuejas.Models;
using System.Data;
using System.Globalization;
using System.Data.SqlClient;
using static SistemaIntegralQuejas.Controllers.ExpedienteController;
using System.Net.Sockets;
using System.IO;
using System.Text;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace SistemaIntegralQuejas.Controllers
{

    public class AltaExpedienteController : Controller
    {
        private SQLMODEL conexionsql = new SQLMODEL();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GuardarQueja(IFormCollection form)
        {
            int idqueja=99, abogadoqueja = 99, estadoqueja = 99, municipioqueja = 99, visitaduriaqueja = 99, sederegistro = 99,viainter=99;
            string hechos = "", nombrequejoso = "", apellidos = "", curp = "", fecharegistro = "", observaciones = "";

            idqueja = int.Parse(form["idquejaDC"]);
            abogadoqueja = int.Parse(form["Abogadoqueja"]);
            hechos = form["hechosDC"].ToString();
           // estadoqueja= int.Parse(form["estadoqueja"]);
            municipioqueja= int.Parse(form["municipioqueja"]);
            nombrequejoso = form["nombrequejoso"].ToString();
            apellidos = form["Apellidos"].ToString();
            curp = form["curp"].ToString();
            //visitaduriaqueja= int.Parse(form["visitaduriaqueja"]);
            fecharegistro = form["Fecha_Registro"].ToString();
            sederegistro = int.Parse(form["sedeRegistro"]);
			viainter = int.Parse(form["viainterpos"]);
            observaciones = form["observaciones"].ToString();

            string  query = "exec Sp_InsertQueja " +
            "" + idqueja + "," +
            "" + abogadoqueja + "," +
            "'" + hechos + "'," +
            "" + estadoqueja + "," +
            "" + municipioqueja + "," +
           // "'" + nombrequejoso + "'," +
           // "'" + apellidos + "'," +
           // "'" + curp + "'," +
            "" + visitaduriaqueja + "," +
            "'" + fecharegistro + "'," +
             "" + sederegistro + ","+
             "" + viainter + ","+
            "'" + observaciones + "';";
            
            return Json(new { estatus = conexionsql.InsertUpdateDelete(query)});
        }
        public async Task<ActionResult> RegresaListaCatalogos(int identificadorQueja)
        {
            List<SelectGenerico> listaContenedora2 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora3 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora4 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora5 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora6 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora7 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora8 = new List<SelectGenerico>();

            informacioncomplementaria informacioncomplementaria = new informacioncomplementaria();



            String query = "exec Sp_Select_Abogado";
            String query1 = "";
            String query2 = "";
            string mensaje = "";
            listaContenedora2 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_EstadoRM";
            listaContenedora3 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_Estado";
            listaContenedora4 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_autoridad";
            listaContenedora5 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_sedes";
            listaContenedora6 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_visitadurias";
            listaContenedora7 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_ViaInterposicionQ";
            listaContenedora8 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            /*Cargar informacion dentro de las pantallas*/
            query = "exec Sp_carga_informacion_Complementaria '"+ identificadorQueja + "'";
			query1 = "exec Sp_carga_informacion_Complementaria_peticionario '"+ identificadorQueja + "'";
            query2 = "exec Sp_carga_informacion_Complementaria_Autoridad '" + identificadorQueja + "'";
            informacioncomplementaria = conexionsql.datoscomplementarios(query, ref mensaje,query1, query2);
			/*Cargar informacion dentro de las pantallas*/


			if (listaContenedora3.Count > 0)
            {
                return Json(
                    new
                    {
                        lista_abogado = listaContenedora2,
                        lista_estado = listaContenedora3,
                        lista_municipio = listaContenedora4,
                        lista_autoridad = listaContenedora5,
                        lista_sedes = listaContenedora6,
                        listavisitadurias = listaContenedora7,
                        informarcionC=informacioncomplementaria,
                        listavi= listaContenedora8
                    });
            }
            else
            {
                return Json(new { mensaje = "error" + mensaje });
            }
        }

        public async Task<ActionResult> RegresaListaCatalogosCalf(int identificadorQueja)
        {
            List<SelectGenerico> listaContenedora2 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora3 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora4 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora5 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora6 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora7 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora8 = new List<SelectGenerico>();

            informacioncomplementaria informacioncomplementaria = new informacioncomplementaria();



            String query = "exec Sp_Select_Abogado";
            String query1 = "";
            String query2 = "";
            string mensaje = "";
            listaContenedora2 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_EstadoRM";
            listaContenedora3 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_Estado";
            listaContenedora4 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_autoridad";
            listaContenedora5 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_sedes";
            listaContenedora6 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_visitadurias";
            listaContenedora7 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_ViaInterposicionQ";
            listaContenedora8 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            /*Cargar informacion dentro de las pantallas*/
            query = "exec Sp_carga_info_Comp_Calif '" + identificadorQueja + "'";
            query1 = "exec Sp_carga_informacion_Complementaria_peticionario '" + identificadorQueja + "'";
            query2 = "exec Sp_carga_informacion_Complementaria_Autoridad '" + identificadorQueja + "'";
            informacioncomplementaria = conexionsql.datoscomplementariosCalif(query, ref mensaje, query1, query2);
            /*Cargar informacion dentro de las pantallas*/


            if (listaContenedora3.Count > 0)
            {
                return Json(
                    new
                    {
                        lista_abogado = listaContenedora2,
                        lista_estado = listaContenedora3,
                        lista_municipio = listaContenedora4,
                        lista_autoridad = listaContenedora5,
                        lista_sedes = listaContenedora6,
                        listavisitadurias = listaContenedora7,
                        informarcionC = informacioncomplementaria,
                        listavi = listaContenedora8
                    });
            }
            else
            {
                return Json(new { mensaje = "error" + mensaje });
            }
        }
        public ActionResult ActualizaEstatus(IFormCollection form)
        {
            GuardarQueja(form);
            int idqueja = 99;
           idqueja = int.Parse(form["idquejaDC"]);
            string mensaje = "";
            bool estado = false;
            String query = "exec Sp_Update_Status_complementoqueja "+ idqueja;


            estado = conexionsql.InsertUpdateDelete(query);

            return Json(new { stauts = estado });
        }
        
	}

    public class informacioncomplementaria
    {
        public int id_expediente { get; set; }
		public int id_abogado_recibe { get; set; }
		public string hechos { get; set; }
		public string fecha_registro { get; set; }
		public int id_sede { get; set; }
		public int id_lugar_hechos { get; set; }
        public int Via_interpos { get; set; }
        public int visitaduria { get; set; }
        public string observaciones { get; set; }
        public int id_especializado { get; set; }
        public int id_tras_op_pub { get; set; }
        public int tipo_expediente { get; set; }
        public int id_materia { get; set; }
        public int id_niv_riesgo { get; set; }

        public List<informacioncomplementariapeticionario> informacioncomplementariapeticionario { get; set; }
        public List<informacioncomplementariaautoridad> informacioncomplementariaautoridad { get; set; }

        public informacioncomplementaria() { }
        public informacioncomplementaria(int id_expediente, int id_abogado_recibe, string hechos, string fecha_registro, int id_sede, int id_lugar_hechos, List<informacioncomplementariapeticionario> icp, List<informacioncomplementariaautoridad> ica, int vi, int vis, string observaciones, int id_especializado, int id_tras_op_pub, int tipo_expediente, int id_materia, int id_niv_riesgo)
        {
            this.id_expediente = id_expediente;
            this.id_abogado_recibe = id_abogado_recibe;
            this.hechos = hechos;
            this.fecha_registro = fecha_registro;
            this.id_sede = id_sede;
            this.id_lugar_hechos = id_lugar_hechos;
            this.informacioncomplementariapeticionario = icp;
            this.informacioncomplementariaautoridad = ica;
            this.Via_interpos = vi;
            this.visitaduria = vis;
            this.observaciones = observaciones;

            this.id_especializado = id_especializado;
            this.id_tras_op_pub = id_tras_op_pub;
            this.tipo_expediente = tipo_expediente;
            this.id_materia = id_materia;
            this.id_niv_riesgo = id_niv_riesgo;
        }
    }

    public class informacioncomplementariapeticionario
    {
		public int id_registro { get; set; }
		public string nombre_peticionario { get; set; }
		public string curp { get; set; }

        public informacioncomplementariapeticionario() { }  

		public informacioncomplementariapeticionario(int id_registro, string nombre_peticionario, string curp)
		{
			this.id_registro = id_registro;
			this.nombre_peticionario = nombre_peticionario;
			this.curp = curp;
		}
	}

    public class informacioncomplementariaautoridad 
    {
        public int id_registro { get; set; }
        public string nombre_autoridad { get; set; }
        public string ambito { get; set; }

        public informacioncomplementariaautoridad() { }

        public informacioncomplementariaautoridad(int id_registro, string nombre_peticionario, string curp)
        {
            this.id_registro = id_registro;
            this.nombre_autoridad = nombre_peticionario;
            this.ambito = curp;
        }
    }

}
