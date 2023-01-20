function displayMsg() {
    let msg = document.getElementById('message').value;

    Swal.fire(
        {
            backdrop: false,
            title: 'Foresight Mortgage',
            text: msg
        }
    );
}