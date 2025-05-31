// 作者：上古米歇尔-果园工作室 原作者：张晓雷    原作者修改自：datao2233
// 作者邮箱：2373460868@qq.com
// 原作者邮箱: nt@datao2233.top
// 协议：MIT
//
// 最新更新：2021-2-10
// +去除冗余属性
// +修复统计信息无法记录连胜BUG
// +增加提示（问号）开关功能
// +增加一个游戏结束弹出窗口，简单的计算完成度，同时在窗口上添加快捷按钮
// +空行整理

'use strict';

const QS = name => document.querySelector(name);
const QSA = name => document.querySelectorAll(name);

function random(begin, end) {
    return Math.floor(Math.random() * (end - begin + 1) + begin);
}

//屏蔽所有窗口右键
QSA('.window').forEach(item => {
    if (item.id !== 'about-games-window') {
        item.oncontextmenu = function (e) {
            e.preventDefault();
        }
    }
})

function $(name) {

    return ({

        ele: typeof name === 'string' ? document.querySelector(name) : name,

        attr: function (attr, val) {
            this.ele.setAttribute(attr, val)
        },
        css : function (type, val) {
            this.ele.style[type] = val
        },
        show: function () {
            this.ele.style.display = "block";
        },
        hide: function () {
            this.ele.style.display = "none";
        },
        text: function (val) {
            this.ele.innerText = val;
        },
        click: function (fn) {
            this.ele.addEventListener('click', fn, false);
        },
        movein: function (fn) {
            this.ele.addEventListener('mouseover', fn, false);
        },
        moveout: function (fn) {
            this.ele.addEventListener('mouseout', fn, false);
        }
    })
}

const timer = {
    id: QS('#timer'),
    step: 0,
    timerStop: undefined,
    tick: function () {
        this.id.innerText = this.step += 1;
    },
    start: function () {
        //点击直接触发第一秒
        this.id.innerText = this.step += 1;
        this.timerStop = setInterval(() => {
            timer.tick();
        }, 1000);
    },
    stop: function () {
        clearInterval(this.timerStop);
    },
    reset: function () {
        clearInterval(this.timerStop);
        this.id.innerText = this.step = 0;
    },
    getTime: function () {
        return this.step;
    }
}

const restMineNumberEle = QS('#mineNum');

function restMineDisplay(n) {
    restMineNumberEle.innerText = n;
}

function kShuffle(arr) {
    let ridx, end;
    for (let i = arr.length - 1; i >= 0; i--) {
        end = arr[i];
        ridx = random(0, i);
        arr[i] = arr[ridx];
        arr[ridx] = end;
    }
}

const Minesweeper = {

    hint: true,
    bombsNumber: undefined,
    begin: false,
    end: false,
    level: undefined,
    _x: undefined,
    _y: undefined,
    restOfCube: undefined,
    restOfBombs: undefined,
    table: Object.create(null),
    ele_desk: document.querySelector('#desk'),

    init: function (level) {

        this.level = level;

        if (level === 1) {
            this._x = 9;
            this._y = 9;
            this.bombsNumber = 10;
        } else if (level === 2) {
            this._x = 16;
            this._y = 16;
            this.bombsNumber = 40;
        } else if (level === 3) {
            this._x = 30;
            this._y = 16;
            this.bombsNumber = 99;
        } else {
            //自定义模式
            let w = +custom.w.value,
                h = +custom.h.value,
                n = +custom.n.value;

            if (w >= 9 && w <= 30 && h >= 9 && h <= 24) {
                //雷的最大数量。
                const max = (w - 1) * (h - 1);

                if (n < 10 || n > max) {
                    alert('雷数应该在 10 - ' + max + ' 之间');
                    custom.n.value = n < 10 ? 10 : max;
                    return;
                }
                this._x = w;
                this._y = h;
                this.bombsNumber = n;
                localGameData.custom[0] = w;
                localGameData.custom[1] = h;
                localGameData.custom[2] = n;
                saveGameDataToLocal();
                customTitle(true);
                $('#games-custom-window').hide();
            } else {
                alert('输入数据超出范围！')
                return;
            }
        }
        this.begin = false;
        this.end = false;
        timer.reset();
        //重置表格单元
        this.ele_desk.innerHTML = '';
        this.createDesk();
        this.sweeper();
        //重新显示雷的剩余数量
        this.restOfBombs = this.bombsNumber;
        restMineDisplay(this.restOfBombs);
        //方块的所有数量
        this.restOfCube = this._y * this._x;
    },

    start: function (ny, nx) {
        timer.start();
        this.settleBombs(ny, nx);
        this.markupAllBombs();
    },

    reset: function () {
        for (let y = 0; y < this._y; y++) {
            for (let x = 0; x < this._x; x++) {
                this.table[y][x].have = undefined;
                this.table[y][x].clue = 0;
                this.table[y][x].normal();
            }
        }
        timer.reset();
        this.begin = false;
        this.end = false;
        //重新显示雷的剩余数量
        this.restOfBombs = this.bombsNumber;
        restMineDisplay(this.restOfBombs);
        //方块的所有数量
        this.restOfCube = this._y * this._x;
    },

    getAround: function (y, x) {
        let a = [];
        this.check(y - 1, x - 1) && a.push([y - 1, x - 1]);
        this.check(y - 1, x) && a.push([y - 1, x]);
        this.check(y - 1, x + 1) && a.push([y - 1, x + 1]);
        this.check(y, x + 1) && a.push([y, x + 1]);
        this.check(y + 1, x + 1) && a.push([y + 1, x + 1]);
        this.check(y + 1, x) && a.push([y + 1, x]);
        this.check(y + 1, x - 1) && a.push([y + 1, x - 1]);
        this.check(y, x - 1) && a.push([y, x - 1]);
        return a;
    },

    check: function (y, x) {
        return y >= 0 && y < this._y && x >= 0 && x < this._x;
    },

    createDesk: function () {

        let that = this,
            _v = '-' + localGameData.BGColor;

        function makeClass(el, v) {
            return function (val, ex, isNumber = false) {
                if (isNumber) {
                    el.setAttribute('class', val);
                } else {
                    ex = ex ? (' ' + ex) : '';
                    el.setAttribute('class', val + v + ex)
                }
            }
        }

        let line, b;

        for (let y = 0; y < this._y; y++) {
            line = document.createElement('div');
            this.table[y] = Object.create(null);
            for (let x = 0; x < this._x; x++) {
                b = document.createElement('b');
                b.setAttribute('class', 'c-cover' + _v);
                this.table[y][x] = {
                    // 0 ：默认   1 : 打开状态   2 : 标记小红旗   3 : 标记问号  4 : 游戏结束
                    status: 0,
                    // undifined : 空  1 : 有雷  2 : 有数字
                    have: undefined,

                    clue: 0,

                    span: b,

                    class: makeClass(b, _v),

                    normal: function () {
                        this.class('c-cover')
                        this.status = 0;
                    },

                    open: function () {
                        this.class('c-bg')
                        this.status = 1;
                        if (this.clue) {
                            this.class('c-n' + this.clue, false, true);
                        }
                        that.restOfCube -= 1;
                    },

                    markup: function () {
                        this.class('c-flag')
                        this.status = 2;
                        that.restOfBombs -= 1;
                        restMineDisplay(that.restOfBombs);
                    },

                    doubt: function () {
                        this.class('c-doubt')
                        this.status = 3;
                        that.restOfBombs += 1;
                        restMineDisplay(that.restOfBombs);
                    },
                    //游戏结束，雷显示
                    exp: function () {
                        this.class('c-bomb')
                    },
                    //直接爆炸
                    expNow: function () {
                        this.class('c-expNow')
                        this.status = 4;
                    },
                    //游戏结束，标记正确
                    mkYesBomb: function () {
                        this.class('c-mkyes')
                    },
                    //游戏结束，标记错误
                    mkNoBomb: function () {
                        this.class('c-mkno')
                    },

                    text: function (val) {
                        this.span.innerText = val;
                    },
                    //X号
                    symbol_x: function () {
                        this.class('c-n' + this.clue + '-x', false, true)
                    },
                    //消除X号
                    symbol_x_up: function () {
                        this.class('c-n' + this.clue, false, true)
                    },

                    select_around: function () {
                        this.class('c-select')
                    },
               
                    recover: function () {
                        if (this.status === 2) {
                            this.class('c-flag')
                        } else if (this.status === 3) {
                            this.class('c-doubt')
                        } else {
                            this.class('c-cover')
                        }
                    },

                    hover: function () {
                        if (this.status === 2) {
                            this.class('c-flag', 'c-hover')
                        } else if (this.status === 3) {
                            this.class('c-doubt', 'c-hover')
                        } else {
                            this.class('c-cover', 'c-hover')
                        }
                    }
                }
                line.appendChild(b);
            }
            this.ele_desk.appendChild(line);
        }
    },

    sweeper: function () {

        let center = [],
            around = [],
            sum,
            that = this,
            leftUpLock = false,
            leftKeyPress = false,
            onlyOneLock = false;

        this.ele_desk.addEventListener('mouseleave', function () {
            aroundClear();
            leftUpLock = false;
            leftKeyPress = false;
        }, false)

        //消除动画
        function aroundClear(s, c) {

            if (that.end) { return }

            let stop, bgn = 1;
           
            if (s !== c && center.length) { 
                let c = center.pop()
                c.symbol_x();
                stop = setInterval(() => {
                    if (bgn === 1) {
                        c.symbol_x_up();
                        bgn ++;
                    } else if (bgn === 2) {
                        c.symbol_x();
                        bgn ++;
                    } else {
                        c.symbol_x_up();
                        clearInterval(stop);
                    }
                }, 90);
            }

            if (around.length) {
                for (let item of around) {
                    if (item.status === 0) {
                        item.recover();
                    }
                }
                around = [];
                sum = 0;
                leftKeyPress = false;
            }
        }
        
        function bothUpWork() {
            //执行这一个步的前提是 status === 1 && sum === clue
            //收集around数据的条件是 status === 0，也就是遮盖的方块
            //理论上到这一步，around里的数据都是空的，因为 sum === clue。但用户可能标错，所以一旦发现 have === 1 则说明触雷，游戏结束。
            //bombs方法会对标记正确还是错误进行判断，并进行标识。
            for (let item of around) {
                if (item.status === 0) {
                    if (item.have !== 1) {
                        item.open();
                    } else if (item.have === 1) {
                        item.expNow();
                        that.end = true;
                    }
                }
            }
            that.uncoverEmpty();

            if (that.end) { that.bombs();}

            that.checkWin();

            if (that.end) {
                leftUpLock = false;
                leftKeyPress = false;
                center = [];
                around = [];
                sum = 0;
            }
        }

        function aroundCheck(y, x) {

            let status, cube = that.table[y][x];

            sum = 0;

            that.getAround(y, x).forEach((p) => {
                status = that.table[p[0]][p[1]].status;
                sum += (status === 2 ? 1 : 0)
                if (status === 0) {
                    around.push(that.table[p[0]][p[1]])
                }
            })
            if (cube.status === 1 && cube.clue) {
                center.push(cube);
            } else if (cube.status === 0) {
                around.push(cube);
            }
            around.forEach(item => item.select_around())
        }

        for (let y = 0; y < this._y; y++) {
            for (let x = 0; x < this._x; x++) {

                let cube = that.table[y][x];
                //指针进入
                cube.span.addEventListener('mouseenter', function () {

                    if (!that.end) {
                        if (leftKeyPress && cube.status === 0) {
                            cube.select_around()
                        } else if (cube.status !== 1) {
                            cube.hover();
                        }
                        if (leftUpLock) {
                            aroundCheck(y, x);
                        }
                    }
                }, false)
                //指针离开
                cube.span.addEventListener('mouseleave', function () {

                    if (!that.end) {
                        if (cube.status !== 1) {
                            cube.recover();
                        }
                        if (center.length) {
                            center.shift().symbol_x_up();
                        }
                        if (around.length) {
                            aroundClear();
                        }
                    }
                }, false)
                //鼠标按下
                cube.span.addEventListener('mousedown', function (event) {

                    if (that.end) { return }

                    if (event.buttons === 1 && cube.status === 0) {
                        cube.select_around();
                        leftKeyPress = true;
                    } else if (event.buttons === 2) {
                        switch (cube.status) {
                            case 0: cube.markup(); break
                            case 2:
                                if (that.hint) {
                                    cube.doubt();
                                    break;
                                } else {
                                    that.restOfBombs += 1;
                                    restMineDisplay(that.restOfBombs);
                                }
                            case 3: cube.normal(); break
                        }
                    } else if (event.buttons === 3) {
                        leftUpLock = true;
                        onlyOneLock = false;
                        aroundCheck(y, x);
                    }
                }, false)

                //鼠标松开
                cube.span.addEventListener('mouseup', function (event) {

                    if (that.end) { return }

                    if (event.button === 0) {
                        if (!leftUpLock) {
                            leftUpLock = false;
                            leftKeyPress = false;
                            if (!that.begin) {
                                that.start(y, x);
                                that.begin = true;
                                that.end = false;
                            }
                            if (cube.status === 0) {
                                if (cube.have === 1) {
                                    cube.expNow();
                                    that.bombs();
                                } else {
                                    if (cube.have === 2) {
                                        cube.open();
                                    } else {
                                        cube.open();
                                        that.uncoverEmpty();
                                    }
                                }
                            }
                            that.checkWin();
                        } else {
                            if (!onlyOneLock) {
                                if (cube.status === 1 && cube.clue !== 0 && cube.clue === sum) {
                                    bothUpWork();
                                }
                                aroundClear(cube.clue, sum);
                                onlyOneLock = true;
                            } else {
                                onlyOneLock = false;
                            }
                            leftUpLock = false;
                        }
                    } else if (event.button === 2) {
                        if (!onlyOneLock && leftUpLock) {
                            if (cube.status === 1 && cube.clue !== 0 && cube.clue === sum) {
                                bothUpWork();
                            }
                            aroundClear(cube.clue, sum);
                            onlyOneLock = true;
                        } else {
                            onlyOneLock = false;
                        }
                    }
                }, false)
            }
        }
    },

    settleBombs: function (ny, nx) {

        let rest,
            bombs = this.bombsNumber,
            cubes = this._x * this._y - bombs,
            notList = this.getAround(ny, nx);

        notList.push([ny, nx]);
        rest = cubes - notList.length;
        let bombsArr = new Array(bombs).fill(1);
        let bothArr = bombsArr.concat(new Array(rest).fill(0))

        kShuffle(bothArr);

        notList.forEach(i => {
            this.table[i[0]][i[1]].have = 0;
        })

        for (let y = 0; y < this._y; y++) {
            for (let x = 0; x < this._x; x++) {
                if (this.table[y][x].have === undefined) {
                    this.table[y][x].have = bothArr.pop();
                }
            }
        }
    },

    markupAllBombs: function () {

        let sum = 0;

        for (let y = 0; y < this._y; y++) {
            for (let x = 0; x < this._x; x++) {
                if (this.table[y][x].have === 0) {
                    this.getAround(y, x).forEach((p) => {
                        sum += (this.table[p[0]][p[1]].have === 1 ? 1 : 0)
                    })
                }
                if (sum) {
                    this.table[y][x].clue = sum;
                    this.table[y][x].have = 2;
                }
                sum = 0;
            }
        }
    },

    uncoverEmpty: function () {

        let sum = 0, stop = false, tmp;
        while (!stop) {
            for (let y = 0; y < this._y; y++) {
                for (let x = 0; x < this._x; x++) {
                    //状态为打开，have为空
                    if (this.table[y][x].status === 1 && this.table[y][x].have === 0) {
                        this.getAround(y, x).forEach((p) => {
                            tmp = this.table[p[0]][p[1]];
                            if (tmp.status === 0) {
                                tmp.open();
                                sum += 1;
                            }
                        })
                    }
                }
            }
            stop = sum ? false : true;
            sum = 0
        }
    },

    bombs: function (isWin = false) {
        timer.stop();
        this.end = true;
        let item, markGood = 0, markBad = 0;
        for (let y = 0; y < this._y; y++) {
            for (let x = 0; x < this._x; x++) {
                item = this.table[y][x];
                //有雷，且标记小红旗
                if (item.status === 2 && item.have === 1) {
                    item.mkYesBomb();
                    markGood += 1;
                    //无雷，标记错误
                } else if (item.status === 2 && item.have !== 1) {
                    item.mkNoBomb();
                    markBad += 1;
                    //当场爆炸，游戏已经结束，暂借selec属性实现功能。
                } else if (item.status === 4) {
                    item.expNow();
                } else if (item.have === 1) {
                    item.exp();
                }
            }
        }
        if (!isWin) {
            lostSaveGameData(this.level);
            setTimeout(() => {
                let rst = markGood - markBad;
                rst = rst < 0 ? 0 : Math.floor(rst / this.bombsNumber * 100);
                custom.degree.innerText = rst;
                $('#games-lost-window').show();
                setPopupLoc('#games-lost-window');
            }, 300);
        }
    },

    checkWin: function () {
        if (this.restOfCube === this.bombsNumber) {
            restMineDisplay(0);
            this.bombs(true);
            $('#games-win-window').show();
            setPopupLoc('#games-win-window');
            timer.stop();
            this.end = true;
            $('#spendTime').text(timer.getTime() + '秒')
            winSaveGameData(this.level);
        }
    }
}

function winSaveGameData(level) {
    if (!level) { return }
    let item;
    if (level === 1) {
        item = localGameData.level1;
    } else if (level === 2) {
        item = localGameData.level2;
    } else if (level === 3) {
        item = localGameData.level3;
    }
    item.totalBout += 1;
    item.winsBout += 1;
    item.c_WinNow += 1;
    item.c_LostNow = 0;
    if (item.c_WinNow > item.c_WinPast) {
        item.c_WinPast = item.c_WinNow;
    }
    item.bestResult5.push(timer.getTime() + ':' + new Date().getTime());
    item.bestResult5.sort(sortControl);
    if (item.bestResult5.length > 5) {
        item.bestResult5.pop();
    }
    saveGameDataToLocal();
}

function lostSaveGameData(level) {
    if (!level) { return }
    let item;
    if (level === 1) {
        item = localGameData.level1;
    } else if (level === 2) {
        item = localGameData.level2;
    } else if (level === 3) {
        item = localGameData.level3;
    }
    item.totalBout += 1;
    item.c_WinNow = 0;
    item.c_LostNow += 1;
    if (item.c_LostNow > item.c_LostPast) {
        item.c_LostPast = item.c_LostNow;
    }
    saveGameDataToLocal();
}

function sortControl(a, b) {
    let ia, fa, ib, fb;
    ia = parseInt(a.slice(0, a.indexOf(":")));
    fa = parseInt(a.slice(a.indexOf(":") + 1));
    ib = parseInt(b.slice(0, b.indexOf(":")));
    fb = parseInt(b.slice(b.indexOf(":") + 1));
    if (ia !== ib) {
        return ia - ib;
    } else {
        return fa - fb;
    }
}

function formatTime(val) {
    let d = val.split(':');
    let t = new Date();
    t.setTime(d[1]);
    return ({
        'date': d[0] + "s : " + t.getFullYear() + "/" + (t.getMonth() + 1) + "/" + t.getDate(),
        'time': d[0] + "s : " + t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + '日 ' + t.getHours() + '点' + t.getMinutes() + '分'
    })
}

function moveElement(select, moveBody, marginX, marginY) {

    let startX, startY, mousePress = false;

    select = QS(select);
    moveBody = QS(moveBody);
    marginX = marginX || 5;
    marginY = marginY || 8;

    select.addEventListener("mousedown", function (event) {
        startX = event.offsetX;
        startY = event.offsetY;
        mousePress = true;
    })

    document.addEventListener("mousemove", function (event) {
        if (mousePress) {
            moveBody.style.left = event.clientX - (startX + marginX + 2) + "px";
            moveBody.style.top = event.clientY - (startY + marginY + 2) + "px";
        }
    }, false);

    document.addEventListener("mouseup", function () {
        mousePress = false;
    }, false);
}
//让窗口具备移动能力
moveElement("#move-mine", "#minesweeper");
moveElement("#move-win", "#games-win-window");
moveElement("#move-info", "#games-info-window");
moveElement("#move-about", "#about-games-window");
moveElement("#move-custom", "#games-custom-window");
moveElement("#move-lost", "#games-lost-window");

//所有关闭按钮的事件
QSA('.point3').forEach(function (item) {
    item.addEventListener('click', function () {
        $(this.parentElement.parentElement.parentElement).hide();
    }, false)
})
//所有弹出窗口的定位
function setPopupLoc(name) {
    let el = document.querySelector(name),
        m = ui.minesweeper,
        y = m.offsetTop,
        x = m.offsetLeft,
        w = m.offsetWidth,
        h = m.offsetHeight,
        el_w = el.offsetWidth,
        el_h = el.offsetHeight;
    el.style.left = (x + w / 2) - el_w / 2 + 'px';
    el.style.top = (y + h / 2) - el_h / 2 + 'px';
}

//初始数据
let initGameData = {
    //自定义
    custom: [9, 9, 10],

    startLevel: 1,

    BGColor: 1,

    hint: true,

    level1: {
        bestResult5: [],
        totalBout: 0,
        winsBout: 0,
        c_WinNow: 0,
        c_WinPast: 0,
        c_LostNow: 0,
        c_LostPast: 0,
    },

    level2: {
        bestResult5: [],
        totalBout: 0,
        winsBout: 0,
        c_WinNow: 0,
        c_WinPast: 0,
        c_LostNow: 0,
        c_LostPast: 0,
    },

    level3: {
        bestResult5: [],
        totalBout: 0,
        winsBout: 0,
        c_WinNow: 0,
        c_WinPast: 0,
        c_LostNow: 0,
        c_LostPast: 0,
    },
}

function displayInfo(obj) {

    ui.info_right[0].innerText = obj.totalBout;
    ui.info_right[1].innerText = obj.winsBout;
    ui.info_right[2].innerText = parseInt((obj.winsBout / obj.totalBout || 0) * 100) + "%";
    ui.info_right[3].innerText = obj.c_WinPast;
    ui.info_right[4].innerText = obj.c_LostPast;

    for (let i = 0; i < 5; i++) {
        ui.info_left[i].innerText = '';
    }

    let tmp;

    for (let i = 0; i < obj.bestResult5.length; i++) {
        tmp = formatTime(obj.bestResult5[i]);
        ui.info_left[i].innerText = tmp.date;
        ui.info_left[i].title = tmp.time;
    }
}

//载入本地数据
let localGameData = JSON.parse(localStorage.getItem("swpGameData"));

if (!localGameData) {
    localGameData = initGameData;
}
//增加新属性
if (localGameData.hint === undefined) {
    localGameData.hint = true;
    saveGameDataToLocal();
}
//初始化游戏
Minesweeper.init(localGameData.startLevel);
Minesweeper.hint = localGameData.hint;
//保存至本地
function saveGameDataToLocal() {
    if (window.localStorage) {
        localStorage.setItem("swpGameData", JSON.stringify(localGameData))
    } else {
        console.error("Failed to store game record to local, [window.localStorage] object not found")
    }
}
//所有UI对象的保存
const ui = {
    opt: $('#opt').ele,
    opt_list: $('#opt-list').ele,
    minesweeper: $('#minesweeper').ele,
    opt_switch: {
        l1: $('#normal-info').ele,
        l2: $('#middle-info').ele,
        l3: $('#hard-info').ele,
        bg: '#F6EFEF',
        sbg: '#87CEEB'
    },
    info_left: QSA('#win5 ul li'),
    info_right: QSA('#win5info li span')
}
//选项菜单弹出
$(ui.opt).movein(function () {
    this.querySelector('#hint-switch').innerText = '问号 : ' + (localGameData.hint ? '开' : '关');
    $(ui.opt_list).show();
})
//选项菜单移除消失
$(ui.opt).moveout(function () {
    $(ui.opt_list).hide();
})
//重新开始游戏
$('#opt-restart').click(function () {
    Minesweeper.reset();
    $(ui.opt_list).hide();
})
$('#box-restart').click(function () {
    Minesweeper.reset();
    $('#games-win-window').hide();
})
$('#box2-restart').click(function () {
    Minesweeper.reset();
    $('#games-lost-window').hide();
})
//关于窗口
$('#opt-about').click(function () {
    $('#about-games-window').show();
    //setPopupLoc('#about-games-window')
    $(ui.opt_list).hide();
})
//关卡切换
QSA('.opt-level li').forEach((item, index) => {
    item.addEventListener('click', function () {
        if (Minesweeper.level === 0) { 
            customTitle(false);
        }
        Minesweeper.init(index + 1);
        localGameData.startLevel = index + 1;
        saveGameDataToLocal();
        $(ui.opt_list).hide();
    })
}, false)

function infoSwitch(level) {
    if (level === 1) {
        $(ui.opt_switch.l1).css('background-color', ui.opt_switch.sbg)
        $(ui.opt_switch.l2).css('background-color', ui.opt_switch.bg)
        $(ui.opt_switch.l3).css('background-color', ui.opt_switch.bg)
    } else if (level === 2) {
        $(ui.opt_switch.l1).css('background-color', ui.opt_switch.bg)
        $(ui.opt_switch.l2).css('background-color', ui.opt_switch.sbg)
        $(ui.opt_switch.l3).css('background-color', ui.opt_switch.bg)
    } else if (level === 3) {
        $(ui.opt_switch.l1).css('background-color', ui.opt_switch.bg)
        $(ui.opt_switch.l2).css('background-color', ui.opt_switch.bg)
        $(ui.opt_switch.l3).css('background-color', ui.opt_switch.sbg)
    }
}

$('#opt-info').click(function () {
    let data, level = Minesweeper.level;
    if (level === 0) {
        level = 1;
    }
    $('#games-info-window').show();
    setPopupLoc('#games-info-window')
    infoSwitch(level)
    if (level === 1) {
        data = localGameData.level1;
    } else if (level === 2) {
        data = localGameData.level2;
    } else if (level === 3) {
        data = localGameData.level3;
    }
    displayInfo(data)
    $(ui.opt_list).hide();
})

$(ui.opt_switch.l1).click(function () {
    infoSwitch(1)
    displayInfo(localGameData.level1)
})

$(ui.opt_switch.l2).click(function () {
    infoSwitch(2)
    displayInfo(localGameData.level2)
})

$(ui.opt_switch.l3).click(function () {
    infoSwitch(3)
    displayInfo(localGameData.level3)
})

QSA('.opt-bg li').forEach((item, index) => {
    item.addEventListener('click', function () {
        localGameData.BGColor = index + 1;
        Minesweeper.init(Minesweeper.level)
        saveGameDataToLocal();
        $(ui.opt_list).hide();
    }, false)
})

QS('#rst-data').addEventListener('click', function () {
    if (confirm('清除所有游戏记录？')) {
        localStorage.clear();
        document.location.reload();
    }
}, false)

const custom = Object.create(null);
custom.w = QS('#custom-w');
custom.h = QS('#custom-h');
custom.n = QS('#custom-n');
custom.title = QS('#move-mine');
custom.degree = QS('#degree');

function customTitle(mode) {
    let title = '扫雷';
    custom.title.innerText = mode ? title + ' [自定义模式]' : title;    
}

$('#custom-bt').click(function () {
    Minesweeper.init(0);
})

$('#opt-custom').click(function () {
    custom.w.value = localGameData.custom[0];
    custom.h.value = localGameData.custom[1];
    custom.n.value = localGameData.custom[2];
    $('#games-custom-window').show();
    setPopupLoc('#games-custom-window');
    $(ui.opt_list).hide();
})

$('#hint-switch').click(function () {
    let hint = Minesweeper.hint ? false : true;
    localGameData.hint = Minesweeper.hint = hint;
    this.innerText = '问号 : ' + (hint ? '开' : '关');
    saveGameDataToLocal();
    $(ui.opt_list).hide();
})

$('#show-reward-name').click(function () {
    let v = $('#reward-name').ele.style.display;
    if (v === 'none') {
        $('#reward-name').show();
    } else {
        $('#reward-name').hide();
    }
})