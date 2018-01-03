/* 
		Синглтон GCTester принимает в качестве аргумента один массив
	правильных ответов. В массиве должны быть номера правильных ответов,
	считая от нуля, расположенные в порядке задавания вопросов. Для 
	вопросов, где используется checkbox обязательно передаётся массив ответов,
	независимо от их (правильных ответов) количества.
		Для работы класс необходима форма с id = "GCTest", внутри которой
	Находится текст теста, причём каждый вопрос начинается с символа «~»,
	а каждый ответ начинается с символа «^». Вопрос, в котором может
	быть (теоретически) несколько вариантов ответа должен начинаться
	с сочетания символов «~*».
		В вопросах и ответах можно использовать: символ «*» в любом месте. 
	Использовать html-теги не получится, текст вопроса заключается в тег <pre>.
		В вопросах и ответах нельзя использовать служебные символы
	(«~», «^»), кроме как в соответствующих местах, предусмотренных этой
	инструкцией.
*/
function GCTester(rightArray) {
	if (!this.constructor.notFirstStart) { /* Только один экземпляр! */
		this.constructor.notFirstStart = this;
	} else {
		return this.constructor.notFirstStart;
	}
	var testSource = document.getElementById("GCTest");
	var questions = testSource.innerHTML.split("~");
	var x, y, div, quest, answer, button, label, questionNumber;
	var multiple = false, thisRight = false, now = -1, questsElements = [];
	var answersTemp, rightAnswersMultipleCount, rightAnswersCount = 0;
	var testCaption = document.createElement("p"), txtResult, pre;
	testCaption.className = "GCTestCaption";
	testCaption.innerHTML = questions[0];
 	testSource.innerHTML = "";
	testSource.appendChild(testCaption);
	/* Вспомогательная функция, проверяет наличие значения в массиве (нестрогое соответствие) */
	function checkInArray(array, txt) {
		for (var x = 0; x < array.length; x++) {
			if (array[x] == txt) return true;
		}
		return false;
	}
	for(x = 1; x < questions.length; x++) {
		questions[x] = questions[x].split("^"); /* Разбираем варианты ответа */
		div = document.createElement("div");
		div.className = "GCTestBlock";
 		questionNumber = document.createElement("p");
		questionNumber.className 	= "GCTestQNumber";
		questionNumber.innerHTML = "Вопрос " + x + " из " + (questions.length - 1);
		div.appendChild(questionNumber);
		quest = document.createElement("p");
		quest.className = "GCTestQuestion";
		if(questions[x][0].substr(0,1) === "*") {
			multiple = true;
			questions[x][0] = questions[x][0].substr(1);
		} else {
			multiple = false;
		}
		pre = document.createElement("pre")
		pre.className = "GCTestQuestion";
		pre.innerHTML = questions[x][0]
		quest.appendChild(pre);
		div.appendChild(quest);
		for(y = 1; y < questions[x].length; y++) {
			answer = document.createElement("input");
			label = document.createElement("p");
 			answer.type = multiple ? "checkbox" : "radio";
			answer.name = "q" + x;
			label.className = "GCTestAnswer";
 			label.appendChild(answer); 
			label.innerHTML += y + ". " + questions[x][y];
			div.appendChild(label);
		}
		questsElements.push(div);
	}
	this.constructor.prototype.analyzer = function () {
		rightAnswersMultipleCount = 0;
		if (now === -1) {
			testSource.insertBefore(questsElements[0], button);
			now++;
		} else if (now <= questsElements.length) {
			if (rightArray[now] instanceof Array) {
				answersTemp = testSource.querySelectorAll("input[type=checkbox]");
				multiple = true;
			} else {
				answersTemp = testSource.querySelectorAll("input[type=radio]");
				multiple = false;
			}
			if (answersTemp.length === 0) {
				alert("Допущена ошибка при формировании теста. Обратитесь к автору текста теста. Ответы, скорее всего, будут подсчитаны неверно, потому тест прерван.");
				thisRight = false;
			} else {
				if (multiple) {
					for (x = 0; x < answersTemp.length; x++) {
						if (answersTemp[x].checked) {
							if (!checkInArray(rightArray[now],x)){
								thisRight = false;
								break;
							} else {
								rightAnswersMultipleCount++;
							}
						}
					}
					if (rightAnswersMultipleCount !== rightArray[now].length) {
						thisRight = false;
					} else {
						thisRight = true;
					}
				} else {
					if (answersTemp[rightArray[now]].checked) {
						thisRight = true;
					} else {
						thisRight = false;
					}
				}
				if (thisRight) {
					rightAnswersCount++;
				}
				if (now >= questsElements.length - 1) {
					testSource.removeChild(questsElements[now]);
					testSource.removeChild(button);
					txtResult = "<p class = 'GCTestResult'>Тест завершён<p>";
					txtResult += "<p class = 'GCTestResult'>Вы дали верных ответов: " + rightAnswersCount + ".<p>";
					txtResult += "<p class = 'GCTestResult'>Вы набрали процентов: " + (rightAnswersCount / questsElements.length * 100).toFixed(1) + "%" + ".<p>";
					testSource.innerHTML += txtResult;
					return;
				}
				testSource.removeChild(questsElements[now]);
				testSource.insertBefore(questsElements[++now], button);
			}
		}
	}
	button = document.createElement("input");
	button.value = "Далее";
	button.type = "button";
	button.onclick = this.analyzer;
	button.className = "GCTestButton";
	testSource.appendChild(button);
	button.onclick();
}
