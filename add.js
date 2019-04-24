function add(a,b) {
    return a+b
}
class NumberString {
    constructor(number,length){
        this.value="";
        if(typeof number!=='number'&&typeof number!=='string')throw new Error(String(number).concat(' is not a number type or string type'));
        if(this.isNaN(number))throw new Error(String(number).concat(' is not a number'));
        let numberS=number.toString();
        this.value=this.padStart(numberS,length);
    }
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
                let cur=NumberString.flag;
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
    _add(number){
        let max=this.isMax(number,true);
        if(max){
            if(max===number){
                this.value=this.padStart(this.value,number.value.length)
            }else {
                number.value=number.padStart(number.value,this.value.length);
            }
        }
        let value=this.value.split("").reverse().join("")[Symbol.iterator]();
        let augend=number.value.split("").reverse().join("")[Symbol.iterator]();
        let flag = NumberString.flag;
        let result=[];
        let carry=flag;
        while (true){
            let nextCarry=flag;
            let a=value.next();
            let b=augend.next();
            if(a.done||b.done){
                if(flag.value!==carry.value){
                    result.unshift(carry.value);
                }
                break
            }else {
                let cur=flag;
                let ap=NumberString.getPosition(a.value);
                while (true){//加数和被加数相加
                    if(cur.value===b.value){
                        break
                    }else {
                        cur=cur.next;
                        ap=ap.next;
                        if(!ap){
                            nextCarry=nextCarry.next;
                            ap=flag;
                        }
                    }

                }
                cur=flag;//重置
                while (true){//进位加
                    if(cur.value===carry.value){
                        break;
                    }else {
                        cur=cur.next;
                        ap=ap.next;
                        if(!ap){
                            nextCarry=nextCarry.next;
                            ap=flag;
                        }
                    }
                }
                carry=nextCarry;
                result.unshift(ap.value);
            }
        }
        return result.join("");
    }
    static getPosition(str){
        let cur=NumberString.flag;
        while (cur){
            if(cur.value===str){
                break;
            }else {
                cur=cur.next;
            }
        }
        return cur
    }
    padStart(value=this.value,len,str='0'){
        while (value.length<len){
            value=str.concat(value);
        }
        return value
    }
    isMax(number,onlyLength){
        let cur=NumberString.flag;
        let value=this.value[Symbol.iterator]();
        let augend=number.value[Symbol.iterator]();
        let unitMax;
        while (true){
            let vn=value.next();
            let an=augend.next();
            if(vn.done||an.done){
                if(vn.done===an.done){
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
    value:"零",
    next:{
        value:"一",
        next:{
            value:"二",
            next:{
                value:"三",
                next:{
                    value:"四",
                    next:{
                        value:"五",
                        next:{
                            value:"六",
                            next:{
                                value:"七",
                                next:{
                                    value:"八",
                                    next:{
                                        value:"九",
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
};
(function () {
    const a= new NumberString("九");
    const b= new NumberString("九");
    console.log(a.add(b));
})();
