from docxtpl import DocxTemplate
from data import context
import os


def create_diploma(
    data, template_path="template.docx", output_path="ready_diploma.docx"
):
    # Проверяем существование шаблона
    if not os.path.exists(template_path):
        print(f"Ошибка: Файл шаблона '{template_path}' не найден.")
        print(
            "Пожалуйста, создайте файл template.docx с Jinja2 тегами (например, {{ city }})."
        )
        return

    try:
        doc = DocxTemplate(template_path)

        # Рендеринг документа (подстановка данных)
        doc.render(data)

        # Обновление полей (автосодержание) при открытии
        # (доступ к объекту python-docx через .docx)
        doc.docx.settings.update_fields = True

        doc.save(output_path)
        print(f"Успешно! Документ сохранен как: {output_path}")

    except Exception as e:
        print(f"Произошла ошибка: {e}")


if __name__ == "__main__":
    # Для работы требуется библиотека docxtpl
    # Установка: pip install docxtpl
    create_diploma(context)
