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
            List<espedientetema> informaciontemaexped = new List<espedientetema>();
            List<inforaportaciones> infoaportacioness = new List<inforaportaciones>();
            List<SelectGenerico> paso = new List<SelectGenerico>();
            validaIinfoDQOT datValDQOT = new validaIinfoDQOT();


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
            if (informacioncomplementaria.tipo_expediente == 1)
            {
                query = "exec Sp_Select_Aporta ''," + identificadorQueja;
            }
            else
            {
                query = "exec Sp_Select_Aporta "+ identificadorQueja +", ''";
            }

            #region CONFIRMACION DE DATOS DQOT
            query = "exec Sp_SELECT_ConfirmDQOT " + identificadorQueja;
            datValDQOT = conexionsql.SelectValDQOT(query, ref mensaje);
            #endregion

            infoaportacioness = conexionsql.Obtaport(query, ref mensaje);

            query = "EXEC Sp_expe_tema '" + identificadorQueja + "'";
            informaciontemaexped = conexionsql.datostemaExpediente(query, ref mensaje);

			query = "EXEC Sp_GetPaso_Expediente " + identificadorQueja + "";
			paso = conexionsql.lista_SelectGenerica(query, ref mensaje); ;

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
                        infoaportaciones = infoaportacioness,
                        lista_tema_expe = informaciontemaexped,
                        listavi = listaContenedora8,
                        datvaldqot= datValDQOT
                    });
            }
            else
            {
                return Json(new { mensaje = "error" + mensaje });
            }
        }
        public async Task<ActionResult> RegresaListaCatalogosCalfModifi(int identificadorQueja)
        {
            List<SelectGenerico> listaContenedora2 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora3 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora4 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora5 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora6 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora7 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora8 = new List<SelectGenerico>();

            informacioncomplementaria informacioncomplementaria = new informacioncomplementaria();
            List<espedientetema> informaciontemaexped = new List<espedientetema>();
            List<inforaportaciones> infoaportacioness = new List<inforaportaciones>();
            List<SelectGenerico> paso = new List<SelectGenerico>();
            validaIinfoDQOT datValDQOT = new validaIinfoDQOT();


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
            query1 = "exec Sp_carga_informacion_Complementaria_peticionario_Calif '" + identificadorQueja + "'";
            query2 = "exec Sp_carga_informacion_Complementaria_Autoridad '" + identificadorQueja + "'";
            informacioncomplementaria = conexionsql.datoscomplementariosCalif(query, ref mensaje, query1, query2);
            /*Cargar informacion dentro de las pantallas*/
            if (informacioncomplementaria.tipo_expediente == 1)
            {
                query = "exec Sp_Select_Aporta ''," + identificadorQueja;
            }
            else
            {
                query = "exec Sp_Select_Aporta " + identificadorQueja + ", ''";
            }

            #region CONFIRMACION DE DATOS DQOT
            query = "exec Sp_SELECT_ConfirmDQOT " + identificadorQueja;
            datValDQOT = conexionsql.SelectValDQOT(query, ref mensaje);
            #endregion

            infoaportacioness = conexionsql.Obtaport(query, ref mensaje);

            query = "EXEC Sp_expe_tema '" + identificadorQueja + "'";
            informaciontemaexped = conexionsql.datostemaExpediente(query, ref mensaje);

            query = "EXEC Sp_GetPaso_Expediente " + identificadorQueja + "";
            paso = conexionsql.lista_SelectGenerica(query, ref mensaje); ;

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
                        infoaportaciones = infoaportacioness,
                        lista_tema_expe = informaciontemaexped,
                        listavi = listaContenedora8,
                        datvaldqot = datValDQOT
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
        public int id_programa { get; set; }
        public string estatus_Expediente { get; set; }
        public string fecha_mod { get; set; }

        public List<informacioncomplementariapeticionario> informacioncomplementariapeticionario { get; set; }
        public List<informacioncomplementariaautoridad> informacioncomplementariaautoridad { get; set; }

        public informacioncomplementaria() { }
        public informacioncomplementaria(int id_expediente, int id_abogado_recibe, string hechos, string fecha_registro, int id_sede, int id_lugar_hechos, List<informacioncomplementariapeticionario> icp, List<informacioncomplementariaautoridad> ica, int vi, int vis, string observaciones, int id_especializado, int id_tras_op_pub, int tipo_expediente, int id_materia, int id_niv_riesgo, int id_programa,string statusexp,string fecha_mod)
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
            this.id_programa = id_programa;
            this.estatus_Expediente = statusexp;
            this.fecha_mod = fecha_mod;
		}
    }

    public class informacioncomplementariapeticionario
    {
		public int id_registro { get; set; }
		public string nombre_peticionario { get; set; }
		public string curp { get; set; }
		public string tipo { get; set; }
		public string idtip_compet { get; set; }

        public informacioncomplementariapeticionario() { }  

		public informacioncomplementariapeticionario(int id_registro, string nombre_peticionario, string curp, string tipo, string idtip_compet)
		{
			this.id_registro = id_registro;
			this.nombre_peticionario = nombre_peticionario;
			this.curp = curp;
			this.tipo = tipo;
			this.idtip_compet = idtip_compet;
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

    public class validaIinfoDQOT
    {
        public int id_queja { get; set; }
        public string hechos { get; set; }
        public string lugar { get; set; }
        public string petic { get; set; }
        public string datospeti { get; set; }
        public int version { get; set; }

        public validaIinfoDQOT() { }

        public validaIinfoDQOT(int id_queja, string hechos, string lugar, string petic, string datospeti, int version)
        {
            this.id_queja = id_queja;
            this.hechos = hechos;
            this.lugar = lugar;
            this.petic = petic;
            this.datospeti = datospeti;
            this.version = version;
        }
    }

    public class espedientetema
    {
        public int id_tema { get; set; }
        public int id_expediente { get; set; }
        public string otro_tema { get; set; }
        public string descripcion { get; set; }

        public espedientetema() { }

        public espedientetema(int id_tema, int id_expediente, string otro_tema, string descripcion)
        {
            this.id_tema = id_tema;
            this.id_expediente = id_expediente;
            this.otro_tema = otro_tema;
            this.descripcion = descripcion;
        }
    }
    
    public class inforaportaciones
    {
        public int id_aportacion { get; set; }
        public int id_expediente { get; set; }
        public int id_expediente_apor { get; set; }
        public string descripcion { get; set; }
        public string noexpe { get; set; }
        public inforaportaciones() { }

        public inforaportaciones(int id_aportacion, int id_expediente, int id_expediente_apor, string descripcion, string noexpe)
        {
            this.id_aportacion = id_aportacion;
            this.id_expediente = id_expediente;
            this.id_expediente_apor = id_expediente_apor;
            this.descripcion = descripcion;
            this.noexpe = noexpe;
        }
    }

}
