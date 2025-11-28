import os
from dotenv import load_dotenv

class Config:
    load_dotenv('app/.env')

    ENVIRONMENT = os.getenv('ENVIRONMENT')

    with open('VERSION', 'r', encoding='utf-8') as file:
        VERSION = file.read()
