const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const qrcode = require("qrcode");
const database = require("./model/database");
const port = process.env.port || 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/gerador", (req, res) => {
    res.render("gerador");
});

app.get("/registrar", (req, res) => {
    res.render("FormRegistrar");
})

app.get("/entrada_ciencias", (req, res) => {
    res.render("ciencias_entrada");
});

app.get("/saida_ciencias", (req, res) => {
    res.render("ciencias_saida");
});

app.get("/entrada_saude", (req, res) => {
    res.render("saude_entrada");
});

app.get("/saida_saude", (req, res) => {
    res.render("saude_saida");
});

app.get("/registros_ciencias", (req, res) => {
    database.query("SELECT * FROM ciencias_sociais", (erro, resultado) => {
        if (erro) {
            res.render("erro");
        } else {
            res.render("registros_ciencia", {registros: resultado});
        }
    });
});

app.get("/registros_saude", (req, res) => {
    database.query("SELECT * FROM saude", (erro, resultado) => {
        if (erro) {
            res.render("erro");
        } else {
            res.render("registros_saude", {registros: resultado});
        }
    });
});

app.get("/crachac/:ra", (req, res) => {
    database.query("SELECT * FROM ciencias_sociais WHERE ra = ?", [req.params.ra], (erro, resultado) => {
        if (erro) {
            res.render("erro");
        } else {
            const aluno = resultado[0];
            /* ------------- */
            console.log(aluno);
            /* ------------- */
            const nomeAluno = aluno.aluno;
            const cursoAluno = aluno.curso;
            const raAluno = aluno.ra;
            const NewQRCode = {
                code: (`${raAluno}`)
            }

            var opts = {
                errorCorrectionLevel: 'M',
                type: 'image/jpeg',
                quality: 0.5,
                margin: .5,
                color: {
                    dark:"#000",
                    light:"#fff"
                }
            }

            qrcode.toDataURL(NewQRCode.code, opts, (erro, dados) => {
                const dataCode = dados;
                res.render("cracha_ciencia", {code: dataCode, aluno: aluno})
            });
        }
    });
});

app.get("/crachas/:ra", (req, res) => {
    database.query("SELECT * FROM saude WHERE ra = ?", [req.params.ra], (erro, resultado) => {
        if (erro) {
            res.render("erro");
        } else {
            const aluno = resultado[0];
            /* ------------- */
            console.log(aluno);
            /* ------------- */
            const nomeAluno = aluno.aluno;
            const cursoAluno = aluno.curso;
            const raAluno = aluno.ra;
            const NewQRCode = {
                code: (`${raAluno}`)
            }


            var opts = {
                errorCorrectionLevel: 'M',
                type: 'image/jpeg',
                quality: 0.5,
                margin: .5,
                color: {
                    dark:"#000",
                    light:"#fff"
                }
            }

            qrcode.toDataURL(NewQRCode.code, opts, (erro, dados) => {
                const dataCode = dados;
                res.render("cracha_saude", {code: dataCode, aluno: aluno})
            });
        }
    });
});

app.get("/entrada_ciencia/:decodificacao", (req, res) => {
    const registro = req.params.decodificacao;
    console.log(registro);

    const dataSistema = new Date();
    const dia = dataSistema.getDate().toString();
    const horaAtual = dataSistema.getHours().toString();
    const minutoAtual = dataSistema.getMinutes().toString();
    const horaMinuto = horaAtual + ":" + minutoAtual;
    console.log(dia);
    console.log(horaMinuto);
    
    database.query("INSERT INTO presenca_ciencias (nome, curso, ra) (SELECT aluno, curso, ra FROM ciencias_sociais WHERE ra = ?)", [registro], (erro, resultado) => {
        if (erro) {
            res.render("erro");
        } else {
            console.log(resultado);
            if (resultado.message == "&Records: 0  Duplicates: 0  Warnings: 0") {
                database.query("INSERT INTO presenca_ciencias (nome, curso, ra) (SELECT aluno, curso, ra FROM saude WHERE ra = ?)", [registro], (erro, resultado) => {
                    if (erro) {
                        res.render("erro");
                    } else {
                        console.log(resultado);
                        database.query("UPDATE presenca_ciencias SET dia = ?, entrada = ? WHERE ra = ?", [dia, horaMinuto, registro], (erro, resultado) => {
                            if (erro) {
                                res.render("erro");
                            }
                        });
                    }
                });
            }
            res.render("resultciencia");
        }
    });
    database.query("UPDATE presenca_ciencias SET dia = ?, entrada = ? WHERE ra = ?", [dia, horaMinuto, registro], (erro, resultado) => {
        if (erro) {
            res.render("erro");
        }
    });
});

app.get("/entrada_saude/:decodificacao", (req, res) => {
    registro = req.params.decodificacao;
    console.log(registro);

    dataSistema = new Date();
    dia = dataSistema.getDate().toString();
    horaAtual = dataSistema.getHours().toString();
    minutoAtual = dataSistema.getMinutes().toString();
    horaMinuto = horaAtual + ":" + minutoAtual;
    console.log(dia);
    console.log(horaMinuto);
    
    database.query("INSERT INTO presenca_saude (nome, curso, ra) (SELECT aluno, curso, ra FROM saude WHERE ra = ?)", [registro], (erro, resultado) => {
        if (erro) {
            res.render("erro");
        } else {
            console.log(resultado);
            if (resultado.message == "&Records: 0  Duplicates: 0  Warnings: 0") {
                database.query("INSERT INTO presenca_saude (nome, curso, ra) (SELECT aluno, curso, ra FROM ciencias_sociais WHERE ra = ?)", [registro], (erro, resultado) => {
                    if (erro) {
                        res.render("erro");
                    } else {
                        console.log(resultado);
                        database.query("UPDATE presenca_saude SET dia = ?, entrada = ? WHERE ra = ?", [dia, horaMinuto, registro], (erro, resultado) => {
                            if (erro) {
                                res.render("erro");
                            }
                        });
                    }
                });
            }
            res.render("resultsaude");
        }
    });
    database.query("UPDATE presenca_saude SET dia = ?, entrada = ? WHERE ra = ?", [dia, horaMinuto, registro], (erro, resultado) => {
        if (erro) {
            res.render("erro");
        }
    });
});

app.get("/saida_ciencia/:decodificacao", (req, res) => {
    registro = req.params.decodificacao;
    console.log(registro);
    dataSistema = new Date();
    horaAtual = dataSistema.getHours().toString();
    minutoAtual = dataSistema.getMinutes().toString();
    horaMinuto = horaAtual + ":" + minutoAtual;

    database.query("UPDATE presenca_ciencias SET saida = ? WHERE ra = ?", [horaMinuto, registro], (erro, resultado) => {
        if (erro) {
            res.render("erro");
        } else {
            res.render("resultciencia");
        }
    });
});

app.get("/saida_saude/:decodificacao", (req, res) => {
    registro = req.params.decodificacao;
    console.log(registro);
    dataSistema = new Date();
    horaAtual = dataSistema.getHours().toString();
    minutoAtual = dataSistema.getMinutes().toString();
    horaMinuto = horaAtual + ":" + minutoAtual;

    database.query("UPDATE presenca_saude SET saida = ? WHERE ra = ?", [horaMinuto, registro], (erro, resultado) => {
        if (erro) {
            res.render("erro");
        } else {
            res.render("resultsaude");
        }
    });
});

app.listen(port, () => {
    console.log("Servidor em execução...");
});
