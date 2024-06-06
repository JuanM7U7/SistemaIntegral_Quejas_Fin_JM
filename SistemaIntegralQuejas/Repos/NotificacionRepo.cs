using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SistemaIntegralQuejas.Models;
using System.Data;
using System.Data.Common;
using System.Drawing;
using System.Text.RegularExpressions;

namespace SistemaIntegralQuejas.Repos
{
    public class NotificacionRepo
    {
        string connectionString = "";

        public NotificacionRepo(string connectionString)
        {
            this.connectionString = connectionString;
        }
        // FUNCION TABLA TURNOS


        // FIN FUNCION TABLA TURNOS

        // MÉTODOS GENERALES
        private void ejecutaconsulta(string query)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    using (SqlCommand cmdmodul = new SqlCommand(query, connection))
                    {
                        cmdmodul.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    throw;
                }
                finally
                {

                    connection.Close();
                }

            }
        }

        private DataTable GetDatosGeneral(string query)
        {

            DataTable dataTable = new DataTable();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            dataTable.Load(reader);
                        }
                    }

                    return dataTable;
                }
                catch (Exception ex)
                {
                    throw;
                }
                finally
                {
                    connection.Close();
                }
            }
        }

        // FIN MÉTODOS GENERALES

    }
}
