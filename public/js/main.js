createNewTodo = (todo) => {
    var todo = $('#newtodo').val()
    socket.emit('new-todo', todo)
    $('#newtodo').val('').focus()
}

deleteTodo = (id) => {
    socket.emit('delete-todo', id)
}

$('#todo-form #newtodo').on('keyup', (event) => {
    var keycode = event.keyCode || event.which
    if (keycode === 13) {
        createNewTodo(event.target.value)
    }
});

$('#todo-form #submit').click((e) => {
    var todo = $('#newtodo').val()
    createNewTodo(todo)
});

socket.on('new-client', (lastTodo) => {
        if (lastTodo === null || lastTodo === undefined) {
            $('#todo-list').append('<li id="empty" class="list-group-item">Empty</li>')
        } else {
            $('#todo-list').append(`<li id="${lastTodo.id}" class="list-group-item"><button class="btn" onclick="deleteTodo('${lastTodo.id}')">✘</button> ${lastTodo.text}</li>`)
        }
    })
    .on('new-added-todo', (todo) => {
        $('#todo-list #empty').remove()
        $('#todo-list').append(`<li id="${todo.id}" class="list-group-item"><button class="btn" onclick="deleteTodo('${todo.id}')">✘</button> ${todo.text}</li>`)
    })
    .on('deleted-todo', (id) => {
        $(`#todo-list >li#${id}`).remove()

        if ($(`#todo-list >li`).length === 0) {
            $('#todo-list').append('<li id="empty" class="list-group-item">Empty</li>')
            socket.emit('empty-todos')
        }
    });