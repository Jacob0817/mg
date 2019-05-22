# mg
### require 
* django 2.1.5  
`$ pip install Django==2.1.5`
* django-users2  
`$ pip install django-users2`
* bootstrap 3.4.0  
`$ npm install bootstrap@3`
* vue 2.5.22  
`$ npm install vue`
* vue-router 3.0.2  
`$ npm install vue-router`
### to run this site
`$ cd /path/to/mg/MgForSchoolV`  
`$ yarn install`  
`$ yarn run build`  
`$ cd /path/to/mg`  
`$ python manage.py runserver`  

### to db
`$ python manage.py migrate`  

### to static
`$ python manage.py collectstatic`

###command for micro backend server
- 关闭index.js 服务
- /home/liwei/mg/server/node_modules/.bin/forever stop /home/liwei/mg/server/index.js
- 开启index.js 服务
- /home/liwei/mg/server/node_modules/.bin/forever start /home/liwei/mg/server/index.js