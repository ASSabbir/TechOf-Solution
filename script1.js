const puzzle = document.getElementById('puzzle'),
      pieces = puzzle.getElementsByClassName('piece'),
      gridColumns = 3,
      gridRows = 3,
      gridWidth = Math.round(puzzle.offsetWidth / gridColumns),
      gridHeight = gridWidth,
      overlapThreshold = '20%'
      buttonReset = document.getElementById('reset');

const swapOverlap = (el) => {
  for(let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (el.hitTest(piece, overlapThreshold)) {
      if (piece.classList.contains('empty')) {
        TweenLite.to(
          piece,
          0.2,
          {
            x: el.startX,
            y: el.startY,
          }
        );
        buttonReset.disabled = false;
      } else {
        TweenLite.to(
          el.target,
          0.2,
          {
            x: el.startX,
            y: el.startY,
          }
        );
      }
    }
  }
};

gsap.set(
  puzzle,
  {
    width: gridColumns * gridWidth,
    height: gridRows * gridHeight,
  }
);

for(let i = 0; i < pieces.length; i++) {
  const piece = pieces[i];
  const {positionLeft, positionTop} = pieces[i].dataset;
  
  gsap.set(
    piece,
    {
      width: gridWidth,
      height: gridHeight,
      x: gridWidth * (positionLeft - 1),
      y: gridWidth * (positionTop - 1),
    }
  );
  
  buttonReset.addEventListener('click', (e) => {
    buttonReset.disabled = true;
    TweenLite.to(
      piece,
      0.2,
      {
        x: gridWidth * (positionLeft - 1),
        y: gridWidth * (positionTop - 1),
      }
    );
    setTimeout(() => {
      draggablePieces();
    }, 300);
    e.preventDefault();
  });
};

const draggablePieces = () => {
  const offsetEmpty  = puzzle.querySelector('.empty').getBoundingClientRect();

  for(let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    const offsetPiece = piece.getBoundingClientRect();
    
    if (!piece.classList.contains('empty')) {
      if (
        Math.abs(Math.floor(offsetPiece.left) -  Math.floor(offsetEmpty.right)) <= 10 && offsetPiece.top === offsetEmpty.top ||
        Math.abs(Math.floor(offsetPiece.right) - Math.floor(offsetEmpty.left)) <= 10 && offsetPiece.top === offsetEmpty.top ||
        Math.abs(Math.floor(offsetPiece.top) - Math.floor(offsetEmpty.bottom)) <= 10 && offsetPiece.left === offsetEmpty.left ||
        Math.abs(Math.floor(offsetPiece.bottom) - Math.floor(offsetEmpty.top)) <= 10 && offsetPiece.left === offsetEmpty.left
      ) {
        piece.classList.add('draggable');
      } else {
        piece.classList.remove('draggable');
      }
    }
  }
}
draggablePieces();

Draggable.create(
  pieces,
  {
    bounds: puzzle,
    dragResistance: 1,
    edgeResistance: 0.9,
    throwResistance: 9999999,
    maxDuration: 0.2,
    minDuration: 0.1,
    overshootTolerance: 0,
    type: 'x,y',
    inertia: true,
    snap: {
      x: function(endValue) {
        return Math.round(endValue / gridWidth) * gridWidth;
      },
      y: function(endValue) {
        return Math.round(endValue / gridHeight) * gridHeight;
      }
    },
    onPressInit: function() {
      this.startX = gsap.getProperty(this, 'x');
      this.startY = gsap.getProperty(this, 'y');
      if (this.target.classList.contains('draggable')) {
        this.dragResistance = 0;
      } else {
        this.dragResistance = 1;
      }
    },
    onThrowComplete: function() {
      swapOverlap(this);
      setTimeout(() => {
        draggablePieces();
      }, 300);
    },
  }
);