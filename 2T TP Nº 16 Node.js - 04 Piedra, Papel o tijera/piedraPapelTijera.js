const http = require("http");
const url = require("url");
const fs = require("fs");
const querystring = require("querystring");

const mime = {
    html: "text/html",
    css: "text/css",
    jpg: "image/jpg",
    ico: "image/x-icon",
    mp3: "audio/mpeg3",
    mp4: "video/mp4",
};

const servidor = http.createServer((pedido, respuesta) => {
    const objetourl = url.parse(pedido.url);
    let camino = "public" + objetourl.pathname;
    if (camino == "public/") camino = "public/index.html";
    encaminar(pedido, respuesta, camino);
});

servidor.listen(8888);

function encaminar(pedido, respuesta, camino) {
    console.log(camino);
    switch (camino) {
        case "public/recuperardatos":
            {
                recuperar(pedido, respuesta);
                break;
            }
        default:
            {
                fs.stat(camino, (error) => {
                    if (!error) {
                        fs.readFile(camino, (error, contenido) => {
                            if (error) {
                                respuesta.writeHead(500, { "Content-Type": "text/plain" });
                                respuesta.write("Error interno");
                                respuesta.end();
                            } else {
                                const vec = camino.split(".");
                                const extension = vec[vec.length - 1];
                                const mimearchivo = mime[extension];
                                respuesta.writeHead(200, { "Content-Type": mimearchivo });
                                respuesta.write(contenido);
                                respuesta.end();
                            }
                        });
                    } else {
                        respuesta.writeHead(404, { "Content-Type": "text/html" });
                        respuesta.write(
                            "<!doctype html><html><head></head><body>Recurso inexistente</body></html>"
                        );
                        respuesta.end();
                    }
                });
            }
    }
}

function recuperar(pedido, respuesta) {
    let info = "";
    pedido.on("data", (datosparciales) => {
        info += datosparciales;
    });
    pedido.on("end", () => {
        const formulario = querystring.parse(info);
        respuesta.writeHead(200, { "Content-Type": "text/html" });
        const pagina =
            `<!doctype html><html><head><link rel="stylesheet" href="style.css" /></head><body><div class="container">` +
            piedraPapelTijera(formulario["string"]) +
            `</div></body></html>`;
        console.log(piedraPapelTijera(parseInt(formulario["string"])));
        respuesta.end(pagina);

    });
}

function NumerosAleatorios(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function piedraPapelTijera(string) {

    let string2 = "";
    let piedraPapelTijera = ["p", "a", "t"]
    let respuestaAleatoria = piedraPapelTijera[NumerosAleatorios(0, 2)];
    let string3 = "";
    console.log(respuestaAleatoria);

    if (string == "p" && respuestaAleatoria == "t") {
        string2 = "You Win! <br> El servidor ha elegido tijera ";
    } else {
        string2 = "You Loose! <br> El servidor ha elegido tijera";
    }
    if (string == "a" && respuestaAleatoria == "p") {
        string2 = "You Win! <br> El servidor ha elegido piedra ";
    } else {
        string2 = "You Loose! <br> El servidor ha elegido piedra";
    }
    if (string == "t" && respuestaAleatoria == "a") {
        string2 = "You Win! <br> El servidor ha elegido papel ";
    } else {
        string2 = "You Loose! <br> El servidor ha elegido papel";
    }

    return string2;
}

console.log("Servidor web iniciado");