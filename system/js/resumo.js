//________________ Script ________________
//________________ Globais ________________
let mat_clientes = [];
let mat_servicos = [];

let clientes_gat = false;
let servicos_gat = false;

const horarios = {};

const graf_mov_por_mes = document.getElementById("graf_mov_por_mes");
const graf_mov_por_dia_semana = document.getElementById("graf_mov_por_dia_semana");
const graf_top_servicos = document.getElementById("graf_top_servicos");
const graf_top_hora = document.getElementById("graf_top_hora");

let grafico_mov_por_mes = null;
let grafico_mov_por_dia_semana = null;
let grafico_top_servicos = null;
let grafico_top_hora = null;

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

const tab_dias_semana = {
	0:"Seg",
	1:"Ter",
	2:"Qua",
	3:"Qui",
	4:"Sex",
	5:"Sab",
	6:"Dom"

};

const tab_servicos = {
	banho_de_gel:"Banho de Gel",
	blindagem:"Blindagem",
	cilios:"Cílios",
	depilacao:"Depilação",
	design:"Design",
	design_c_henna:"Design com Henna",
	gel_na_tips:"Gel na Tips",
	manicure:"Manicure",
	manicure_e_pedicure:"Manicure e Pedicure",
	pedicure:"Pedicure",
	posticas:"Posticas",
	spa_dos_pes:"Spa dos Pes"

};

const cores_pastel = [
  "#F8BBD0", // rosa
  "#F48FB1",
  "#F06292",
  "#E1BEE7", // lilás
  "#CE93D8",
  "#B39DDB", // roxo
  "#9FA8DA",
  "#90CAF9", // azul
  "#81D4FA",
  "#80DEEA", // ciano
  "#80CBC4",
  "#A5D6A7", // verde
  "#C5E1A5",
  "#E6EE9C", // verde-amarelado
  "#FFF59D",
  "#FFE082", // amarelo
  "#FFCC80",
  "#FFAB91", // laranja
  "#FFCDD2",
  "#EF9A9A", // vermelho claro
  "#E57373",
  "#FBC02D", // dourado suave
  "#DCE775",
  "#B2EBF2"
  
];

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
	const{data, error} = await banco.from("servicos").select("id, nome, servico, data, hora, pagamento, parcelas, valor, status").order("data", { ascending: true }).order("hora", { ascending: true });
	
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
			const tabela_info = document.createElement("td");

			tabela_info.classList = `tabela_linha tabela_${linha_cor}`;
			tabela_info.innerHTML = `
				${obj.nome} <br>
				${tab_servicos[obj.servico]} <br>
				${dia} de ${tab_meses[mes]} - ${obj.hora} - R$${obj.valor},00 <br>`;

			const botao_apagar = document.createElement("input");

			botao_apagar.type = "button";
			botao_apagar.value = "Apagar";
			botao_apagar.dataset.id = obj.id;
			botao_apagar.classList.add("btn_padrao", "btn_apagar");

			const caixa_apagar = document.createElement("div");
			const apagar_opcao_sim = document.createElement("input");
			const apagar_opcao_nao = document.createElement("input");

			caixa_apagar.dataset.id = obj.id;
			caixa_apagar.classList.add("caixa_apagar", "escondido");
			apagar_opcao_sim.classList.add("btn_padrao", "apagar_opcao_sim");
			apagar_opcao_nao.classList.add("btn_padrao", "apagar_opcao_nao");

			apagar_opcao_sim.type = "button";
			apagar_opcao_nao.type = "button";
			
			apagar_opcao_sim.value = "Sim";
			apagar_opcao_nao.value = "Não";

			caixa_apagar.appendChild(apagar_opcao_sim);
			caixa_apagar.appendChild(apagar_opcao_nao);

			tabela_linha.appendChild(tabela_info);
			tabela_info.appendChild(botao_apagar);
			tabela_info.appendChild(caixa_apagar);

			tabela_corpo.appendChild(tabela_linha);

			linha_cor = linha_cor === "impar" ? "par" : "impar";

		}
	});

}

//Apaga a linha da tabela e do banco de dados
async function apagar_linha(id){
	const caminhoBase = window.location.pathname.includes("/Beauty_salao/")
		? "/Beauty_salao"
		: "";

	const{error} = await banco
		.from("servicos")
		.delete()
		.eq("id", id);
	
	if(error){
		alert("Linha não apagada. " + error);

	} else {
		alert("A linha foi apagada com exito!");
		window.location.href = caminhoBase + "/system/html/resumo.html";

	}

}

//Contabiliza os movimentos por mes para o grafico
function contar_mov_por_mes(ano_selecionado){
	let mov_por_mes = Array(12).fill(0);

	mat_servicos.filter(x => x.data.startsWith(ano_selecionado)).forEach(x => {
		const obj_data = new Date(x.data);
		const mes = obj_data.getMonth();

		if(obj_data.getFullYear() == ano_selecionado){
			mov_por_mes[mes]++;
	
		}

	});
	
	return mov_por_mes;

}

//Contabiliza os movimentos por dias da semana para o grafico
function contar_mov_por_dia_semana(ano_selecionado){
	const mov_por_dia_semana = {};

	mat_servicos.filter(x => x.data.startsWith(ano_selecionado)).forEach(x => {
		const dia_da_semana = new Date(x.data).getDay();

		if(!mov_por_dia_semana[dia_da_semana]){
			mov_por_dia_semana[dia_da_semana] = 1;

		} else {
			mov_por_dia_semana[dia_da_semana] ++;

		}
		
	});
	
	return mov_por_dia_semana;

}

//Contabiliza os servicos por mes para o grafico
function contar_serv_por_mes(ano_selecionado){
	let serv_por_mes = {};
	
	mat_servicos.filter(x => x.data.startsWith(ano_selecionado)).forEach(x => {
		if(!serv_por_mes[x.servico]){
			serv_por_mes[x.servico] = 1;
	
		} else {
			serv_por_mes[x.servico] ++;
	
		}

	});

	//const resultado_texto = Object.keys(serv_por_mes);
	//const resultado_valor = Object.values(serv_por_mes);

	//Object.entries(serv_por_mes).forEach(([servicos, quantidade]) => {
		//console.log(servicos, quantidade);
	//});

	return serv_por_mes;

}

//Contabiliza os horarios das visitas para o grafico
function cont_horario_visitas(ano_selecionado){
	mat_servicos.filter(x => x.data.startsWith(ano_selecionado)).forEach(x => {
		const horas = x.hora.split(":")[0];

		if(!horarios[horas]){
			horarios[horas] = 1;

		} else {
			horarios[horas] ++;

		}

		
	});
	
	const horarios_ordenados = Object.keys(horarios).sort((a, b) => Number(a) - Number(b));

	return horarios_ordenados;
	
}

//Atualiza os graficos com o ano selecionado
function atualizar_grafos(ano_selecionado){
	const dados_servico = contar_serv_por_mes(ano_selecionado);
	const dados_dia_semana = contar_mov_por_dia_semana(ano_selecionado);
	const dados_horario_visitas = cont_horario_visitas(ano_selecionado);

	console.log(cont_horario_visitas(ano_selecionado));

	grafico_mov_por_mes.data.datasets[0].data = contar_mov_por_mes(ano_selecionado);
	grafico_mov_por_mes.update();
	
	grafico_mov_por_dia_semana.data.datasets[0].data = Object.values(dados_dia_semana);
	grafico_mov_por_dia_semana.update();

	grafico_top_servicos.data.labels = Object.keys(dados_servico).map(x => tab_servicos[x]);
	grafico_top_servicos.data.datasets[0].data = Object.values(dados_servico);
	grafico_top_servicos.update();
	
	grafico_top_hora.data.labels = dados_horario_visitas.map(x => `${x}:00`);
	grafico_top_hora.data.datasets[0].data = dados_horario_visitas.map(x => horarios[x]);
	grafico_top_hora.update();
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

//Grafico do Movimento por Mes ________________________________________________________________________________________________
grafico_mov_por_mes = new Chart(graf_mov_por_mes, {
	type: 'line',
	data: {
		labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    	datasets: [{
    		data: [0],
			backgroundColor: cores_pastel,
    		borderWidth: 2

    	}]

	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		plugins:{
			title:{
				display: true,
				text: "Movimento por mês",
				font:{
					size: 24,
					family: "Birthstone"

				}

			},
			legend:{
				display: false,
				labels:{
					boxWidth: 0,
					boxHeight: 0,
					padding: 6,
					font:{
						size: 13,
						family: "MontserratAlternates"
					}

				},
				onclick: null

			}

		},
    	scales: {
			x:{
				ticks:{
					font:{
						size: 15,
						family: "MontserratAlternates"

					}

				}

			},

     		y:{
       			beginAtZero: true,
				ticks:{
					stepSize: 1,
					precision: 1,
					font:{
						size: 15,

					}
				}

    		}

    	}

	}

});

//Grafico do Movimento por Semana ________________________________________________________________________________________________
grafico_mov_por_dia_semana = new Chart(graf_mov_por_dia_semana, {
	type: 'bar',
	data: {
		labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    	datasets: [{
    		data: [0],
			backgroundColor: cores_pastel,
    		borderWidth: 2

		}]

	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		plugins:{
			title:{
				display: true,
				text: "Movimento dos dias da semana",
				font:{
					size: 24,
					family: "Birthstone"

				}

			},
			legend:{
				display: false,
				labels:{
					boxWidth: 0,
					boxHeight: 0,
					padding: 6,
					font:{
						size: 13,
						family: "MontserratAlternates"
					}

				},
				onclick: null

			}

		},
    	scales: {
			x:{
				display: true,
				ticks:{
					font:{
						size: 15,
						family: "MontserratAlternates"

					}

				}

			},

     		y:{
				display: false,
       			beginAtZero: true,
				ticks:{
					stepSize: 1,
					precision: 1,
					font:{
						size: 15,

					}

				}

    		}

    	}

	}

});

//Grafico do Top Servicos ________________________________________________________________________________________________
grafico_top_servicos = new Chart(graf_top_servicos, {
	type: 'pie',
	data: {
		labels: ['1'],
    	datasets: [{
    		data: [0],
			backgroundColor: cores_pastel,
    		borderWidth: 2

    	}]

	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		plugins:{
			title:{
				display: true,
				text: "Serviços do ano",
				font:{
					size: 24,
					family: "Birthstone"

				}

			},
			legend:{
				display: false,
				labels:{
					boxWidth: 0,
					boxHeight: 0,
					padding: 6,
					font:{
						size: 13,
						family: "MontserratAlternates"
					}

				},
				onclick: null

			}

		},
    	scales: {
			x:{
				display: false,
				ticks:{
					font:{
						size: 15,
						family: "MontserratAlternates"

					}

				}

			},

     		y:{
				display: false,
       			beginAtZero: true,
				ticks:{
					stepSize: 1,
					precision: 1,
					font:{
						size: 15,

					}

				}

    		}

    	}

	}

});

//Grafico do Movimento por Mes ________________________________________________________________________________________________
grafico_top_hora = new Chart(graf_top_hora, {
	type: 'bar',
	data: {
		labels: ['Jan'],
    	datasets: [{
    		data: [0],
			backgroundColor: cores_pastel,
    		borderWidth: 2

    	}]

	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		plugins:{
			title:{
				display: true,
				text: "Horários das visitas",
				font:{
					size: 24,
					family: "Birthstone"

				}

			},
			legend:{
				display: false,
				labels:{
					boxWidth: 0,
					boxHeight: 0,
					padding: 6,
					font:{
						size: 13,
						family: "MontserratAlternates"
					}

				},
				onclick: null

			}

		},
    	scales: {
			x:{
				ticks:{
					font:{
						size: 15,
						family: "MontserratAlternates"

					}

				}

			},

     		y:{
       			beginAtZero: true,
				ticks:{
					stepSize: 1,
					precision: 1,
					font:{
						size: 15,

					}
				}

    		}

    	}

	}

});
