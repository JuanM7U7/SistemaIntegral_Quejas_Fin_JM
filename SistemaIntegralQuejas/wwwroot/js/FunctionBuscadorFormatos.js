//Tabla
const tableBuscadorFormatos = $('#tableEditFormatosDqot');
let dataBf = [
    [
        "1",
        "Everaldo Garcia López",
        "<span><a href='javascript:void(0)' class='mr-4' data-toggle='tooltip' data-placement='top' title=\"Editar\"> <i class='fa fa-pencil color-muted fa-2x'></i> </a> <button type='button' onclick='eliminaFormato(1)' class='btn btn-link margin-iconbf'><span class='fa fa-trash color-danger fa-2x'></span></button> </span>",
        "<span><a href='javascript:void(0)' class='mr-4' data-toggle='tooltip' data-placement='top' title=\"Editar\"> <i class='fa fa-pencil color-muted fa-2x'></i> </a> <button type='button' onclick='eliminaFormato(2)' class='btn btn-link margin-iconbf'><span class='fa fa-trash color-danger fa-2x'></span></button> </span>",
        "<span><a href='javascript:void(0)' class='mr-4' data-toggle='tooltip' data-placement='top' title=\"Editar\"> <i class='fa fa-pencil color-muted fa-2x'></i> </a> <button type='button' onclick='eliminaFormato(3)' class='btn btn-link margin-iconbf'><span class='fa fa-trash color-danger fa-2x'></span></button> </span>"
    ]
];

(function ($) {
    "use strict"

    mostrarResTblFormatos();

})(jQuery);

function mostrarResTblFormatos() {

    tableBuscadorFormatos.DataTable({
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
        },
        data: dataBf
    })
}

function eliminaFormato(idformato) {

    
    .fire({
        title: 'Eliminar Formato Datos Personales',
        text: "¿Desea eliminar el formato de datos personales ligado esta queja?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then(function (resp) {
        if (resp.isConfirmed) {
            console.log('Eliminado')
        }
    })

}