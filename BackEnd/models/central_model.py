#Este arquivo contém a models da tabela Central
from core.configs import settings
from sqlalchemy import Column, Integer, Boolean, ForeignKey, Float
from models.users_team_model import *
from models.trails_model import *
from models.users_model import *

class Central(settings.DBBaseModel):
    __tablename__ = "Central"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_edv = Column(Integer, ForeignKey('Users.edv'))
    trail_id = Column(Integer, ForeignKey('Trails.id'))
    team_id = Column(Integer, ForeignKey('CreateTeam.id')) 
    percentage = Column(Integer, default=0)
    grade = Column(Float, default=0)
    finished = Column(Boolean, default=False)

