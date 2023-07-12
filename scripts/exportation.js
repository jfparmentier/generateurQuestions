//--------------------------------------------------------------------------------------//
function export_questions_Moodle () {
    // conversion en XML
    const nom_fichier = 'questions_ouvertes.xml';
	var qcmMoodleXML = creeXMLmoodle(nom_fichier);

	// telechargement du fichier
	var a         = document.createElement('a');
	a.href        = 'data:attachment/csv,' + encodeURIComponent(qcmMoodleXML);		   
	a.target      = '_blank';
	a.download    = nom_fichier;
	document.body.appendChild(a);
	a.click();
}

//--------------------------------------------------------------------------------------//
function export_questions_JSON() {
    // conversion en XML
    const nom_fichier = 'questions_ouvertes.json';
	var qcmMoodleJSON = JSON.stringify(listeQuestionsReponses);

	// telechargement du fichier
	var a         = document.createElement('a');
	a.href        = 'data:attachment/csv,' + encodeURIComponent(qcmMoodleJSON);		   
	a.target      = '_blank';
	a.download    = nom_fichier;
	document.body.appendChild(a);
	a.click();

}

function creeXMLmoodle(nomFichier) {
    // entete
    var contenu = enteteXMLmoodle();
    
    // categorie basee sur le nom du fichier
    //contenu += ecritCategorie(nomFichier);
    
    // ecriture des questions
	listeQuestionsReponses.forEach(function(QR) {
		contenu += ecritQuestionOuverte(QR.question, QR.reponse);
		contenu += ecritExplication(QR.question, QR.reponse);
	});
    
    // fin du fichier
    contenu += finXMLmoodle();

	return contenu;
}

function enteteXMLmoodle() {
	var entete = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + "\n";
	entete += "<quiz>" + "\n";
	return entete;
}

function finXMLmoodle() {
	var fin = "</quiz>";
	return fin;
}

function ecritQuestionOuverte(question, reponse) {
	// entete de la question
	var questionXML = "<question type=\"essay\">" + "\n";	

	// nom de la question
	questionXML += "<name><text>" + question + "</text></name>" +  "\n";

	// enonce de la question
	questionXML += "<questiontext format=\"html\">" + "\n";
	questionXML += "<text>" + question + "</text>" + "\n";
	questionXML += "</questiontext>" + "\n";

	// feedback
	questionXML += "<generalfeedback format=\"html\">" + "\n";
	questionXML += "<text>" + reponse + "</text>";
	questionXML += "</generalfeedback>" + "\n";

	questionXML += "<responseformat>plain</responseformat>" + "\n";
    questionXML += "<responserequired>1</responserequired>" + "\n";

	questionXML += "</question>" + "\n";

	return questionXML;
}

function ecritExplication(question, reponse) {
	// entete de la question
	var questionXML = "<question type=\"description\">" + "\n";	

	// nom de la question
	questionXML += "<name><text>Rep : " + question + "</text></name>" +  "\n";

	// enonce de la question
	questionXML += "<questiontext format=\"html\">" + "\n";
	questionXML += "<text>" + reponse + "</text>" + "\n";
	questionXML += "</questiontext>" + "\n";

	// feedback
	questionXML += "<generalfeedback format=\"html\">" + "\n";
	questionXML += "<text></text>";
	questionXML += "</generalfeedback>" + "\n";

	questionXML += "</question>" + "\n";

	return questionXML;
}

function ecritCategorie(nomFichier) {
	var categorie = "<question type=\"category\">" + "\n";
    categorie += "<category>" + "\n";
    categorie += "<text>" + nomFichier + "</text>" + "\n";
	categorie += "</category>" + "\n";
    categorie += "<info format=\"html\">" + "\n";
    categorie += "<text></text>" + "\n";
    categorie += "</info>" + "\n";
	categorie += "</question>" + "\n" + "\n";
	
	return categorie;
}

function ecritQuestionQCM(question) {
	var questionXML = "<question type=\"multichoice\">" + "\n";
	
	// [...]

	return questionXML;
}