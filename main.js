const DECISION_THRESHOLD = 80;
    let isAnimating = false;
    let pullDeltaX = 0 ;// distancia que la card se está arrastrando

    function startDrag (event) {
      if(isAnimating) return

      // get the first article element
      const actualCard = event.target.closest('article')
      if (!actualCard) return

      // get initial position of mouse or finger
      const startX = event.pageX ?? event.touches[0].pageX

      // listen the mouse and touch movemets
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onEnd)

      document.addEventListener('touchmove', onMove, { passive: true })
      document.addEventListener('touchend', onEnd, { passive: true })

      function onMove (event) {
      // current position of mouse or finger
      const currentX = event.pageX ?? event.touches[0].pageX
      //the distance between the initial and current position
      pullDeltaX = currentX - startX
      //no hay distancia recorrida
      if(pullDeltaX === 0) return

      isAnimating = true;
      // calculate the rotation of the card using the distance
      const deg = pullDeltaX / 10 ;
      // apply the transformation to the card
      actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
      // change the cursor to grabbing
      actualCard.style.cursor = 'grabbing'

      //change opacity of the choice info
      const opacity = Math.abs(pullDeltaX) / 100
      const isRight = pullDeltaX > 0;

      const choiceEl = isRight
      ? actualCard.querySelector('.choice.like')
      : actualCard.querySelector('.choice.nope')

      choiceEl.style.opacity = opacity

    }

    function onEnd (event) {
      // remove the event listeners
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onEnd)

      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)

       // saber si el usuario tomo una decisión
    const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

    if(decisionMade) {
      const goRight = pullDeltaX >= 0;
      const goLeft = !goRight

      //add class acording to the decision
      actualCard.classList.add(goRight ? 'go-right' : 'go-left')
      actualCard.addEventListener('transitionend', () => {
        actualCard.remove()
      }, { once: true })
    } else {
      actualCard.classList.add('reset');
      actualCard.classList.remove('go-right', 'go-left')
    }
    // reset the variables
    actualCard.addEventListener('transitionend', () => {
      actualCard.removeAttribute('style')
      actualCard.classList.remove('reset')

      pullDeltaX = 0;
      isAnimating = false;
    })
    }
  }

    document.addEventListener('mousedown', startDrag)
    document.addEventListener('touchstart', startDrag, { passive: true })