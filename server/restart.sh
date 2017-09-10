
pm2 delete server.js
pm2 delete watcher.js
sudo systemctl restart nginx
rm -rf ~/.pm2/logs/*
pm2 start watcher.js
pm2 start server.js
clear
pm2 logs
