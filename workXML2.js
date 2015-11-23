/**
* Lab 1
*/

var documentXML;
// The fuction that controls downloading text from the file to parse into html.
window.onload = function(){
    document.getElementById("NewType").value = 0;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "input.xml", false);
    xmlhttp.send();
    documentXML = xmlhttp.responseXML;
    if (documentXML) parsingXMLfile(documentXML);
}

// The function that parsed the XML file to fields: id, name, description, type and value.
// @param xml document
function parsingXMLfile(xmlDocumentEx){
    var parametrs = xmlDocumentEx.getElementsByTagName("Parameter");
    for (var i = 0; i < parametrs.length; i++)
    {
        var field = new Object();
        field.id = parametrs[i].getElementsByTagName("Id")[0].firstChild.nodeValue;
        field.name = parametrs[i].getElementsByTagName("Name")[0].firstChild.nodeValue;
        field.description = parametrs[i].getElementsByTagName("Description")[0].firstChild.nodeValue;
        field.type = parametrs[i].getElementsByTagName("Type")[0].firstChild.nodeValue;
        field.type = field.type.replace('System.', '');
        field.value = parametrs[i].getElementsByTagName("Value")[0].firstChild.nodeValue;
        paramPrinting(field);
    }
}
 
//The function that printed downloading text from the file and generates output string to html.
// @param - field - element from downloading text
// Button "Удалить" - ID - Название - Описание.
function paramPrinting(field){
    var elemOfHTML = document.createElement("p");
    elemOfHTML.setAttribute("class", "Parameter");
    elemOfHTML.setAttribute("id", field.id);
    elemOfHTML.setAttribute("Name", field.name);
    elemOfHTML.setAttribute("Description", field.description);
    elemOfHTML.setAttribute("type", field.type);
    elemOfHTML.setAttribute("value", field.value);
    document.getElementById("Content").appendChild(elemOfHTML);
	// generate to html type and value from xml file -> paramTypeValue()
    var paramtype = paramTypeValue(field.type, field.value);
    var outputSTRING = "<a id=\"DeleteButton\" onclick=\'DeleteButtonParam(this.parentNode)\'/>Удалить</a>";
    outputSTRING += "     Id: ".bold() + field.id + "; Название: ".bold() + field.name
                            + "; Описание: ".bold() + field.description + paramtype + "</br>";
    elemOfHTML.innerHTML = outputSTRING;
}

//The function that return generated output string to html with type and value from xml file.
//@param type and value of parameter.
function paramTypeValue(type, value){
    var stringwithValue = "; Тип: ".bold() + type + "; Значение: ".bold();
    switch (type)
    {   case 'String':
            if (value === "")
            return stringwithValue + "<input oninput=\'setelementValue(this, this.parentNode, false)\' type=\'text\' />";
            return stringwithValue + "<input oninput=\'setelementValue(this, this.parentNode, false)\' type=\'text\' value=\'" + value + "\' />";
        case 'Int32':
            return stringwithValue + "<input oninput=\'setelementValue(this, this.parentNode, true); checkForNumber(this, this.parentNode, true)\' type=\'text\' value=" + value + " />";
        case 'Boolean':
            var checkbox = "";
            if (value === "True" )
                checkbox = "checked";
            return stringwithValue + "<input oninput=\'setelementValue(this, this.parentNode, false)\' type=\'checkbox\'" + checkbox + "/>";
    }
}

//The function that define from the XML file type of the parameters.
// Type: boolean - true or false, number (int32) or text (string).
function setelementValue(child_node, parent_node, isNumber){
    if (parent_node.getAttribute("type") == "Boolean")
    {   if( child_node.checked )
            parent_node.setAttribute('value', "True");
        else
            parent_node.setAttribute('value', "False");
    }
    else
    {   if( isNumber == true)
        {
            if (!(/\-?[1-9][0-9]*$/.test(child_node.value))) {
                if (!(child_node.value == "") && !(child_node.value == "-"))
                    child_node.value = parent_node.getAttribute('value');
            }
            else
            {
                if ((/\d+-\d/).test(child_node.value))
                {
                    child_node.value = parent_node.getAttribute('value');
                }
                if ((/--/).test(child_node.value))
                {
                    child_node.value = child_node.value.replace("--", "-");
                }
            }

        }
        parent_node.setAttribute('value', child_node.value);
    }
}

// The function that checked number from field of html
function checkForNumber(field){
    var exp = new RegExp("(^([+-]?)([1-9]+?)[0-9]*$)|^0$");
    if (!exp.test(field.value))
    {
        alert("It's not a number!");
        field.value = field.getAttribute("value");
    }
}

//The function for button "Сохранить" that activated by pressing it.
// It saved new parameters (new id, new name, new description, new type and new value, and printing them or cancelling it all.
function SaveButtonParam(){
    var form = document.getElementById("NewParameter")
    var field = new Object();
    field.id = document.getElementById("NewId").value;
    field.name = document.getElementById("NewName").value;
    field.description = document.getElementById("NewDescription").value;
    field.type = getComboboxtype();
    field.value = getNewValue(field.type);
	//field.value = getNewValue(field.type);
    if (checking(field))
    return;
    paramPrinting(field);
    CanselButtonParam();
}

//The function that check and add the new description from field of parameters.  
function checking(field){
    var result = false;
	// id
    if (field.id == "")
    { result = true;}
    // name
    if (field.name == "")
    { result = true;}
    // description
    if (field.description == "")
    { result = true;}
    // value
    if (field.value == "Int32")
    {
        if (!(/(^([+-]?)([1-9]+?)[0-9]*$)|^0$/.test(field.value)))
        {   document.getElementById("NewDescription").value = "";
            result = true;
        }
    }
    return result;
}

// The function that get new type from combobox to html.
function getComboboxtype(){
    var curtype = document.getElementById("NewType").value;
    switch (curtype)
    {
        case "0":
            return "String";
        case "1":
            return "Int32";
        case "2":
            return "Boolean";
    }
}

// The function that get new value to html: string, int32, boolean - true or false
function getNewValue(type){
    switch (type) {
        case "String":
        case "Int32":
        { return document.getElementById("NewValue").value; }
        case "Boolean":
        { if (document.getElementById("NewValue").checked)
            { return "True"; }
            else { return "False"; }
        }
    }
}

// The fucntion that changing the type of new parameter such as text, number or boolean from checkbox
function changeTypeOfComboBox(){
    var current_type = document.getElementById("NewType").value;
    if (current_type == "0"){  
	// text 
	 document.getElementById("NewValue").setAttribute("type", "text");  
     return;
    }
    if (current_type == "1"){
	// number
     document.getElementById("NewValue").setAttribute("type", "number");
     document.getElementById("NewValue").value = 0;
      return;
    }
    else{
	// checkbox	
      document.getElementById("NewValue").setAttribute("type", "checkbox");
      document.getElementById("NewValue").value = "";
    }
}

// The function that downloaded the output XML file  with link 
function downloadXMLFILE(fileName, type){
    var text = generatingXMLFILE();
    var file = new Blob([text], { type: type });
    var linkToTheFile = document.getElementById("linkToTheFile");
    linkToTheFile.href = URL.createObjectURL(file);
    linkToTheFile.download = fileName;
    document.getElementById('linkToTheFile').click();
}

// The function that delete string with parameters 
function DeleteButtonParam(child_node){
    child_node.parentNode.removeChild(child_node);
}

//The function for button "Добавить" that activated by pressing it.
function AddButtonParam(){
    document.getElementById("NewParameter").hidden = false;
    document.getElementById("addButton").hidden = "hidden";
    document.getElementById("downloadButton").hidden = "hidden";
}

// The function for button "Отмена" that activated by pressing it.
function CanselButtonParam(){
    document.getElementById("NewParameter").hidden = "hidden";
    document.getElementById("addButton").hidden = false;
    document.getElementById("downloadButton").hidden = false;
}

// The function that generate XML file as writing new document with parameters
function generatingXMLFILE(){
    var fieldxml = document.getElementById("Content").getElementsByTagName("p");
    var stringXML = "<?xml version=\"1.0\"?>\n";
    stringXML += "<Parameters>\n";
    for (var i = 0; i < fieldxml.length; i++){
        type = fieldxml[i].getAttribute("type");
        stringXML += "<Parameter>\n";
        stringXML += "<Id>" + fieldxml[i].getAttribute("id") + "</Id>\n";
        stringXML += "<Name>" + fieldxml[i].getAttribute("name") + "</Name>\n";
        stringXML += "<Description>" + fieldxml[i].getAttribute("description") + "</Description>\n";
        stringXML += "<Type>System." + type;
        stringXML += "</Type>\n";
        stringXML += "<Value>" + fieldxml[i].getAttribute("value") + "</Value>\n";
        stringXML += "</Parameter>";}
        stringXML += "</Parameters>";
    return stringXML;
}
