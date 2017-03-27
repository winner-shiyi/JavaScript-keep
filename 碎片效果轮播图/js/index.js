var circles=document.querySelectorAll(".picFoot p span");
var slide=document.querySelector(".slide");
var imgWidth=parseInt(getComputedStyle(slide.querySelector('span')).width);		
//这里不能用offsetWidth去取宽度，因为一上来span标签是display:none的，所以取不到
var imgWrap=slide.children[0];
var timer;

//小图功能
slide.style.left=circles[0].offsetLeft-imgWidth/2+'px';
for(var i=0;i<circles.length;i++){
	circles[i].index=i;
	circles[i].onmouseover=function(){
		clearTimeout(timer);
		slide.style.display='block';
		slide.style.left=this.offsetLeft-imgWidth/2+'px';
		imgWrap.style.left=-this.index*imgWidth+'px';
	};
	circles[i].onmouseout=function(){
		timer=setTimeout(function(){
			slide.style.display='none';
		},200);
	};
	circles[i].onclick=function(){
		if(!canClick){
			return;
		}
		canClick=false;
		
		cn=this.index;
		//如果当前的索引小于上一个索引就往左走，否则往右走
		if(cn<ln){
			showMode.prevImg();
		}else{
			showMode.nextImg();
		}
	};
}


//图片运动功能
var next=document.querySelector(".next");
var prev=document.querySelector(".prev");
var imgBox=document.querySelector(".imgBox");
var text=document.querySelector(".text");
var textArr=['《天才捕手》定档3.10 科林·费斯调教裘德·洛','《西游记》的N种可能','《爱乐之城》 - 北京147家影院上映1122场','《极限特工：终极回归》 - 北京152家影院上映1623场','《非凡任务》曝预告海报 黄轩变身硬汉大秀肌肉'];
var ln=0;				//上一张图片的索引
var cn=0;				//当前图片的索引
var canClick=true;		//能否进行下次点击

//下一个
next.onclick=function(){
	if(!canClick){
		return;
	}
	canClick=false;
	
	cn++;
	if(cn==circles.length){
		cn=0;
	}
	
	showMode.nextImg();
};
//上一个
prev.onclick=function(){
	if(!canClick){
		return;
	}
	canClick=false;
		
	cn--;
	if(cn==-1){
		cn=circles.length-1;
	}
	
	showMode.prevImg();
};

var showMode={
	row:3,
	col:8,
	createDom:function(){
		this.w=imgBox.offsetWidth/this.col;			//方块的宽
		this.h=imgBox.offsetHeight/this.row;			//方块的高
		var str='';									//放方块的字符串
		var img=imgBox.children[0];					//后面的那张图片
		
		img.src='images/'+cn+'.jpg';
		for(var i=0;i<this.row;i++){
			for(var j=0;j<this.col;j++){
				var l=j*this.w;
				var t=i*this.h;
				
				str+='<div style="width:'+this.w+'px;height:'+this.h+'px;left:'+l+'px;top:'+t+'px;background:url(images/'+ln+'.jpg) -'+l+'px -'+t+'px;" data-addnum="'+(i+j)+'" data-cutnum="'+(j-i)+'"></div>';
			}
		}
		
		imgBox.innerHTML+=str;
		
		var divs=imgBox.getElementsByTagName('div');
		this.newDivs=Array.prototype.slice.call(divs);
	},
	move:function(x,y){
		//运动圆点、文字、方块
		var This=this;
		circles[ln].className='';
		circles[cn].className='active';
		
		text.style.bottom='-40px';
		
		for(var i=0;i<this.newDivs.length;i++){
			(function(i){
				setTimeout(function(){
					This.newDivs[i].style.transform='translate('+x+'px,'+y+'px)';
					This.newDivs[i].style.opacity=0;
				},i*40);
			})(i);
		}
		
		//运动结束
		var n=0;
		this.newDivs[this.newDivs.length-1].addEventListener('transitionend',function(){
			n++;
			if(n==1){
				imgBox.innerHTML='<img src="images/'+cn+'.jpg" alt="" />';
				ln=cn;
				canClick=true;
				text.style.bottom=0;
				text.innerHTML=textArr[cn];
			}
		});
	},
	nextImg:function(){
		this.createDom();
		this.newDivs.sort(function(a,b){
			return b.dataset.cutnum-a.dataset.cutnum;
		});
		this.move(this.w,-this.h);
	},
	prevImg:function(){
		this.createDom();
		this.newDivs.sort(function(a,b){
			return a.dataset.addnum-b.dataset.addnum;
		});
		this.move(-this.w,-this.h);
	}
};
