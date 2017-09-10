
pm2 delete resetDatabase.js
sudo systemctl restart nginx
rm -rf ~/.pm2/logs/*
pm2 start resetDatabase.js
clear
pm2 logs
