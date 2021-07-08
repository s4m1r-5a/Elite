function ID(lon) {
    let chars = "0A1B2C3D4E5F6G7H8I9J0KL1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z",
        code = "";
    for (x = 0; x < lon; x++) {
        let rand = Math.floor(Math.random() * chars.length);
        code += chars.substr(rand, 1);
    };
    return code;
};
function ID2(lon) {
    let chars = "1234567890",
        code = "";
    for (x = 0; x < lon; x++) {
        let rand = Math.floor(Math.random() * chars.length);
        code += chars.substr(rand, 1);
    };
    return code;
};
async function usuario(id) {
    const usuario = await pool.query(`SELECT p.categoria, p.usuario FROM pines p WHERE p.acreedor = ? `, id);
    if (usuario.length > 0 && usuario[0].categoria == 2) {
        return usuario[0].usuario;
    } else {
        return id
    }
};
async function saldo(producto, rango, id, monto) {
    var operacion;
    if (!producto && monto) {
        operacion = monto;
    } else if (!producto && !monto) {
        return 'NO'
    } else {
        const produ = await pool.query(`SELECT precio, utilidad, stock FROM products WHERE id_producto = ?`, producto);
        const rang = await pool.query(`SELECT comision FROM rangos WHERE id = ?`, rango);
        operacion = produ[0].precio - (produ[0].utilidad * rang[0].comision / 100);
    }
    const saldo = await pool.query(`SELECT IF(saldoactual < ${operacion} OR saldoactual IS NULL,'NO','SI') Respuesta FROM users WHERE id = ? `, id);
    return saldo[0].Respuesta
};
async function Rango(id) {
    /*if (id == 15) { return 1 }
    let m = new Date(),
        month = Math.sign(m.getMonth() - 2) > 0 ? m.getMonth() - 2 : 1,
        d, meses = 0,
        mes = 0,
        reportes = new Array(4);
    const reporte = await pool.query(`SELECT MONTH(v.fechadecompra) Mes, COUNT(*) CantMes, SUM(p.precio) venta, SUM(p.utilidad) utilidad
    FROM ventas v 
    INNER JOIN users u ON v.vendedor = u.id
    INNER JOIN products p ON v.product = p.id_producto
    WHERE v.vendedor = ?
        AND YEAR(v.fechadecompra) = YEAR(CURDATE()) 
        AND MONTH(v.fechadecompra) BETWEEN ${month} and 12
    GROUP BY MONTH(v.fechadecompra)
    ORDER BY 1`, id);
    const reporte2 = await pool.query(`SELECT MONTH(t.fecha) Mes, COUNT(*) CanTrans, SUM(t.monto) monto
    FROM transacciones t     
    WHERE t.acreedor = ?
        AND YEAR(t.fecha) = YEAR(CURDATE()) 
        AND MONTH(t.fecha) BETWEEN ${month} and 12
    GROUP BY MONTH(t.fecha)
    ORDER BY 1`, id);

    if (reporte.length > 0 || reporte2.length > 0) {
        await reporte.filter((repor) => {
            return repor.Mes === m.getMonth() + 1;
            //return repor.Mes === 9;
        }).map((repor) => {
            if (repor.CantMes >= 1 && repor.CantMes <= 19) {
                d = `${repor.Mes} ${repor.CantMes} 5`
                return reportes[0] = 5;
            } else if (repor.CantMes >= 20 && repor.CantMes <= 49) {
                return reportes[0] = 4;
            } else if (repor.CantMes >= 50 && repor.CantMes <= 99) {
                return reportes[0] = 3;
            } else if (repor.CantMes >= 100 && repor.CantMes <= 499) {
                return reportes[0] = 2;
            } else if (repor.CantMes >= 500) {
                return reportes[0] = 1;
            }
        });
        if (!reportes[0]) {
            reportes[0] = 6;
        };
        await reporte.filter((re) => {
            return re.Mes !== m.getMonth() + 1;
        }).map((re) => {
            mes += re.CantMes;
        });
        if (mes >= 1 && mes <= 59) {
            reportes[1] = 5;
        } else if (mes >= 60 && mes <= 149) {
            reportes[1] = 4;
        } else if (mes >= 150 && mes <= 299) {
            reportes[1] = 3;
        } else if (mes >= 300 && mes <= 1499) {
            reportes[1] = 2;
        } else if (mes >= 1500) {
            reportes[1] = 1;
        } else {
            reportes[1] = 6;
        }
        await reporte2.filter((re) => {
            return re.Mes !== m.getMonth() + 1;
        }).map((re) => {
            meses += re.monto;
        });
        if (meses <= 50000) {
            reportes[2] = 5;
        } else if (meses >= 600000 && meses <= 1499900) {
            reportes[2] = 4;
        } else if (meses >= 1500000 && meses <= 2999900) {
            reportes[2] = 3;
        } else if (meses >= 3000000 && meses <= 4999900) {
            reportes[2] = 2;
        } else if (meses >= 5000000) {
            reportes[2] = 1;
        } else {
            reportes[2] = 6;
        }
        await reporte2.filter((rep) => {
            return rep.Mes === m.getMonth() + 1;
        }).map((rep) => {
            if (rep.monto <= 50000) {
                return reportes[3] = 5;
            } else if (rep.monto >= 600000 && rep.monto <= 1499900) {
                return reportes[3] = 4;
            } else if (rep.monto >= 1500000 && rep.monto <= 2999900) {
                return reportes[3] = 3;
            } else if (rep.monto >= 3000000 && rep.monto <= 4999900) {
                return reportes[3] = 2;
            } else if (rep.monto >= 5000000) {
                return reportes[3] = 1;
            } else {
                return reportes[3] = 6;
            }
        });
        if (!reportes[3]) {
            reportes[3] = 6;
        };
        return Math.min(...reportes);
    } else {
        return 5;
    };
    return 4;*/
};
async function Estados(S, L, P) {
    // S = id de separacion
    // L = id de lote
    // P = id de la solicitud de pago
    var F = S ? { r: S, m: `AND pr.id = ${S}` }
        : L ? { r: L, m: `AND pd.id = ${L}` }
            : { r: P, m: `AND s.ids = ${P}` };

    const Pagos = await pool.query(
        `SELECT SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, cp.monto, 0)) AS BONOS, SUM(s.monto) AS MONTO
         FROM solicitudes s INNER JOIN preventa pr ON s.lt = pr.lote INNER JOIN productosd pd ON s.lt = pd.id
         LEFT JOIN cupones cp ON s.bono = cp.id WHERE s.stado = 4 AND s.concepto IN('PAGO', 'ABONO') ${F.m}`
    );
    //console.log(Pagos)
    const Cuotas = await pool.query(
        `SELECT SUM(if (c.tipo = 'SEPARACION', c.cuota, 0)) AS SEPARACION, SUM(if (c.tipo = 'INICIAL', c.cuota, 0)) AS INICIAL,
         SUM(if (c.tipo = 'FINANCIACION', c.cuota, 0)) AS FINANCIACION, SUM(c.cuota) AS TOTAL
         FROM solicitudes s INNER JOIN preventa pr ON s.lt = pr.lote INNER JOIN productosd pd ON s.lt = pd.id
         INNER JOIN cuotas c ON c.separacion = pr.id WHERE s.concepto IN('PAGO', 'ABONO') ${F.m}`
    );
    //console.log(Cuotas)
    if (Pagos.length > 0) {
        var pagos = Pagos[0].BONOS + Pagos[0].MONTO,
            cuotas = Cuotas[0];

        if (pagos >= cuotas.FINANCIACION) {
            return { std: 13, estado: 'VENDIDO' }
        } else if (pagos >= cuotas.INICIAL && pagos < cuotas.FINANCIACION) {
            return { std: 10, estado: 'SEPARADO' }
        } else if (pagos >= cuotas.SEPARACION && pagos < cuotas.INICIAL) {
            return { std: 12, estado: 'APARTADO' }
        } else {
            return { std: 1, estado: 'PENDIENTE' }
        }

    }
}
/*async function Pa(S, L, P, fn) {
    var u = await fn(S, L, P)
    console.log(u)
}*/
//Pa(null, null, 313, Estados)

async function PagosAbonos(Tid, pdf) {

    const SS = await pool.query(`SELECT s.fech, c.fechs, s.monto, u.pin, c.cuota, 
    pd.valor, pr.ahorro, pr.iniciar, s.facturasvenc, pd.estado, p.incentivo, pr.asesor, 
    pr.lote, cl.idc, cl.movil, cl.nombre, s.recibo, c.tipo, c.ncuota, p.proyect, pd.mz, 
    pd.n, s.stado, cp.pin bono, cp.monto mount, cp.motivo, cp.concept, s.formap, s.concepto,
    s.ids, s.descp, pr.id cparacion FROM solicitudes s LEFT JOIN cuotas c ON s.pago = c.id
    INNER JOIN preventa pr ON s.lt = pr.lote INNER JOIN productosd pd ON s.lt = pd.id
    INNER JOIN productos p ON pd.producto = p.id INNER JOIN users u ON pr.asesor = u.id 
    INNER JOIN clientes cl ON pr.cliente = cl.idc LEFT JOIN cupones cp ON s.bono = cp.id
    WHERE s.ids = ${Tid}`);

    const S = SS[0];
    const T = S.cparacion;
    var estados = 0, resp = true;
    const fech = moment(S.fechs).format('YYYY-MM-DD');
    const fech2 = moment(S.fech).format('YYYY-MM-DD HH:mm');
    const monto = S.bono && S.formap !== 'BONO' ? parseFloat(S.monto) + S.mount : parseFloat(S.monto);
    //console.log(S, monto)
    if (S.stado === 4 || S.stado === 6) {
        Eli(pdf)
        return false
    };

    if (S.concepto === 'ABONO') {
        const Ai = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id 
            WHERE c.separacion = ${T} AND c.tipo = 'INICIAL' AND c.estado = 3`);
        //console.log(Ai);
        if (Ai.length > 0) {
            var totalinicial = 0,
                cuotainicial = Ai[0].cuota;

            Ai.map((c, x) => {
                totalinicial += c.cuota;
            })
            if (monto >= totalinicial) {
                estados = 10
                await pool.query(
                    `UPDATE cuotas c 
                            INNER JOIN preventa p ON c.separacion = p.id 
                            INNER JOIN productosd l ON p.lote = l.id 
                            INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                            WHERE s.ids = ? AND c.tipo = 'INICIAL' AND c.estado = 3`,
                    [
                        {
                            's.stado': 4,
                            'c.estado': 13,
                            'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                            'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                            'l.estado': estados
                        }, Tid
                    ]
                );
                if (monto > totalinicial) {
                    const Af = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id 
                    WHERE c.separacion = ${T} AND c.tipo = 'FINANCIACION' AND c.estado = 3`)

                    var extraordinaria = Af[0].cuotaextraordinaria,
                        cuotafinanciada = 0,
                        excedenteinicial = Math.round(monto - totalinicial),
                        totalfinanceo = 0,
                        cuota = 0,
                        numerocuotas = 0;

                    Af.filter((c) => {
                        return c.cuota !== c.cuotaextraordinaria;
                    }).map((c, x) => {
                        totalfinanceo += c.cuota;
                        cuotafinanciada = c.cuota
                        numerocuotas = x + 1;
                    })
                    if (excedenteinicial >= totalfinanceo) {
                        await pool.query(
                            `UPDATE cuotas c 
                                    INNER JOIN preventa p ON c.separacion = p.id 
                                    INNER JOIN productosd l ON p.lote = l.id 
                                    INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                    WHERE s.ids = ? AND c.tipo = 'FINANCIACION' 
                                    AND c.cuota != ${extraordinaria} AND c.estado = 3`,
                            [
                                {
                                    's.stado': 4,
                                    'c.estado': 13,
                                    'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.estado': 13
                                }, Tid
                            ]
                        );
                        if (excedenteinicial > totalfinanceo) {
                            resp = 'El monto consignado es mayor al del valor total del producto, se genero un BONO'
                            var pin = ID(5),
                                motivo = `${fech} Excedente del pago total del producto`;
                            const bono = {
                                pin, descuento: 0, estado: 9, clients: S.idc, concept: 'EXCEDENTE',
                                tip: 'BONO', monto: excedenteinicial - totalfinanceo, motivo,
                            }
                            await pool.query('INSERT INTO cupones SET ? ', bono);

                            var nombr = S.nombre.split(" ")[0],
                                bodi = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(bono.monto)}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`;

                            EnviarWTSAP(S.movil, bodi);
                        };
                    } else {
                        cuota = cuotafinanciada - Math.round(excedenteinicial / numerocuotas);
                        await pool.query(
                            `UPDATE cuotas c 
                                INNER JOIN preventa p ON c.separacion = p.id 
                                INNER JOIN productosd l ON p.lote = l.id 
                                INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                WHERE s.ids = ? AND c.tipo = 'FINANCIACION' 
                                AND c.cuota != ${extraordinaria} AND c.estado = 3`,
                            [
                                {
                                    's.stado': 4,
                                    'c.cuota': cuota,
                                    'l.estado': estados
                                }, Tid
                            ]
                        );
                    }
                }
                await Desendentes(S.pin, estados);

            } else {
                //console.log('no alcanso para toda la inicial porque monto es menor que la cuota inicial, y paso por aqui')
                var cuota = cuotainicial - Math.round(monto / Ai.length)
                await pool.query(
                    `UPDATE cuotas c 
                            INNER JOIN preventa p ON c.separacion = p.id 
                            INNER JOIN productosd l ON p.lote = l.id 
                            INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                            WHERE s.ids = ?  AND c.tipo = 'INICIAL' AND c.estado = 3`,
                    [
                        {
                            's.stado': 4,
                            'c.cuota': cuota,
                            'l.estado': 12
                        }, Tid
                    ]
                );
            }

        } else {
            const Af = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id 
            WHERE c.separacion = ${T} AND c.estado = 3`)
            //console.log(Af, 'ESTA ES Af, no encontro en Ai ninguna cuota')
            if (Af.length > 0) {
                var extraordinaria = Af[0].cuotaextraordinaria,
                    cuotafinanciada = 0,
                    totalfinanceo = 0,
                    cuota = 0,
                    numerocuotas = 0;

                Af.filter((c) => {
                    return c.cuota !== c.cuotaextraordinaria;
                }).map((c, x) => {
                    totalfinanceo += c.cuota;
                    cuotafinanciada = c.cuota
                    numerocuotas = x + 1;
                })
                if (monto >= totalfinanceo) {
                    await pool.query(
                        `UPDATE cuotas c 
                                INNER JOIN preventa p ON c.separacion = p.id 
                                INNER JOIN productosd l ON p.lote = l.id 
                                INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                WHERE s.ids = ? AND c.estado = 3`,
                        [
                            {
                                's.stado': 4,
                                'c.estado': 13,
                                'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                'l.estado': 13
                            }, Tid
                        ]
                    );
                    if (monto > totalfinanceo) {

                        resp = 'El monto consignado es mayor al del valor total del producto, se genero un BONO'
                        var pin = ID(5),
                            motivo = `${fech} Excedente del pago total del producto`;
                        const bono = {
                            pin, descuento: 0, estado: 9, clients: S.idc, concept: 'EXCEDENTE',
                            tip: 'BONO', monto: monto - totalfinanceo, motivo,
                        }
                        await pool.query('INSERT INTO cupones SET ? ', bono);

                        var nombr = S.nombre.split(" ")[0],
                            bodi = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(bono.monto)}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`;

                        EnviarWTSAP(S.movil, bodi);

                    }
                } else {
                    //console.log(cuotafinanciada, Math.round(monto / numerocuotas))
                    var cuota = cuotafinanciada - Math.round(monto / numerocuotas);
                    await pool.query(
                        `UPDATE cuotas c 
                                INNER JOIN preventa p ON c.separacion = p.id 
                                INNER JOIN productosd l ON p.lote = l.id 
                                INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                WHERE s.ids = ? AND c.tipo = 'FINANCIACION' 
                                AND c.cuota != ${extraordinaria} AND c.estado = 3`,
                        [
                            {
                                's.stado': 4,
                                'c.cuota': cuota,
                                'l.estado': 10
                            }, Tid
                        ]
                    );
                }
            }
        }
    } else if (S.concepto === 'PAGO') {
        console.log('es un pago')
        var Total = parseFloat(S.cuota), texto = '';

        var Ps = async (Total, texto) => {
            var inicial = (S.valor - S.ahorro) * S.iniciar / 100

            if (S.tipo === 'SEPARACION' && S.incentivo) {
                //var retefuente = S.incentivo * 0.10
                //var reteica = S.incentivo * 8 / 1000
                console.log('es una separacion')
                var solicitar = {
                    fech: fech2, monto: S.incentivo, concepto: 'COMISION DIRECTA', stado: 9, descp: 'SEPARACION',
                    asesor: S.asesor, porciento: 0, total: S.cuota, lt: S.lote, retefuente: 0, reteica: 0, pagar: S.incentivo
                }
                await pool.query(`INSERT INTO solicitudes SET ?`, solicitar);
            }
            await pool.query(
                `UPDATE solicitudes s 
                        INNER JOIN cuotas c ON s.pago = c.id 
                        INNER JOIN preventa p ON c.separacion = p.id 
                        INNER JOIN productosd o ON p.lote = o.id SET ? WHERE s.ids = ?`,
                [
                    {
                        's.stado': 4,
                        'c.estado': 13,
                        'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                        'o.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                        'o.estado': 12
                    }, Tid
                ]
            );
            console.log('actualiza el pago')
            if (texto) {
                await pool.query(`UPDATE cuotas SET ? WHERE ${texto}`, { estado: 13 });
            }
            if (monto > Total) {
                console.log('monto es mayor al total')
                const d = await pool.query(`SELECT * FROM cuotas WHERE separacion = ? 
                    AND tipo = 'INICIAL' AND estado = 3 AND fechs > ?`, [T, fech]);

                if (d.length > 0) {
                    var iniciales = 0,
                        excedente = monto - Total,
                        valorcuota = d[0].cuota,
                        cuotas = 0;

                    d.map((c, x) => {
                        iniciales += c.cuota;
                    })
                    if (excedente >= iniciales) {
                        await pool.query(
                            `UPDATE cuotas c 
                                    INNER JOIN preventa p ON c.separacion = p.id 
                                    INNER JOIN productosd l ON p.lote = l.id 
                                    INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                    WHERE c.separacion = ? AND c.tipo = 'INICIAL' 
                                    AND c.estado = 3 AND fechs > ?`,
                            [
                                {
                                    's.stado': 4,
                                    'c.estado': 13,
                                    'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.estado': 10
                                }, T, fech
                            ]
                        );
                        const Af = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id 
                            WHERE c.separacion = ? AND c.tipo = 'FINANCIACION' AND c.estado = 3 AND c.fechs > ?`, [T, fech]);

                        if (Af.length > 0) {
                            var extraordinaria = Af[0].cuotaextraordinaria,
                                excedenteinicial = Math.round(excedente - iniciales),
                                cuotafinanciada = 0,
                                totalfinanceo = 0,
                                cuota = 0,
                                numerocuotas = 0;

                            Af.filter((c) => {
                                return c.cuota !== c.cuotaextraordinaria;
                            }).map((c, x) => {
                                totalfinanceo += c.cuota;
                                cuotafinanciada = c.cuota
                                numerocuotas = x + 1;
                            })
                            if (excedenteinicial >= totalfinanceo) {
                                await pool.query(
                                    `UPDATE cuotas c 
                                            INNER JOIN preventa p ON c.separacion = p.id 
                                            INNER JOIN productosd l ON p.lote = l.id 
                                            INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                            WHERE c.separacion = ? AND c.estado = 3 AND fechs > ?`,
                                    [
                                        {
                                            's.stado': 4,
                                            'c.estado': 13,
                                            'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                            'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                            'l.estado': 13
                                        }, T, fech
                                    ]
                                );
                                if (excedenteinicial > totalfinanceo) {
                                    resp = 'El monto consignado es mayor al del valor total del producto, se genero un BONO'
                                    var pin = ID(5),
                                        motivo = `${fech} Excedente del pago total del producto`;
                                    const bono = {
                                        pin, descuento: 0, estado: 9, clients: S.idc, concept: 'EXCEDENTE',
                                        tip: 'BONO', monto: excedente - totalfinanceo, motivo,
                                    }
                                    await pool.query('INSERT INTO cupones SET ? ', bono);

                                    var nombr = S.nombre.split(" ")[0],
                                        bodi = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(bono.monto)}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`;

                                    EnviarWTSAP(S.movil, bodi);
                                }
                            } else {
                                cuota = cuotafinanciada - Math.round(excedenteinicial / numerocuotas);
                                await pool.query(`UPDATE cuotas SET ? WHERE separacion = ? AND tipo = 'FINANCIACION' 
                                    AND estado = 3 AND cuota != ? AND fechs > ?`, [{ cuota }, T, extraordinaria, fech]);
                            }
                        } else {
                            resp = 'No existen cuotas a la cual abonarle saldo, verifica'
                            var pin = ID(5),
                                motivo = `${fech} Excedente del pago total del producto`;
                            const bono = {
                                pin, descuento: 0, estado: 9, clients: S.idc, concept: 'EXCEDENTE',
                                tip: 'BONO', monto: excedente - totalfinanceo, motivo,
                            }
                            await pool.query('INSERT INTO cupones SET ? ', bono);

                            var nombr = S.nombre.split(" ")[0],
                                bodi = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(bono.monto)}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`;

                            EnviarWTSAP(S.movil, bodi);
                        }
                    } else if (excedente === iniciales) {
                        estados = 10
                        await pool.query(`UPDATE cuotas SET ? WHERE separacion = ${T} AND tipo = 'INICIAL' 
                            AND estado = 3 AND fechs > '${fech}'`, { estado: 13, fechapago: fech2 });
                    } else {
                        estados = 12
                        cuotas = valorcuota - Math.round(excedente / d.length)
                        await pool.query(`UPDATE cuotas SET ? WHERE separacion = ? AND tipo = 'INICIAL' AND estado = 3 AND fechs > ?`, [{ cuota: cuotas }, T, fech]);
                    }
                } else {
                    const Af = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id
                        WHERE separacion = ? AND tipo = 'FINANCIACION' AND estado = 3 AND fechs > ?`, [T, fech]);

                    var extraordinaria = Af[0].cuotaextraordinaria,
                        excedenteinicial = Math.round(monto - Total),
                        cuotafinanciada = 0,
                        totalfinanceo = 0,
                        cuota = 0,
                        numerocuotas = 0;

                    Af.filter((c) => {
                        return c.cuota !== c.cuotaextraordinaria;
                    }).map((c, x) => {
                        totalfinanceo += c.cuota;
                        cuotafinanciada = c.cuota
                        numerocuotas = x + 1;
                    });

                    if (excedenteinicial >= totalfinanceo) {
                        await pool.query(
                            `UPDATE cuotas c 
                                    INNER JOIN preventa p ON c.separacion = p.id 
                                    INNER JOIN productosd l ON p.lote = l.id 
                                    INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                    WHERE c.separacion = ? AND c.estado = 3 AND fechs > ?`,
                            [
                                {
                                    's.stado': 4,
                                    'c.estado': 13,
                                    'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.estado': 13
                                }, T, fech
                            ]
                        );
                        if (excedenteinicial > totalfinanceo) {
                            resp = 'El monto consignado es mayor al del valor total del producto, se genero un BONO'
                            var pin = ID(5),
                                motivo = `${fech} Excedente del pago total del producto`;
                            const bono = {
                                pin, descuento: 0, estado: 9, clients: S.idc, concept: 'EXCEDENTE',
                                tip: 'BONO', monto: excedente - totalfinanceo, motivo,
                            }
                            await pool.query('INSERT INTO cupones SET ? ', bono);

                            var nombr = S.nombre.split(" ")[0],
                                bodi = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(bono.monto)}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`;

                            EnviarWTSAP(S.movil, bodi);
                        }
                    } else {
                        cuota = cuotafinanciada - Math.round(excedenteinicial / numerocuotas)
                        //console.log(cuota, cuotaextraordinaria)
                        await pool.query(`UPDATE cuotas SET ? WHERE separacion = ? AND tipo = 'FINANCIACION' 
                            AND estado = 3 AND cuota != ? AND fechs > ?`, [{ cuota }, T, cuotaextraordinaria, fech]);
                    }
                }
            }
        }
        const Totales = await pool.query(`SELECT * FROM cuotas WHERE separacion = ${T} AND (estado = 3 OR estado = 5) AND fechs < '${fech}'`);
        if (Totales.length > 0 && monto > S.cuota && S.facturasvenc > 1) {
            pas.map((c, x) => {
                Total += c.cuota + c.mora;
                texto += x === 0 ? `id = ${c.id}` : ` AND id = ${c.id}`;
            });
            Ps(Total, texto);
        } else {
            Ps(Total, texto);
        }
    }
    await pool.query('UPDATE solicitudes SET ? WHERE ids = ?', [{ pdf }, Tid]);
    Desendentes(S.pin, estados)

    var bod = `_*${S.nombre}*. Hemos procesado tu *${S.concepto}* de manera exitoza. Recibo *${S.recibo}* Monto *${Moneda(monto)}* Adjuntamos recibo de pago *#${Tid}*_\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
    var smsj = `hemos procesado tu pago de manera exitoza Recibo: ${S.recibo} Bono ${S.bono} Monto: ${Moneda(monto)} Concepto: ${S.proyect} MZ ${S.mz} LOTE ${S.n}`

    await EnviarWTSAP(S.movil, bod);
    await EnvWTSAP_FILE(S.movil, pdf, 'RECIBO DE CAJA ' + Tid, 'PAGO EXITOSO');
    return true
}
var normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
        to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNnCc",
        mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
        mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
        var ret = [];
        for (var i = 0, j = str.length; i < j; i++) {
            var c = str.charAt(i);
            if (mapping.hasOwnProperty(str.charAt(i)))
                ret.push(mapping[c]);
            else
                ret.push(c);
        }
        return ret.join('');
    }

})();
async function Desendentes(pin, stados) {

    if (stados != 10) {
        return false
    }
    let linea = '', lDesc = '';
    var hoy = moment().format('YYYY-MM-DD')
    var month = moment().subtract(3, 'month').format('YYYY-MM-DD')
    var venta = 0, bono = 0, bonop = 0, personal = 0

    const asesor = await pool.query(`SELECT * FROM pines p INNER JOIN users u ON p.acreedor = u.id 
    INNER JOIN rangos r ON u.nrango = r.id WHERE p.id = ? LIMIT 1`, pin);

    var j = asesor[0]
    const directas = await pool.query(`SELECT * FROM preventa p 
    INNER JOIN productosd l ON p.lote = l.id
    INNER JOIN productos o ON l.producto = o.id
    INNER JOIN users u ON p.asesor = u.id
    INNER JOIN clientes c ON p.cliente = c.idc
    WHERE p.asesor = ? AND l.estado = 10 AND l.fechar BETWEEN '${month}' and '${hoy}'`, j.acreedor);

    if (directas.length > 0) {
        await directas.map(async (a, x) => {
            var val = a.valor - a.ahorro
            var monto = val * j.comision
            var retefuente = monto * 0.10
            var reteica = monto * 8 / 1000
            personal += val
            if (a.directa === null) {
                bonop += val
                var f = {
                    fech: hoy, monto, concepto: 'COMISION DIRECTA', stado: 9, descp: 'VENTA DIRECTA',
                    asesor: j.acreedor, porciento: j.comision, total: val, lt: a.lote, retefuente,
                    reteica, pagar: monto - (retefuente + reteica)
                }
                await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ directa: j.acreedor }, a.lote]);
                await pool.query(`INSERT INTO solicitudes SET ?`, f);
            }
        })
    }

    const lineaUno = await pool.query(`SELECT * FROM pines WHERE usuario = ? AND usuario IS NOT NULL`, j.acreedor);

    if (lineaUno.length > 0) {
        await lineaUno.map((p, x) => {
            lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
            linea += x === 0 ? `usuario = ${p.acreedor}` : ` OR usuario = ${p.acreedor}`
        });

        const reporte = await pool.query(`SELECT * FROM preventa p 
    INNER JOIN productosd l ON p.lote = l.id
    INNER JOIN productos o ON l.producto = o.id
    INNER JOIN users u ON p.asesor = u.id
    INNER JOIN clientes c ON p.cliente = c.idc
    WHERE (${lDesc}) AND l.estado = 10 AND l.fechar BETWEEN '${month}' and '${hoy}'`);

        if (reporte.length > 0) {
            await reporte.map(async (a, x) => {
                var val = a.valor - a.ahorro
                var monto = val * j.nivel1
                var retefuente = monto * 0.10
                var reteica = monto * 8 / 1000
                venta += val
                if (a.uno === null) {
                    bono += val
                    var f = {
                        fech: hoy, monto, concepto: 'COMISION INDIRECTA', stado: 9, descp: 'PRIMERA LINEA',
                        asesor: j.acreedor, porciento: j.nivel1, total: val, lt: a.lote, retefuente,
                        reteica, pagar: monto - (retefuente + reteica)
                    }
                    await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ uno: j.acreedor }, a.lote]);
                    await pool.query(`INSERT INTO solicitudes SET ?`, f);
                }
            })
        }

        const lineaDos = await pool.query(`SELECT * FROM pines WHERE ${linea}`);
        lDesc = '', linea = '';
        await lineaDos.map((p, x) => {
            lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
            linea += x === 0 ? `usuario = ${p.acreedor}` : ` OR usuario = ${p.acreedor}`
        });

        const reporte2 = await pool.query(`SELECT * FROM preventa p 
    INNER JOIN productosd l ON p.lote = l.id
    INNER JOIN productos o ON l.producto = o.id
    INNER JOIN users u ON p.asesor = u.id
    INNER JOIN clientes c ON p.cliente = c.idc
    WHERE (${lDesc}) AND l.estado = 10 AND l.fechar BETWEEN '${month}' and '${hoy}'`);

        if (reporte2.length > 0) {
            await reporte2.map(async (a, x) => {
                var val = a.valor - a.ahorro
                var monto = val * j.nivel2
                var retefuente = monto * 0.10
                var reteica = monto * 8 / 1000
                venta += val
                if (a.dos === null) {
                    bono += val
                    var f = {
                        fech: hoy, monto, concepto: 'COMISION INDIRECTA', stado: 9, descp: 'SEGUNDA LINEA',
                        asesor: j.acreedor, porciento: j.nivel2, total: val, lt: a.lote, retefuente,
                        reteica, pagar: monto - (retefuente + reteica)
                    }
                    await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ dos: j.acreedor }, a.lote]);
                    await pool.query(`INSERT INTO solicitudes SET ?`, f);
                }
            })
        }

        const lineaTres = await pool.query(`SELECT * FROM pines WHERE ${linea}`);
        lDesc = '', linea = '';
        await lineaTres.map((p, x) => {
            lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
        });
        const reporte3 = await pool.query(`SELECT * FROM preventa p 
    INNER JOIN productosd l ON p.lote = l.id
    INNER JOIN productos o ON l.producto = o.id
    INNER JOIN users u ON p.asesor = u.id
    INNER JOIN clientes c ON p.cliente = c.idc
    WHERE (${lDesc}) AND l.estado = 10 AND l.fechar BETWEEN '${month}' and '${hoy}'`);

        if (reporte3.length > 0) {
            await reporte3.map(async (a, x) => {
                var val = a.valor - a.ahorro
                var monto = val * j.nivel3
                var retefuente = monto * 0.10
                var reteica = monto * 8 / 1000
                venta += val
                if (a.tres === null) {
                    bono += val
                    var f = {
                        fech: hoy, monto, concepto: 'COMISION INDIRECTA', stado: 9, descp: 'TERCERA LINEA',
                        asesor: j.acreedor, porciento: j.nivel3, total: val, lt: a.lote, retefuente,
                        reteica, pagar: monto - (retefuente + reteica)
                    }
                    await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ tres: j.acreedor }, a.lote]);
                    await pool.query(`INSERT INTO solicitudes SET ?`, f);
                }
            })
        }
    }
    var rango = j.nrango;
    var tot = venta + personal
    if (personal >= j.venta && tot >= j.ventas) {
        if (tot >= 500000000 && tot < 1000000000) {
            var retefuente = j.premio * 0.10
            var reteica = j.premio * 8 / 1000
            var f = {
                fech: hoy, monto: j.premio, concepto: 'PREMIACION', stado: 9,
                descp: 'ASENSO A DIRECTOR', asesor: j.acreedor, total: tot, retefuente,
                reteica, pagar: j.premio - (retefuente + reteica)
            }
            await pool.query(`INSERT INTO solicitudes SET ?`, f);
            await pool.query(`UPDATE users SET ? WHERE id = ?`, [{ nrango: 4 }, j.acreedor]);
            rango = 4

        } else if (tot >= 1000000000 && tot < 2000000000) {
            var retefuente = j.premio * 0.10
            var reteica = j.premio * 8 / 1000
            var f = {
                fech: hoy, monto: j.premio, concepto: 'PREMIACION', stado: 9,
                descp: 'ASENSO A GERENTE', asesor: j.acreedor, total: tot, retefuente,
                reteica, pagar: j.premio - (retefuente + reteica)
            }
            await pool.query(`INSERT INTO solicitudes SET ?`, f);
            await pool.query(`UPDATE users SET ? WHERE id = ?`, [{ nrango: 3 }, j.acreedor]);
            rango = 3

        } else if (tot >= 2000000000 && tot < 3000000000) {
            var retefuente = j.premio * 0.10
            var reteica = j.premio * 8 / 1000
            var f = {
                fech: hoy, monto: j.premio, concepto: 'PREMIACION', stado: 9,
                descp: 'ASENSO A VICEPRESIDENTE', asesor: j.acreedor, total: tot, retefuente,
                reteica, pagar: j.premio - (retefuente + reteica)
            }
            await pool.query(`INSERT INTO solicitudes SET ?`, f);
            await pool.query(`UPDATE users SET ? WHERE id = ?`, [{ nrango: 2 }, j.acreedor]);
            rango = 2

        } else if (tot >= 300000000) {
            var retefuente = j.premio * 0.10
            var reteica = j.premio * 8 / 1000
            var f = {
                fech: hoy, monto: j.premio, concepto: 'PREMIACION', stado: 9,
                descp: 'ASENSO A PRESIDENTE', asesor: j.acreedor, total: tot, retefuente,
                reteica, pagar: j.premio - (retefuente + reteica)
            }
            await pool.query(`INSERT INTO solicitudes SET ?`, f);
            await pool.query(`UPDATE users SET ? WHERE id = ?`, [{ nrango: 1 }, j.acreedor]);
            rango = 1
        }
    }
    var bonus = j.bono
    if (rango !== j.nrango) {
        const ucr = await pool.query(`SELECT * FROM users WHERE id = ?`, j.acreedor);
        rango = ucr[0].nrango
        bonus = ucr[0].bono
    }

    if (rango === 5) {
        await pool.query(`DELETE FROM solicitudes WHERE concepto = 'COMISION INDIRECTA' AND asesor = ?`, j.acreedor);

    } else if (rango === 3) {
        var monto = bonop * bonus
        var retefuente = monto * 0.10
        var reteica = monto * 8 / 1000
        var f = {
            fech: hoy, monto, concepto: 'BONO', stado: 9, porciento: bonus,
            descp: 'BONO GERENCIAL', asesor: j.acreedor, total: bonop, retefuente,
            reteica, pagar: monto - (retefuente + reteica)
        }
        await pool.query(`INSERT INTO solicitudes SET ?`, f);

    } else if (rango === 2 || rango === 1) {
        var monto = (bonop + bono) * bonus
        var retefuente = monto * 0.10
        var reteica = monto * 8 / 1000
        var f = {
            fech: hoy, monto, concepto: 'BONO', stado: 9, porciento: bonus,
            descp: 'BONO PRESIDENCIAL', asesor: j.acreedor, total: bonop + bono, retefuente,
            reteica, pagar: monto - (retefuente + reteica)
        }
        await pool.query(`INSERT INTO solicitudes SET ?`, f);
    }
    return true
};
async function Eli(img) {
    fs.exists(img, function (exists) {
        if (exists) {
            fs.unlink(img, function (err) {
                if (err) throw err;
                console.log('Archivo eliminado');
                return 'Archivo eliminado';
            });
        } else {
            console.log('El archivo no exise');
            return 'El archivo no exise';
        }
    });
}
function Moneda(valor) {
    valor = valor.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
    valor = valor.split('').reverse().join('').replace(/^[\.]/, '');
    return valor;
}
function EnviarWTSAP(movil, body, smsj) {
    var cel = movil.indexOf("-") > 0 ? '57' + movil.replace(/-/g, "") : movil.indexOf(" ") > 0 ? movil : '57' + movil;
    var options = {
        method: 'POST',
        url: 'https://eu89.chat-api.com/instance107218/sendMessage?token=5jn3c5dxvcj27fm0',
        form: {
            phone: cel,
            body
        }
    };
    request(options, function (error, response, body) {
        if (error) return console.error('Failed: %s', error.message);
        console.log('Success: ', body);
    });
    smsj ? sms(cel, smsj) : '';
}
function EnvWTSAP_FILE(movil, body, filename, caption) {
    var cel = movil.indexOf("-") > 0 ? '57' + movil.replace(/-/g, "") : movil.indexOf(" ") > 0 ? movil : '57' + movil;
    var options = {
        method: 'POST',
        url: 'https://eu89.chat-api.com/instance107218/sendFile?token=5jn3c5dxvcj27fm0',
        form: {
            phone: cel,
            body,           //`https://grupoelitered.com.co/uploads/0erdlw-york61mn26n46v141lap-gvk-ro.pdf`,
            filename,
            caption
        }
    };
    request(options, function (error, response, body) {
        if (error) return console.error('Failed: %s', error.message);
        console.log('Success: ', body);
    });
}
/*const SCOPES = ['https://www.googleapis.com/auth/contacts'];
const TOKEN_PATH = 'token.json';
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), listConnectionNames);
});*/
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = Contactos;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris);

    // Comprueba si previamente hemos almacenado un token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Autorice esta aplicación visitando esta url: ', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Ingrese el código de esa página aquí: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Almacenar el token en el disco para posteriores ejecuciones del programa
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token almacenado en', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}
function listConnectionNames(auth) {
    const service = google.people({ version: 'v1', auth });
    service.people.connections.list({
        resourceName: 'people/me',
        pageSize: 100,
        personFields: 'biographies,birthdays,coverPhotos,emailAddresses,events,genders,imClients,interests,locales,memberships,metadata,names,nicknames,occupations,organizations,phoneNumbers,photos,relations,residences,sipAddresses,skills,urls,userDefined'
    }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        const connections = res.data.connections;
        if (connections) {
            console.log('Connections:');
            connections.forEach((person) => {
                if (person.names && person.names.length > 0) {
                    console.log(person.names);
                } else {
                    console.log('No display name found for connection.');
                }
            });
        } else {
            console.log('No connections found.');
        }
    });
}
//////////////* CIFRAS EN LETRAS *///////////////////
function Unidades(num) {

    switch (num) {
        case 1:
            return "UN";
        case 2:
            return "DOS";
        case 3:
            return "TRES";
        case 4:
            return "CUATRO";
        case 5:
            return "CINCO";
        case 6:
            return "SEIS";
        case 7:
            return "SIETE";
        case 8:
            return "OCHO";
        case 9:
            return "NUEVE";
    }

    return "";
} //Unidades()
function Decenas(num) {

    decena = Math.floor(num / 10);
    unidad = num - (decena * 10);

    switch (decena) {
        case 1:
            switch (unidad) {
                case 0:
                    return "DIEZ";
                case 1:
                    return "ONCE";
                case 2:
                    return "DOCE";
                case 3:
                    return "TRECE";
                case 4:
                    return "CATORCE";
                case 5:
                    return "QUINCE";
                default:
                    return "DIECI" + Unidades(unidad);
            }
        case 2:
            switch (unidad) {
                case 0:
                    return "VEINTE";
                default:
                    return "VEINTI" + Unidades(unidad);
            }
        case 3:
            return DecenasY("TREINTA", unidad);
        case 4:
            return DecenasY("CUARENTA", unidad);
        case 5:
            return DecenasY("CINCUENTA", unidad);
        case 6:
            return DecenasY("SESENTA", unidad);
        case 7:
            return DecenasY("SETENTA", unidad);
        case 8:
            return DecenasY("OCHENTA", unidad);
        case 9:
            return DecenasY("NOVENTA", unidad);
        case 0:
            return Unidades(unidad);
    }
} //Decenas()
function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
        return strSin + " Y " + Unidades(numUnidades)

    return strSin;
} //DecenasY()
function Centenas(num) {

    centenas = Math.floor(num / 100);
    decenas = num - (centenas * 100);

    switch (centenas) {
        case 1:
            if (decenas > 0)
                return "CIENTO " + Decenas(decenas);
            return "CIEN";
        case 2:
            return "DOSCIENTOS " + Decenas(decenas);
        case 3:
            return "TRESCIENTOS " + Decenas(decenas);
        case 4:
            return "CUATROCIENTOS " + Decenas(decenas);
        case 5:
            return "QUINIENTOS " + Decenas(decenas);
        case 6:
            return "SEISCIENTOS " + Decenas(decenas);
        case 7:
            return "SETECIENTOS " + Decenas(decenas);
        case 8:
            return "OCHOCIENTOS " + Decenas(decenas);
        case 9:
            return "NOVECIENTOS " + Decenas(decenas);
    }

    return Decenas(decenas);
} //Centenas()
function Seccion(num, divisor, strSingular, strPlural) {
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    letras = "";

    if (cientos > 0)
        if (cientos > 1)
            letras = Centenas(cientos) + " " + strPlural;
        else
            letras = strSingular;

    if (resto > 0)
        letras += "";

    return letras;
} //Seccion()
function Miles(num) {
    divisor = 1000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMiles = Seccion(num, divisor, "MIL", "MIL");
    strCentenas = Centenas(resto);

    if (strMiles == "")
        return strCentenas;

    return strMiles + " " + strCentenas;

    //return Seccion(num, divisor, "UN MIL", "MIL") + " " + Centenas(resto);
} //Miles()
function Millones(num) {
    divisor = 1000000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMillones = Seccion(num, divisor, "UN MILLON", "MILLONES");
    strMiles = Miles(resto);

    if (strMillones == "") return strMiles;

    return strMillones + " " + strMiles;

    //return Seccion(num, divisor, "UN MILLON", "MILLONES") + " " + Miles(resto);
} //Millones()
function NumeroALetras(num, centavos) {
    var data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: "",
    };
    if (centavos == undefined || centavos == false) {
        data.letrasMonedaPlural = "PESOS";
        data.letrasMonedaSingular = "PESO";
    } else {
        data.letrasMonedaPlural = "CENTAVOS";
        data.letrasMonedaSingular = "CENTAVO";
    }

    if (data.centavos > 0)
        data.letrasCentavos = "CON " + NumeroALetras(data.centavos, true);

    if (data.enteros == 0)
        return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1) {
        res = Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
        if (res.indexOf('UN MILLON  PESO') > 0) return res.replace('UN MILLON  PESO', 'UN MILLON DE PESO');
        return res;
    } else {
        res = Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
        if (res.indexOf('MILLONES  PESOS') > 0) return res.replace('MILLONES  PESOS', 'MILLONES DE PESOS');
        return res;
    }
} //NumeroALetras()
//////////////* CIFRAS EN LETRAS END *///////////////////

module.exports = NumeroALetras;