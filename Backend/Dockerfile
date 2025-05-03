FROM python:3.9.18-slim-bullseye

WORKDIR /app

# 1. Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

# 2. Copy requirements
COPY requirements.txt .

# 3. Install Python packages (single command avoids conflicts)
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy application
COPY . .

CMD ["rasa", "run", "--enable-api"]
