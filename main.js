function Clock(){
	this.init=function(){
		
		this.renderList();
		this.bindEvent();

	}
	//函数绑定
	this.bindEvent=function()
	{
		//先添加一个这个函数的全局作用域
		var that=this;
		//弹出新增页面
		$('#exampleModal').on('show.bs.modal', function (event) {
		  var button = $(event.relatedTarget);
		  var recipient = button.data('whatever');
		  var modal = $(this)
		  modal.find('.modal-title').text('New message to ' + recipient)
		  modal.find('.modal-body input').val(recipient)
		});
		//保存
		document.getElementById("save").addEventListener("click",function()
		{

			//这里的作用域变了不能直接用this 
			that.saveClock();
		});
		//开始 像这种函数的回调 一般都会把作用域变掉的
		$(document).on("click",".startClock",function(){
			//获取开始按钮中data-time属性值
			var time=$(this).attr("data-time");
			//获取开始按钮中data-index属性值
			var index=$(this).attr("data-index");

			that.startClock(time,index)
		})
		//删除  是不是这样写
		$(document).on('click','.delete',function(){
			var i=$(this).attr("data-id");
			that.removeClock(parseInt(i));//这里可能要转换一下 因为i是字符串来的 明白了 试下
			//更新列表 that.dataArr不就是已经保存了的数据么 直接遍历出来就好啦
			var strHtml="";
		    for (var i=0;i<that.dataArr.length;i++) {
		    	var leftTime = that.dataArr[i].time*60; //秒 
		  		var hours = parseInt(leftTime / 60 / 60 % 24 , 10); //计算剩余的小时 
		  		var minutes = parseInt(leftTime  / 60 % 60, 10);//计算剩余的分钟 
		  		var seconds = parseInt(leftTime % 60, 10);
		  		//计算剩余的秒数  
				hours = that.checkTime(hours); 
				minutes =that.checkTime(minutes); 
			    seconds = that.checkTime(seconds); 
			    var timeClock = hours+':'+minutes+':'+seconds;
		       strHtml+='<tr>\n' +
		            '<td id="selectBox"><input type="checkbox"/></td>\n' +
		            '<td id="itemNum">'+(i+1)+'</td>\n' +
		            '<td id="messageText">'+that.dataArr[i].message+'</td>\n' +
		            '<td id="timeText'+i+'">'+timeClock+'</td>\n' +
		            '<td id="buttonType"><button class="btn btn-danger btn-xs startClock" data-time="'+leftTime+'" data-index="'+i+'">开始</button>&nbsp;<button class="btn btn-default btn-xs delete" data-id="'+i+'">删除</button></td>\n' +
		            '</tr>' 
		    }
		   
		    $("#table-data").html(strHtml);
		})

	}
	this.dataArr = [];	
	this.storage = window.localStorage;
	//遍历列表
	this.renderList=function(){
		console.log(this.storage.getItem("data"))
		if(this.storage.getItem("data"))
		{
			//..........
			this.dataArr=JSON.parse(this.storage.getItem("data"));

		}else{
			this.storage.setItem("data","[]");
			this.dataArr=JSON.parse(this.storage.getItem("data"));

		}
	    var strHtml="";
	    for (var i=0;i<this.dataArr.length;i++) {
	    	var leftTime = this.dataArr[i].time*60; //秒 
	  		var hours = parseInt(leftTime / 60 / 60 % 24 , 10); //计算剩余的小时 
	  		var minutes = parseInt(leftTime  / 60 % 60, 10);//计算剩余的分钟 
	  		var seconds = parseInt(leftTime % 60, 10);
	  		//计算剩余的秒数  
			hours = this.checkTime(hours); 
			minutes = this.checkTime(minutes); 
		    seconds = this.checkTime(seconds); 
		    var timeClock = hours+':'+minutes+':'+seconds;
	       strHtml+='<tr>\n' +
	            '<td id="selectBox"><input type="checkbox"/></td>\n' +
	            '<td id="itemNum">'+(i+1)+'</td>\n' +
	            '<td id="messageText">'+this.dataArr[i].message+'</td>\n' +
	            '<td id="timeText'+i+'">'+timeClock+'</td>\n' +
	            '<td id="buttonType"><button class="btn btn-danger btn-xs startClock" data-time="'+leftTime+'" data-index="'+i+'">开始</button>&nbsp;<button class="btn btn-default btn-xs delete" data-id="'+i+'">删除</button></td>\n' +
	            '</tr>' 
	           
	      
	    }
	   
	    $("#table-data").html(strHtml);
	}
	//删除记录
	this.removeClock=function(index)
	{
		this.dataArr.splice(index,1);//这是数组的删除吗 deidei 和push有什么不一样 push是添加

		this.storage.setItem("data",JSON.stringify(this.dataArr));

	}
	
    // 点击开始按钮
    this.startClock=function(time,i){
    	if(!this.dataArr[i].isStart)
    	{
    		var fullTime = this.dataArr[i].time;
    		console.log(fullTime)
    		this.dataArr[i].isStart=true;
	        // var clockTime = time*1000;;
	        //这里的作用域也变了
	        var that=this;

	        //这里也是 用到了函数的回调
			var countdown = setInterval(function(){
				time --;
				
				var hours = that.checkTime(parseInt(time / 60 / 60 % 24 , 10)); //计算剩余的小时 
			  	var minutes = that.checkTime(parseInt(time  / 60 % 60, 10));//计算剩余的分钟 
			  	var seconds = that.checkTime(parseInt(time % 60, 10));//计算剩余的秒数 
			  	$("#timeText"+i).text(hours+":"+minutes+":"+seconds);
			  	if (time == 0) {
			  		alert("时间到");
			  		clearInterval(countdown);
			  		that.dataArr[i].time=fullTime;
			  		that.dataArr[i].isStart=false;
			  	} 
			},1000);
    	}
    	

	}
    this.checkTime=function(i){ //将0-9的数字前面加上0，例1变为01 
		  if(i<10) { 
		    i = "0" + i; 
		  } 
		  return i; 
	}

	this.saveClock=function(){
		var clockTime = $('#time-text').val();
		var clockMessage = $('#message-text').val();

		if(!window.localStorage){
	            alert("浏览器不支持localstorage");
	        }else{
	            //写入字段
	            var data = {
	            	time : clockTime,
	            	message : clockMessage,
	            	isStart:false
	            }
	            this.dataArr.push(data);
	            this.storage.setItem("data",JSON.stringify(this.dataArr));
	            // console.log(1)
	            // console.log(this.storage.getItem("data"))
	        }
	    // 遍历数据
        strHtml=""
	    for (var i=0;i<this.dataArr.length;i++) {
	    	var leftTime = this.dataArr[i].time*60; //秒 
	  		var hours = parseInt(leftTime / 60 / 60 % 24 , 10); //计算剩余的小时 
	  		var minutes = parseInt(leftTime  / 60 % 60, 10);//计算剩余的分钟 
	  		var seconds = parseInt(leftTime % 60, 10);//计算剩余的秒数  
			hours = this.checkTime(hours); 
			minutes = this.checkTime(minutes); 
		    seconds = this.checkTime(seconds); 
		    var timeClock = hours+':'+minutes+':'+seconds;
		    strHtml+='<tr>\n' +
                '<td id="selectBox"><input type="checkbox"/></td>\n' +
                '<td id="itemNum">'+(i+1)+'</td>\n' +
                '<td id="messageText">'+this.dataArr[i].message+'</td>\n' +
                '<td id="timeText'+i+'">'+timeClock+'</td>\n' +
                '<td id="buttonType"><button class="btn btn-danger btn-xs startClock" data-time="'+leftTime+'" data-index="'+i+'">开始</button> &nbsp; <button class="btn btn-default btn-xs delete">删除</button></td>\n' +
                '</tr>'
	    	$("#table-data").html(strHtml);
	    }
	}
}