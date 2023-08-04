const criptoMonedasSelect = document.querySelector('#criptomonedas');
const monedasSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

//Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve =>{
    resolve(criptomonedas);
});



document.addEventListener('DOMContentLoaded', () => {

    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptoMonedasSelect.addEventListener('change', leerValor);
    monedasSelect.addEventListener('change', leerValor);

});

function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';


    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name ;
        option.textContent = FullName ;
        criptoMonedasSelect.appendChild(option);
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
    
}

function submitFormulario(e){
    e.preventDefault();

    //Validar 
    const { moneda, criptomoneda } = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        imprimirAlerta('Ambos campos son obligatorios');
        return;
    }

    //Consultar API
    consultarAPI();

}

function  imprimirAlerta(mensaje){

    const errorDiv = document.querySelector('.error');
    
    if(!errorDiv){
        const error = document.createElement('div');
        error.classList.add('error');
        error.textContent = mensaje;

        formulario.appendChild(error);


        setTimeout(() => {
            error.remove();
        }, 3000);
    }
    
}


function consultarAPI(){
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        });
}

function mostrarCotizacionHTML(cotizacion){

    limpiarHTML();
    
    const {PRICE, HIGHDAY, LOWDAY,  LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.innerHTML = `
        <p >Precio: <span>${PRICE}</span></p> 
        <p>Precio más alto del día: <span>${HIGHDAY}</span></p>
        <p>Precio más bajo del día: <span>${LOWDAY}</span></p>
        <p>Últimas actualización: <span>${LASTUPDATE}</span> </p>
        
    `;

        resultado.appendChild(precio);
    
}


function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = ` 
        <svg class="spinner flex justify-content" viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
        </svg>
    `;

    resultado.appendChild(spinner);
}