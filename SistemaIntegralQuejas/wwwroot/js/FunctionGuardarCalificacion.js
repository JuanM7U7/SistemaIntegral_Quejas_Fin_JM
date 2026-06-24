// 09 01 2026 Ricardo devuelve el string del nombr del archivo
function GuardarCalificacion() {

    console.log(">>> ENTRO A GuardaCalifQuej");

    let formData = new FormData();

    // 1️⃣ Inputs normales (SIN files)
    $('#frmCalificacion')
        .find('input:not([type="file"]), select, textarea')
        .each(function () {
            let name = $(this).attr('name');
            if (name) {
                formData.append(name, $(this).val());
            }
        });

    // 2️⃣ Agregar archivos de EMISIÓN 09 01 2026
    $('input[type="file"][id^="archivoEmision_"]').each(function (i) {
        let ruta = $('#archivoEmisionruta_' + i).val(); // esto devuelve string
        if (ruta) {
            formData.append(
                `tablaMedCaut[${i}][archivoEmision]`,
                ruta
            );
            console.log("📎 Ruta emisión:", `tablaMedCaut[${i}][archivoEmision]`, ruta);
        }
    });


    // 3️⃣ Agregar RUTAS de archivos de ATENCIÓN (como strings)
    $('input[type="file"][id^="archivoAtencion_"]').each(function (i) {
        let ruta = $('#archivoAtencionruta_' + i).val(); // STRING
        if (ruta) {
            formData.append(
                `tablaMedCaut[${i}][archivoAtencion]`,
                ruta // ✅ RUTA como string
            );
            console.log("📎 Ruta atención:", `tablaMedCaut[${i}][archivoAtencion]`, ruta);
        }
    });


    // 🔍 DEBUG
    console.log("FormData armado");

    $.ajax({
        url: '/Expediente/GuardaCalifQuej',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (resp) {
            alert('Guardado correcto');
        },
        error: function (err) {
            console.error(err);
            alert('Error');
        }
    });
}
