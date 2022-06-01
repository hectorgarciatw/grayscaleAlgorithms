/*  
    Filtros de mapas de bits
    Lic. en computación García Héctor
*/

let img, threshold, numberOfShades;
let slider;
let mode;

/* Modos
    1->Threshold algorithm
    2->Average gimp algorithm
    3->Lightness gimp algorithm
    4->Luminosity gimp algorithm
    5->Grayscale gimp algorithm
    6->Distorted algorithm
 */

function distortedFilter() {
    let cont = 0;
    while (cont < 100) {
        cont++;
        let x1 = floor(random(width));
        let x2 = x1 + floor(random(-20, 20));
        let w = floor(random(10, 12));
        let h = height;
        set(x2, 0, get(x1, 0, w, h));
    }
}

function grayScaleFilters(mode) {
    loadPixels();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height * 4; y++) {
            //Determino la posición inicial del pixel a trabajar -Componente Red-
            let i = (x + y * width) * 4;

            if (mode == 1) {
                //Construyo el color del pixel en cuestión -RGB-
                let color = (pixels[i], pixels[i + 1], pixels[i + 2]);
                if (brightness(color) < threshold) {
                    pixels[i] = 0;
                    pixels[i + 1] = 0;
                    pixels[i + 2] = 0;
                } else {
                    pixels[i] = 255;
                    pixels[i + 1] = 255;
                    pixels[i + 2] = 255;
                }
            } else if (mode == 2) {
                let gray = (pixels[i] + pixels[i + 2] + pixels[i + 2]) / 3;
                pixels[i] = gray;
                pixels[i + 1] = gray;
                pixels[i + 2] = gray;
            } else if (mode == 3) {
                //Gray = (Max(Red, Green, Blue) + Min(Red, Green, Blue)) / 2;
                let gray = (Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) + Math.min(pixels[i], pixels[i + 1], pixels[i + 2])) / 2;
                pixels[i] = gray;
                pixels[i + 1] = gray;
                pixels[i + 2] = gray;
            } else if (mode == 4) {
                let gray = pixels[i] * 0.21 + pixels[i + 1] * 0.72 + pixels[i + 2] * 0.07;
                pixels[i] = gray;
                pixels[i + 1] = gray;
                pixels[i + 2] = gray;
            } else if (mode == 5) {
                let conversionFactor;
                conversionFactor = 255 / (numberOfShades - 1);
                avgValue = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
                let gray = (avgValue / conversionFactor + 0.5) * conversionFactor;
                pixels[i] = gray;
                pixels[i + 1] = gray;
                pixels[i + 2] = gray;
            }
        }
    }

    //Actualizo los pixeles de la imagen cargada
    updatePixels();
}

function imageFilter(mode) {
    imageMode(CORNER);
    //Renderizamos la imagen
    image(img, 0, 0, img.width, img.height);
    //Cargo los pixeles de la imagen en el array pixels
    if (mode >= 1 && mode <= 5) {
        grayScaleFilters(mode);
    } else if (mode == 6) {
        distortedFilter();
    }
}

//Accionamos ante el cambio del evento
function mySelectEvent() {
    mode = sel.value().slice(1, 2);
    imageFilter(mode);
}

function preload() {
    img = loadImage("../img/computer.jpg");
}

function setup() {
    createCanvas(800, 800);
    //Por defecto corremos el threshold algorithm
    mode = 1;
    //Creamos el slider para determinar el threshold
    slider = createSlider(2, 256, 40, 10);
    slider.position(10, 50);
    slider.style("width", "100px");
    //Creamos el select
    sel = createSelect();
    sel.position(10, 10);
    sel.option("01 - Threshold algorithm");
    sel.option("02 - Average Gimp algorithm");
    sel.option("03 - Lightness Gimp algorithm");
    sel.option("04 - Luminosity Gimp algorithm");
    sel.option("05 - Grayscale algorithm");
    sel.option("06 - Distorted algorithm");
    sel.changed(mySelectEvent);

    threshold = 40;
    numberOfShades = 2;
    //Aplicamos el filtro digital
    imageFilter(mode);
}

function draw() {
    if (mode == 1) {
        textSize(15);
        fill(0);
        text("Nivel del filtro threshold", 5, 40);
    }
    if (mode == 5) {
        textSize(15);
        fill(0);
        text("Cantidad de sombras", 5, 40);
    }

    //En caso de variar el threshold aplicamos el filtro nuevamente
    if (threshold != slider.value()) {
        threshold = slider.value();
        numberOfShades = slider.value();
        imageFilter(mode);
    }
}
