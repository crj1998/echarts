
function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}



/*明星对象*/
function star(id, n, g, l, d){
    this.uid = id;
    this.name=n;
    this.gender=g;
    this.lift=l;
    this.detail=d;
}
/*
function getdata(jsondata){
    star_list = jsondata.data.star_list;
    for (var i=0, len=star_list.length; i<len; i++){
        var si = star_list[i];
        var det = [si.rank_info[0].score.toFixed(1), si.rank_info[1].score.toFixed(1), si.rank_info[2].score.toFixed(1), si.rank_info[3].score.toFixed(1), si.rank_info[4].score.toFixed(1)];
        var s = new star(si.info.sid, si.info.nick, si.info.gender, si.lift, det);
        data.push(s);
    }
}*/


/*function getdata_by_ajax(){
    var data = []
    var ajax = new XMLHttpRequest();
    var url = 'https://jsonp.afeld.me/?url=https://topstar.h5.weibo.cn/rank/list?rType=5&dType=day&sort=rank&page=1&limit=99';
    ajax.open('get', url);
    ajax.send();
    jsondata = JSON.parse(ajax.responseText);
    star_list = jsondata.data.star_list;
    for (var i=0, len=star_list.length; i<len; i++){
        var si = star_list[i];
        var det = [si.rank_info[0].score.toFixed(1), si.rank_info[1].score.toFixed(1), si.rank_info[2].score.toFixed(1), si.rank_info[3].score.toFixed(1), si.rank_info[4].score.toFixed(1)];
        var s = new star(si.info.sid, si.info.nick, si.info.gender, si.lift, det);
        data.push(s);
    }
    return data;
}

var data = getdata_by_ajax();
*/
/*数据初始化载入*/
var gender = {'f': 0, 'm': 0};
var lift = {'up': 0, 'down': 0, 'normal': 0};
var table = document.getElementById("tablebody");

for (var i=0, len=data.length; i<len;i++){
    var v = data[i];
    var tr=document.createElement("tr");
    var a=document.createElement("a");
    a.innerHTML = v.name;
    a.setAttribute("href", "https://m.weibo.cn/u/"+v["uid"]);
    a.setAttribute("target", "_blank");
    var td0=document.createElement("td");
    tr.onclick=function(){row_click(this);};
    td0.appendChild(a);
    /*td0.href="https://m.weibo.cn/u/"+v["uid"];*/
    tr.appendChild(td0);
    for (var j=1; j<6; j++){
        var td=document.createElement("td");
        td.innerHTML=v.detail[j-1];
        tr.appendChild(td);
        table.appendChild(tr);
    }
    gender[v['gender']]+=1;
    lift[v['lift']]+=1;
}
console.log(gender);
console.log(lift);


/*获取数组的最大值，最小值，平均值，标准差*/
function analysis(data){
    var max = Math.max.apply(null, data);
    var min = Math.min.apply(null, data);
    var sum = function(x,y){ return x+y;};
    var square = function(x){ return x*x;};
    var mean = data.reduce(sum)/data.length;
    var deviations = data.map(function(x){return x-mean;});
    var stdev = Math.sqrt(deviations.map(square).reduce(sum)/(data.length-1));
    return [max.toFixed(1), min.toFixed(1), mean.toFixed(1), stdev.toFixed(1)];
}

function init_info_table(data){
    var infotable = document.getElementById("infotable");
    for (var i=0; i<5; i++){
        var d = data.map(function(item){return item.detail[i]});
        var result = analysis(d);
        for (var j=0; j<4; j++){
            var td = infotable.rows[j].cells[i+1];
            td.innerHTML = result[j];
        }
    }
}



function show_detail(){
    console.log("same");
}

function row_click(element){
    a = new Array();
    sname = element.children[0].children[0].innerHTML;
    for (var i=0; i<5; i++){
        a[i] = element.children[i+1].innerHTML;
    };
    star1 = star2;
    star2 = {value : a, name : sname};
    draw_radar(star1, star2);
    if (star1.name==star2.name){
        show_detail();
    }
}

function loadjson(){
    var ajax = new XMLHttpRequest();
    ajax.open('GET','https://topstar.h5.weibo.cn/rank/list?rType=5&dType=day&sort=rank&page=1&limit=10',true);
    ajax.setRequestHeader('referer', 'https://topstar.h5.weibo.cn/rank?rType=5');
    ajax.send();
    var json = ajax.responseText;
}



var star1 = {value : data[0].detail, name : data[0].name},
    star2 = {value : data[1].detail, name : data[1].name};
//性别环形图
function draw_sexrate(males, females){
    
    var sexrate = echarts.init(document.getElementById('sexrate'));
    var total = {
        name: '性别比',
        value: ''
    };
    option = {
        title: [{
            text: total.name,
            left: '27%',
            top: '34%',
            textAlign: 'center',
            textBaseline: 'middle',
            textStyle: {
                color: '#fff',
                fontWeight: 'normal',
                fontSize: 14
            }
        }, {
            text: total.value,
            left: '48%',
            top: '44%',
            textAlign: 'center',
            textBaseline: 'middle',
            textStyle: {
                color: '#fff',
                fontWeight: 'normal',
                fontSize: 14
            }
        }],
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        color:['#00BFFF','#FF1493'],
        legend: {
            orient: 'vertical',
            x:'right',
            /*bottom:'25%',*/
            selectedMode:false,
            formatter:function(name){
                var oa = option.series[0].data;
                var num = oa[0].value + oa[1].value ;
                for(var i = 0; i < option.series[0].data.length; i++){
                    if(name==oa[i].name){
                        return name
                        /*return name + "  "+oa[i].value+"  "+ (oa[i].value / num * 100).toFixed(2) + '%';*/
                    }
                }
            },
            data: ['男','女'],
            show:true,
            textStyle:{
                color:'#fff',
                fontWeight:'bold'
            },
        },

        series : [
            {
                name: '数量（占比）',
                type: 'pie',
                selectedMode: 'single',
                radius: ['60%', '75%'],
                center: ['30%', '50%'],
                data: [
                    {value: males, name: '男'},
                    {value: females, name: '女'}
                ],
                label: {
                    normal: {
                        show: false,
                        position: "outer",
                        align:'left',
                        textStyle: {
                            rotate:true
                        }
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    normal: {
                        label:{
                            show: true,
                            formatter: '{b} {c}'
                        }
                    }

                }
            }
        ]
    };
    sexrate.setOption(option);
}

//环形浮动率
function draw_floatingrate(up, down, normal){
    
    var floatingrate = echarts.init(document.getElementById('floatingrate'));
    var total = {
        name: '变化率'
    };
    option = {
        title: [{
            text: total.name,
            left: '27%',
            top: '34%',
            textAlign: 'center',
            textBaseline: 'middle',
            textStyle: {
                color: '#fff',
                fontWeight: 'normal',
                fontSize: 18
            }
        }, {
            text: total.value,
            left: '48%',
            top: '44%',
            textAlign: 'center',
            textBaseline: 'middle',
            textStyle: {
                color: '#fff',
                fontWeight: 'normal',
                fontSize: 18
            }
        }],
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        color:['#FF0000','#00FF00','#FFFF00'],
        legend: {
            orient: 'vertical',
            x:'right',
            /*bottom:'5%',*/
            selectedMode:false,
            formatter:function(name){
                var oa = option.series[0].data;
                var num = oa[0].value + oa[1].value + oa[2].value;
                for(var i = 0; i < option.series[0].data.length; i++){
                    if(name==oa[i].name){
                        return name;
                    }
                }
            },
            data: ['上升','下降','不变'],
            show:true,
            textStyle:{
                color:'#fff',
                fontWeight:'bold'
            },
        },
        series : [
            {
                name: '数量（占比）',
                type: 'pie',
                selectedMode: 'single',
                radius: ['60%', '75%'],
                center: ['30%', '50%'],
                data: [
                    {value: up, name: '上升'},
                    {value: down, name: '下降'},
                    {value: normal, name: '不变'}
                ],
                label: {
                    normal: {
                        show: false,
                        position: "outer",
                        align:'left',
                        textStyle: {
                            rotate:true
                        }
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    normal: {
                        label:{
                            show: true,
                            formatter: '{b} {c}'
                        }
                    }
                }
            }
        ]
    };
    floatingrate.setOption(option);
}

//五维雷达图
function draw_radar(star1,star2){
    var radar = echarts.init(document.getElementById('radar'));
    option = {
        title: {
            text: ''
        },
        tooltip: {},
        legend: {
            data: [star1.name, star2.name],
            x:"center",
            y:'bottom',
            textStyle:{
                color:"#fff"
            }
        },
        color: ['#4c95d9', '#f6731b'],
        radar: {
            name:{
                textStyle: {
                    //设置颜色
                    color:'#fff'
                }
            },
            indicator: [
                { name: '阅读人数', max: 20, color: '#e9aa00'},
                { name: '互动数', max: 20, color: '#53bf18'},
                { name: '社会影响力', max: 20, color: '#f9504a'},
                { name: '爱慕值', max: 20, color: '#12f0e9'},
                { name: '正能量值', max: 20, color: '#FF1493'}
            ],
            center: ['50%','50%'],
            /*调整在空间中大小比例*/
            radius: "45%"
        },
        series: [{
            name: '',
            type: 'radar',
            itemStyle : {
                normal : {
                    splitLine: {
                        lineStyle: {

                        }
                    },
                    label: {
                        show: false,
                        textStyle:{
                        },
                        formatter:function(params) {
                            return params.value;}
                    },
                }
            },
            data : [
                star1,
                star2
            ]
        }]
    };
    radar.setOption(option);
}



$(function(){
    draw_sexrate(gender['m'], gender['f']);
    draw_floatingrate(lift['up'], lift['down'], lift['normal']);
    draw_radar(star1, star2);
})

init_info_table(data);