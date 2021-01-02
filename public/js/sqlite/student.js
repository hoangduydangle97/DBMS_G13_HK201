// This is a script.js for SQLite
$('#home-btn').click(function(){
    location.href = 'http://localhost:3000/';
});
$('#class-btn').click(function(){
    location.href = 'http://localhost:3000/neo4j/school/class';
});
$('#teacher-btn').click(function(){
    location.href = 'http://localhost:3000/neo4j/school/teacher';
});
$('#teaching-btn').click(function(){
    location.href = 'http://localhost:3000/neo4j/school/teaching';
});

$('#add-btn').click(function(){
    var html = '<button type="button" class="pointer" id="cancel-btn" style="margin-left: 20px;">&times; Cancel</button>';
    $('#add-btn').after(html);
    $('#cancel-btn').click(function(){
        $('#create-table').remove();
        $('#cancel-btn').remove();
    });
    $.post(
        'http://localhost:3000/sqlite/ajax/student/add-btn',
        {},
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/error';
                }
                else{
                    $('table').before(result);
                }
            }
        },
        'html'
    );
});

$('#search-input').keyup(function(){
    var text = $(this).val();
    $.post(
        'http://localhost:3000/sqlite/ajax/student/search',
        {
            text: text
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/error';
                }
                else{
                    $('table').html(result);
                }
            }
        },
        'html'
    );
});

$('#class-student-input').change(function(){
    $('#hidden-input').val(this.options[this.selectedIndex].text);
});

function updateBtn(id){
    $('#add-btn').attr('disabled', 'true');
    $('#search-input').attr('disabled', 'true');
    $('.update-btn').each(function(index, element){
        $(element).attr('disabled', 'true');
    });
    $('.delete-btn').each(function(index, element){
        $(element).attr('disabled', 'true');
    });
    $('#delete-title').html('Cancel');
    $.post(
        'http://localhost:3000/sqlite/ajax/student/update-btn',
        {
            id: id
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/error';
                }
                else{
                    $('#' + id).after(result);
                    $('#' + id).remove();
                }
            }
        },
        'html'
    );
}

function cancelBtn(id){
    $.post(
        'http://localhost:3000/sqlite/ajax/student/cancel-btn',
        {
            id: id
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/error';
                }
                else{
                    $('#add-btn').removeAttr('disabled');
                    $('#search-input').removeAttr('disabled');
                    $('.update-btn').each(function(index, element){
                        $(element).removeAttr('disabled');
                    });
                    $('.delete-btn').each(function(index, element){
                        $(element).removeAttr('disabled');
                    });
                    $('#delete-title').html('Delete');
                    $('#' + id).after(result);
                    $('#' + id).remove();
                }
            }
        },
        'html'
    );
}


function addStudent(){
    var id_student = $('#id-student-input').val();
    var name_student = $('#name-student-input').val();
    var age_student = $('#age-student-input').val();
    var id_class = $('#class-student-input').val();
    $.post(
        'http://localhost:3000/sqlite/student/add',
        {
            id: id_student,
            name: name_student,
            age: age_student,
            class: id_class
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/error';
                }
                else{
                    $('#create-table').remove();
                    $('#cancel-btn').remove();
                    $('tr').last().after(result);
                }                
            }
        },
        'html'
    );
}

function updateStudent(id){
    var id_student = $('#id-student-input').val();
    var name_student = $('#name-student-input').val();
    var age_student = $('#age-student-input').val();
    var id_class = $('#class-student-input').val();
    $.post(
        'http://localhost:3000/sqlite/student/update',
        {
            old_id: id,
            new_id: id_student,
            name: name_student,
            age: age_student,
            class: id_class
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/error';
                }
                else{
                    $('#add-btn').removeAttr('disabled');
                    $('#search-input').removeAttr('disabled');
                    $('.update-btn').each(function(index, element){
                        $(element).removeAttr('disabled');
                    });
                    $('.delete-btn').each(function(index, element){
                        $(element).removeAttr('disabled');
                    });
                    $('#delete-title').html('Delete');
                    $('#' + id).after(result);
                    $('#' + id).remove();
                }
            }
        },
        'html'
    );
}

function delStudent(field, id){
    $.post(
        'http://localhost:3000/sqlite/student/delete',
        {
            field: field,
            id: id
        },
        function(result, status){
            if(status == 'success'){
                if(result.code == 200){
                    $('#' + id).remove();
                }
                else{
                    location.href = 'http://localhost:3000/sqlite/error';
                }
            }
        },
        'json'
    );
}