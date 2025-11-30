import os
from datetime import timedelta
from dotenv import load_dotenv

class Config:
    load_dotenv('.env')

    ENVIRONMENT = os.getenv('ENVIRONMENT')

    IGNORE_CLIENTS_AFTER = os.getenv('IGNORE_CLIENTS_AFTER')
    BLACKLIST_CLIENTS_AFTER = os.getenv('BLACKLIST_CLIENTS_AFTER')
    FORGIVE_CLIENTS_AFTER = os.getenv('FORGIVE_CLIENTS_AFTER')

    REDIS_IP = os.getenv('REDIS_IP')
    REDIS_PORT = os.getenv('REDIS_PORT')
    REDIS_DB = os.getenv('REDIS_DB')
    REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')

    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = os.getenv("SMTP_PORT")
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    MAIL_FROM = os.getenv("MAIL_FROM")

    with open('VERSION', 'r', encoding='utf-8') as file:
        VERSION = file.read()
