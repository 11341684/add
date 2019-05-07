# 此文可以带领你认识加法的魅力
* 为什么需要数字？
* 无限进制下1+1=2计算逻辑
* 为什么需要有限进制？
* 有限进制下的加法逻辑
* 进制如何处理
* 如何用js实现加法？
* 如何用js不显式的用+号实现加法？

## 为什么需要数字？

因为要做计算，生活中必不可少。常见的就是交易找零，货品价值表示都需要数字。


## 无限进制下1+1=2计算逻辑
1和2都是我们定义好的阿拉伯数字，在此之前10以内的数字大多都是用手指头表示，如果用手指表示0-10的话，应该是下面这个样子。
如果要求和，不管是js还是别的语言，都很简单，那就是两数相加即可，类似下面这个

|

||

|||

||||

|||||

||||||

|||||||

||||||||

|||||||||


在进制上，这种我们可以算是无限进制，因为永远不会有进位的存在。
我们计算加法的时候就可以这样计算，通过组合来，将两者合并在一起。

|+|=||

|+||=|||

在js中，我们计算这种加法可以用concat函数来
```
// |+|=||
"|".concat("|") // "||"
```
类似我们掰手指头算数一样的道理，不过随着数字的变大，很快我们手指头不够用了。

## 为什么需要有限进制？
+ 手指头不够用
+ 视觉上很难判断一堆竖杠到底是多大的数，在交易的时候找零变得非常麻烦
+ 占用了脑袋很大的空间去存储一个大数
+ ...

我们需要一种高效的表示大数的方法，祖先选择了10进制（可能是十个手指的原因）。因为有进位的产生，我们上面用竖杠的表示方法行不通了，||是代表2还是代表11就有了争议，
而且一堆杠看不直观，那就需要10个能表示不同数字的字符，0，1，2，3，4，5，6，7，8，9。目前是比较通用的结构，还有我们的零，一，二，三...等等，
都可以表示十进制。

## 有限进制下的加法逻辑
+ 0-9如何存储？
+ 数字如何相加，进位情况下如何计算？

存储：0-9因为每连续的两个数字的间隔是一样的，存储上就用链式结构。数组当然也可以，但是查找的的时候要用到iterator才行。用链式结构我觉得比较直观。
```
{
    value:"0",
    next:{
        value:"1",
        next:{
            value:"2",
            next:{
                value:"3",
                next:{
                    //....
                }
            }
        }
    }
}
```

计算：加数和被加数长度补齐，依次遍历每一位数。
再从头遍历链式结构,每一次循环，判断当前的value值是否和被加数的值是否一致，如果不一致，将加数后移，加链式引用后移，如果一致，则跳出循环。
此时和即为加数的值。存在进位的情况下，事先将进位存储起来，下次遍历时参与加法计算，计算逻辑和加数与被加数一致。
```
_add(number){
    //求两个数字，哪个数字大，返回值是最大的那个数
    let max=this.isMax(number,true);
    if(max){
        //如果max为空，则是说明相等，否则，将两个数的长度强行相等，长度小的前面补flag.value 也就是虚无
        if(max===number){
            this.padStart(this,number)
        }else {
            number.padStart(number,this);
        }
    }
    //反转虚拟数字，并用遍历器，一次读取每一位数
    let value=this.value.split("").reverse().join("")[Symbol.iterator]();
    let augend=number.value.split("").reverse().join("")[Symbol.iterator]();
    let flag = NumberString.flag;
    let result=[];//结果
    let carry=flag;//进位
    while (true){
        //遍历每一个数字
        let nextCarry=flag;
        let a=value.next();
        let b=augend.next();
        if(a.done||b.done){
            //如果执行完毕，判断是否有进位的情况，有的话就把进位放到第一个。
            if(flag.value!==carry.value){
                result.unshift(carry.value);
            }
            break
        }else {
            let cur=flag;
            //获取加数的位置
            let ap=NumberString.getPosition(a.value);
            while (true){//加数和被加数相加
                //遍历链式结构，如果当前位置和被加数的值是一样的，跳出循环，否则移动当前引用到下一个虚拟数字
                if(cur.value===b.value){
                    break
                }else {
                    cur=cur.next;
                    ap=ap.next;
                    //链到头了？进位一下。重头再来
                    if(!ap){
                        nextCarry=nextCarry.next;
                        ap=flag;
                    }
                }

            }
            cur=flag;//重置
            while (true){//进位和前面的和相加
                //遍历链式结构，如果当前位置和进位数的值是一样的，跳出循环，否则移动当前引用到下一个虚拟数字
                if(cur.value===carry.value){
                    break;
                }else {
                    cur=cur.next;
                    ap=ap.next;
                    //链到头了？进位一下。重头再来
                    if(!ap){
                        nextCarry=nextCarry.next;
                        ap=flag;
                    }
                }
            }
            //进位保存下，下一项的时候要用
            carry=nextCarry;
            //每一项的保存在结果中
            result.unshift(ap.value);
        }
    }
    //将和输出
    return result.join("");
}
```

## 进制如何处理

其实很简单，链式结构如果只有0,1就是2进制，如果链式结构长度为10，就是10进制。

## 如何用js实现加法？
```
function add(a,b) {
    return a+b
}
```
## 如何用js不显式的用+号实现加法？

下面代码只讨论实现，不讨论效率优化。
既然不能用+号，那我们用number类型就失去了意义，虚拟数字类型登场，虚拟数字代替数字，add函数代替+号 自定义isNaN代替isNaN,自定义Max函数代替Math.max。

```
//既然不能用+号，那我们用number类型就失去了意义，虚拟数字类型登场，虚拟数字代替数字，add函数代替+号 自定义isNaN代替isNaN,自定义Max函数代替Math.max。
class NumberString {
    //唯一的目的就是将数字变成字符串
    constructor(number,system){
        this.system=system||"9";//默认十进制
        this.value=String(number);
        //判断是否是个数字
        if(this.isNaN())throw new Error(String(this.value).concat(' is not a number'));
    }
    // 要确保后面两个数都是虚拟数字类型
    static add(number1,number2){
        if(!number1||!number2){
            throw new Error("number 必填哦");
        }
        if(!(number1 instanceof NumberString)){
            number1=new NumberString(number1);
        }
        if(!(number2 instanceof NumberString)){
            number2=new NumberString(number2);
        }
        return number1._add(number2);
    }
    add(number){
        return NumberString.add(this,number);
    }
    //模拟实现isNaN函数，遍历每一个字符，确保每一个字符都在flag链式结构中，否则就不是数字
    isNaN(number=this.value){
        if(typeof number!=='string'){
            number=String(number);
        }
        let value=number[Symbol.iterator]();
        while (true){
            let next=value.next();
            if(next.done){
                break;
            }else {
                let cur=this.getFlag();
                let isTrue=false;
                while (cur){
                    if(cur.value===next.value){
                        isTrue=true;
                        break
                    }else {
                        cur=cur.next
                    }
                }
                if(!isTrue){
                    return true
                }
            }
        }
        return false
    }
    //加法的核心逻辑
    _add(number){
        //求两个数字，哪个数字大，返回值是最大的那个数
        if (this.system!==number.system)throw new Error("两个虚拟数字的进制不同，暂时只支持相同进制的数字相加");
        let max=this.isMax(number,true);
        if(max){
            //如果max为空，则是说明相等，否则，将两个数的长度强行相等，长度小的前面补flag.value
            if(max===number){
                this.padStart(this,number)
            }else {
                number.padStart(number,this);
            }
        }
        //反转虚拟数字，并用遍历器，一次读取每一位数
        let value=this.value.split("").reverse().join("")[Symbol.iterator]();
        let augend=number.value.split("").reverse().join("")[Symbol.iterator]();
        let flag = this.getFlag();
        let result=[];
        let carry=flag;
        while (true){
            //遍历每一个数字
            let nextCarry=flag;
            let a=value.next();
            let b=augend.next();
            if(a.done||b.done){
                //如果执行完毕，判断是否有进位的情况，有的话就把进位放到第一个。
                if(flag.value!==carry.value){
                    result.unshift(carry.value);
                }
                break
            }else {
                let cur=flag;
                //获取加数的位置
                let ap=this.getPosition(a.value);
                while (true){//加数和被加数相加
                    //遍历链式结构，如果当前位置和被加数的值是一样的，跳出循环，否则移动当前引用到下一个虚拟数字
                    if(cur.value===b.value){
                        break
                    }else {
                        cur=cur.next;
                        ap=ap.next;
                        //链到头了？进位一下。重头再来
                        if(!ap){
                            nextCarry=nextCarry.next;
                            ap=flag;
                        }
                    }

                }
                cur=flag;//重置
                while (true){//进位和前面的和相加
                    //遍历链式结构，如果当前位置和进位数的值是一样的，跳出循环，否则移动当前引用到下一个虚拟数字
                    if(cur.value===carry.value){
                        break;
                    }else {
                        cur=cur.next;
                        ap=ap.next;
                        //链到头了？进位一下。重头再来
                        if(!ap){
                            nextCarry=nextCarry.next;
                            ap=flag;
                        }
                    }
                }
                //进位保存下，下一项的时候要用
                carry=nextCarry;
                //每一项的保存在结果中
                result.unshift(ap.value);
            }
        }
        //将和输出
        return result.join("");
    }
    getPosition(str){
        //遍历当前数字在链式结构的位置，也就是0=top，1=top.next，2=top.next.next;
        let cur=this.getFlag();
        while (cur){
            if(cur.value===str){
                break;
            }else {
                cur=cur.next;
            }
        }
        return cur
    }
    getFlag(system=this.system){
        let srcFlag=NumberString.flag;
        let flag = {};
        let _flag=flag;
        if(!system)system=NumberString.flag.next.value;
        while (true){
            _flag.value=srcFlag.value;
            if(_flag.value===system){
                _flag.next=null;
                break;
            }else {
                _flag.next={};
                _flag=_flag.next;
                srcFlag=srcFlag.next;
            }
        }
        return flag
    }
    //补虚拟0操作
    padStart(_this=this,number,str=NumberString.flag.value){
        while (_this.isMax(number,true)){
            _this.value=str.concat(_this.value);
        }
        return _this.value
    }
    //判断那个数字大，没考虑首位为0的情况
    isMax(number,onlyLength){
        let cur=this.getFlag();
        let value=this.value[Symbol.iterator]();
        let augend=number.value[Symbol.iterator]();
        let unitMax;
        while (true){
            let vn=value.next();
            let an=augend.next();
            //谁先结束谁小
            if(vn.done||an.done){
                if(vn.done===an.done){
                    //长度相同则首字符大的为大
                    return unitMax
                }
                if(vn.done){
                    return number
                }
                return this
            }
            if(!vn.done&&an.done){
                return this
            }
            //谁的首字符大谁大
            if(vn.value!==an.value&&!unitMax&&!onlyLength){
                while (cur.value){
                    if(vn.value===cur.value){
                        unitMax=number;
                        break;
                    }
                    if(an.value===cur.value){
                        unitMax=this;
                        break;
                    }
                }
            }
        }
    }
}
NumberString.flag = {
    value:"0",
    next:{
        value:"1",
        next:{
            value:"2",
            next:{
                value:"3",
                next:{
                    value:"4",
                    next:{
                        value:"5",
                        next:{
                            value:"6",
                            next:{
                                value:"7",
                                next:{
                                    value:"8",
                                    next:{
                                        value:"9",
                                        next:{
                                            value:"a",
                                            next:{
                                                value:"b",
                                                next:{
                                                    value:"c",
                                                    next:{
                                                        value:"d",
                                                        next:{
                                                            value:"e",
                                                            next:{
                                                                value:"f",
                                                                next:null
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
(function () {
    const a= new NumberString("9");
    const b= new NumberString("999");
    console.log(a.add(b));
})();
```
## 总结
+ 为什么1+2=3，因为根据链式结构的的移动1+1+1，最后移动到3的位置了。
+ 为什么2>1 ，因为根据链式结构的遍历得知，1先到，2后到，得出2在1的后面，先到的值是小的。
+ 为什么20>05，谁的长度长谁大，长度相等时候，谁的首位数大谁大，首位数大小比较逻辑同样也是遍历链式结构得来的。（上面没有考虑首位数为0的操作，首位数为0应该去除。）


加法借鉴了小学的加法思路，因个人能力有限，以上内容多有疏漏，欢迎大家指正。
##  [完整代码地址](https://github.com/11341684/add)