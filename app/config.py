import os
from datetime import timedelta
from dotenv import load_dotenv

class Config:
    load_dotenv('.env')

    ENVIRONMENT = os.getenv('ENVIRONMENT')

    IGNORE_CLIENTS_AFTER = os.getenv('IGNORE_CLIENTS_AFTER')
    BLACKLIST_CLIENTS_AFTER = os.getenv('BLACKLIST_CLIENTS_AFTER')
    FORGIVE_CLIENTS_AFTER = timedelta(minutes=int(os.getenv('FORGIVE_CLIENTS_AFTER')))

    REDIS_IP = os.getenv('REDIS_IP')
    REDIS_PORT = os.getenv('REDIS_PORT')
    REDIS_DB = os.getenv('REDIS_DB')
    REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')

    with open('VERSION', 'r', encoding='utf-8') as file:
        VERSION = file.read()
