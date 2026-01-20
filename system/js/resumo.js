//________________ Script ________________
//________________ Globais ________________
let mat_clientes = [];
let mat_servicos = [];

let clientes_gat = false;
let servicos_gat = false;

const graf_mov_por_mes = document.getElementById("graf_mov_por_mes");

let grafico_mov_por_mes = null;

const tab_meses = {
	0:"Janeiro",
	1:"Fereveiro",
	2:"Março",
	3:"Abril",
	4:"Maio",
	5:"Junho",
	6:"Julho",
	7:"Agosto",
	8:"Setembro",
	9:"Outubro",
	10:"Novembro",
	11:"Dezembro"
};

const tab_servicos = {
	banho_de_gel:"Banho de Gel",
	blindagem:"Blindagem",
	cilios:"Cílios",
	depilacao:"Depilação",
	design:"Design",
	design_c_henna:"design com Henna",
	gel_na_tips:"Gel na Tips",
	manicure:"Manicure",
	manicure_e_pedicure:"Manicure e Pedicure",
	pedicure:"Pedicure",
	posticas:"Posticas",
	spa_dos_pes:"Spa dos Pes"
};

//________________ Funcoes ________________

//Testa a conexão e copia os valores do banco de dados
//Tabela clientes________________________________________________________________________________________________
async function conexao_bd_clientes(){
	const{data, error} = await banco.from("clientes").select("id, nome").order("nome", { ascending: true });
	
	if(error){
		rodape_conexao.textContent = "Falha ao conectar: " + error.message + " // " + error;
		return false;

	} else {
		data.forEach(x => {
			mat_clientes.push(x);
		});

		clientes_gat = true;

	}

}

//Tabela servicos________________________________________________________________________________________________
async function conexao_bd_servicos(){
	const{data, error} = await banco.from("servicos").select("id, nome, servico, data, hora, pagamento, parcelas, valor, status").order("data", { ascending: true });
	
	if(error){
		rodape_conexao.textContent = "Falha ao conectar: " + error.message + " // " + error;
		return false;

	} else {
		data.forEach(x => {
			mat_servicos.push(x);
		});

		servicos_gat = true;

	}

}

//Mapeia o Nome
function map_nome(x){
    return mat_servicos.map(x => x.nome);
}

//Mapeia o Servico
function map_servico(){
    return mat_servicos.map(x => x.servico);
}

//Mapeia a Data
function map_data(){
    return mat_servicos.map(x => x.data);
}

//Mapeia a Hora
function map_hora(){
    return mat_servicos.map(x => x.hora);
}

//Mapeia o Pagamento
function map_pagamento(){
    return mat_servicos.map(x => x.pagamento);
}

//Mapeia a Parcelas
function map_parcelas(){
    return mat_servicos.map(x => x.parcelas);
}

//Mapeia o Valor
function map_valor(){
    return mat_servicos.map(x => x.valor);
}

//Mapeia o Status
function map_status(){
    return mat_servicos.map(x => x.status);
}

//Carrega os valores da memoria do Ano na lista
function carregar_lista_ano(){
	const buscar_por_ano = document.getElementById("buscar_por_ano");
	
	buscar_por_ano.addEventListener("change", x => {
		carregar_tab(buscar_por_ano.value);
		atualizar_grafos(buscar_por_ano.value);

	});

	let ano_lista = [];

	mat_servicos.forEach(obj => {
		const obj_data = new Date(obj.data);
		const ano = obj_data.getFullYear();

		if(!ano_lista.includes(ano)){
			const ano_opcao = document.createElement("option");

			ano_opcao.textContent = ano;
			ano_opcao.value = ano;

			buscar_por_ano.appendChild(ano_opcao);


			ano_lista.push(ano);
		}
	});

}

//Carrega os valores de serviços na tebela respectiva ao ano selecionado
function carregar_tab(ano_selecionado){
	const tabela_corpo = document.getElementById("tabela_corpo");

	let linha_cor = "impar";

	tabela_corpo.innerHTML = "";

	if(ano_selecionado === "vazio"){
		const tabela_linha = document.createElement("tr");

		tabela_linha.innerHTML = `
			<td class="tabela_linha tabela_${linha_cor}">Selecione algum <h3>ano</h3> para analisar.</td>
		`;

		tabela_corpo.appendChild(tabela_linha);

		return false;

	}

	mat_servicos.forEach(obj => {
		const obj_data = new Date(obj.data);
		const mes = obj_data.getMonth();
		const dia = obj_data.getDate() + 1;

		if(obj.data.includes(ano_selecionado)){
			const tabela_linha = document.createElement("tr");

			tabela_linha.innerHTML = `
				<td class="tabela_linha tabela_${linha_cor}">${obj.nome} </br> ${tab_servicos[obj.servico]} </br> ${dia} de ${tab_meses[mes]} - ${obj.hora} - R$${obj.valor},00</td>
			`;

			tabela_corpo.appendChild(tabela_linha);

			linha_cor = linha_cor === "impar" ? "par" : "impar";
		}
	});

}

//Contabiliza os movimentos por mes para o grafico
function contar_mov_por_mes(ano_selecionado){
	let mov_por_mes = Array(12).fill(0);

	mat_servicos.forEach(obj => {
		const obj_data = new Date(obj.data);
		const mes = obj_data.getMonth();

		if(obj.data.includes(ano_selecionado)){
			mov_por_mes[mes]++;
		}
	});
	
	return mov_por_mes;

}


//Atualiza os graficos com o ano selecionado
function atualizar_grafos(ano_selecionado){
	grafico_mov_por_mes.data.datasets[0].data = contar_mov_por_mes(ano_selecionado);
	grafico_mov_por_mes.update();
}

//________________ Estruturas ________________

//Define os parametros para a conexao com o banco de dados
const SUPABASE_URL = "https://jebltevthtldornlcgvu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplYmx0ZXZ0aHRsZG9ybmxjZ3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTIwODksImV4cCI6MjA4MDUyODA4OX0.eIuIL7nT5hBmdZB4m283w_dAe2M5RKVCJfbMKg0D-oI";

const banco = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

//Inicializa a conexao, as chamadas de funções essencias e validacoes
async function inicializacao() {
	await conexao_bd_clientes();
	await conexao_bd_servicos();
	
	if(clientes_gat === true && servicos_gat === true){
		const rodape_conexao = document.getElementById("rodape_conexao");
		rodape_conexao.textContent = "Conectado a versão beta 1.0. © Sunny Rabbit";
	
        carregar_lista_ano();

	}

	//console.log(mat_servicos);

}

//________________ Chamadas ________________
inicializacao();

Chart.defaults.font.size = 14;
Chart.defaults.font.family = "MontserratAlternates";

grafico_mov_por_mes = new Chart(graf_mov_por_mes, {
	type: 'line',
	data: {
	labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    	datasets: [{
    	label: 'Movimentos por mês',
    	data: [0],
    	borderWidth: 2

    }]

	},
	options: {
		plugins:{
			legend:{
				labels:{
					font:{
						size: 22,
						family: "Birthstone"
					}
				}
			}
		},
    	scales: {
     		y:{
       			beginAtZero: true,
				ticks:{
					stepSize: 1,
					precision: 1
				}

    		}

    	}

	}

});