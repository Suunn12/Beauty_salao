//________________ Script ________________
//________________ Globais ________________
//________________ Funcoes ________________
//________________ Estruturas ________________

//Anima os botoes padroes
const botao_padrao = document.querySelectorAll(".btn_padrao");

botao_padrao.forEach(botao => {
	botao.addEventListener("click", () => {
		botao.classList.add("abrir_botao");
	});
	botao.addEventListener("animationend", () => {
		botao.classList.remove("abrir_botao");
		
		const caminhoBase = window.location.pathname.includes("/Beauty_salao/")
			? "/Beauty_salao/"
			: "";

		if(botao.classList.contains("btn_inicial")){
			//alert("inicial");
			window.location.href = "/index.html";
		}
		else if(botao.classList.contains("btn_agenda")){
			//alert("agenda");
			window.location.href = "/system/html/agenda.html";
		}
		else if(botao.classList.contains("btn_resumo")){
			//alert("resumo");
			window.location.href = "/system/html/resumo.html";
		}
		else if(botao.classList.contains("btn_agendar")){
			//alert("Agendamento realizado com sucesso!");
			//validar_agenda();
			enviar_forms();

		}

	});

});




//________________ Chamadas ________________

console.log(window.location.pathname);
