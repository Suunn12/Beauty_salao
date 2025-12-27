//----------------------------------------Script Principal----------------------------------------

//----------------------------------------Variaveis globais----------------------------------------
let mat_servicos = [];
let anos_lista = {};
let ano = 0;
let ntop = 0;

const grafico1 = document.getElementById('meu_grafico1');
const grafico2 = document.getElementById('meu_grafico2');
const grafico3 = document.getElementById('meu_grafico3');

let grafico_meses = null;
let grafico_servicos = null;
let grafico_pagamentos = null;


//----------------------------------------Funções----------------------------------------
//Conecta e carrega os valores para uma matriz local
async function testar_conexao(){
	const{data, error} = await banco
		.from("servicos")
		.select("id, nome, servico, data, hora, pagamento, parcelas, valor")
		.order("data", { ascending: true });
	
	if(error){
		const conteudo = document.querySelector(".rodape");
		const texto_versao = document.createElement("p");
		
		texto_versao.textContent = "Falha ao conectar: " + error.message + "! // " + error;
		
		conteudo.appendChild(texto_versao);
		
	} else{
		const conteudo = document.querySelector(".rodape");
		const texto_versao = document.createElement("p");
		
		texto_versao.textContent = "Conectado na versão PRE-ALPHA 0.1";
		
		conteudo.appendChild(texto_versao);
		
	}
	
	
	data.forEach(item => {
		mat_servicos.push(item);
		
		const ano_atual = new Date(item.data).getFullYear();
		const slcn_ano = document.getElementById("slcn_ano");
		
		//Verifica se há o ano registrado na memória e cria as opções dos anos registrados
		if(!anos_lista[ano_atual]){
			anos_lista[ano_atual] = [];
		
			const opcao_ano = document.createElement("option");
		
			opcao_ano.value = ano_atual;
			opcao_ano.textContent = ano_atual;
		
			slcn_ano.appendChild(opcao_ano);
			
			ano = slcn_ano.value;
		
		}
	
		anos_lista[ano_atual].push(item);
		
	});
	
	atualizar_graf(ano, ntop);
}



//Mapeia os nomes
function lista_nomes_map(ano){
	return anos_lista[ano].map(s => s.nome);
}



//Mapeia os servicos
function lista_servicos_map(ano){
	return anos_lista[ano].map(s => s.servico);
}



//Mapeia os datas
function lista_datas_map(ano){
	return anos_lista[ano].map(s => s.data);
}



//Mapeia os horas
function lista_horas_map(ano){
	return anos_lista[ano].map(s => s.hora);
}



//Mapeia os pagamentos
function lista_pagamentos_map(ano){
	return anos_lista[ano].map(s => s.pagamento);
}



//Mapeia os parcelas
function lista_parcelas_map(ano){
	return anos_lista[ano].map(s => s.parcelas);
}



//Mapeia os valores
function lista_valores_map(ano){
	return anos_lista[ano].map(s => s.id);
}



//Contabiliza os nomes registradas no ano
function cont_nome(ano, ntop){
	const cont_nomes = [];
	
	lista_nomes_map(ano).forEach(y => {
		const nome_existente = cont_nomes.find(item => item.nome === y);
		
		if(nome_existente){
			nome_existente.quantidade++;
		} else {
			cont_nomes.push({
				nome: y,
				quantidade: 1
			});
		}
	});
	
	const nomes_top = cont_nomes.filter(item => item.quantidade >= ntop);
	nomes_top.sort((a, b) => b.quantidade - a.quantidade);
	
	return nomes_top;
}



//Contabiliza os servicos registradas no ano
function cont_servico(ano){
	const quant_servicos = [];
	
	lista_servicos_map(ano).forEach(y => {
		if(!quant_servicos[y]){
			quant_servicos[y] = [];
			quant_servicos[y]++;
			
		} else {
			quant_servicos[y]++;
			
		}
	});
	
	const cont_servicos = [
		quant_servicos.banho_de_gel,
		quant_servicos.blindagem,
		quant_servicos.cilios,
		quant_servicos.depilacao,
		quant_servicos.sombrancelha,
		quant_servicos.sombrancelha_de_henna,
		quant_servicos.gel_tips,
		quant_servicos.posticas,
		quant_servicos.spa_de_pes,
		quant_servicos.mao,
		quant_servicos.mao_e_pe,
		quant_servicos.pe
	];
	
	return cont_servicos;
}



//Contabiliza as datas registradas no ano
function cont_data(ano){
	const cont_datas = Array(12).fill(0);
	
	lista_datas_map(ano).forEach(y => {
		const cont_nova_data = parseInt(y.split("-")[1], 10) - 1;
		cont_datas[cont_nova_data]++;
	});
	
	return cont_datas;
}



//Contabiliza as datas registradas no ano
function cont_pagamento(ano){
	const quant_pagamentos = {};
	
	lista_pagamentos_map(ano).forEach(y => {
		if(!quant_pagamentos[y]){
			quant_pagamentos[y] = [];
			quant_pagamentos[y]++;
		} else {
			quant_pagamentos[y]++;
		}
	});
	
	const cont_pagamentos = [
		quant_pagamentos.credito,
		quant_pagamentos.debito,
		quant_pagamentos.dinheiro,
		quant_pagamentos.pix,
		quant_pagamentos.outro
	];
	
	return cont_pagamentos;
}



//Gera a tabela de nomes top fidelidade
function tabela_nome_top(nomes_top){
	const tabela_top = document.getElementById("tab_nomes_top");
	tabela_top.innerHTML = "";
	
	nomes_top.forEach(y => {
		const novo_nome_top = document.createElement("tr");
		
		novo_nome_top.innerHTML = `
			<td class="verde">${y.nome}</td>
			<td class="azul">${y.quantidade} visitas</td>
		`;
		
		tabela_top.appendChild(novo_nome_top);
	});
}



//Atualiza o grafico
function atualizar_graf(ano, ntop){
	const contar_datas = cont_data(ano);
	const contar_servicos = cont_servico(ano);
	const contar_nomes_top = cont_nome(ano, ntop);
	const contar_pagamentos = cont_pagamento(ano);
	
	grafico_meses.data.datasets[0].data = contar_datas;
	grafico_meses.update();
	
	grafico_servicos.data.datasets[0].data = contar_servicos;
	grafico_servicos.update();
	
	grafico_pagamentos.data.datasets[0].data = contar_pagamentos;
	grafico_pagamentos.update()
	
	if(contar_nomes_top && contar_nomes_top.length > 0){
		tabela_nome_top(contar_nomes_top);
	} else {
		console.log("Atenção: Nenhum dado carregado até o memento, tente atualizar os valores de busca")
		document.getElementById("tab_nomes_top").innerHTML = "<tr><td colspan='2'>Sem dados até o momento.</td></tr>"
	}
	
}



//----------------------------------------Estruturas----------------------------------------
//Cria a conexão
const SUPABASE_URL = "https://jebltevthtldornlcgvu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplYmx0ZXZ0aHRsZG9ybmxjZ3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTIwODksImV4cCI6MjA4MDUyODA4OX0.eIuIL7nT5hBmdZB4m283w_dAe2M5RKVCJfbMKg0D-oI";
const banco = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);



//Recebe e cria os botões padrões
const botao_padrao = document.querySelectorAll('.btn_padrao');

botao_padrao.forEach(botao => {
	//Adiciona o ouvidor de cliques para animar
	botao.addEventListener('click', () => {
		botao.classList.add('animar_clique');
	});
	//Adiciona o ouvidor de fim de animação para agir
	botao.addEventListener('animationend', () => {
		botao.classList.remove('animar_clique');
				
			//Realiza uma ação diferente dependendo do tipo do botão
			if(botao.classList.contains('btn_confirmar')){
				//alert('Botao CONFIRMAR');
				window.location.href = 'html_testes_pg2.html';
					
			} else if(botao.classList.contains('btn_continuar')){
				//alert('Botao CONTINUAR');
				console.log(cont_pagamento(ano));
				//console.log(lista_pagamentos_map(ano));
				
			} else if(botao.classList.contains('btn_voltar')){
				//alert('Botao VOLTAR');
				window.location.href = 'index.html';
				
			}
		});
});



//Gera os graficos para metricas
Chart.defaults.font.size = 28;

grafico_meses = new Chart(grafico1, {
	type: 'line',
    data: {
      labels: [
				"Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
				"Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      datasets: [{
        label: 'Movimentos por mês',
        data: [0],
        borderWidth: 4
      }]
    },
	options: {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					stepSize: 2,
					precision: 1
				}
			}
		},
		plugins: {
			legend: {
				labels: {
					font: {
						size: 32
					}
				}
			}
		}
	}
});



grafico_servicos = new Chart(grafico2, {
	type: 'bar',
    data: {
      labels: ["Banho de gel", "Blindagem", "Cílios", "Depilação",
				"Design", "Design em Henna", "Gel na tips", "Postiças",
				"Spa para pés", "Mão", "Mão e Pé", "Pé"],
      datasets: [{
        label: 'Serviços mais realizados',
        data: [0],
		backgroundColor: [
			'#ffb3ba',
			'#ffdfba',
			'#ffffba',
			'#baffc9',
			'#bae1ff',
			'#66545e',
			'#a39193',
			'#aa6f73',
			'#eea990',
			'#f6e0b5',
			'#f7cac9',
			'#dec2cb',
		],
        borderWidth: 2
      }]
    },
	options: {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					stepSize: 2,
					precision: 1
				}
			}
		},
		plugins: {
			legend: {
				labels: {
					font: {
						size: 32
					}
				}
			}
		}
	}
});



grafico_pagamentos = new Chart(grafico3, {
	type: 'pie',
    data: {
      labels: [
				"Credito", "Debito", "Dinheiro", "Pix", "Outro"],
      datasets: [{
        label: 'Movimentos por mês',
        data: [0],
		backgroundColor: [
			'#ffb3ba',
			'#ffdfba',
			'#ffffba',
			'#baffc9',
			'#bae1ff'
		],
        borderWidth: 2
      }]
    },
	options: {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					stepSize: 2,
					precision: 1
				}
			}
		},
		plugins: {
			legend: {
				labels: {
					font: {
						size: 32
					}
				}
			}
		}
	}
});



document.getElementById("slcn_ano").addEventListener("change", e => {
	ano = parseInt(e.target.value);
	atualizar_graf(ano, ntop);
});

document.getElementById("slcn_top").addEventListener("change", e => {
	ntop = parseInt(e.target.value);
	atualizar_graf(ano, ntop);
});

//----------------------------------------Chamadas de funções----------------------------------------
testar_conexao();
