//________________ Script ________________
//________________ Globais ________________
//________________ Funcoes ________________
//________________ Estruturas ________________

//Anima os botoes padroes
const botao_padrao = document.querySelectorAll(".btn_padrao");

botao_padrao.forEach(botao => {
	botao.addEventListener("click", (e) => {
		e.preventDefault();
		botao.classList.add("abrir_botao");

	});
	botao.addEventListener("animationend", () => {
		botao.classList.remove("abrir_botao");
		
		const caminhoBase = window.location.pathname.includes("/Beauty_salao/")
			? "/Beauty_salao"
			: "";

		if(botao.classList.contains("btn_inicial")){
			window.location.href = caminhoBase + "/index.html";

		}
		else if(botao.classList.contains("btn_agenda")){
			window.location.href = caminhoBase + "/system/html/agenda.html";

		}
		else if(botao.classList.contains("btn_resumo")){
			window.location.href = caminhoBase + "/system/html/resumo.html";

		}
		else if(botao.classList.contains("btn_agendar")){
			enviar_forms();

		}

	});

});



//________________ Chamadas ________________