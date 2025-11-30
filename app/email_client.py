import json
import smtplib
from email.message import EmailMessage
from flask import current_app


def create_smtp_client():
    client = smtplib.SMTP_SSL(
        host=current_app.config["SMTP_HOST"],
        port=current_app.config["SMTP_PORT"],
    )
    client.login(
        user=current_app.config["SMTP_USER"],
        password=current_app.config["SMTP_PASSWORD"],
    )
    return client


def send_email(data):
    subject = "Новая заявка"
    body = json.dumps(data, ensure_ascii=False, indent=2)

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = current_app.config["MAIL_FROM"]
    msg["To"] = data["contact_email"]
    msg.set_content(body)

    smtp = create_smtp_client()
    try:
        smtp.send_message(msg)
    finally:
        smtp.quit()
