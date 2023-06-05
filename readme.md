## WebsocketServer デプロイ方法(ubuntuサーバー)
1. ディレクトリを作成
2. リモートリモートリポジトリを追加
3. git pullする
4. npmをインストールして、ツールをインストール
プロジェクトディレクトリでnpmインストール
```
$ sudo apt install npm
$ npm install
```
5. nginxをインストール
```
$ sudo apt install nginx
```
6. nginxファイルを作成
```
$ cd /etc/nginx/sites-available
$ sudo vi default
```
その後、
```
upstream websocket-backend {
    server localhost:3002;
}
server {
    location / {
        try_files $uri @proxy_to_app;
    }
    location @proxy_to_app {
        proxy_pass http://websocket-backend;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $server_name;
    }
}
```
7. その後、nginxを更新
```
$ sudo service nginx reload
```
8. redis serverをインストール
```
$ sudo apt install redis-server
```
9. serviceファイルを作成
```
vi /etc/systemd/system/my-service-name.service
```
以下を記入
```
[Unit]
Description=my-app: This is my server application
After=syslog.target network.target

[Service]
Type=simple
ExecStart=npm start > /log/logfile.log 2>&1
WorkingDirectory=/home/ubuntu/socket-server
KillMode=process
Restart=no
User=ubuntu
Group=ubuntu

[Install]
WantedBy=multi-user.target
```

10. サービスを実行
```
$ sudo systemctl daemon-reload
$ sudo systemctl enable my-service-name
$ sudo systemctl start my-service-name
```

11. サービスを確認
```
$ systemctl status my-service-name
```

12. http://ip-address/ にアクセス。表示されていれば成功
