# tutor
to run the app in prod
uvicorn main:app --host 0.0.0.0 --port 8000

to run app in dev use

uvicorn main:app --host 0.0.0.0 --port 8000 --reload