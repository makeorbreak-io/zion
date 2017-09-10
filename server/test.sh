
pm2 delete main.js
sudo systemctl restart nginx
rm -rf ~/.pm2/logs/*
pm2 start main.js
clear
pm2 logs
