服务器配置
1. 安装nginx virtualenv  uwsgi
2.安装依赖
    django
    django-users2
    uwsgi
3. 配置uwsgi
4. 配置nginx


部署步骤
1. ssh登陆
2. cd /home/cubenode/
3. source nodenv/bin/activate
4. run
   cd mg/mg/uwsgi
   ./startup.sh
5. stop
   ./shutdown.sh
