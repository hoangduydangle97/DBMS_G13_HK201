// This is a script.js
$('#add-btn').click(function(){
    var html = '<button type="button" class="pointer" id="cancel-btn" style="margin-left: 20px;">&times; Cancel</button>';
    $('#add-btn').after(html);
    $('#cancel-btn').click(function(){
        $('#create-table').remove();
        $('#cancel-btn').remove();
    });
    $.post(
        'http://localhost:3000/sqlite/ajax/class',
        {},
        function(result, status){
            if(status == 'success'){
                $('table').before(result);
            }
        },
        'html'
    );
});

$('#search-input').keyup(function(){
    var text = $(this).val();
    $.post(
        'http://localhost:3000/sqlite/ajax/search',
        {
            text: text
        },
        function(result, status){
            if(status == 'success'){
                $('table').html(result);
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
    $('.update-btn').each(function(index, element){
        $(element).attr('disabled', 'true');
    });
    $('.delete-btn').each(function(index, element){
        $(element).attr('disabled', 'true');
    });
    $('#delete-title').html('Cancel');
    $.post(
        'http://localhost:3000/sqlite/ajax/update-btn',
        {
            id: id
        },
        function(result, status){
            if(status == 'success'){
                $('#' + id).after(result);
                $('#' + id).remove();
            }
        },
        'html'
    );
}

function cancelBtn(id){
    $.post(
        'http://localhost:3000/sqlite/ajax/cancel-btn',
        {
            id: id
        },
        function(result, status){
            if(status == 'success'){
                $('#add-btn').removeAttr('disabled');
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
                $('#create-table').remove();
                $('#cancel-btn').remove();
                $('tr').last().after(result);                
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
                if(status == 'success'){
                    $('#add-btn').removeAttr('disabled');
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
            }
        },
        'json'
    );
}