FROM python:3.7
RUN mkdir /backend
WORKDIR /backend
COPY requirements.txt /backend/requirements.txt
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt
COPY . .
CMD [ "python", "app.py" ]