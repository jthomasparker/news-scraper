let username = null
let userId = null
$(document).ready(() => {

    $('#user').on('click', () => {
        $('#user-modal').modal('show')

    })

    $('#submitUser').on('click', function() {
        let user = $('#username').val()
        $.ajax({
            type: 'GET',
            url: '/user/' + user
        })
        .then(result => {
            username = result.username
            userId = result._id

            console.log(result)
        })
    })

    $('.comment').on('click', function() {
        var articleId = $(this).data('id')
        $.ajax({
            type: 'GET',
            url: '/comments' + articleId
        }).then(result =>{
            console.log(result)
            $('#comment-body').empty()
            let commentContent = result.notes
            if(commentContent.length > 0){
                commentContent.forEach(comment => {
                    let commentRow = $('<tr>').attr('data-id', comment._id)
                    let commentCell = $('<td>').html(comment.body).appendTo(commentRow)
                    let delButton = $('<td>').html(`
                    <button class='btn btn-default delComment'>
                    <i class='far fa-trash-alt'></i>
                    </button>`).appendTo(commentRow)
                    $('#comment-body').append(commentRow)
                    
                });

            }

            $('#comment-modal').attr('data-id', articleId).modal('show')
        })
    })

    $('#submitComment').on('click', function(){
        event.preventDefault();
        let commentContent = $('#user-comment').val().trim()
        let articleId = $('#comment-modal').data('id')
        if(commentContent.length > 0 && userId !== null){
            $('#user-comment').val('')
            $.ajax({
                type: 'POST',
                url: '/comments' + articleId,
                data: {
                        user: userId,
                        comment: commentContent
                    }
            }).then(result => {
                console.log(result)
                let commentRow = $('<tr>')
                let commentCell = $('<td>').html(result.body).appendTo(commentRow)
                let delButton = $('<td>').html(
                    `<button class='btn btn-default delComment'>
                        <i class='far fa-trash-alt'></i>
                    </button>`)
                    .appendTo(commentRow)
                $('#comment-body').append(commentRow)
            })
        }
    })



    $('body').on('click', '.add-favorite', function(){
        event.preventDefault();
        if(username === null){
            $('#user-modal').modal('show')
        } else {
            let articleId = $(this).data('id');
            let icon = $(this).children()
            toggleIcon(icon)
            console.log(articleId)
            $.ajax({
                type: 'POST',
                url: '/favorite',
                data: {
                    userId: userId,
                    articleId: articleId
                }
            }).then(result => {
                console.log(result)
            })
        }
    })

    $('#favorites').on('click', function(){
        if(username === null){
            $('#user-modal').modal('show')
        } else {
            $.ajax({
                type: 'GET',
                url: '/favorites' + userId
            })//.then(result => {
               // console.log(result)
              //  $('#results').empty()

               // $(document).html(result)
              // document.write(result)
             // location.reload()

          //  })
        }
    })
})

function toggleIcon(icon){
    if(icon.hasClass('far')){
        icon.removeClass('far')
        icon.addClass('fas')
    } else {
        icon.removeClass('fas')
        icon.addClass('far')
    }
}