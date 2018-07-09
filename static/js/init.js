var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var video = document.getElementById('video');
var appear_video=document.getElementById('appear_video');

var relay_photo=document.getElementById('relay_photo');
var relay_btn=document.getElementById('relay_btn');
var relay_div=document.getElementById('relay');
var Countdown=document.getElementById('Countdown');
var intetval=document.getElementById('intetval');

var play_btn=document.getElementById("play");
var continue_btn=document.getElementById("continue");

var range_num=document.getElementById("set_frame");
var modal_set_frame=document.getElementById("modal_set_frame");
var input_num=document.getElementById("input_num");
var cancel_range_num_btn=document.getElementById("cancel_range_num_btn");
var photo=document.getElementById("photo");

var image_div=document.getElementById("image");
//var now=document.getElementById("now");
var queue=document.getElementById("queue");

var photos=[];
var second=1000;
var speed=41;//1000/24~41一秒二十四帧

var translate=document.getElementById("tanslate");



//删除帧的弹出框按钮
var del_btn=document.getElementById('del');
var cancel_btn=document.getElementById('cancel');
var modal = document.getElementById('modal');
//连接摄像头
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        appear_video.src = window.URL.createObjectURL(stream);
        //video.play();
    });
}
document.onkeyup = function (e) {//按键信息对象以函数参数的形式传递进来了，就是那个e
    var code = e.charCode || e.keyCode;  //取出按键信息中的按键代码(大部分浏览器通过keyCode属性获取按键代码，但少部分浏览器使用的却是charCode)
    if (code == 13) {
        //此处编写用户敲回车后的代码
        catch_image();
    }
}

photo.addEventListener("click", function() {
	catch_image();
});

input_num.oninput=function(){
	document.getElementById('fps').innerHTML=input_num.value;
};
range_num.onclick=function(){
	modal_set_frame.style.display='block';
};
cancel_range_num_btn.onclick=function(){
	modal_set_frame.style.display='none';
};


cancel_btn.onclick=function(){
	modal.style.display='none';
};
del_btn.onclick=function(){
	var id=this.getAttribute('del-src');
	var del_frame=document.getElementById(id);
	queue.removeChild(del_frame);
	var str=del_frame;
	photos=del_ele_in_array(photos,str);
	modal.style.display='none';
};

relay_photo.onclick=function(){
	relay_div.style.display='block';
};

relay_btn.onclick=function(){
	relay_div.style.display='none';
	count_time=parseFloat(Countdown.value);
	count_time=parseInt(count_time*1000);

	intetval_time=parseFloat(intetval.value);
	intetval_time=parseInt(intetval_time*1000);

	relay_camera(count_time,intetval_time);
	// console.log(count_time);
	// console.log(intetval_time);
};

play_btn.onclick=function(){
	appear_video.style.display='none';
	image_div.style.display='block';
	photo.style.display='none';
	continue_btn.style.display='block';
	var frame=parseInt(input_num.value);
	speed=parseInt(1000/frame)
	play();
};

continue_btn.onclick=function(){
	image_div.style.display='none';
	appear_video.style.display='block';
	photo.style.display='block';
	continue_btn.style.display='none';
};


$(document).ready(function(){
	translate.onclick=function(){
		upload_to_server_to_merge();
	};
});

function catch_image(){
    context.drawImage(video, 0, 0, 1280,720);
    var dataURL=canvas.toDataURL('image/jpeg'); //转换图片为dataURL
 	var img = document.createElement("img");
	img.setAttribute("src",dataURL);
	var id=Math.random();
	img.setAttribute("id",id);
	img.onclick=function(){
		var frame=document.getElementById("frame");
		frame.innerHTML='';
		var frame_img=document.createElement("img");
		frame_img.setAttribute('src',this.getAttribute('src'));
		frame.appendChild(frame_img);
		modal.style.display='block';
		
		del_btn.setAttribute('del-src',this.id);

		image_div.setAttribute('src',this.getAttribute('src'));
	}

	queue.appendChild(img);
	photos.push(img);
}
//预览播放
function play(speed){
	
	var time=time;
	var i=0;
	var len=photos.length;
	var file=photos[i];
	cicle_show_image(i,len,speed);

}

//循环展示图片
function cicle_show_image(i,len){
	if(i>=len){
		return;
	}
	var img=photos[i];
	// var j=i-1;
	// if(j<0){
	// 	j=0;
	// }
	// var pre_img=photos[j];
       
    //在页面上显示文件
    //now.style.background="url("+img.getAttribute('src')+")";
	image_div.setAttribute("src",img.getAttribute('src'));

    i++;
    setTimeout('cicle_show_image('+i+','+len+')',speed);
}
//从数组中删除帧图片数据
function del_ele_in_array(arr,ele){
	var arr=arr;
	var ele=ele;
	for(var i=0, len=arr.length; i<len; i++){
		if(arr[i]===ele){
			arr.splice(i,1); 
			
			return arr;
		}
	}
	return arr;
}


function relay_camera(count_time,intetval_time){
	var count_time=count_time;
	var intetval_time=intetval_time;
	if(count_time<=0){
		alert('完成！')
		//upload_to_server_to_merge();
		return;
	}
	catch_image();
	count_time-=intetval_time;
	setTimeout('relay_camera('+count_time+','+intetval_time+')',intetval_time);

}

function upload_to_server_to_merge(){
		var frame=parseInt(input_num.value);
		//var updatas=[];
		var frame={
			'frame_per_second':frame
		}
		for(var i=0, len=photos.length; i<len; i++){
			var tem_img=photos[i].getAttribute('src');
			var post_data = {
			    'image':tem_img   
			};
		    $.ajax({
		        url:'/animation/',
		        type:'POST',
		        data:post_data, 
		        async:true,    //或false,是否异步
		        dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
		        success:function(data){
		       		//console.log(data);


		        },
		        error:function(){
		            console.log("error");
		        }

		    });

		}
		var post_data = {
		    'frame_per_second':frame
		};
	    $.ajax({
	        url:'/animation/',
	        type:'POST',
	        data:frame, 
	        async:true,    //或false,是否异步
	        dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
	        success:function(data){
	       		
	       		window.location.href='http://127.0.0.1:8000/upload/';

	        },
	        error:function(){
	            console.log("error");
	        }

	    });
}
