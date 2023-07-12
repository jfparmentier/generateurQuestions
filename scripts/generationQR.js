var OPENAI_API_KEY = "";
var url_GPT = 'https://api.openai.com/v1/chat/completions';
var model_GPT = "gpt-3.5-turbo-16k"; // alternative : "gpt-3.5-turbo"

var listeQuestionsTypes = [["Que signifie ... ?",
    "Quelle est la cause de ... ?", 
    "Décrivez ... avec vos propres mots.",
    "Expliquez pourquoi ...",
    "Comment ... pourrait-il affecter ... ?",
    "Donnez un nouvel exemple de ... ?",
    "Comment utiliseriez-vous ... pour... ?",
    "A votre avis, que se passerait-il si ... ?",
    "Comment ... pourrait-il affecter ... ?"],
    ["Résumez ... avec vos propres mots.",
    "Comment utiliseriez-vous ... pour... ?",
    "En quoi ... et ... sont-ils similaires ?",
    "En quoi ... et ... sont-ils différents ?",
    "Comparez ... et ... au regard de ... .",
    "Quelles sont les forces et les faiblesses de ... ?",
    "A votre avis, qu’est-ce qui cause ... ? Pourquoi ?",
    "Êtes-vous d’accord ou non avec l’affirmation suivante : ... ?"]];

var selectionQuestion = 0;

var listeQuestions = [];
var listeQuestionsReponses = [];

function resume_PDF() {
    afficheVue("resume_en_cours"); // si on regénère le résumé

    var oHttp = new XMLHttpRequest();
    oHttp.open("POST", url_GPT);
    oHttp.setRequestHeader("Accept", "application/json");
    oHttp.setRequestHeader("Content-Type", "application/json");
    oHttp.setRequestHeader("Authorization", "Bearer " + OPENAI_API_KEY)

    oHttp.onreadystatechange = function () {
        if (oHttp.readyState === 4) {                    
            var oJson = {};
            try {
                oJson = JSON.parse(oHttp.responseText);
            } catch (ex) {
                console.log("Error: " + ex.message);
            }
            oJson = JSON.parse(oHttp.responseText);
            var reponseGPT_str = oJson.choices[0].message.content;
            document.getElementById("resumeCours").value = reponseGPT_str;            
            afficheVue("validationResume");
        }
    }

    var prompt = "Voici le contenu d'un cours : \n\n";
    prompt += texte_pdf;
    prompt += "\n\nQuelles sont les 7 idées principales de ce cours ? Explique chacune de celles-ci en trois lignes.";
    //console.log(prompt);

    data = {        
        model: model_GPT,
        temperature: 0.7,
        messages: [
            {
                "role": "system",
                "content": "Tu es un enseignant qui fait réfléchir en profondeur aux concepts que tu enseignes."
            },
            {
                "role": "user", //system,user,assistant
                "content": prompt
            }
        ]
    }

    oHttp.send(JSON.stringify(data));    
}


function genere_questions(temperature, nouveau_theme) {    

    afficheVue("generation_questions_en_cours"); // si on reregénère les questions
    afficheVue("pageListeQuestions");
 
    var oHttp = new XMLHttpRequest();
    oHttp.open("POST", url_GPT);
    oHttp.setRequestHeader("Accept", "application/json");
    oHttp.setRequestHeader("Content-Type", "application/json");
    oHttp.setRequestHeader("Authorization", "Bearer " + OPENAI_API_KEY)

    oHttp.onreadystatechange = function () {
        if (oHttp.readyState === 4) {
                    
            var oJson = {};
            try {
                oJson = JSON.parse(oHttp.responseText);
            } catch (ex) {
                console.log("Error: " + ex.message);
            }
            oJson = JSON.parse(oHttp.responseText);
            //console.log(oJson);
            var reponseGPT_str = oJson.choices[0].message.content;            
            var reponseGPT_liste = reponseGPT_str.split(/\r?\n/).filter(element => element);
            affiche_questions(reponseGPT_liste, nouveau_theme);
        }
    }

    var resumeCours = document.getElementById("resumeCours").value;

    var fin_prompt = "Complète la liste de questions à trous-ci dessous en utilisant les idées principales du cours dans un ordre quelconque.\n\n";
    //var fin_prompt = "Complète la liste de questions à trous-ci dessous en utilisant les idées principales du cours de manière la plus pertinente possible.\n\n";

    var questions_types = listeQuestionsTypes[selectionQuestion];                  // selectionne parmi une première liste
    selectionQuestion = (selectionQuestion + 1) % listeQuestionsTypes.length; // la prochaine fois on change de questions

    questions_types.forEach(function(texte_question) {
        fin_prompt += texte_question + "\n";
    });
    fin_prompt += "\n\nUtilise une ligne par question et commence celle-ci directement par la question sans utiliser de numérotation ni de tirets."    
    var prompt = "Voici les idées principales d'un cours : \n\n" + resumeCours + "\n\n" + fin_prompt;
    //console.log(prompt);

    data = {
        model: model_GPT,
        temperature: temperature,
        messages: [
            {
                "role": "system",
                "content": "Tu es un enseignant qui fait réfléchir en profondeur aux concepts que tu enseignes."
            },
            {
                "role": "user", //system,user,assistant
                "content": prompt
            }
        ]
    }

    oHttp.send(JSON.stringify(data));
}


function supprime_Question(i) {
    listeQuestions.splice(i, 1);
    affiche_questions(listeQuestions, true);
}


function genere_reponses() {
    afficheVue("pageListeReponses");

    var oHttp = new XMLHttpRequest();
    oHttp.open("POST", url_GPT);
    oHttp.setRequestHeader("Accept", "application/json");
    oHttp.setRequestHeader("Content-Type", "application/json");
    oHttp.setRequestHeader("Authorization", "Bearer " + OPENAI_API_KEY)

    oHttp.onreadystatechange = function () {
        if (oHttp.readyState === 4) {                    
            var oJson = {};
            try {
                oJson = JSON.parse(oHttp.responseText);
            } catch (ex) {
                console.log("Error: " + ex.message);
            }
            oJson = JSON.parse(oHttp.responseText);
            //console.log(oJson);
            var reponseGPT_str = oJson.choices[0].message.content;
            //console.log(reponseGPT_str);

            // résoud le bug de la "," après le dernier element du tableau            
            reponseGPT_str = reponseGPT_str.replace(",\n]","]");            

            try {
                listeQuestionsReponses = JSON.parse(reponseGPT_str);
            } catch(ex) {
                console.log("Erreur : " + reponseGPT_str);
            }

            affiche_reponse_I(0);
        }
    }

    var prompt = "Voici les idées principales d'un cours : \n\n";
    prompt += document.getElementById("resumeCours").value + "\n\n";
    prompt += "Voici un fichier JSON qui contient des questions. Complète le champ réponse pour chacune des questions en utilisant les idées principales utilisées dans le cours.\n\n";
    
    var listeJSON = "[\n";
    listeQuestions.forEach(function(question, index) {
        let element = {question : question, reponse : ""}
        let fin_chaine = (index === listeQuestions.length - 1) ? "\n" : ",\n";
        listeJSON += JSON.stringify(element) + fin_chaine;
    });
    listeJSON += "]"
    
    prompt += listeJSON;
    //console.log(prompt);

    data = {        
        model: model_GPT,
        temperature: 0.7,
        messages: [
            {
                "role": "system",
                "content": "Tu es un enseignant qui fait réfléchir en profondeur aux concepts que tu enseignes."
            },
            {
                "role": "user", //system,user,assistant
                "content": prompt
            }
        ]
    }

    oHttp.send(JSON.stringify(data));
}

