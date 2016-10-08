# lottery [刮刮卡，大转盘，老虎机]

## 文档说明

lottery都继承了**Events**类 插件操作传递数据都通过on绑定 都包含了3个事件[start,end,reset]</br>
start => (next) 抽奖前触发，主要用于抽奖信息处理，传递回调函数next，需进行调用。</br>
end => () 抽奖结束触发</br>
reset => () 抽奖重置触发，主要出现调用了lottery.reset()</br>

lottery都包含了3个操作函数 [setResult,reset,draw]</br>
setResult => (result) 设置抽奖结果</br>
reset => () 重置抽奖</br>
draw => () 开始抽奖（注：刮刮卡调用此方法后会直接显示结果）</br>

### 刮刮卡

```html
<canvas id="js_lottery"></canvas>
<button onclick="lottery.reset()">再来一次</button>
```

```javascript
var lottery = new LotteryCard(document.getElementById('js_lottery'),{
    size: 20, //滑动区域大小
    percent: 50, //激活百分比到谋个值 就全显示
    resize: true, //canvas的大小是否是可变的
    cover: null //img or color string, default gray
});
lottery.on('start',function(){
    //中奖结果，传递是中奖结果图片地址
    lottery.setResult('...imageSrc');
}).on('end',function(){}).on('reset',function(){});
```

### 大转盘

```html
<div class="dial">
    <div id="js_pointer" class="pointer">
        <a class="btn" href="javascript:;" onclick="lottery.draw()"></a>
    </div>
</div>
```

```javascript
var lottery = new LotteryDial(document.getElementById('js_pointer'), {
        speed: 30, //每帧速度
        areaNumber: 8, //奖区数量
        deviation: 2 //随机结果角度偏差值 为了防止出现指针和扇区分割线无限重合 单位:°
    });
    var index = -1;
    lottery.on('start', function () {
        //请求获取中奖结果
        index = Math.round(Math.random() * 7);
        //中奖结果，传递停留奖区下标0开始
        lottery.setResult(index);
    }).on('end', function () {
        console.log('中奖奖区：' + index);
    }).on('reset',function(){});
```

### 老虎机

```html
<div class="tiger">
    <div class="m-ui-tiger">
        <div class="item">
            <ul class="roller">
                <li>
                    <img src="images/tiger_awards_1.png" alt=""/>
                </li>
                <li>
                    <img src="images/tiger_awards_2.png" alt=""/>
                </li>
                <li>
                    <img src="images/tiger_awards_3.png" alt=""/>
                </li>
            </ul>
        </div>
        <div class="item">
            <ul class="roller">
                <li>
                    <img src="images/tiger_awards_1.png" alt=""/>
                </li>
                <li>
                    <img src="images/tiger_awards_2.png" alt=""/>
                </li>
                <li>
                    <img src="images/tiger_awards_3.png" alt=""/>
                </li>
            </ul>
        </div>
        <div class="item">
            <ul class="roller">
                <li>
                    <img src="images/tiger_awards_1.png" alt=""/>
                </li>
                <li>
                    <img src="images/tiger_awards_2.png" alt=""/>
                </li>
                <li>
                    <img src="images/tiger_awards_3.png" alt=""/>
                </li>
            </ul>
        </div>
        <a id="js_toggle" class="toggle" href="javascript:;" onclick="lottery.draw()"></a>
    </div>
</div>
```

```javascript
//老虎机动画因为性能问题采用css3 所以需要完成2个动画fx-bounce fx-roll 详细查看examples
var lottery = new LotteryTiger(document.getElementById('js_toggle'), document.querySelectorAll('.roller'), {
        interval: 300, //每个roller间动画间隔
        aniMinTime: 6000, //动画执行最少时间
        resize: true //roller大小是否是可变的
    });
    lottery.on('start', function () {
            setTimeout(function () {
                var ret = [Math.round(Math.random() * 2), Math.round(Math.random() * 2), Math.round(Math.random() * 2)];
                //中奖结果，传递每个roller停留下标0开始
                lottery.setResult(ret);
            }, 1000);
        }).on('end', function(){}).on('reset',function(){});
```


## 浏览器支持

![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | 10+ ✔ | Latest ✔ | Latest ✔ |