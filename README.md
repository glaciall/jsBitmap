jsBitmap
========

基于Javascript的bitmap处理，并且将位图输出为base64编码以便于浏览器进行显示。

Usage
========
```
import {
    BitMap,
} from 'jsBitmap';

export class YourReactClass extends React.PureComponent {
    constructor(props, ctx) {
        super(props, ctx);
        this.bmp = new BitMap();
        this.bmp.fromBase64(props.base64Bmp.replace(/^data:image\/bmp;base64,/, ''));
    }
}
```

API参考
========
一、Bitmap.create(width, height, bgcolor)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;创建一个width x height像素大小的位图，底色为bgcolor所代表的颜色。<br/>
&nbsp;&nbsp;&nbsp;&nbsp;如：bitmap.create(10, 10, 0xff0000);   // 创建一个10 x 10像素的底色为红色的位图<br/><br/>

二、Bitmap.toBase64()<br/>
&nbsp;&nbsp;&nbsp;&nbsp;将位图输出为base64编码的带datauri头（data:image/bmp;base64,）的字符串，以便于在浏览器里显示。<br/>
&nbsp;&nbsp;&nbsp;&nbsp;如：document.getElementById('img1').src = bitmap.toBase64();<br/><br/>

三、Bitmap.fromBase64()<br/>
&nbsp;&nbsp;&nbsp;&nbsp;自图像的BASE64编码中恢复位图数据，目前只支持24位色的BMP位图数据。<br/>
&nbsp;&nbsp;&nbsp;&nbsp;如：bitmap.fromBase64('Qk06AAAAAAAAADYAAAAoAAAAAQAAAAEAAAABABgAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==');<br/><br/>

四、Bitmap.setBitmapBytes(val, idx, length)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;修改bitmap位图数据的第idx位置起的length字节为val值。<br/><br/>

五、Bitmap.getBitmapBytes(idx, length)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;获取bitmap位图数据的第idx位置起的length个字节的值，返回值为数组。<br/><br/>

六、Bitmap.setHeaderValue(attribute, headerValue)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;设置attribute头属性的值为headerValue，attribute必须为BitMapFormat的成员属性，需要提供offset、length等属性值。<br/>
&nbsp;&nbsp;&nbsp;&nbsp;如：bitmap.setHeaderValue(BitmapFormat.biWidth, 500);    // 设置位图的宽度为500像素值<br/><br/>

七、Bitmap.getHeaderValue(attribute)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;获取位图attribute头属性的值，attribute必须为BitmapFormat的成员属性，需要提供offset、length等属性值，返回的是经过Endian转换后的实际整数值。<br/><br/>

八、Bitmap.setPixel(x, y, color)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;设置位图的(x, y)位置的像素值为color。<br/><br/>

九、Bitmap.getPixel(x, y)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;获取位图的(x, y)位置的RGB值，返回的内容为[ rr, gg, bb ]的数组内容<br/>
