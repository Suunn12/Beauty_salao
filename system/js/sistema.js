//________________ Script ________________
//________________ Globais ________________
//________________ Funcoes ________________
//________________ Estruturas ________________

//Anima os botoes padroes
document.addEventListener("click", (e) => {
  	const botao = e.target.closest(".btn_padrao");
  	if (!botao) return;

	e.preventDefault();
	botao.classList.add("abrir_botao");

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

		else if(botao.classList.contains("btn_apagar")){
			const linha = botao.closest("tr");
			const caixa = linha.querySelector(".caixa_apagar");
			const linha_id = botao.dataset.id;

			document.querySelectorAll(".caixa_apagar:not(.escondido)")
				.forEach(x => x.classList.add("escondido"));

			caixa.classList.remove("escondido");

			console.log(linha);
			console.log(caixa);

		}
		
		else if(botao.classList.contains("apagar_opcao_sim")){
			const caixa = botao.closest("div");
			const caixa_id = caixa.dataset.id;

			apagar_linha(caixa_id);
		}
		
		else if(botao.classList.contains("apagar_opcao_nao")){
			const caixa = botao.closest("div");
			caixa.classList.add("escondido");

		}

	}, { once: true });

});



//________________ Chamadas ________________