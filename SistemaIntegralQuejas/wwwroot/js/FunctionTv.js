const hubTurnoVAQ = "turnosHub";
/*-----------------------RELOJ-----------------------*/
$(function () {

    // Obtener turnos atendiendo añ cargar página
    fetchGet("Turnos/ObtenerTurnosEnCurso", "json", (respuesta) => {
        let resp = respuesta.data;
        console.log(resp)
        if (resp.length == 0) {
            $('#example tbody').empty();
            let tr;
            let products = resp;
            $.each(products, function (index, product) {

                tr = $(`<tr class='borrafila' />`);
                tr.append(`<td class='borrafila'> ATN - ${product.numTurno}</td>`);
                tr.append(`<td class='borrafila'>${product.nombrE_ABG_ATENDIENDO}</td>`);
                tr.append(`<td class='borrafila'> ATN-0${product.fkIdModulo}</td>`);
                $('#example').append(tr);

            });

            $('#Id_Turno').text('');
            $('#id_Modulo').text('');
        } else {
            console.log(resp)
            BindProductsLoadToGridN(resp);
        }

    })

    function BindProductsLoadToGridN(products) {
        $('#example tbody').empty();
        let tr;
        $.each(products, function (index, product) {
            tr = $(`<tr />`);
            tr.append(`<td style="font-weight: bolder; font-size: xx-large;"> ATN - ${product.numTurno}</td>`);
            tr.append(`<td style="font-weight: bolder; font-size: xx-large;">${product.nombrE_ABG_ATENDIENDO}</td>`);
            tr.append(`<td style="font-weight: bolder; font-size: xx-large;"> ATN-0${product.fkIdModulo}</td>`);
            $('#example').append(tr);

        });

        $('#Id_Turno').html(`ATN - ${products[0].numTurno}`);
        $('#id_Modulo').html(`ATN-0 ${products[0].fkIdModulo}`);

    }

    var actualizarHora = function () {
        var fecha = new Date(),
            hora = fecha.getHours(),
            minutos = fecha.getMinutes(),
            segundos = fecha.getSeconds(),
            diaSemana = fecha.getDay(),
            dia = fecha.getDate(),
            mes = fecha.getMonth(),
            anio = fecha.getFullYear(),
            ampm;

        var $pHoras = $("#horas"),
            $pSegundos = $("#segundos"),
            $pMinutos = $("#minutos"),
            $pAMPM = $("#ampm"),
            $pDiaSemana = $("#diaSemana"),
            $pDia = $("#dia"),
            $pMes = $("#mes"),
            $pAnio = $("#anio");
        var semana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        $pDiaSemana.text(semana[diaSemana]);
        $pDia.text(dia);
        $pMes.text(meses[mes]);
        $pAnio.text(anio);
        if (hora >= 12) {
            hora = hora - 12;
            ampm = "PM";
        } else {
            ampm = "AM";
        }
        if (hora == 0) {
            hora = 12;
        }
        if (hora < 10) { $pHoras.text("0" + hora) } else { $pHoras.text(hora) };
        if (minutos < 10) { $pMinutos.text("0" + minutos) } else { $pMinutos.text(minutos) };
        if (segundos < 10) { $pSegundos.text("0" + segundos) } else { $pSegundos.text(segundos) };
        $pAMPM.text(ampm);

    };

    actualizarHora();
    var intervalo = setInterval(actualizarHora, 1000);



});
