from core.configs import settings
from sqlalchemy import Column, Integer, String, Text

class Medalhas(settings.DBBaseModel):
    __tablename__ = "Medalhas"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome_medalha = Column(String(500))
    desc_medalha = Column(String(500))
    image_medalha = Column(Text)



