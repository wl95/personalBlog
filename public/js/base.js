// 添加class 网标签内添加class名 obj 为标签  classn为要添加的class名 
function addClass(obj, classn) {
	var str = obj.className;
	// 如果标签内没有class名直接添加 classn 里的内容
	if(!str) {
		obj.className = classn;
	} else {
		// 如果没有找到 与classn 相同的class名 则添加  ' ' + classn
		if(hasclass(obj, classn) === -1) {
			obj.className += ' ' + classn;
		}
	}
}
// obj是获取当前的元素 ,classN想要查找的class名
function hasclass(obj, classN) {
	// 将传进来的class名存在str内
	var str = obj.className;
	/*利用if判断空字符串转换Boolean类型为false 
	  !str为true*/
	if(!str) {
		return -1;
	}
	// 先将传进来的id名 转换成数组
	var arr = str.split(' ');
	// 循环
	for(var i = 0; i < arr.length; i++) {
		// 如果数组内有与 classN想同的返回true
		if(arr[i] === classN) {
			return i;
		}
	}
	return -1;
}

// 删除 class名  obj内的class名 与 classn 相同 则删除 
function removeClass(obj, classn) {
	// 利用 hasclass函数 返回与classn对应的下标 赋值给index
	var index = hasclass(obj, classn);
	// 如果index 不等于 -1 说明 标签内有相同class名
	if(index !== -1) {
		// 将原来的标签里的class名转为数组
		var arr = obj.className.split(' ');
		// index 为找到相同class名的下标
		arr.splice(index, 1);
		// 再将删除后的数组转为字符串 添加到标签里class名
		obj.className = arr.join(' ');
	}

}

// 查找class名的标签  参数 ：oParent为查找的范围  classn为查找的class名
function getClassName(oParent, classn, tag) {
	var arr = [];

	if(typeof tag == 'undefined') {
		tag = '*';
	}

	// 范围是oParent内的所有标签
	var eles = oParent.getElementsByTagName(tag);

	for(var i = 0; i < eles.length; i++) {
		/*判断有与classn 相同的则添加到数组内
		hasclass(eles[i],classn 在每个标签内查找class名*/
		if(hasclass(eles[i], classn) >= 0) {
			arr.push(eles[i]);
		}
	}
	return arr;
}

// 获取当前元素的样式  	参数 ： obj元素名   attr样式
function getStyle(obj, attr) {
	// 判断获取元素非标准状态的样式
	if(obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		// 元素为标准状态返回的样式
		return getComputedStyle(obj)[attr];
	}
}

// 向元素后添加元素及文本  参数newElement 要添加的新元素 , 要在的元素；
function inserAfter(newElement, targetElement) {
	var parent = targetElement.parentNode;
	if(parent.lastChild === targetElement) {
		parent.appendChild(newElement);
	} else {
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
}

// 获取元素左边 或 上边的距离 参数 : 当前元素
function getpos(obj) {
	// 获取当前元素的位置
	var pos = {
		left: 0,
		top: 0
	};

	while(obj) {
		pos.left += obj.offsetLeft;
		pos.top += obj.offsetTop;
		// 每次循环都将obj付给它的父级
		obj = obj.offsetParent;
	}
	return pos;
}

// 防止冒泡
function stopPropagation(ev) {
	if(ev.stopPropagation) {
		// 标准浏览器取消冒泡
		ev.stopPropagation();
	} else {
		// ie浏览器取消冒泡
		ev.cancelBubble = true;
	}
}

// 调用事件  参数：obj 对象 eventn 事件  fn 调用的函数
function bind(obj, eventn, fn) {
	if(obj.addEventListener) {
		// 标准浏览器调用事件
		obj.addEventListener(eventn, fn, false);
	} else {
		// ie低版本浏览器调用事件
		obj.attachEvent('on' + eventn, function() {
			fn.call(obj);
		})
	}
}
// 阻止浏览器的默认行为，接收一个事件对象作为参数
function preventDefault(ev) {
	if(ev.preventDefault) {
		// 标准浏览器
		ev.preventDefault();
	} else {
		// 非标准浏览器
		ev.returnValue = false;
	}
}
// 兼容各个浏览器鼠标滑轮事件
function getMonsewheel(ev) {
	// ie和chrome浏览器
	if(ev.wheelDelta) {
		return ev.wheelDelta;
	} else {
		// ff / 火狐 浏览器
		return -40 * ev.detail;
	}
}
// 一维数组转多位数组方法一
function test(fru, nw) {
	var arr = fru;
	var newArr = [];
	var num = Math.ceil(fru.length / nw);
	for(var i = 0; i < num; i++) {
		// 用splice返回当前被删除的项
		newArr.push(arr.splice(0, nw));
	}
	return newArr;
}
// 一维数组转多位数组方法二
function totwo(fru, nw) {
	var num = Math.ceil(fru.length / nw);
	var newArr = [];
	for(var i = 0; i < num; i++) {
		// 用slice有截取方法来获取值
		newArr.push(fru.slice(i * nw, (i + 1) * nw));
	}
	return newArr;
}
// 复制对象 有兼容问题要引用json2文件
function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}
// 复制对象 方法2
function clone2(obj) {

	if(obj && typeof obj !== 'object') {
		return obj;
	}

	var newObj = {};

	for(var attr in obj) {
		newObj[attr] = arguments.callee(obj[attr]);
	}
	return newObj;
}

// 返回这个数据的类型
function isType(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1);
}

// 转驼峰
function hump(str) {
	// 正则查找横岗 和 横岗以后的一个字母
	var re = /-(\w)/g;
	var newStr = str.replace(re, function($0, $1) {
		// 将横岗后的字母转成大写返回
		return $1.toUpperCase();
	});
	return newStr;
}

// 去字符串两端的空格
function time(str) {
	// 标准浏览器
	if(str.trim) {
		return str.trim();
	} else {
		// 非标准浏览器
		return str.replace(/^\s+|\s+$/g, '');
	}
}

/* 只针对数组  访数组原生forEach方法 该方法接收两个参数
        一个是循环数组，一个是回掉函数回掉函数接收三个参数 */
function foreach(arr, fnuc) {
	/* fnuc为回掉函数 是数组里的每一项，数组的下标,数组 */
	for(var i = 0; i < arr.length; i++) {
		fnuc(arr[i], i, arr);
	}
}

/*  只针对数组  访数组原生forEach方法 该方法接收两个参数 
	一个是循环数组，一个是回掉函数,回掉函数接收三个
	参数，分别是数组里的每一项，数组的下标,数组
	返回结果是组成的数组	*/
function Map(arr, fnuc) {
	var newArr = [];
	for(var i = 0; i < arr.length; i++) {
		newArr.push(fnuc(arr[i], i, arr));
	}
	return newArr;
}

/*Map 调用方式 console.log(Map(arr, function(ele,index,arr){
	return ele + '' + index; 
}));*/

/*  只针对数组  访数组原生forEach方法 该方法接收两
	个参数一个是循环数组	*/
function filTer(arr,fnuc){
	var newArr = [];
	for(var i = 0; i < arr.length; i++) {
		/* 如果回掉函数条件为真 则返回的是组成的数组
		        条件为真的项 以及条件为真的下标  */
		if(fnuc(arr[i], i, arr)){
			newArr.push(arr[i],' 下标是' + i);
		}
	}
	return newArr;
}

/*filTer 调用方式 console.log(filTer(arr,function(ele,index,arr){
	return ele > 30;
}));*/

// 查找数组相同的项 返回其值和个数
function strNum(str){
	// 定义正则查找字符
	var re = /(\w)\1+/g;
	// 将已有的字符排序
	var newStr = str.split('').sort().join('');
	var value = 0;
	var len = 0;
	// 
	newStr.replace(re,function($0,$1){
		if($0.length > len){
			len = $0.length;
			value = $1;
		}
	});
	return '出现最多项的个数是' + len + '	出现最多项的是' + value; 
}

// 随机数
function getRandom(min,max){
	return Math.floor( Math.random() * ( max - min + 1) + min);
}

// 验证码 参数 ：n 为验证码个数
function code(n){
	var str = 'abcdefghijklmnopqrstuvwxyz';
	// 添加大写字母
	str += str.toUpperCase() + '0123456789';
	// 新字符串
	var newStr = '';
	for(var i = 0; i < n;i++){
		// 随机生成n个str里的字符 getRandom(0, str.length - 1)为随机生成下标
		newStr += str[getRandom(0, str.length - 1)];
	}
	return newStr;
}

/*  找到数组里的值  返回数组里的(对象)对应的下标 
	参数：users 当前数组  ， val 要查找的名字    */
function userN(users,val,seekval){
	for(var i = 0; i < users.length;i++){
		// 查找数组里的 username 里的值
		if(users[i][val] === seekval){
			return i;
		}
	}
	return -1;
}