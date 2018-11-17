#! /bin/bash
if [ $1 == "start" ];then
nohup node main.js 2>&1 | xargs -L1 -I{} bash -c "echo \$(date +'%x %T') '{}'" | tree log/out.log &
echo "$!" > run/pid #将上一个后台进程写入到pid文件中
elif [ $1 == "stop" ];then
kill `cat run/pid`
elif [ $1 == "status" ];then
ps `cat run/pid` | grep `cat run/pid` | grep node > /dev/null 2>&1
    if [$? != 0];then
    echo "The service is not running."
    else
    echo "The service is running at $(cat run/pid)"
    tail -n 20 log/out.log
    fi
else
echo "Please make sure the position variable is start\stop\status."
fi
