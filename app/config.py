import os
from datetime import timedelta
from dotenv import load_dotenv

class Config:
    load_dotenv('.env')

    ENVIRONMENT = os.getenv('ENVIRONMENT')

    IGNORE_CLIENTS_AFTER = os.getenv('IGNORE_CLIENTS_AFTER')
    BLACKLIST_CLIENTS_AFTER = os.getenv('BLACKLIST_CLIENTS_AFTER')
    FORGIVE_TIME = timedelta(minutes=int(os.getenv('FORGIVE_TIME')))

    with open('VERSION', 'r', encoding='utf-8') as file:
        VERSION = file.read()
