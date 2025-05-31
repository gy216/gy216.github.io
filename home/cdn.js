       // 完整的 Cloudflare CDN 节点城市映射表
        const cdnLocationMap = {
            // 亚洲
            "HKG": "香港, 中国",
            "TPE": "台北, 中国台湾",
            "NRT": "东京, 日本",
            "SIN": "新加坡",
            "BKK": "曼谷, 泰国",
            "ICN": "首尔, 韩国",
            "DEL": "德里, 印度",
            "BOM": "孟买, 印度",
            "KUL": "吉隆坡, 马来西亚",
            "CGK": "雅加达, 印度尼西亚",
            "MNL": "马尼拉, 菲律宾",
            "DAC": "达卡, 孟加拉国",
            "KTM": "加德满都, 尼泊尔",
            "PBH": "廷布, 不丹",
            "PNH": "金边, 柬埔寨",
            "HAN": "河内, 越南",
            "SGN": "胡志明市, 越南",
            "VTE": "万象, 老挝",
            "RGN": "仰光, 缅甸",
            "ULN": "乌兰巴托, 蒙古",
            "EVN": "埃里温, 亚美尼亚",
            
            // 北美
            "LAX": "洛杉矶, 美国",
            "SFO": "旧金山, 美国",
            "SEA": "西雅图, 美国",
            "DEN": "丹佛, 美国",
            "ORD": "芝加哥, 美国",
            "DFW": "达拉斯, 美国",
            "ATL": "亚特兰大, 美国",
            "SJC": "圣何塞, 美国",
            "JFK": "纽约, 美国",
            "MIA": "迈阿密, 美国",
            "YYZ": "多伦多, 加拿大",
            "YVR": "温哥华, 加拿大",
            "YUL": "蒙特利尔, 加拿大",
            
            // 欧洲
            "LHR": "伦敦, 英国",
            "MAN": "曼彻斯特, 英国",
            "EDI": "爱丁堡, 英国",
            "AMS": "阿姆斯特丹, 荷兰",
            "FRA": "法兰克福, 德国",
            "MUC": "慕尼黑, 德国",
            "CDG": "巴黎, 法国",
            "MRS": "马赛, 法国",
            "MAD": "马德里, 西班牙",
            "BCN": "巴塞罗那, 西班牙",
            "FCO": "罗马, 意大利",
            "MXP": "米兰, 意大利",
            "ZRH": "苏黎世, 瑞士",
            "VIE": "维也纳, 奥地利",
            "PRG": "布拉格, 捷克",
            "WAW": "华沙, 波兰",
            "IST": "伊斯坦布尔, 土耳其",
            "DME": "莫斯科, 俄罗斯",
            "LED": "圣彼得堡, 俄罗斯",
            
            // 大洋洲
            "SYD": "悉尼, 澳大利亚",
            "MEL": "墨尔本, 澳大利亚",
            "BNE": "布里斯班, 澳大利亚",
            "PER": "珀斯, 澳大利亚",
            "AKL": "奥克兰, 新西兰",
            "WLG": "惠灵顿, 新西兰",
            
            // 南美
            "GRU": "圣保罗, 巴西",
            "GIG": "里约热内卢, 巴西",
            "EZE": "布宜诺斯艾利斯, 阿根廷",
            "SCL": "圣地亚哥, 智利",
            "LIM": "利马, 秘鲁",
            "BOG": "波哥大, 哥伦比亚",
            
            // 非洲
            "JNB": "约翰内斯堡, 南非",
            "CPT": "开普敦, 南非",
            "LOS": "拉各斯, 尼日利亚",
            "NBO": "内罗毕, 肯尼亚",
            "CAI": "开罗, 埃及",
            "TNR": "塔那那利佛, 马达加斯加"
        };

        // 检测 CDN 节点
        function detectCDNNode() {
            const cdnElement = document.getElementById("cdn");
            
            fetch('/cdn-cgi/trace')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    // 提取colo代码
                    const coloMatch = data.match(/colo=([A-Z]+)/);
                    if (!coloMatch) {
                        throw new Error('No colo code found');
                    }
                    
                    const coloCode = coloMatch[1];
                    const location = cdnLocationMap[coloCode] || `节点中文未收录 (${coloCode})`;
                    
                    // 更新显示
                    cdnElement.textContent = location;
                    cdnElement.className = "";
                })
                .catch(error => {
                    console.error("CDN检测错误:", error);
                    cdnElement.textContent = "本地访问 (未检测到CDN)";
                    cdnElement.className = "error";
                });
        }

        // 页面加载完成后开始检测
        document.addEventListener("DOMContentLoaded", detectCDNNode);