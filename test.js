//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////
//////		测试代码
//////

var time = new Date().getTime();
var bitmap = new BitMap();
bitmap.create(300, 300, 0x000000);

for (var i = 0; i < 300; i++) bitmap.setPixel(i, i, 0xff0000);
for (var i = 0; i < 300; i++) bitmap.setPixel(300 - i, i, 0xff0000);

// 需要基于浏览器测试
var img = new Image();
img.src = bitmap.toBase64();
img.onload = function()
{
	time = new Date().getTime() - time;
	alert('Spend: ' + time + 'ms');
}
document.body.appendChild(img);
