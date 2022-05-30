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

app.get("/", (requisicao, resposta) => {
    resposta.render("index");
});

app.get("/gerador", (requisicao, resposta) => {
    resposta.render("gerador");
});

app.get("/alerta", (requisicao, resposta) => {
    resposta.render("mensagem");
});

app.get("/pergunta", (requisicao, resposta) => {
    resposta.render("pergunta");
});

app.get("/entrada_ciencias", (requisicao, resposta) => {
    resposta.render("ciencias_entrada");
});

app.get("/saida_ciencias", (requisicao, resposta) => {
    resposta.render("ciencias_saida");
});

app.get("/entrada_saude", (requisicao, resposta) => {
    resposta.render("saude_entrada");
});

app.get("/saida_saude", (requisicao, resposta) => {
    resposta.render("saude_saida");
});

app.post("/registros_ciencias", (requisicao, resposta) => {
    database.query("SELECT * FROM ciencias_sociais", (erro, resultado) => {
        if (erro) {
            resposta.render("erro");
        } else {
            resposta.render("registros_ciencia", {registros: resultado});
        }
    });
});

app.post("/registros_saude", (requisicao, resposta) => {
    database.query("SELECT * FROM saude", (erro, resultado) => {
        if (erro) {
            resposta.render("erro");
        } else {
            resposta.render("registros_saude", {registros: resultado});
        }
    });
});

app.get("/crachac/:ra", (requisicao, resposta) => {
    database.query("SELECT * FROM ciencias_sociais WHERE ra = ?", [requisicao.params.ra], (erro, resultado) => {
        if (erro) {
            resposta.render("erro");
        } else {
            const aluno = resultado[0];
            const nomeAluno = aluno.aluno;
            const cursoAluno = aluno.curso;
            const raAluno = aluno.ra;
            const NewQRCode = {
                code: (`${raAluno}`)
            }

            qrcode.toDataURL(NewQRCode.code, (erro, dados) => {
                const dataCode = dados;
                resposta.render("cracha_ciencia", {code: dataCode, aluno: aluno})
            });
        }
    });
});

app.get("/crachas/:ra", (requisicao, resposta) => {
    database.query("SELECT * FROM saude WHERE ra = ?", [requisicao.params.ra], (erro, resultado) => {
        if (erro) {
            resposta.render("erro");
        } else {
            const aluno = resultado[0];
            const nomeAluno = aluno.aluno;
            const cursoAluno = aluno.curso;
            const raAluno = aluno.ra;
            const NewQRCode = {
                code: (`${raAluno}`)
            }

            qrcode.toDataURL(NewQRCode.code, (erro, dados) => {
                const dataCode = dados;
                resposta.render("cracha_saude", {code: dataCode, aluno: aluno})
            });
        }
    });
});

app.get("/entrada_ciencia/:decodificacao", (requisicao, resposta) => {
    const registro = requisicao.params.decodificacao;
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
            resposta.render("erro");
        } else {
            console.log(resultado);
            if (resultado.message == "&Records: 0  Duplicates: 0  Warnings: 0") {
                database.query("INSERT INTO presenca_ciencias (nome, curso, ra) (SELECT aluno, curso, ra FROM saude WHERE ra = ?)", [registro], (erro, resultado) => {
                    if (erro) {
                        resposta.render("erro");
                    } else {
                        console.log(resultado);
                        database.query("UPDATE presenca_ciencias SET dia = ?, entrada = ? WHERE ra = ?", [dia, horaMinuto, registro], (erro, resultado) => {
                            if (erro) {
                                resposta.render("erro");
                            }
                        });
                    }
                });
            }
            resposta.render("result_eciencia");
        }
    });
    database.query("UPDATE presenca_ciencias SET dia = ?, entrada = ? WHERE ra = ?", [dia, horaMinuto, registro], (erro, resultado) => {
        if (erro) {
            resposta.render("erro");
        }
    });
});

app.get("/entrada_saude/:decodificacao", (requisicao, resposta) => {
    registro = requisicao.params.decodificacao;
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
            resposta.render("erro");
        } else {
            console.log(resultado);
            if (resultado.message == "&Records: 0  Duplicates: 0  Warnings: 0") {
                database.query("INSERT INTO presenca_saude (nome, curso, ra) (SELECT aluno, curso, ra FROM ciencias_sociais WHERE ra = ?)", [registro], (erro, resultado) => {
                    if (erro) {
                        resposta.render("erro");
                    } else {
                        console.log(resultado);
                        database.query("UPDATE presenca_saude SET dia = ?, entrada = ? WHERE ra = ?", [dia, horaMinuto, registro], (erro, resultado) => {
                            if (erro) {
                                resposta.render("erro");
                            }
                        });
                    }
                });
            }
            resposta.render("result_esaude");
        }
    });
    database.query("UPDATE presenca_saude SET dia = ?, entrada = ? WHERE ra = ?", [dia, horaMinuto, registro], (erro, resultado) => {
        if (erro) {
            resposta.render("erro");
        }
    });
});

app.get("/saida_ciencia/:decodificacao", (requisicao, resposta) => {
    registro = requisicao.params.decodificacao;
    console.log(registro);
    dataSistema = new Date();
    horaAtual = dataSistema.getHours().toString();
    minutoAtual = dataSistema.getMinutes().toString();
    horaMinuto = horaAtual + ":" + minutoAtual;

    database.query("UPDATE presenca_ciencias SET saida = ? WHERE ra = ?", [horaMinuto, registro], (erro, resultado) => {
        if (erro) {
            resposta.render("erro");
        } else {
            resposta.render("result_sciencia");
        }
    });
});

app.get("/saida_saude/:decodificacao", (requisicao, resposta) => {
    registro = requisicao.params.decodificacao;
    console.log(registro);
    dataSistema = new Date();
    horaAtual = dataSistema.getHours().toString();
    minutoAtual = dataSistema.getMinutes().toString();
    horaMinuto = horaAtual + ":" + minutoAtual;

    database.query("UPDATE presenca_saude SET saida = ? WHERE ra = ?", [horaMinuto, registro], (erro, resultado) => {
        if (erro) {
            resposta.render("erro");
        } else {
            resposta.render("result_saidasaude");
        }
    });
});

app.listen(port, () => {
    console.log("Servidor em execução...");
});