const form = document.getElementById("novoItem")
const lista = document.getElementById("lista")
const itens = JSON.parse(localStorage.getItem("itens")) || []

const btnFoto = document.getElementById("btnFoto");
const uploadFoto = document.getElementById("uploadFoto");
const fotoUsuario = document.getElementById("fotoUsuario");



// Carregar imagem do localStorage ao abrir
const fotoSalva = localStorage.getItem("fotoPerfil");
if (fotoSalva) {
    fotoUsuario.style.backgroundImage = `url(${fotoSalva})`;
    fotoUsuario.style.backgroundSize = "cover";
    fotoUsuario.style.backgroundPosition = "center";
}

// Abrir seletor de arquivos ao clicar no botão
btnFoto.addEventListener("click", () => {
    uploadFoto.click();
});
// Ao selecionar arquivo, exibir e salvar
uploadFoto.addEventListener("change", () => {
    const file = uploadFoto.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgData = e.target.result;
            fotoUsuario.style.backgroundImage = `url(${imgData})`;
            fotoUsuario.style.backgroundSize = "cover";
            fotoUsuario.style.backgroundPosition = "center";
            localStorage.setItem("fotoPerfil", imgData);
        };
        reader.readAsDataURL(file);
    }
});

// criando itens
itens.forEach( (elemento) => {
    criaElemento(elemento)
} )

form.addEventListener("submit", (evento) => {
    evento.preventDefault()

    const nome = evento.target.elements['nome']
    const quantidade = evento.target.elements['quantidade']

    const existe = itens.find(elemento => elemento.nome === nome.value) //atualizando lista //o elemento EXISTE??
    
    const itemAtual = {
        "nome": nome.value, 
        "quantidade": quantidade.value
    }

    if(existe){                                                         //TESTE DE ELEMENTO
        itemAtual.id = existe.id  

        atualizaElemento(itemAtual)

        itens[itens.findIndex(elemento => elemento.id === existe.id)] = itemAtual                //substituindo o valor antigo pelo atual
    } else{
        itemAtual.id = itens[itens.length -1] ? (itens[itens.length-1]).id + 1 : 0;
        criaElemento(itemAtual)  
        itens.push(itemAtual)
    }

    localStorage.setItem("itens", JSON.stringify(itens))
    

    nome.value = ""
    quantidade.value = ""
})

function criaElemento(item) {
    const novoItem = document.createElement("li")
    novoItem.classList.add("item")

    const numeroItem = document.createElement("strong")
    numeroItem.innerHTML = item.quantidade
    numeroItem.dataset.id = item.id                                 //id do item existente
    novoItem.appendChild(numeroItem) 
    
    novoItem.innerHTML += item.nome

    novoItem.appendChild(botaoDeleta(item.id))
    lista.appendChild(novoItem)

}

function atualizaElemento(item){
    document.querySelector("[data-id='"+item.id+"']").innerHTML = item.quantidade          //atualizando a quantidade
}
// criando um botão de delet
function botaoDeleta(id){
    const elementoBotao = document.createElement("button")
    elementoBotao.innerText = "X"

    elementoBotao.addEventListener("click", function(){
        deletaElemento(this.parentNode, id)                                           //para saber qual foi  o elemento clicado
    })

    return elementoBotao
}

function deletaElemento(tag, id){
    tag.remove()
// remover um item do Array
   itens.splice(itens.findIndex(elemento => elemento.id ===id), 1)
//escrever no localStorage
    localStorage.setItem("itens", JSON.stringify(itens))
}

const selectDias = document.getElementById("dia");

// Lista das classes dos containers
const containers = [
    document.querySelector(".principal"),
    document.querySelector(".doisDias"),
    document.querySelector(".tresDias"),
    document.querySelector(".quatroDias"),
    document.querySelector(".cincoDias"),
    document.querySelector(".seisDias"),
    document.querySelector(".seteDias")
];

// Função para mostrar os containers conforme o valor selecionado
function atualizarContainers() {
    const diasSelecionados = parseInt(selectDias.value, 10);
    containers.forEach((container, index) => {
        if (index < diasSelecionados) {
            container.style.display = "flex";
        } else {
            container.style.display = "none";
        }
    });
}

atualizarContainers();
selectDias.addEventListener("change", atualizarContainers);












