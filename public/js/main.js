let imageUrl = '';

$('#imageUrl').keydown(e => imageUrl = e.target.value);

$('#imageUrl').focusout(e => {
    $('#imageDisplay').attr('src', imageUrl)
});