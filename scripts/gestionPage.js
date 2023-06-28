//--------------------------------------------------------------------------------------//
// variables globales
//--------------------------------------------------------------------------------------//
// initialisation

function initialisePage() { 
	// initialise l'affichage des vues
	initialiseVues();
	
	// affichage des éléments particuliers
	//affiche_questions(listeQuestionsTypes, true); 
}


//--------------------------------------------------------------------------------------//
function affiche_questions(nouvelles_questions, nouveau_theme) {
    // nouvelles_questions.forEach(function(question, index) {
    //     console.log("Question " + (index+1) + " : " + question);
    // });

    var tableau_liste_questions = document.getElementById("tableQuestions");

    const nombre_questions_initiales = nouveau_theme ? 0 : listeQuestions.length;

    if(nouveau_theme) {
        // on efface tout le tableau
        while (tableau_liste_questions.firstChild) {
            tableau_liste_questions.removeChild(tableau_liste_questions.firstChild);
        }

        listeQuestions = nouvelles_questions;
    } else {        
        listeQuestions = listeQuestions.concat(nouvelles_questions);
    }

    var tblBody = document.createElement("tbody");
    tblBody.setAttribute("id", "corps_table_liste_questions");

    // pour toutes les questions
    nouvelles_questions.forEach(function(question, index) {	

        var ligne = document.createElement("tr");

        var cellule_question = document.createElement("td");
        var texte_cellule_question = document.createTextNode(question);
        cellule_question.appendChild(texte_cellule_question);
        ligne.appendChild(cellule_question);

        var cellule_edit = document.createElement("td");
        cellule_edit.innerHTML = '<i class="fas fa-pen"></i>';
        cellule_edit.setAttribute("onclick", "edit_question(" + (index + nombre_questions_initiales) + ");");
        ligne.appendChild(cellule_edit);

        var cellule_delete = document.createElement("td");
        cellule_delete.innerHTML = '<i class="fas fa-trash"></i>';
        cellule_delete.setAttribute("onclick", "supprime_Question(" + (index + nombre_questions_initiales) + ");");
        ligne.appendChild(cellule_delete);
    
        tblBody.appendChild(ligne);

    });

    tableau_liste_questions.appendChild(tblBody);

    afficheVue("pageValidationQuestion");    
}

//--------------------------------------------------------------------------------------//
function edit_question(i) {    
    const corps_table = document.getElementById("corps_table_liste_questions");
    let index = 0;
    for (const ligne of corps_table.children) {        

        if(index == i) {
            // on enleve tout le contenu
            while(ligne.firstChild) {
                ligne.removeChild(ligne.firstChild);
            }

            // texte editable
            var cellule_question = document.createElement("td");
            var texte_editable = document.createElement("input");
            texte_editable.setAttribute("id","texte_editable_modif_question");
            texte_editable.setAttribute("type", "text");
            texte_editable.setAttribute("class", "u-full-with");
            texte_editable.setAttribute("size",60)
            texte_editable.value = listeQuestions[i];
            cellule_question.appendChild(texte_editable);
            ligne.appendChild(cellule_question);

            var cellule_valide = document.createElement("td");
            cellule_valide.innerHTML = '<i class="fas fa-check"></i>';
            cellule_valide.setAttribute("onclick", "modifie_question(" + index + ");");
            ligne.appendChild(cellule_valide);
    
            var cellule_cancel = document.createElement("td");
            cellule_cancel.innerHTML = '<i class="fas fa-times"></i>';
            cellule_cancel.setAttribute("onclick", "termine_modifications_question(" + index + ");");
            ligne.appendChild(cellule_cancel);    
        }

        index++;
    }
}

function modifie_question(i) {
    listeQuestions[i] = document.getElementById("texte_editable_modif_question").value;
    termine_modifications_question(i);
}

//--------------------------------------------------------------------------------------//
function termine_modifications_question(i) {    
    const corps_table = document.getElementById("corps_table_liste_questions");
    let index = 0;
    for (const ligne of corps_table.children) {        

        if(index == i) {
            // on enleve tout le contenu
            while(ligne.firstChild) {
                ligne.removeChild(ligne.firstChild);
            }

            // texte editable
            var cellule_question = document.createElement("td");
            var texte_cellule_question = document.createTextNode(listeQuestions[i]);
            cellule_question.appendChild(texte_cellule_question);
            ligne.appendChild(cellule_question);

            var cellule_edit = document.createElement("td");
            cellule_edit.innerHTML = '<i class="fas fa-pen"></i>';
            cellule_edit.setAttribute("onclick", "edit_question(" + index + ");");
            ligne.appendChild(cellule_edit);
    
            var cellule_delete = document.createElement("td");
            cellule_delete.innerHTML = '<i class="fas fa-trash"></i>';
            cellule_delete.setAttribute("onclick", "supprime_Question(" + index + ");");
            ligne.appendChild(cellule_delete);    
        }

        index++;
    }
}


//--------------------------------------------------------------------------------------//
function affiche_reponse_I(i) {
    document.getElementById("numeroQuestion").textContent = i+1;
	document.getElementById("nombreQuestions").textContent = listeQuestionsReponses.length;
    document.getElementById("texteQuestion").textContent = listeQuestionsReponses[i].question;
    document.getElementById("reponseQuestion").value = listeQuestionsReponses[i].reponse;	
	document.getElementById("btn_question_suivante").setAttribute("onclick", "valide_reponse_I(" + i + ");");

	var derniere_question = (i === (listeQuestionsReponses.length-1));
	if(derniere_question) {
        document.getElementById("btn_question_suivante").setAttribute("class", "button-success u-full-width");
		document.getElementById("btn_question_suivante").innerHTML = '<i class="fas fa-check"></i> Terminer';
	}

    afficheVue("pageValidationReponses");
}

//--------------------------------------------------------------------------------------//
function valide_reponse_I(i) {
	// on enregristre les modifications
	listeQuestionsReponses[i].reponse = document.getElementById("reponseQuestion").value;

	// on passe à la question suivante
	var derniere_question = (i === (listeQuestionsReponses.length-1));
	if(derniere_question) {
		affiche_page_bilan();
	} else {
		affiche_reponse_I(i+1);
	}
}

//--------------------------------------------------------------------------------------//
function affiche_page_bilan() {
    var div_liste_QR = document.getElementById("divListeQR");
    
    // on efface tout le tableau
	while (div_liste_QR.firstChild) {
		div_liste_QR.removeChild(div_liste_QR.firstChild);
	}
    
    // pour toutes les questions
    listeQuestionsReponses.forEach(function(QR) {	

        var paragraphe1 = document.createElement("p");
		paragraphe1.innerHTML = "<strong>Question :</strong> " + QR.question;
        div_liste_QR.appendChild(paragraphe1);

		var paragraphe2 = document.createElement("p");
		paragraphe2.innerHTML = "<strong>Réponse :</strong>";
        div_liste_QR.appendChild(paragraphe2);

		var paragraphe3 = document.createElement("p");
		paragraphe3.innerHTML = QR.reponse;
		div_liste_QR.appendChild(paragraphe3);

		var element_hr = document.createElement("hr");
		div_liste_QR.appendChild(element_hr);

    });    

	afficheVue("pageSynthese");
}

