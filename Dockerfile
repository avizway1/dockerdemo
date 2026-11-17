
# ==========================================
# STAGE 1: BUILDER
# ==========================================
FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /build

# Copy dependency file
COPY requirements.txt .

# Install dependencies into a separate directory
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ==========================================
# STAGE 2: RUNTIME
# ==========================================
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copy dependencies from builder stage
COPY --from=builder /install /usr/local

# Copy application files
COPY app.py .
COPY templates/ ./templates/
COPY static/ ./static/

# Create a non-root user
RUN useradd --create-home --shell /usr/sbin/nologin appuser \
    && chown -R appuser:appuser /app

USER appuser

# Application port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:5000/health', timeout=2)"

# Start application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--access-logfile", "-", "app:app"]
