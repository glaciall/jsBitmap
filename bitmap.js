var Base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
var CharIdxArray = { };
for (var i = 0; i < Base64Chars.length; i++) CharIdxArray[Base64Chars[i]] = i;

// 位图头信息结构
var BitMapFormat =
{
    bfType : 0x02,                  // 总是BM
    bfSize : 0x04,                  // BMP图像文件的大小
    bfReserved : 0x04,              // 总为0，本该是bfReserved1和bfReserved2
    bfOffBits : 0x04,               // BMP图像数据的地址

    biSize : 0x04,                  // 本结构的大小，根据不同的操作系统而不同，在Windows中，此字段的值总为28h字节=40字节
    biWidth : 0x04,                 // BMP图像的宽度，单位像素
    biHeight : 0x04,                // 总为0
    biPlanes : 0x02,                // 总为0
    biBitCount : 0x02,              // BMP图像的色深，即一个像素用多少位表示，常见有1、4、8、16、24和32，分别对应单色、16色、256色、16位高彩色、24位真彩色和32位增强型真彩色
    biCompression : 0x04,           // 压缩方式，0表示不压缩，1表示RLE8压缩，2表示RLE4压缩，3表示每个像素值由指定的掩码决定
    biSizeImage : 0x04,             // BMP图像数据大小，必须是4的倍数，图像数据大小不是4的倍数时用0填充补足
    biXPelsPerMeter : 0x04,         // 水平分辨率，单位像素/m
    biYPelsPerMeter : 0x04,         // 垂直分辨率，单位像素/m
    biClrUsed : 0x04,               // BMP图像使用的颜色，0表示使用全部颜色，对于256色位图来说，此值为100h=256
    biClrImportant : 0x04           // 重要的颜色数，此值为0时所有颜色都重要，对于使用调色板的BMP图像来说，当显卡不能够显示所有颜色时，此值将辅助驱动程序显示颜色
};

// 处理一下BitmapFormat，给加上offset和length属性
function ReBuildBitMapFormat()
{
    var i = 0x00;
    var attr;
    for (attr in BitMapFormat)
    {
        var val = { offset : i, length : BitMapFormat[attr] };
        i += val.length;
        BitMapFormat[attr] = val;
    }
}

ReBuildBitMapFormat();

function BitMap()
{
    this.data = null;

    this.width = 0x00;
    this.height = 0x00;
    var datauri = 'data:image/bmp;base64,'.split('');

    var _length_of_data = 0x00;
    var _length_of_header = 0x36;
    var _length_to_fit = 0x00;

    this.create = function(width, height, bgcolor)
    {
        this.width = width;
        this.height = height;

        // 计算数据区总字节数=(width * byte_per_pixel) * height + height * _length_to_fit
        var biSizeImage = parseInt((width * 24 + 31) / 32) * 4 * height;
        // 计算每行补了几个字节
        _length_to_fit = biSizeImage / height - (width * 3);

        var len = Math.ceil((_length_of_header + biSizeImage) / 0x04);
        this.data = new Array(len);
        for (var i = 0x00; i < len; i++) this.data[i] = 0x00;

        this.setHeaderValue(BitMapFormat.bfType, 0x4d42);
        this.setHeaderValue(BitMapFormat.bfSize, biSizeImage + 0x36);
        this.setHeaderValue(BitMapFormat.bfReserved, 0x00);
        this.setHeaderValue(BitMapFormat.bfOffBits, 0x36);
        this.setHeaderValue(BitMapFormat.biSize, 0x28);
        this.setHeaderValue(BitMapFormat.biWidth, width);
        this.setHeaderValue(BitMapFormat.biHeight, height);
        this.setHeaderValue(BitMapFormat.biPlanes, 0x01);
        this.setHeaderValue(BitMapFormat.biBitCount, 0x18);
        this.setHeaderValue(BitMapFormat.biCompression, 0x00);
        this.setHeaderValue(BitMapFormat.biSizeImage, biSizeImage);
        this.setHeaderValue(BitMapFormat.biXPelsPerMeter, 0x00);
        this.setHeaderValue(BitMapFormat.biYPelsPerMeter, 0x00);
        this.setHeaderValue(BitMapFormat.biClrUsed, 0x00);
        this.setHeaderValue(BitMapFormat.biClrImportant, 0x00);

        _length_of_data = biSizeImage;

        // 如果初始的背景色为黑色，则不需要为画布染色
        if (bgcolor == 0x000000) return;

        for (var y = 0; y < height; y++)
            for (var x = 0; x < width; x++) this.setPixel(x, y, bgcolor);
    }

    this.setBitmapBytes = function(val, idx, length)
    {
        for (var i = 0x00; i < length; i++)
        {
            var k = idx + i;
            var aIdx = parseInt(k / 0x04);
            var bits = (4 - (k % 0x04) - 0x01) * 0x08;
            var hex = (val >> (0x08 * i)) & 0xff;
            this.data[aIdx] &= ~(0xff << bits);
            this.data[aIdx] |= hex << bits;
        }
    }

    this.getBitmapBytes = function(idx, length)
    {
        var byts = [];
        for (var i = 0x00; i < length; i++)
        {
            var k = idx + i;
            var aIdx = parseInt(k / 0x04);
            var bits = (4 - (k % 0x04) - 0x01) * 0x08;
            var hex = (this.data[aIdx] >> bits) & 0xff;
            byts[byts.length] = hex;
        }
        return byts;
    }

    // 设置BMP头信息
    this.setHeaderValue = function(attr, headerValue)
    {
        this.setBitmapBytes(headerValue, attr.offset, attr.length);
    }

    // 获取BMP头信息
    this.getHeaderValue = function(attr)
    {
        var val = 0x00;
        var byts = this.getBitmapBytes(attr.offset, attr.length);
        for (var i = 0; i < byts.length; i++)
        {
            val |= byts[i] << (i * 8);
        }
        return val;
    }

    // 设置(x, y)坐标上的像素值
    this.setPixel = function(x, y, color)
    {
        y = this.height - y -1;
        var offset = (this.width * 3 * y + _length_to_fit * y + x * 3) + _length_of_header;
        this.setBitmapBytes(color, offset, 0x03);
    }

    // 获取(X, Y)位置的RGB值
    this.getPixel = function(x, y)
    {
        y = this.height - y - 1;
        var offset = (this.width * 3 * y + _length_to_fit * y + x * 3) + _length_of_header;
        return this.getBitmapBytes(offset, 3).reverse();
    }

    // 获取当前bitmap的datauri串，用于显示或发送到服务器端
    this.toBase64 = function()
    {
        var len = _length_of_data + _length_of_header;
        var l = Math.ceil(len / 3) * 4;
        var last = 0x00;
        var bin = 0x00;
        for (var i = 0; i < l; i++)
        {
            var idx = i - parseInt(i / 4);
            var m = i % 4;
            var bits = (m + 1) * 2;
            bin = 0;
            if (m != 3) bin = (this.data[parseInt(idx / 4)] >> ((3 - (idx % 4)) * 8)) & 0xff;

            var chr = (bin >> bits) | ((last & (0xff >> (10 - bits))) << 8 - bits);
            datauri[i + 22] = Base64Chars[chr];
            last = bin;
        }
        for (var i = Math.ceil(len / 3 * 4); i < l; i++) datauri[i + 22] = '=';

        return datauri.join('');
    }

    // 根据给定的BASE64编码的text参数来重建bitmap
    this.fromBase64 = function(text)
    {
        var k = 0;
        var bin = 0x00;
        var last = 0x00;
        this.data = new Array(text.length / 4);
        for (var i = 0, l = text.length; i < l; i++)
        {
            bin = CharIdxArray[text.charAt(i)];
            var f = i % 4;
            var m = (f + 1) * 2;
            var x = 8 - m;
            if (f == 0)
            {
                last = bin;
                continue;
            }
            if (bin == null) continue;
            var chr = ((last & (0x3f >> (m - 4))) << (m - 2)) | ((bin & (0x3f >> x << x)) >> x);
            this.data[parseInt(k / 4)] |= chr << ((3 - k % 4) * 8);
            k++;

            last = bin;
        }

        _length_of_data = k - _length_of_header;
        this.width = this.getHeaderValue(BitMapFormat.biWidth);
        this.height = this.getHeaderValue(BitMapFormat.biHeight);
    }
}

module.exports = {
    BitMap,
};
