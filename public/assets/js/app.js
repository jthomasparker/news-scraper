let username = null
let userId = null
let articleId;

$(document).ready(() => {

    if(localStorage.getItem(user) !== null ){
        signIn(localStorage.getItem(user))
    }
    $('body').on('click', function(){
        if($(this).hasClass('disabled')){
            return;
        }
    })
    $('#user').on('click', () => {
        $('#user-modal').modal('show')

    })

    $('#submitUser').on('click', function() {
        let user = $('#username').val()
        signIn(user)
    })

    $('.comment').on('click', function() {
        articleId = $(this).data('id')
        $.ajax({
            type: 'GET',
            url: '/comments/' + articleId
        }).then(result =>{
            console.log(result)
            $('#comment-body').empty()
            let commentContent = result.notes
            if(commentContent.length > 0){
                commentContent.forEach(comment => {
                    populateComments(comment) 
                });

            }

            $('#comment-modal').attr('data-id', articleId).modal('show')
        })
    })

    $('#comment-body').on('click', '.delComment', function(){
        let commentId = $(this).data('id')
       // let articleId = $('#comment-modal').data('id')
        $.ajax({
            type: 'DELETE',
            url: '/comments' + commentId,
            data: {articleId: articleId}
        }).then(result => {
            console.log(result)
            $('#comment-body').empty()
            let commentContent = result.notes
            if(commentContent.length > 0){
                commentContent.forEach(comment => {
                    populateComments(comment) 
                });
            }
        })
    })

    $('#submitComment').on('click', function(){
        event.preventDefault();
        let commentContent = $('#user-comment').val().trim()
       // let articleId = $('#comment-modal').data('id')
        console.log(articleId)
        if(commentContent.length > 0 && userId !== null){
            $('#user-comment').val('')
            $.ajax({
                type: 'POST',
                url: '/comments/' + articleId,
                data: {
                        user: userId,
                        comment: commentContent
                    }
            }).then(result => {
                console.log(result)
                populateComments(result)
            })
        }
    })



    $('body').on('click', '.add-favorite', function(){
        event.preventDefault();
        if(username === null){
            $('#user-modal').modal('show')
        } else {
            articleId = $(this).data('id');
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
/*
    $('#favorites').on('click', function(){
        if(username === null){
            $('#user-modal').modal('show')
        } else {
            window.location.replace(`/favorites/${userId}`)
           $('a.add-favorite').each(function(i, element){
               let favIcon = $(element).children()
               console.log($(element).attr('data-id'))
            toggleIcon(favIcon)
           })*/
           
         //   $.ajax({
         //       type: 'GET',
               // url: '/test'
         //       url: '/favorites/' + userId
         //   })//.then(result => {
               // console.log(result)
              //  $('#results').empty()

               // $(document).html(result)
              // document.write(result)
             // location.reload()
            // window.location.replace("/test")
           // })
      //  }
   // })
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

function populateComments(comment){
    let commentRow = $('<tr>').attr('data-id', comment._id)
    let commentCell = $('<td>').html(comment.body).appendTo(commentRow)
    let delButton = $('<td>').html(
        `<button class='delComment' data-id='${comment._id}'>
            <i class='far fa-trash-alt'></i>
        </button>`)
        .attr('data-id', comment._id)
        .appendTo(commentRow)
    $('#comment-body').append(commentRow)
}

function findFavorites(articleIds){
    articleIds.forEach(article => {
      let favIcon = $(`a.add-favorite[data-id='${article}']`).children()
        toggleIcon(favIcon)
    })
    
}

function signIn(user){
    $.ajax({
        type: 'GET',
        url: '/user/' + user
    })
    .then(result => {
        username = result.username
        userId = result._id
        favorites = result.articles;
        localStorage.setItem('user', username)
        $('#user').addClass('disabled')
        findFavorites(result.articles)
        $('#favorites').removeClass('disabled').attr('href', `/favorites/${userId}`)

        console.log(result)
    })
}