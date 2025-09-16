// Hien thi anh minh chung 
function previewImageOrPDF(input, previewElementId) {
    const files = input.files;
    const previewElement = document.getElementById(previewElementId);
    previewElement.innerHTML = ''; // Xóa nội dung cũ

    if (files.length > 0) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();

            reader.onload = function(e) {
                if (file.type === "application/pdf") {
                    // Hiển thị biểu tượng cho file PDF
                    const pdfIcon = document.createElement('div');
                    pdfIcon.textContent = `Tài liệu PDF: ${file.name}`;
                    pdfIcon.style.marginTop = '10px';
                    previewElement.appendChild(pdfIcon);
                } else {
                    // Hiển thị ảnh
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    previewElement.appendChild(img);
                }
            };

            reader.readAsDataURL(file);
        });
    }
}

document.getElementById('cccd-front-upload').addEventListener('change', function() {
    previewImageOrPDF(this, 'cccd-front-preview');
});

document.getElementById('cccd-back-upload').addEventListener('change', function() {
    previewImageOrPDF(this, 'cccd-back-preview');
});

document.getElementById('hoc-ba-upload').addEventListener('change', function() {
    previewImageOrPDF(this, 'hoc-ba-preview');
});