from pdfminer.high_level import extract_text
from io import BytesIO


def extract_pdf_text(file):
    # Convert the SpooledTemporaryFile to a BytesIO
    file_content = BytesIO(file.read())

    # Extract text using pdfminer
    pdf_text = extract_text(file_content)

    return pdf_text
