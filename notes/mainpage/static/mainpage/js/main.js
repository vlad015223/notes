function editElementText(elementId) {
    const element = document.getElementById(elementId);
    makeElementEditable(element);
}

function makeElementEditable(element) {
    const editableElement = document.createElement('p');
    editableElement.textContent = element.textContent;
    editableElement.contentEditable = true;
    
    element.replaceWith(editableElement);
}

function saveChanges(elementId, field, recordId) {
    const editedElement = document.querySelector(`p[contenteditable=true]:first-child`);
    const editedText = editedElement.textContent;
    const csrfToken = document.querySelector('input[name=csrfmiddlewaretoken]').value;

    const data = { recordId, field, newContent: editedText };
    
    fetch('/update_record/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateElementText(elementId, editedText);
        } else {
            alert("Ошибка при сохранении изменений");
        }
    })
    .catch(error => {
        console.error(error);
        alert("Ошибка при отправке данных на сервер");
    });
}

function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    element.textContent = text;
}
