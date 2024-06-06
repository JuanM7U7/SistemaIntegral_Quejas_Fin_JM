using SistemaIntegralQuejas.Hubs;
using SistemaIntegralQuejas.Models;
using TableDependency.SqlClient;
using TableDependency.SqlClient.Base.EventArgs;

namespace SistemaIntegralQuejas.SubscribeTableDependencies
{
    public class SucscribeModulosatnTableDependency : ISubscribeTableDependency
    {
        SqlTableDependency<Moduloatenciondqot> tableDependency;
        TurnosHub turnosHub;

        public SucscribeModulosatnTableDependency(TurnosHub turnosHub)
        {
            this.turnosHub = turnosHub;
        }

        public void SubscribeTableDependency(string connectionstring)
        {
            tableDependency = new SqlTableDependency<Moduloatenciondqot>(connectionstring);
            tableDependency.OnChanged += Tabledependency_OnChanged;
            tableDependency.OnError += TableDependency_OnError;
            tableDependency.Start();
        }

        private void TableDependency_OnError(object sender, TableDependency.SqlClient.Base.EventArgs.ErrorEventArgs e)
        {
            Console.WriteLine($"{nameof(Moduloatenciondqot)} SqlDependency ModuloAtencionDqot error: {e.Error.Message}");
        }

        private async void Tabledependency_OnChanged(object sender, RecordChangedEventArgs<Moduloatenciondqot> e)
        {
            if (e.ChangeType != TableDependency.SqlClient.Base.Enums.ChangeType.None)
            {
                await turnosHub.GetModulos();
            }
        }
    }
}
