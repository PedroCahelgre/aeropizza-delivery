#!/bin/bash

# 日志清理脚本
# 保留最后100行日志，清理旧日志

LOG_FILE="/home/z/my-project/dev.log"

if [ -f "$LOG_FILE" ]; then
    # 备份完整日志
    cp "$LOG_FILE" "${LOG_FILE}.backup"
    
    # 保留最后100行
    tail -100 "$LOG_FILE" > "${LOG_FILE}.tmp"
    mv "${LOG_FILE}.tmp" "$LOG_FILE"
    
    echo "日志已清理，保留最后100行"
    echo "完整日志备份在: ${LOG_FILE}.backup"
else
    echo "日志文件不存在: $LOG_FILE"
fi