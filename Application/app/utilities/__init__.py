from . import SVY21
import os

svy21 = SVY21.SVY21()

def get_secret(secret_name):
    secret_file = os.environ.get(secret_name)

    if secret_file == None:
        raise Exception(f'Tried to read non-existent secret {secret_name}')

    with open(secret_file, encoding="utf8") as f:
        secret = f.read().strip()
    
    return secret
