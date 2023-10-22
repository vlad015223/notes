console.log("JS загружается");
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

document.addEventListener("DOMContentLoaded", function () {
    // Обработчик нажатия на кнопку "Создать категорию"
    const createCategoryLink = document.getElementById("create-category-link");
    createCategoryLink.addEventListener("click", function (e) {
        e.preventDefault(); // Остановить стандартное действие перехода по ссылке
        console.log("Кнопка \"Создать категорию\" нажата");
        createCategory();
    });

    function createCategory() {
        // Выполнение AJAX-запроса для создания новой категории
        fetch("/create_category/", {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
        .then((response) => response.json())
        .then((data) => {
            // Обработка успешного ответа от сервера
            if (data.success) {
                // Создаем новую категорию и добавляем ее в цикл на странице
                const categoryList = document.querySelector(".list-articles");
                const newCategoryItem = document.createElement("li");
                newCategoryItem.innerHTML = `
                    <h2><p class="editableText" data-id="${data.category_id}" data-field="title">${data.category_title}</p></h2>
                    <div class="editableText" data-id="${data.category_id}" data-field="description" contenteditable="true">${data.category_description}</div>
                    <div class="clear"></div>
                    <p class="link-read-category">
                        <a href="{% url 'category' category_title=data.category_title %}">Перейти к заметкам</a>
                    </p>`;
                categoryList.appendChild(newCategoryItem);
    
                // Подключаем обработчики для новой категории
                const editableTextElements = newCategoryItem.querySelectorAll(".editableText");
                editableTextElements.forEach(element => {
                    element.addEventListener('click', function () {
                        this.contentEditable = true;
                        this.classList.add('editing');
                        this.focus();
                    });
    
                    element.addEventListener('blur', function () {
                        this.contentEditable = false;
                        this.classList.remove('editing');
    
                        // Получаем новое значение текста
                        const newContent = this.innerText;
    
                        // Идентификатор записи и поле для обновления из атрибутов
                        const categoryId = this.getAttribute('data-id');
                        const field = this.getAttribute('data-field');
    
                        // Отправляем POST-запрос на сервер для обновления записи
                        const data = { id: categoryId, field, new_content: newContent };
                        updateRecord(data);
                    });
                });
            } else {
                console.error("Ошибка при создании категории");
            }
        })
        .catch((error) => {
            console.error("Ошибка при отправке запроса: " + error);
        });
        location.reload();
    }    

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === name + "=") {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const categoryLinks = document.querySelectorAll(".link-read-category a");
    categoryLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault(); // Остановить стандартное действие перехода по ссылке

            // Извлекаем значение data-category-title
            const categoryTitle = this.getAttribute("data-category-title");

            // Создаем URL динамически и перенаправляем пользователя
            const categoryURL = `/category/${categoryTitle}/`;
            window.location.href = categoryURL;
        });
    });
});
