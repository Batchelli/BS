from core.configs import settings
from sqlalchemy import Column, Integer, String, Text

class Provas(settings.DBBaseModel):
    __tablename__ = "Provas"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome_prova = Column(String(100))
    criador_prova = Column(String(400))
    valor_prova = Column(Integer)
    tempoRealizar = Column(Integer)
    conteudo_prova = Column(Text)
