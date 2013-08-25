jsBitmap
========

基于Javascript的bitmap处理，并且将位图输出为base64编码以便于浏览器进行显示。


API参考
========
一、Bitmap.create(width, height, bgcolor)
    创建一个width x height像素大小的位图，底色为bgcolor所代表的颜色。
    如：bitmap.create(10, 10, 0xff0000);   // 创建一个10 x 10像素的底色为红色的位图

二、Bitmap.toBase64()
    将位图输出为base64编码的带datauri头（data:image/bmp;base64,）的字符串，以便于在浏览器里显示。
    如：document.getElementById('img1').src = bitmap.toBase64();

三、Bitmap.fromBase64()
    自图像的BASE64编码中恢复位图数据，目前只支持24位色的BMP位图数据。
    如：bitmap.fromBase64('Qk06AAAAAAAAADYAAAAoAAAAAQAAAAEAAAABABgAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==');

四、Bitmap.setBitmapBytes(val, idx, length)
    修改bitmap位图数据的第idx位置起的length字节为val值。

五、Bitmap.getBitmapBytes(idx, length)
    获取bitmap位图数据的第idx位置起的length个字节的值，返回值为数组。

六、Bitmap.setHeaderValue(attribute, headerValue)
    设置attribute头属性的值为headerValue，attribute必须为BitMapFormat的成员属性，需要提供offset、length等属性值。
    如：bitmap.setHeaderValue(BitmapFormat.biWidth, 500);    // 设置位图的宽度为500像素值

七、Bitmap.getHeaderValue(attribute)
    获取位图attribute头属性的值，attribute必须为BitmapFormat的成员属性，需要提供offset、length等属性值，返回的是经过Endian转换后的实际整数值。

八、Bitmap.setPixel(x, y, color)
    设置位图的(x, y)位置的像素值为color。

九、Bitmap.getPixel(x, y)
    获取位图的(x, y)位置的RGB值，返回的内容为[ rr, gg, bb ]的数组内容
