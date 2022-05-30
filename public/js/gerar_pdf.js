function carregamento() {
    const invoice = this.window.document.getElementById("invoice");
        var opt = {
            margin:       1,
            filename:     'Congresso.pdf',
            image:        { type: 'png', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    html2pdf().from(invoice).set(opt).save()
}