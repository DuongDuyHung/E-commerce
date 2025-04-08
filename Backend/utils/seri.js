// utils.js
function generateInvoiceNumber() {
    const now = new Date();
    return 'INV-' + now.getFullYear() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        '-' + Math.floor(1000 + Math.random() * 9000);
}

module.exports = {
    generateInvoiceNumber
};