ec2-54-219-44-193.us-west-1.compute.amazonaws.com

SSH backend
ssh -i '.\Backend Server.pem' ubuntu@ec2-54-219-44-193.us-west-1.compute.amazonaws.com

Upload backend
scp -i '.\Backend Server.pem' -r .\backend\* ubuntu@ec2-54-219-44-193.us-west-1.compute.amazonaws.com:~/backend

sudo apt update
sudo apt upgrade -y
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
pm2 start index.js
pm2 startup
pm2 save
sudo apt install nginx certbot python3-certbot-nginx -y
sudo nano /etc/nginx/sites-available/default


openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/selfsigned.key \
  -out /etc/nginx/ssl/selfsigned.crt

Nginx Config
sudo systemctl reload nginx

server {
    listen 443 ssl;
    server_name ec2-54-219-44-193.us-west-1.compute.amazonaws.com;

    ssl_certificate /etc/nginx/ssl/selfsigned.crt;
    ssl_certificate_key /etc/nginx/ssl/selfsigned.key;
    
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
server {
    listen 80;
    server_name ec2-54-219-44-193.us-west-1.compute.amazonaws.com;
    location / {
        try_files $uri /index.html;
    }
    return 301 https://$host$request_uri;
}



Frontend
ec2-54-219-241-106.us-west-1.compute.amazonaws.com


SSH frontend
ssh -i '.\Backend Server.pem' ubuntu@ec2-54-219-241-106.us-west-1.compute.amazonaws.com

Upload frontend
scp -i '.\Backend Server.pem' -r .\frontend\dist\* ubuntu@ec2-54-219-241-106.us-west-1.compute.amazonaws.com:~/vite

# Frontend
sudo chown -R www-data:www-data /home/ubuntu/app
sudo chmod -R 755 /home/ubuntu/app
ls -ld /home /home/ubuntu /home/ubuntu/app
sudo chmod o+rx /home/ubuntu
sudo chmod o+rx /home


Nginx Config
server {
    listen 443 ssl;
    server_name ec2-54-219-241-106.us-west-1.compute.amazonaws.com;  # or your domain

    ssl_certificate /etc/ssl/certs/selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/selfsigned.key;

    root /home/ubuntu/vite;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}

server {
    listen 80;
    server_name ec2-54-219-241-106.us-west-1.compute.amazonaws.com;
    location / {
        try_files $uri /index.html;
    }
    return 301 https://$host$request_uri;
}

