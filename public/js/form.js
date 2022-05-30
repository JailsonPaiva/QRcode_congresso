function Qrcodes() {
    const BtnLink = document.querySelector('#registros')
    const LinkCiencias = document.querySelector('#ciencias')
    const LinkSaude = document.querySelector('#saude')
    const options = document.querySelectorAll('option')

    console.log(options)

    if (LinkCiencias.selected & LinkCiencias.value == 'ciencias') {
        BtnLink.href = '/registros_ciencias'
    } else if (LinkSaude.selected & LinkSaude.value == 'saude') {
        BtnLink.href = '/registros_saude'
    }
}