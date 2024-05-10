# import sys
# default_path = "C:\\Users\\ari5ca\\Desktop\\backEnd"
# sys.path.append(default_path)

#se trata do models da tabela Users bem como também suas sub tabelas
from pydantic import BaseModel
from core.configs import settings
from sqlalchemy import Column, Integer, String, Float, Boolean, Text

class UserModel(settings.DBBaseModel):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name= Column(String(100))
    edv = Column(Integer, unique=True)
    email_user = Column(String(200))
    user_area= Column(String(200))
    focal_point= Column(String(200))
    admin_email = Column(String(200))
    percentage = Column(Float, default =  0.0)
    typeUser= Column(String(200))
    firstAcess= Column(Boolean, default=False)
    image_user= Column (Text)
    hashed_password = Column(String(200)) 
    activated = Column(Boolean, default=True)


class UserLogin(BaseModel):
    username: str = Column(String(200))
    password: str = Column(String(200))

class Token(BaseModel):
    acess_token: str
    token_type: str

class User(BaseModel):
    username : str

class emailSender(BaseModel):
    email: str
    edv: int
    # sorteio: int

class AuthenticationCode(BaseModel):
    code: int




