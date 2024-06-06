using SistemaIntegralQuejas.Hubs;
using SistemaIntegralQuejas.Models;
using TableDependency.SqlClient;
using TableDependency.SqlClient.Base.EventArgs;

namespace SistemaIntegralQuejas.SubscribeTableDependencies
{
    public class SucscribeTurnosTableDependency : ISubscribeTableDependency
    {
        SqlTableDependency<Turno> tableDependency;
        TurnosHub turnosHub;
         
        public SucscribeTurnosTableDependency(TurnosHub turnosHub)
        {
            this.turnosHub = turnosHub;
        }

        public void SubscribeTableDependency(string connectionstring)
        {
            tableDependency = new SqlTableDependency<Turno>(connectionstring);
            tableDependency.OnChanged += Tabledependency_OnChanged;
            tableDependency.OnError += TableDependency_OnError;
            tableDependency.Start();
        }

        private void TableDependency_OnError(object sender, TableDependency.SqlClient.Base.EventArgs.ErrorEventArgs e)
        {
            Console.WriteLine($"{nameof(Turno)} SqlDependency Turno error: {e.Error.Message}");
        }

        private async void Tabledependency_OnChanged(object sender, RecordChangedEventArgs<Turno> e)
        {
            if (e.ChangeType != TableDependency.SqlClient.Base.Enums.ChangeType.None)
            {
                var turno = e.Entity;

                if (turno.Typemsg != null)
                {
                    await turnosHub.StatusBtn_AsignarTurno_TblTurno();
                    await turnosHub.Tabla_Administrador_TblTurno();
                }

                if (turno.Estado == 1 && turno.Typemsg != null)
                {
                    await turnosHub.ContadorTurnosPendientes_TblTurno(turno.Grupo);
                }

                if (turno.Estado == 2)
                {
                    if (turno.Typemsg == "Personal")
                    {
                        // Turno asignado envio personal
                        await turnosHub.TablaVA_Dqot_TblTurno(turno.Username);
                    }
                }

                if (turno.Estado == 3)
                {
                    await turnosHub.Sonido_TV_DQOT(turno.Grupo);
                    await turnosHub.Tabla_PantallaTv_TblTurno(turno.Grupo);
                }

                if (turno.Estado == 4)
                {
                    await turnosHub.Tabla_PantallaTv_TblTurno(turno.Grupo);
                }

            }
        }

    }
}
