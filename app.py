from flask import Flask, request, send_file, send_from_directory
from flask_cors import CORS
from docxtpl import DocxTemplate
from data import context as default_context
import os
import io

app = Flask(__name__, static_folder='web')
CORS(app)

# Путь к шаблону
TEMPLATE_PATH = "template.docx"

@app.route('/')
def index():
    return send_from_directory('web', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('web', path)

@app.route('/generate', methods=['POST'])
def generate():
    try:
        user_data = request.json
        
        # Объединяем данные пользователя с данными по умолчанию
        # Данные пользователя имеют приоритет
        data = default_context.copy()
        data.update(user_data)
        
        # Загружаем шаблон
        if not os.path.exists(TEMPLATE_PATH):
            return {"error": f"Template file '{TEMPLATE_PATH}' not found"}, 500
            
        doc = DocxTemplate(TEMPLATE_PATH)
        
        # Рендерим данные
        doc.render(data)
        
        # Сохраняем в буфер памяти, чтобы не мусорить файлами
        file_stream = io.BytesIO()
        doc.save(file_stream)
        file_stream.seek(0)
        
        return send_file(
            file_stream,
            as_attachment=True,
            download_name="diploma.docx",
            mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
