//求和如此简单
function add(a,b) {
    return a+b
}
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
