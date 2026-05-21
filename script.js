// ============================================
// PRÁCTICA: SENSORES DEL CELULAR
// ============================================

// 1. Obtener elementos del HTML
const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');
const datosDiv = document.getElementById('datos');
const botonActivar = document.getElementById('activarBtn');

// 2. Variables para la posición del círculo
let posX = 150;
let posY = 150;
const radio = 20;

// Variable para cambiar color
let colorCirculo = '#ff6600';

// 3. Función para dibujar
function dibujar() {

    // Fondo negro
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar círculo
    ctx.fillStyle = colorCirculo;

    ctx.beginPath();
    ctx.arc(posX, posY, radio, 0, Math.PI * 2);
    ctx.fill();

    // Punto central blanco
    ctx.fillStyle = 'white';

    ctx.beginPath();
    ctx.arc(150, 150, 3, 0, Math.PI * 2);
    ctx.fill();
}

// 4. Manejar orientación
function manejarOrientacion(event) {

    let gamma = event.gamma;
    let beta = event.beta;

    // Mostrar datos
    datosDiv.innerHTML =
    `Gamma: ${gamma.toFixed(2)}°
     | Beta: ${beta.toFixed(2)}°`;

    // Movimiento
    posX = mapear(gamma, -70, 70, 20, 280);
    posY = mapear(beta, -70, 70, 20, 280);

    // Limitar bordes
    posX = Math.min(280, Math.max(20, posX));
    posY = Math.min(280, Math.max(20, posY));

    dibujar();
}

// 5. Función mapear
function mapear(valor, minIn, maxIn, minOut, maxOut) {

    return ((valor - minIn) /
           (maxIn - minIn)) *
           (maxOut - minOut) +
           minOut;
}

// 6. Activar sensores
function activarSensores() {

    // iPhone
    if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {

        DeviceOrientationEvent.requestPermission()

        .then(estado => {

            if (estado === 'granted') {

                window.addEventListener(
                    'deviceorientation',
                    manejarOrientacion
                );

                window.addEventListener(
                    'devicemotion',
                    manejarMovimiento
                );

                datosDiv.innerHTML =
                "Sensores ACTIVADOS (iPhone)";
            }

            else {

                datosDiv.innerHTML =
                "Permiso denegado";
            }
        })

        .catch(error => {

            datosDiv.innerHTML =
            "Error: " + error;
        });

    } else {

        // Android
        window.addEventListener(
            'deviceorientation',
            manejarOrientacion
        );

        window.addEventListener(
            'devicemotion',
            manejarMovimiento
        );

        datosDiv.innerHTML =
        "Sensores ACTIVADOS (Android)";
    }
}

// 7. Botón activar
botonActivar.addEventListener(
    'click',
    activarSensores
);

// ============================================
// DETECTAR SACUDIDAS
// ============================================

let contadorSacudidas = 0;

function manejarMovimiento(event) {

    let aceleracion =
    event.accelerationIncludingGravity;

    let sacudida =
    Math.abs(aceleracion.x) +
    Math.abs(aceleracion.y) +
    Math.abs(aceleracion.z);

    // Detectar golpe fuerte
    if (sacudida > 25) {

        contadorSacudidas++;

        datosDiv.innerHTML +=
        `<br> SACUDIDA #${contadorSacudidas}`;

        // Cambiar círculo a rojo
        colorCirculo = 'red';

        dibujar();

        // Regresar a naranja
        setTimeout(() => {

            colorCirculo = '#ff6600';

            dibujar();

        }, 300);
    }
}

// 8. Pantalla inicial
dibujar();

datosDiv.innerHTML =
"Presiona el botón naranja para activar sensores";
