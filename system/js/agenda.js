//________________ Script ________________
//________________ Globais ________________
let mat_clientes = [];
let mat_servicos = [];

let clientes_gat = false;
let servicos_gat = false;

let mat_lista_nomes = [];
let mat_lista_datas_horas = [];

let servico_valor = 0;

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

//Mapeia os nomes dos clientes
function map_nome(){
	return mat_clientes.map(x => x.nome);

}

//Carrega os nomes para a lista de clientes já cadastrados
function carregar_lista_nomes(){
	const agenda_nome_lista = document.getElementById("agenda_nome_lista");

	mat_lista_nomes = map_nome();

	for(let x = 0; x < mat_lista_nomes.length; x++){
		const agenda_nome_lista_opcao = document.createElement("option");
		agenda_nome_lista_opcao.value = mat_lista_nomes[x];
		agenda_nome_lista_opcao.textContent = mat_lista_nomes[x];
		agenda_nome_lista.appendChild(agenda_nome_lista_opcao);

	}

}

//Valia os campos da tela de agendamento
function validar_agenda(){
	const agenda_nome = document.getElementById("agenda_nome");
	const agenda_nome_lista = document.getElementById("agenda_nome_lista");
	const agenda_sevico = document.getElementById("agenda_sevico");
	const agenda_data = document.getElementById("agenda_data");
	const agenda_hora = document.getElementById("agenda_hora");
	const agenda_pagamento = document.getElementById("agenda_pagamento");
	const agenda_parcela = document.getElementById("agenda_parcela");
	const formulario_texto_auxi = document.getElementById("formulario_texto_auxi");

	formulario_texto_auxi.textContent = "";
	
	const campos = [
		agenda_nome,
		agenda_nome_lista,
		agenda_sevico,
		agenda_data,
		agenda_hora,
		agenda_pagamento,
		agenda_parcela

	];

	//Remove as animações e efeitos dos campos do formulario
	campos.forEach(x => x.classList.remove("caixa_texto_invalido", "caixa_texto_atencao"));

	//Valida os campos de nome digitado e selecionado
	if(agenda_nome.value.trim() === "" && agenda_nome_lista.value === "vazio"){
		agenda_nome.classList.add("caixa_texto_invalido");
		agenda_nome_lista.classList.add("caixa_texto_invalido");
		formulario_texto_auxi.textContent = "O nome deve ser preenchido ou selecionado.";
		return false;

	}

	//Valida o campo de servicos
	if(agenda_sevico.value === "vazio"){
		agenda_sevico.classList.add("caixa_texto_invalido");
		formulario_texto_auxi.textContent = "O serviço deve ser preenchido.";
		return false;

	}

	//Valida o campo de data
	if(agenda_data.value.trim() === ""){
		agenda_data.classList.add("caixa_texto_invalido");
		formulario_texto_auxi.textContent = "A data deve ser preenchida.";
		return false;

	}

	//Valida o campo de hora
	if(agenda_hora.value.trim() === ""){
		agenda_hora.classList.add("caixa_texto_invalido");
		formulario_texto_auxi.textContent = "A hora deve ser preenchida.";
		return false;

	}

	//Valida a data e hora para escolhido com algum já agendado
	const data_hora_conflito = mat_servicos.some(x =>
		agenda_data.value === x.data &&
		agenda_hora.value + ":00" === x.hora

	);

	if(data_hora_conflito === true){
		agenda_data.classList.add("caixa_texto_atencao");
		agenda_hora.classList.add("caixa_texto_atencao");
		formulario_texto_auxi.textContent = "A data e hora preenchida está ocupada.";
		return false;

	}

	//Valida o campo de pagamentos
	if(agenda_pagamento.value === "vazio"){
		agenda_pagamento.classList.add("caixa_texto_invalido");
		formulario_texto_auxi.textContent = "O pagamento deve ser preenchido.";
		return false;

	}

	//Valida o campo de parcelas
	if(agenda_parcela.value === "vazio"){
		agenda_parcela.classList.add("caixa_texto_invalido");
		formulario_texto_auxi.textContent = "A parcela deve ser preenchida.";
		return false;

	}

	//Valida o campo de parcelas para 1x em qualquer opção exeto credito
	if(agenda_pagamento.value !== "credito"){
		agenda_parcela.value = "1x";

	}

	//Preenche o campo de nome digitado com o campo de nome selecionado
	if(agenda_nome.value.trim() === ""){
		agenda_nome.value = agenda_nome_lista.value;

	}

	//Anima os campos validados corretamente
	campos.forEach(x => {
		x.classList.remove("caixa_texto_valido");
		void x.offsetWidth; //força reflow
		x.classList.add("caixa_texto_valido");

	});

	return true;

}

//Envia os valores da agenda para o bando de dados
async function enviar_forms(){
	//tirar as aspas e corrigir para true quando quiser que realmente envie
	if(validar_agenda() === true){
		const{data, error} = await banco
		.from("servicos")
		.insert([{nome: agenda_nome.value,
				servico:agenda_sevico.value,
				data:agenda_data.value,
				hora:agenda_hora.value,
				pagamento:agenda_pagamento.value,
				parcelas:agenda_parcela.value,
				valor:servico_valor,
				status:"ativo"
			}]);
		
		formulario_texto_auxi.textContent = "Enviado com sucesso!";

		if(!map_nome().includes(agenda_nome.value)){
			const{data, error} = await banco.from("clientes").insert([{nome: agenda_nome.value}]);

		}

		agenda_nome.value = "";
	}
	
}

//________________ Estruturas ________________

//Define os parametros para a conexao com o banco de dados
const SUPABASE_URL = "https://jebltevthtldornlcgvu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplYmx0ZXZ0aHRsZG9ybmxjZ3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTIwODksImV4cCI6MjA4MDUyODA4OX0.eIuIL7nT5hBmdZB4m283w_dAe2M5RKVCJfbMKg0D-oI";

const banco = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

//Escuta a mudança no campo de servicos e escreve o valor na tela
agenda_sevico.addEventListener("change", function(){
	const formulario_texto_subtotal = document.getElementById("formulario_texto_subtotal");

	const tab_valores = {
		vazio:0,
		banho_de_gel:80,
		blindagem:45,
		cilios:110,
		depilacao:15,
		design:20,
		design_c_henna:35,
		gel_na_tips:100,
		manicure:30,
		manicure_e_pedicure:50,
		pedicure:30,
		posticas:50,
		spa_dos_pes:40
	}

	servico_valor = tab_valores[agenda_sevico.value];
	formulario_texto_subtotal.textContent = "Subtotal: R$" + servico_valor + ",00 💰";
});

//Inicializa a conexao, as chamadas de funções essencias e validacoes
async function inicializacao() {
	await conexao_bd_clientes();
	await conexao_bd_servicos();
	
	if(clientes_gat === true && servicos_gat === true){
		const rodape_conexao = document.getElementById("rodape_conexao");
		rodape_conexao.textContent = "Conectado a versão beta 1.0. © Sunny Rabbit";
	
		carregar_lista_nomes();
	
	}

}

//________________ Chamadas ________________
inicializacao();