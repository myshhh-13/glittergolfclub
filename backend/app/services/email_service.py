import json
import smtplib
from email.message import EmailMessage

from flask import current_app


def send_request_notification(data: dict[str, str]) -> None:
    if not current_app.config.get("MAIL_ENABLED"):
        current_app.logger.info("MAIL_ENABLED=false, skipping email for request %s", data.get("id"))
        return

    msg = EmailMessage()
    msg["Subject"] = f"Новая заявка #{data.get('id', '?')}"
    msg["From"] = current_app.config["MAIL_FROM"]
    msg["To"] = current_app.config["MAIL_TO"] or current_app.config["MAIL_FROM"]
    msg.set_content(json.dumps(data, ensure_ascii=False, indent=2))

    with smtplib.SMTP_SSL(
        host=current_app.config["SMTP_HOST"],
        port=current_app.config["SMTP_PORT"],
        timeout=10,
    ) as client:
        client.login(
            user=current_app.config["SMTP_USER"],
            password=current_app.config["SMTP_PASSWORD"],
        )
        client.send_message(msg)
