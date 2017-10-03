#!/bin/sh
N=$1
if [ "$N" = "" ]
then
wget --spider --no-proxy -q http://localhost:17000/ImageFactory?action=flushImages
exit
fi
wget --spider --no-proxy -q http://localhost:17000/$N/ImageFactory?action=flushImages

