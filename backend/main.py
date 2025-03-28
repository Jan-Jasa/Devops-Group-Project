from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define models
class Movie(Base):
    __tablename__ = "movies"
    id = Column(Integer, primary_key=True, index=True)
    tmbd_id = Column(Integer, unique=True, index=True)
    title = Column(String, index=True)
    genre = Column(String)
    date = Column(String)
    rating = Column(Float)
    poster = Column(String)


# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def load_movie_data(filepath, db):
    # Read the TMDB dataset (Ensure the dataset has 'poster_path' column)
    df = pd.read_csv(filepath,
                     usecols=["id", "title", "release_date", "genres", "vote_average", "poster_path"],
                     dtype=str)

    # Clean and process the data
    df = df[df["release_date"] != "\\N"]  # Remove missing release dates
    df = df[df["poster_path"] != "\\N"]  # Remove movies without poster
    df["year"] = df["release_date"].apply(lambda x: x.split("-")[0])  # Extract the year from release date

    movies = [
        Movie(
            tmdb_id=int(row["id"]),
            title=row["original_title"],
            year=int(row["year"]),
            genre=row["genres"],
            rating=float(row["vote_average"]) if row["vote_average"] != "\\N" else None,
            poster_url=f"https://image.tmdb.org/t/p/w500{row['poster_path']}"  # Full URL to poster image
        )
        for _, row in df.iterrows()
    ]

    # Bulk insert the movies into the database
    db.bulk_save_objects(movies)
    db.commit()


# API to trigger TMDB data import
@app.post("/import-tmdb/")
def import_tmdb(db: Session = Depends(get_db)):
    try:
        load_tmdb_data("TMDB_movie_dataset_v11.csv", db)  # Make sure the file is in the container
        return {"message": "TMDB data imported successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# API endpoints
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/")
def read_items(db: Session = Depends(get_db)):
    items = db.query(Item).all()
    return items

@app.post("/items/")
def create_item(name: str, description: str, db: Session = Depends(get_db)):
    item = Item(name=name, description=description)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item