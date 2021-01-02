// This is a script.js for SQLite
$('#home-btn').click(function(){
    location.href = 'http://localhost:3000/';
});
$('#student-btn').click(function(){
    location.href = 'http://localhost:3000/sqlite/school/student';
});
$('#teacher-btn').click(function(){
    location.href = 'http://localhost:3000/sqlite/school/teacher';
});

$('#add-btn').click(function(){
    var html = '<button type="button" class="pointer" id="cancel-btn" style="margin-left: 20px;">&times; Cancel</button>';
    $('#add-btn').after(html);
    $('#cancel-btn').click(function(){
        $('#create-table').remove();
        $('#cancel-btn').remove();
    });
    $.post(
        'http://localhost:3000/sqlite/ajax/class/add-btn',
        {},
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/school/class/error';
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
        'http://localhost:3000/sqlite/ajax/class/search',
        {
            text: text
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/school/class/error';
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
        'http://localhost:3000/sqlite/ajax/class/update-btn',
        {
            id: id
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/school/class/error';
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
        'http://localhost:3000/sqlite/ajax/class/cancel-btn',
        {
            id: id
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/school/class/error';
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


function addClass(){
    var id_class = $('#id-class-input').val();
    var name_class = $('#name-class-input').val();
    $.post(
        'http://localhost:3000/sqlite/class/add',
        {
            id: id_class,
            name: name_class
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/school/class/error';
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

function updateClass(id){
    var id_class = $('#id-class-input').val();
    var name_class = $('#name-class-input').val();
    $.post(
        'http://localhost:3000/sqlite/class/update',
        {
            old_id: id,
            new_id: id_class,
            name: name_class
        },
        function(result, status){
            if(status == 'success'){
                if(result == 'error'){
                    location.href = 'http://localhost:3000/sqlite/school/class/error';
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

function delClass(field, id){
    $.post(
        'http://localhost:3000/sqlite/class/delete',
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
                    location.href = 'http://localhost:3000/sqlite/school/class/error';
                }
            }
        },
        'json'
    );
}