//VERSÃO 3.0


const toggleButton = document.getElementById('toggle-theme');
const body = document.body;

toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
});



const TOTAL_DIAS = 7;

class PlanosDia {
    constructor(dia) {
        this.dia = dia;
        this.tipoTreino = '';
        this.fotoPerfil = '';
        this.itens = [];
    }
}

// Utilitário para carregar/salvar todos os planos
function carregarPlanos() {
    let planos = JSON.parse(localStorage.getItem("planos_dia")) || [];
    for (let i = 0; i < TOTAL_DIAS; i++) {
        if (!planos[i]) planos[i] = { foto: "", itens: [] };
    }
    return planos;
}
function salvarPlanos(planos) {
    localStorage.setItem("planos_dia", JSON.stringify(planos));
}

// Salvar e restaurar o valor do seletor de dias
const selectDias = document.getElementById("dia");
selectDias.addEventListener("change", function() {
    localStorage.setItem("diasSelecionados", selectDias.value);
    atualizarContainers();
});
const diasSalvos = localStorage.getItem("diasSelecionados");
if (diasSalvos) selectDias.value = diasSalvos;

// Containers dos dias
const containers = [
    document.querySelector(".principal"),
    document.querySelector(".doisDias"),
    document.querySelector(".tresDias"),
    document.querySelector(".quatroDias"),
    document.querySelector(".cincoDias"),
    document.querySelector(".seisDias"),
    document.querySelector(".seteDias")
];

// Inicializa todos os dias
function inicializarDia(diaIndex) {
    const plano = carregarPlanos()[diaIndex];
    const fotoDiv = document.getElementById(`fotoUsuario${diaIndex+1}`);
    const inputFoto = document.getElementById(`uploadFoto${diaIndex+1}`);
    const btnFoto = document.getElementById(`btnFoto${diaIndex+1}`);
    const form = document.getElementById(`novoItem${diaIndex+1}`);
    const lista = document.getElementById(`lista${diaIndex+1}`);

    // Foto
    if (plano.foto) {
        fotoDiv.style.backgroundImage = `url(${plano.foto})`;
        fotoDiv.style.backgroundSize = "cover";
        fotoDiv.style.backgroundPosition = "center";
    } else {
        fotoDiv.style.backgroundImage = "";
    }
    btnFoto.onclick = () => inputFoto.click();
    inputFoto.onchange = () => {
        const file = inputFoto.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                plano.foto = e.target.result;
                fotoDiv.style.backgroundImage = `url(${plano.foto})`;
                fotoDiv.style.backgroundSize = "cover";
                fotoDiv.style.backgroundPosition = "center";
                const planos = carregarPlanos();
                planos[diaIndex] = plano;
                salvarPlanos(planos);
            };
            reader.readAsDataURL(file);
        }
    };

    // Lista de itens
    lista.innerHTML = "";
    plano.itens.forEach((item, idx) => {
        const li = document.createElement("li");
        li.className = "item";
        li.innerHTML = `<strong>${item.quantidade}</strong> ${item.nome}`;
        const btnDel = document.createElement("button");
        btnDel.textContent = "X";
        btnDel.onclick = () => {
            plano.itens.splice(idx, 1);
            const planos = carregarPlanos();
            planos[diaIndex] = plano;
            salvarPlanos(planos);
            inicializarDia(diaIndex);
        };
        li.appendChild(btnDel);
        lista.appendChild(li);
    });

    // Adicionar novo item
    form.onsubmit = (e) => {
        e.preventDefault();
        const nome = form.querySelector(`[name="nome${diaIndex+1}"]`).value.trim();
        const quantidade = form.querySelector(`[name="quantidade${diaIndex+1}"]`).value.trim();
        if (!nome || !quantidade) return;
        plano.itens.push({ nome, quantidade });
        const planos = carregarPlanos();
        planos[diaIndex] = plano;
        salvarPlanos(planos);
        form.reset();
        inicializarDia(diaIndex);
    };
}

// Mostra containers conforme seleção
function atualizarContainers() {
    const diasSelecionados = parseInt(selectDias.value, 10);
    containers.forEach((container, idx) => {
        if (idx < diasSelecionados) {
            container.style.display = "flex";
            inicializarDia(idx);
        } else {
            container.style.display = "none";
        }
    });
}

// Inicialização
atualizarContainers();