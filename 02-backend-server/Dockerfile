FROM python:latest
WORKDIR /app
RUN pip install --no-cache-dir --upgrade "fastapi[standard]" sqlmodel "psycopg[binary,pool]"
COPY ./students-api ./
EXPOSE 8000
CMD ["fastapi", "run"]
