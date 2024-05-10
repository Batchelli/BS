#Se trata do models da tabela Trails
from core.configs import settings
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Text
from models.prova_model import *


class Trail(settings.DBBaseModel):
    __tablename__ = "Trails"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(100))
    desc = Column(String(400))
    focal_point = Column(String(100))
    criador_trilha = Column(Integer)
    carga_horaria = Column(Integer)
    conteudo = Column (Text)
    image_trail = Column (Text)
    id_prova = Column(Integer, ForeignKey('Provas.id'))