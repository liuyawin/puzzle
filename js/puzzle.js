function Puzzle(container, level, imageUrl) {
    if (!container) {
        return;
    }
    this.container = document.getElementById(container);
    if (!this.container) {
        return;
    }
    this.url = imageUrl;
    this.level = level || 0;
    this.images = [];
    this.dragSourceImage = null;
    this.dragTargetImage = null;
    this.lineLevel = [3, 4, 5];
    this.lineCount = this.lineLevel[this.level];
    this.imageWidth = this.container.offsetWidth / this.lineCount;
    this.imageHeight = this.container.offsetHeight / this.lineCount;
}

//根据当前位置显示图片
Puzzle.prototype.placeImage = function () {

    for (var i = 0; i < this.lineCount; i++) {
        for (var j = 0; j < this.lineCount; j++) {
            var image = this.images[i * this.lineCount + j];
            var position = image.nowPosition.split("_");
            var w = -position[0];
            var h = -position[1];
            image.style.backgroundPositionX = this.imageWidth * h + 'px';
            image.style.backgroundPositionY = this.imageHeight * w + 'px';
        }
    }
}

// 获取初始随机位置
Puzzle.prototype.getInitPositionArr = function () {
    var arr = [];
    for (var i = 0; i < this.lineCount; i++) {
        for (var j = 0; j < this.lineCount; j++) {
            arr.push(i + '_' + j);
        }
    }
    return arr.sort(function () {
        return 0.5 - Math.random()
    });
}

Puzzle.prototype.initPuzzle = function () {
    var initPostionArr = this.getInitPositionArr();
    var _this = this;
    for (var i = 0; i < this.lineCount; i++) {
        for (var j = 0; j < this.lineCount; j++) {
            var image = document.createElement('div');
            var w = this.container.offsetWidth / this.lineCount;
            var h = this.container.offsetHeight / this.lineCount;
            image.style.width = this.imageWidth + 'px';
            image.style.height = this.imageHeight + 'px';
            image.style.position = 'absolute';
            image.style.left = j * this.imageWidth + 'px';
            image.style.top = i * this.imageHeight + 'px';
            image.style.backgroundImage = 'url(' + this.url + ')';
            //image.style.border = '4px solid white';
            //image.style.borderRadius = "12px";
            image.targetPosition = i + '_' + j;//图片的目标位置
            image.nowPosition = initPostionArr[i * this.lineCount + j];//图片的当前位置

            _this.bindImageEvent(image);

            this.images.push(image);
            this.container.appendChild(image);
        }
    }
    this.placeImage();
}

Puzzle.prototype.bindImageEvent = function (image) {
    var _this = this;
    image.onclick = function (e) {
        if (_this.dragSourceImage == null) {
            var mask = document.createElement('div');
            mask.setAttribute('id', 'activeImage');
            mask.style.width = _this.imageWidth + 'px';
            mask.style.height = _this.imageHeight + 'px';
            mask.style.backgroundColor = 'rgba(0,0,0,0.5)';
            mask.style.borderRadius = "8px";
            this.appendChild(mask);
            _this.dragSourceImage = this;

        } else {
            //交换，删除class
            _this.dragSourceImage.removeChild(document.getElementById('activeImage'));
            _this.dragTargetImage = this;
            var tempPosition = _this.dragSourceImage.nowPosition;
            _this.dragSourceImage.nowPosition = _this.dragTargetImage.nowPosition;
            _this.dragTargetImage.nowPosition = tempPosition;
            _this.placeImage();
            _this.dragSourceImage = null;
            _this.dragTargetImage = null;
            var isDone = _this.getResult();
            if (isDone) {
                alert("成功！");
            }
        }
    }
}

Puzzle.prototype.getResult = function(){
    var result = true;
    for (var i = 0; i < this.images.length; i++) {
        var image = this.images[i];
        if (image.nowPosition != image.targetPosition) {
            result = false;
            break;
        }
    }
    return result;
}


