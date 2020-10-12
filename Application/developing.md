# Running the application for development

# Windows:

Requirements:
1. python3 (with pip available)

Running:
1. Clone this repository
2. In PowerShell:

    1. `cd` until your current working directory is `...\CLONS5\Application\app`
    2. Create a new virtual environment: `python -m venv venv`
    3. Activate the virtual environment: `.\venv\Scripts\activate.ps1`. The last line of your PowerShell window should start with `(venv)`, eg  ```(venv) PS C:\Users\User\Documents\Repositories\CLONS5\Application\app>```
    4. Install the packages that the application requires: `pip install -r requirements.txt`
    5. Copy `Application/secrets-template/` to `Application/secrets/`
        - Fill out the files with the appropriate data
    6. Execute `Start-Dev.ps1`: `.\Start-Dev.ps1`
    7. Web server should be accessible at `http://localhost:5000`

# Linux:

Requirements:
1. Docker
2. Docker-Compose

Running:
1. Clone this repository
2. Copy `Application/secrets-template/` to `Application/secrets/`
    - Fill out the files with the appropriate data
3. `cd` to `...\CLONS5\Application\app`
4. `docker-compose -f docker-compose-dev.yaml up`
5. Web server should be accessible at `:8000`
