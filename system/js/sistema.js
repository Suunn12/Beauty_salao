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
		
		if(botao.classList.contains("btn_inicial")){
			//alert("inicial");
			window.location.href = "/Beauty_salao/index.html";
		}
		else if(botao.classList.contains("btn_agenda")){
			//alert("agenda");
			window.location.href = "/Beauty_salao/system/html/agenda.html";
		}
		else if(botao.classList.contains("btn_resumo")){
			//alert("resumo");
			window.location.href = "/Beauty_salao/system/html/resumo.html";
		}
	});
});


//________________ Chamadas ________________
