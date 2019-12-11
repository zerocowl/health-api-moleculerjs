## Configs  
    ==> eslint [standard]
    ==> prettier [standard]
    ==> node:8.11 && npm 6
    ==> mysql/ sequelize
    ==> redis
    ==> protocol NATS
    ==> supertest
    ==> Prometheus Metrics

## Folder Structure
---
- **mixins**
- **config**
- **tests**
- **domains**
    - **usuario**
        - **tests**
        - **repository**    
            - **model**
            - **migrations**
            - **seeders**          
        - **action**   
            _index.js_
        - **lib**  
            _index.js_
- **services**  
    _api.service.js_
----

## Services
- Auth => autorização e ACL dos usuarios.
- Account => gestão de usuarios e detalhes de contato.

 > TASKS  
    - Add Prometheus Metrics  
    - Add sequelize/mysql  
    - Add JWT  


> Fix docker-compose windows
 -> $Env:COMPOSE_CONVERT_WINDOWS_PATHS=1

 MIXIM > SEQUELIZE > MODELS 
db.user......


MIXIM > [MODEL] > SEQUELIZE
db([user, auth])
db.user
db.auth


mixim recebe um repository => db
service recebe mixin[s]
actions recebe service 
actions recebe methods


/oauth/token => token(req,res)
POST authorise => authorize(req,res)
GET authorise => findOne(req,res)
