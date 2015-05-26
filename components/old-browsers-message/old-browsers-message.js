
var smileChanges = 0;
var MAX_SMILE_CHANGES = 50;

function changeSmileClickListener(event) {
  smileChanges++;

  var eyes = ['O', 'o', '-', '>', '<'];

  var rand = function (min, max) {
    return Math.round((Math.random() * (max - min))) + min;
  };

  var getRandomEye = function() {
    return eyes[rand(0, (eyes.length - 1))];
  };


  var getRandomSmile = function() {
    if (smileChanges >= MAX_SMILE_CHANGES) {
      return '\\\\ (x_x) //';
    }

    return '{{ (' + getRandomEye() + '_' + getRandomEye() + ') }}';
  };

  var target = event.target || event.srcElement;
  target.innerHTML = getRandomSmile();
}

function attachSmileClickListener (smileNode) {
  if (smileNode.addEventListener) {
    smileNode.addEventListener('click', changeSmileClickListener);
  } else if (smileNode.attachEvent) {
    smileNode.addEventListener('onclick', changeSmileClickListener);
  }
}

module.exports = {
  attachSmileChanger: attachSmileClickListener
};

