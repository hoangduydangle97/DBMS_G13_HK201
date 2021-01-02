// This is a script.js for SQLite
$('#home-btn').click(function(){
    location.href = 'http://localhost:3000/';
});
$('#class-btn').click(function(){
    location.href = 'http://localhost:3000/sqlite/school/class';
});
$('#student-btn').click(function(){
    location.href = 'http://localhost:3000/sqlite/school/student';
});

$('#add-btn').click(function(){
    var html = '<button type="button" class="pointer" id="cancel-btn" style="margin-left: 20px;">&times; Cancel</button>';
    $('#add-btn').after(html);
    $('#cancel-btn').click(function(){
        $('#create-table').remove();
        $('#cancel-btn').remove();
    });
    $.post(
        'http://localhost:3000/sqlite/ajax/teacher/add-btn',
        {},
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/school/teacher/error';
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
        'http://localhost:3000/sqlite/ajax/teacher/search',
        {
            text: text
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/school/teacher/error';
                }
                else{
                    $('table').html(result);
                }
            }
        },
        'html'
    );
});

$('#class-teacher-input').change(function(){
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
        'http://localhost:3000/sqlite/ajax/teacher/update-btn',
        {
            id: id
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/school/teacher/error';
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
        'http://localhost:3000/sqlite/ajax/teacher/cancel-btn',
        {
            id: id
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/school/teacher/error';
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


function addTeacher(){
    var id_teacher = $('#id-teacher-input').val();
    var name_teacher = $('#name-teacher-input').val();
    var age_teacher = $('#age-teacher-input').val();
    $.post(
        'http://localhost:3000/sqlite/teacher/add',
        {
            id: id_teacher,
            name: name_teacher,
            age: age_teacher
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/school/teacher/error';
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

function updateTeacher(id){
    var id_teacher = $('#id-teacher-input').val();
    var name_teacher = $('#name-teacher-input').val();
    var age_teacher = $('#age-teacher-input').val();
    $.post(
        'http://localhost:3000/sqlite/teacher/update',
        {
            old_id: id,
            new_id: id_teacher,
            name: name_teacher,
            age: age_teacher
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/school/teacher/error';
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

function delTeacher(field, id){
    $.post(
        'http://localhost:3000/sqlite/teacher/delete',
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
                    location.href = 'http://localhost:3000/sqlite/school/teacher/error';
                }
            }
        },
        'json'
    );
}