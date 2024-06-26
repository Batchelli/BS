from typing import Optional, List
from pydantic import BaseModel as SchemaBaseModel

class CentralSchema(SchemaBaseModel):
    id: Optional[int] = None
    user_edv: int
    trail_id: int
    team_id: int
    percentage: int
    grade: float
    finished: bool
  
class CentralTeamSchema(SchemaBaseModel):
    id: Optional[int] = None
    trail_id: int
    team_id: int