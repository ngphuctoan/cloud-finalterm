#!/bin/sh
export RESOLVER=$(awk '/nameserver/ {print $2; exit}' /etc/resolv.conf)
envsubst '$RESOLVER' < /etc/nginx/template.conf > /etc/nginx/nginx.conf
nginx -g 'daemon off;'
