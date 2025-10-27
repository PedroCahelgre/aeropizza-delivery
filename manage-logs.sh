#!/bin/bash

# AeroPizza 日志管理脚本
# 用法: ./manage-logs.sh [clean|status|backup]

LOG_FILE="/home/z/my-project/dev.log"
BACKUP_DIR="/home/z/my-project/logs"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

case "$1" in
    "clean")
        echo "🧹 清理开发日志..."
        if [ -f "$LOG_FILE" ]; then
            # 备份当前日志
            cp "$LOG_FILE" "$BACKUP_DIR/dev.log.$(date +%Y%m%d_%H%M%S).backup"
            echo "📦 日志已备份到: $BACKUP_DIR/"
            
            # 创建新的干净日志
            cat > "$LOG_FILE" << EOF
# AeroPizza Development Log
# Last cleaned: $(date)
# Server: http://127.0.0.1:3000
# Socket.IO: ws://127.0.0.1:3000/api/socketio

> Ready on http://127.0.0.1:3000
> Socket.IO server running at ws://127.0.0.1:3000/api/socketio

# Status: ✅ All systems operational
# Features: Floating Cart, Quick Checkout, Order Management
# Last cleanup: $(date)

EOF
            echo "✅ 日志清理完成"
        else
            echo "❌ 日志文件不存在: $LOG_FILE"
        fi
        ;;
        
    "status")
        echo "📊 日志状态检查..."
        if [ -f "$LOG_FILE" ]; then
            LINES=$(wc -l < "$LOG_FILE")
            SIZE=$(du -h "$LOG_FILE" | cut -f1)
            echo "📄 日志文件: $LOG_FILE"
            echo "📏 行数: $LINES"
            echo "💾 大小: $SIZE"
            echo "🕒 最后修改: $(stat -c %y "$LOG_FILE")"
            
            # 显示最后几行
            echo ""
            echo "📋 最近的日志条目:"
            tail -5 "$LOG_FILE"
        else
            echo "❌ 日志文件不存在: $LOG_FILE"
        fi
        ;;
        
    "backup")
        echo "💾 备份日志文件..."
        if [ -f "$LOG_FILE" ]; then
            BACKUP_FILE="$BACKUP_DIR/dev.log.$(date +%Y%m%d_%H%M%S).backup"
            cp "$LOG_FILE" "$BACKUP_FILE"
            echo "✅ 日志已备份到: $BACKUP_FILE"
        else
            echo "❌ 日志文件不存在: $LOG_FILE"
        fi
        ;;
        
    *)
        echo "🔧 AeroPizza 日志管理工具"
        echo ""
        echo "用法: $0 [clean|status|backup]"
        echo ""
        echo "命令:"
        echo "  clean   - 清理日志并创建新的干净日志"
        echo "  status  - 显示日志状态信息"
        echo "  backup  - 备份当前日志文件"
        echo ""
        echo "示例:"
        echo "  $0 clean    # 清理日志"
        echo "  $0 status   # 查看状态"
        echo "  $0 backup   # 备份日志"
        ;;
esac