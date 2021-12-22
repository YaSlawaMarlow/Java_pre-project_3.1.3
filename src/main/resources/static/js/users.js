//Массив ролей на весь код
let roleList = [];

//Получаем сразу всех пользователей
getAllUsers();

function getAllUsers() {
    //вытаскиваем JSON из REST и скидываем в data
    $.getJSON("http://localhost:8080/allUsers", function (data) {
        //Пустая переменная -- строки
        let rows = '';
        //Для каждого юзера -- строка
        $.each(data, function (key, user) {
            rows += createRows(user);
        });
        //Добавляем строки в таблицу tableAllUsers
        $('#tableAllUsers').append(rows);

        //Грузим роли
        $.ajax({
            url: '/admin/roles',
            method: 'GET',
            dataType: 'json',
            success: function (roles) {
                roleList = roles;
            }
        });
    });
}


//Строка в таблице для юзера
function createRows(user) {


    let user_data = '<tr id=' + user.id + '>';
    user_data += '<td>' + user.id + '</td>';
    user_data += '<td>' + user.name + '</td>';
    user_data += '<td>' + user.lastName + '</td>';
    user_data += '<td>' + user.age + '</td>';
    user_data += '<td>' + user.email + '</td>';
    user_data += '<td>';
    let roles = user.roles;
    for (let role of roles) {
        user_data += role.role + ' ';
    }
    user_data += '</td>';

    // Кнопки
    user_data +=

        '<td>' +
        '<input id="btnEdit" ' +
        'value="Edit" ' +
        'type="button" ' +
        'class="btn-info btn edit-btn" ' +
        'data-toggle="modal" ' +
        'data-target="#editModal" ' +
        'data-id="' + user.id + '">' +
        '</td>' +

        '<td>' +
        '<input id="btnDelete" ' +
        'value="Delete" ' +
        'type="button" ' +
        'class="btn btn-danger del-btn" ' +
        'data-toggle="modal" ' +
        'data-target="#deleteModal" ' +
        'data-id=" ' + user.id + ' ">' +
        '</td>';

    user_data += '</tr>';

    return user_data;
}


// Роли для EditUser
function getUserRolesForEdit() {
    var allRoles = [];
    $.each($("select[name='editRoles'] option:selected"), function () {
        var role = {};
        role.id = $(this).attr('id');
        role.role = $(this).attr('role');
        allRoles.push(role);
    });
    return allRoles;
}


// Клик по кнопке эдит
$(document).on('click', '.edit-btn', function () {
    //Переменной user_id мы присваеваем значение из data-id -- у какого пользователя нажалась кнопка
    const user_id = $(this).attr('data-id');
    //Отправляем запрос, получаем пользователя и все его поля, это нужно, чтобы заполнить соотв. форму.
    $.ajax({
        url: '/admin/' + user_id,
        method: 'GET',
        dataType: 'json',
        success: function (user) {
            $('#editId').val(user.id);
            $('#editName').val(user.name);
            $('#editLastName').val(user.lastName);
            $('#editAge').val(user.age);
            $('#editEmail').val(user.email);
            $('#editPassword').val(user.password);
            $('#editRole').empty();
            roleList.map(role => {
                $('#editRole').append('<option id="' + role.id + '" ' + ' name="' + role.role + '" >' +
                    role.role + '</option>')
            })
        }
    });
});

// кнопка Edit - в модальном окне
$('#editButton').on('click', (e) => {
    //Останавливаем действия по умолчанию у кнопки
    e.preventDefault();
    //Получаем текущий id юзера
    let userEditId = $('#editId').val();
    //Заносим в переменную обновленного юзера, получая данные из полей формы.
    var editUser = {
        id: $("input[name='id']").val(),
        name: $("input[name='name']").val(),
        lastName: $("input[name='lastName']").val(),
        age: $("input[name='age']").val(),
        email: $("input[name='email']").val(),
        password: $("input[name='password']").val(),
        roles: getUserRolesForEdit()
    }
    // Оправляем запрос
    $.ajax({
        url: '/admin',
        method: 'PUT',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        //Передаем пользователя как JSON
        data: JSON.stringify(editUser),
        //Добавляем новую строку в таблицу
        success: (data) => {
            let newRow = createRows(data);
            $('#tableAllUsers').find('#' + userEditId).replaceWith(newRow);
            $('#editModal').modal('hide');//скрываем модалку
            $('#admin-tab').tab('show');//показываем таблицу
        },
    });
});


//Кнопка делит
$(document).on('click', '.del-btn', function () {
    //Получаем юзера по той же схеме, что и выше
    let user_id = $(this).attr('data-id');

    //отправляем запрос на получение данных для формы
    $.ajax({
        url: '/admin/' + user_id,
        method: 'GET',
        dataType: 'json',
        success: function (user) {
            $('#delId').empty().val(user.id);
            $('#delName').empty().val(user.name);
            $('#delLastName').empty().val(user.lastName);
            $('#delAge').empty().val(user.age);
            $('#delEmail').empty().val(user.email);
            $('#delPassword').empty().val(user.password);
            $('#delRole').empty();

            roleList.map(role => {
                let flag = user.authorities.find(item => item.id === role.id) ? 'selected' : '';
                $('#delRole').append('<option id="' + role.id + '" ' + flag + ' name="' + role.role + '" >' +
                    role.role.replace('ROLE_', '') + '</option>')
            })
        }
    });
});


//кнопка Delete в модальном окне
$('#deleteButton').on('click', (e) => {
    //Блокируем поведение по умолчанию
    e.preventDefault();
    //Получаем айди пользователя из кнопки
    let userId = $('#delId').val();
    //Отправляем Delete запрос
    $.ajax({
        url: '/admin/' + userId,
        method: 'DELETE',
        //если всё ок, то
        success: function () {
            $('#' + userId).remove();
            $('#deleteModal').modal('hide');//скрываем модалку
            $('#admin-tab').tab('show'); // показываем таблицу
        }
    });
});



function getUserRolesForAdd() {
    // Создаем массив для ролей
    var allRoles = [];
    // Роли приходят в селектор из общего массива -- получаем роли для текущего польз
    $.each($("select[name='addRoles'] option:selected"), function () {
        //В объект роль складываем айди и имя
        var role = {};
        role.id = $(this).attr('id');
        role.role = $(this).attr('role');
        //и добавляем в общий массив
        allRoles.push(role);
    });
    return allRoles;
}


// Клик по вкладке с добавлением нового пользователя вызывает модальное окно, а
// отсюда мы заполняем поля формы
$('.newUser').on('click', () => {

    $('#name').empty().val('')
    $('#age').empty().val('')
    $('#password').empty().val('')
    $('#addRole').empty().val('')
    roleList.map(role => {
        $('#addRole').append('<option id="' + role.id + '" role="' + role.role + '">' +
            role.role + '</option>')
    });

})


// Кликаем по кнопке addNewUserButton внутри вкладки нового юзера
$("#addNewUserButton").on('click', () => {
    // у нового юзера все параметры модели юзера
    let newUser = {
        name: $('#name').val(),
        lastName: $('#lastName').val(),
        age: $('#age').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        roles: getUserRolesForAdd()
    }
    // Отправляем запрос на добавление
    $.ajax({
        url: 'http://localhost:8080/admin',
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(newUser),
        contentType: 'application/json; charset=utf-8',
        // В случае спеха
        success: function () {
            //Очищаем таблицу с юзерами
            $('#tableAllUsers').empty();
            //Заново ее заполняем
            getAllUsers();
            //И показываем
            $('#admin-tab').tab('show');
        }
    });
});