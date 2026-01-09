//________________ Script ________________
//________________ Globais ________________
let mat_agenda = [];
let mat_lista_nomes = [];



//________________ Funcoes ________________

//Testa a conexão e copia os valores do banco de dados
async function conexao_bd(){
	const rodape_conexao = document.getElementById("rodape_conexao");
	const{data, error} = await banco.from("clientes").select("id, nome").order("nome", { ascending: true });
	
	if(error){
		rodape_conexao.textContent = "Falha ao conectar: " + error.message + " // " + error;
		return false;

	} else {
		rodape_conexao.textContent = "Conectado a versão beta 1.0. © Sunny Rabbit";

	}

	data.forEach(x => {
		mat_agenda.push(x);
	});

	carregar_lista_nomes();

}

//Mapeia os nomes
function map_nomes(){
	return mat_agenda.map(x => x.nome);

}

//Carrega os nomes para a lista de clientes já cadastrados
function carregar_lista_nomes(){
	const agenda_nome_lista = document.getElementById("agenda_nome_lista");

	mat_lista_nomes = map_nomes();

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
	const formulario_texto_subtotal = document.getElementById("formulario_texto_subtotal");

	const servico_valor = 0;

	formulario_texto_auxi.textContent = "";
	
	const campos = [
		agenda_nome,
		agenda_nome_lista,
		agenda_data,
		agenda_hora,
		agenda_sevico,
		agenda_pagamento,
		agenda_parcela
	];

	campos.forEach(x => x.classList.remove("caixa_texto_invalido", "caixa_texto_valido"));

	if(agenda_nome.value.trim() === "" && agenda_nome_lista.value === "vazio"){
		agenda_nome.classList.add("caixa_texto_invalido");
		agenda_nome_lista.classList.add("caixa_texto_invalido");
		formulario_texto_auxi.textContent = "O nome deve ser preenchido ou selecionado.";
		return false;

	}

	if(agenda_sevico.value === "vazio"){
		agenda_sevico.classList.add("caixa_texto_invalido");
		formulario_texto_auxi.textContent = "O serviço deve ser preenchido.";
		return false;

	}

	if(agenda_data.value.trim() === ""){
		agenda_data.classList.add("caixa_texto_invalido");
		formulario_texto_auxi.textContent = "A data deve ser preenchida.";
		return false;

	}

	if(agenda_hora.value.trim() === ""){
		agenda_hora.classList.add("caixa_texto_invalido");
		formulario_texto_auxi.textContent = "A hora deve ser preenchida.";
		return false;

	}

	if(agenda_pagamento.value === "vazio"){
		agenda_pagamento.classList.add("caixa_texto_invalido");
		formulario_texto_auxi.textContent = "O pagamento deve ser preenchido.";
		return false;

	}

	if(agenda_parcela.value === "vazio"){
		agenda_parcela.classList.add("caixa_texto_invalido");
		formulario_texto_auxi.textContent = "A parcela deve ser preenchida.";
		return false;

	}

	if(agenda_nome.value.trim() === ""){
		agenda_nome.value = agenda_nome_lista.value;
	}

	if(agenda_pagamento.value !== "credito"){
		agenda_parcela.value = "1x";
	}

	alert("formulario enviado!");

	campos.forEach(x => x.classList.add("caixa_texto_valido"));

	return true;

}

//Envia os valores da agenda para o bando de dados
async function enviar_forms(){
	if(validar_agenda() == true){
		const{data, error} = await banco
		.from("servicos")
		.insert([{nome: agenda_nome.value,
				servico:agenda_sevico.value,
				data:agenda_data.value,
				hora:agenda_hora.value,
				pagamento:agenda_pagamento.value,
				parcelas:agenda_parcela.value,
				valor:servico_valor
			}]);
		
		formulario_texto_auxi.textContent = "Enviado com sucesso!";

	}
	
}

//________________ Estruturas ________________
const SUPABASE_URL = "https://jebltevthtldornlcgvu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplYmx0ZXZ0aHRsZG9ybmxjZ3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTIwODksImV4cCI6MjA4MDUyODA4OX0.eIuIL7nT5hBmdZB4m283w_dAe2M5RKVCJfbMKg0D-oI";

const banco = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


agenda_sevico.addEventListener("change", function(){
	const tab_valores = {
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
	

//________________ Chamadas ________________
conexao_bd();